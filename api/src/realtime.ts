import type http from "node:http";
import type { Duplex } from "node:stream";
import { URL } from "node:url";
import { WebSocketServer, WebSocket, type RawData } from "ws";
import { z } from "zod";
import { authenticateWebSocketRequest, verifySessionToken } from "./auth.js";
import { config } from "./config.js";
import { DeepgramLiveStream } from "./services/deepgram-live.js";
import { generateSoapNote } from "./services/bedrock.js";

const startMessage = z.object({
  type: z.literal("start"),
  protocolVersion: z.literal("1"),
  encoding: z.literal("linear16"),
  sampleRate: z.literal(16000),
  channels: z.literal(1),
  streamId: z.string().uuid()
}).strict();
const controlMessage = z.discriminatedUnion("type", [
  startMessage,
  z.object({ type: z.literal("stop") }).strict(),
  z.object({ type: z.literal("generate_soap") }).strict()
]);

type Session = {
  userId: string;
  sessionToken: string;
  stream?: DeepgramLiveStream;
  finalTranscript: string[];
  finalTranscriptBytes: number;
  isStreaming: boolean;
  isAlive: boolean;
  messageCount: number;
  windowStartedAt: number;
  revalidationTimer: NodeJS.Timeout;
  expiryTimer: NodeJS.Timeout;
  heartbeatTimer: NodeJS.Timeout;
  closed: boolean;
};

const MAX_TRANSCRIPT_BYTES = 180_000;
const DEEPGRAM_BUFFER_LIMIT = 512_000;
const activeConnections = new Map<string, number>();

function upgradeError(socket: Duplex, status: number, code: string) {
  socket.write(`HTTP/1.1 ${status} ${status === 401 ? "Unauthorized" : "Forbidden"}\r\nConnection: close\r\nContent-Type: application/json\r\nCache-Control: no-store\r\n\r\n${JSON.stringify({ error: { code } })}`);
  socket.destroy();
}

function send(socket: WebSocket, payload: Record<string, unknown>) {
  if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(payload));
}

function allowMessage(session: Session) {
  const now = Date.now();
  if (now - session.windowStartedAt >= 60_000) { session.windowStartedAt = now; session.messageCount = 0; }
  session.messageCount += 1;
  return session.messageCount <= config.WS_MAX_MESSAGES_PER_MINUTE;
}

function releaseUserConnection(userId: string) {
  const remaining = (activeConnections.get(userId) || 1) - 1;
  if (remaining > 0) activeConnections.set(userId, remaining); else activeConnections.delete(userId);
}

function closeSession(socket: WebSocket, session: Session, code = 1000, reason = "session_closed") {
  if (session.closed) return;
  session.closed = true;
  clearInterval(session.revalidationTimer);
  clearTimeout(session.expiryTimer);
  clearInterval(session.heartbeatTimer);
  session.stream?.close();
  session.stream = undefined;
  session.finalTranscript.splice(0, session.finalTranscript.length);
  session.finalTranscriptBytes = 0;
  releaseUserConnection(session.userId);
  if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) socket.close(code, reason);
}

function rawToBuffer(raw: RawData): Buffer {
  if (Buffer.isBuffer(raw)) return raw;
  if (raw instanceof ArrayBuffer) return Buffer.from(raw);
  return Buffer.concat(raw);
}

function parseControl(raw: RawData) {
  try { return controlMessage.parse(JSON.parse(rawToBuffer(raw).toString("utf8"))); } catch { return undefined; }
}

export function attachVoiceRealtimeServer(server: http.Server) {
  const websocketServer = new WebSocketServer({ noServer: true, clientTracking: false, perMessageDeflate: false, maxPayload: config.WS_MAX_PAYLOAD_BYTES });

  server.on("upgrade", async (request, socket, head) => {
    let path: string;
    try { path = new URL(request.url || "/", "https://gateway.invalid").pathname; } catch { return upgradeError(socket, 403, "UPGRADE_INVALID"); }
    if (path !== "/api/v1/realtime/transcription") return socket.destroy();

    try {
      const identity = await authenticateWebSocketRequest(request);
      const userId = identity.payload.sub;
      if (!userId) return upgradeError(socket, 401, "UNAUTHENTICATED");
      if ((activeConnections.get(userId) || 0) >= config.WS_MAX_CONNECTIONS_PER_USER) return upgradeError(socket, 403, "CONNECTION_LIMIT");
      websocketServer.handleUpgrade(request, socket, head, (websocket) => {
        activeConnections.set(userId, (activeConnections.get(userId) || 0) + 1);
        websocketServer.emit("connection", websocket, request, identity);
      });
    } catch (error) {
      const code = error instanceof Error ? error.message : "UPGRADE_INVALID";
      return upgradeError(socket, code === "UNAUTHENTICATED" ? 401 : 403, ["ORIGIN_NOT_ALLOWED", "CSRF_INVALID", "UNAUTHENTICATED"].includes(code) ? code : "UPGRADE_INVALID");
    }
  });

  websocketServer.on("connection", (socket: WebSocket, _request: http.IncomingMessage, identity: Awaited<ReturnType<typeof authenticateWebSocketRequest>>) => {
    const userId = identity.payload.sub as string;
    const session: Session = {
      userId,
      sessionToken: identity.sessionToken,
      finalTranscript: [],
      finalTranscriptBytes: 0,
      isStreaming: false,
      isAlive: true,
      messageCount: 0,
      windowStartedAt: Date.now(),
      closed: false,
      revalidationTimer: setInterval(() => {
        verifySessionToken(identity.sessionToken).catch(() => closeSession(socket, session, 4401, "session_invalid"));
      }, 300_000),
      expiryTimer: setTimeout(() => closeSession(socket, session, 4000, "session_duration_limit"), config.WS_MAX_SESSION_SECONDS * 1000),
      heartbeatTimer: setInterval(() => {
        if (!session.isAlive) return closeSession(socket, session, 4001, "heartbeat_timeout");
        session.isAlive = false;
        socket.ping();
      }, 30_000)
    };

    socket.on("pong", () => { session.isAlive = true; });
    socket.on("error", () => closeSession(socket, session, 1011, "socket_error"));
    socket.on("close", () => closeSession(socket, session));
    socket.on("message", async (raw, isBinary) => {
      if (session.closed) return;
      if (!allowMessage(session)) return closeSession(socket, session, 4008, "message_rate_limit");
      if (isBinary) {
        const pcm = rawToBuffer(raw);
        if (!session.isStreaming || !session.stream) return send(socket, { type: "error", code: "STREAM_NOT_READY" });
        if (pcm.byteLength > config.WS_MAX_PAYLOAD_BYTES) return closeSession(socket, session, 1009, "payload_limit");
        if (session.stream.bufferedAmount > DEEPGRAM_BUFFER_LIMIT) return send(socket, { type: "flow_control" });
        try { session.stream.sendPcm(pcm); } catch { closeSession(socket, session, 1011, "stt_connection"); }
        return;
      }
      const message = parseControl(raw);
      if (!message) return closeSession(socket, session, 1008, "invalid_control_message");
      if (message.type === "start") {
        if (session.isStreaming) return closeSession(socket, session, 1008, "duplicate_start");
        session.isStreaming = true;
        session.stream = new DeepgramLiveStream({
          onTranscript: (event) => {
            if (session.closed) return;
            send(socket, { type: "transcript", text: event.text, isFinal: event.isFinal });
            if (event.isFinal) {
              const bytes = Buffer.byteLength(event.text, "utf8");
              session.finalTranscript.push(event.text);
              session.finalTranscriptBytes += bytes;
              while (session.finalTranscriptBytes > MAX_TRANSCRIPT_BYTES && session.finalTranscript.length) {
                session.finalTranscriptBytes -= Buffer.byteLength(session.finalTranscript.shift() || "", "utf8");
              }
            }
          },
          onError: () => send(socket, { type: "error", code: "STT_CONNECTION" }),
          onClose: () => { if (!session.closed) send(socket, { type: "error", code: "STT_CONNECTION" }); }
        });
        try { await session.stream.ready(); send(socket, { type: "ready", protocolVersion: "1" }); } catch { closeSession(socket, session, 1011, "stt_connection"); }
        return;
      }
      if (message.type === "stop") return closeSession(socket, session, 1000, "clinician_stopped_session");
      if (message.type === "generate_soap") {
        if (!session.isStreaming || session.finalTranscript.length === 0) return send(socket, { type: "soap_error", message: "A final transcript is required before a draft can be generated." });
        try { send(socket, { type: "soap", note: await generateSoapNote(session.finalTranscript.join("\n")) }); }
        catch { send(socket, { type: "soap_error", message: "The strict SOAP draft could not be generated." }); }
      }
    });
  });
}
