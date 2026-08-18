import { useEffect, useRef, useState } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "https://ucqprtpuuyflnxjmatwo.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

const STATE_LABELS = {
  idle:       { label: "Ready",        color: "var(--dim)"    },
  active:     { label: "Recording...", color: "var(--grn)"    },
  paused:     { label: "Paused",       color: "var(--orange)" },
  generating: { label: "Generating...",color: "var(--blue)"   },
};

export default function SoapGenerator() {
  const recognitionRef = useRef(null);
  const stateRef = useRef("idle");

  const [state, setState]           = useState("idle");
  const [transcript, setTranscript] = useState([]);
  const [soap, setSoap]             = useState(null);
  const [error, setError]           = useState(null);
  const [copied, setCopied]         = useState(false);
  const [browserOk, setBrowserOk]   = useState(true);

  useEffect(() => { stateRef.current = state; }, [state]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setBrowserOk(false);
      setError("Speech recognition not supported. Use Chrome or Edge.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (e) => {
      const text = e.results[e.results.length - 1][0].transcript.trim();
      handleSpeech(text);
    };
    recognition.onend = () => {
      if (stateRef.current === "active") recognition.start();
    };
    recognitionRef.current = recognition;
  }, []);

  function handleSpeech(text) {
    const lower = text.toLowerCase();
    if (lower.includes("pause")) return pause();
    if (lower.includes("end session")) return end();
    setTranscript(t => [...t, text]);
  }

  function start() {
    setTranscript([]); setSoap(null); setError(null);
    setState("active"); recognitionRef.current?.start();
  }
  function pause() { setState("paused"); recognitionRef.current?.stop(); }
  function resume() { setState("active"); recognitionRef.current?.start(); }

  async function end() {
    recognitionRef.current?.stop();
    setState("generating");
    const notes = transcript.join(". ");
    if (!notes.trim()) {
      setError("No content recorded — start a session and speak your observations.");
      setState("idle"); return;
    }
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-soap`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ rawNotes: notes }),
      });
      if (!res.ok) throw new Error(`API error: HTTP ${res.status}`);
      const data = await res.json();
      setSoap(data.soap);
    } catch (err) { setError(err.message); }
    finally { setState("idle"); }
  }

  const handleCopy = () => {
    if (!soap) return;
    const text = [
      "SOAP NOTE — SomaSync AI (AALIYAH.IO)",
      "⚠ AI-generated draft. Requires licensed clinician review before clinical use.\n",
      `SUBJECTIVE\n${soap.subjective}`,
      `OBJECTIVE\n${soap.objective}`,
      `ASSESSMENT\n${soap.assessment}`,
      `PLAN\n${soap.plan}`,
      soap.icd10?.length ? `ICD-10\n${soap.icd10.map(c => `${c.code} — ${c.description}`).join("\n")}` : "",
      soap.cpt?.length ? `CPT\n${soap.cpt.map(c => `${c.code} — ${c.description}${c.units ? ` (${c.units}u)` : ""}`).join("\n")}` : "",
      soap.medical_necessity ? `MEDICAL NECESSITY\n${soap.medical_necessity}` : "",
    ].filter(Boolean).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stateInfo = STATE_LABELS[state];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">SOAP Note Generator</h1>
          <p className="page-sub">Voice-powered clinical documentation via SomaSync AI</p>
        </div>
        <div className="status-pill" style={{ background: `${stateInfo.color}18`, color: stateInfo.color, border: `1px solid ${stateInfo.color}30` }}>
          <span className="status-dot" style={{ background: stateInfo.color, boxShadow: `0 0 6px ${stateInfo.color}` }} />
          {stateInfo.label}
        </div>
      </div>

      <div className="ai-disclaimer-bar">
        🤖 AI-generated — All outputs are suggestions only. A licensed clinician must review before clinical, billing, or legal use.
      </div>

      {!browserOk && (
        <div className="error-card">🚫 Speech recognition requires Chrome or Edge.</div>
      )}

      <div className="soap-layout">
        <div className="soap-controls-col">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Voice Controls</span>
              <span className="card-tag">Live</span>
            </div>
            <div className="controls-body">
              <div className="voice-tip">
                Say <strong>"pause"</strong> to pause · <strong>"end session"</strong> to generate
              </div>
              <div className="controls-grid">
                <button className="ctrl-btn ctrl-start" onClick={start} disabled={state !== "idle"}>
                  <span className="ctrl-icon">🎙</span>Start Session
                </button>
                <button className="ctrl-btn ctrl-pause" onClick={pause} disabled={state !== "active"}>
                  <span className="ctrl-icon">⏸</span>Pause
                </button>
                <button className="ctrl-btn ctrl-resume" onClick={resume} disabled={state !== "paused"}>
                  <span className="ctrl-icon">▶</span>Resume
                </button>
                <button className="ctrl-btn ctrl-generate" onClick={end} disabled={state === "idle"}>
                  <span className="ctrl-icon">⚡</span>Generate SOAP
                </button>
              </div>
            </div>
          </div>

          <div className="card" style={{ flex: 1 }}>
            <div className="card-header">
              <span className="card-title">Live Transcript</span>
              {transcript.length > 0 && (
                <span style={{ fontSize: 11, color: "var(--dim)" }}>
                  {transcript.length} segment{transcript.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="transcript-body">
              {transcript.length === 0 ? (
                <div className="transcript-empty">
                  {state === "active"
                    ? <><div className="recording-pulse" />Listening for speech...</>
                    : <>Start a session to begin recording</>}
                </div>
              ) : (
                <div className="transcript-list">
                  {transcript.map((t, i) => (
                    <div className="transcript-line" key={i}>
                      <span className="t-num">{i + 1}</span>
                      <span className="t-text">{t}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="soap-output-col">
          {state === "generating" && (
            <div className="soap-generating">
              <div className="gen-spinner" />
              <div className="gen-text">Generating SOAP note via Supabase...</div>
              <div className="gen-sub">Analyzing {transcript.length} transcript segments</div>
            </div>
          )}

          {!soap && state !== "generating" && (
            <div className="soap-empty-state">
              <div className="empty-icon">📋</div>
              <div className="empty-title">No note generated yet</div>
              <div className="empty-sub">Start a voice session and click "Generate SOAP" when done</div>
            </div>
          )}

          {soap && state !== "generating" && (
            <div className="card soap-result">
              <div className="card-header">
                <span className="card-title">Generated SOAP Note</span>
                <button className="btn-copy" onClick={handleCopy}>
                  {copied ? "✓ Copied!" : "Copy Note"}
                </button>
              </div>

              <div className="draft-badge">⚠ AI DRAFT — Clinician review required before clinical or billing use</div>

              {[
                { key: "subjective", label: "S — Subjective", cls: "soap-s" },
                { key: "objective",  label: "O — Objective",  cls: "soap-o" },
                { key: "assessment", label: "A — Assessment", cls: "soap-a" },
                { key: "plan",       label: "P — Plan",       cls: "soap-p" },
              ].map(({ key, label, cls }) =>
                soap[key] ? (
                  <div className="soap-section" key={key}>
                    <span className={`soap-section-label ${cls}`}>{label}</span>
                    <p className="soap-section-text">{soap[key]}</p>
                  </div>
                ) : null
              )}

              {soap.icd10?.length > 0 && (
                <div className="soap-section">
                  <span className="soap-section-label soap-icd">ICD-10 Codes</span>
                  <div className="code-list">
                    {soap.icd10.map(c => (
                      <div className="code-row" key={c.code}>
                        <span className="code-badge code-teal">{c.code}</span>
                        <span className="code-desc">{c.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {soap.cpt?.length > 0 && (
                <div className="soap-section">
                  <span className="soap-section-label soap-cpt">CPT Codes</span>
                  <div className="code-list">
                    {soap.cpt.map(c => (
                      <div className="code-row" key={c.code}>
                        <span className="code-badge code-blue">{c.code}</span>
                        <span className="code-desc">
                          {c.description}
                          {c.units && <span className="code-units"> · {c.units} units</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {soap.medical_necessity && (
                <div className="soap-section">
                  <span className="soap-section-label soap-mn">Medical Necessity</span>
                  <p className="soap-section-text">{soap.medical_necessity}</p>
                </div>
              )}
            </div>
          )}

          {error && <div className="error-card">⚠ {error}</div>}
        </div>
      </div>
    </div>
  );
}
