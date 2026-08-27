import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(new URL("../..", import.meta.url).pathname);
const read = (path) => readFileSync(resolve(root, path), "utf8");
const requireText = (path, pattern, description) => {
  const content = read(path);
  assert.match(content, pattern, `${description}: ${path}`);
};

assert.equal(existsSync(resolve(root, "api/src/routes/voice.ts")), false, "Legacy HTTP voice upload route must be absent");
assert.equal(existsSync(resolve(root, "api/src/services/deepgram.ts")), false, "Legacy one-shot STT helper must be absent");

requireText("api/src/realtime.ts", /url\.pathname !== "\/api\/v1\/realtime\/transcription"/, "Realtime gateway endpoint must be explicit");
requireText("api/src/realtime.ts", /perMessageDeflate: false/, "Realtime gateway must disable compression");
requireText("api/src/realtime.ts", /maxPayload: config\.WS_MAX_PAYLOAD_BYTES/, "Realtime gateway must enforce payload limits");
requireText("api/src/realtime.ts", /authenticateWebSocketRequest/, "Realtime gateway must validate authenticated upgrades");
requireText("api/src/realtime.ts", /WS_MAX_CONNECTIONS_PER_USER/, "Realtime gateway must limit connections per user");
requireText("api/src/realtime.ts", /WS_MAX_AUDIO_BYTES_PER_SECOND/, "Realtime gateway must limit audio throughput");
requireText("api/src/realtime.ts", /WS_SESSION_REVALIDATE_SECONDS/, "Realtime gateway must revalidate long sessions");
requireText("api/src/realtime.ts", /recordAuditEvent/, "Realtime gateway must write workflow audit events");

requireText("api/src/auth.ts", /CSRF_HMAC_SECRET/, "Session middleware must use a server-side CSRF HMAC key");
requireText("api/src/auth.ts", /timingSafeEqual/, "Session middleware must compare CSRF proofs in constant time");
requireText("api/src/auth.ts", /sec-websocket-protocol/, "WebSocket sessions must receive a signed handshake proof");
requireText("api/src/auth.ts", /ALLOW_BEARER_API_TOKENS/, "Bearer-token API access must be explicit and opt-in");
requireText("api/src/app.ts", /credentials: true/, "Credentialed cross-origin requests must be explicit");
requireText("api/src/app.ts", /assertTrustedBrowserRequest/, "Sensitive browser routes must validate request context");

requireText("api/src/services/deepgram-live.ts", /type: "KeepAlive"/, "STT gateway must send text keepalives during silence");
requireText("api/src/services/deepgram-live.ts", /type: "CloseStream"/, "STT gateway must close upstream streams explicitly");
requireText("api/src/services/deepgram-live.ts", /no_store/, "STT gateway must request no-store handling");
requireText("api/src/services/bedrock.ts", /tool_choice: \{ type: "tool", name: "emit_soap_note" \}/, "SOAP generator must force the structured tool");
requireText("api/src/services/bedrock.ts", /content\.length !== 1/, "SOAP generator must reject extra model content");
requireText("api/src/services/bedrock.ts", /\)\.strict\(\)/, "SOAP output schema must reject undeclared fields");

requireText("c-bot/public/clinical-workspace/assets/app.js", /silentGain\.gain\.value = 0/, "Workspace must never route microphone sound to speakers");
requireText("c-bot/public/clinical-workspace/assets/app.js", /audioBufferLimit/, "Workspace must bound in-memory reconnect audio");
requireText("c-bot/public/clinical-workspace/assets/app.js", /credentials: "include"/, "Workspace must use cookie-backed API calls");
requireText("c-bot/public/clinical-workspace/assets/app.js", /Object\.keys\(note\)\.length === 4/, "Workspace must reject non-SOAP payloads");
requireText("c-bot/calendar/assets/calendar.js", /X-SomaSync-CSRF/, "Calendar writes must provide the CSRF proof");
requireText("api/src/routes/calendar.ts", /recordAuditEvent/, "Calendar writes must create an audit event");

console.log("gold-standard static safeguards passed");
