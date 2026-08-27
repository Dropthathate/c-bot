import WebSocket from "ws";
import { config } from "../config.js";

export type TranscriptEvent = { type: "transcript"; text: string; isFinal: boolean };
export type SttGateway = {
  ready: Promise<void>;
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

export function connectRealtimeTranscription(sampleRate: number, onTranscript: (event: TranscriptEvent) => void, onError: (message: string) => void): SttGateway {
  const upstream = new WebSocket(deepgramUrl(sampleRate), { headers: { Authorization: `Token ${config.DEEPGRAM_API_KEY}` } });
  let closed = false;
  const ready = new Promise<void>((resolve, reject) => {
    upstream.once("open", () => resolve());
    upstream.once("error", (error) => reject(error));
  });

  upstream.on("message", (raw) => {
    try {
      const payload = JSON.parse(raw.toString()) as {
        channel?: { alternatives?: Array<{ transcript?: string }> };
        is_final?: boolean;
        speech_final?: boolean;
        type?: string;
      };
      const text = payload.channel?.alternatives?.[0]?.transcript?.trim();
      if (text) onTranscript({ type: "transcript", text, isFinal: Boolean(payload.is_final || payload.speech_final) });
    } catch {
      onError("The transcription service returned an invalid response.");
    }
  });
  upstream.on("error", () => { if (!closed) onError("The transcription service connection failed."); });
  upstream.on("close", () => { if (!closed) onError("The transcription service closed the live connection."); });

  return {
    ready,
    sendAudio(audio) {
      if (!closed && upstream.readyState === WebSocket.OPEN) upstream.send(audio, { binary: true });
    },
    close() {
      closed = true;
      if (upstream.readyState === WebSocket.OPEN || upstream.readyState === WebSocket.CONNECTING) upstream.close(1000, "session_complete");
    }
  };
}
