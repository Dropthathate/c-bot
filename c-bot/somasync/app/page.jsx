"use client";

import { useEffect, useRef, useState } from "react";

export default function Page() {
  const recognitionRef = useRef(null);

  const [state, setState] = useState("idle");
  const [transcript, setTranscript] = useState([]);
  const [soap, setSoap] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Speech recognition not supported in this browser.");
      return;
    }

    const r = new window.webkitSpeechRecognition();
    r.continuous = true;
    r.interimResults = false;
    r.lang = "en-US";

    r.onresult = (e) => {
      const text = e.results[e.results.length - 1][0].transcript.trim();
      handleSpeech(text);
    };

    r.onend = () => {
      if (state === "active") r.start();
    };

    recognitionRef.current = r;
  }, [state]);

  function handleSpeech(text) {
    const t = text.toLowerCase();
    if (t.includes("pause")) return pause();
    if (t.includes("end session")) return end();
    setTranscript((prev) => [...prev, text]);
  }

  function start() {
    setTranscript([]);
    setSoap(null);
    setError(null);
    setState("active");
    recognitionRef.current.start();
  }

  function pause() {
    setState("paused");
    recognitionRef.current.stop();
  }

  function resume() {
    setState("active");
    recognitionRef.current.start();
  }

  async function end() {
    recognitionRef.current.stop();
    setState("generating");

    const notes = transcript.join(". ");
    if (!notes) {
      setError("No content recorded");
      setState("idle");
      return;
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawNotes: notes }),
      });

      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      setSoap(data.soap);
    } catch (e) {
      setError(e.message);
    } finally {
      setState("idle");
    }
  }

  return (
    <main style={{ padding: 32 }}>
      <h1>SomaSync AI</h1>
      <p>Status: {state}</p>

      <button onClick={start} disabled={state !== "idle"}>Start</button>
      <button onClick={pause} disabled={state !== "active"}>Pause</button>
      <button onClick={resume} disabled={state !== "paused"}>Resume</button>
      <button onClick={end} disabled={state === "idle"}>Generate</button>

      <hr />

      <h3>Transcript</h3>
      {transcript.map((t, i) => (
        <div key={i}>{t}</div>
      ))}

      {state === "generating" && <p>Generating SOAP…</p>}

      {soap && (
        <>
          <h2>SOAP Note</h2>
          <h3>Subjective</h3><p>{soap.subjective}</p>
          <h3>Objective</h3><p>{soap.objective}</p>
          <h3>Assessment</h3><p>{soap.assessment}</p>
          <h3>Plan</h3><p>{soap.plan}</p>

          <h3>ICD-10</h3>
          {soap.icd10?.map(c => (
            <div key={c.code}>{c.code} — {c.description}</div>
          ))}

          <h3>CPT</h3>
          {soap.cpt?.map(c => (
            <div key={c.code}>
              {c.code} — {c.description} {c.units && `(${c.units}u)`}
            </div>
          ))}
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}
