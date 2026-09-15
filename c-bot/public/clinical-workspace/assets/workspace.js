(() => {
  "use strict";

  const config = window.SomaSyncClinicalConfig;
  const state = {
    microphoneStream: null,
    audioContext: null,
    source: null,
    analyser: null,
    worklet: null,
    silentGain: null,
    signalFrame: null,
    socket: null,
    socketReady: false,
    active: false,
    stoppedByClinician: false,
    reconnectAttempt: 0,
    reconnectTimer: null,
    reconnectGapPending: false,
    reconnectGaps: 0,
    streamSegment: 0,
    finalEvents: 0,
    audioFrames: 0,
    audioBuffer: [],
    audioBufferBytes: 0,
    audioBufferLimit: 96_000,
    sessionStartedAt: null,
    timer: null,
    streamId: null,
    bluetoothDevice: null,
    batteryCharacteristic: null,
    eventCount: 0
  };

  const els = Object.fromEntries([
    "clinicalWorkspace", "signInRequired", "authDot", "authStatus", "sessionClock", "signalCanvas", "signalState", "inputLevel",
    "pcmFrames", "sampleRate", "streamState", "streamSegment", "finalEvents", "reconnectGaps", "eventTrail", "eventCount",
    "recordingPill", "deviceName", "deviceDetail", "deviceState", "batteryLevel", "connectDevice", "microphoneName", "selectMicrophone",
    "startSession", "stopSession", "captureError", "socketLabel", "transcript", "transcriptMeta", "clearTranscript", "generateSoap", "soapStatus",
    "soapSubjective", "soapObjective", "soapAssessment", "soapPlan", "clinicianReviewed", "exportDraft"
  ].map((id) => [id, document.getElementById(id)]));

  const cleanText = (value) => String(value || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, " ").trim();
  const apiUrl = (path) => `${config.apiBaseUrl.replace(/\/$/, "")}${path}`;
  const realtimeUrl = () => apiUrl("/realtime/transcription").replace(/^https:/, "wss:").replace(/^http:/, "ws:");

  function csrfCookie() {
    const prefix = `${encodeURIComponent(config.csrfCookieName)}=`;
    return document.cookie.split(";").map((value) => value.trim()).find((value) => value.startsWith(prefix))?.slice(prefix.length) || "";
  }

  function elapsed() {
    if (!state.sessionStartedAt) return "00:00:00";
    const total = Math.floor((Date.now() - state.sessionStartedAt) / 1000);
    return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60].map((part) => String(part).padStart(2, "0")).join(":");
  }

  function setAuth(message, kind = "") {
    els.authStatus.textContent = message;
    els.authDot.className = kind ? kind : "";
  }

  function setError(message = "") {
    els.captureError.hidden = !message;
    els.captureError.textContent = message;
  }

  function setInstrumentState(element, message, kind = "") {
    element.textContent = message;
    element.className = `instrument-state${kind ? ` ${kind}` : ""}`;
  }

  function setSocketLabel(message, kind = "") {
    els.socketLabel.textContent = message;
    els.socketLabel.className = `socket-label${kind ? ` ${kind}` : ""}`;
  }

  function setRecording(active, warning = false) {
    els.recordingPill.textContent = active ? (warning ? "RECONNECTING" : "RECORDING") : "NOT RECORDING";
    els.recordingPill.className = `recording-pill${active ? (warning ? " warn" : " live") : ""}`;
    els.startSession.disabled = active || !state.microphoneStream;
    els.stopSession.disabled = !active;
    els.connectDevice.disabled = active;
    els.selectMicrophone.disabled = active;
    setInstrumentState(els.signalState, active ? (warning ? "BUFFERING" : "LIVE") : "OFFLINE", active ? (warning ? "warn" : "live") : "");
  }

  function setSoapStatus(message, kind = "") {
    els.soapStatus.textContent = message;
    els.soapStatus.className = `soap-status${kind ? ` ${kind}` : ""}`;
  }

  // Browser-only display of fixed operational labels; never add clinical content or identifiers here.
  function addEvent(code, label, kind = "") {
    const empty = els.eventTrail.querySelector(".empty-event");
    if (empty) empty.remove();
    const event = document.createElement("li");
    if (kind) event.classList.add(kind);
    const time = document.createElement("span");
    time.className = "event-time";
    time.textContent = elapsed();
    const eventCode = document.createElement("span");
    eventCode.className = "event-code";
    eventCode.textContent = code;
    event.append(time, eventCode, document.createTextNode(` — ${label}`));
    els.eventTrail.prepend(event);
    while (els.eventTrail.children.length > 12) els.eventTrail.lastElementChild?.remove();
    state.eventCount += 1;
    setInstrumentState(els.eventCount, `${state.eventCount} EVENT${state.eventCount === 1 ? "" : "S"}`, "live");
  }

  function resetInstruments() {
    state.reconnectGaps = 0;
    state.streamSegment = 0;
    state.finalEvents = 0;
    state.audioFrames = 0;
    state.eventCount = 0;
    els.inputLevel.textContent = "0";
    els.pcmFrames.textContent = "0";
    els.sampleRate.textContent = `${Math.round(config.audio.sampleRate / 1000)} kHz`;
    els.streamSegment.textContent = "—";
    els.finalEvents.textContent = "0";
    els.reconnectGaps.textContent = "0";
    setInstrumentState(els.streamState, "WAITING");
    setInstrumentState(els.eventCount, "0 EVENTS");
    els.eventTrail.replaceChildren();
    const empty = document.createElement("li");
    empty.className = "empty-event";
    empty.textContent = "Operational session events appear here. They contain state codes only—never audio, transcript, SOAP content, credentials, or device identifiers.";
    els.eventTrail.append(empty);
  }

  function resizeCanvas() {
    const canvas = els.signalCanvas;
    const bounds = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.round(bounds.width * dpr));
    const height = Math.max(1, Math.round(bounds.height * dpr));
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    const context = canvas.getContext("2d");
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { context, width: bounds.width, height: bounds.height };
  }

  function drawSignal() {
    const { context, width, height } = resizeCanvas();
    context.clearRect(0, 0, width, height);
    if (!state.active || !state.analyser) { state.signalFrame = null; return; }
    const samples = new Uint8Array(state.analyser.fftSize);
    state.analyser.getByteTimeDomainData(samples);
    let peak = 0;
    context.beginPath();
    for (let index = 0; index < samples.length; index += 1) {
      const normalized = (samples[index] - 128) / 128;
      peak = Math.max(peak, Math.abs(normalized));
      const x = (index / (samples.length - 1)) * width;
      const y = height / 2 + normalized * height * .4;
      if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
    }
    const gradient = context.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#62e6da"); gradient.addColorStop(1, "#8db8ff");
    context.strokeStyle = gradient; context.lineWidth = 1.8; context.stroke();
    els.inputLevel.textContent = String(Math.min(100, Math.round(peak * 170)));
    state.signalFrame = window.requestAnimationFrame(drawSignal);
  }

  function startSignal() { if (state.signalFrame) cancelAnimationFrame(state.signalFrame); state.signalFrame = requestAnimationFrame(drawSignal); }
  function stopSignal() { if (state.signalFrame) cancelAnimationFrame(state.signalFrame); state.signalFrame = null; const { context, width, height } = resizeCanvas(); context.clearRect(0, 0, width, height); els.inputLevel.textContent = "0"; }

  function addTranscript(text, isFinal) {
    const textValue = cleanText(text);
    if (!textValue) return;
    els.transcript.querySelector(".empty-transcript")?.remove();
    els.transcript.querySelector(".interim")?.remove();
    const line = document.createElement("p");
    line.textContent = textValue;
    line.className = isFinal ? "final" : "interim";
    els.transcript.append(line);
    els.transcript.scrollTop = els.transcript.scrollHeight;
    if (isFinal) {
      state.finalEvents += 1;
      els.finalEvents.textContent = String(state.finalEvents);
      els.generateSoap.disabled = !state.active;
      els.clearTranscript.disabled = false;
      addEvent("FINAL_TRANSCRIPT", "Final context is available for clinician review.");
      setSoapStatus("Final transcript context is available. Request a draft only when ready to review it.", "ready");
    }
    els.transcriptMeta.textContent = `${state.finalEvents} final event${state.finalEvents === 1 ? "" : "s"} received. Raw audio is not stored in this browser.`;
  }

  function markReconnectGap() {
    els.transcript.querySelector(".empty-transcript")?.remove();
    const line = document.createElement("p");
    line.className = "gap";
    line.textContent = "Secure stream recovered. Review the surrounding transcript for a possible reconnection gap.";
    els.transcript.append(line);
    els.transcript.scrollTop = els.transcript.scrollHeight;
    state.reconnectGaps += 1;
    els.reconnectGaps.textContent = String(state.reconnectGaps);
    addEvent("STREAM_RECOVERED", "Potential transcript gap marked for clinician review.", "warn");
  }

  function clearTranscript() {
    els.transcript.replaceChildren();
    const empty = document.createElement("p");
    empty.className = "empty-transcript";
    empty.textContent = "Transcript display cleared. Final context remains only for the active session and is cleared when it ends.";
    els.transcript.append(empty);
    els.clearTranscript.disabled = true;
  }

  function clearSoap() {
    [els.soapSubjective, els.soapObjective, els.soapAssessment, els.soapPlan].forEach((field) => { field.value = ""; });
    els.clinicianReviewed.checked = false;
    els.exportDraft.disabled = true;
  }

  function updateBattery(event) {
    const value = event.target?.value || event;
    if (value instanceof DataView) els.batteryLevel.textContent = `${value.getUint8(0)}%`;
  }

  function disconnectedDevice() {
    state.batteryCharacteristic?.removeEventListener("characteristicvaluechanged", updateBattery);
    state.batteryCharacteristic = null;
    els.deviceState.textContent = "Disconnected";
    els.deviceDetail.textContent = "The companion control connection ended. Browser audio capture is managed separately.";
    els.batteryLevel.textContent = "—";
    addEvent("BLE_DISCONNECTED", "Companion control channel ended.", "warn");
  }

  async function connectDevice() {
    setError();
    if (!navigator.bluetooth) return setError("Web Bluetooth is unavailable in this browser. Use current Chrome or Edge over HTTPS, or continue with an approved microphone without the companion device.");
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: config.bluetooth.deviceNamePrefix }],
        optionalServices: ["battery_service", ...(config.bluetooth.controlServiceUuid ? [config.bluetooth.controlServiceUuid] : [])]
      });
      state.bluetoothDevice?.removeEventListener("gattserverdisconnected", disconnectedDevice);
      state.bluetoothDevice = device;
      device.addEventListener("gattserverdisconnected", disconnectedDevice);
      els.deviceState.textContent = "Connecting…";
      const server = await device.gatt?.connect();
      if (!server) throw new Error("No compatible GATT server is available.");
      els.deviceName.textContent = device.name || "SomaSync companion";
      els.deviceDetail.textContent = "Companion connected. Standard Battery Service updates are shown when supported.";
      els.deviceState.textContent = "Connected";
      addEvent("BLE_CONNECTED", "Companion control and telemetry channel available.");
      try {
        const service = await server.getPrimaryService("battery_service");
        const battery = await service.getCharacteristic("battery_level");
        state.batteryCharacteristic = battery;
        updateBattery(await battery.readValue());
        await battery.startNotifications();
        battery.addEventListener("characteristicvaluechanged", updateBattery);
      } catch { els.batteryLevel.textContent = "Unavailable"; }
    } catch (error) {
      if (error?.name !== "NotFoundError") setError("The companion device could not be connected. Confirm it is powered, nearby, and available.");
    }
  }

  function stopMicrophone() { state.microphoneStream?.getTracks().forEach((track) => track.stop()); state.microphoneStream = null; }

  async function selectMicrophone() {
    setError();
    try {
      stopMicrophone();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, sampleRate: config.audio.sampleRate, echoCancellation: false, noiseSuppression: false, autoGainControl: false }, video: false });
      state.microphoneStream = stream;
      const track = stream.getAudioTracks()[0];
      track.addEventListener("ended", () => { if (state.active) stopSession(); state.microphoneStream = null; els.microphoneName.textContent = "Microphone permission ended"; setRecording(false); });
      els.microphoneName.textContent = track.label || "Approved microphone selected";
      els.startSession.disabled = false;
      setInstrumentState(els.signalState, "ARMED", "warn");
      addEvent("MICROPHONE_GRANTED", "Microphone permission is active; no audio has been sent.");
    } catch { setError("Microphone access is required to begin a secure session. No audio was captured."); }
  }

  function enqueueAudio(frame) {
    state.audioBuffer.push(frame); state.audioBufferBytes += frame.byteLength;
    while (state.audioBufferBytes > state.audioBufferLimit && state.audioBuffer.length) { const removed = state.audioBuffer.shift(); state.audioBufferBytes -= removed.byteLength; }
  }

  function flushAudio() {
    if (!state.socketReady || state.socket?.readyState !== WebSocket.OPEN) return;
    while (state.audioBuffer.length && state.socket.bufferedAmount < config.audio.maxBrowserBufferedBytes) { const frame = state.audioBuffer.shift(); state.audioBufferBytes -= frame.byteLength; state.socket.send(frame); }
  }

  async function startAudioPipeline() {
    if (!state.microphoneStream) throw new Error("Select a microphone before starting a secure session.");
    const context = new AudioContext({ sampleRate: config.audio.sampleRate, latencyHint: "interactive" });
    state.audioBufferLimit = Math.round(context.sampleRate * 2 * config.audio.reconnectBufferSeconds);
    await context.audioWorklet.addModule("/clinical-workspace/assets/audio-worklet.js");
    const source = context.createMediaStreamSource(state.microphoneStream);
    const analyser = context.createAnalyser(); analyser.fftSize = 1024; analyser.smoothingTimeConstant = .72;
    const worklet = new AudioWorkletNode(context, "somasync-pcm-processor", { numberOfInputs: 1, numberOfOutputs: 1, channelCount: 1 });
    const silentGain = context.createGain(); silentGain.gain.value = 0;
    worklet.port.onmessage = ({ data }) => {
      if (!state.active || !(data instanceof ArrayBuffer)) return;
      state.audioFrames += 1; if (state.audioFrames % 8 === 0) els.pcmFrames.textContent = String(state.audioFrames);
      if (state.socketReady && state.socket?.readyState === WebSocket.OPEN && state.socket.bufferedAmount < config.audio.maxBrowserBufferedBytes) state.socket.send(data); else enqueueAudio(data);
    };
    source.connect(analyser); source.connect(worklet); worklet.connect(silentGain); silentGain.connect(context.destination);
    state.audioContext = context; state.source = source; state.analyser = analyser; state.worklet = worklet; state.silentGain = silentGain;
    els.sampleRate.textContent = `${Math.round(context.sampleRate / 1000)} kHz`;
    await context.resume(); startSignal();
  }

  async function stopAudioPipeline() {
    stopSignal(); state.worklet?.port.close(); state.worklet?.disconnect(); state.source?.disconnect(); state.analyser?.disconnect(); state.silentGain?.disconnect();
    state.worklet = null; state.source = null; state.analyser = null; state.silentGain = null;
    if (state.audioContext && state.audioContext.state !== "closed") await state.audioContext.close();
    state.audioContext = null; state.audioBuffer = []; state.audioBufferBytes = 0; state.audioBufferLimit = 96_000;
  }

  function openSocket() {
    const csrf = csrfCookie();
    if (!csrf) throw new Error("Secure session verification is missing. Sign in again.");
    const socket = new WebSocket(realtimeUrl(), ["somasync.stt.v1", `somasync-csrf.${csrf}`]);
    socket.binaryType = "arraybuffer"; state.socket = socket;
    setSocketLabel(state.reconnectAttempt ? "Reconnecting…" : "Connecting…", "warn"); setInstrumentState(els.streamState, state.reconnectAttempt ? "RECONNECTING" : "NEGOTIATING", "warn");
    socket.addEventListener("open", () => { if (state.socket !== socket || !state.active) return socket.close(1000, "inactive_session"); socket.send(JSON.stringify({ type: "start", protocolVersion: "1", encoding: "linear16", sampleRate: state.audioContext?.sampleRate || config.audio.sampleRate, channels: 1, streamId: state.streamId })); });
    socket.addEventListener("message", ({ data }) => handleMessage(socket, data));
    socket.addEventListener("error", () => setSocketLabel("Connection issue", "warn"));
    socket.addEventListener("close", () => { if (state.socket === socket) { state.socketReady = false; state.socket = null; } if (state.active && !state.stoppedByClinician) scheduleReconnect(); else { setSocketLabel("Disconnected"); if (!state.active) setInstrumentState(els.streamState, "SESSION CLOSED"); } });
  }

  function handleMessage(socket, raw) {
    let message; try { message = JSON.parse(raw); } catch { return; }
    if (socket !== state.socket) return;
    if (message.type === "ready") {
      const recovered = state.reconnectGapPending; state.socketReady = true; state.streamSegment += 1; state.reconnectAttempt = 0;
      els.streamSegment.textContent = String(state.streamSegment).padStart(2, "0"); setSocketLabel("Secure stream connected", "live"); setInstrumentState(els.streamState, "LIVE / WSS", "live"); setRecording(true); flushAudio();
      if (recovered) { state.reconnectGapPending = false; markReconnectGap(); } else addEvent("WSS_CONNECTED", "Secure transcription stream established.");
    } else if (message.type === "transcript") addTranscript(message.text, Boolean(message.isFinal));
    else if (message.type === "flow_control") { setSocketLabel("Stream catching up", "warn"); setInstrumentState(els.streamState, "FLOW CONTROL", "warn"); addEvent("FLOW_CONTROL", "Gateway requested controlled stream catch-up.", "warn"); }
    else if (message.type === "soap") populateSoap(message.note);
    else if (message.type === "soap_error") setSoapStatus(message.message || "The strict SOAP draft could not be generated.", "error");
    else if (message.type === "error") { setError("The secure session received an invalid response or interrupted transcription stream."); addEvent("STREAM_ERROR", "Gateway reported an operational error.", "error"); }
  }

  function scheduleReconnect() {
    if (state.reconnectTimer || state.reconnectAttempt >= config.realtime.maxReconnectAttempts) {
      if (state.reconnectAttempt >= config.realtime.maxReconnectAttempts) { setError("The real-time stream could not reconnect. Stop and restart when the connection is stable."); setInstrumentState(els.streamState, "RECOVERY STOPPED", "error"); addEvent("RECONNECT_EXHAUSTED", "Maximum reconnect attempts reached.", "error"); }
      return;
    }
    const delay = Math.min(1000 * (2 ** state.reconnectAttempt), 8_000); state.reconnectAttempt += 1; state.reconnectGapPending = true;
    setRecording(true, true); setSocketLabel(`Reconnecting in ${Math.round(delay / 1000)}s…`, "warn"); setInstrumentState(els.streamState, "RECONNECTING", "warn"); addEvent("RECONNECT_SCHEDULED", "Bounded in-memory recovery buffer is active.", "warn");
    state.reconnectTimer = setTimeout(() => { state.reconnectTimer = null; if (state.active) openSocket(); }, delay);
  }

  function populateSoap(note) {
    const keys = ["subjective", "objective", "assessment", "plan"];
    if (!note || Object.keys(note).length !== 4 || !keys.every((key) => typeof note[key] === "string")) { addEvent("SOAP_REJECTED", "Response failed the exact four-field schema.", "error"); return setSoapStatus("The returned draft failed the required SOAP schema and was rejected.", "error"); }
    els.soapSubjective.value = note.subjective; els.soapObjective.value = note.objective; els.soapAssessment.value = note.assessment; els.soapPlan.value = note.plan; els.clinicianReviewed.checked = false; els.exportDraft.disabled = true;
    addEvent("SOAP_DRAFT_READY", "Strict four-field draft is ready for clinician review."); setSoapStatus("Strict SOAP draft received. Review and edit every section before export.", "ready");
  }

  async function startSession() {
    setError(); clearSoap();
    if (!state.microphoneStream) return setError("Select a microphone before starting a secure session.");
    try {
      state.active = true; state.stoppedByClinician = false; state.streamId = crypto.randomUUID(); state.sessionStartedAt = Date.now(); state.reconnectAttempt = 0; state.reconnectGapPending = false; state.audioBuffer = []; state.audioBufferBytes = 0;
      resetInstruments(); els.sessionClock.textContent = elapsed(); state.timer = setInterval(() => { els.sessionClock.textContent = elapsed(); }, 1000); setRecording(true, true); setSoapStatus("Waiting for final transcript context before drafting."); addEvent("SESSION_STARTED", "Clinician initiated a secure documentation session.");
      await startAudioPipeline(); openSocket();
    } catch (error) { setError(error?.message || "The secure session could not start."); await stopSession(); }
  }

  async function stopSession() {
    const wasActive = state.active; state.active = false; state.stoppedByClinician = true; clearInterval(state.timer); clearTimeout(state.reconnectTimer); state.timer = null; state.reconnectTimer = null;
    if (state.socket?.readyState === WebSocket.OPEN) state.socket.send(JSON.stringify({ type: "stop" })); state.socket?.close(1000, "clinician_stopped_session"); state.socket = null; state.socketReady = false;
    await stopAudioPipeline(); state.streamId = null; state.sessionStartedAt = null; els.sessionClock.textContent = "00:00:00"; setRecording(false); setSocketLabel("Disconnected"); setInstrumentState(els.streamState, "SESSION CLOSED"); els.generateSoap.disabled = true; setSoapStatus("Session stopped. Final transcript context and in-memory recovery audio have been cleared.");
    if (wasActive) addEvent("SESSION_STOPPED", "Clinician stopped the session; in-memory recovery audio was cleared.");
  }

  function requestSoap() {
    if (!state.socketReady || state.socket?.readyState !== WebSocket.OPEN) return;
    setSoapStatus("Requesting strict SOAP draft…"); addEvent("SOAP_REQUESTED", "Strict draft requested from active final transcript context."); state.socket.send(JSON.stringify({ type: "generate_soap" }));
  }

  function exportDraft() {
    if (!els.clinicianReviewed.checked) return;
    const body = [["Subjective", els.soapSubjective.value], ["Objective", els.soapObjective.value], ["Assessment", els.soapAssessment.value], ["Plan", els.soapPlan.value]].map(([title, value]) => `${title}\n${cleanText(value)}\n`).join("\n");
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `somasync-clinician-reviewed-draft-${new Date().toISOString().slice(0, 10)}.txt`; link.click(); URL.revokeObjectURL(link.href); addEvent("DRAFT_EXPORTED", "Clinician-reviewed draft exported from this session.");
  }

  async function verifySession() {
    try {
      const response = await fetch(apiUrl("/auth/session"), { credentials: "include", cache: "no-store", headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("missing_session");
      els.clinicalWorkspace.hidden = false; setAuth("Secure session ready", "ready");
    } catch { els.signInRequired.hidden = false; setAuth("Sign-in required", "problem"); }
  }

  els.connectDevice.addEventListener("click", connectDevice); els.selectMicrophone.addEventListener("click", selectMicrophone); els.startSession.addEventListener("click", startSession); els.stopSession.addEventListener("click", stopSession); els.clearTranscript.addEventListener("click", clearTranscript); els.generateSoap.addEventListener("click", requestSoap); els.clinicianReviewed.addEventListener("change", () => { els.exportDraft.disabled = !els.clinicianReviewed.checked || !els.soapSubjective.value; }); els.exportDraft.addEventListener("click", exportDraft); window.addEventListener("resize", () => { if (state.active) resizeCanvas(); }); window.addEventListener("beforeunload", () => { if (state.active) state.socket?.close(1000, "page_unload"); });
  verifySession();
})();
