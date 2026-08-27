import type { IncomingMessage, Server as HttpServer } from "node:http";
import type { Duplex } from "node:stream";
import { WebSocket, WebSocketServer } from "ws";
import { z } from "zod";
import { authenticateWebSocketRequest, verifySessionToken } from "./auth.js";
import { config } from "./config.js";
import { generateSoapNote } from "./services/bedrock.js";
import { connectRealtimeTranscription, type SttGateway, type TranscriptEvent } from "./services/deepgram-live.js";
import { recordAuditEvent } from "./services/audit.js";

const startMessage = z.object({
  type: z.literal("start"),
  protocolVersion: z.literal("1"),
  encoding: z.literal("linear16"),
  sampleRate: z.number().int().min(8_000).max(48_000),
  channels: z.literal(1),
  streamId: z.string().uuid(),
  sessionReference: z.string().trim().min(1).max(64).optional()
}).strict();
const soapMessage = z.object({ type: z.literal("generate_soap") }).strict();
const stopMessage = z.object({ type: z.literal("stop") }).strict();
const controlMessage = z.discriminatedUnion("type", [startMessage, soapMessage, stopMessage]);

type UpgradeAuth = Awaited<ReturnType<typeof authenticateWebSocketRequest>>;
type TrackedSocket = WebSocket & { isAlive?: boolean };

const activeConnections = new Map<string, number>();

function send(socket: WebSocket, payload: object) {
  if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(payload));
}

function rejectUpgrade(socket: Duplex, status: number, statusText: string) {
  socket.write(`HTTP/1.1 ${status} ${statusText}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`);
  socket.destroy();
}

function incrementConnection(userId: string) {
  const count = activeConnections.get(userId) || 0;
  if (count >= config.WS_MAX_CONNECTIONS_PER_USER) return false;
  activeConnections.set(userId, count + 1);
  return true;
}

function decrementConnection(userId: string) {
  const remaining = (activeConnections.get(userId) || 1) - 1;
  if (remaining > 0) activeConnections.set(userId, remaining);
  else activeConnections.delete(userId);
}

function boundedTranscriptAppend(segments: string[], transcript: string) {
  const normalized = transcript.replace(/\s+/g, " ").trim();
  if (!normalized) return;
  segments.push(normalized);
  let total = segments.reduce((sum, segment) => sum + segment.length + 1, 0);
  while (total > 50_000 && segments.length > 1) total -= (segments.shift()?.length || 0) + 1;
}

export function attachVoiceRealtimeServer(server: HttpServer) {
  const wss = new WebSocketServer({
    noServer: true,
    clientTracking: true,
    maxPayload: config.WS_MAX_PAYLOAD_BYTES,
    perMessageDeflate: false,
    handleProtocols: (protocols) => protocols.has("somasync.stt.v1") ? "somasync.stt.v1" : false
  });

  const heartbeat = setInterval(() => {
    for (const client of wss.clients as Set<TrackedSocket>) {
      if (client.isAlive === false) {
        client.terminate();
        continue;
      }
      client.isAlive = false;
      client.ping();
    }
  }, 30_000);
  heartbeat.unref();

  server.on("upgrade", async (request, socket, head) => {
    const url = new URL(request.url || "/", "https://somasyncai.invalid");
    if (url.pathname !== "/api/v1/realtime/transcription") return;

    const protocols = request.headers["sec-websocket-protocol"]?.split(",").map((item) => item.trim()) || [];
    if (!protocols.includes("somasync.stt.v1")) {
      rejectUpgrade(socket, 426, "Upgrade Required");
      return;
    }

    try {
      const auth = await authenticateWebSocketRequest(request);
      const userId = auth.payload.sub;
      if (!userId || !incrementConnection(userId)) {
        rejectUpgrade(socket, 429, "Too Many Requests");
        return;
      }
      wss.handleUpgrade(request, socket, head, (websocket) => {
        wss.emit("connection", websocket, request, auth);
      });
    } catch {
      rejectUpgrade(socket, 401, "Unauthorized");
    }
  });

  wss.on("connection", (socket: TrackedSocket, _request: IncomingMessage, auth: UpgradeAuth) => {
    const userId = auth.payload.sub;
    if (!userId) return socket.close(1008, "session_missing_subject");

    let gateway: SttGateway | null = null;
    let started = false;
    let soapInFlight = false;
    let closed = false;
    let messageWindowStarted = Date.now();
    let messageCount = 0;
    let audioWindowStarted = Date.now();
    let audioWindowBytes = 0;
    let transcriptSequence = 0;
    let sessionReference: string | undefined;
    const transcriptSegments: string[] = [];
    const audit = (eventType: string, metadata: Record<string, string | number | boolean> = {}) => {
      void recordAuditEvent({ clinicianId: userId, eventType, sessionReference, metadata }).catch(() => undefined);
    };

    const cleanup = () => {
      if (closed) return;
      closed = true;
      clearTimeout(sessionDeadline);
      clearInterval(sessionValidator);
      gateway?.close();
      gateway = null;
      decrementConnection(userId);
      transcriptSegments.length = 0;
      audit("realtime.session_closed", { finalSegments: transcriptSequence });
    };

    const close = (code: number, reason: string) => {
      cleanup();
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CLOSING) socket.close(code, reason);
    };

    const sessionDeadline = setTimeout(() => close(1008, "session_duration_exceeded"), config.WS_MAX_SESSION_SECONDS * 1000);
    const sessionValidator = setInterval(async () => {
      try {
        await verifySessionToken(auth.sessionToken);
      } catch {
        close(1008, "session_expired");
      }
    }, config.WS_SESSION_REVALIDATE_SECONDS * 1000);
    sessionValidator.unref();

    socket.isAlive = true;
    socket.on("pong", () => { socket.isAlive = true; });

    const receiveTranscript = (event: TranscriptEvent) => {
      if (event.isFinal) boundedTranscriptAppend(transcriptSegments, event.text);
      transcriptSequence += 1;
      send(socket, {
        type: "transcript",
        sequence: transcriptSequence,
        streamId: event.streamId,
        text: event.text,
        isFinal: event.isFinal,
        offsetMs: event.offsetMs
      });
    };

    socket.on("message", async (data, isBinary) => {
      if (closed) return;
      try {
        const now = Date.now();
        if (now - messageWindowStarted >= 60_000) {
          messageWindowStarted = now;
          messageCount = 0;
        }
        messageCount += 1;
        if (messageCount > config.WS_MAX_MESSAGES_PER_MINUTE) return close(1008, "message_rate_exceeded");

        if (isBinary) {
          if (!started || !gateway) return close(1008, "start_required");
          const bytes = Buffer.isBuffer(data) ? data : Buffer.from(data as ArrayBuffer);
          if (bytes.byteLength > config.WS_MAX_PAYLOAD_BYTES) return close(1009, "audio_frame_too_large");
          if (now - audioWindowStarted >= 1_000) {
            audioWindowStarted = now;
            audioWindowBytes = 0;
          }
          audioWindowBytes += bytes.byteLength;
          if (audioWindowBytes > config.WS_MAX_AUDIO_BYTES_PER_SECOND) return close(1008, "audio_rate_exceeded");
          if (gateway.bufferedAmount > config.WS_MAX_BUFFERED_BYTES) {
            return send(socket, { type: "flow_control", status: "pause", message: "Transcription is catching up." });
          }
          gateway.sendAudio(bytes);
          return;
        }

        const parsed = controlMessage.parse(JSON.parse(data.toString()));
        if (parsed.type === "start") {
          if (started) return close(1008, "duplicate_start");
          started = true;
          sessionReference = parsed.sessionReference || parsed.streamId;
          gateway = connectRealtimeTranscription(parsed.sampleRate, parsed.streamId, receiveTranscript, (message) => {
            audit("realtime.stt_connection_interrupted");
            send(socket, { type: "error", code: "STT_CONNECTION", message });
          });
          await gateway.ready;
          audit("realtime.session_started", { sampleRate: parsed.sampleRate, channels: parsed.channels });
          send(socket, { type: "ready", protocolVersion: "1", streamId: parsed.streamId });
          return;
        }
        if (parsed.type === "stop") return close(1000, "session_complete");
        if (!started || !gateway) return close(1008, "start_required");
        if (soapInFlight) return send(socket, { type: "soap_error", message: "SOAP generation is already in progress." });

        const transcript = transcriptSegments.join(" ").trim();
        if (!transcript) return send(socket, { type: "soap_error", message: "A final transcript is required before creating a SOAP draft." });

        soapInFlight = true;
        try {
          const note = await generateSoapNote(transcript);
          audit("realtime.soap_draft_generated", { finalSegments: transcriptSequence });
          send(socket, { type: "soap", note, transcriptSequence });
        } catch {
          send(socket, { type: "soap_error", message: "A strict SOAP draft could not be generated from this transcript." });
        } finally {
          soapInFlight = false;
        }
      } catch {
        send(socket, { type: "error", code: "INVALID_MESSAGE", message: "The real-time message was invalid." });
      }
    });

    socket.on("close", cleanup);
    socket.on("error", cleanup);
  });
}
