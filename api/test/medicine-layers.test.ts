import assert from "node:assert/strict";
import test from "node:test";
import { separateMedicineLayers } from "../src/services/medicine-layers.js";

test("separates Eastern concepts from the Western SOAP layer", () => {
  const review = separateMedicineLayers("Client reports qi stagnation; therapist used acupressure at GB20 for neck tension.");
  assert.equal(review.detected, true);
  assert.equal(review.eastern_context.length, 4);
  assert.equal(review.eastern_context[0]?.category, "energetic_framework");
  assert.match(review.western_soap_scope, /Western SOAP documentation only/);
  assert.match(review.separation_notice, /separated/);
});

test("does not add Eastern context when the transcript has none", () => {
  const review = separateMedicineLayers("Client reports right shoulder pain with reaching; therapist observed limited elevation.");
  assert.equal(review.detected, false);
  assert.equal(review.eastern_context.length, 0);
});
