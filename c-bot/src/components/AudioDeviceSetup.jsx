import { useEffect, useRef, useState } from "react";

const DEVICE_ID_KEY = "somasync_audio_input_id";
const DEVICE_LABEL_KEY = "somasync_audio_input_label";

export default function AudioDeviceSetup({ onComplete, onSkip }) {
  const [inputs, setInputs] = useState([]);
  const [selectedId, setSelectedId] = useState(() => localStorage.getItem(DEVICE_ID_KEY) || "default");
  const [enabled, setEnabled] = useState(false);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState("");
  const streamRef = useRef(null);
  const contextRef = useRef(null);
  const frameRef = useRef(null);

  const stopPreview = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    contextRef.current?.close();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    frameRef.current = null;
    contextRef.current = null;
    streamRef.current = null;
  };

  const refreshInputs = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputs = devices
      .filter((device) => device.kind === "audioinput")
      .map((device, index) => ({
        deviceId: device.deviceId,
        label: device.label || `Microphone ${index + 1}`,
      }));
    setInputs(audioInputs);
    if (!audioInputs.some((input) => input.deviceId === selectedId)) {
      setSelectedId(audioInputs[0]?.deviceId || "default");
    }
  };

  const beginMeter = (stream) => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    context.createMediaStreamSource(stream).connect(analyser);
    const data = new Uint8Array(analyser.fftSize);
    const update = () => {
      analyser.getByteTimeDomainData(data);
      const average = data.reduce((sum, sample) => sum + Math.abs(sample - 128), 0) / data.length;
      setLevel(Math.min(100, Math.round(average * 4)));
      frameRef.current = requestAnimationFrame(update);
    };
    contextRef.current = context;
    update();
  };

  const enableMicrophone = async () => {
    setError("");
    stopPreview();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;
      await refreshInputs();
      beginMeter(stream);
      setEnabled(true);
    } catch {
      setError("SomaSync needs microphone permission. Select Allow in your browser, then try again.");
    }
  };

  const finish = () => {
    const selected = inputs.find((input) => input.deviceId === selectedId);
    localStorage.setItem(DEVICE_ID_KEY, selectedId);
    localStorage.setItem(DEVICE_LABEL_KEY, selected?.label || "System default microphone");
    localStorage.setItem("somasync_audio_setup_complete", "1");
    localStorage.removeItem("somasync_audio_setup_skipped");
    stopPreview();
    onComplete();
  };

  useEffect(() => {
    const handleDeviceChange = () => { if (enabled) void refreshInputs(); };
    navigator.mediaDevices?.addEventListener?.("devicechange", handleDeviceChange);
    return () => {
      navigator.mediaDevices?.removeEventListener?.("devicechange", handleDeviceChange);
      stopPreview();
    };
  }, [enabled]);

  const selectedLabel = inputs.find((input) => input.deviceId === selectedId)?.label || "System default microphone";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, overflowY: "auto", padding: 24, background: "#080808", color: "#f0ede8", fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif" }}>
      <main style={{ maxWidth: 620, margin: "38px auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(0,232,154,.28)", borderRadius: 999, padding: "7px 12px", color: "#00e89a", fontSize: 12, fontWeight: 700 }}>Audio setup · one time</div>
        <h1 style={{ fontFamily: "Syne, ui-sans-serif, system-ui, sans-serif", margin: "18px 0 10px", fontSize: "clamp(30px, 6vw, 44px)", letterSpacing: "-.045em", lineHeight: 1.05 }}>Connect. Confirm. Start.</h1>
        <p style={{ margin: 0, color: "rgba(240,237,232,.62)", fontSize: 16, lineHeight: 1.65 }}>Pair your Bluetooth headset in this device’s system settings. SomaSync will use the microphone you select below for every session.</p>

        <section style={{ marginTop: 28, border: "1px solid rgba(255,255,255,.11)", borderRadius: 18, overflow: "hidden", background: "rgba(255,255,255,.025)" }}>
          <div style={{ padding: "20px 22px", borderBottom: "1px solid rgba(255,255,255,.08)", color: "#00e89a", fontSize: 12, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>Three quick steps</div>
          <ol style={{ margin: 0, padding: "8px 22px 16px 46px", color: "rgba(240,237,232,.72)", lineHeight: 1.65 }}>
            <li style={{ padding: "10px 0" }}>Pair your Bluetooth headset in your device’s Bluetooth settings.</li>
            <li style={{ padding: "10px 0" }}>Enable your microphone below and allow browser access.</li>
            <li style={{ padding: "10px 0" }}>Choose the headset microphone, confirm the meter moves, and start charting.</li>
          </ol>
        </section>

        {!enabled ? (
          <button onClick={enableMicrophone} style={{ marginTop: 22, width: "100%", border: 0, borderRadius: 12, padding: "16px 20px", fontSize: 16, fontWeight: 800, cursor: "pointer", color: "#071614", background: "linear-gradient(135deg,#00e89a,#61e4b4)" }}>Enable microphone</button>
        ) : (
          <section style={{ marginTop: 22, border: "1px solid rgba(0,232,154,.28)", borderRadius: 18, padding: 22, background: "rgba(0,232,154,.045)" }}>
            <label htmlFor="audio-device" style={{ display: "block", fontSize: 13, fontWeight: 800, marginBottom: 9 }}>Microphone to use</label>
            <select id="audio-device" value={selectedId} onChange={(event) => setSelectedId(event.target.value)} style={{ width: "100%", border: "1px solid rgba(255,255,255,.18)", borderRadius: 10, background: "#101313", color: "#fff", padding: "13px 14px", fontSize: 14 }}>
              {inputs.length === 0 && <option value="default">System default microphone</option>}
              {inputs.map((input) => <option value={input.deviceId} key={input.deviceId}>{input.label}</option>)}
            </select>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 16 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: level > 4 ? "#00e89a" : "#607080", boxShadow: level > 4 ? "0 0 14px #00e89a" : "none" }} />
              <span style={{ fontSize: 13, color: "rgba(240,237,232,.72)" }}>{level > 4 ? "Sound detected — your microphone is ready" : "Speak normally to test your microphone"}</span>
            </div>
            <div style={{ height: 7, marginTop: 10, overflow: "hidden", borderRadius: 99, background: "rgba(255,255,255,.10)" }}><div style={{ height: "100%", width: `${Math.max(3, level)}%`, borderRadius: 99, transition: "width .12s", background: "linear-gradient(90deg,#00e89a,#61e4b4)" }} /></div>
            <button onClick={finish} style={{ marginTop: 22, width: "100%", border: 0, borderRadius: 12, padding: "16px 20px", fontSize: 16, fontWeight: 800, cursor: "pointer", color: "#071614", background: "linear-gradient(135deg,#00e89a,#61e4b4)" }}>Use {selectedLabel} and continue</button>
          </section>
        )}

        {error && <p role="alert" style={{ margin: "14px 0 0", color: "#ff8d8d", fontSize: 13 }}>{error}</p>}
        <button onClick={onSkip} style={{ display: "block", margin: "18px auto 0", border: 0, background: "transparent", color: "rgba(240,237,232,.48)", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}>Set this up later</button>
      </main>
    </div>
  );
}
