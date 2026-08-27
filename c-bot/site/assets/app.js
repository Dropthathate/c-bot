const config = window.SomaSyncRuntimeConfig || {};

const els = {
  connectDevice: document.querySelector("#connect-device"),
  disconnectDevice: document.querySelector("#disconnect-device"),
  bluetoothState: document.querySelector("#bluetooth-state"),
  deviceName: document.querySelector("#device-name"),
  batteryLevel: document.querySelector("#battery-level"),
  deviceLink: document.querySelector("#device-link"),
  audioInput: document.querySelector("#audio-input"),
  socketState: document.querySelector("#socket-state"),
  startSession: document.querySelector("#start-session"),
  stopSession: document.querySelector("#stop-session"),
  streamDetail: document.querySelector("#stream-detail"),
  sessionTimer: document.querySelector("#session-timer"),
  sessionLabel: document.querySelector("#session-label"),
  meter: document.querySelector("#audio-meter"),
  meterLabel: document.querySelector("#meter-label"),
  transcript: document.querySelector("#transcript"),
  clearTranscript: document.querySelector("#clear-transcript"),
  soapState: document.querySelector("#soap-state"),
  subjective: document.querySelector("#soap-subjective"),
  objective: document.querySelector("#soap-objective"),
  assessment: document.querySelector("#soap-assessment"),
  plan: document.querySelector("#soap-plan"),
  refreshSoap: document.querySelector("#refresh-soap"),
  copySoap: document.querySelector("#copy-soap-json"),
  calendarLink: document.querySelector("#calendar-link"),
  betaForm: document.querySelector("#beta-form"),
  betaEmail: document.querySelector("#beta-email"),
  betaMessage: document.querySelector("#beta-message"),
  toastRegion: document.querySelector("#toast-region")
};

const state = {
  bluetoothDevice: null,
  telemetryCharacteristic: null,
  controlCharacteristic: null,
  manualDisconnect: false,
  reconnectDeviceTimer: null,
  deviceReconnectAttempt: 0,
  mediaStream: null,
  audioContext: null,
  worklet: null,
  silentGain: null,
  socket: null,
  sessionActive: false,
  sessionStartedAt: 0,
  timerId: null,
  reconnectSocketTimer: null,
  socketReconnectAttempt: 0,
  finalTranscript: [],
  interimTranscript: "",
  lastSoap: null,
  soapRequested: false
};

const BATTERY_SERVICE = "battery_service";
const BATTERY_LEVEL = "battery_level";
const MAX_SOCKET_RECONNECTS = 5;
const MAX_DEVICE_RECONNECTS = 4;

function apiOrigin() {
  const origin = (config.apiOrigin || window.location.origin).replace(/\/$/, "");
  if (window.location.protocol === "https:" && !origin.startsWith("https://")) {
    throw new Error("Production API configuration must use HTTPS.");
  }
  return origin;
}

function socketUrl() {
  if (config.sttWebSocketUrl) {
    if (window.location.protocol === "https:" && !config.sttWebSocketUrl.startsWith("wss://")) {
      throw new Error("Production transcription configuration must use WSS.");
    }
    return config.sttWebSocketUrl;
  }
  const api = new URL(apiOrigin());
  api.protocol = api.protocol === "https:" ? "wss:" : "ws:";
  api.pathname = "/api/v1/voice/stream";
  api.search = "";
  return api.toString();
}

function csrfToken() {
  const match = document.cookie.split(";").map((entry) => entry.trim()).find((entry) => entry.startsWith("somasync_csrf="));
  return match ? decodeURIComponent(match.slice("somasync_csrf=".length)) : "";
}

function calendarApiOrigin() {
  const origin = (config.calendarApiOrigin || config.calendarOrigin || "").replace(/\/$/, "");
  if (!origin) throw new Error("Calendar API configuration is required.");
  if (window.location.protocol === "https:" && !origin.startsWith("https://")) throw new Error("Calendar API configuration must use HTTPS.");
  return origin;
}

async function calendarRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const csrf = ["GET", "HEAD", "OPTIONS"].includes(method) ? "" : csrfToken();
  const response = await fetch(`${calendarApiOrigin()}${path}`, {
    ...options,
    credentials: "include",
    headers: { Accept: "application/json", ...(csrf ? { "X-SomaSync-CSRF": csrf } : {}), ...(options.headers || {}) }
  });
  if (response.status === 401) throw new Error("A shared SomaSyncAI session is required for calendar access.");
  if (!response.ok) throw new Error("Calendar service request failed.");
  return response.status === 204 ? null : response.json();
}

window.SomaSyncCalendarBridge = Object.freeze({
  getToday: () => calendarRequest("/api/v1/calendar/blocks?range=today"),
  createTimeBlock: (block) => calendarRequest("/api/v1/calendar/blocks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(block)
  })
});

function setChip(element, label, status = "idle") {
  element.textContent = label;
  element.dataset.state = status;
}

function toast(message, type = "info") {
  const item = document.createElement("div");
  item.className = `toast${type === "error" ? " error" : ""}`;
  item.textContent = message;
  els.toastRegion.append(item);
  window.setTimeout(() => item.remove(), 7000);
}

function formatDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function updateTimer() {
  els.sessionTimer.textContent = formatDuration(Date.now() - state.sessionStartedAt);
}

function startTimer() {
  state.sessionStartedAt = Date.now();
  updateTimer();
  state.timerId = window.setInterval(updateTimer, 1000);
}

function stopTimer() {
  window.clearInterval(state.timerId);
  state.timerId = null;
  els.sessionTimer.textContent = "00:00";
}

function isBluetoothSupported() {
  return Boolean(navigator.bluetooth && window.isSecureContext);
}

function bluetoothRequestOptions() {
  const hardware = config.bluetooth || {};
  const optionalServices = [BATTERY_SERVICE];
  if (hardware.serviceUuid) optionalServices.push(hardware.serviceUuid);
  const filters = hardware.namePrefix ? [{ namePrefix: hardware.namePrefix }] : [];
  if (!filters.length) {
    throw new Error("Bluetooth hardware configuration requires a device name prefix before connection.");
  }
  return { filters, optionalServices };
}

async function connectBluetoothDevice() {
  if (!isBluetoothSupported()) {
    throw new Error("Web Bluetooth requires a supported Chromium-based browser over HTTPS.");
  }
  state.manualDisconnect = false;
  setChip(els.bluetoothState, "Selecting device", "working");
  const device = await navigator.bluetooth.requestDevice(bluetoothRequestOptions());
  state.bluetoothDevice = device;
  device.addEventListener("gattserverdisconnected", onBluetoothDisconnected);
  await connectGattAndTelemetry();
  els.disconnectDevice.disabled = false;
  els.audioInput.disabled = false;
  els.startSession.disabled = false;
  await enumerateAudioInputs();
}

async function connectGattAndTelemetry() {
  const device = state.bluetoothDevice;
  if (!device?.gatt) throw new Error("The selected device does not expose a GATT connection.");
  setChip(els.bluetoothState, "Connecting", "working");
  els.deviceLink.textContent = "Connecting";
  const server = await device.gatt.connect();
  state.deviceReconnectAttempt = 0;
  els.deviceName.textContent = device.name || "SomaSync companion";
  els.deviceLink.textContent = "Connected";
  setChip(els.bluetoothState, "Connected", "connected");
  await Promise.allSettled([subscribeBattery(server), subscribeTelemetry(server)]);
}

async function subscribeBattery(server) {
  try {
    const service = await server.getPrimaryService(BATTERY_SERVICE);
    const characteristic = await service.getCharacteristic(BATTERY_LEVEL);
    const update = (event) => updateBattery(event.target.value.getUint8(0));
    characteristic.addEventListener("characteristicvaluechanged", update);
    updateBattery((await characteristic.readValue()).getUint8(0));
    await characteristic.startNotifications();
  } catch {
    els.batteryLevel.textContent = "Unavailable";
  }
}

function updateBattery(value) {
  const level = Math.max(0, Math.min(100, Number(value)));
  els.batteryLevel.textContent = Number.isFinite(level) ? `${level}%` : "Unavailable";
}

async function subscribeTelemetry(server) {
  const hardware = config.bluetooth || {};
  if (!hardware.serviceUuid || !hardware.telemetryCharacteristicUuid) return;
  const service = await server.getPrimaryService(hardware.serviceUuid);
  const characteristic = await service.getCharacteristic(hardware.telemetryCharacteristicUuid);
  state.telemetryCharacteristic = characteristic;
  characteristic.addEventListener("characteristicvaluechanged", (event) => onTelemetry(event.target.value));
  await characteristic.startNotifications();
  if (hardware.controlCharacteristicUuid) {
    state.controlCharacteristic = await service.getCharacteristic(hardware.controlCharacteristicUuid);
  }
}

function onTelemetry(dataView) {
  const bytes = new Uint8Array(dataView.buffer, dataView.byteOffset, dataView.byteLength);
  if (bytes.byteLength === 1) {
    updateBattery(bytes[0]);
    return;
  }
  try {
    const payload = JSON.parse(new TextDecoder().decode(bytes));
    if (typeof payload.battery === "number") updateBattery(payload.battery);
    if (payload.event === "start" && !state.sessionActive) startSession().catch(reportError);
    if (payload.event === "stop" && state.sessionActive) stopSession();
    if (payload.event === "mark") sendControlMessage({ type: "device_mark", timestamp: Date.now() });
  } catch {
    // Non-JSON telemetry is deliberately ignored unless a device protocol parser is configured.
  }
}

function onBluetoothDisconnected() {
  state.telemetryCharacteristic = null;
  state.controlCharacteristic = null;
  els.deviceLink.textContent = "Disconnected";
  setChip(els.bluetoothState, "Disconnected", "error");
  if (!state.manualDisconnect) reconnectBluetoothDevice();
}

function reconnectBluetoothDevice() {
  if (!state.bluetoothDevice || state.deviceReconnectAttempt >= MAX_DEVICE_RECONNECTS) {
    if (state.sessionActive) toast("Companion device disconnected. Audio streaming continues only while the selected microphone remains available.", "error");
    return;
  }
  const delay = Math.min(30_000, 1000 * (2 ** state.deviceReconnectAttempt));
  state.deviceReconnectAttempt += 1;
  els.deviceLink.textContent = `Reconnecting in ${Math.ceil(delay / 1000)}s`;
  window.clearTimeout(state.reconnectDeviceTimer);
  state.reconnectDeviceTimer = window.setTimeout(async () => {
    try {
      await connectGattAndTelemetry();
      toast("Hands-free companion reconnected.");
    } catch {
      reconnectBluetoothDevice();
    }
  }, delay);
}

async function disconnectBluetoothDevice() {
  state.manualDisconnect = true;
  window.clearTimeout(state.reconnectDeviceTimer);
  if (state.bluetoothDevice?.gatt?.connected) state.bluetoothDevice.gatt.disconnect();
  state.bluetoothDevice = null;
  state.telemetryCharacteristic = null;
  state.controlCharacteristic = null;
  els.deviceName.textContent = "Not selected";
  els.batteryLevel.textContent = "Unavailable";
  els.deviceLink.textContent = "Idle";
  setChip(els.bluetoothState, "Not connected", "idle");
  els.disconnectDevice.disabled = true;
}

async function enumerateAudioInputs() {
  if (!navigator.mediaDevices?.enumerateDevices) throw new Error("Audio-device enumeration is not available in this browser.");
  const devices = await navigator.mediaDevices.enumerateDevices();
  const selected = els.audioInput.value;
  els.audioInput.replaceChildren(new Option("Select an audio input", ""));
  for (const device of devices.filter((item) => item.kind === "audioinput")) {
    const label = device.label || `Microphone ${els.audioInput.options.length}`;
    els.audioInput.append(new Option(label, device.deviceId));
  }
  if ([...els.audioInput.options].some((option) => option.value === selected)) els.audioInput.value = selected;
}

async function requestSession() {
  const response = await fetch(`${apiOrigin()}/api/v1/auth/session`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" }
  });
  if (response.status === 401) throw new Error("Sign in is required before starting a clinical session.");
  if (!response.ok) throw new Error("The clinical session could not be verified.");
  return response.json();
}

async function startSession() {
  if (state.sessionActive) return;
  if (!els.audioInput.value) throw new Error("Select a Bluetooth or other approved audio input before starting.");
  els.startSession.disabled = true;
  els.streamDetail.textContent = "Verifying secure session…";
  await requestSession();
  await startAudioCapture();
  state.sessionActive = true;
  state.socketReconnectAttempt = 0;
  await openSocket();
  startTimer();
  els.stopSession.disabled = false;
  els.refreshSoap.disabled = false;
  els.streamDetail.textContent = "Streaming raw PCM audio over an encrypted persistent connection.";
}

async function startAudioCapture() {
  const constraints = {
    audio: {
      deviceId: { exact: els.audioInput.value },
      channelCount: 1,
      echoCancellation: false,
      noiseSuppression: true,
      autoGainControl: true
    },
    video: false
  };
  state.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
  state.audioContext = new AudioContext();
  await state.audioContext.audioWorklet.addModule("/assets/audio-processor.js");
  const source = state.audioContext.createMediaStreamSource(state.mediaStream);
  state.worklet = new AudioWorkletNode(state.audioContext, "somasync-audio-capture", {
    processorOptions: { chunkMilliseconds: Number(config.audio?.chunkMilliseconds) || 80 }
  });
  state.silentGain = state.audioContext.createGain();
  state.silentGain.gain.value = 0;
  state.worklet.port.onmessage = onAudioChunk;
  source.connect(state.worklet);
  state.worklet.connect(state.silentGain).connect(state.audioContext.destination);
  await state.audioContext.resume();
}

function onAudioChunk(event) {
  const { samples, sampleRate, peak } = event.data || {};
  if (!samples || !state.sessionActive) return;
  const normalizedPeak = Math.max(0, Math.min(1, Number(peak) || 0));
  els.meter.style.width = `${Math.max(1, normalizedPeak * 100)}%`;
  els.meterLabel.textContent = normalizedPeak > .03 ? "Capturing" : "Input quiet";
  if (state.socket?.readyState !== WebSocket.OPEN) return; // Never buffer clinical audio in the browser.
  state.socket.send(floatToPcm16(samples, sampleRate, Number(config.audio?.targetSampleRate) || 16000));
}

function floatToPcm16(samples, sourceRate, targetRate) {
  const source = samples instanceof Float32Array ? samples : new Float32Array(samples);
  const rate = Number(sourceRate) || targetRate;
  const outputLength = Math.max(1, Math.round(source.length * targetRate / rate));
  const output = new Int16Array(outputLength);
  for (let index = 0; index < outputLength; index += 1) {
    const position = index * rate / targetRate;
    const left = Math.floor(position);
    const right = Math.min(left + 1, source.length - 1);
    const mix = position - left;
    const value = Math.max(-1, Math.min(1, source[left] * (1 - mix) + source[right] * mix));
    output[index] = value < 0 ? value * 0x8000 : value * 0x7fff;
  }
  return output.buffer;
}

function openSocket() {
  return new Promise((resolve, reject) => {
    let settled = false;
    let url;
    try { url = socketUrl(); } catch (error) { reject(error); return; }
    setChip(els.socketState, "Connecting", "working");
    const socket = new WebSocket(url, "somasync.stt.v1");
    socket.binaryType = "arraybuffer";
    state.socket = socket;
    socket.addEventListener("open", () => {
      socket.send(JSON.stringify({
        type: "start",
        protocolVersion: "1",
        encoding: "linear16",
        sampleRate: Number(config.audio?.targetSampleRate) || 16000,
        channels: 1,
        sessionReference: sanitizeSessionReference(els.sessionLabel.value)
      }));
      setChip(els.socketState, "Live", "connected");
      if (!settled) { settled = true; resolve(); }
    });
    socket.addEventListener("message", onSocketMessage);
    socket.addEventListener("close", (event) => onSocketClose(event));
    socket.addEventListener("error", () => {
      if (!settled) { settled = true; reject(new Error("The real-time transcription connection could not be opened.")); }
    });
  });
}

function sanitizeSessionReference(value) {
  return String(value || "").replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 64) || undefined;
}

function sendControlMessage(message) {
  if (state.socket?.readyState === WebSocket.OPEN) state.socket.send(JSON.stringify(message));
}

function onSocketMessage(event) {
  if (typeof event.data !== "string") return;
  let message;
  try { message = JSON.parse(event.data); } catch { return; }
  if (message.type === "ready") {
    setChip(els.socketState, "Live", "connected");
    return;
  }
  if (message.type === "transcript") {
    setTranscript(message.text, Boolean(message.isFinal));
    return;
  }
  if (message.type === "soap") {
    renderSoap(message.note);
    state.soapRequested = false;
    return;
  }
  if (message.type === "soap_error") {
    state.soapRequested = false;
    setChip(els.soapState, "Draft unavailable", "error");
    toast(message.message || "SOAP draft generation failed.", "error");
    return;
  }
  if (message.type === "error") {
    toast(message.message || "The transcription service reported an error.", "error");
  }
}

function onSocketClose(event) {
  if (state.socket && event.target !== state.socket) return;
  state.socket = null;
  if (!state.sessionActive) {
    setChip(els.socketState, "Offline", "idle");
    return;
  }
  setChip(els.socketState, "Reconnecting", "working");
  els.streamDetail.textContent = "Connection dropped. Audio is not buffered while the secure stream reconnects.";
  reconnectSocket();
}

function reconnectSocket() {
  if (!state.sessionActive) return;
  if (state.socketReconnectAttempt >= MAX_SOCKET_RECONNECTS) {
    setChip(els.socketState, "Disconnected", "error");
    els.streamDetail.textContent = "Streaming stopped after repeated connection failures. End the session and retry.";
    toast("The transcription stream could not be restored. No audio was retained in the browser.", "error");
    return;
  }
  const delay = Math.min(30_000, 1000 * (2 ** state.socketReconnectAttempt));
  state.socketReconnectAttempt += 1;
  window.clearTimeout(state.reconnectSocketTimer);
  state.reconnectSocketTimer = window.setTimeout(async () => {
    try {
      await openSocket();
      els.streamDetail.textContent = "Secure stream restored. Audio captured during reconnection was intentionally not retained.";
      toast("Real-time transcription stream restored.");
    } catch { reconnectSocket(); }
  }, delay);
}

function setTranscript(text, isFinal) {
  const safeText = String(text || "").trim();
  if (!safeText) return;
  if (isFinal) {
    state.finalTranscript.push(safeText);
    state.interimTranscript = "";
  } else {
    state.interimTranscript = safeText;
  }
  els.transcript.replaceChildren();
  if (!state.finalTranscript.length && !state.interimTranscript) {
    els.transcript.append(createTranscriptLine("Interim and final transcription will appear here while a session is active.", "empty-state"));
  }
  for (const line of state.finalTranscript) els.transcript.append(createTranscriptLine(line, "final"));
  if (state.interimTranscript) els.transcript.append(createTranscriptLine(state.interimTranscript, "interim"));
  els.transcript.scrollTop = els.transcript.scrollHeight;
  els.refreshSoap.disabled = !state.finalTranscript.length || state.soapRequested;
  setChip(els.soapState, state.finalTranscript.length ? "Draft available" : "Awaiting transcript", state.finalTranscript.length ? "working" : "idle");
}

function createTranscriptLine(text, className) {
  const line = document.createElement("p");
  line.className = className;
  line.textContent = text;
  return line;
}

function clearTranscript() {
  state.finalTranscript = [];
  state.interimTranscript = "";
  els.transcript.replaceChildren(createTranscriptLine("Interim and final transcription will appear here while a session is active.", "empty-state"));
  els.refreshSoap.disabled = true;
  setChip(els.soapState, "Awaiting transcript", "idle");
}

function assertSoapNote(note) {
  if (!note || typeof note !== "object" || Array.isArray(note)) throw new Error("The SOAP response was not a JSON object.");
  const allowed = ["subjective", "objective", "assessment", "plan"];
  const keys = Object.keys(note).sort();
  if (keys.length !== allowed.length || keys.some((key, index) => key !== allowed.sort()[index])) {
    throw new Error("The SOAP response did not match the required four-field schema.");
  }
  for (const key of allowed) if (typeof note[key] !== "string") throw new Error(`The SOAP ${key} field was invalid.`);
  return { subjective: note.subjective.trim(), objective: note.objective.trim(), assessment: note.assessment.trim(), plan: note.plan.trim() };
}

function renderSoap(note) {
  try {
    state.lastSoap = assertSoapNote(note);
    els.subjective.value = state.lastSoap.subjective;
    els.objective.value = state.lastSoap.objective;
    els.assessment.value = state.lastSoap.assessment;
    els.plan.value = state.lastSoap.plan;
    els.copySoap.disabled = false;
    setChip(els.soapState, "Review required", "connected");
  } catch (error) {
    setChip(els.soapState, "Invalid response", "error");
    toast(error.message, "error");
  }
}

function requestSoapDraft() {
  if (!state.finalTranscript.length) return;
  if (state.socket?.readyState !== WebSocket.OPEN) {
    toast("The live connection is unavailable. Reconnect before generating a SOAP draft.", "error");
    return;
  }
  state.soapRequested = true;
  els.refreshSoap.disabled = true;
  setChip(els.soapState, "Generating", "working");
  sendControlMessage({ type: "generate_soap", transcript: state.finalTranscript.join(" ") });
}

async function copySoapJson() {
  const draft = {
    subjective: els.subjective.value.trim(),
    objective: els.objective.value.trim(),
    assessment: els.assessment.value.trim(),
    plan: els.plan.value.trim()
  };
  try {
    await navigator.clipboard.writeText(JSON.stringify(assertSoapNote(draft), null, 2));
    toast("SOAP JSON copied. Review remains required before clinical use.");
  } catch {
    toast("The browser could not copy the SOAP JSON.", "error");
  }
}

function stopSession() {
  if (!state.sessionActive) return;
  state.sessionActive = false;
  window.clearTimeout(state.reconnectSocketTimer);
  sendControlMessage({ type: "stop" });
  state.socket?.close(1000, "session_complete");
  state.socket = null;
  state.worklet?.disconnect();
  state.silentGain?.disconnect();
  state.mediaStream?.getTracks().forEach((track) => track.stop());
  state.audioContext?.close();
  state.mediaStream = null;
  state.audioContext = null;
  state.worklet = null;
  state.silentGain = null;
  stopTimer();
  els.meter.style.width = "0%";
  els.meterLabel.textContent = "Input quiet";
  els.startSession.disabled = !els.audioInput.value;
  els.stopSession.disabled = true;
  setChip(els.socketState, "Offline", "idle");
  els.streamDetail.textContent = "Session stopped. No audio is retained by the browser.";
}

async function submitBetaLead(event) {
  event.preventDefault();
  const beta = config.betaLead || {};
  const email = els.betaEmail.value.trim().toLowerCase();
  const button = els.betaForm.querySelector("button[type=submit]");
  if (!beta.supabaseUrl || !beta.publishableKey) {
    els.betaMessage.textContent = "Beta requests are temporarily unavailable. Please try again later.";
    return;
  }
  button.disabled = true;
  els.betaMessage.textContent = "Submitting your beta request…";
  try {
    const response = await fetch(`${beta.supabaseUrl.replace(/\/$/, "")}/rest/v1/beta_leads`, {
      method: "POST",
      headers: {
        apikey: beta.publishableKey,
        Authorization: `Bearer ${beta.publishableKey}`,
        "Content-Type": "application/json",
        "Content-Profile": "public",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({ email })
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      if (body.code !== "23505") throw new Error("Beta lead submission failed.");
    }
    els.betaForm.reset();
    els.betaMessage.textContent = "Thanks — your beta request was received. If approved, we will send access instructions by email.";
  } catch {
    els.betaMessage.textContent = "Something went wrong. Please try again later.";
  } finally {
    button.disabled = false;
  }
}

function reportError(error) {
  const message = error instanceof Error ? error.message : "An unexpected error occurred.";
  setChip(els.socketState, "Attention needed", "error");
  toast(message, "error");
  if (!state.sessionActive) els.startSession.disabled = !els.audioInput.value;
}

async function initialize() {
  if (els.calendarLink && config.calendarOrigin) els.calendarLink.href = config.calendarOrigin;
  if (!window.isSecureContext) toast("Clinical device and microphone features require HTTPS.", "error");
  if (!isBluetoothSupported()) {
    els.connectDevice.disabled = true;
    els.connectDevice.title = "Web Bluetooth requires a supported Chromium-based browser over HTTPS.";
  }
  try {
    await navigator.mediaDevices?.getUserMedia({ audio: true, video: false }).then((stream) => stream.getTracks().forEach((track) => track.stop()));
    await enumerateAudioInputs();
    els.audioInput.disabled = false;
  } catch {
    // Permission is requested again only when the clinician starts a session.
  }
  navigator.mediaDevices?.addEventListener?.("devicechange", () => enumerateAudioInputs().catch(() => {}));
}

els.connectDevice.addEventListener("click", () => connectBluetoothDevice().catch(reportError));
els.disconnectDevice.addEventListener("click", () => disconnectBluetoothDevice().catch(reportError));
els.audioInput.addEventListener("change", () => { els.startSession.disabled = !els.audioInput.value || state.sessionActive; });
els.startSession.addEventListener("click", () => startSession().catch((error) => { stopSession(); reportError(error); }));
els.stopSession.addEventListener("click", stopSession);
els.clearTranscript.addEventListener("click", clearTranscript);
els.refreshSoap.addEventListener("click", requestSoapDraft);
els.copySoap.addEventListener("click", copySoapJson);
els.betaForm.addEventListener("submit", submitBetaLead);
window.addEventListener("beforeunload", stopSession);
initialize();
