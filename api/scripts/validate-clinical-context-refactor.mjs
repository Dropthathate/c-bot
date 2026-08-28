import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const required = (source, needle, label) => {
  if (!source.includes(needle)) throw new Error(`Missing safeguard: ${label}`);
};
const forbidden = (source, needle, label) => {
  if (source.includes(needle)) throw new Error(`Forbidden legacy behavior: ${label}`);
};

const manifest = read("api/package.json");
const app = read("api/src/app.ts");
const realtime = read("api/src/realtime.ts");
const live = read("api/src/services/deepgram-live.ts");
const prompt = read("api/src/services/clinical-prompt.ts");
const bedrock = read("api/src/services/bedrock.ts");
const workspace = read("c-bot/public/clinical-workspace/assets/workspace.js");
const worklet = read("c-bot/public/clinical-workspace/assets/audio-worklet.js");
const access = read("c-bot/public/clinical-workspace/access/access.js");
const calendar = read("c-bot/calendar/assets/calendar.js");

forbidden(manifest, '"multer"', "multipart upload dependency");
forbidden(app, '"/api/v1/voice"', "HTTP voice route");
forbidden(workspace, "MediaRecorder", "browser recording/upload flow");
forbidden(access, "supabase", "browser identity SDK use in clinical access route");
forbidden(access, "access_token", "browser-visible access token in clinical access route");
required(realtime, "WebSocketServer", "persistent WebSocket server");
required(realtime, "perMessageDeflate: false", "WebSocket compression disabled");
required(realtime, "authenticateWebSocketRequest", "authenticated upgrade");
required(realtime, "WS_MAX_MESSAGES_PER_MINUTE", "per-session message rate limit");
required(realtime, "WS_MAX_CONNECTIONS_PER_USER", "per-user connection limit");
required(realtime, "WS_MAX_SESSION_SECONDS", "bounded session duration");
required(live, "wss://api.deepgram.com", "WSS-only transcription provider");
required(live, "no_store", "no-store upstream transcription request");
required(live, "KeepAlive", "silence keepalive");
required(live, "CloseStream", "upstream stream close");
required(prompt, "fast ya", "phonetic terminology normalization guidance");
required(prompt, "subscapularis", "clinical terminology guidance");
required(prompt, "additionalProperties: false", "strict four-field SOAP schema");
required(bedrock, "strict: true", "provider strict tool definition");
required(bedrock, "tool_choice: { type: \"tool\"", "forced SOAP tool use");
required(workspace, "silentGain.gain.value = 0", "microphone not routed to speakers");
required(workspace, "reconnectBufferSeconds", "bounded in-memory reconnect buffer");
required(workspace, "Object.keys(note).length !== 4", "client exact SOAP field rejection");
required(access, '"/auth/session/password"', "server-side clinical sign-in exchange");
required(access, 'credentials: "include"', "cookie-backed clinical sign-in");
required(calendar, 'credentials: "include"', "calendar cookie-backed requests");
required(calendar, '"X-SomaSync-CSRF"', "calendar CSRF header");
required(worklet, "postMessage(pcm.buffer", "PCM AudioWorklet output");
console.log("clinical-context refactor static safeguards passed");
