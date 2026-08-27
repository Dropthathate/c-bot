import { z } from "zod";
import type { Pool, PoolClient } from "pg";
import { database } from "../db/pool.js";

const eventSchema = z.object({
  clinicianId: z.string().uuid(),
  eventType: z.string().regex(/^[a-z0-9_.-]{3,80}$/),
  sessionReference: z.string().trim().min(1).max(64).optional(),
  metadata: z.record(z.union([z.string().max(128), z.number().finite(), z.boolean()])).default({})
}).strict();

export type AuditEvent = z.infer<typeof eventSchema>;

/**
 * Stores operational evidence only. Callers must never put transcript text, note text,
 * audio, patient identifiers, auth headers, cookies, tokens, or free-form error text here.
 */
export async function recordAuditEvent(eventInput: AuditEvent, executor: Pick<Pool | PoolClient, "query"> = database) {
  const event = eventSchema.parse(eventInput);
  await executor.query(
    `INSERT INTO clinical_audit_events (clinician_id, event_type, session_reference, metadata)
     VALUES ($1, $2, $3, $4::jsonb)`,
    [event.clinicianId, event.eventType, event.sessionReference ?? null, JSON.stringify(event.metadata)]
  );
}
