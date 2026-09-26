import assert from "node:assert/strict";
import test from "node:test";
import { reviewIntakeText, reviewSessionTranscript } from "../src/services/clinical-review.js";

test("intake review flags explicit red-flag language without calling it a diagnosis", () => {
  const result = reviewIntakeText("Synthetic client reports chest pain and shortness of breath.");
  assert.equal(result.safetyReview.status, "urgent_follow_up_review");
  assert.equal(result.safetyReview.flags[0]?.category, "red_flag");
  assert.match(result.safetyReview.disclaimer, /not a diagnosis/);
});

test("intake review offers basic-to-professional terminology suggestions", () => {
  const result = reviewIntakeText("Tight muscle near the shoulder blade and upper trap.");
  assert.deepEqual(result.terminologyReview.map((item) => item.suggested_term), ["upper trapezius", "scapular / periscapular region", "reported or observed muscle hypertonicity"]);
});

test("session review recognizes techniques as therapist verification prompts", () => {
  const result = reviewSessionTranscript("Used ischemic compression to a taut band and reassessed range of motion.");
  assert.equal(result.recognized_techniques.length, 3);
  assert.match(result.safety_note, /therapist verification/);
});
