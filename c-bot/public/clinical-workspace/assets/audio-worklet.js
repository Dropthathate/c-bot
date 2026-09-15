class SomaSyncPcmProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) return true;
    const pcm = new Int16Array(channel.length);
    for (let index = 0; index < channel.length; index += 1) {
      const value = Math.max(-1, Math.min(1, channel[index]));
      pcm[index] = value < 0 ? value * 0x8000 : value * 0x7fff;
    }
    this.port.postMessage(pcm.buffer, [pcm.buffer]);
    return true;
  }
}

registerProcessor("somasync-pcm-processor", SomaSyncPcmProcessor);
