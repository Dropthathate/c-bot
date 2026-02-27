import { useEffect, useRef, useState } from "react";
import "./App.css";

const SUPABASE_URL = "https://ucqprtpuuyflnxjmatwo.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

// ─── VIEWS: landing → login → dashboard ──────────────────────────────────────
export default function App() {
  const [view, setView] = useState("landing"); // landing | login | dashboard
  const [user, setUser] = useState(null);

  // Check if already logged in via Supabase session
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}`, apikey: SUPABASE_ANON_KEY },
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.email) { setUser(data); setView("dashboard"); }
      }
    } catch (_) {}
  }

  if (view === "landing") return <Landing onLogin={() => setView("login")} />;
  if (view === "login")   return <Login onSuccess={(u) => { setUser(u); setView("dashboard"); }} onBack={() => setView("landing")} />;
  if (view === "dashboard") return <Dashboard user={user} onLogout={() => { setUser(null); setView("landing"); }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────────────────────────────────────
function Landing({ onLogin }) {
  return (
    <div className="landing">
      {/* Beta banner */}
      <div className="beta-banner">
        ⚠️ BETA / TESTING — <span>All AI outputs are for demonstration only and do not constitute medical advice.</span>
      </div>

      {/* Nav */}
      <nav className="l-nav">
        <div className="l-logo"><div className="l-logo-badge">🩺</div>SomaSync <span>AI</span></div>
        <div className="l-nav-links">
          <a href="#demo">Demo</a>
          <a href="#features">Features</a>
          <a href="#access">Access</a>
          <button className="btn-outline" onClick={onLogin}>Dashboard Login</button>
          <button className="btn-dark" onClick={() => document.getElementById("access").scrollIntoView({ behavior: "smooth" })}>Join Waitlist</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="l-hero">
        <div className="l-hero-mesh" />
        <div className="l-hero-inner">
          <div className="l-eyebrow"><div className="l-eyebrow-dot" />Introducing SomaSync AI · AALIYAH.IO</div>
          <h1 className="l-h1">Intelligence<br />That <span className="l-grad">Listens</span></h1>
          <p className="l-sub">From rough clinical observations to ICD-10-aligned SOAP notes — automatically, in seconds.</p>
          <div className="l-actions">
            <a href="#demo" className="btn-hero">See How It Works →</a>
            <button className="btn-ghost" onClick={() => document.getElementById("access").scrollIntoView({ behavior: "smooth" })}>Request Dashboard Access ›</button>
          </div>
          <div className="l-stats">
            {[["88%","Avg confidence"],["3×","Faster docs"],["ICD-10","Aligned output"],["β","In beta"]].map(([v,l]) => (
              <div key={l} className="l-stat"><div className="l-stat-val">{v}</div><div className="l-stat-lbl">{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* Waveform */}
      <div className="l-wave-wrap">
        <div className="l-wave-card">
          <div className="l-wave-label">Live Processing</div>
          <div className="l-wave-bars">
            {[10,14,20,28,38,50,58,68,72,78,84,80,88,84,80,88,80,72,80,86,78,68,60,50,42,34,26,18,12,10].map((h,i) => (
              <div key={i} className="l-wbar" style={{ height: h, animationDelay: `${i * 0.055}s` }} />
            ))}
          </div>
          <div className="l-wave-status"><div className="l-wave-dot" />Listening for clinical observations...</div>
        </div>
      </div>

      {/* Flow */}
      <section className="l-section l-gray" id="features">
        <div className="l-section-head">
          <div className="l-tag">How It Works</div>
          <h2 className="l-h2">Seamless Clinical Flow</h2>
          <p className="l-section-sub">Four intelligent steps from rough notes to reimbursement-ready documentation.</p>
        </div>
        <div className="l-flow-grid">
          {[
            { icon:"🎙", title:"Listen",    body:"Captures practitioner observations and rough spoken notes in real time." },
            { icon:"⚡", title:"Analyze",   body:"Interprets posture, movement, and symptom patterns with clinical logic." },
            { icon:"🔄", title:"Translate", body:"Converts messy findings into structured clinical and billable language." },
            { icon:"📄", title:"Document",  body:"Outputs complete SOAP notes aligned with ICD-10 frameworks, EHR-ready." },
          ].map((f,i) => (
            <div key={i} className="l-flow-card">
              <div className="l-flow-icon">{f.icon}</div>
              <div className="l-step-num">Step 0{i+1}</div>
              <div className="l-flow-title">{f.title}</div>
              <div className="l-flow-body">{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo */}
      <section className="l-section" id="demo">
        <div className="l-section-head">
          <div className="l-tag">Live Demo</div>
          <h2 className="l-h2">See the Transformation</h2>
          <p className="l-section-sub">Rough clinical language becomes structured, reimbursable documentation.</p>
        </div>
        <div className="l-demo-grid">
          <div className="l-demo-in">
            <div className="l-chrome"><span className="cd r"/><span className="cd y"/><span className="cd g"/><span className="l-clabel">Rough Input</span></div>
            <div className="l-demo-body">
              {["Client has low back tightness, worse in the morning","Palpable hypertonicity throughout lumbar paraspinals","Pain increases with forward flexion","Reports radiating discomfort into left glute"].map((line,i) => (
                <div key={i} className="l-raw-line"><span className="l-q">"</span>{line}<span className="l-q">"</span></div>
              ))}
            </div>
          </div>
          <div className="l-demo-out">
            <div className="l-chrome"><span className="cd r"/><span className="cd y"/><span className="cd g"/><span className="l-clabel" style={{color:"#3a3f4a"}}>⚡ ICD-10 Output</span></div>
            <div className="l-demo-body">
              {[
                { code:"M54.5",   name:"Low back pain",         bg:"rgba(48,217,192,0.15)", color:"#30d9c0" },
                { code:"M62.838", name:"Muscle spasm, lumbar",  bg:"rgba(10,132,255,0.15)", color:"#6ab5ff" },
                { code:"R29.3",   name:"Abnormal posture",      bg:"rgba(255,159,10,0.15)", color:"#ffb340" },
                { code:"M54.42",  name:"Lumbago w/ sciatica, L",bg:"rgba(191,90,242,0.15)",color:"#bf5af2" },
              ].map(row => (
                <div key={row.code} className="l-icd-row">
                  <span className="l-badge" style={{background:row.bg,color:row.color}}>{row.code}</span>
                  <span className="l-icd-name">{row.name}</span>
                </div>
              ))}
              <div className="l-conf-row">
                <span className="l-conf-key">Confidence</span>
                <div className="l-conf-track"><div className="l-conf-fill" /></div>
                <span className="l-conf-pct">88.5%</span>
              </div>
            </div>
          </div>
        </div>
        <p className="l-disclaimer">Illustrative example only. Final diagnosis remains clinician decision.</p>
      </section>

      {/* Access */}
      <section className="l-section l-gray" id="access">
        <div className="l-section-head">
          <div className="l-tag">AALIYAH.IO Dashboard</div>
          <h2 className="l-h2">Request Access</h2>
          <p className="l-section-sub">Closed beta — SOAP generator, ICD-10 coder, analytics. Access granted within 48h.</p>
        </div>
        <div className="l-access-card">
          <h3 className="l-access-title">Request Dashboard Access</h3>
          <p className="l-access-sub">AALIYAH.IO · SomaSync MVP Beta</p>
          {[["FULL NAME","text","Your full name"],["EMAIL ADDRESS","email","you@practice.com"],["PROFESSION / SPECIALTY","text","e.g. NMT, LMT, Sports Therapist"]].map(([label,type,placeholder]) => (
            <div key={label} className="l-field">
              <label className="l-field-label">{label}</label>
              <input className="l-field-input" type={type} placeholder={placeholder} />
            </div>
          ))}
          <div className="l-notice">⚠️ Beta — AI outputs require clinician review before clinical use.</div>
          <button className="l-btn-access" onClick={(e) => { e.target.textContent = "✓ Submitted — We'll be in touch within 48 hours"; e.target.style.background = "#34c759"; e.target.disabled = true; }}>
            Request Access →
          </button>
          <p className="l-form-disclaimer">By submitting you acknowledge SomaSync AI is a beta product. AI outputs are not a substitute for professional clinical judgment.</p>
        </div>
      </section>

      {/* Legal */}
      <section className="l-section" style={{paddingTop:48,paddingBottom:48}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <h3 className="l-legal-title">Legal &amp; AI Disclaimers</h3>
          <div className="l-legal-box">
            <strong>AI-Generated Content:</strong> All documentation produced by SomaSync AI is generated by artificial intelligence and may contain errors. All outputs must be reviewed by a licensed clinician before use. <strong>Not Medical Advice:</strong> SomaSync AI does not provide medical advice, diagnosis, or treatment. <strong>Beta Notice:</strong> This product is in beta and is not approved for regulated clinical use. <strong>Billing &amp; Coding:</strong> Code suggestions are not guaranteed accurate for any specific payer. Practitioners are solely responsible for compliance. <strong>Limitation of Liability:</strong> AALIYAH.IO shall not be liable for damages arising from reliance on AI-generated outputs. © 2026 AALIYAH.IO.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="l-footer">
        <div className="l-footer-left"><span className="l-footer-logo">SomaSync AI</span> · © 2026 AALIYAH.IO. All rights reserved.</div>
        <div className="l-footer-links">
          {["Privacy Policy","Terms of Use","AI Disclaimer"].map(l => <a key={l} href="#">{l}</a>)}
          <button onClick={onLogin} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#a1a1a6"}}>Dashboard Login</button>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
function Login({ onSuccess, onBack }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description ?? data.msg ?? "Login failed");
      onSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-mesh" />
      <div className="login-card">
        <div className="login-header">
          <div className="login-badge">🩺</div>
          <h1 className="login-title">SomaSync AI</h1>
          <p className="login-sub">AALIYAH.IO Dashboard</p>
        </div>
        <div className="login-notice">
          🔒 Access restricted to approved beta testers.
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="field">
            <label className="field-label">Email</label>
            <input className="field-input" type="email" placeholder="you@practice.com" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
          </div>
          <div className="field">
            <label className="field-label">Password</label>
            <input className="field-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button className="login-btn" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In →"}</button>
        </form>
        <div className="login-footer-links">
          <button className="back-link" onClick={onBack}>← Back to homepage</button>
        </div>
        <p className="login-disclaimer">⚠️ AI outputs are for demonstration only and require clinician review before clinical use.</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD (your original voice app + sidebar nav)
// ─────────────────────────────────────────────────────────────────────────────
const DASH_VIEWS = ["SOAP Notes","ICD-10 Coder","Analytics","Settings"];

function Dashboard({ user, onLogout }) {
  const [activeView, setActiveView] = useState("SOAP Notes");

  return (
    <div className="dash-shell">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <div className="logo-badge">🩺</div>
            <div><div className="logo-name">SomaSync</div><div className="logo-sub">AALIYAH.IO</div></div>
          </div>
          <div className="beta-pill">BETA</div>
          <nav className="sidebar-nav">
            {[["▦","Overview"],["📋","SOAP Notes"],["⚡","ICD-10 Coder"],["📊","Analytics"],["⚙️","Settings"]].map(([icon,label]) => (
              <button key={label} className={`nav-item ${activeView === label ? "nav-item-active" : ""}`} onClick={() => setActiveView(label)}>
                <span className="nav-icon">{icon}</span>{label}
              </button>
            ))}
          </nav>
        </div>
        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="user-avatar">{user?.email?.[0]?.toUpperCase() ?? "U"}</div>
            <div className="user-info">
              <div className="user-name">{user?.email?.split("@")[0]}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout}>Sign Out</button>
          <div className="sidebar-disclaimer">⚠️ Beta — AI outputs require clinician review before clinical use.</div>
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">
        {activeView === "Overview"    && <DashOverview setView={setActiveView} />}
        {activeView === "SOAP Notes"  && <SoapView />}
        {activeView === "ICD-10 Coder"&& <IcdView />}
        {activeView === "Analytics"   && <AnalyticsView />}
        {activeView === "Settings"    && <SettingsView user={user} onLogout={onLogout} />}
      </main>
    </div>
  );
}

// ── OVERVIEW ──────────────────────────────────────────────────────────────────
function DashOverview({ setView }) {
  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Overview</h1><p className="page-sub">SomaSync AI · AALIYAH.IO Dashboard · Beta</p></div>
        <div className="beta-warning">⚠️ Beta — AI outputs require clinician verification</div>
      </div>
      <div className="stats-grid">
        {[["📋","—","Notes Generated","sessions","#30d9c0"],["⚡","—","ICD Codes Mapped","codes","#0a84ff"],["✓","88.5%","Avg Confidence","accuracy","#34c759"],["⏱","~3×","Time Saved","vs manual","#ff9f0a"]].map(([icon,val,label,unit,color]) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{color}}>{icon}</div>
            <div className="stat-value" style={{color}}>{val}</div>
            <div className="stat-label">{label}</div>
            <div className="stat-unit">{unit}</div>
          </div>
        ))}
      </div>
      <div className="section-title">Quick Actions</div>
      <div className="actions-grid">
        {[["📋","SOAP Notes","Generate from voice or rough notes"],["⚡","ICD-10 Coder","Search and select diagnostic codes"],["📊","Analytics","View practice performance"]].map(([icon,label,desc]) => (
          <button key={label} className="action-card" onClick={() => setView(label === "Analytics" ? "Analytics" : label)}>
            <div className="action-icon">{icon}</div>
            <div><div className="action-label">{label}</div><div className="action-desc">{desc}</div></div>
            <div className="action-arrow">→</div>
          </button>
        ))}
      </div>
      <div className="disclaimer-card">
        <div className="disclaimer-title">🤖 AI Disclaimer</div>
        <p className="disclaimer-text">SomaSync AI generates documentation suggestions using artificial intelligence. All SOAP notes, ICD-10 codes, and clinical language produced are <strong>AI-generated suggestions only</strong> and must be reviewed and approved by a licensed clinician before use in any clinical, billing, or legal context.</p>
      </div>
    </div>
  );
}

// ── SOAP VIEW (your original voice logic) ─────────────────────────────────────
function SoapView() {
  const recognitionRef = useRef(null);
  const stateRef       = useRef("idle");
  const [recState, setRecState] = useState("idle");
  const [transcript, setTranscript] = useState([]);
  const [soap, setSoap]   = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [browserOk, setBrowserOk] = useState(true);

  const STATE_LABELS = { idle:{label:"Ready",color:"#6e6e73"}, active:{label:"Recording...",color:"#34c759"}, paused:{label:"Paused",color:"#ff9f0a"}, generating:{label:"Generating...",color:"#0a84ff"} };

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) { setBrowserOk(false); return; }
    const r = new window.webkitSpeechRecognition();
    r.continuous = true; r.interimResults = false; r.lang = "en-US";
    r.onresult = (e) => {
      const text = e.results[e.results.length - 1][0].transcript.trim();
      const lower = text.toLowerCase();
      if (lower.includes("pause")) return pause();
      if (lower.includes("end session")) return end();
      setTranscript(t => [...t, text]);
    };
    r.onend = () => { if (stateRef.current === "active") r.start(); };
    recognitionRef.current = r;
  }, []);

  function setState(s) { stateRef.current = s; setRecState(s); }

  function start() { setTranscript([]); setSoap(null); setError(null); setState("active"); recognitionRef.current?.start(); }
  function pause() { setState("paused"); recognitionRef.current?.stop(); }
  function resume(){ setState("active"); recognitionRef.current?.start(); }

  async function end() {
    recognitionRef.current?.stop();
    setState("generating");
    const notes = transcript.join(". ");
    if (!notes.trim()) { setError("No content recorded."); setState("idle"); return; }
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

  function handleCopy() {
    if (!soap) return;
    const text = ["SOAP NOTE — SomaSync AI (AALIYAH.IO)","⚠️ AI draft — requires clinician review\n",`SUBJECTIVE\n${soap.subjective}`,`OBJECTIVE\n${soap.objective}`,`ASSESSMENT\n${soap.assessment}`,`PLAN\n${soap.plan}`,soap.icd10?.length ? `ICD-10\n${soap.icd10.map(c=>`${c.code} — ${c.description}`).join("\n")}` : "",soap.cpt?.length ? `CPT\n${soap.cpt.map(c=>`${c.code} — ${c.description}${c.units?` (${c.units}u)`:""}`).join("\n")}` : "",soap.medical_necessity ? `MEDICAL NECESSITY\n${soap.medical_necessity}` : ""].filter(Boolean).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  }

  const si = STATE_LABELS[recState];

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">SOAP Note Generator</h1><p className="page-sub">Voice-powered clinical documentation</p></div>
        <div className="status-pill" style={{background:`${si.color}18`,color:si.color}}><span className="status-dot" style={{background:si.color}}/>{si.label}</div>
      </div>
      <div className="ai-disclaimer-bar">🤖 AI-generated — All outputs are suggestions only. A licensed clinician must review before clinical, billing, or legal use.</div>
      {!browserOk && <div className="error-card">🚫 Speech recognition requires Chrome or Edge.</div>}
      <div className="soap-layout">
        <div className="soap-controls-col">
          <div className="card">
            <div className="card-header"><span className="card-title">Voice Controls</span><span className="card-tag">Live</span></div>
            <div className="controls-body">
              <div className="voice-tip">💡 Say <strong>"pause"</strong> to pause or <strong>"end session"</strong> to generate</div>
              <div className="controls-grid">
                <button className="ctrl-btn ctrl-start"    onClick={start}  disabled={recState !== "idle"}>   <span>🎙</span>Start</button>
                <button className="ctrl-btn ctrl-pause"    onClick={pause}  disabled={recState !== "active"}> <span>⏸</span>Pause</button>
                <button className="ctrl-btn ctrl-resume"   onClick={resume} disabled={recState !== "paused"}> <span>▶</span>Resume</button>
                <button className="ctrl-btn ctrl-generate" onClick={end}    disabled={recState === "idle"}>   <span>⚡</span>Generate SOAP</button>
              </div>
            </div>
          </div>
          <div className="card" style={{flex:1}}>
            <div className="card-header"><span className="card-title">Live Transcript</span><span style={{fontSize:11,color:"#a1a1a6"}}>{transcript.length} segments</span></div>
            <div className="transcript-body">
              {transcript.length === 0
                ? <div className="transcript-empty">{recState==="active"?<><div className="recording-pulse"/>Listening...</>:"Start session to begin"}</div>
                : <div className="transcript-list">{transcript.map((t,i)=><div key={i} className="transcript-line"><span className="t-num">{i+1}</span><span className="t-text">{t}</span></div>)}</div>
              }
            </div>
          </div>
        </div>
        <div className="soap-output-col">
          {recState === "generating" && <div className="soap-generating"><div className="gen-spinner"/><div className="gen-text">Generating via Supabase...</div><div className="gen-sub">Analyzing {transcript.length} segments</div></div>}
          {!soap && recState !== "generating" && <div className="soap-empty-state"><div className="empty-icon">📋</div><div className="empty-title">No note generated yet</div><div className="empty-sub">Start a voice session and click Generate</div></div>}
          {soap && recState !== "generating" && (
            <div className="card soap-result">
              <div className="card-header"><span className="card-title">Generated SOAP Note</span><button className="btn-copy" onClick={handleCopy}>{copied?"✓ Copied!":"Copy Note"}</button></div>
              <div className="draft-badge">⚠️ AI DRAFT — Clinician review required before clinical or billing use</div>
              {[["subjective","S — Subjective","soap-s"],["objective","O — Objective","soap-o"],["assessment","A — Assessment","soap-a"],["plan","P — Plan","soap-p"]].map(([key,label,cls])=>soap[key]?(
                <div className="soap-section" key={key}><span className={`soap-section-label ${cls}`}>{label}</span><p className="soap-section-text">{soap[key]}</p></div>
              ):null)}
              {soap.icd10?.length>0&&<div className="soap-section"><span className="soap-section-label soap-icd">ICD-10 Codes</span><div className="code-list">{soap.icd10.map(c=><div key={c.code} className="code-row"><span className="code-badge code-teal">{c.code}</span><span className="code-desc">{c.description}</span></div>)}</div></div>}
              {soap.cpt?.length>0&&<div className="soap-section"><span className="soap-section-label soap-cpt">CPT Codes</span><div className="code-list">{soap.cpt.map(c=><div key={c.code} className="code-row"><span className="code-badge code-blue">{c.code}</span><span className="code-desc">{c.description}{c.units&&<span className="code-units"> · {c.units}u</span>}</span></div>)}</div></div>}
              {soap.medical_necessity&&<div className="soap-section"><span className="soap-section-label soap-mn">Medical Necessity</span><p className="soap-section-text">{soap.medical_necessity}</p></div>}
            </div>
          )}
          {error&&<div className="error-card">⚠️ {error}</div>}
        </div>
      </div>
    </div>
  );
}

// ── ICD VIEW ──────────────────────────────────────────────────────────────────
const ICD_DB = [
  {code:"M54.5",desc:"Low back pain",cat:"Musculoskeletal"},{code:"M54.2",desc:"Cervicalgia",cat:"Musculoskeletal"},
  {code:"M54.42",desc:"Lumbago with sciatica, left",cat:"Musculoskeletal"},{code:"M54.41",desc:"Lumbago with sciatica, right",cat:"Musculoskeletal"},
  {code:"M62.838",desc:"Muscle spasm, other site",cat:"Musculoskeletal"},{code:"M79.3",desc:"Myofascial pain syndrome",cat:"Soft Tissue"},
  {code:"M76.89",desc:"Other enthesopathies, lower extremity",cat:"Musculoskeletal"},{code:"R29.3",desc:"Abnormal posture",cat:"Symptoms"},
  {code:"R51.9",desc:"Headache, unspecified",cat:"Symptoms"},{code:"M47.812",desc:"Spondylosis, cervical region",cat:"Spine"},
  {code:"M50.12",desc:"Cervical disc degeneration",cat:"Spine"},{code:"M25.511",desc:"Pain in right shoulder",cat:"Joint"},
  {code:"M25.512",desc:"Pain in left shoulder",cat:"Joint"},{code:"M75.1",desc:"Rotator cuff syndrome",cat:"Joint"},
  {code:"G54.2",desc:"Cervical root disorders",cat:"Neurological"},{code:"M54.16",desc:"Radiculopathy, lumbar",cat:"Spine"},
];
const CAT_COLORS = {Musculoskeletal:{bg:"rgba(48,217,192,0.12)",color:"#0aab94"},"Soft Tissue":{bg:"rgba(10,132,255,0.12)",color:"#0a84ff"},Symptoms:{bg:"rgba(255,159,10,0.12)",color:"#c47800"},Spine:{bg:"rgba(191,90,242,0.12)",color:"#9f3fd6"},Neurological:{bg:"rgba(255,69,58,0.12)",color:"#c0392b"},Joint:{bg:"rgba(52,199,89,0.12)",color:"#219a3e"}};

function IcdView() {
  const [query, setQuery]       = useState("");
  const [selected, setSelected] = useState([]);
  const [copied, setCopied]     = useState(false);
  const results = query.trim().length > 1 ? ICD_DB.filter(r => r.code.toLowerCase().includes(query.toLowerCase()) || r.desc.toLowerCase().includes(query.toLowerCase())) : [];
  const toggle = (item) => setSelected(prev => prev.find(s=>s.code===item.code) ? prev.filter(s=>s.code!==item.code) : [...prev,item]);
  const handleCopy = () => { navigator.clipboard.writeText(selected.map(s=>`${s.code} — ${s.desc}`).join("\n")); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  return (
    <div className="page">
      <div className="page-header"><div><h1 className="page-title">ICD-10 Coder</h1><p className="page-sub">Search and select diagnostic codes</p></div></div>
      <div className="ai-disclaimer-bar">⚠️ Code suggestions are for reference only — verify with a certified coder before billing.</div>
      <div className="icd-layout">
        <div className="card icd-search-card">
          <div className="card-header"><span className="card-title">Search Codes</span></div>
          <input className="icd-search-input" type="text" placeholder="Search by code or condition... e.g. 'low back', 'M54', 'cervical'" value={query} onChange={e=>setQuery(e.target.value)} autoFocus />
          <div className="icd-results">
            {query.trim().length>1 && results.length===0 && <div className="icd-empty">No codes found for "{query}"</div>}
            {results.map(item => {
              const isSelected = !!selected.find(s=>s.code===item.code);
              const c = CAT_COLORS[item.cat] ?? {bg:"rgba(162,162,166,0.1)",color:"#6e6e73"};
              return (
                <div key={item.code} className={`icd-result-row ${isSelected?"icd-row-selected":""}`} onClick={()=>toggle(item)}>
                  <div className="icd-result-left"><span className="icd-result-code" style={{background:c.bg,color:c.color}}>{item.code}</span><div><div className="icd-result-desc">{item.desc}</div><div className="icd-result-cat">{item.cat}</div></div></div>
                  <div className="icd-check">{isSelected?"✓":"+"}</div>
                </div>
              );
            })}
            {query.trim().length<2&&<div className="icd-hint"><div className="icd-hint-title">Quick searches</div>{["low back","cervical","myofascial","sciatica","shoulder"].map(t=><button key={t} className="icd-quick-btn" onClick={()=>setQuery(t)}>{t}</button>)}</div>}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Selected ({selected.length})</span>{selected.length>0&&<button className="btn-copy" onClick={handleCopy}>{copied?"✓ Copied!":"Copy All"}</button>}</div>
          {selected.length===0
            ? <div className="icd-selected-empty"><div style={{fontSize:32,marginBottom:8}}>⚡</div>Click codes to add them here</div>
            : <div className="icd-selected-list">{selected.map(item=>{const c=CAT_COLORS[item.cat]??{bg:"rgba(162,162,166,0.1)",color:"#6e6e73"};return(<div key={item.code} className="icd-selected-row"><span className="icd-result-code" style={{background:c.bg,color:c.color}}>{item.code}</span><div className="icd-result-desc">{item.desc}</div><button className="icd-remove-btn" onClick={()=>toggle(item)}>×</button></div>);})}</div>
          }
        </div>
      </div>
    </div>
  );
}

// ── ANALYTICS VIEW ────────────────────────────────────────────────────────────
function AnalyticsView() {
  return (
    <div className="page">
      <div className="page-header"><div><h1 className="page-title">Analytics</h1><p className="page-sub">Practice performance · documentation trends</p></div><div className="beta-warning">Beta — Illustrative data</div></div>
      <div className="ai-disclaimer-bar">📊 Analytics shown are illustrative during beta. Connect Supabase data for live metrics.</div>
      <div className="stats-grid">
        {[["Total Sessions","—","#30d9c0"],["SOAP Notes Created","—","#0a84ff"],["Avg Confidence","88.5%","#34c759"],["Time Saved / Note","~18min","#ff9f0a"]].map(([label,val,color])=>(
          <div key={label} className="stat-card"><div className="stat-value" style={{color}}>{val}</div><div className="stat-label">{label}</div></div>
        ))}
      </div>
      <div className="card" style={{padding:32,marginTop:8}}>
        <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>Connect Your Data</div>
        <p style={{fontSize:13,color:"#6e6e73",lineHeight:1.7}}>Live analytics will populate once your Supabase tables are wired up. Your <code>generate-soap</code> edge function can log session data to a <code>sessions</code> table for full tracking.</p>
      </div>
    </div>
  );
}

// ── SETTINGS VIEW ─────────────────────────────────────────────────────────────
function SettingsView({ user, onLogout }) {
  return (
    <div className="page">
      <div className="page-header"><div><h1 className="page-title">Settings</h1><p className="page-sub">Account · legal · disclaimers</p></div></div>
      <div className="card settings-card">
        <div className="settings-section-title">Account</div>
        {[["Email",user?.email],["Access Level","Approved Beta"],["Platform","SomaSync AI · AALIYAH.IO"],["Version","MVP Beta 0.1.0"]].map(([label,val])=>(
          <div key={label} className="settings-row"><div className="settings-label">{label}</div><div className="settings-value">{val}</div></div>
        ))}
      </div>
      <div className="card settings-card" style={{borderLeft:"4px solid #ff9f0a"}}>
        <div className="settings-section-title">⚠️ Beta Testing Notice</div>
        <p className="settings-body-text">SomaSync AI is in closed beta. Features may change without notice. AI outputs must be reviewed by a licensed clinician before use in any clinical, billing, or legal context.</p>
      </div>
      <div className="card settings-card">
        <div className="settings-section-title">AI Disclaimer</div>
        <p className="settings-body-text"><strong>Not Medical Advice:</strong> SomaSync AI does not provide medical advice, diagnosis, or treatment. All AI-generated outputs must be reviewed by a licensed clinician. <strong>Billing:</strong> ICD-10 and CPT code suggestions are not guaranteed accurate for any payer. <strong>Privacy:</strong> Do not enter identifiable patient information without appropriate HIPAA-compliant infrastructure in place. <strong>Liability:</strong> AALIYAH.IO shall not be liable for any damages from reliance on AI-generated outputs.</p>
      </div>
      <div className="card settings-card">
        <div className="settings-section-title">Session</div>
        <button className="btn-signout" onClick={onLogout}>Sign Out of Dashboard</button>
      </div>
    </div>
  );
}
