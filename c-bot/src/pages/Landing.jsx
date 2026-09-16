import { useEffect, useRef } from 'react'
import { isSupabaseConfigured, supabase } from '../integrations/supabase/client'

export default function Landing() {
  const ref = useRef(null)

  useEffect(() => {
    document.title = 'SomaSyncAI — Clinical Documentation Built by a Practitioner'

    if (!document.getElementById('soma-fonts')) {
      const link = document.createElement('link')
      link.id = 'soma-fonts'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap'
      document.head.appendChild(link)
    }

    if (!document.getElementById('soma-styles')) {
      const style = document.createElement('style')
      style.id = 'soma-styles'
      style.textContent = CSS
      document.head.appendChild(style)
    }

    let script
    if (ref.current) {
      ref.current.innerHTML = HTML
      script = document.createElement('script')
      script.textContent = JS
      document.body.appendChild(script)
    }

    return () => {
      script?.remove()
      document.getElementById('soma-styles')?.remove()
    }
  }, [])

  return <div id="soma-root" ref={ref} />
}

const CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }

#soma-root {
  --bg:        #050d14;
  --panel:     #0a1825;
  --panel2:    #0e2030;
  --teal:      #00c9a7;
  --teal-dim:  #007a68;
  --blue:      #3d8bff;
  --ink:       #eef4f7;
  --muted:     #6a8a99;
  --line:      rgba(0,201,167,.12);
  --red:       #ff6b6b;
  --radius:    10px;
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  font-size: 16px;
  color: var(--ink);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

#soma-root a { color: inherit; text-decoration: none; }
#soma-root img { display: block; max-width: 100%; }
#soma-root button { cursor: pointer; font-family: inherit; }

/* NAV */
#soma-root nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 6vw;
  transition: background .3s, border-color .3s;
  border-bottom: 1px solid transparent;
}
#soma-root nav.stuck {
  background: rgba(5,13,20,.92);
  backdrop-filter: blur(12px);
  border-color: var(--line);
}
#soma-root .nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Syne', sans-serif;
  font-size: .95rem;
  font-weight: 700;
  letter-spacing: -.01em;
}
#soma-root .nav-brand img { height: 28px; }
#soma-root .nav-links {
  display: flex;
  gap: 32px;
  font-size: .82rem;
  color: var(--muted);
}
#soma-root .nav-links a:hover { color: var(--ink); }
#soma-root .nav-cta {
  background: var(--teal);
  color: #050d14;
  font-size: .8rem;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: var(--radius);
  border: none;
  transition: opacity .2s;
}
#soma-root .nav-cta:hover { opacity: .85; }

/* HERO */
#soma-root .hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 140px 6vw 100px;
  position: relative;
  overflow: hidden;
}
#soma-root .hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 80% 40%, rgba(0,201,167,.07), transparent),
    radial-gradient(ellipse 40% 60% at 10% 70%, rgba(61,139,255,.06), transparent);
  pointer-events: none;
}
#soma-root .hero-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: .72rem;
  font-weight: 600;
  color: var(--teal);
  letter-spacing: .06em;
  margin-bottom: 28px;
}
#soma-root .hero-label i {
  width: 6px; height: 6px;
  background: var(--teal);
  border-radius: 50%;
  animation: blink 1.8s ease-in-out infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

#soma-root .hero-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(3.2rem, 7vw, 7.5rem);
  font-weight: 800;
  line-height: .9;
  letter-spacing: -.04em;
  max-width: 900px;
  margin-bottom: 32px;
}
#soma-root .hero-title .teal { color: var(--teal); }
#soma-root .hero-title .ghost {
  color: transparent;
  -webkit-text-stroke: 1px rgba(238,244,247,.25);
}

#soma-root .hero-sub {
  max-width: 560px;
  font-size: clamp(1rem, 1.6vw, 1.15rem);
  line-height: 1.75;
  color: var(--muted);
  margin-bottom: 44px;
}
#soma-root .hero-sub strong { color: var(--ink); font-weight: 500; }

#soma-root .hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  margin-bottom: 72px;
}
#soma-root .btn-primary {
  background: var(--teal);
  color: #050d14;
  font-weight: 700;
  font-size: .9rem;
  padding: 14px 28px;
  border-radius: var(--radius);
  border: none;
  transition: opacity .2s;
  text-decoration: none;
  display: inline-block;
}
#soma-root .btn-primary:hover { opacity: .88; }
#soma-root .btn-ghost {
  color: var(--muted);
  font-size: .85rem;
  border: 1px solid rgba(106,138,153,.3);
  padding: 13px 24px;
  border-radius: var(--radius);
  transition: border-color .2s, color .2s;
  display: inline-block;
}
#soma-root .btn-ghost:hover { border-color: var(--muted); color: var(--ink); }

/* WAVEFORM PREVIEW */
#soma-root .hero-visual {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 20px 24px;
  max-width: 680px;
}
#soma-root .visual-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
#soma-root .visual-label {
  font-size: .65rem;
  font-weight: 600;
  color: var(--teal);
  letter-spacing: .08em;
}
#soma-root .live-dot {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: .65rem;
  color: var(--teal);
}
#soma-root .live-dot i {
  width: 5px; height: 5px;
  background: var(--teal);
  border-radius: 50%;
  animation: blink 1.4s ease-in-out infinite;
}
#soma-root .waveform {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 48px;
  margin-bottom: 16px;
}
#soma-root .waveform span {
  flex: 1;
  background: var(--teal);
  border-radius: 2px;
  opacity: .7;
  animation: wave var(--d, .8s) ease-in-out infinite alternate;
}
@keyframes wave { from{height:4px} to{height:var(--h,32px)} }

#soma-root .soap-preview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
#soma-root .soap-field {
  background: var(--panel2);
  border-radius: 6px;
  padding: 10px 12px;
}
#soma-root .soap-field span {
  display: block;
  font-size: .58rem;
  font-weight: 600;
  color: var(--teal);
  letter-spacing: .06em;
  margin-bottom: 4px;
}
#soma-root .soap-field p {
  font-size: .72rem;
  color: var(--muted);
  line-height: 1.5;
}

/* STRIP */
#soma-root .strip {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 14px 0;
  overflow: hidden;
  white-space: nowrap;
}
#soma-root .strip-inner {
  display: inline-flex;
  gap: 48px;
  animation: scroll 28s linear infinite;
}
#soma-root .strip-inner span {
  font-size: .7rem;
  font-weight: 600;
  color: var(--muted);
  letter-spacing: .08em;
  flex-shrink: 0;
}
#soma-root .strip-inner span.hi { color: var(--teal); }
@keyframes scroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }

/* SECTIONS */
#soma-root section {
  padding: 110px 6vw;
}
#soma-root .section-label {
  font-size: .7rem;
  font-weight: 600;
  color: var(--teal);
  letter-spacing: .06em;
  margin-bottom: 20px;
}
#soma-root h2.section-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(2.4rem, 5vw, 4.8rem);
  font-weight: 800;
  line-height: .92;
  letter-spacing: -.035em;
  max-width: 760px;
  margin-bottom: 24px;
}
#soma-root .section-body {
  max-width: 580px;
  font-size: 1rem;
  line-height: 1.8;
  color: var(--muted);
  margin-bottom: 56px;
}
#soma-root .section-body strong { color: var(--ink); font-weight: 500; }

/* PRACTITIONER SECTION */
#soma-root .practitioner {
  background: var(--panel);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
#soma-root .practitioner-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(40px, 6vw, 100px);
  align-items: center;
}
#soma-root .practitioner-quote {
  font-family: 'Syne', sans-serif;
  font-size: clamp(1.6rem, 3vw, 2.8rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -.02em;
  color: var(--ink);
  margin-bottom: 28px;
}
#soma-root .practitioner-quote .teal { color: var(--teal); }
#soma-root .practitioner-body {
  font-size: .95rem;
  line-height: 1.8;
  color: var(--muted);
  margin-bottom: 20px;
}
#soma-root .practitioner-body strong { color: var(--ink); font-weight: 500; }
#soma-root .credential {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--panel2);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 12px 18px;
  font-size: .78rem;
  color: var(--muted);
}
#soma-root .credential strong { color: var(--teal); font-weight: 600; }

#soma-root .practitioner-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  background: var(--line);
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
}
#soma-root .p-stat {
  background: var(--panel2);
  padding: 32px 28px;
}
#soma-root .p-stat strong {
  display: block;
  font-family: 'Syne', sans-serif;
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--teal);
  line-height: 1;
  margin-bottom: 8px;
}
#soma-root .p-stat span {
  font-size: .8rem;
  color: var(--muted);
  line-height: 1.5;
}

/* HOW IT WORKS */
#soma-root .how-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2px;
  background: var(--line);
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
  margin-top: 56px;
}
#soma-root .how-step {
  background: var(--panel);
  padding: 32px 24px;
  position: relative;
}
#soma-root .how-step:not(:last-child)::after {
  content: '→';
  position: absolute;
  right: -14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--teal-dim);
  font-size: .9rem;
  z-index: 2;
}
#soma-root .how-num {
  font-family: 'Syne', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: var(--panel2);
  margin-bottom: 20px;
  -webkit-text-stroke: 1px var(--teal-dim);
}
#soma-root .how-step h3 {
  font-family: 'Syne', sans-serif;
  font-size: .9rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--ink);
}
#soma-root .how-step p {
  font-size: .78rem;
  line-height: 1.65;
  color: var(--muted);
}

/* FEATURES */
#soma-root .features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  background: var(--line);
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
  margin-top: 56px;
}
#soma-root .feat {
  background: var(--panel);
  padding: 36px 30px;
  transition: background .2s;
}
#soma-root .feat:hover { background: var(--panel2); }
#soma-root .feat-icon {
  font-size: 1.4rem;
  margin-bottom: 20px;
}
#soma-root .feat h3 {
  font-family: 'Syne', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--ink);
}
#soma-root .feat p {
  font-size: .82rem;
  line-height: 1.7;
  color: var(--muted);
}
#soma-root .feat-tag {
  display: inline-block;
  margin-top: 16px;
  font-size: .62rem;
  font-weight: 600;
  color: var(--teal);
  letter-spacing: .06em;
  background: rgba(0,201,167,.08);
  padding: 4px 8px;
  border-radius: 4px;
}

/* COMPARISON */
#soma-root .compare-section { background: var(--panel); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
#soma-root .compare-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 48px;
  font-size: .85rem;
}
#soma-root .compare-table th {
  text-align: left;
  padding: 14px 20px;
  font-size: .72rem;
  font-weight: 600;
  color: var(--muted);
  letter-spacing: .04em;
  border-bottom: 1px solid var(--line);
}
#soma-root .compare-table th.soma-col {
  color: var(--teal);
}
#soma-root .compare-table td {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0,201,167,.06);
  color: var(--muted);
  font-size: .83rem;
}
#soma-root .compare-table td:first-child {
  color: var(--ink);
  font-weight: 500;
}
#soma-root .compare-table tr:last-child td { border-bottom: none; }
#soma-root .yes { color: var(--teal); font-weight: 700; font-size: 1rem; }
#soma-root .no { color: #3a4f5c; font-size: 1rem; }
#soma-root .soma-col { background: rgba(0,201,167,.04); }

/* PRICING */
#soma-root .pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  background: var(--line);
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
  margin-top: 56px;
}
#soma-root .price-card {
  background: var(--panel);
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
}
#soma-root .price-card.featured {
  background: var(--panel2);
  border: 1px solid rgba(0,201,167,.3);
  margin: -1px;
  z-index: 1;
}
#soma-root .price-tier {
  font-size: .72rem;
  font-weight: 600;
  color: var(--muted);
  letter-spacing: .06em;
  margin-bottom: 20px;
}
#soma-root .price-tier.featured-label { color: var(--teal); }
#soma-root .price-amount {
  font-family: 'Syne', sans-serif;
  font-size: 3.2rem;
  font-weight: 800;
  color: var(--ink);
  line-height: 1;
  margin-bottom: 6px;
}
#soma-root .price-amount sup {
  font-size: 1.4rem;
  vertical-align: top;
  margin-top: 8px;
}
#soma-root .price-amount sub {
  font-size: .9rem;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  color: var(--muted);
}
#soma-root .price-desc {
  font-size: .8rem;
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: 28px;
  flex: 1;
}
#soma-root .price-features {
  list-style: none;
  margin-bottom: 32px;
}
#soma-root .price-features li {
  font-size: .8rem;
  color: var(--muted);
  padding: 7px 0;
  border-bottom: 1px solid rgba(0,201,167,.06);
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
#soma-root .price-features li::before {
  content: '✓';
  color: var(--teal);
  font-weight: 700;
  flex-shrink: 0;
}
#soma-root .price-cta {
  display: block;
  text-align: center;
  padding: 13px;
  border-radius: var(--radius);
  font-size: .85rem;
  font-weight: 600;
  border: 1px solid var(--line);
  color: var(--muted);
  transition: all .2s;
}
#soma-root .price-cta:hover { border-color: var(--teal); color: var(--teal); }
#soma-root .price-cta.featured-cta {
  background: var(--teal);
  color: #050d14;
  border-color: var(--teal);
}
#soma-root .price-cta.featured-cta:hover { opacity: .88; }
#soma-root .price-note {
  font-size: .72rem;
  color: var(--muted);
  text-align: center;
  margin-top: 24px;
  line-height: 1.6;
}

/* ROADMAP */
#soma-root .roadmap-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;
  background: var(--line);
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
  margin-top: 56px;
}
#soma-root .road-card {
  background: var(--panel);
  padding: 32px 26px;
}
#soma-root .road-phase {
  font-size: .65rem;
  font-weight: 600;
  color: var(--muted);
  letter-spacing: .06em;
  margin-bottom: 16px;
}
#soma-root .road-card.live .road-phase { color: var(--teal); }
#soma-root .road-card h3 {
  font-family: 'Syne', sans-serif;
  font-size: .95rem;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 16px;
}
#soma-root .road-card ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
#soma-root .road-card li {
  font-size: .78rem;
  color: var(--muted);
  padding-left: 14px;
  position: relative;
  line-height: 1.5;
}
#soma-root .road-card li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 7px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--teal-dim);
}
#soma-root .road-card.live li::before { background: var(--teal); }

/* CTA */
#soma-root .cta-section {
  text-align: center;
  padding: 140px 6vw;
  position: relative;
  overflow: hidden;
}
#soma-root .cta-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,201,167,.07), transparent);
  pointer-events: none;
}
#soma-root .cta-section h2 {
  font-family: 'Syne', sans-serif;
  font-size: clamp(2.8rem, 6vw, 6rem);
  font-weight: 800;
  line-height: .88;
  letter-spacing: -.04em;
  max-width: 800px;
  margin: 0 auto 28px;
}
#soma-root .cta-section h2 .teal { color: var(--teal); }
#soma-root .cta-section h2 .ghost {
  color: transparent;
  -webkit-text-stroke: 1px rgba(238,244,247,.2);
}
#soma-root .cta-section p {
  max-width: 480px;
  margin: 0 auto 40px;
  font-size: 1rem;
  line-height: 1.75;
  color: var(--muted);
}
#soma-root .cta-legal {
  font-size: .72rem;
  color: var(--muted);
  margin-top: 20px;
  line-height: 1.7;
}
#soma-root .cta-legal a { color: var(--teal-dim); }

/* FOOTER */
#soma-root footer {
  border-top: 1px solid var(--line);
  padding: 56px 6vw 40px;
}
#soma-root .footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
}
#soma-root .footer-brand p {
  font-size: .82rem;
  color: var(--muted);
  line-height: 1.7;
  margin-top: 14px;
  max-width: 280px;
}
#soma-root .footer-col h4 {
  font-size: .72rem;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: .04em;
  margin-bottom: 16px;
}
#soma-root .footer-col a {
  display: block;
  font-size: .8rem;
  color: var(--muted);
  margin-bottom: 10px;
  transition: color .15s;
}
#soma-root .footer-col a:hover { color: var(--ink); }
#soma-root .footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid var(--line);
  font-size: .74rem;
  color: var(--muted);
}

/* RESPONSIVE */
@media (max-width: 1100px) {
  #soma-root .how-grid { grid-template-columns: 1fr 1fr; }
  #soma-root .features-grid { grid-template-columns: 1fr 1fr; }
  #soma-root .pricing-grid { grid-template-columns: 1fr; }
  #soma-root .roadmap-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 860px) {
  #soma-root .practitioner-grid { grid-template-columns: 1fr; }
  #soma-root .footer-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  #soma-root nav { padding: 16px 5vw; }
  #soma-root .nav-links { display: none; }
  #soma-root section { padding: 80px 5vw; }
  #soma-root .hero { padding: 120px 5vw 80px; }
  #soma-root .features-grid,
  #soma-root .how-grid,
  #soma-root .roadmap-grid { grid-template-columns: 1fr; }
  #soma-root .practitioner-stats { grid-template-columns: 1fr 1fr; }
  #soma-root .footer-grid { grid-template-columns: 1fr; }
  #soma-root .how-step::after { display: none; }
  #soma-root .compare-table { font-size: .75rem; }
  #soma-root .compare-table th,
  #soma-root .compare-table td { padding: 12px 10px; }
}
`

const HTML = `
<nav id="soma-nav">
  <a class="nav-brand" href="#top">
    <img src="/ss.png" alt="SomaSyncAI" />
    SomaSyncAI
  </a>
  <div class="nav-links">
    <a href="#how">How it works</a>
    <a href="#features">Features</a>
    <a href="#compare">vs. others</a>
    <a href="#pricing">Pricing</a>
    <a href="#roadmap">Roadmap</a>
  </div>
  <a class="nav-cta" href="/login?next=%2Fclinical-workspace%2F">Try free</a>
</nav>

<section class="hero" id="top">
  <div class="hero-bg"></div>
  <div class="hero-label"><i></i>Now in beta — open to practitioners</div>
  <h1 class="hero-title">
    Your hands<br>
    belong on<br>
    <span class="teal">the client.</span><br>
    <span class="ghost">Not the keyboard.</span>
  </h1>
  <p class="hero-sub">
    SomaSyncAI documents your session <strong>while you work</strong> — listening through your earpiece, logging only when you say so, and building a structured SOAP note from your clinical observations. No typing. No pausing. No charting pile at the end of the day.
  </p>
  <div class="hero-actions">
    <a class="btn-primary" href="/login?next=%2Fclinical-workspace%2F">Start free during beta</a>
    <a class="btn-ghost" href="#how">See how it works</a>
  </div>

  <div class="hero-visual">
    <div class="visual-bar">
      <span class="visual-label">SOMASYNC // CLINICAL SESSION</span>
      <span class="live-dot"><i></i>Session live</span>
    </div>
    <div class="waveform" id="waveform"></div>
    <div class="soap-preview">
      <div class="soap-field"><span>SUBJECTIVE</span><p>Client reports right shoulder pain, 7/10, aggravated by overhead reaching since 2019 rotator cuff strain.</p></div>
      <div class="soap-field"><span>OBJECTIVE</span><p>Active trigger point upper trapezius with referral to lateral arm. Reduced cervical rotation right 30°.</p></div>
      <div class="soap-field"><span>ASSESSMENT</span><p>Myofascial dysfunction upper trapezius and infraspinatus. Postural component noted — forward head, elevated right shoulder.</p></div>
      <div class="soap-field"><span>PLAN</span><p>NMT ischemic compression, subscapularis release, home stretch protocol. Reassess in 2 sessions.</p></div>
    </div>
  </div>
</section>

<div class="strip">
  <div class="strip-inner">
    <span class="hi">REAL-TIME VOICE LOGGING</span>
    <span>NMT-AWARE SOAP GENERATION</span>
    <span class="hi">EARPIECE CLINICAL COACHING</span>
    <span>BIOPSYCHOSOCIAL INTAKE</span>
    <span class="hi">BUILT BY A PRACTITIONER</span>
    <span>TRIGGER POINT PATTERN RECOGNITION</span>
    <span class="hi">HANDS NEVER LEAVE THE CLIENT</span>
    <span>CLINICIAN REVIEW REQUIRED</span>
    <span class="hi">REAL-TIME VOICE LOGGING</span>
    <span>NMT-AWARE SOAP GENERATION</span>
    <span class="hi">EARPIECE CLINICAL COACHING</span>
    <span>BIOPSYCHOSOCIAL INTAKE</span>
    <span class="hi">BUILT BY A PRACTITIONER</span>
    <span>TRIGGER POINT PATTERN RECOGNITION</span>
    <span class="hi">HANDS NEVER LEAVE THE CLIENT</span>
    <span>CLINICIAN REVIEW REQUIRED</span>
  </div>
</div>

<section class="practitioner" id="about">
  <div class="practitioner-grid">
    <div>
      <p class="section-label">Built differently</p>
      <p class="practitioner-quote">
        Every other tool was built by someone who <span class="teal">read about</span> manual therapy.<br>
        This one was built by someone who trained in it.
      </p>
      <p class="practitioner-body">
        There is a difference between knowing what a trigger point is and knowing what it feels like to find one in the infraspinatus while your client is describing three years of shoulder pain, a desk job, and poor sleep. <strong>That context lives in this tool.</strong>
      </p>
      <p class="practitioner-body">
        SomaSyncAI was built by a CAMTC-certified neuromuscular therapy practitioner who graduated from the Advanced NMT Program at National Holistic Institute — 1,250 clinical hours. The AI knows NMT terminology, trigger point referral patterns, fascial relationships, and the biopsychosocial factors that determine whether a client actually gets better. Because the person who built it does too.
      </p>
      <div class="credential">
        <strong>NHI Graduate</strong> · Advanced NMT · Group 208 · CAMTC Certified
      </div>
    </div>
    <div class="practitioner-stats">
      <div class="p-stat">
        <strong>1,250</strong>
        <span>Clinical training hours in neuromuscular therapy</span>
      </div>
      <div class="p-stat">
        <strong>NMT</strong>
        <span>Trigger point, fascial, and postural distortion training</span>
      </div>
      <div class="p-stat">
        <strong>0</strong>
        <span>Other tools built by someone who's actually done this work</span>
      </div>
      <div class="p-stat">
        <strong>100%</strong>
        <span>Clinician review required before any note is exported</span>
      </div>
    </div>
  </div>
</section>

<section id="how">
  <p class="section-label">How it works</p>
  <h2 class="section-title">From intake<br>to signed note.</h2>
  <p class="section-body">Five steps. Your hands stay on the client for all of them.</p>
  <div class="how-grid">
    <div class="how-step">
      <div class="how-num">01</div>
      <h3>Client submits intake</h3>
      <p>You send a link before the appointment. They fill out chief complaint, pain history, biopsychosocial factors, and pressure preferences. No name collected — privacy by design.</p>
    </div>
    <div class="how-step">
      <div class="how-num">02</div>
      <h3>Earpiece briefs you</h3>
      <p>Before the session starts, your earpiece walks you through the client's intake, flags key complaint areas, suggests likely trigger point locations, and runs the pre-session consent checklist.</p>
    </div>
    <div class="how-step">
      <div class="how-num">03</div>
      <h3>Say "noting" to log</h3>
      <p>During the session, say "noting" and the system captures your clinical observations through your mic. Say "pause" and it stops. Your hands never leave the client.</p>
    </div>
    <div class="how-step">
      <div class="how-num">04</div>
      <h3>AI builds the SOAP</h3>
      <p>After session, AI generates a strict four-field SOAP note from your logged observations — grounded in NMT terminology, informed by the client's intake history. No hallucination, no padding.</p>
    </div>
    <div class="how-step">
      <div class="how-num">05</div>
      <h3>You review and export</h3>
      <p>Every field is editable. Export is locked until you check the review box. Your clinical judgment is the final word — always.</p>
    </div>
  </div>
</section>

<section id="features" style="background:var(--panel); border-top:1px solid var(--line); border-bottom:1px solid var(--line);">
  <p class="section-label">What's inside</p>
  <h2 class="section-title">Everything a practitioner actually needs.</h2>
  <p class="section-body">Not a generic EHR with a massage skin on it. Built from the ground up for hands-on clinical work.</p>
  <div class="features-grid">
    <div class="feat">
      <div class="feat-icon">🎙️</div>
      <h3>Real-time voice logging</h3>
      <p>Say "noting" to start capturing. Say "pause" to stop. Audio only flows to the transcription engine when you tell it to — never during client conversation.</p>
      <span class="feat-tag">Live in beta</span>
    </div>
    <div class="feat">
      <div class="feat-icon">🫀</div>
      <h3>NMT-aware SOAP generation</h3>
      <p>The AI knows trigger point maps, referred pain patterns, fascial relationships, and NMT terminology. Your notes read like a trained practitioner wrote them — because one did.</p>
      <span class="feat-tag">Live in beta</span>
    </div>
    <div class="feat">
      <div class="feat-icon">🎧</div>
      <h3>Earpiece clinical coaching</h3>
      <p>Pre-session intake brief, area coverage reminders, body mechanics checks, time remaining alerts, and grounding prompts — all through your earpiece so your eyes stay on the client.</p>
      <span class="feat-tag">Live in beta</span>
    </div>
    <div class="feat">
      <div class="feat-icon">📋</div>
      <h3>Biopsychosocial intake</h3>
      <p>Client submits history, chief complaint, pain behavior, lifestyle, and stress factors before the appointment. The system uses it to brief you and inform the SOAP assessment.</p>
      <span class="feat-tag">Coming soon</span>
    </div>
    <div class="feat">
      <div class="feat-icon">🔒</div>
      <h3>Privacy-scoped by design</h3>
      <p>No names on intake forms. Session audio never stored. Event log contains state codes only — never transcript, SOAP content, or identifying information.</p>
      <span class="feat-tag">Live in beta</span>
    </div>
    <div class="feat">
      <div class="feat-icon">📈</div>
      <h3>Session progress tracking</h3>
      <p>Pain scale, symptom changes, and treatment response tracked visit over visit. Know whether your protocol is working before the client tells you.</p>
      <span class="feat-tag">Roadmap</span>
    </div>
    <div class="feat">
      <div class="feat-icon">🧠</div>
      <h3>Clinical knowledge base</h3>
      <p>Built on published NMT literature, Travell and Simons trigger point research, pain neuroscience, and the founder's own clinical training notes. Real citations, not generic AI.</p>
      <span class="feat-tag">In development</span>
    </div>
    <div class="feat">
      <div class="feat-icon">📄</div>
      <h3>ICD-10-CM reference</h3>
      <p>Search diagnosis codes for reference only. Every suggestion is clearly marked for professional verification — never auto-applied to billing or records.</p>
      <span class="feat-tag">Live in beta</span>
    </div>
    <div class="feat">
      <div class="feat-icon">📤</div>
      <h3>One-tap export</h3>
      <p>Reviewed and approved notes export as clean text. Clinician review checkbox is required — no workaround, no bypass. Your signature is on every note.</p>
      <span class="feat-tag">Live in beta</span>
    </div>
  </div>
</section>

<section class="compare-section" id="compare">
  <p class="section-label">Honest comparison</p>
  <h2 class="section-title">What no one else does.</h2>
  <p class="section-body">Noterro, Jane, WebPT, Vagaro — good scheduling tools. None of them document during the session. None of them were built by someone who's done the work.</p>
  <table class="compare-table">
    <thead>
      <tr>
        <th>Capability</th>
        <th class="soma-col">SomaSyncAI</th>
        <th>Noterro</th>
        <th>Jane App</th>
        <th>WebPT</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Documents during the session</td>
        <td class="soma-col"><span class="yes">✓</span></td>
        <td><span class="no">✗</span> Post-session dictation</td>
        <td><span class="no">✗</span></td>
        <td><span class="no">✗</span></td>
      </tr>
      <tr>
        <td>NMT trigger point awareness</td>
        <td class="soma-col"><span class="yes">✓</span></td>
        <td><span class="no">✗</span> Generic medical</td>
        <td><span class="no">✗</span></td>
        <td><span class="no">✗</span></td>
      </tr>
      <tr>
        <td>Earpiece coaching during session</td>
        <td class="soma-col"><span class="yes">✓</span></td>
        <td><span class="no">✗</span></td>
        <td><span class="no">✗</span></td>
        <td><span class="no">✗</span></td>
      </tr>
      <tr>
        <td>Biopsychosocial intake to SOAP</td>
        <td class="soma-col"><span class="yes">✓</span></td>
        <td><span class="no">✗</span></td>
        <td><span class="no">✗</span></td>
        <td><span class="no">✗</span></td>
      </tr>
      <tr>
        <td>Built by a licensed NMT practitioner</td>
        <td class="soma-col"><span class="yes">✓</span></td>
        <td><span class="no">✗</span></td>
        <td><span class="no">✗</span></td>
        <td><span class="no">✗</span></td>
      </tr>
      <tr>
        <td>Body mechanics and area reminders</td>
        <td class="soma-col"><span class="yes">✓</span></td>
        <td><span class="no">✗</span></td>
        <td><span class="no">✗</span></td>
        <td><span class="no">✗</span></td>
      </tr>
      <tr>
        <td>Starting price</td>
        <td class="soma-col" style="color:var(--teal); font-weight:600;">Free beta → $49/mo</td>
        <td>$30/mo</td>
        <td>$54/mo</td>
        <td>$104/mo</td>
      </tr>
    </tbody>
  </table>
</section>

<section id="pricing">
  <p class="section-label">Pricing</p>
  <h2 class="section-title">One extra client<br>pays for it.</h2>
  <p class="section-body">Free during the public beta. Paid plans launch when the product earns them. Every tier includes full access to the clinical workspace.</p>
  <div class="pricing-grid">
    <div class="price-card">
      <p class="price-tier">Solo practitioner</p>
      <div class="price-amount"><sup>$</sup>49<sub>/mo</sub></div>
      <p class="price-desc">For independent LMTs, NMTs, and solo practitioners who want hands-free documentation without the generic EHR overhead.</p>
      <ul class="price-features">
        <li>Real-time voice logging</li>
        <li>NMT-aware SOAP generation</li>
        <li>Earpiece coaching</li>
        <li>Biopsychosocial intake form</li>
        <li>ICD-10-CM reference</li>
        <li>Session export</li>
      </ul>
      <a class="price-cta" href="/login?next=%2Fclinical-workspace%2F">Try free during beta</a>
    </div>
    <div class="price-card featured">
      <p class="price-tier featured-label">Small clinic</p>
      <div class="price-amount"><sup>$</sup>129<sub>/mo</sub></div>
      <p class="price-desc">For practices with 2–5 practitioners who need shared documentation, client continuity, and team-level clinical oversight.</p>
      <ul class="price-features">
        <li>Everything in Solo</li>
        <li>Up to 5 practitioners</li>
        <li>Shared client records</li>
        <li>Progress tracking across visits</li>
        <li>Clinical knowledge base (RAG)</li>
        <li>Priority support</li>
      </ul>
      <a class="price-cta featured-cta" href="/login?next=%2Fclinical-workspace%2F">Try free during beta</a>
    </div>
    <div class="price-card">
      <p class="price-tier">Multi-location</p>
      <div class="price-amount"><sup>$</sup>299<sub>/mo</sub></div>
      <p class="price-desc">For clinics, chiro offices, and PT practices with multiple locations, supervision needs, and compliance reporting requirements.</p>
      <ul class="price-features">
        <li>Everything in Clinic</li>
        <li>Unlimited practitioners</li>
        <li>Compliance reporting</li>
        <li>BAA included</li>
        <li>Custom protocol library</li>
        <li>Dedicated onboarding</li>
      </ul>
      <a class="price-cta" href="mailto:drophategrx@gmail.com">Contact for access</a>
    </div>
  </div>
  <p class="price-note">All plans free during public beta. Pricing takes effect at general availability. No credit card required to start.</p>
</section>

<section id="roadmap" style="background:var(--panel); border-top:1px solid var(--line); border-bottom:1px solid var(--line);">
  <p class="section-label">Roadmap</p>
  <h2 class="section-title">Where this is going.</h2>
  <p class="section-body">Built in the open, sequenced by clinical priority — not investor pressure.</p>
  <div class="roadmap-grid">
    <div class="road-card live">
      <p class="road-phase">Phase 1 — Live now</p>
      <h3>Real-time clinical workspace</h3>
      <ul>
        <li>Voice-gated session logging</li>
        <li>NMT-aware SOAP generation</li>
        <li>Earpiece coaching and reminders</li>
        <li>Supabase magic-link auth</li>
        <li>ICD-10-CM reference</li>
        <li>Privacy-scoped event trail</li>
      </ul>
    </div>
    <div class="road-card">
      <p class="road-phase">Phase 2 — In development</p>
      <h3>Intake and continuity</h3>
      <ul>
        <li>Anonymous token-based intake form</li>
        <li>Biopsychosocial history capture</li>
        <li>Pre-session earpiece brief from intake</li>
        <li>Visit-over-visit progress tracking</li>
        <li>Pain scale trend reporting</li>
      </ul>
    </div>
    <div class="road-card">
      <p class="road-phase">Phase 3 — Planned</p>
      <h3>Clinical knowledge base</h3>
      <ul>
        <li>RAG on NMT literature and protocols</li>
        <li>Travell and Simons trigger point maps</li>
        <li>Founder's clinical training notes</li>
        <li>Evidence-based treatment outcomes</li>
        <li>Biopsychosocial study integration</li>
      </ul>
    </div>
    <div class="road-card">
      <p class="road-phase">Phase 4 — Planned</p>
      <h3>Practice management</h3>
      <ul>
        <li>Multi-practitioner team accounts</li>
        <li>Scheduling integration</li>
        <li>BAA-compliant PHI storage</li>
        <li>Compliance and audit reporting</li>
        <li>Custom clinic protocol library</li>
      </ul>
    </div>
  </div>
</section>

<section class="cta-section" id="beta">
  <h2>
    Chart <span class="teal">less.</span><br>
    Treat <span class="ghost">more.</span>
  </h2>
  <p>Free during the public beta. No invite, no waitlist, no credit card. Just sign in and run a session.</p>
  <a class="btn-primary" href="/login?next=%2Fclinical-workspace%2F">Open the free beta</a>
  <p class="cta-legal">
    By entering you agree to the beta privacy and AI-use notice. Do not enter client-identifying information without appropriate safeguards in place.<br>
    <a href="/privacy-policy.html">Privacy Policy</a> · <a href="/terms-and-conditions.html">Terms</a>
  </p>
</section>

<footer>
  <div class="footer-grid">
    <div class="footer-brand">
      <img src="/ss.png" alt="SomaSyncAI" style="height:32px; margin-bottom:12px;" />
      <p>Clinical documentation at the speed of conversation. Built by a practitioner, for practitioners.</p>
    </div>
    <div class="footer-col">
      <h4>Product</h4>
      <a href="#how">How it works</a>
      <a href="#features">Features</a>
      <a href="#roadmap">Roadmap</a>
      <a href="/login?next=%2Fclinical-workspace%2F">Open workspace</a>
    </div>
    <div class="footer-col">
      <h4>Compare</h4>
      <a href="#compare">vs. Noterro</a>
      <a href="#compare">vs. Jane App</a>
      <a href="#compare">vs. WebPT</a>
    </div>
    <div class="footer-col">
      <h4>Legal</h4>
      <a href="/privacy-policy.html">Privacy</a>
      <a href="/terms-and-conditions.html">Terms</a>
      <a href="/ai-disclaimer.html">AI Disclaimer</a>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2026 SomaSyncAI. Built for the gold standard practitioner.</span>
    <span>Powered by AALIYAH.IO</span>
  </div>
</footer>
`

const JS = `
(() => {
  const nav = document.getElementById('soma-nav')
  window.addEventListener('scroll', () => {
    nav?.classList.toggle('stuck', window.scrollY > 40)
  })

  // Waveform animation
  const waveform = document.getElementById('waveform')
  if (waveform) {
    for (let i = 0; i < 40; i++) {
      const bar = document.createElement('span')
      const h = Math.random() * 36 + 6
      const d = (Math.random() * 0.8 + 0.4).toFixed(2)
      bar.style.cssText = '--h:' + h + 'px; --d:' + d + 's; height:' + (Math.random() * 20 + 4) + 'px;'
      waveform.appendChild(bar)
    }
  }

  // Smooth scroll nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'))
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }) }
    })
  })
})()
`
