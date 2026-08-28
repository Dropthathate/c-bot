import { Router } from "express";
import { z } from "zod";
import { assertCsrf, requireAuthenticatedUser, type AuthenticatedRequest } from "../auth.js";
import { database } from "../db/pool.js";

const allowedLabels = ["Documentation review", "Documentation follow-up", "Case administration"] as const;
const createBlockSchema = z.object({
  startAt: z.string().datetime({ offset: true }),
  endAt: z.string().datetime({ offset: true }),
  label: z.enum(allowedLabels)
}).strict().superRefine((value, context) => {
  if (new Date(value.endAt) <= new Date(value.startAt)) context.addIssue({ code: z.ZodIssueCode.custom, message: "endAt must be after startAt", path: ["endAt"] });
});

export const calendarRouter = Router();

calendarRouter.get("/blocks", requireAuthenticatedUser, async (request: AuthenticatedRequest, response, next) => {
  try {
    const userId = request.auth?.sub;
    if (!userId) return response.status(401).json({ error: { code: "UNAUTHENTICATED", message: "A valid user session is required." } });
    const result = await database.query("SELECT id, label, starts_at AS \"startAt\", ends_at AS \"endAt\" FROM calendar_time_blocks WHERE clinician_id = $1 AND ends_at >= now() - interval '1 day' ORDER BY starts_at ASC LIMIT 200", [userId]);
    return response.status(200).json({ blocks: result.rows });
  } catch (error) { return next(error); }
});

calendarRouter.post("/blocks", requireAuthenticatedUser, assertCsrf, async (request: AuthenticatedRequest, response, next) => {
  const client = await database.connect();
  try {
    const userId = request.auth?.sub;
    if (!userId) return response.status(401).json({ error: { code: "UNAUTHENTICATED", message: "A valid user session is required." } });
    const input = createBlockSchema.parse(request.body);
    await client.query("BEGIN");
    const created = await client.query(
      "INSERT INTO calendar_time_blocks (clinician_id, label, starts_at, ends_at) VALUES ($1, $2, $3, $4) RETURNING id, label, starts_at AS \"startAt\", ends_at AS \"endAt\"",
      [userId, input.label, input.startAt, input.endAt]
    );
    await client.query(
      "INSERT INTO clinical_audit_events (clinician_id, event_type, operation) VALUES ($1, 'calendar_block_created', 'calendar')",
      [userId]
    );
    await client.query("COMMIT");
    return response.status(201).json({ block: created.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    return next(error);
  } finally { client.release(); }
});
