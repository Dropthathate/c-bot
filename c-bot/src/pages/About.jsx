import React from 'react'

export default function About() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#080808',
      color: '#f0ede8',
      fontFamily: 'Manrope, Arial, sans-serif',
      padding: '32px clamp(24px, 7vw, 112px) 72px',
      lineHeight: 1.7,
    }}>
      <a
        href="/"
        style={{
          color: '#f0ede8',
          textDecoration: 'none',
          fontFamily: 'Syne, Arial, sans-serif',
          fontWeight: 800,
          letterSpacing: '-0.02em',
        }}
      >
        SomaSyncAI
      </a>

      <section style={{ maxWidth: 820, margin: 'clamp(64px, 12vw, 150px) auto 0' }}>
        <p style={{ color: '#3b9eff', fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          About SomaSyncAI
        </p>
        <h1 style={{ fontFamily: 'Syne, Arial, sans-serif', fontSize: 'clamp(2.8rem, 7vw, 5.6rem)', lineHeight: 0.95, letterSpacing: '-0.055em', margin: '20px 0 28px' }}>
          Documentation support designed for hands-on care.
        </h1>
        <p style={{ color: 'rgba(240,237,232,0.72)', fontSize: 'clamp(1.05rem, 2vw, 1.3rem)', maxWidth: 700 }}>
          SomaSyncAI is building a voice-first clinical documentation workspace for manual therapy practitioners. The product is designed to reduce administrative burden while preserving practitioner review and clinical judgment.
        </p>

        <div style={{ display: 'grid', gap: 20, marginTop: 56 }}>
          <article style={cardStyle}>
            <h2 style={headingStyle}>Built around the treatment room</h2>
            <p style={bodyStyle}>Manual therapists work with their hands and attention focused on clients, not keyboards. SomaSyncAI is designed to capture the session naturally and organize information into a structured documentation workflow.</p>
          </article>
          <article style={cardStyle}>
            <h2 style={headingStyle}>Practitioner review remains essential</h2>
            <p style={bodyStyle}>AI-generated drafts are intended to support documentation, not replace professional judgment. Practitioners review, edit, and confirm every note before it becomes part of the record.</p>
          </article>
          <article style={cardStyle}>
            <h2 style={headingStyle}>Privacy-conscious by design</h2>
            <p style={bodyStyle}>The platform emphasizes safeguards around client information and transparent guidance for responsible use. Read our <a href="/privacy-policy.html" style={linkStyle}>Privacy Policy</a> and <a href="/terms-and-conditions.html" style={linkStyle}>Terms & Conditions</a> for details.</p>
          </article>
        </div>

        <p style={{ color: 'rgba(240,237,232,0.55)', marginTop: 48 }}>
          Interested in early access? <a href="/#cta" style={linkStyle}>Join the beta</a>.
        </p>
      </section>
    </main>
  )
}

const cardStyle = {
  background: 'rgba(255,255,255,0.035)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 16,
  padding: '28px clamp(22px, 4vw, 40px)',
}

const headingStyle = {
  fontFamily: 'Syne, Arial, sans-serif',
  fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
  letterSpacing: '-0.03em',
  margin: 0,
}

const bodyStyle = {
  color: 'rgba(240,237,232,0.65)',
  marginBottom: 0,
}

const linkStyle = {
  color: '#67b4ff',
  textDecoration: 'underline',
  textUnderlineOffset: 3,
}
