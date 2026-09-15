window.SomaSyncClinicalConfig = Object.freeze({
  apiBaseUrl: "https://api.somasyncai.com/api/v1",
  csrfCookieName: "somasync_csrf",
  bluetooth: {
    deviceNamePrefix: "SomaSync",
    controlServiceUuid: ""
  },
  audio: {
    sampleRate: 16000,
    reconnectBufferSeconds: 3,
    maxBrowserBufferedBytes: 262144
  },
  realtime: {
    maxReconnectAttempts: 3
  },
  session: {
    durationOptions: [30, 45, 60, 90, 120],
    defaultDuration: 60
  },
  assistant: {
    // Wake phrases (lowercase, matched against SpeechRecognition transcript)
    wakeBegin:  "begin session",
    wakeEnd:    "end session",
    wakeLog:    "noting",
    wakePause:  "pause",
    wakeReplay: "replay",
    wakeTime:   "time check",
    wakeCheck:  "client check",
    wakeOkay:   "soma okay",
    // Earpiece tone: frequency Hz and duration ms
    tone: { frequency: 880, duration: 80 },
    // Body mechanics check interval (ms)
    mechanicsIntervalMs: 20 * 60 * 1000,
    // Time reminders: minutes remaining
    timeReminders: [15, 5]
  }
});
