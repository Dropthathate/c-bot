class SomaSyncAudioCaptureProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const milliseconds = Number(options.processorOptions?.chunkMilliseconds) || 80;
    this.chunkFrames = Math.max(256, Math.round(sampleRate * milliseconds / 1000));
    this.buffer = new Float32Array(this.chunkFrames);
    this.offset = 0;
  }

  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) return true;
    let sourceOffset = 0;
    while (sourceOffset < channel.length) {
      const available = this.chunkFrames - this.offset;
      const count = Math.min(available, channel.length - sourceOffset);
      this.buffer.set(channel.subarray(sourceOffset, sourceOffset + count), this.offset);
      this.offset += count;
      sourceOffset += count;
      if (this.offset === this.chunkFrames) {
        let peak = 0;
        for (let i = 0; i < this.buffer.length; i += 1) peak = Math.max(peak, Math.abs(this.buffer[i]));
        const copy = this.buffer.slice();
        this.port.postMessage({ samples: copy, sampleRate, peak }, [copy.buffer]);
        this.offset = 0;
      }
    }
    return true;
  }
}

registerProcessor("somasync-audio-capture", SomaSyncAudioCaptureProcessor);
