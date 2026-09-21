import assert from "node:assert/strict";
import test from "node:test";
import { buildIntakeSummary, createIntakeToken, hashIntakeToken, intakePayloadSchema } from "../src/services/intake-store.js";

const payload = intakePayloadSchema.parse({
  mapDots: [{ side: "back", x: 42.5, y: 31.2, mode: "primary", n: 1 }],
  qualities: ["tight"],
  duration: "3 months",
  coincide: [],
  funcScores: { sit: 4 },
  stress: 5,
  sleep: 6,
  posture: ["forward-head"],
  notes: "Synthetic practice intake only.",
  pressure: "medium",
  avoidAreas: "none",
  goals: ["mobility"]
});

test("server-generated intake tokens use the displayed format", () => {
  const token = createIntakeToken();
  assert.match(token, /^ss-[A-Z0-9]{6}$/);
});

test("intake tokens are stored as deterministic SHA-256 hashes", () => {
  assert.equal(hashIntakeToken("ss-ABC234").length, 64);
  assert.equal(hashIntakeToken("ss-ABC234"), hashIntakeToken("ss-ABC234"));
  assert.notEqual(hashIntakeToken("ss-ABC234"), hashIntakeToken("ss-ABC235"));
});

test("intake payload rejects unknown fields and summaries preserve front/back mapping", () => {
  assert.throws(() => intakePayloadSchema.parse({ ...payload, token: "ss-ABC234" }));
  const summary = buildIntakeSummary(payload, "ss-ABC234");
  assert.match(summary, /PRIMARY BODY AREAS: back \(42\.5%,31\.2%\)/);
  assert.match(summary, /TOKEN: ss-ABC234/);
});
