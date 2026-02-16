import { useEffect, useRef, useState } from "react";
import "./App.css";

const SUPABASE_URL = "https://ucqprtpuuyflnxjmatwo.supabase.co";
const SUPABASE_ANON_KEY = "PASTE_YOUR_ANON_KEY_HERE";

export default function App() {
  const recognitionRef = useRef(null);

  const [state, setState] = useState("idle"); // idle | active | paused | generating
  const [transcript, setTranscript] = useState([]);
  const [soap, setSoap] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Speech recognition not supported in this browser.");
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
      if (state === "active") recognition.start();
    };

    recognitionRef.current = recognition;
  }, [state]);

  function handleSpeech(text) {
    const lower = text.toLowerCase();
    if (lower.includes("pause")) return pause();
    if (lower.includes("end session")) return end();

    setTranscript((t) => [...t, text]);
  }

  function start() {
    setTranscript([]);
    setSoap(null);
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
    if (!notes.trim()) {
      setError("No content recorded");
      setState("idle");
      return;
    }

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-soap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ rawNotes: notes }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSoap(data.soap);
    } catch (err) {
      setError(err.message);
    } finally {
      setState("idle");
    }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>SomaSync AI</h2>
        <p>Status: {state}</p>

        <button onClick={start} disabled={state !== "idle"}>
          Start
        </button>
        <button onClick={pause} disabled={state !== "active"}>
          Pause
        </button>
        <button onClick={resume} disabled={state !== "paused"}>
          Resume
        </button>
        <button onClick={end} disabled={state === "idle"}>
          Generate
        </button>

        <div className="transcript">
          {transcript.map((t, i) => (
            <div key={i}>{t}</div>
          ))}
        </div>
      </aside>

      <main className="main">
        {!soap && state !== "generating" && (
          <p>No documentation generated yet.</p>
        )}

        {state === "generating" && <p>Generating SOAP note…</p>}

        {soap && (
          <div className="soap">
            <section>
              <h3>Subjective</h3>
              <p>{soap.subjective}</p>
            </section>

            <section>
              <h3>Objective</h3>
              <p>{soap.objective}</p>
            </section>

            <section>
              <h3>Assessment</h3>
              <p>{soap.assessment}</p>
            </section>

            <section>
              <h3>Plan</h3>
              <p>{soap.plan}</p>
            </section>

            <section>
              <h3>ICD-10</h3>
              {soap.icd10?.map((c) => (
                <div key={c.code}>
                  {c.code} — {c.description}
                </div>
              ))}
            </section>

            <section>
              <h3>CPT</h3>
              {soap.cpt?.map((c) => (
                <div key={c.code}>
                  {c.code} — {c.description} {c.units && `(${c.units}u)`}
                </div>
              ))}
            </section>

            {soap.medical_necessity && (
              <section>
                <h3>Medical Necessity</h3>
                <p>{soap.medical_necessity}</p>
              </section>
            )}
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}
      </main>
    </div>
  );
}
