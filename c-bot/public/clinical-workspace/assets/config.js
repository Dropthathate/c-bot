window.SomaSyncClinicalConfig = Object.freeze({
  // Replace this public endpoint per preview/staging deployment. Never add credentials here.
  apiBaseUrl: "https://api.somasyncai.com/api/v1",
  csrfCookieName: "somasync_csrf",
  bluetooth: {
    // Hardware integration supplies the approved prefix and optional control-service UUID.
    deviceNamePrefix: "SomaSync",
    controlServiceUuid: ""
  },
  audio: {
    sampleRate: 16000,
    // A temporary reconnect buffer is held in memory only, then discarded.
    reconnectBufferSeconds: 3,
    maxBrowserBufferedBytes: 262144
  },
  realtime: {
    maxReconnectAttempts: 3
  }
});
