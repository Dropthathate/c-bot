(() => {
  "use strict";

  const config = window.SomaSyncWorkspaceConfig;
  const state = {
    microphoneStream: null,
    audioContext: null,
    sourceNode: null,
    workletNode: null,
    silentGain: null,
    audioSampleRate: null,
    audioBufferLimit: 96000,
    bluetoothDevice: null,
    batteryCharacteristic: null,
    socket: null,
    active: false,
    socketReady: false,
    reconnectAttempt: 0,
    reconnectTimer: null,
    sessionStartedAt: null,
    timer: null,
    streamId: null,
    audioBuffer: [],
    audioBufferBytes: 0,
    finalTranscriptCount: 0,
    socketClosedByUser: false
  };

  const els = Object.fromEntries([
    "workspace", "authRequired", "sessionDot", "sessionStatus", "connectDevice", "deviceName", "deviceDetail",
    "batteryLevel", "deviceState", "selectMicrophone", "audioState", "startSession", "stopSession", "captureError",
    "streamPill", "socketState", "transcript", "transcriptMeta", "clearTranscript", "generateSoap", "soapStatus",
    "soapSubjective", "soapObjective", "soapAssessment", "soapPlan", "clinicianReviewed", "exportDraft", "sessionTimer"
  ].map((id) => [id, document.getElementById(id)]));

  function getCookie(name) {
    const prefix = `${encodeURIComponent(name)}=`;
    return document.cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(prefix))?.slice(prefix.length) || "";
  }

  function safeText(value) { return String(value || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, " ").trim(); }
  function apiUrl(path) { return `${config.apiBaseUrl.replace(/\/$/, "")}${path}`; }
  function socketUrl() { return apiUrl("/realtime/transcription").replace(/^https:/, "wss:").replace(/^http:/, "ws:"); }

  function setSessionState(message, level = "idle") {
    els.sessionStatus.textContent = message;
    els.sessionDot.className = `status-dot${level === "ready" ? " ready" : level === "problem" ? " problem" : ""}`;
  }

  function setCaptureError(message = "") {
    els.captureError.hidden = !message;
    els.captureError.textContent = message;
  }

  function setSocketState(message, kind = "") {
    els.socketState.textContent = message;
    els.socketState.className = `connection-label ${kind}`;
  }

  function setStreaming(active, warning = false) {
    els.streamPill.textContent = active ? (warning ? "RECONNECTING" : "RECORDING") : "NOT RECORDING";
    els.streamPill.className = `pill ${active ? (warning ? "pill-warning" : "pill-live") : "pill-idle"}`;
    els.startSession.disabled = active || !state.microphoneStream;
    els.stopSession.disabled = !active;
    els.selectMicrophone.disabled = active;
    els.connectDevice.disabled = active;
  }

  function setSoapStatus(message, kind = "") {
    els.soapStatus.textContent = message;
    els.soapStatus.className = `soap-status ${kind}`;
  }

  function setTimer() {
    if (!state.sessionStartedAt) return;
    const total = Math.floor((Date.now() - state.sessionStartedAt) / 1000);
    const h = String(Math.floor(total / 3600)).padStart(2, "0");
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    els.sessionTimer.textContent = `${h}:${m}:${s}`;
  }

  function addTranscript(text, isFinal) {
    const clean = safeText(text);
    if (!clean) return;
    const empty = els.transcript.querySelector(".empty-state");
    if (empty) empty.remove();
    const existingInterim = els.transcript.querySelector(".interim");
    if (existingInterim) existingInterim.remove();
    const paragraph = document.createElement("p");
    paragraph.textContent = clean;
    if (!isFinal) paragraph.className = "interim";
    else state.finalTranscriptCount += 1;
    els.transcript.append(paragraph);
    els.transcript.scrollTop = els.transcript.scrollHeight;
    els.transcriptMeta.textContent = `${state.finalTranscriptCount} final segment${state.finalTranscriptCount === 1 ? "" : "s"} received. Raw audio is not stored in the browser.`;
    els.generateSoap.disabled = state.finalTranscriptCount === 0 || !state.active;
    els.clearTranscript.disabled = state.finalTranscriptCount === 0;
    if (isFinal) setSoapStatus("Final transcript context is available. Generate a draft only when you are ready to review it.", "ready");
  }

  function clearTranscriptDisplay() {
    els.transcript.replaceChildren();
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Transcript display cleared. Final context remains only for this active session and is cleared when the session ends.";
    els.transcript.append(empty);
    els.clearTranscript.disabled = true;
  }

  function clearSoapDraft() {
    [els.soapSubjective, els.soapObjective, els.soapAssessment, els.soapPlan].forEach((field) => { field.value = ""; });
    els.clinicianReviewed.checked = false;
    els.exportDraft.disabled = true;
  }

  function readBattery(event) {
    const value = event.target?.value || event;
    if (!(value instanceof DataView)) return;
    const percentage = value.getUint8(0);
    els.batteryLevel.textContent = `${percentage}%`;
  }

  async function connectDevice() {
    setCaptureError();
    if (!navigator.bluetooth) {
      setCaptureError("Web Bluetooth is unavailable in this browser. Use current Chrome or Edge over HTTPS, or continue with an approved microphone without the companion device.");
      return;
    }
    try {
      const options = {
        filters: [{ namePrefix: config.bluetooth.deviceNamePrefix }],
        optionalServices: ["battery_service", ...(config.bluetooth.controlServiceUuid ? [config.bluetooth.controlServiceUuid] : [])]
      };
      const device = await navigator.bluetooth.requestDevice(options);
      state.bluetoothDevice?.removeEventListener("gattserverdisconnected", onDeviceDisconnected);
      state.bluetoothDevice = device;
      device.addEventListener("gattserverdisconnected", onDeviceDisconnected);
      await connectGattDevice();
    } catch (error) {
      if (error?.name !== "NotFoundError") setCaptureError("The companion device could not be connected. Confirm it is powered on, nearby, and not connected to another application.");
    }
  }

  async function connectGattDevice() {
    const device = state.bluetoothDevice;
    if (!device?.gatt) throw new Error("No compatible GATT server is available.");
    els.deviceState.textContent = "Connecting…";
    const server = await device.gatt.connect();
    els.deviceName.textContent = device.name || "SomaSync companion device";
    els.deviceDetail.textContent = "Companion connected. Battery updates are shown when the device exposes the standard Battery Service.";
    els.deviceState.textContent = "Connected";
    try {
      const batteryService = await server.getPrimaryService("battery_service");
      const battery = await batteryService.getCharacteristic("battery_level");
      state.batteryCharacteristic = battery;
      readBattery(await battery.readValue());
      await battery.startNotifications();
      battery.addEventListener("characteristicvaluechanged", readBattery);
    } catch {
      els.batteryLevel.textContent = "Unavailable";
    }
  }

  function onDeviceDisconnected() {
    state.batteryCharacteristic?.removeEventListener("characteristicvaluechanged", readBattery);
    state.batteryCharacteristic = null;
    els.deviceState.textContent = "Disconnected";
    els.deviceDetail.textContent = "The companion connection ended. Reconnect when it is safe to do so; browser audio capture is controlled separately.";
    els.batteryLevel.textContent = "—";
  }

  async function selectMicrophone() {
    setCaptureError();
    try {
      stopMicrophone();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, sampleRate: config.audio.sampleRate, echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        video: false
      });
      state.microphoneStream = stream;
      const track = stream.getAudioTracks()[0];
      track.addEventListener("ended", () => {
        if (state.active) stopSession();
        state.microphoneStream = null;
        els.audioState.textContent = "Microphone permission ended";
        setStreaming(false);
      });
      els.audioState.textContent = track.label || "Approved audio input selected";
      els.startSession.disabled = false;
    } catch {
      setCaptureError("Microphone access is required for a real-time documentation session. No audio was captured.");
    }
  }

  function stopMicrophone() {
    state.microphoneStream?.getTracks().forEach((track) => track.stop());
    state.microphoneStream = null;
  }

  function enqueueAudio(buffer) {
    const bytes = buffer.byteLength;
    state.audioBuffer.push(buffer);
    state.audioBufferBytes += bytes;
    while (state.audioBufferBytes > state.audioBufferLimit && state.audioBuffer.length) {
      const removed = state.audioBuffer.shift();
      state.audioBufferBytes -= removed.byteLength;
    }
  }

  function flushAudioBuffer() {
    if (!state.socketReady || state.socket?.readyState !== WebSocket.OPEN) return;
    while (state.audioBuffer.length && state.socket.bufferedAmount < config.audio.maxBrowserBufferedBytes) {
      const frame = state.audioBuffer.shift();
      state.audioBufferBytes -= frame.byteLength;
      state.socket.send(frame);
    }
  }

  async function startAudioPipeline() {
    if (!state.microphoneStream) throw new Error("No microphone is selected.");
    const context = new AudioContext({ sampleRate: config.audio.sampleRate, latencyHint: "interactive" });
    state.audioSampleRate = context.sampleRate;
    state.audioBufferLimit = Math.round(context.sampleRate * 2 * config.audio.reconnectBufferSeconds);
    await context.audioWorklet.addModule("/clinical-workspace/assets/audio-worklet.js");
    const source = context.createMediaStreamSource(state.microphoneStream);
    const worklet = new AudioWorkletNode(context, "somasync-pcm-processor", { numberOfInputs: 1, numberOfOutputs: 1, channelCount: 1 });
    worklet.port.onmessage = ({ data }) => {
      if (!state.active || !(data instanceof ArrayBuffer)) return;
      if (state.socketReady && state.socket?.readyState === WebSocket.OPEN && state.socket.bufferedAmount < config.audio.maxBrowserBufferedBytes) state.socket.send(data);
      else enqueueAudio(data);
    };
    const silentGain = context.createGain();
    silentGain.gain.value = 0;
    source.connect(worklet);
    worklet.connect(silentGain);
    silentGain.connect(context.destination);
    state.audioContext = context;
    state.sourceNode = source;
    state.workletNode = worklet;
    state.silentGain = silentGain;
    await context.resume();
  }

  async function stopAudioPipeline() {
    state.workletNode?.port.close();
    state.workletNode?.disconnect();
    state.sourceNode?.disconnect();
    state.silentGain?.disconnect();
    state.workletNode = null;
    state.sourceNode = null;
    state.silentGain = null;
    if (state.audioContext && state.audioContext.state !== "closed") await state.audioContext.close();
    state.audioContext = null;
    state.audioSampleRate = null;
    state.audioBufferLimit = 96000;
    state.audioBuffer = [];
    state.audioBufferBytes = 0;
  }

  function connectRealtimeSocket() {
    const csrf = getCookie(config.csrfCookieName);
    if (!csrf) throw new Error("Secure session verification is missing. Please sign in again.");
    const protocols = ["somasync.stt.v1", `somasync-csrf.${csrf}`];
    const socket = new WebSocket(socketUrl(), protocols);
    socket.binaryType = "arraybuffer";
    state.socket = socket;
    setSocketState(state.reconnectAttempt ? "Reconnecting…" : "Connecting…", "reconnecting");

    socket.addEventListener("open", () => {
      if (state.socket !== socket || !state.active) return socket.close(1000, "inactive_session");
      socket.send(JSON.stringify({ type: "start", protocolVersion: "1", encoding: "linear16", sampleRate: state.audioSampleRate || config.audio.sampleRate, channels: 1, streamId: state.streamId }));
    });
    socket.addEventListener("message", ({ data }) => handleSocketMessage(socket, data));
    socket.addEventListener("error", () => setSocketState("Connection issue", "reconnecting"));
    socket.addEventListener("close", () => {
      if (state.socket === socket) {
        state.socketReady = false;
        state.socket = null;
      }
      if (state.active && !state.socketClosedByUser) scheduleReconnect();
      else setSocketState("Disconnected");
    });
  }

  function handleSocketMessage(socket, raw) {
    let message;
    try { message = JSON.parse(raw); } catch { return; }
    if (socket !== state.socket) return;
    if (message.type === "ready") {
      state.socketReady = true;
      state.reconnectAttempt = 0;
      setSocketState("Secure stream connected", "connected");
      setStreaming(true);
      flushAudioBuffer();
      return;
    }
    if (message.type === "transcript") return addTranscript(message.text, Boolean(message.isFinal));
    if (message.type === "flow_control") {
      setSocketState("Stream catching up", "reconnecting");
      return;
    }
    if (message.type === "soap") return populateSoap(message.note);
    if (message.type === "soap_error") return setSoapStatus(message.message || "The SOAP draft could not be generated.", "error");
    if (message.type === "error") {
      setCaptureError(message.code === "STT_CONNECTION" ? "Live transcription connection was interrupted. SomaSync will retry without storing audio beyond the short in-memory recovery buffer." : "The secure session received an invalid response.");
    }
  }

  function scheduleReconnect() {
    if (state.reconnectTimer || state.reconnectAttempt >= config.realtime.maxReconnectAttempts) {
      if (state.reconnectAttempt >= config.realtime.maxReconnectAttempts) {
        setCaptureError("The real-time stream could not reconnect. Stop the session and restart when your connection is stable.");
        setSocketState("Reconnect unavailable", "reconnecting");
      }
      return;
    }
    const delay = Math.min(1000 * (2 ** state.reconnectAttempt), 8_000);
    state.reconnectAttempt += 1;
    setStreaming(true, true);
    setSocketState(`Reconnecting in ${Math.round(delay / 1000)}s…`, "reconnecting");
    state.reconnectTimer = window.setTimeout(() => {
      state.reconnectTimer = null;
      if (state.active) connectRealtimeSocket();
    }, delay);
  }

  async function startSession() {
    setCaptureError();
    clearSoapDraft();
    if (!state.microphoneStream) return setCaptureError("Select a microphone before starting a secure session.");
    try {
      state.active = true;
      state.socketClosedByUser = false;
      state.streamId = crypto.randomUUID();
      state.sessionStartedAt = Date.now();
      state.finalTranscriptCount = 0;
      state.audioBuffer = [];
      state.audioBufferBytes = 0;
      state.reconnectAttempt = 0;
      setTimer();
      state.timer = window.setInterval(setTimer, 1000);
      setStreaming(true, true);
      setSoapStatus("Waiting for final transcript context before drafting.");
      await startAudioPipeline();
      connectRealtimeSocket();
    } catch (error) {
      setCaptureError(error?.message || "The secure session could not start.");
      await stopSession();
    }
  }

  async function stopSession() {
    state.active = false;
    state.socketClosedByUser = true;
    window.clearInterval(state.timer);
    window.clearTimeout(state.reconnectTimer);
    state.timer = null;
    state.reconnectTimer = null;
    if (state.socket?.readyState === WebSocket.OPEN) state.socket.send(JSON.stringify({ type: "stop" }));
    state.socket?.close(1000, "clinician_stopped_session");
    state.socket = null;
    state.socketReady = false;
    await stopAudioPipeline();
    state.streamId = null;
    state.sessionStartedAt = null;
    els.sessionTimer.textContent = "00:00:00";
    setStreaming(false);
    setSocketState("Disconnected");
    els.generateSoap.disabled = true;
    setSoapStatus("Session stopped. Final transcript context and in-memory audio recovery buffers have been cleared.");
  }

  function populateSoap(note) {
    const valid = note && ["subjective", "objective", "assessment", "plan"].every((key) => typeof note[key] === "string") && Object.keys(note).length === 4;
    if (!valid) return setSoapStatus("The received draft did not meet the required SOAP schema and was rejected.", "error");
    els.soapSubjective.value = note.subjective;
    els.soapObjective.value = note.objective;
    els.soapAssessment.value = note.assessment;
    els.soapPlan.value = note.plan;
    els.clinicianReviewed.checked = false;
    els.exportDraft.disabled = true;
    setSoapStatus("Strict SOAP draft received. Review and edit every section before exporting.", "ready");
  }

  function exportDraft() {
    if (!els.clinicianReviewed.checked) return;
    const fields = [["Subjective", els.soapSubjective.value], ["Objective", els.soapObjective.value], ["Assessment", els.soapAssessment.value], ["Plan", els.soapPlan.value]];
    const content = fields.map(([heading, value]) => `${heading}\n${safeText(value)}\n`).join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `somasync-clinician-reviewed-draft-${new Date().toISOString().slice(0, 10)}.txt`;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  }

  async function verifySession() {
    try {
      const response = await fetch(apiUrl("/auth/session"), { credentials: "include", cache: "no-store", headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("missing_session");
      els.workspace.hidden = false;
      setSessionState("Secure session ready", "ready");
    } catch {
      els.authRequired.hidden = false;
      setSessionState("Sign-in required", "problem");
    }
  }

  els.connectDevice.addEventListener("click", connectDevice);
  els.selectMicrophone.addEventListener("click", selectMicrophone);
  els.startSession.addEventListener("click", startSession);
  els.stopSession.addEventListener("click", stopSession);
  els.clearTranscript.addEventListener("click", clearTranscriptDisplay);
  els.generateSoap.addEventListener("click", () => {
    if (state.socketReady && state.socket?.readyState === WebSocket.OPEN) {
      setSoapStatus("Generating strict SOAP draft…");
      state.socket.send(JSON.stringify({ type: "generate_soap" }));
    }
  });
  els.clinicianReviewed.addEventListener("change", () => { els.exportDraft.disabled = !els.clinicianReviewed.checked || !els.soapSubjective.value; });
  els.exportDraft.addEventListener("click", exportDraft);
  window.addEventListener("beforeunload", () => { if (state.active) state.socket?.close(1000, "page_unload"); });

  verifySession();
})();
