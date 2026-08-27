import WebSocket from "ws";
import { config } from "../config.js";

export type TranscriptEvent = {
  type: "transcript";
  streamId: string;
  text: string;
  isFinal: boolean;
  offsetMs: number;
};

export type SttGateway = {
  ready: Promise<void>;
  bufferedAmount: number;
  sendAudio: (audio: Buffer) => void;
  close: () => void;
};

function deepgramUrl(sampleRate: number) {
  const endpoint = new URL("wss://api.deepgram.com/v1/listen");
  endpoint.searchParams.set("model", config.DEEPGRAM_MODEL);
  endpoint.searchParams.set("encoding", "linear16");
  endpoint.searchParams.set("sample_rate", String(sampleRate));
  endpoint.searchParams.set("channels", "1");
  endpoint.searchParams.set("interim_results", "true");
  endpoint.searchParams.set("smart_format", "true");
  endpoint.searchParams.set("punctuate", "true");
  endpoint.searchParams.set("endpointing", "300");
  endpoint.searchParams.set("no_store", "true");
  return endpoint.toString();
}

export function connectRealtimeTranscription(
  sampleRate: number,
  streamId: string,
  onTranscript: (event: TranscriptEvent) => void,
  onError: (message: string) => void
): SttGateway {
  const upstream = new WebSocket(deepgramUrl(sampleRate), {
    headers: { Authorization: `Token ${config.DEEPGRAM_API_KEY}` },
    perMessageDeflate: false,
    handshakeTimeout: 10_000
  });

  let closed = false;
  let errorReported = false;
  let lastAudioAt = Date.now();
  const reportError = (message: string) => {
    if (!closed && !errorReported) {
      errorReported = true;
      onError(message);
    }
  };

  const ready = new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("STT connection timed out.")), 10_000);
    upstream.once("open", () => {
      clearTimeout(timeout);
      resolve();
    });
    upstream.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });

  const keepAlive = setInterval(() => {
    if (closed || upstream.readyState !== WebSocket.OPEN) return;
    if (Date.now() - lastAudioAt >= 2_500) upstream.send(JSON.stringify({ type: "KeepAlive" }));
  }, 3_000);
  keepAlive.unref();

  upstream.on("message", (raw) => {
    try {
      const payload = JSON.parse(raw.toString()) as {
        channel?: { alternatives?: Array<{ transcript?: string }> };
        is_final?: boolean;
        speech_final?: boolean;
        start?: number;
        type?: string;
      };
      const text = payload.channel?.alternatives?.[0]?.transcript?.trim();
      if (text) {
        onTranscript({
          type: "transcript",
          streamId,
          text,
          isFinal: Boolean(payload.is_final || payload.speech_final),
          offsetMs: Math.max(0, Math.round((payload.start || 0) * 1_000))
        });
      }
    } catch {
      reportError("The transcription service returned an invalid response.");
    }
  });

  upstream.on("error", () => reportError("The transcription service connection failed."));
  upstream.on("close", () => reportError("The transcription service closed the live connection."));

  return {
    ready,
    get bufferedAmount() {
      return upstream.bufferedAmount;
    },
    sendAudio(audio) {
      if (closed || upstream.readyState !== WebSocket.OPEN) return;
      lastAudioAt = Date.now();
      upstream.send(audio, { binary: true });
    },
    close() {
      if (closed) return;
      closed = true;
      clearInterval(keepAlive);
      if (upstream.readyState === WebSocket.OPEN) {
        upstream.send(JSON.stringify({ type: "CloseStream" }));
        upstream.close(1000, "session_complete");
      } else if (upstream.readyState === WebSocket.CONNECTING) {
        upstream.terminate();
      }
    }
  };
}
