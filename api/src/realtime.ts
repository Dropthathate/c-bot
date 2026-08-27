import type { IncomingMessage, Server as HttpServer } from "node:http";
import { WebSocket, WebSocketServer } from "ws";
import { z } from "zod";
import { authenticateWebSocketRequest } from "./auth.js";
import { generateSoapNote } from "./services/bedrock.js";
import { connectRealtimeTranscription, type SttGateway } from "./services/deepgram-live.js";

const startMessage = z.object({
  type: z.literal("start"),
  protocolVersion: z.literal("1"),
  encoding: z.literal("linear16"),
  sampleRate: z.number().int().min(8_000).max(48_000),
  channels: z.literal(1),
  sessionReference: z.string().max(64).optional()
}).strict();
const soapMessage = z.object({ type: z.literal("generate_soap"), transcript: z.string().trim().min(1).max(100_000) }).strict();
const stopMessage = z.object({ type: z.literal("stop") }).strict();
const controlMessage = z.discriminatedUnion("type", [startMessage, soapMessage, stopMessage]);
const MAX_AUDIO_FRAME_BYTES = 64 * 1024;

function send(socket: WebSocket, payload: object) {
  if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(payload));
}

function rejectUpgrade(socket: import("node:stream").Duplex, status: number, statusText: string) {
  socket.write(`HTTP/1.1 ${status} ${statusText}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`);
  socket.destroy();
}

export function attachVoiceRealtimeServer(server: HttpServer) {
  const wss = new WebSocketServer({
    noServer: true,
    clientTracking: false,
    maxPayload: MAX_AUDIO_FRAME_BYTES,
    handleProtocols: (protocols) => protocols.has("somasync.stt.v1") ? "somasync.stt.v1" : false
  });

  server.on("upgrade", async (request, socket, head) => {
    const url = new URL(request.url || "/", "https://somasyncai.invalid");
    if (url.pathname !== "/api/v1/voice/stream") return;
    if (request.headers["sec-websocket-protocol"]?.split(",").map((item) => item.trim()).includes("somasync.stt.v1") !== true) {
      rejectUpgrade(socket, 426, "Upgrade Required");
      return;
    }
    try {
      const auth = await authenticateWebSocketRequest(request);
      wss.handleUpgrade(request, socket, head, (websocket) => wss.emit("connection", websocket, request, auth));
    } catch {
      rejectUpgrade(socket, 401, "Unauthorized");
    }
  });

  wss.on("connection", (socket: WebSocket, _request: IncomingMessage) => {
    let gateway: SttGateway | null = null;
    let started = false;
    let soapInFlight = false;
    let frameWindowStarted = Date.now();
    let frameWindowBytes = 0;

    const closeGateway = () => { gateway?.close(); gateway = null; };
    const close = (code: number, reason: string) => {
      closeGateway();
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CLOSING) socket.close(code, reason);
    };

    socket.on("message", async (data, isBinary) => {
      try {
        if (isBinary) {
          if (!started || !gateway) return close(1008, "start_required");
          const bytes = Buffer.isBuffer(data) ? data : Buffer.from(data as ArrayBuffer);
          if (bytes.byteLength > MAX_AUDIO_FRAME_BYTES) return close(1009, "audio_frame_too_large");
          const now = Date.now();
          if (now - frameWindowStarted >= 1_000) { frameWindowStarted = now; frameWindowBytes = 0; }
          frameWindowBytes += bytes.byteLength;
          if (frameWindowBytes > 256 * 1024) return close(1008, "audio_rate_exceeded");
          gateway.sendAudio(bytes);
          return;
        }

        const parsed = controlMessage.parse(JSON.parse(data.toString()));
        if (parsed.type === "start") {
          if (started) return close(1008, "duplicate_start");
          started = true;
          gateway = connectRealtimeTranscription(
            parsed.sampleRate,
            (event) => send(socket, event),
            (message) => send(socket, { type: "error", code: "STT_CONNECTION", message })
          );
          await gateway.ready;
          send(socket, { type: "ready", protocolVersion: "1" });
          return;
        }
        if (parsed.type === "stop") return close(1000, "session_complete");
        if (!started) return close(1008, "start_required");
        if (soapInFlight) return send(socket, { type: "soap_error", message: "SOAP generation is already in progress." });
        soapInFlight = true;
        try {
          const note = await generateSoapNote(parsed.transcript);
          send(socket, { type: "soap", note });
        } catch {
          send(socket, { type: "soap_error", message: "A strict SOAP draft could not be generated from this transcript." });
        } finally {
          soapInFlight = false;
        }
      } catch {
        send(socket, { type: "error", code: "INVALID_MESSAGE", message: "The real-time message was invalid." });
      }
    });
    socket.on("close", closeGateway);
    socket.on("error", closeGateway);
  });
}
