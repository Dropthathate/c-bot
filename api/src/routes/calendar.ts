import { Router } from "express";
import { z } from "zod";
import { assertCsrf, requireAuthenticatedUser, type AuthenticatedRequest } from "../auth.js";
import { database } from "../db/pool.js";
import { recordAuditEvent } from "../services/audit.js";

const createBlock = z.object({
  label: z.string().trim().min(1).max(80),
  startsAt: z.string().datetime({ offset: true }),
  endsAt: z.string().datetime({ offset: true })
}).superRefine((value, context) => {
  if (new Date(value.endsAt).valueOf() <= new Date(value.startsAt).valueOf()) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["endsAt"], message: "The end time must be after the start time." });
  }
});

function userId(request: AuthenticatedRequest) {
  const subject = request.auth?.sub;
  if (!subject) throw new Error("Authenticated session was missing a subject.");
  return subject;
}

export const calendarRouter = Router();
calendarRouter.use(requireAuthenticatedUser, assertCsrf);

calendarRouter.get("/blocks", async (request: AuthenticatedRequest, response, next) => {
  try {
    const range = request.query.range;
    if (range !== "today") return response.status(400).json({ error: { code: "INVALID_RANGE", message: "Only the today range is supported." } });
    const result = await database.query(
      `SELECT id, label, starts_at AS "startsAt", ends_at AS "endsAt"
       FROM calendar_time_blocks
       WHERE clinician_id = $1
         AND starts_at >= date_trunc('day', now() AT TIME ZONE 'UTC')
         AND starts_at < date_trunc('day', now() AT TIME ZONE 'UTC') + interval '1 day'
       ORDER BY starts_at ASC`,
      [userId(request)]
    );
    return response.status(200).json({ blocks: result.rows });
  } catch (error) { return next(error); }
});

calendarRouter.post("/blocks", async (request: AuthenticatedRequest, response, next) => {
  const client = await database.connect();
  try {
    const block = createBlock.parse(request.body);
    const clinicianId = userId(request);
    await client.query("BEGIN");
    const result = await client.query(
      `INSERT INTO calendar_time_blocks (clinician_id, label, starts_at, ends_at)
       VALUES ($1, $2, $3, $4)
       RETURNING id, label, starts_at AS "startsAt", ends_at AS "endsAt"`,
      [clinicianId, block.label, block.startsAt, block.endsAt]
    );
    await recordAuditEvent({
      clinicianId,
      eventType: "calendar.time_block_created",
      metadata: { durationMinutes: Math.round((new Date(block.endsAt).valueOf() - new Date(block.startsAt).valueOf()) / 60_000) }
    }, client);
    await client.query("COMMIT");
    return response.status(201).json({ block: result.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    return next(error);
  } finally {
    client.release();
  }
});
