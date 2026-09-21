import crypto from "node:crypto";
import { z } from "zod";
import { database } from "../db/pool.js";

export const intakeTokenSchema = z.string().trim().regex(/^ss-[A-Z0-9]{6}$/, "The intake token is not valid.");

const tokenAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function createIntakeToken() {
  const bytes = crypto.randomBytes(6);
  const suffix = Array.from(bytes, (byte) => tokenAlphabet[byte % tokenAlphabet.length]).join("");
  return `ss-${suffix}`;
}

const mapDotSchema = z.object({
  side: z.enum(["front", "back"]),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  mode: z.enum(["primary", "secondary", "radiation"]),
  n: z.number().int().positive().max(100)
}).strict();

export const intakePayloadSchema = z.object({
  mapDots: z.array(mapDotSchema).max(100).default([]),
  qualities: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
  duration: z.string().trim().min(1).max(80).default("not stated"),
  coincide: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
  funcScores: z.record(z.number().int().min(0).max(5)).default({}),
  stress: z.number().int().min(0).max(10).default(0),
  sleep: z.number().int().min(0).max(10).default(0),
  posture: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
  notes: z.string().trim().max(4000).default(""),
  pressure: z.string().trim().max(80).default(""),
  avoidAreas: z.string().trim().max(2000).default(""),
  goals: z.array(z.string().trim().min(1).max(80)).max(20).default([])
}).strict();

export type IntakePayload = z.infer<typeof intakePayloadSchema>;

export function hashIntakeToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function buildIntakeSummary(payload: IntakePayload, token: string) {
  const primary = payload.mapDots
    .filter((dot) => dot.mode === "primary")
    .map((dot) => `${dot.side} (${dot.x}%,${dot.y}%)`)
    .join(", ");
  const high = Object.entries(payload.funcScores)
    .filter(([, value]) => value >= 3)
    .map(([key, value]) => `${key}:${value}/5`)
    .join(", ");
  return [
    `TOKEN: ${token}`,
    `PRIMARY BODY AREAS: ${primary || "none marked"}`,
    `SECONDARY: ${payload.mapDots.filter((dot) => dot.mode === "secondary").length} markers`,
    `RADIATION: ${payload.mapDots.filter((dot) => dot.mode === "radiation").length} markers`,
    `QUALITIES: ${payload.qualities.join(", ") || "none"}`,
    `DURATION: ${payload.duration}`,
    `COINCIDE: ${payload.coincide.join(", ") || "none"}`,
    `HIGH-IMPACT ACTIVITIES: ${high || "none"}`,
    `STRESS: ${payload.stress}/10`,
    `SLEEP: ${payload.sleep}/10`,
    `POSTURE: ${payload.posture.join(", ") || "none"}`,
    `PRESSURE PREF: ${payload.pressure || "not set"}`,
    `AVOID: ${payload.avoidAreas || "none"}`,
    `GOALS: ${payload.goals.join(", ") || "none"}`,
    `NOTES: ${payload.notes || "none"}`
  ].join("\n");
}

export async function saveIntakeSubmission(token: string, payload: IntakePayload) {
  await database.query(
    `INSERT INTO intake_submissions (token_hash, payload)
     VALUES ($1, $2::jsonb)
     ON CONFLICT (token_hash) DO UPDATE SET payload = EXCLUDED.payload, status = 'active', expires_at = now() + interval '7 days', accessed_at = NULL`,
    [hashIntakeToken(token), JSON.stringify(payload)]
  );
}

export async function findActiveIntake(token: string) {
  const result = await database.query<{ payload: IntakePayload }>(
    `UPDATE intake_submissions
        SET accessed_at = now()
      WHERE token_hash = $1
        AND status = 'active'
        AND expires_at > now()
      RETURNING payload`,
    [hashIntakeToken(token)]
  );
  return result.rows[0]?.payload;
}
