import assert from "node:assert/strict";
import test from "node:test";
import { authenticateWebSocketRequest, hasValidCsrfToken, signedCsrfToken } from "../src/auth.js";
import { parseStrictSoapResponse, strictSoapRequest } from "../src/services/bedrock.js";
import { clinicalDocumentationSystemPrompt, normalizeSoapNote } from "../src/services/clinical-prompt.js";

const validNote = {
  subjective: "Reports synthetic shoulder discomfort after a stated activity.",
  objective: "No objective finding was stated; clinician verification is required.",
  assessment: "Clinician assessment is required.",
  plan: "Clinician completion is required."
};

test("strict SOAP normalization accepts exactly the required four fields", () => {
  assert.deepEqual(normalizeSoapNote(validNote), validNote);
  assert.throws(() => normalizeSoapNote({ ...validNote, extra: "must fail" }));
  assert.throws(() => normalizeSoapNote({ subjective: "only one field" }));
});

test("forced SOAP request exposes only the declared strict tool contract", () => {
  const request = strictSoapRequest("Synthetic final transcript only.");
  assert.equal(request.tool_choice.type, "tool");
  assert.equal(request.tool_choice.name, "emit_soap_note");
  assert.equal(request.tools.length, 1);
  assert.equal(request.tools[0].strict, true);
  assert.deepEqual(request.tools[0].input_schema.required, ["subjective", "objective", "assessment", "plan"]);
  assert.equal(request.tools[0].input_schema.additionalProperties, false);
  assert.match(clinicalDocumentationSystemPrompt, /fascia/i);
  assert.match(clinicalDocumentationSystemPrompt, /subscapularis/i);
  assert.match(clinicalDocumentationSystemPrompt, /not explicitly stated/i);
});

test("strict SOAP parser accepts one exact tool call and rejects prose or extra tool blocks", () => {
  const validResponse = { stop_reason: "tool_use", content: [{ type: "tool_use", name: "emit_soap_note", input: validNote }] };
  assert.deepEqual(parseStrictSoapResponse(validResponse), validNote);
  assert.throws(() => parseStrictSoapResponse({ stop_reason: "end_turn", content: [{ type: "text", text: "```json" }] }));
  assert.throws(() => parseStrictSoapResponse({ stop_reason: "tool_use", content: [validResponse.content[0], { type: "text", text: "not allowed" }] }));
  assert.throws(() => parseStrictSoapResponse({ stop_reason: "tool_use", content: [{ type: "tool_use", name: "other_tool", input: validNote }] }));
});

test("CSRF proof is bound to the cookie session and rejects a different session", () => {
  const sessionOne = "synthetic-session-one";
  const sessionTwo = "synthetic-session-two";
  const csrf = signedCsrfToken(sessionOne, "a".repeat(43));
  assert.equal(hasValidCsrfToken(csrf, sessionOne), true);
  assert.equal(hasValidCsrfToken(csrf, sessionTwo), false);
  assert.equal(hasValidCsrfToken(`${csrf}.unexpected`, sessionOne), false);
});

test("WebSocket authentication rejects an untrusted Origin before remote token validation", async () => {
  const request = { headers: { origin: "https://untrusted.example", cookie: "somasync_session=synthetic" } } as never;
  await assert.rejects(() => authenticateWebSocketRequest(request), /ORIGIN_NOT_ALLOWED/);
});
