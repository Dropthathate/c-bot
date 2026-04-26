import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// The Landing page renders the full SomaSync marketing site.
// It redirects logged-in users straight to their dashboard.
export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  // Scroll to access section
  const scrollToAccess = () => {
    document.getElementById("access")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", overflowX: "hidden" }}>
      {/* ── BETA BANNER ─────────────────────────────── */}
      <div style={s.betaBanner}>
        ⚠️ BETA / TESTING PHASE —{" "}
        <span style={{ fontWeight: 400, opacity: 0.85 }}>
          SomaSync AI is in pre-release. All outputs are for demonstration only and do not constitute medical advice.
        </span>
      </div>

      {/* ── NAV ─────────────────────────────────────── */}
      <nav style={s.nav}>
        <div style={s.navLogo}>
          <div style={s.navBadge}>🩺</div>
          SomaSync <span style={{ color: "#1fc4ac" }}>AI</span>
        </div>
        <div style={s.navLinks}>
          <a href="#demo"     style={s.navLink}>Demo</a>
          <a href="#features" style={s.navLink}>Features</a>
          <a href="#access"   style={s.navLink}>Access</a>
          <button style={s.btnOutline} onClick={() => navigate("/login")}>Dashboard Login</button>
          <button style={s.btnDark}    onClick={scrollToAccess}>Join Waitlist</button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={s.hero}>
        <div style={s.heroMesh} />
        <div style={s.heroInner}>
          <div style={s.eyebrow}>
            <div style={s.eyebrowDot} />
            Introducing SomaSync AI · AALIYAH.IO
          </div>
          <h1 style={s.h1}>
            Intelligence<br />
            That <span style={s.grad}>Listens</span>
          </h1>
          <p style={s.heroSub}>
            From rough clinical observations to ICD-10-aligned SOAP notes — automatically, in seconds.
          </p>
          <div style={s.heroActions}>
            <a href="#demo" style={s.btnHero}>See Live Demo →</a>
            <button style={s.btnGhost} onClick={scrollToAccess}>Request Dashboard Access ›</button>
          </div>
          <div style={s.heroStats}>
            {[
              { val: "88%",   lbl: "Avg confidence score" },
              { val: "3×",    lbl: "Faster documentation" },
              { val: "ICD-10",lbl: "Diagnostic alignment" },
              { val: "β",     lbl: "Currently in beta" },
            ].map((st, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={s.statVal}>{st.val}</div>
                <div style={s.statLbl}>{st.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLOW ─────────────────────────────────────── */}
      <section style={{ ...s.section, background: "#f5f5f7" }} id="features">
        <div style={s.sectionHeader}>
          <div style={s.tag}>How It Works</div>
          <h2 style={s.h2}>Seamless Clinical Flow</h2>
          <p style={s.sectionSub}>Four intelligent steps from rough notes to reimbursement-ready documentation.</p>
        </div>
        <div style={s.flowGrid}>
          {[
            { icon: "🎙", title: "Listen",    body: "Captures practitioner observations and rough spoken notes in real time." },
            { icon: "⚡", title: "Analyze",   body: "Interprets posture, movement, and symptom patterns with clinical logic." },
            { icon: "🔄", title: "Translate", body: "Converts messy findings into structured clinical and billable language." },
            { icon: "📄", title: "Document",  body: "Outputs complete SOAP notes aligned with ICD-10 frameworks, EHR-ready." },
          ].map((f, i) => (
            <div key={i} style={s.flowCard}>
              <div style={s.flowIcon}>{f.icon}</div>
              <div style={{ fontSize: 11, color: "#a1a1a6", fontWeight: 600, marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Step 0{i + 1}</div>
              <div style={s.flowTitle}>{f.title}</div>
              <div style={s.flowBody}>{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEMO ─────────────────────────────────────── */}
      <section style={s.section} id="demo">
        <div style={s.sectionHeader}>
          <div style={s.tag}>Interactive Demo</div>
          <h2 style={s.h2}>See the Transformation</h2>
          <p style={s.sectionSub}>Rough clinical language becomes structured, reimbursable documentation.</p>
        </div>
        <div style={s.demoGrid}>
          <div style={s.demoInput}>
            <div style={s.cardHeader}>
              <ChromeDots /><span style={s.chromeLabel}>Rough Input</span>
            </div>
            <div style={{ padding: "20px 24px" }}>
              {[
                "Client has low back tightness, worse in the morning",
                "Palpable hypertonicity throughout lumbar paraspinals",
                "Pain increases with forward flexion, mild relief with extension",
                "Reports radiating discomfort into left glute",
              ].map((line, i) => (
                <div key={i} style={s.rawLine}>
                  <span style={{ color: "#a1a1a6", fontSize: 16 }}>"</span>
                  {line}
                  <span style={{ color: "#a1a1a6", fontSize: 16 }}>"</span>
                </div>
              ))}
            </div>
          </div>
          <div style={s.demoOutput}>
            <div style={s.cardHeaderDark}>
              <ChromeDots /><span style={{ marginLeft: "auto", fontSize: 11, color: "#3a3f4a", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>⚡ ICD-10 Output</span>
            </div>
            <div style={{ padding: "16px 20px" }}>
              {[
                { code: "M54.5",   name: "Low back pain",          bg: "rgba(48,217,192,0.15)", color: "#30d9c0" },
                { code: "M62.838", name: "Muscle spasm, lumbar",    bg: "rgba(10,132,255,0.15)", color: "#6ab5ff" },
                { code: "R29.3",   name: "Abnormal posture",        bg: "rgba(255,159,10,0.15)", color: "#ffb340" },
                { code: "M54.42",  name: "Lumbago w/ sciatica, L", bg: "rgba(191,90,242,0.15)", color: "#bf5af2" },
              ].map((row) => (
                <div key={row.code} style={s.icdRow}>
                  <span style={{ ...s.badge, background: row.bg, color: row.color }}>{row.code}</span>
                  <span style={{ fontSize: 14, color: "#c8cfd8" }}>{row.name}</span>
                </div>
              ))}
              <div style={s.confRow}>
                <span style={s.confKey}>Confidence</span>
                <div style={s.confTrack}><div style={{ ...s.confFill, width: "88.5%", background: "linear-gradient(90deg,#0aab94,#30d9c0)" }} /></div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#30d9c0" }}>88.5%</span>
              </div>
            </div>
          </div>
        </div>
        <p style={s.demoDisclaimer}>Illustrative example only. Final diagnosis remains clinician decision.</p>
      </section>

      {/* ── ACCESS GATE ──────────────────────────────── */}
      <section style={{ ...s.section, background: "#f5f5f7" }} id="access">
        <div style={s.sectionHeader}>
          <div style={s.tag}>AALIYAH.IO Dashboard</div>
          <h2 style={s.h2}>Request Access to the Full Platform</h2>
          <p style={s.sectionSub}>Closed beta — SOAP generator, ICD-10 coder, and analytics. Access granted by review within 48h.</p>
        </div>
        <div style={s.accessCard}>
          <div style={s.accessForm}>
            <h3 style={s.accessTitle}>Request Dashboard Access</h3>
            <p style={{ fontSize: 13, color: "#a1a1a6", marginBottom: 24 }}>AALIYAH.IO · SomaSync MVP Beta</p>
            {[
              { label: "FULL NAME",             type: "text",  placeholder: "Your full name" },
              { label: "EMAIL ADDRESS",          type: "email", placeholder: "you@practice.com" },
              { label: "PROFESSION / SPECIALTY", type: "text",  placeholder: "e.g. NMT, LMT, Sports Therapist" },
            ].map((f) => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <label style={s.fieldLabel}>{f.label}</label>
                <input style={s.fieldInput} type={f.type} placeholder={f.placeholder} />
              </div>
            ))}
            <div style={s.accessNotice}>
              ⚠️ Beta Testing — AI outputs require clinician review before clinical use. This is not a live clinical product.
            </div>
            <button style={s.btnAccess} onClick={(e) => {
              e.target.textContent = "✓ Request Submitted — We'll be in touch within 48 hours";
              e.target.style.background = "#34c759";
              e.target.disabled = true;
            }}>
              Request Access →
            </button>
            <p style={s.formDisclaimer}>
              By submitting you acknowledge SomaSync AI is a beta product. AI outputs are not a substitute for professional clinical judgment.
            </p>
          </div>
        </div>
      </section>

      {/* ── LEGAL ─────────────────────────────────────── */}
      <section style={{ padding: "64px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 20 }}>Legal & AI Disclaimers</h3>
          <div style={{ fontSize: 12, color: "#6e6e73", lineHeight: 1.85, background: "#f5f5f7", borderRadius: 14, padding: "24px 28px" }}>
            <strong>AI-Generated Content:</strong> All documentation produced by SomaSync AI is generated by artificial intelligence and may contain errors. All outputs must be reviewed by a licensed clinician before clinical use.{" "}
            <strong>Not Medical Advice:</strong> SomaSync AI does not provide medical advice, diagnosis, or treatment.{" "}
            <strong>Beta Notice:</strong> This product is in beta testing and is not approved for regulated clinical use.{" "}
            <strong>Billing & Coding:</strong> Code suggestions are not guaranteed accurate for any specific payer. Practitioners are solely responsible for compliance.{" "}
            <strong>Limitation of Liability:</strong> AALIYAH.IO shall not be liable for any damages arising from reliance on AI-generated outputs. © 2026 AALIYAH.IO. All rights reserved.
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer style={s.footer}>
        <div style={s.footerLeft}>
          <span style={{ fontWeight: 700, color: "#1d1d1f" }}>SomaSync AI</span>
          <span style={{ color: "#e8e8ed" }}>·</span>
          <span>© 2026 AALIYAH.IO. All rights reserved.</span>
        </div>
        <div style={s.footerLinks}>
          {["Privacy Policy","Terms of Use","AI Disclaimer","Request Access","Contact"].map((l) => (
            <a key={l} href={l === "Request Access" ? "#access" : "#"} style={s.footerLink}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}

// Small helper component
function ChromeDots() {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
      <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e" }} />
      <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840" }} />
    </div>
  );
}

// ── STYLES ───────────────────────────────────────────────────────────────
const s = {
  betaBanner: { background: "linear-gradient(90deg,#ff9f0a,#ff6b35)", padding: "10px 24px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "#fff" },
  nav: { position: "sticky", top: 0, zIndex: 100, height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", background: "rgba(255,255,255,0.88)", backdropFilter: "blur(10px)" },
  navLogo: { fontSize: 16, fontWeight: 700, letterSpacing: "-0.04em", display: "flex", alignItems: "center", gap: 8 },
  navBadge: { width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#0aab94,#0a84ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 },
  navLinks: { display: "flex", alignItems: "center", gap: 24 },
  navLink: { fontSize: 13, color: "#6e6e73", textDecoration: "none" },
  btnOutline: { background: "transparent", border: "1px solid rgba(0,0,0,0.12)", color: "#424245", padding: "7px 16px", borderRadius: 980, fontSize: 13, fontWeight: 500, fontFamily: "inherit", cursor: "pointer" },
  btnDark: { background: "#1d1d1f", color: "#fff", border: "none", padding: "8px 18px", borderRadius: 980, fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" },
  hero: { padding: "96px 24px 80px", textAlign: "center", position: "relative", minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center" },
  heroMesh: { position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% -5%,rgba(48,217,192,0.14) 0%,transparent 65%),radial-gradient(ellipse 50% 50% at 85% 50%,rgba(10,132,255,0.1) 0%,transparent 60%)" },
  heroInner: { position: "relative", zIndex: 1, maxWidth: 820 },
  eyebrow: { display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.9)", border: "1px solid rgba(48,217,192,0.3)", borderRadius: 980, padding: "6px 16px", fontSize: 13, fontWeight: 600, color: "#1d1d1f", marginBottom: 32 },
  eyebrowDot: { width: 7, height: 7, borderRadius: "50%", background: "#1fc4ac" },
  h1: { fontSize: "clamp(52px,9vw,88px)", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.95, color: "#1d1d1f", marginBottom: 24 },
  grad: { background: "linear-gradient(125deg,#1fc4ac 0%,#0a84ff 50%,#bf5af2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" },
  heroSub: { fontSize: 20, fontWeight: 300, color: "#6e6e73", lineHeight: 1.55, letterSpacing: "-0.02em", maxWidth: 560, margin: "0 auto 48px" },
  heroActions: { display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" },
  btnHero: { background: "#1d1d1f", color: "#fff", textDecoration: "none", padding: "16px 32px", borderRadius: 980, fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em", display: "inline-flex", alignItems: "center", transition: "background 0.2s" },
  btnGhost: { background: "transparent", color: "#0a84ff", border: "none", cursor: "pointer", padding: "16px 8px", fontSize: 16, fontWeight: 500, fontFamily: "inherit" },
  heroStats: { display: "flex", gap: 40, justifyContent: "center", marginTop: 56, flexWrap: "wrap" },
  statVal: { fontSize: 30, fontWeight: 800, letterSpacing: "-0.04em", background: "linear-gradient(135deg,#1fc4ac,#0a84ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" },
  statLbl: { fontSize: 12, color: "#a1a1a6", marginTop: 2 },
  section: { padding: "96px 32px" },
  sectionHeader: { textAlign: "center", maxWidth: 640, margin: "0 auto 64px" },
  tag: { display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0aab94", background: "rgba(48,217,192,0.1)", padding: "5px 12px", borderRadius: 8 },
  h2: { fontSize: "clamp(34px,5vw,52px)", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.0, color: "#1d1d1f", marginBottom: 18 },
  sectionSub: { fontSize: 18, fontWeight: 300, color: "#6e6e73", lineHeight: 1.6 },
  flowGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, maxWidth: 1040, margin: "0 auto" },
  flowCard: { background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 20, padding: "32px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
  flowIcon: { fontSize: 28, marginBottom: 12 },
  flowTitle: { fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8, color: "#1d1d1f" },
  flowBody: { fontSize: 13, color: "#6e6e73", lineHeight: 1.6, fontWeight: 300 },
  demoGrid: { display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 20, maxWidth: 900, margin: "0 auto" },
  demoInput: { background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
  demoOutput: { background: "#0f1318", borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.28)" },
  cardHeader: { display: "flex", alignItems: "center", gap: 8, padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,0.07)", background: "#f5f5f7" },
  cardHeaderDark: { display: "flex", alignItems: "center", gap: 8, padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  chromeLabel: { marginLeft: "auto", fontSize: 11, fontWeight: 600, color: "#a1a1a6", letterSpacing: "0.05em", textTransform: "uppercase" },
  rawLine: { display: "flex", gap: 8, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #f5f5f7", fontSize: 14, color: "#424245", lineHeight: 1.55 },
  icdRow: { display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  badge: { fontSize: 11, fontWeight: 800, fontFamily: "monospace", padding: "4px 9px", borderRadius: 7, minWidth: 50, textAlign: "center" },
  confRow: { display: "flex", alignItems: "center", gap: 12, marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" },
  confKey: { fontSize: 11, color: "rgba(255,255,255,0.25)", fontWeight: 600, letterSpacing: "0.04em", minWidth: 76 },
  confTrack: { flex: 1, height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" },
  confFill: { height: "100%", borderRadius: 3 },
  demoDisclaimer: { textAlign: "center", fontSize: 11, color: "#a1a1a6", marginTop: 16, fontStyle: "italic" },
  accessCard: { maxWidth: 520, margin: "0 auto", background: "#fff", borderRadius: 20, padding: 40, boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "1px solid rgba(0,0,0,0.07)" },
  accessForm: {},
  accessTitle: { fontSize: 22, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 6 },
  fieldLabel: { display: "block", fontSize: 12, fontWeight: 600, color: "#6e6e73", marginBottom: 6, letterSpacing: "0.02em" },
  fieldInput: { width: "100%", background: "#f5f5f7", border: "1px solid #e8e8ed", borderRadius: 10, padding: "12px 14px", fontSize: 14, fontFamily: "inherit", color: "#1d1d1f", outline: "none" },
  accessNotice: { fontSize: 12, color: "#c47800", background: "rgba(255,159,10,0.08)", border: "1px solid rgba(255,159,10,0.2)", borderRadius: 10, padding: "12px 14px", marginBottom: 16, lineHeight: 1.5 },
  btnAccess: { width: "100%", background: "#1d1d1f", color: "#fff", border: "none", padding: 14, borderRadius: 12, fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", marginTop: 16 },
  formDisclaimer: { fontSize: 11, color: "#a1a1a6", lineHeight: 1.6, marginTop: 14, textAlign: "center" },
  footer: { padding: "24px 40px", borderTop: "1px solid rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 },
  footerLeft: { fontSize: 12, color: "#a1a1a6", display: "flex", alignItems: "center", gap: 8 },
  footerLinks: { display: "flex", gap: 20, flexWrap: "wrap" },
  footerLink: { fontSize: 12, color: "#a1a1a6", textDecoration: "none" },
};
