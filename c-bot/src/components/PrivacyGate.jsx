import React, { useEffect, useState } from "react";

const DISCLOSURE_VERSION = "privacy-ai-beta-2026-08-19";
const STORAGE_KEY = "somasync_privacy_gate_version";

const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "28px",
  padding: "0 10px",
  borderRadius: "999px",
  border: "1px solid rgba(0, 232, 154, 0.24)",
  background: "rgba(0, 232, 154, 0.08)",
  color: "#72f0bd",
  fontSize: "10px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  lineHeight: 1,
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

export default function PrivacyGate({ children }) {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    const acceptedVersion = window.localStorage.getItem(STORAGE_KEY);
    setOpen(acceptedVersion !== DISCLOSURE_VERSION);
    setReady(true);

    const reopenNotice = () => {
      setAcknowledged(false);
      setOpen(true);
    };
    window.addEventListener("somasync:review-privacy", reopenNotice);
    return () => window.removeEventListener("somasync:review-privacy", reopenNotice);
  }, []);

  const acceptNotice = () => {
    if (!acknowledged) return;
    window.localStorage.setItem(STORAGE_KEY, DISCLOSURE_VERSION);
    setOpen(false);
  };

  if (!ready) {
    return (
      <div style={{ minHeight: "100vh", background: "#080808" }} aria-busy="true" />
    );
  }

  return (
    <>
      {children}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-gate-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            overflowY: "auto",
            background: "rgba(3, 6, 7, 0.94)",
            backdropFilter: "blur(18px)",
            fontFamily: "Manrope, Arial, sans-serif",
          }}
        >
          <section
            style={{
              width: "min(680px, 100%)",
              margin: "auto",
              overflow: "hidden",
              border: "1px solid rgba(0, 232, 154, 0.22)",
              borderRadius: "20px",
              background: "linear-gradient(145deg, #121817 0%, #0b0e0e 100%)",
              boxShadow: "0 28px 90px rgba(0, 0, 0, 0.58)",
              color: "#f0ede8",
            }}
          >
            <header style={{ padding: "28px 30px 22px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <div aria-hidden="true" style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#00e89a", boxShadow: "0 0 14px #00e89a" }} />
                <span style={{ color: "#72f0bd", fontSize: "11px", fontWeight: 800, letterSpacing: "0.13em" }}>SOMASYNC BETA · PRIVACY &amp; AI-USE NOTICE</span>
              </div>
              <h1 id="privacy-gate-title" style={{ margin: 0, fontFamily: "Syne, Manrope, sans-serif", fontSize: "clamp(24px, 4vw, 34px)", letterSpacing: "-0.045em", lineHeight: 1.05 }}>
                Before you start: protect client privacy.
              </h1>
              <p style={{ maxWidth: "590px", margin: "13px 0 0", color: "rgba(240,237,232,0.68)", fontSize: "14px", lineHeight: 1.7 }}>
                SomaSync is a beta documentation-assistance tool. It is not configured for protected health information or client-identifying information. Use only de-identified, minimum-necessary information.
              </p>
            </header>

            <div style={{ padding: "24px 30px 28px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
                <span style={badgeStyle}>Beta software</span>
                <span style={badgeStyle}>No PHI in beta</span>
                <span style={badgeStyle}>Human review required</span>
                <span style={badgeStyle}>Audio: notice &amp; consent</span>
              </div>

              <div style={{ padding: "16px 17px", borderRadius: "13px", border: "1px solid rgba(255,159,10,0.32)", background: "rgba(255,159,10,0.08)" }}>
                <div style={{ color: "#ffbf66", fontSize: "11px", fontWeight: 800, letterSpacing: "0.09em", textTransform: "uppercase" }}>Do not type or dictate</div>
                <p style={{ margin: "8px 0 0", color: "rgba(240,237,232,0.83)", fontSize: "13px", lineHeight: 1.65 }}>
                  Client names, initials, dates of birth, contact details, medical-record numbers, insurance information, appointment dates, addresses, exact locations, photographs, or any other information that could identify a client.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginTop: "14px" }}>
                <div style={{ padding: "15px", borderRadius: "13px", border: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.035)" }}>
                  <div style={{ color: "#72f0bd", fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>AI drafts need review</div>
                  <p style={{ margin: "8px 0 0", color: "rgba(240,237,232,0.64)", fontSize: "12px", lineHeight: 1.65 }}>
                    SomaSync does not diagnose, treat, make billing determinations, or replace professional judgment. Review, edit, and approve every output before clinical, billing, coverage, or legal use.
                  </p>
                </div>
                <div style={{ padding: "15px", borderRadius: "13px", border: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.035)" }}>
                  <div style={{ color: "#72f0bd", fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>Audio is your responsibility</div>
                  <p style={{ margin: "8px 0 0", color: "rgba(240,237,232,0.64)", fontSize: "12px", lineHeight: 1.65 }}>
                    If you use audio capture, provide any required notice and obtain any required consent before recording. Do not use SomaSync as a client-record storage system.
                  </p>
                </div>
              </div>

              <label style={{ display: "flex", alignItems: "flex-start", gap: "11px", marginTop: "20px", padding: "14px", borderRadius: "12px", border: `1px solid ${acknowledged ? "rgba(0,232,154,0.35)" : "rgba(255,255,255,0.12)"}`, background: acknowledged ? "rgba(0,232,154,0.07)" : "rgba(255,255,255,0.025)", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(event) => setAcknowledged(event.target.checked)}
                  style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "#00e89a", flexShrink: 0 }}
                />
                <span style={{ color: "rgba(240,237,232,0.8)", fontSize: "12px", lineHeight: 1.65 }}>
                  I understand that I must not enter or dictate client-identifying information, must obtain any required recording consent, and must review every AI-generated output before use.
                </span>
              </label>

              <p style={{ margin: "14px 0 0", color: "rgba(240,237,232,0.43)", fontSize: "11px", lineHeight: 1.6 }}>
                Your practice is responsible for determining whether and how SomaSync may be used under applicable privacy, professional, contractual, and recordkeeping requirements.
              </p>

              <button
                type="button"
                onClick={acceptNotice}
                disabled={!acknowledged}
                style={{
                  width: "100%",
                  minHeight: "48px",
                  marginTop: "19px",
                  border: 0,
                  borderRadius: "12px",
                  background: acknowledged ? "linear-gradient(135deg, #00b978, #00e89a)" : "rgba(255,255,255,0.08)",
                  color: acknowledged ? "#032117" : "rgba(240,237,232,0.34)",
                  fontFamily: "Syne, Manrope, sans-serif",
                  fontSize: "14px",
                  fontWeight: 800,
                  letterSpacing: "0.01em",
                  cursor: acknowledged ? "pointer" : "not-allowed",
                  transition: "transform 160ms ease-out, background 160ms ease-out",
                }}
              >
                I understand — enter SomaSync
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export { DISCLOSURE_VERSION };
