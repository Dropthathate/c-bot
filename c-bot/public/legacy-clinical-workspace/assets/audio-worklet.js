class SomaSyncPcmProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.frameSize = 2048;
    this.pending = new Float32Array(this.frameSize);
    this.pendingLength = 0;
  }

  process(inputs) {
    const input = inputs[0]?.[0];
    if (!input?.length) return true;

    let offset = 0;
    while (offset < input.length) {
      const available = this.frameSize - this.pendingLength;
      const copied = Math.min(available, input.length - offset);
      this.pending.set(input.subarray(offset, offset + copied), this.pendingLength);
      this.pendingLength += copied;
      offset += copied;
      if (this.pendingLength === this.frameSize) this.flush();
    }
    return true;
  }

  flush() {
    const pcm = new Int16Array(this.frameSize);
    for (let index = 0; index < this.frameSize; index += 1) {
      const sample = Math.max(-1, Math.min(1, this.pending[index]));
      pcm[index] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    }
    this.port.postMessage(pcm.buffer, [pcm.buffer]);
    this.pending = new Float32Array(this.frameSize);
    this.pendingLength = 0;
  }
}

registerProcessor("somasync-pcm-processor", SomaSyncPcmProcessor);
