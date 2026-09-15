import { useEffect, useRef, useState } from "react";
import { createSoapDraft, transcribeAudio } from "../lib/clinicalApi";

const bars = Array.from({ length: 48 }, (_, index) => 0.25 + ((index * 17) % 70) / 100);

export default function SecureSpace() {
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const frameRef = useRef(null);
  const canvasRef = useRef(null);
  const startedAtRef = useRef(null);
  const [status, setStatus] = useState("ready");
  const [seconds, setSeconds] = useState(0);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [soap, setSoap] = useState(null);
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    if (status !== "active") return undefined;
    const timer = window.setInterval(() => setSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000)), 250);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    let animationFrame;
    const draw = () => {
      const width = canvas.width = canvas.clientWidth * window.devicePixelRatio;
      const height = canvas.height = canvas.clientHeight * window.devicePixelRatio;
      context.clearRect(0, 0, width, height);
      const analyser = analyserRef.current;
      const values = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;
      if (analyser) analyser.getByteFrequencyData(values);
      context.lineWidth = 2 * window.devicePixelRatio;
      context.strokeStyle = status === "active" ? "#00e89a" : "rgba(0,232,154,.38)";
      context.shadowBlur = status === "active" ? 18 : 8;
      context.shadowColor = "#00e89a";
      context.beginPath();
      for (let i = 0; i < 160; i += 1) {
        const x = (i / 159) * width;
        const sample = values ? values[i % values.length] / 255 : 0.18;
        const wave = Math.sin(i * 0.22 + Date.now() / 520) * (8 + sample * 24);
        const y = height / 2 + wave;
        if (i === 0) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.stroke();
      animationFrame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, [status]);

  const cleanup = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    analyserRef.current = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;
    chunksRef.current = [];
    setLevel(0);
  };

  useEffect(() => () => cleanup(), []);

  const start = async () => {
    setError("");
    setSoap(null);
    setTranscript("");
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContextClass();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      audioContext.createMediaStreamSource(stream).connect(analyser);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      const samples = new Uint8Array(analyser.fftSize);
      const meter = () => {
        analyser.getByteTimeDomainData(samples);
        const average = samples.reduce((sum, sample) => sum + Math.abs(sample - 128), 0) / samples.length;
        setLevel(Math.min(100, Math.round(average * 5)));
        frameRef.current = requestAnimationFrame(meter);
      };
      meter();
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
      recorder.onstop = process;
      recorder.start(500);
      recorderRef.current = recorder;
      startedAtRef.current = Date.now();
      setSeconds(0);
      setStatus("active");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Microphone access was not available.");
      cleanup();
    }
  };

  const stop = () => {
    if (!recorderRef.current) return;
    setStatus("processing");
    recorderRef.current.stop();
    recorderRef.current = null;
  };

  const process = async () => {
    const audio = new Blob(chunksRef.current, { type: "audio/webm" });
    chunksRef.current = [];
    cleanup();
    try {
      if (!audio.size) throw new Error("No audio was captured. Please try again.");
      const transcription = await transcribeAudio(audio);
      const text = transcription?.transcript?.trim();
      if (!text) throw new Error("No speech was detected.");
      setTranscript(text);
      const result = await createSoapDraft(text);
      setSoap(result.note);
      setStatus("complete");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The session could not be processed.");
      setStatus("ready");
    }
  };

  const savePdf = () => {
    const previous = document.title;
    document.title = `SomaSync-Secure-Space-SOAP-${new Date().toISOString().slice(0, 10)}`;
    window.print();
    window.setTimeout(() => { document.title = previous; }, 1500);
  };

  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  return (
    <div className="secure-space-page">
      <header className="secure-space-header">
        <div><div className="secure-eyebrow"><span className="secure-live-dot" /> SECURE SPACE · SOMASYNC STAGING</div><h1>Live Clinical Workspace</h1><p>One-time, de-identified documentation session with live signal feedback.</p></div>
        <div className={`secure-status ${status}`}><span />{status === "active" ? "LIVE SESSION" : status === "processing" ? "PROCESSING" : status === "complete" ? "REVIEW READY" : "READY"}</div>
      </header>
      <div className="secure-privacy">Do not enter names, dates of birth, contact details, medical-record numbers, or other identifying information. Review every AI draft before use.</div>
      <section className="secure-grid">
        <div className="secure-main-card">
          <div className="secure-card-top"><div><span className="secure-label">SIGNAL MONITOR</span><strong>{status === "active" ? "Microphone input is live" : "Awaiting secure session"}</strong></div><div className="secure-timer">{time}</div></div>
          <canvas ref={canvasRef} className="secure-wave-canvas" aria-label="Animated microphone waveform" />
          <div className="secure-meter"><span>INPUT LEVEL</span><div><i style={{ width: `${level}%` }} /></div><b>{level}%</b></div>
          <div className="secure-actions"><button className="secure-button primary" onClick={start} disabled={status !== "ready"}>Start one-time session</button><button className="secure-button danger" onClick={stop} disabled={status !== "active"}>End & create SOAP</button></div>
          {error && <div className="secure-error">{error}</div>}
        </div>
        <aside className="secure-side-card"><span className="secure-label">LIVE SESSION EVENTS</span><div className="secure-event"><b>●</b><span>{status === "active" ? "Microphone connected" : "Workspace ready"}<small>Operational state only</small></span></div><div className="secure-event"><b>◌</b><span>{status === "complete" ? "SOAP draft prepared" : "Waiting for session"}<small>No raw audio shown here</small></span></div><div className="secure-event"><b>✓</b><span>Human review required<small>Before clinical or billing use</small></span></div></aside>
      </section>
      {transcript && <section className="secure-output-card"><div className="secure-card-top"><div><span className="secure-label">FINAL TRANSCRIPT</span><strong>Private review context</strong></div></div><p className="secure-transcript">{transcript}</p></section>}
      {soap && <section className="secure-output-card secure-soap-output"><div className="secure-card-top"><div><span className="secure-label">STRUCTURED SOAP NOTE</span><strong>AI draft · clinician review required</strong></div><button className="secure-button small" onClick={savePdf} disabled={!reviewed}>Save PDF</button></div>{[["S", "Subjective", soap.subjective], ["O", "Objective", soap.objective], ["A", "Assessment", soap.assessment], ["P", "Plan", soap.plan]].map(([letter, label, value]) => value && <div className="secure-soap-row" key={label}><b>{letter}</b><div><span>{label}</span><p>{value}</p></div></div>)}{soap.icd10?.length > 0 && <div className="secure-soap-row"><b>ICD</b><div><span>ICD-10-CM references · verify officially</span><p>{soap.icd10.map((code) => `${code.code} — ${code.description}`).join("\n")}</p></div></div>}<label className="secure-review"><input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)} /> I reviewed and edited this draft before saving.</label></section>}
    </div>
  );
}
