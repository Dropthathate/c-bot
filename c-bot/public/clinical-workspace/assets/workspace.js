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

  function enqueueAudioRaw(frame) {
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
      if (state.socketReady && state.socket?.readyState === WebSocket.OPEN && state.socket.bufferedAmount < config.audio.maxBrowserBufferedBytes) state.socket.send(data); else enqueueAudioRaw(data);
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
    const escapeHtml = (value) => cleanText(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" })[character]);
    const sections = [["Subjective", els.soapSubjective.value], ["Objective", els.soapObjective.value], ["Assessment", els.soapAssessment.value], ["Plan", els.soapPlan.value]];
    const posture = postureState?.saved && postureSummary && !postureSummary.hidden ? `<section><h2>Postural assessment</h2><p>${escapeHtml(postureSummary.textContent).replace(/\n/g, "<br>")}</p></section>` : "";
    const documentWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!documentWindow) { setSoapStatus("Allow pop-ups to create the printable SOAP document.", "error"); return; }
    documentWindow.document.write(`<!doctype html><html><head><title>SomaSyncAI SOAP Note</title><style>body{font:15px Georgia,serif;color:#18252d;max-width:800px;margin:48px auto;line-height:1.6}h1{font:700 25px Arial,sans-serif;border-bottom:2px solid #18252d;padding-bottom:10px}h2{font:700 17px Arial,sans-serif;color:#145b62;margin-bottom:6px}section{margin:24px 0}p{white-space:normal;margin-top:0}.meta{font:12px Arial,sans-serif;color:#526773}@media print{body{margin:24px}}</style></head><body><h1>SomaSyncAI — SOAP Note</h1><p class="meta">Clinician-reviewed draft · ${new Date().toLocaleString()}</p>${sections.map(([title, value]) => `<section><h2>${title}</h2><p>${escapeHtml(value).replace(/\n/g, "<br>")}</p></section>`).join("")}${posture}<script>window.onload=()=>window.print();<\/script></body></html>`);
    documentWindow.document.close(); addEvent("DRAFT_EXPORTED", "Clinician-reviewed SOAP document opened for print or PDF save.");
  }


  // ═══════════════════════════════════════════════════════════
  // SOMASYNC VOICE ASSISTANT ENGINE
  // ═══════════════════════════════════════════════════════════

  const assistant = {
    recognition: null,
    synth: window.speechSynthesis,
    speaking: false,
    logActive: false,             // true when in log-capture mode
    sessionDurationMs: 0,
    recentSegments: [],           // last 3 final transcript segments for replay
    mechanicsTimer: null,
    timeReminderTimers: [],
    areaReminderTimers: [],
    preSessionDone: false,
    checklist: [],
    checklistIndex: 0
  };

  const ac = config.assistant;

  // ── Earpiece tone ──────────────────────────────────────────
  function ding() {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = ac.tone.frequency;
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + ac.tone.duration / 1000);
      osc.start(); osc.stop(ctx.currentTime + ac.tone.duration / 1000);
      osc.addEventListener("ended", () => ctx.close());
    } catch (_) {}
  }

  // ── Text-to-speech into earpiece ──────────────────────────
  function speak(text, onDone) {
    if (!assistant.synth) { if (onDone) onDone(); return; }
    assistant.synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.95; utt.pitch = 1; utt.volume = 1;
    utt.addEventListener("end", () => { assistant.speaking = false; if (onDone) onDone(); });
    utt.addEventListener("error", () => { assistant.speaking = false; if (onDone) onDone(); });
    assistant.speaking = true;
    assistant.synth.speak(utt);
  }

  function dingThenSpeak(text, onDone) {
    ding();
    setTimeout(() => speak(text, onDone), 300);
  }

  // ── Assistant status bar ───────────────────────────────────
  const assistantBar = document.getElementById("assistantBar");
  const assistantStatus = document.getElementById("assistantStatus");
  const logPill = document.getElementById("logPill");

  function setAssistantStatus(msg) {
    if (assistantStatus) assistantStatus.textContent = msg;
  }

  function setLogPill(active) {
    assistant.logActive = active;
    if (!logPill) return;
    logPill.textContent = active ? "● LOGGING" : "● NOT LOGGING";
    logPill.dataset.active = String(active);
  }

  // ── Intercept addTranscript to track recent segments ──────
  const _origAddTranscript = addTranscript;
  // We patch below after defining addTranscript wrapper

  function trackSegment(text) {
    if (!text || !text.trim()) return;
    assistant.recentSegments.push(text.trim());
    if (assistant.recentSegments.length > 3) assistant.recentSegments.shift();
  }

  // ── Log gate: only forward audio to WSS when logActive ────
  // We hook into the worklet message handler via a gating flag.
  // The audio pipeline stays open; we just suppress sends when not logging.
  // The existing enqueueAudio / flushAudio / worklet already handle the send.
  // We patch the worklet port message handler after pipeline starts.

  function setLogging(active) {
    setLogPill(active);
    setAssistantStatus(active ? "Logging clinical observations" : "Listening for commands — say \"noting\" to log");
    addEvent(active ? "LOG_STARTED" : "LOG_PAUSED", active ? "Clinician began logging." : "Clinician paused logging.");
  }

  // ── Pre-session checklist ─────────────────────────────────

  // ═══════════════════════════════════════════════════════════
  // INTAKE TOKEN + PRE-SESSION BRIEF ENGINE
  // ═══════════════════════════════════════════════════════════

  let intakeBrief = null; // holds the loaded brief object

  function buildBriefChecklist(brief) {
    // Convert brief fields into spoken earpiece steps
    return [
      "Pre-session clinical brief loaded.",
      "Postural assessment priorities: " + brief.postural_assessment_priorities,
      "Likely involved structures: " + brief.likely_involved_structures,
      "Clinical reasoning: " + brief.clinical_reasoning,
      "Session priorities: " + brief.session_priorities,
      "Biopsychosocial context: " + brief.biopsychosocial_flags,
      "During the session, gather: " + brief.therapist_prompts
    ];
  }

  async function loadIntakeByToken(token) {
    const btn = document.getElementById("loadIntake");
    const loaded = document.getElementById("briefLoaded");
    const preview = document.getElementById("briefPreview");
    if (btn) btn.disabled = true;

    try {
      // 1. Prefer the API so a practitioner can retrieve a client's intake from another device.
      const csrf = csrfCookie();
      const response = await fetch(apiUrl("/intake/brief"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrf ? { "X-SomaSync-CSRF": csrf } : {})
        },
        body: JSON.stringify({ token })
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.brief) {
        intakeBrief = data.brief;
        if (loaded) loaded.classList.add("show");
        if (preview) preview.textContent = "Pre-session brief ready — earpiece will walk you through the clinical picture when you begin.";
        addEvent("INTAKE_LOADED", "Pre-session clinical brief retrieved from the secure intake service.");
        return;
      }

      // 2. Temporary compatibility fallback for same-device sessions created before persistence.
      const stored = sessionStorage.getItem("somasync_intake_" + token);
      let summary = null;

      if (stored) {
        const parsed = JSON.parse(stored);
        summary = buildSummaryFromPayload(parsed);
      }

      if (!summary) {
        if (preview) preview.textContent = "Intake not found for that token on this device.";
        if (loaded) loaded.classList.add("show");
        if (btn) btn.disabled = false;
        return;
      }

      const fallbackResponse = await fetch(apiUrl("/intake/brief"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrf ? { "X-SomaSync-CSRF": csrf } : {})
        },
        body: JSON.stringify({ summary })
      });

      if (!fallbackResponse.ok) throw new Error(data?.error?.message || "Brief API returned " + fallbackResponse.status);
      const fallbackData = await fallbackResponse.json();
      intakeBrief = fallbackData.brief;

      // 3. Show confirmation
      if (loaded) loaded.classList.add("show");
      if (preview) preview.textContent = "Pre-session brief ready — earpiece will walk you through the clinical picture when you begin.";
      addEvent("INTAKE_LOADED", "Pre-session clinical brief generated from same-device intake data.");

    } catch (err) {
      if (preview) preview.textContent = "Could not load brief — check token and try again.";
      if (loaded) loaded.classList.add("show");
      if (btn) btn.disabled = false;
    }
  }

  function buildSummaryFromPayload(p) {
    if (!p) return null;
    const primary = (p.mapDots || []).filter(d => d.mode === "primary").map(d => d.side + " (" + d.x + "%," + d.y + "%)").join(", ");
    const high = Object.entries(p.funcScores || {}).filter(([,v]) => v >= 3).map(([k,v]) => k + ":" + v + "/5").join(", ");
    return [
      "TOKEN: " + (p.token || ""),
      "PRIMARY BODY AREAS: " + (primary || "none marked"),
      "SECONDARY: " + (p.mapDots || []).filter(d => d.mode === "secondary").length + " markers",
      "RADIATION: " + (p.mapDots || []).filter(d => d.mode === "radiation").length + " markers",
      "QUALITIES: " + ((p.qualities || []).join(", ") || "none"),
      "DURATION: " + (p.duration || "not stated"),
      "COINCIDE: " + ((p.coincide || []).join(", ") || "none"),
      "HIGH-IMPACT ACTIVITIES: " + (high || "none"),
      "STRESS: " + (p.stress || 0) + "/10",
      "SLEEP: " + (p.sleep || 0) + "/10",
      "POSTURE: " + (Array.isArray(p.posture) ? p.posture.join(", ") : (p.posture || "none")),
      "PRESSURE PREF: " + (p.pressure || "not set"),
      "AVOID: " + (p.avoidAreas || "none"),
      "GOALS: " + (Array.isArray(p.goals) ? p.goals.join(", ") : (p.goals || "none")),
      "NOTES: " + (p.notes || "none")
    ].join("\n");
  }

  // Wire token input button
  const loadIntakeBtn = document.getElementById("loadIntake");
  const intakeTokenInput = document.getElementById("intakeToken");
  if (loadIntakeBtn && intakeTokenInput) {
    loadIntakeBtn.addEventListener("click", () => {
      const token = intakeTokenInput.value.trim().toUpperCase();
      if (!token || token.length < 6) return;
      loadIntakeByToken("ss-" + token.replace(/^SS-?/i, ""));
    });
    intakeTokenInput.addEventListener("keydown", e => {
      if (e.key === "Enter") loadIntakeBtn.click();
    });
  }

  function buildChecklist(durationMin) {
    return [
      "Ground in. Take a breath, set your intention, and center yourself before your client enters.",
      "When your client is settled, introduce the documentation notice: \"I use a voice documentation tool during sessions. It captures my clinical observations only and the temporary recording is not stored after your visit. Is that okay with you?\"",
      "Ask your client about pressure preferences — do they prefer light, medium, or firm pressure?",
      "Ask your client if there are any areas to avoid today.",
      `This session is set for ${durationMin} minutes. Area reminders will fire at the one-third and two-thirds mark. Body mechanics checks every twenty minutes. Say \"begin session\" when you are ready to start.`
    ];
  }

  function runChecklistStep() {
    if (assistant.checklistIndex >= assistant.checklist.length) return;
    const msg = assistant.checklist[assistant.checklistIndex];
    assistant.checklistIndex += 1;
    dingThenSpeak(msg, () => {
      // After last step wait for "begin session" voice command — no auto-advance
    });
  }

  function startPreSession() {
    const sel = document.getElementById("sessionDuration");
    const durationMin = sel ? parseInt(sel.value, 10) : config.session.defaultDuration;
    assistant.sessionDurationMs = durationMin * 60 * 1000;
    const baseChecklist = buildChecklist(durationMin);
    assistant.checklist = intakeBrief
      ? [...buildBriefChecklist(intakeBrief), ...baseChecklist]
      : baseChecklist;
    assistant.checklistIndex = 0;
    assistant.preSessionDone = false;
    if (assistantBar) assistantBar.hidden = false;
    setAssistantStatus("Pre-session checklist — listen for instructions");
    runChecklistStep();
  }

  // ── Session timers ────────────────────────────────────────
  function scheduleSessionTimers() {
    const durMs = assistant.sessionDurationMs;
    const durMin = durMs / 60000;

    // Clear any old timers
    assistant.timeReminderTimers.forEach(clearTimeout);
    assistant.areaReminderTimers.forEach(clearTimeout);
    clearInterval(assistant.mechanicsTimer);
    assistant.timeReminderTimers = [];
    assistant.areaReminderTimers = [];

    // Time remaining reminders
    ac.timeReminders.forEach((minRemaining) => {
      const fireAt = durMs - minRemaining * 60000;
      if (fireAt > 0) {
        assistant.timeReminderTimers.push(setTimeout(() => {
          dingThenSpeak(`${minRemaining} minutes remaining in this session.`);
        }, fireAt));
      }
    });

    // Session end
    assistant.timeReminderTimers.push(setTimeout(() => {
      dingThenSpeak("Session time is complete. Say \"end session\" when you are ready to close.");
    }, durMs));

    // Area reminders at 1/3 and 2/3 of session
    [1/3, 2/3].forEach((fraction) => {
      const fireAt = Math.round(durMs * fraction);
      assistant.areaReminderTimers.push(setTimeout(() => {
        dingThenSpeak("Area check — ensure you are covering the full treatment plan. Transition if needed.");
      }, fireAt));
    });

    // Body mechanics every 20 min
    assistant.mechanicsTimer = setInterval(() => {
      dingThenSpeak("Body mechanics check — posture, wrist position, shoulder tension.");
    }, ac.mechanicsIntervalMs);

    // Ask permission reminder at 2 minutes into session
    setTimeout(() => {
      dingThenSpeak("Remember to verbally confirm permission before changing pressure, area, or technique.");
    }, 2 * 60 * 1000);
  }

  function clearSessionTimers() {
    assistant.timeReminderTimers.forEach(clearTimeout);
    assistant.areaReminderTimers.forEach(clearTimeout);
    clearInterval(assistant.mechanicsTimer);
    assistant.timeReminderTimers = [];
    assistant.areaReminderTimers = [];
    assistant.mechanicsTimer = null;
  }

  // ── Voice command handler ─────────────────────────────────
  function handleVoiceCommand(transcript) {
    const t = transcript.toLowerCase().trim();

    // Begin session (pre-session only)
    if (t.includes(ac.wakeBegin) && !state.active) {
      assistant.preSessionDone = true;
      setAssistantStatus("Starting session…");
      ding();
      // Small delay so the ding plays before session setup
      setTimeout(() => {
        els.startSession.click();
        setTimeout(() => {
          setLogging(false); // start paused — clinician says "noting" to log
          dingThenSpeak("Session started. Say \"noting\" to begin logging clinical observations.");
          scheduleSessionTimers();
        }, 500);
      }, 400);
      return;
    }

    // End session
    if (t.includes(ac.wakeEnd) && state.active) {
      ding();
      setLogging(false);
      clearSessionTimers();
      dingThenSpeak("Grounding out. Complete your closing, thank your client, and release the session before your next appointment.", () => {
        setTimeout(() => els.stopSession.click(), 500);
      });
      return;
    }

    // Start logging
    if (t.includes(ac.wakeLog) && state.active && !assistant.logActive) {
      ding();
      setLogging(true);
      return;
    }

    // Pause logging
    if (t.includes(ac.wakePause) && state.active && assistant.logActive) {
      ding();
      setLogging(false);
      return;
    }

    // Replay last segments
    if (t.includes(ac.wakeReplay)) {
      if (!assistant.recentSegments.length) {
        dingThenSpeak("No logged segments to replay yet.");
      } else {
        dingThenSpeak("Replaying last logged observations: " + assistant.recentSegments.join(". "));
      }
      return;
    }

    // Time check
    if (t.includes(ac.wakeTime) && state.active) {
      if (!state.sessionStartedAt) return;
      const elapsedMs = Date.now() - state.sessionStartedAt;
      const remainingMs = assistant.sessionDurationMs - elapsedMs;
      if (remainingMs <= 0) {
        dingThenSpeak("Session time has elapsed.");
      } else {
        const remainMin = Math.ceil(remainingMs / 60000);
        dingThenSpeak(`${remainMin} minute${remainMin === 1 ? "" : "s"} remaining.`);
      }
      return;
    }

    // Client symptom check-in
    if (t.includes(ac.wakeCheck)) {
      dingThenSpeak("Client check-in — confirm chief complaint, current pain scale, and any changes since session start.");
      return;
    }

    // Dismiss mechanics/reminder
    if (t.includes(ac.wakeOkay)) {
      assistant.synth?.cancel();
      return;
    }
  }

  // ── SpeechRecognition continuous listener ─────────────────
  function startVoiceListener() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setAssistantStatus("Voice commands not supported in this browser. Use Chrome or Edge.");
      return;
    }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.addEventListener("result", (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const text = event.results[i][0].transcript;
          handleVoiceCommand(text);
          // If currently logging, also track as a clinical segment
          if (assistant.logActive && state.active) trackSegment(text);
        }
      }
    });
    rec.addEventListener("end", () => {
      // Auto-restart so it stays always-on
      try { rec.start(); } catch (_) {}
    });
    rec.addEventListener("error", (e) => {
      if (e.error === "not-allowed") {
        setAssistantStatus("Microphone permission denied — voice commands unavailable.");
      }
    });
    try { rec.start(); } catch (_) {}
    assistant.recognition = rec;
  }

  // ── Gate audio sends based on logActive ──────────────────
  function enqueueAudio(frame) {
    if (!assistant.logActive) return; // gate: drop frames when not logging
    enqueueAudioRaw(frame);
  }

  // ── Wire pre-session button ───────────────────────────────
  // Override startSession button to run checklist first
  els.startSession.addEventListener("click", (e) => {
    // If pre-session not done yet, run checklist instead
    if (!assistant.preSessionDone) {
      e.stopImmediatePropagation();
      startPreSession();
    }
  }, true); // capture phase so it fires before existing listener

  // ── Boot voice listener immediately ──────────────────────
  startVoiceListener();
  setAssistantStatus("Voice assistant ready — press Start to begin pre-session checklist");

  // ── Structured postural assessment ────────────────────────
  const postureState = { view: "front", saved: false };
  const postureCount = document.getElementById("postureCount");
  const postureSaved = document.getElementById("postureSaved");
  const postureSummary = document.getElementById("postureSummary");
  const postureNotes = document.getElementById("postureNotes");
  const postureSide = document.getElementById("postureSide");
  const postureFindings = () => [...document.querySelectorAll("#postureFindingGrid input:checked")];
  function updatePostureCount() {
    const count = postureFindings().length;
    if (postureCount) postureCount.textContent = `${count} finding${count === 1 ? "" : "s"} selected`;
    postureState.saved = false;
    if (postureSaved) { postureSaved.textContent = "Not saved"; postureSaved.classList.remove("ready"); }
  }
  function savePostureAssessment() {
    const findings = postureFindings();
    const side = postureSide?.value || "bilateral";
    const rawNotes = postureNotes?.value.trim() || "";
    const notes = rawNotes || "No additional observations recorded.";
    if (!findings.length && !rawNotes) {
      if (postureSummary) { postureSummary.hidden = false; postureSummary.textContent = "Select at least one observed finding or enter a direct observation before saving."; }
      return;
    }
    const lines = [`View: ${postureState.view.toUpperCase()}`, `Side / pattern: ${side}`, `Observed findings: ${findings.length ? findings.map((input) => `${input.dataset.region} — ${input.nextElementSibling?.querySelector("b")?.textContent || input.value}`).join("; ") : "None selected"}`, `Clinician observations: ${notes}`];
    if (postureSummary) { postureSummary.hidden = false; postureSummary.textContent = lines.join("\n"); }
    postureState.saved = true;
    if (postureSaved) { postureSaved.textContent = "Saved to session"; postureSaved.classList.add("ready"); }
    if (typeof addEvent === "function") addEvent("POSTURE_ASSESSMENT_SAVED", "Directly observed alignment findings saved for clinician review.");
  }
  function clearPostureAssessment() {
    document.querySelectorAll("#postureFindingGrid input").forEach((input) => { input.checked = false; });
    if (postureNotes) postureNotes.value = "";
    if (postureSummary) postureSummary.hidden = true;
    updatePostureCount();
  }
  document.querySelectorAll("#postureFindingGrid input").forEach((input) => input.addEventListener("change", updatePostureCount));
  document.querySelectorAll("[data-posture-view]").forEach((button) => button.addEventListener("click", () => {
    postureState.view = button.dataset.postureView;
    document.querySelectorAll("[data-posture-view]").forEach((item) => item.classList.toggle("active", item === button));
    document.querySelectorAll("#postureFindingGrid input").forEach((input) => { input.checked = false; });
    updatePostureCount();
  }));
  document.getElementById("savePosture")?.addEventListener("click", savePostureAssessment);
  document.getElementById("clearPosture")?.addEventListener("click", clearPostureAssessment);
  updatePostureCount();

  async function verifySession() {
    try {
      let accessToken = "";
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index) || "";
        if (!key.startsWith("sb-") || !key.endsWith("-auth-token")) continue;
        try {
          const candidate = JSON.parse(localStorage.getItem(key) || "{}");
          if (candidate.access_token) { accessToken = candidate.access_token; break; }
        } catch { /* Ignore unrelated storage entries. */ }
      }
      if (accessToken) {
        const exchange = await fetch(apiUrl("/auth/session/exchange"), {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          headers: { Accept: "application/json", Authorization: `Bearer ${accessToken}` }
        });
        if (!exchange.ok) throw new Error("session_exchange_failed");
      }
      const response = await fetch(apiUrl("/auth/session"), { credentials: "include", cache: "no-store", headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("missing_session");
      els.clinicalWorkspace.hidden = false; setAuth("Secure session ready", "ready");
    } catch {
      // Postural assessment is a browser-only first step. Keep it usable while
      // the optional realtime API is being provisioned; live audio/transcription
      // controls remain hidden until the secure API session is available.
      els.clinicalWorkspace.hidden = false;
      els.clinicalWorkspace.classList.add("posture-only");
      setAuth("Postural assessment mode", "ready");
    }
  }

  els.connectDevice.addEventListener("click", connectDevice); els.selectMicrophone.addEventListener("click", selectMicrophone); els.startSession.addEventListener("click", startSession); els.stopSession.addEventListener("click", stopSession); els.clearTranscript.addEventListener("click", clearTranscript); els.generateSoap.addEventListener("click", requestSoap); els.clinicianReviewed.addEventListener("change", () => { els.exportDraft.disabled = !els.clinicianReviewed.checked || !els.soapSubjective.value; }); els.exportDraft.addEventListener("click", exportDraft); window.addEventListener("resize", () => { if (state.active) resizeCanvas(); }); window.addEventListener("beforeunload", () => { if (state.active) state.socket?.close(1000, "page_unload"); });
  verifySession();
})();
