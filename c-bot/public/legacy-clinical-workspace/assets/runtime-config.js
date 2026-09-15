window.SomaSyncWorkspaceConfig = Object.freeze({
  // This public URL is replaced by the preview or production build configuration.
  // It must be HTTPS in all deployed environments.
  apiBaseUrl: "https://api.somasyncai.com/api/v1",
  csrfCookieName: "somasync_csrf",
  bluetooth: {
    // Set the approved companion BLE name prefix and service UUID during hardware integration.
    deviceNamePrefix: "SomaSync",
    controlServiceUuid: ""
  },
  audio: {
    sampleRate: 16000,
    // Audio is held only in memory for this bounded recovery window, then discarded.
    reconnectBufferSeconds: 3,
    maxBrowserBufferedBytes: 262144
  },
  realtime: {
    maxReconnectAttempts: 3
  }
});
