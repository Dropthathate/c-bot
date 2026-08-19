import { useEffect, useRef, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import AudioDeviceSetup from "../components/AudioDeviceSetup";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "https://ucqprtpuuyflnxjmatwo.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_zzh8YRfrO7--WLmWOw-9Tg_vV878nJB";
const DEVICE_ID_KEY = "somasync_audio_input_id";
const DEVICE_LABEL_KEY = "somasync_audio_input_label";
const SESSION_LENGTHS = [30, 45, 60, 90];
const METER_BARS = [0.34, 0.54, 0.76, 1, 0.66, 0.42, 0.82, 0.58, 0.92, 0.48, 0.72, 0.38];

const STATE_LABELS = {
  idle: { label: "Ready", color: "var(--dim)" },
  active: { label: "Recording", color: "var(--grn)" },
  paused: { label: "Paused", color: "var(--orange)" },
  transcribing: { label: "Transcribing", color: "var(--blue)" },
  generating: { label: "Creating SOAP note", color: "var(--blue)" },
};

const bodyMechanicsCue = (elapsedSeconds) => {
  if (elapsedSeconds >= 1800) return "Reset your posture: soften your shoulders, stack your ribs, and keep your wrists neutral.";
  if (elapsedSeconds >= 900) return "Body check: ground both feet, relax your jaw, and keep your shoulders low.";
  return "Before you begin: grounded feet, soft shoulders, and a neutral neck.";
};

export default function SoapGenerator() {
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const meterContextRef = useRef(null);
  const meterFrameRef = useRef(null);
  const recognitionRef = useRef(null);
  const recognitionActiveRef = useRef(false);
  const voiceCommandsEnabledRef = useRef(false);
  const spokenCuesEnabledRef = useRef(true);
  const elapsedSecondsRef = useRef(0);
  const sessionLengthRef = useRef(60);
  const speakingRef = useRef(false);
  const stateRef = useRef("idle");
  const lastVoiceNoteRef = useRef("");
  const cueHistoryRef = useRef(new Set());

  const [state, setState] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [soap, setSoap] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionLength, setSessionLength] = useState(60);
  const [recordingConsent, setRecordingConsent] = useState(false);
  const [deviceLabel, setDeviceLabel] = useState(() => localStorage.getItem(DEVICE_LABEL_KEY) || "System default microphone");
  const [showDeviceSetup, setShowDeviceSetup] = useState(() => !localStorage.getItem("somasync_audio_setup_complete") && !localStorage.getItem("somasync_audio_setup_skipped"));
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioDetected, setAudioDetected] = useState(false);
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(false);
  const [spokenCuesEnabled, setSpokenCuesEnabled] = useState(true);
  const [commandStatus, setCommandStatus] = useState("Hands-free controls are off");
  const [sessionCue, setSessionCue] = useState("Set your session length, confirm consent, and begin when ready.");
  const [lastVoiceNote, setLastVoiceNote] = useState("");
  const [showLastVoiceNote, setShowLastVoiceNote] = useState(false);

  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { voiceCommandsEnabledRef.current = voiceCommandsEnabled; }, [voiceCommandsEnabled]);
  useEffect(() => { spokenCuesEnabledRef.current = spokenCuesEnabled; }, [spokenCuesEnabled]);
  useEffect(() => { elapsedSecondsRef.current = elapsedSeconds; }, [elapsedSeconds]);
  useEffect(() => { sessionLengthRef.current = sessionLength; }, [sessionLength]);

  useEffect(() => {
    if (state !== "active") return undefined;
    const timer = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [state]);

  const stopLevelMeter = () => {
    if (meterFrameRef.current) cancelAnimationFrame(meterFrameRef.current);
    meterContextRef.current?.close();
    meterFrameRef.current = null;
    meterContextRef.current = null;
    setAudioLevel(0);
    setAudioDetected(false);
  };

  const releaseMicrophone = () => {
    stopLevelMeter();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const startLevelMeter = (stream) => {
    stopLevelMeter();
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.78;
    context.createMediaStreamSource(stream).connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);
    const measure = () => {
      analyser.getByteTimeDomainData(samples);
      const average = samples.reduce((sum, sample) => sum + Math.abs(sample - 128), 0) / samples.length;
      const nextLevel = Math.min(100, Math.round(average * 5));
      setAudioLevel(nextLevel);
      setAudioDetected(nextLevel > 4);
      meterFrameRef.current = requestAnimationFrame(measure);
    };
    meterContextRef.current = context;
    measure();
  };

  const startVoiceRecognition = () => {
    if (!voiceCommandsEnabledRef.current || recognitionActiveRef.current || !recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch {
      // Browsers throw if recognition is already transitioning between listening states.
    }
  };

  const announce = (message, forceSpoken = false) => {
    setSessionCue(message);
    if (!(forceSpoken || spokenCuesEnabledRef.current) || !("speechSynthesis" in window)) return;
    speakingRef.current = true;
    if (recognitionActiveRef.current) recognitionRef.current.abort();
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1.08;
    utterance.pitch = 1;
    utterance.onend = () => {
      speakingRef.current = false;
      window.setTimeout(startVoiceRecognition, 250);
    };
    utterance.onerror = () => {
      speakingRef.current = false;
      window.setTimeout(startVoiceRecognition, 250);
    };
    window.speechSynthesis.speak(utterance);
  };

  const formatElapsed = () => `${String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:${String(elapsedSeconds % 60).padStart(2, "0")}`;
  const remainingSeconds = Math.max(0, sessionLength * 60 - elapsedSeconds);
  const formatRemaining = () => `${Math.floor(remainingSeconds / 60)}:${String(remainingSeconds % 60).padStart(2, "0")}`;
  const progress = Math.min(100, Math.round((elapsedSeconds / (sessionLength * 60)) * 100));

  const generateSoap = async (rawNotes) => {
    setState("generating");
    const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-soap`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      body: JSON.stringify({ rawNotes }),
    });
    if (!res.ok) throw new Error(`Unable to create the SOAP note (HTTP ${res.status}).`);
    const data = await res.json();
    setSoap(data.soap);
    setState("idle");
  };

  const transcribeAndGenerate = async () => {
    const audio = new Blob(chunksRef.current, { type: "audio/webm" });
    releaseMicrophone();
    if (!audio.size) {
      setError("No audio was captured. Check that your headset microphone is connected, then try again.");
      setState("idle");
      return;
    }

    try {
      setState("transcribing");
      setSessionCue("Audio captured. Transcribing your session now.");
      const form = new FormData();
      form.append("audio", audio, "somasync-session.webm");
      form.append("language", "en");
      const { data, error: transcriptionError } = await supabase.functions.invoke("transcribe", { body: form });
      if (transcriptionError) throw new Error("SomaSync could not transcribe this session. Check your connection and try again.");
      const text = data?.transcript?.trim();
      if (!text) throw new Error("No speech was detected. Speak closer to the microphone and try again.");
      setTranscript(text);
      await generateSoap(text);
      setSessionCue("SOAP note ready for your clinical review.");
      announce("SOAP note ready for review.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Transcription failed. Please try again.");
      setSessionCue("The session could not be processed. Check the message and try again.");
      setState("idle");
    }
  };

  const start = async () => {
    setError("");
    if (!recordingConsent) {
      setError("Confirm that you have provided required notice and obtained any required consent before starting voice capture.");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError("Audio recording requires a current version of Chrome, Edge, or Safari.");
      return;
    }

    setSoap(null);
    setTranscript("");
    setElapsedSeconds(0);
    setLastVoiceNote("");
    setShowLastVoiceNote(false);
    chunksRef.current = [];
    cueHistoryRef.current = new Set();

    try {
      const deviceId = localStorage.getItem(DEVICE_ID_KEY);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          ...(deviceId && deviceId !== "default" ? { deviceId: { exact: deviceId } } : {}),
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      startLevelMeter(stream);
      const activeDevice = stream.getAudioTracks()[0]?.label;
      if (activeDevice) setDeviceLabel(activeDevice);

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        recorderRef.current = null;
        void transcribeAndGenerate();
      };
      recorder.start(750);
      recorderRef.current = recorder;
      setState("active");
      announce("Recording started. Your microphone signal is visible on screen.");
    } catch (caughtError) {
      const message = caughtError instanceof DOMException && caughtError.name === "OverconstrainedError"
        ? "Your saved microphone is unavailable. Select your active headset again, then restart the session."
        : "SomaSync could not access the microphone. Check your headset and allow browser microphone access.";
      setError(message);
      releaseMicrophone();
      setState("idle");
    }
  };

  const pause = () => {
    recorderRef.current?.pause();
    setState("paused");
    setSessionCue("Recording paused. Resume when you are ready.");
    announce("Recording paused.");
  };

  const resume = () => {
    recorderRef.current?.resume();
    setState("active");
    announce("Recording resumed.");
  };

  const end = () => {
    if (!recorderRef.current) return;
    setState("transcribing");
    setSessionCue("Session ended. SomaSync is preparing your transcript.");
    announce("Session ended. Preparing your note.");
    recorderRef.current.stop();
  };

  const handleVoiceResult = (spokenText) => {
    const normalized = spokenText.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
    const isWakeCommand = normalized.includes("somasync") || normalized.includes("soma sync");
    if (!isWakeCommand) {
      lastVoiceNoteRef.current = spokenText;
      setLastVoiceNote(spokenText);
      return;
    }

    const command = normalized.replace("soma sync", "").replace("somasync", "").trim();
    if (command.includes("start") || command.includes("begin")) {
      if (stateRef.current !== "idle") return announce("A session is already active or processing.");
      void start();
      return;
    }
    if (command.includes("pause")) {
      if (stateRef.current === "active") pause();
      else announce("There is no active recording to pause.");
      return;
    }
    if (command.includes("resume") || command.includes("continue")) {
      if (stateRef.current === "paused") resume();
      else announce("There is no paused recording to resume.");
      return;
    }
    if (command.includes("end") || command.includes("finish") || command.includes("stop")) {
      if (stateRef.current === "active" || stateRef.current === "paused") end();
      else announce("There is no active recording to end.");
      return;
    }
    if (command.includes("time") || command.includes("remaining")) {
      if (stateRef.current === "active" || stateRef.current === "paused") {
        const currentRemaining = Math.max(0, sessionLengthRef.current * 60 - elapsedSecondsRef.current);
        announce(`${Math.floor(currentRemaining / 60)} minutes and ${currentRemaining % 60} seconds remaining in this session.`);
      }
      else announce("No session timer is currently running.");
      return;
    }
    if (command.includes("recall") || command.includes("repeat") || command.includes("last note")) {
      if (lastVoiceNoteRef.current) {
        setShowLastVoiceNote(true);
        announce("Your most recent dictated phrase is shown on screen for private review.");
      } else {
        announce("No dictated phrase has been detected yet.");
      }
      return;
    }
    if (command.includes("body") || command.includes("posture")) {
      announce(bodyMechanicsCue(elapsedSecondsRef.current));
      return;
    }
    if (command.includes("help") || command.includes("commands")) {
      announce("Say SomaSync start, pause, resume, time remaining, recall last note, body check, or end session.");
      return;
    }
    announce("I heard SomaSync, but not the action. Say SomaSync help for available commands.");
  };

  const enableVoiceCommands = () => {
    setError("");
    if (!recordingConsent) {
      setError("Confirm voice-capture consent before enabling hands-free controls.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Hands-free voice controls require a current version of Chrome or Edge. Recording still works normally.");
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognition.onstart = () => {
        recognitionActiveRef.current = true;
        setCommandStatus("Listening for commands beginning with “SomaSync”");
      };
      recognition.onend = () => {
        recognitionActiveRef.current = false;
        if (voiceCommandsEnabledRef.current && !speakingRef.current) window.setTimeout(startVoiceRecognition, 250);
      };
      recognition.onerror = (event) => {
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          voiceCommandsEnabledRef.current = false;
          setVoiceCommandsEnabled(false);
          setCommandStatus("Microphone permission is required for hands-free controls");
          setError("Browser microphone permission is required for hands-free controls.");
          return;
        }
        if (event.error !== "aborted") setCommandStatus("Voice command listener is reconnecting…");
      };
      recognition.onresult = (event) => {
        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          if (event.results[index].isFinal) handleVoiceResult(event.results[index][0].transcript.trim());
        }
      };
      recognitionRef.current = recognition;
    }

    voiceCommandsEnabledRef.current = true;
    setVoiceCommandsEnabled(true);
    setCommandStatus("Starting hands-free controls…");
    startVoiceRecognition();
  };

  const disableVoiceCommands = () => {
    voiceCommandsEnabledRef.current = false;
    recognitionRef.current?.abort();
    recognitionActiveRef.current = false;
    setVoiceCommandsEnabled(false);
    setCommandStatus("Hands-free controls are off");
  };

  const handleCopy = async () => {
    if (!soap) return;
    const text = [
      "SOAP NOTE — SOMASYNC AI",
      "AI-generated draft. Requires licensed clinician review before clinical, billing, or legal use.",
      `SUBJECTIVE\n${soap.subjective || ""}`,
      `OBJECTIVE\n${soap.objective || ""}`,
      `ASSESSMENT\n${soap.assessment || ""}`,
      `PLAN\n${soap.plan || ""}`,
      soap.icd10?.length ? `ICD-10-CM — Reference only; confirm against current official guidance\n${soap.icd10.map((code) => `${code.code} — ${code.description}`).join("\n")}` : "",
      soap.medical_necessity ? `MEDICAL NECESSITY\n${soap.medical_necessity}` : "",
    ].filter(Boolean).join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const completeDeviceSetup = () => {
    setDeviceLabel(localStorage.getItem(DEVICE_LABEL_KEY) || "System default microphone");
    setShowDeviceSetup(false);
  };

  const skipDeviceSetup = () => {
    localStorage.setItem("somasync_audio_setup_skipped", "1");
    setShowDeviceSetup(false);
  };

  useEffect(() => {
    if (state !== "active") return;
    const plannedSeconds = sessionLength * 60;
    const cuePoints = [
      ...(plannedSeconds > 900 ? [{ seconds: 900, message: "Fifteen minutes in. Body check: ground your feet, soften your jaw, and relax your shoulders." }] : []),
      ...(plannedSeconds > 1800 ? [{ seconds: 1800, message: "Thirty minutes in. Reset your posture: soften your shoulders, stack your ribs, and keep your wrists neutral." }] : []),
      { seconds: plannedSeconds - 600, message: "Ten minutes remain in this session." },
      { seconds: plannedSeconds - 300, message: "Five minutes remain in this session." },
      { seconds: plannedSeconds, message: "Your planned session time is complete." },
    ].filter((cue) => cue.seconds > 0);
    const nextCue = cuePoints.find((cue) => elapsedSeconds >= cue.seconds && !cueHistoryRef.current.has(cue.seconds));
    if (nextCue) {
      cueHistoryRef.current.add(nextCue.seconds);
      announce(nextCue.message);
    }
  }, [elapsedSeconds, sessionLength, state]);

  useEffect(() => () => {
    releaseMicrophone();
    voiceCommandsEnabledRef.current = false;
    recognitionRef.current?.abort();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const stateInfo = STATE_LABELS[state];
  const isBusy = state === "transcribing" || state === "generating";
  const isSessionActive = state === "active" || state === "paused";

  if (showDeviceSetup) return <AudioDeviceSetup onComplete={completeDeviceSetup} onSkip={skipDeviceSetup} />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">SOAP Live</h1>
          <p className="page-sub">Connect once. Start your session. End and review.</p>
        </div>
        <div className="status-pill" style={{ background: `${stateInfo.color}18`, color: stateInfo.color, border: `1px solid ${stateInfo.color}30` }}>
          <span className="status-dot" style={{ background: stateInfo.color, boxShadow: `0 0 6px ${stateInfo.color}` }} />
          {stateInfo.label}
        </div>
      </div>

      <div className="ai-disclaimer-bar">AI-generated documentation is a draft. A licensed clinician must review it before clinical, billing, or legal use. Do not enter identifying patient information unless your practice’s privacy and vendor safeguards support that use.</div>

      <div className="soap-layout">
        <div className="soap-controls-col">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Session microphone</span>
              <button className="btn-copy" onClick={() => setShowDeviceSetup(true)} disabled={state !== "idle"}>Change</button>
            </div>
            <div className="controls-body">
              <div className="voice-tip"><strong>{deviceLabel}</strong><br />Pair your Bluetooth headset with this device once. SomaSync remembers this microphone for future sessions.</div>
              <label className="voice-consent">
                <input type="checkbox" checked={recordingConsent} onChange={(event) => setRecordingConsent(event.target.checked)} />
                <span>I confirm that I have provided any required notice and obtained any required consent from all participants before using voice capture. I will not enter identifiable patient information unless my practice’s privacy and vendor safeguards support that use.</span>
              </label>
              <div className="controls-grid">
                <button className="ctrl-btn ctrl-start" onClick={start} disabled={state !== "idle" || !recordingConsent}><span className="ctrl-icon">🎙</span>Start session</button>
                <button className="ctrl-btn ctrl-pause" onClick={pause} disabled={state !== "active"}><span className="ctrl-icon">⏸</span>Pause</button>
                <button className="ctrl-btn ctrl-resume" onClick={resume} disabled={state !== "paused"}><span className="ctrl-icon">▶</span>Resume</button>
                <button className="ctrl-btn ctrl-generate" onClick={end} disabled={!isSessionActive}><span className="ctrl-icon">⚡</span>End & create SOAP</button>
              </div>

              <div role="status" aria-live="polite" style={{ marginTop: 4, padding: "14px", borderRadius: 12, background: audioDetected ? "rgba(0,232,154,.07)" : "rgba(255,255,255,.025)", border: `1px solid ${audioDetected ? "rgba(0,232,154,.24)" : "var(--border)"}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".75rem", fontWeight: 700, color: audioDetected ? "var(--grn)" : "var(--muted)" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: audioDetected ? "var(--grn)" : "var(--dim)", boxShadow: audioDetected ? "0 0 10px var(--grn)" : "none" }} />{state === "active" ? (audioDetected ? "Listening — voice detected" : "Listening — speak normally to test") : state === "paused" ? "Recording paused" : "Live microphone check begins when recording starts"}</div>
                  {state === "active" && <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--grn)", fontSize: ".76rem", fontWeight: 800 }}>{formatElapsed()}</span>}
                </div>
                <div style={{ display: "flex", alignItems: "end", height: 34, gap: 3 }} aria-label={`Microphone input level ${audioLevel}%`}>
                  {METER_BARS.map((multiplier, index) => <span key={index} style={{ flex: 1, minWidth: 3, height: `${6 + audioLevel * 0.3 * multiplier}px`, maxHeight: 34, borderRadius: 4, transition: "height 90ms linear, background 160ms ease-out", background: audioDetected ? "linear-gradient(180deg,#71f2c8,#00c47f)" : "rgba(255,255,255,.16)" }} />)}
                </div>
                <div style={{ marginTop: 8, fontSize: ".68rem", color: "var(--dim)" }}>Green bars moving confirms SomaSync is receiving sound from your selected microphone.</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header"><span className="card-title">Session guidance</span><span className="card-tag">Live support</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "center" }}>
              <div>
                <div style={{ color: "var(--dim)", fontSize: ".66rem", fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>Time remaining</div>
                <div style={{ marginTop: 3, fontFamily: "Syne, sans-serif", color: remainingSeconds <= 300 && isSessionActive ? "var(--orange)" : "var(--ink)", fontSize: "2rem", letterSpacing: "-.05em", fontVariantNumeric: "tabular-nums" }}>{isSessionActive ? formatRemaining() : `${sessionLength}:00`}</div>
                <div style={{ color: "var(--muted)", fontSize: ".7rem" }}>{isSessionActive ? `${formatElapsed()} elapsed` : "Set for your next session"}</div>
              </div>
              <label style={{ display: "grid", gap: 6, color: "var(--dim)", fontSize: ".66rem", fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>Session length
                <select value={sessionLength} onChange={(event) => setSessionLength(Number(event.target.value))} disabled={state !== "idle"} style={{ minWidth: 88, padding: "8px 10px", borderRadius: 9, color: "var(--ink)", background: "rgba(255,255,255,.04)", border: "1px solid var(--border2)", fontWeight: 700 }}>{SESSION_LENGTHS.map((minutes) => <option value={minutes} key={minutes}>{minutes} min</option>)}</select>
              </label>
            </div>
            <div style={{ height: 6, overflow: "hidden", marginTop: 16, borderRadius: 99, background: "rgba(255,255,255,.08)" }}><div style={{ height: "100%", width: `${progress}%`, borderRadius: 99, background: remainingSeconds <= 300 && isSessionActive ? "var(--orange)" : "linear-gradient(90deg,var(--blue),var(--grn))", transition: "width 400ms linear" }} /></div>
            <div style={{ marginTop: 15, padding: "11px 12px", borderRadius: 10, background: "rgba(59,158,255,.07)", border: "1px solid rgba(59,158,255,.15)", color: "rgba(240,237,232,.78)", fontSize: ".75rem", lineHeight: 1.55 }}><strong style={{ color: "var(--blue)" }}>Body mechanics cue</strong><br />{bodyMechanicsCue(elapsedSeconds)}</div>
            <div style={{ marginTop: 11, color: "var(--muted)", fontSize: ".7rem", lineHeight: 1.55 }}>{sessionCue}</div>
          </div>

          <div className="card" style={{ flex: 1 }}>
            <div className="card-header"><span className="card-title">Hands-free controls</span><button className="btn-copy" onClick={voiceCommandsEnabled ? disableVoiceCommands : enableVoiceCommands} aria-pressed={voiceCommandsEnabled}>{voiceCommandsEnabled ? "Turn off" : "Enable"}</button></div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: voiceCommandsEnabled ? "var(--grn)" : "var(--muted)", fontSize: ".74rem", marginBottom: 12 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: voiceCommandsEnabled ? "var(--grn)" : "var(--dim)", boxShadow: voiceCommandsEnabled ? "0 0 8px var(--grn)" : "none" }} />{commandStatus}</div>
            <div className="voice-tip" style={{ marginBottom: 10 }}>Say <strong>“SomaSync start”</strong>, <strong>“pause”</strong>, <strong>“resume”</strong>, <strong>“time remaining”</strong>, <strong>“body check”</strong>, <strong>“recall last note”</strong>, or <strong>“end session.”</strong></div>
            <label style={{ display: "flex", alignItems: "center", gap: 9, color: "var(--muted)", fontSize: ".7rem", cursor: "pointer" }}><input type="checkbox" checked={spokenCuesEnabled} onChange={(event) => setSpokenCuesEnabled(event.target.checked)} style={{ accentColor: "var(--grn)" }} />Use spoken time and body-mechanics cues through the active system audio output.</label>
            {showLastVoiceNote && <div style={{ marginTop: 14, padding: "11px 12px", borderRadius: 10, background: "rgba(0,232,154,.055)", border: "1px solid rgba(0,232,154,.16)" }}><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, color: "var(--grn)", fontSize: ".67rem", fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>Most recent dictated phrase<button onClick={() => setShowLastVoiceNote(false)} style={{ border: 0, padding: 0, background: "transparent", color: "var(--muted)", cursor: "pointer", fontSize: ".7rem" }}>Hide</button></div><div style={{ marginTop: 7, color: "var(--muted)", fontSize: ".78rem", lineHeight: 1.55 }}>{lastVoiceNote}</div></div>}
          </div>

          <div className="card" style={{ flex: 1 }}>
            <div className="card-header"><span className="card-title">Session transcript</span></div>
            <div className="transcript-body">
              {isBusy ? <div className="transcript-empty"><div className="recording-pulse" />{state === "transcribing" ? "Transcribing your session…" : "Creating your SOAP note…"}</div> : transcript ? <div className="transcript-list"><div className="transcript-line"><span className="t-num">1</span><span className="t-text">{transcript}</span></div></div> : <div className="transcript-empty">Start a session when your headset is connected. The live meter confirms sound is reaching SomaSync before you end the session.</div>}
            </div>
          </div>
        </div>

        <div className="soap-output-col">
          {!soap && !isBusy && <div className="soap-empty-state"><div className="empty-icon">📋</div><div className="empty-title">Your SOAP note will appear here</div><div className="empty-sub">Connect once, start your session, then end and review.</div></div>}
          {isBusy && <div className="soap-generating"><div className="gen-spinner" /><div className="gen-text">{state === "transcribing" ? "Turning your session into text…" : "Structuring your SOAP note…"}</div><div className="gen-sub">This may take a moment after you end the session.</div></div>}
          {soap && !isBusy && (
            <div className="card soap-result">
              <div className="card-header"><span className="card-title">Generated SOAP note</span><button className="btn-copy" onClick={handleCopy}>{copied ? "✓ Copied" : "Copy note"}</button></div>
              <div className="draft-badge">AI DRAFT — Clinician review required before clinical or billing use</div>
              {[{ key: "subjective", label: "S — Subjective", cls: "soap-s" }, { key: "objective", label: "O — Objective", cls: "soap-o" }, { key: "assessment", label: "A — Assessment", cls: "soap-a" }, { key: "plan", label: "P — Plan", cls: "soap-p" }].map(({ key, label, cls }) => soap[key] ? <div className="soap-section" key={key}><span className={`soap-section-label ${cls}`}>{label}</span><p className="soap-section-text">{soap[key]}</p></div> : null)}
              {soap.icd10?.length ? <div className="soap-section"><span className="soap-section-label soap-icd">ICD-10-CM — Reference only</span><div style={{ fontSize: ".72rem", color: "var(--orange)", marginBottom: 8 }}>Confirm against current official guidance before use on any claim.</div><div className="code-list">{soap.icd10.map((code) => <div className="code-row" key={code.code}><span className="code-badge code-teal">{code.code}</span><span className="code-desc">{code.description}</span></div>)}</div></div> : null}
              {soap.medical_necessity ? <div className="soap-section"><span className="soap-section-label soap-mn">Medical necessity</span><p className="soap-section-text">{soap.medical_necessity}</p></div> : null}
            </div>
          )}
          {error && <div className="error-card">⚠ {error}</div>}
        </div>
      </div>
    </div>
  );
}
