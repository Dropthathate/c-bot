import WebSocket from "ws";
import { config } from "../config.js";

type DeepgramResult = {
  type?: string;
  is_final?: boolean;
  channel?: { alternatives?: Array<{ transcript?: string }> };
};

export type LiveTranscriptEvent = { text: string; isFinal: boolean };

export class DeepgramLiveStream {
  private socket: WebSocket;
  private keepAlive: NodeJS.Timeout;
  private explicitlyClosed = false;

  constructor(
    private readonly handlers: {
      onTranscript: (event: LiveTranscriptEvent) => void;
      onError: () => void;
      onClose: () => void;
    }
  ) {
    const query = new URLSearchParams({
      model: config.DEEPGRAM_MODEL,
      encoding: "linear16",
      sample_rate: "16000",
      channels: "1",
      interim_results: "true",
      punctuate: "true",
      smart_format: "true",
      no_store: "true"
    });
    this.socket = new WebSocket(`wss://api.deepgram.com/v1/listen?${query.toString()}`, {
      headers: { Authorization: `Token ${config.DEEPGRAM_API_KEY}` },
      perMessageDeflate: false
    });
    this.socket.on("message", (raw) => this.consumeMessage(raw.toString()));
    this.socket.on("error", () => this.handlers.onError());
    this.socket.on("close", () => {
      clearInterval(this.keepAlive);
      if (!this.explicitlyClosed) this.handlers.onClose();
    });
    // Deepgram expects an application-level text keepalive during silence.
    this.keepAlive = setInterval(() => {
      if (this.socket.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify({ type: "KeepAlive" }));
    }, 4_000);
  }

  async ready() {
    if (this.socket.readyState === WebSocket.OPEN) return;
    await new Promise<void>((resolve, reject) => {
      const onOpen = () => { cleanup(); resolve(); };
      const onError = () => { cleanup(); reject(new Error("STT_CONNECTION")); };
      const onClose = () => { cleanup(); reject(new Error("STT_CONNECTION")); };
      const cleanup = () => { this.socket.off("open", onOpen); this.socket.off("error", onError); this.socket.off("close", onClose); };
      this.socket.once("open", onOpen);
      this.socket.once("error", onError);
      this.socket.once("close", onClose);
    });
  }

  get bufferedAmount() { return this.socket.bufferedAmount; }

  sendPcm(frame: Buffer) {
    if (this.socket.readyState !== WebSocket.OPEN) throw new Error("STT_CONNECTION");
    this.socket.send(frame, { binary: true });
  }

  close() {
    this.explicitlyClosed = true;
    clearInterval(this.keepAlive);
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: "CloseStream" }));
      this.socket.close(1000, "clinical_session_closed");
    } else if (this.socket.readyState === WebSocket.CONNECTING) {
      this.socket.terminate();
    }
  }

  private consumeMessage(raw: string) {
    let message: DeepgramResult;
    try { message = JSON.parse(raw) as DeepgramResult; } catch { return; }
    if (message.type !== "Results") return;
    const text = message.channel?.alternatives?.[0]?.transcript?.replace(/\s+/g, " ").trim();
    if (text) this.handlers.onTranscript({ text, isFinal: Boolean(message.is_final) });
  }
}
