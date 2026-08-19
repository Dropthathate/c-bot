import { useEffect, useRef, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import AudioDeviceSetup from "../components/AudioDeviceSetup";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "https://ucqprtpuuyflnxjmatwo.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_zzh8YRfrO7--WLmWOw-9Tg_vV878nJB";
const DEVICE_ID_KEY = "somasync_audio_input_id";
const DEVICE_LABEL_KEY = "somasync_audio_input_label";

const STATE_LABELS = {
  idle: { label: "Ready", color: "var(--dim)" },
  active: { label: "Recording", color: "var(--grn)" },
  paused: { label: "Paused", color: "var(--orange)" },
  transcribing: { label: "Transcribing", color: "var(--blue)" },
  generating: { label: "Creating SOAP note", color: "var(--blue)" },
};

export default function SoapGenerator() {
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const [state, setState] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [soap, setSoap] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [recordingConsent, setRecordingConsent] = useState(false);
  const [deviceLabel, setDeviceLabel] = useState(() => localStorage.getItem(DEVICE_LABEL_KEY) || "System default microphone");
  const [showDeviceSetup, setShowDeviceSetup] = useState(() => !localStorage.getItem("somasync_audio_setup_complete") && !localStorage.getItem("somasync_audio_setup_skipped"));

  useEffect(() => {
    if (state !== "active") return undefined;
    const timer = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [state]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const formatElapsed = () => `${String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:${String(elapsedSeconds % 60).padStart(2, "0")}`;

  const releaseMicrophone = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

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
      const form = new FormData();
      form.append("audio", audio, "somasync-session.webm");
      form.append("language", "en");
      const { data, error: transcriptionError } = await supabase.functions.invoke("transcribe", { body: form });
      if (transcriptionError) throw new Error("SomaSync could not transcribe this session. Check your connection and try again.");
      const text = data?.transcript?.trim();
      if (!text) throw new Error("No speech was detected. Speak closer to the microphone and try again.");
      setTranscript(text);
      await generateSoap(text);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Transcription failed. Please try again.");
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
    chunksRef.current = [];

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
      recorder.start(1000);
      recorderRef.current = recorder;
      setState("active");
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
  };

  const resume = () => {
    recorderRef.current?.resume();
    setState("active");
  };

  const end = () => {
    if (!recorderRef.current) return;
    setState("transcribing");
    recorderRef.current.stop();
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

  const stateInfo = STATE_LABELS[state];
  const isBusy = state === "transcribing" || state === "generating";

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
                <button className="ctrl-btn ctrl-generate" onClick={end} disabled={state !== "active" && state !== "paused"}><span className="ctrl-icon">⚡</span>End & create SOAP</button>
              </div>
              {(state === "active" || state === "paused") && <div style={{ marginTop: 16, textAlign: "center", fontSize: 13, color: "var(--grn)", fontWeight: 700 }}>{state === "active" ? "● Recording" : "Ⅱ Paused"} · {formatElapsed()}</div>}
            </div>
          </div>

          <div className="card" style={{ flex: 1 }}>
            <div className="card-header"><span className="card-title">Session transcript</span></div>
            <div className="transcript-body">
              {isBusy ? <div className="transcript-empty"><div className="recording-pulse" />{state === "transcribing" ? "Transcribing your session…" : "Creating your SOAP note…"}</div> : transcript ? <div className="transcript-list"><div className="transcript-line"><span className="t-num">1</span><span className="t-text">{transcript}</span></div></div> : <div className="transcript-empty">Start a session when your headset is connected. End it once, and SomaSync transcribes and structures the note automatically.</div>}
            </div>
          </div>
        </div>

        <div className="soap-output-col">
          {!soap && !isBusy && <div className="soap-empty-state"><div className="empty-icon">📋</div><div className="empty-title">Your SOAP note will appear here</div><div className="empty-sub">Three steps: connect once, start your session, then end and review.</div></div>}
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
