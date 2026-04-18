import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────
//  LANDING — SomaSync AI
//  CSS / JS extracted from somasync-landing.html
//  HTML rendered as proper JSX (not innerHTML)
// ─────────────────────────────────────────────

export default function Landing() {
  const wf1Ref = useRef(null)
  const wf2Ref = useRef(null)
  const canvasRef = useRef(null)
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) return
    mounted.current = true

    document.title = 'SomaSyncAI — The Gold Standard Clinical OS for Manual Therapists'

    // ── Google Fonts ──────────────────────────
    if (!document.getElementById('soma-fonts')) {
      const link = document.createElement('link')
      link.id = 'soma-fonts'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@300;400;500;600;700&display=swap'
      document.head.appendChild(link)
    }

    // ── Inject scoped CSS ─────────────────────
    if (!document.getElementById('soma-styles')) {
      const style = document.createElement('style')
      style.id = 'soma-styles'
      style.textContent = SOMA_CSS
      document.head.appendChild(style)
    }

    // ── Custom cursor ─────────────────────────
    const cdEl = document.getElementById('soma-cd')
    const crEl = document.getElementById('soma-cr')
    let mx = 0, my = 0, rx = 0, ry = 0

    const onMouseMove = (e) => {
      mx = e.clientX; my = e.clientY
      if (cdEl) { cdEl.style.left = mx + 'px'; cdEl.style.top = my + 'px' }
    }
    document.addEventListener('mousemove', onMouseMove)

    let rafId
    const loop = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      if (crEl) { crEl.style.left = rx + 'px'; crEl.style.top = ry + 'px' }
      rafId = requestAnimationFrame(loop)
    }
    loop()

    // ── Hover cursor expand ───────────────────
    const hoverTargets = document.querySelectorAll(
      '#soma-root a, #soma-root button, .feat-card, .how-card, .road-card, .inv-stat, .prob-card, .ds-ni, .nav-item'
    )
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('soma-h'))
      el.addEventListener('mouseleave', () => document.body.classList.remove('soma-h'))
    })

    // ── Sticky nav ────────────────────────────
    const nav = document.getElementById('soma-nav')
    const onScroll = () => {
      if (nav) nav.classList.toggle('stuck', window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll)

    // ── Scroll reveal ─────────────────────────
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('#soma-root .rv').forEach(el => io.observe(el))

    // ── Waveform builder ──────────────────────
    const buildWave = (el) => {
      if (!el) return
      el.innerHTML = ''
      for (let i = 0; i < 60; i++) {
        const b = document.createElement('div')
        b.className = 'wbar'
        b.style.cssText = `width:3px;height:4px;flex-shrink:0;animation-delay:${(i * 0.06).toFixed(2)}s;animation-duration:${(0.8 + Math.random() * 0.9).toFixed(2)}s`
        el.appendChild(b)
      }
    }
    buildWave(wf1Ref.current)
    buildWave(wf2Ref.current)

    // ── Canvas blob animation ─────────────────
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      let W, H, t = 0

      const resize = () => {
        W = canvas.width = canvas.offsetWidth
        H = canvas.height = canvas.offsetHeight
      }
      resize()
      window.addEventListener('resize', resize)

      const blobs = [
        { x: 0.72, y: 0.25, r: 340, hue: 210 },
        { x: 0.20, y: 0.65, r: 270, hue: 195 },
        { x: 0.55, y: 0.75, r: 210, hue: 225 },
      ]

      const drawBlob = (cx, cy, r, hue) => {
        ctx.beginPath()
        for (let i = 0; i <= 16; i++) {
          const a = (i / 16) * Math.PI * 2
          const noise = Math.sin(a * 3 + t * 0.7) * 35 + Math.cos(a * 2 + t * 0.5) * 22
          const rad = r + noise
          const x = cx + Math.cos(a) * rad
          const y = cy + Math.sin(a) * rad
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.closePath()
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r + 60)
        g.addColorStop(0, `hsla(${hue},80%,50%,.17)`)
        g.addColorStop(0.6, `hsla(${hue},70%,40%,.08)`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fill()
      }

      let framId
      const frame = () => {
        t += 0.008
        ctx.clearRect(0, 0, W, H)
        blobs.forEach(b => drawBlob(b.x * W, b.y * H, b.r, b.hue))
        framId = requestAnimationFrame(frame)
      }
      frame()

      // Cleanup
      return () => {
        document.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', resize)
        cancelAnimationFrame(rafId)
        cancelAnimationFrame(framId)
        io.disconnect()
        const styleEl = document.getElementById('soma-styles')
        if (styleEl) styleEl.remove()
        document.body.classList.remove('soma-h')
      }
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
      io.disconnect()
      const styleEl = document.getElementById('soma-styles')
      if (styleEl) styleEl.remove()
      document.body.classList.remove('soma-h')
    }
  }, [])

  // ── JSX ──────────────────────────────────────
  return (
    <div id="soma-root">

      {/* Custom cursor */}
      <div id="soma-cd" />
      <div id="soma-cr" />

      {/* NAV */}
      <nav id="soma-nav">
        <a className="n-logo" href="#" style={{ gap: 0 }}>
          <img src="./ss.png" alt="SomaSyncAI" style={{ height: 38, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(59,158,255,0.4))' }} />
        </a>
        <div className="n-pill">
          <a href="#features">Features</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#how">Workflow</a>
          <a href="#investors">Investors</a>
        </div>
        <a className="n-cta" href="https://somasyncai.com/auth">Join Beta — Free</a>
      </nav>

      {/* HERO */}
      <section id="hero">
        <canvas id="c" ref={canvasRef} />

        <div className="hero-top-stats">
          <div>
            <div className="ts-n"><span>87</span>%</div>
            <div className="ts-l">Less charting</div>
          </div>
          <div>
            <div className="ts-n"><span>100</span>%</div>
            <div className="ts-l">Hands-free</div>
          </div>
        </div>

        <div className="hero-inner">
          <div className="hero-badge">
            <div className="hero-badge-dot" />
            Now in Beta — Limited Access
          </div>
          <h1 className="hero-h1">
            THE <span className="out">GOLD</span>
            <br />
            <span style={{ color: 'var(--blue)', textShadow: '0 0 80px var(--blue-glow)' }}>STANDARD</span>
            <br />
            CLINICAL <span className="out">OS</span>
          </h1>
          <div style={{ marginTop: 24, fontFamily: "'Syne',sans-serif", fontSize: 'clamp(.9rem,1.5vw,1.2rem)', fontWeight: 700, letterSpacing: '.04em', color: 'var(--muted)', opacity: 0, animation: 'fadeUp .8s .7s forwards' }}>
            The Intelligence of You.
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="dash-wrap">
          <div className="dash-fade" />
          <div className="dash-screen">
            <div className="dash-bar">
              <div className="dash-dots">
                <div className="dash-dot dd1" />
                <div className="dash-dot dd2" />
                <div className="dash-dot dd3" />
              </div>
              <div className="dash-url">app.somasyncai.com/session/live</div>
            </div>
            <div className="dash-body">
              <div className="dash-sidebar">
                <div className="dash-logo"><div className="dash-logo-dot" />SomaSyncAI</div>
                {['Live Session','SOAP Notes','Patients','Treatment Memory','ICD-10 Assist','Analytics','Settings'].map((item, i) => (
                  <div key={item} className={`nav-item${i === 0 ? ' on' : ''}`}>
                    <div className="ni-dot" />{item}
                  </div>
                ))}
              </div>
              <div className="dash-main">
                <div className="dash-header">
                  <div className="dash-title">New Session — Sarah M. · PT Visit #4</div>
                  <div className="dash-live"><div className="dlb-dot" />AALIYAH Ready</div>
                </div>

                {/* Session progress steps */}
                <div style={{ display: 'flex', gap: 0, marginBottom: 20, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, overflow: 'hidden' }}>
                  {[
                    { label: '✓ Intake', active: true, current: false },
                    { label: '● Calibration', active: true, current: true },
                    { label: 'Analysis', active: false },
                    { label: 'Assessment', active: false },
                    { label: 'Generate', active: false },
                    { label: 'Live Session', active: false },
                  ].map((step, i) => (
                    <div key={i} style={{ flex: 1, padding: '10px 12px', background: step.current ? 'rgba(0,232,154,0.08)' : step.active ? 'rgba(0,232,154,0.12)' : 'transparent', borderRight: i < 5 ? '1px solid rgba(255,255,255,0.07)' : 'none', textAlign: 'center', opacity: step.active || step.current ? 1 : 0.35 }}>
                      <div style={{ fontSize: '.55rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: step.active || step.current ? 'var(--grn)' : 'var(--muted)' }}>
                        {step.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Consent panel */}
                <div className="aa-box" style={{ marginBottom: 16 }}>
                  <div className="aa-av">🔒</div>
                  <div style={{ flex: 1 }}>
                    <div className="aa-l">Consent — Required Before Calibration</div>
                    <div className="aa-t" style={{ marginBottom: 10 }}>AALIYAH will listen and process voice during this session. Client consent is required and logged.</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ background: 'var(--grn)', color: '#080808', fontSize: '.65rem', fontWeight: 700, padding: '6px 14px', borderRadius: 100, letterSpacing: '.06em' }}>✓ Consent Given</div>
                      <div style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--muted)', fontSize: '.65rem', fontWeight: 700, padding: '6px 14px', borderRadius: 100, letterSpacing: '.06em' }}>View Policy</div>
                    </div>
                  </div>
                </div>

                {/* Voice calibration */}
                <div className="aa-box">
                  <div className="aa-av">🎧</div>
                  <div style={{ flex: 1 }}>
                    <div className="aa-l">AALIYAH — Voice Calibration</div>
                    <div className="aa-t" style={{ marginBottom: 10 }}>
                      Say the following phrase clearly: <b>"AALIYAH, begin session for Sarah Mitchell."</b> Calibrating to your voice in current environment.
                    </div>
                    <div ref={wf1Ref} className="waveform" id="wf1" style={{ marginTop: 0, height: 32, border: 'none', background: 'transparent', padding: 0 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="mq-wrap">
        <div className="mq-track">
          {[...Array(2)].map((_, dupe) =>
            ['Live In-Ear AI','Automatic SOAP Notes','Voice Charting','Treatment Memory','Gold Standard Documentation','Physical Therapy','Chiropractic','Massage Therapy','Sports Medicine','ICD-10 Assist','AALIYAH.IO Powered'].map((item, i) => (
              <span key={`${dupe}-${i}`} className="mq-item">{item} <span className="s">◆</span></span>
            ))
          )}
        </div>
      </div>

      {/* PROBLEM */}
      <section id="problem" className="sec">
        <div className="sec-tag rv">The Problem</div>
        <h2 className="sec-h rv d1">YOU DIDN'T<br />TRAIN TO <span className="out">CHART.</span></h2>
        <p className="sec-sub rv d2">Manual therapists spend nearly as much time documenting as treating. That ends now.</p>
        <div className="prob-row">
          <div className="prob-card rv d1">
            <div className="prob-n">3H</div>
            <div className="prob-l">Daily Documentation Burden</div>
            <div className="prob-d">Average practitioner spends 3+ hours per day on notes, charting, and admin tasks.</div>
          </div>
          <div className="prob-card rv d2">
            <div className="prob-n">40%</div>
            <div className="prob-l">Of Clinical Time Lost</div>
            <div className="prob-d">Nearly half your working day goes to paperwork instead of patient care.</div>
          </div>
          <div className="prob-card rv d3">
            <div className="prob-n">#1</div>
            <div className="prob-l">Cause of Burnout</div>
            <div className="prob-d">Documentation overload is the leading driver of burnout across every manual therapy discipline.</div>
          </div>
          <div className="prob-full rv">
            <div className="prob-full-t">SOMASYNCAI SOLVES THIS</div>
            <div className="ptags">
              <span className="ptag">🎧 Live In-Ear Guidance</span>
              <span className="ptag">🎤 Voice → SOAP Note</span>
              <span className="ptag">🧠 Treatment Memory</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="sec">
        <div className="sec-tag rv">Core Features — Live Now</div>
        <h2 className="sec-h rv d1">BUILT FOR THE<br /><span className="out">TREATMENT</span> TABLE</h2>
        <div className="feat-grid">
          {[
            { ico: '🎧', title: 'Live In-Ear AI Guidance', desc: "Real-time suggestions whispered during assessments. Like having a brilliant clinical colleague on every case." },
            { ico: '📋', title: 'Automatic SOAP Notes', desc: "Speak naturally. SomaSyncAI structures everything instantly into compliant, ready-to-sign documentation." },
            { ico: '🎤', title: 'Voice Charting', desc: "Hands on the patient. Voice on the record. Document without breaking contact." },
            { ico: '🧠', title: 'Treatment Memory', desc: "Every session deepens the AI's understanding. Pattern recognition compounds across all visits.", row2: true },
            { ico: '🔬', title: 'ICD-10 Code Assist', desc: "AI suggests relevant diagnostic codes from your documentation. Reduce billing errors instantly.", row2: true },
            { ico: '⚡', title: 'Instant Documentation', desc: "Walk out of treatment with complete notes already generated. No after-hours charting. Ever again.", row2: true },
          ].map((f, i) => (
            <div key={f.title} className={`feat-card${f.row2 ? ' feat-row2' : ''} rv d${(i % 3) + 1}`}>
              <div className="feat-ico">{f.ico}</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
              <div className="feat-live"><div className="feat-live-dot" />Live Now</div>
            </div>
          ))}
        </div>
      </section>

      {/* DASHBOARD SECTION */}
      <section id="ds-sec">
        <div className="ds-hd">
          <div>
            <div className="sec-tag rv">The Dashboard</div>
            <h2 className="sec-h rv d1">YOUR CLINICAL<br /><span className="g">COMMAND</span> CENTER</h2>
          </div>
          <p className="sec-sub rv d2">Live sessions, patient history, SOAP notes, and AALIYAH's real-time guidance — all in one place.</p>
        </div>
        <div className="ds-wrap rv">
          <div className="ds-glow" />
          <div className="ds-screen">
            <div className="ds-bar2">
              <div className="dash-dots">
                <div className="dash-dot dd1" /><div className="dash-dot dd2" /><div className="dash-dot dd3" />
              </div>
              <div className="dash-url" style={{ maxWidth: 300 }}>app.somasyncai.com/dashboard</div>
            </div>
            <div className="ds-inner">
              {/* Sidebar */}
              <div className="ds-side">
                <div className="ds-side-logo"><div className="ds-sld" />SomaSyncAI</div>
                {[['🎧','Live Session',true],['📋','SOAP Notes'],['👤','Patients'],['🧠','Treatment Memory'],['🔬','ICD-10 Assist'],['📊','Analytics'],['⚙️','Settings']].map(([ico,label,active]) => (
                  <div key={label} className={`ds-ni${active ? ' on' : ''}`}>
                    <span className="ds-ni-ico">{ico}</span>{label}
                  </div>
                ))}
              </div>

              {/* Center */}
              <div className="ds-center">
                <div className="ds-ct">
                  <div className="ds-cth">James R. — Health History Review</div>
                  <div className="ds-rec"><div className="ds-rec-dot" style={{ background: 'var(--grn)' }} />Analyzing</div>
                </div>

                {/* Step progress */}
                <div style={{ display: 'flex', gap: 0, marginBottom: 22, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, overflow: 'hidden' }}>
                  {['✓ Intake','✓ Calibration','● Analysis','Assessment','Generate','Live Session'].map((s, i) => (
                    <div key={s} style={{ flex: 1, padding: '9px 10px', background: i < 2 ? 'rgba(0,232,154,0.1)' : i === 2 ? 'rgba(0,232,154,0.14)' : 'transparent', borderRight: i < 5 ? '1px solid rgba(255,255,255,0.07)' : 'none', textAlign: 'center', opacity: i >= 3 ? 0.3 : 1 }}>
                      <div style={{ fontSize: '.52rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: i < 3 ? 'var(--grn)' : 'var(--muted)' }}>{s}</div>
                    </div>
                  ))}
                </div>

                <div className="ds-sg">
                  <div className="ds-sc">
                    <div className="ds-sl">Chief Complaint</div>
                    <div className="ds-st">Cervical pain and <b>tension headaches.</b> Onset 3 months ago. Progressive. Desk worker, 10hr/day average.</div>
                  </div>
                  <div className="ds-sc">
                    <div className="ds-sl">Relevant History</div>
                    <div className="ds-st">No prior surgeries. <b>Hypertension (managed).</b> Previous whiplash 2018. No current medications contraindicated.</div>
                  </div>
                  <div className="ds-sc" style={{ background: 'rgba(255,80,80,0.04)', borderColor: 'rgba(255,100,100,0.2)' }}>
                    <div className="ds-sl" style={{ color: '#ff8080' }}>⚠ Contraindication Check</div>
                    <div className="ds-st">Hypertension noted — <b>avoid aggressive cervical manipulation.</b> AALIYAH flagged: confirm BP before session.</div>
                  </div>
                  <div className="ds-sc" style={{ background: 'rgba(0,232,154,0.04)', borderColor: 'rgba(0,232,154,0.18)' }}>
                    <div className="ds-sl">AALIYAH Recommends</div>
                    <div className="ds-st">Perform <b>cervical orthopedic tests:</b> Spurling's, distraction, Valsalva. Check dermatomal patterns before bodywork.</div>
                  </div>
                </div>

                <div className="ds-aa">
                  <div className="ds-aa-av">🎧</div>
                  <div>
                    <div className="ds-aa-l">AALIYAH — Contraindication Analysis Complete</div>
                    <div className="ds-aa-t">Health history processed. <b>1 flag raised</b> (hypertension). No session-blocking contraindications. Cleared to proceed — confirm BP reading, then begin visual assessment.</div>
                  </div>
                </div>
                <div ref={wf2Ref} className="ds-wv" id="wf2" />
              </div>

              {/* Right panel */}
              <div className="ds-right">
                <div className="ds-rt">Today's Patients</div>
                {[
                  { name: 'James R.', info: '9:00 AM · Cervical / PT\nSession #7 of 12', active: true },
                  { name: 'Maria S.', info: '10:30 AM · Lower Back\nSession #3 of 8' },
                  { name: 'David K.', info: '12:00 PM · Shoulder / Sports\nNew Patient' },
                ].map(p => (
                  <div key={p.name} className="ds-pat">
                    <div className="ds-pn">{p.name}</div>
                    <div className="ds-pi" style={{ whiteSpace: 'pre-line' }}>{p.info}</div>
                    {p.active && <div className="ds-ptag">● Active Now</div>}
                  </div>
                ))}
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="ds-rt">Session Metrics</div>
                  {[['Charting Time Saved','47 min'],['Notes Generated','3 / 3'],['ICD-10 Codes','M54.2, M54.5'],['AALIYAH Insights','12 today']].map(([l,v]) => (
                    <div key={l} className="ds-metric">
                      <div className="ds-ml">{l}</div>
                      <div className="ds-mv">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="sec">
        <div className="sec-tag rv">Full Session Workflow</div>
        <h2 className="sec-h rv d1">A SESSION WITH <span className="g">AALIYAH</span></h2>
        <p className="sec-sub rv d2">AALIYAH.IO is the clinical intelligence powering SomaSyncAI. Here's exactly how a session flows — from intake to documentation.</p>
        <div className="how-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginTop: 60 }}>
          {[
            { n: '01', title: 'Intake Form & Health History', desc: "Client fills out the intake form while you prepare. No rushing — a complete health history is the foundation of everything that follows.", sub: 'Intake & Preparation' },
            { n: '02', title: 'AALIYAH Wakes Up', desc: "Power on the earpiece, open the SOAP dashboard. AALIYAH shows consent first — always. Then runs a brief voice calibration so she recognises your voice precisely in any environment.", sub: 'Calibration & Consent' },
            { n: '03', title: 'AALIYAH Analyzes for Contraindications', desc: "Reflect the client's intake history out loud. AALIYAH starts clinical analysis — checking contraindications first, flagging conditions, suggesting orthopedic tests.", sub: 'Clinical Analysis' },
            { n: '04', title: 'Visual Assessment — Circle the Client', desc: "Analyze gait, posture, and alignment while circling the client. Call out what you see. AALIYAH captures every observation, merging Western anatomy with TCM principles in real time.", sub: 'Visual & Postural Assessment', border: true },
            { n: '05', title: 'Generate Documentation', desc: "Before bodywork begins, hit Generate. AALIYAH produces a full treatment plan and SOAP note draft from everything captured. You review and verify — AI assists, the clinician decides.", sub: null, generateBtn: true, border: true },
            { n: '06', title: 'Document Live During Bodywork', desc: "Session begins. Start live voice documentation while treating. Tissue response, adjustments, outcomes — all logged in real time by AALIYAH. Walk out with complete notes. Every session. No exceptions.", sub: 'Live Treatment Session', border: true },
          ].map(s => (
            <div key={s.n} className="how-card rv" style={s.border ? { borderTop: '1px solid rgba(255,255,255,0.06)' } : {}}>
              <div className="how-n">{s.n}</div>
              <div className="how-t">{s.title}</div>
              <div className="how-d">{s.desc}</div>
              {s.sub && <div style={{ marginTop: 16, fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--grn)' }}>{s.sub}</div>}
              {s.generateBtn && (
                <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(0,232,154,0.1)', border: '1px solid rgba(0,232,154,0.25)', color: 'var(--grn)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 100 }}>
                  ⚡ Generate Documentation
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="sec">
        <div className="sec-tag rv">Product Roadmap</div>
        <h2 className="sec-h rv d1">FOUR PHASES.<br /><span className="out">ONE</span> VISION.</h2>
        <div className="road-grid">
          {[
            { phase: 'Phase 01 — Q1 2026', title: 'Clinical Documentation MVP', live: true, items: ['Live in-ear AI guidance','Automatic SOAP notes','Voice charting','Treatment memory','ICD-10 code assist','Dashboard & chat'] },
            { phase: 'Phase 02 — Q3 2026', title: 'Intelligence Expansion', date: 'Coming Q3 2026', items: ['SomaSphere 3D visualizer','SyncLearn in-ear education','EHR integrations','Mobile app (iOS)','Practice dashboard','Billing code assist'] },
            { phase: 'Phase 03 — Q4 2026', title: 'Wearable + Population Layer', date: 'Coming Q4 2026', items: ['Wearable device integration','Real-time biometrics','Population analytics','Outcome tracking','Referral insights','Pattern reporting'] },
            { phase: 'Phase 04 — 2027', title: 'Predictive Care OS', date: 'Coming 2027', items: ['Predictive care AI','Re-injury risk flags','Personalised care paths','Multi-location enterprise','API for EHR vendors','International expansion'] },
          ].map((r, i) => (
            <div key={r.phase} className={`road-card rv d${i + 1}`}>
              {r.live && <div className="road-live">Live Now</div>}
              <div className="road-phase">{r.phase}</div>
              <div className="road-t">{r.title}</div>
              <ul className="road-items">
                {r.items.map(item => <li key={item}>{item}</li>)}
              </ul>
              {r.date && <div className="road-date">{r.date}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* INVESTORS */}
      <section id="investors" className="sec">
        <div className="sec-tag rv">For Investors</div>
        <h2 className="sec-h rv d1">THE <span className="g">OPPORTUNITY</span></h2>
        <p className="sec-sub rv d2">Building the AI OS for a $28B clinical documentation market with no purpose-built real-time solution.</p>
        <div className="inv-grid">
          <div className="inv-stats">
            {[['$28B','Global TAM'],['1.2M','US Practitioners'],['87%','Charting Reduction'],['$2.5M','Seed Round']].map(([n,l],i) => (
              <div key={l} className={`inv-stat rv d${i+1}`}>
                <div className="inv-n">{n}</div>
                <div className="inv-l">{l}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="why-list">
              {[
                ['Real-Time vs Post-Session','Every competitor transcribes after the session. We operate live during treatment.'],
                ['Discipline-Specific Intelligence','Built for manual therapy from the ground up — not generic medical transcription.'],
                ['Longitudinal Treatment Memory','Session-to-session intelligence that compounds. Deep switching costs that grow with usage.'],
                ['The Full OS Vision','SomaSphere, SyncLearn, Wearables, Predictive Care — a moat competitors cannot replicate.'],
              ].map(([title,desc],i) => (
                <div key={title} className={`why-item rv d${i+1}`}>
                  <div className="why-n">0{i+1}</div>
                  <div>
                    <div className="why-t">{title}</div>
                    <div className="why-d">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <a className="deck-link rv" href="https://somasyncai.com/investor-pitch">View Full Pitch Deck →</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta">
        <div className="sec-tag rv" style={{ justifyContent: 'center' }}>Beta Access — Limited Spots</div>
        <h2 className="cta-h rv d1">JOIN THE<br /><span className="out">GOLD</span><br /><span className="g">STANDARD</span></h2>
        <p className="cta-sub rv d2">Lifetime free access for every practitioner who completes all three steps below.</p>
        <div className="cta-btns rv d3">
          <a className="cta-b1" href="https://somasyncai.com/auth">Create Free Account →</a>
          <a className="cta-b2" href="https://somasyncai.com/dashboard/chat">Open Dashboard</a>
        </div>
        <div className="cta-note rv d4">
          No credit card. No commitment. California practitioners prioritised in first cohort.<br />
          Early adopters grandfathered at beta pricing when paid tiers launch.
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="foot-top">
          <div>
            <div className="foot-brand" style={{ marginBottom: 16 }}>
              <img src="./ss.png" alt="SomaSyncAI" style={{ height: 44, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(59,158,255,0.35))' }} />
            </div>
            <div className="foot-tag">The gold standard AI operating system for manual therapists. Live in-ear guidance. Zero documentation debt.</div>
          </div>
          <div>
            <div className="foot-col-h">Product</div>
            <ul className="foot-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#roadmap">Roadmap</a></li>
              <li><a href="#how">How It Works</a></li>
              <li><a href="#cta">Beta Access</a></li>
            </ul>
          </div>
          <div>
            <div className="foot-col-h">Disciplines</div>
            <ul className="foot-links">
              <li><a href="#">Massage Therapy</a></li>
              <li><a href="#">Physical Therapy</a></li>
              <li><a href="#">Chiropractic</a></li>
              <li><a href="#">Sports Medicine</a></li>
            </ul>
          </div>
          <div>
            <div className="foot-col-h">Company</div>
            <ul className="foot-links">
              <li><a href="#">Join the Team</a></li>
              <li><a href="https://somasyncai.com/investor-pitch">Pitch Deck</a></li>
              <li><a href="https://somasyncai.com/privacy-policy">Privacy</a></li>
              <li><a href="mailto:hello@somasyncai.com">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <div className="foot-copy">© 2026 SomaSyncAI. Built for the gold standard practitioner.</div>
          <div className="foot-aa"><div className="aa-dot" />Powered by AALIYAH.IO</div>
        </div>
      </footer>

    </div>
  )
}

// ─────────────────────────────────────────────
//  CSS — extracted from original Landing.jsx
//  Scoped to #soma-root to avoid global leakage
// ─────────────────────────────────────────────
const SOMA_CSS = `
/* ── Reset & variables ── */
#soma-root, #soma-root *,
#soma-root *::before,
#soma-root *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#soma-root {
  --bg: #080808;
  --ink: #f0ede8;
  --muted: rgba(240,237,232,0.45);
  --dim: rgba(240,237,232,0.18);
  --grn: #00e89a;
  --blue: #3b9eff;
  --blue2: #1a7ee0;
  --blue-glow: rgba(59,158,255,0.25);
  --r: clamp(24px,5vw,80px);
  scroll-behavior: smooth;
  background: var(--bg);
  color: var(--ink);
  font-family: 'Manrope', sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  cursor: none;
}

/* ── Custom cursor (fixed, outside soma-root) ── */
#soma-cd, #soma-cr {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%,-50%);
}
#soma-cd { width: 8px; height: 8px; background: var(--grn, #00e89a); }
#soma-cr { width: 34px; height: 34px; border: 1px solid rgba(0,232,154,0.5); transition: width .2s, height .2s, transform .13s; }
body.soma-h #soma-cr { width: 52px; height: 52px; border-color: #00e89a; }

/* ── Nav ── */
#soma-root nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 24px var(--r);
  transition: background .4s, box-shadow .4s;
}
#soma-root nav.stuck {
  background: rgba(8,8,8,0.9);
  backdrop-filter: blur(20px);
  box-shadow: 0 1px 0 rgba(255,255,255,0.06);
}
#soma-root .n-logo {
  font-family: 'Syne', sans-serif; font-weight: 800; font-size: .95rem;
  color: var(--ink); text-decoration: none;
  display: flex; align-items: center;
}
#soma-root .n-pill {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 100px; padding: 4px;
  display: flex;
}
#soma-root .n-pill a {
  font-size: .74rem; color: var(--muted); text-decoration: none;
  padding: 8px 18px; border-radius: 100px;
  transition: background .2s, color .2s;
}
#soma-root .n-pill a:hover { background: rgba(255,255,255,0.08); color: var(--ink); }
#soma-root .n-cta {
  font-family: 'Syne', sans-serif; font-size: .78rem; font-weight: 700;
  background: var(--blue); color: #fff;
  padding: 11px 22px; border-radius: 100px; text-decoration: none;
  transition: background .2s, transform .15s, box-shadow .2s;
}
#soma-root .n-cta:hover { background: var(--blue2); transform: scale(1.04); box-shadow: 0 0 24px var(--blue-glow); }

/* ── Hero ── */
#soma-root #hero {
  min-height: 100vh; display: flex; flex-direction: column;
  justify-content: flex-end;
  padding: 130px var(--r) 0;
  position: relative; overflow: hidden;
}
#soma-root #hero canvas {
  position: absolute; inset: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 0;
}
#soma-root .hero-inner { position: relative; z-index: 2; }
#soma-root .hero-top-stats {
  position: absolute; top: 130px; right: var(--r);
  display: flex; flex-direction: column; gap: 20px;
  z-index: 2; text-align: right;
  opacity: 0; animation: fadeIn 1s 1s forwards;
}
#soma-root .ts-n { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.6rem; letter-spacing: -.03em; line-height: 1; }
#soma-root .ts-n span { color: var(--grn); }
#soma-root .ts-l { font-size: .65rem; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin-top: 3px; }

#soma-root .hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  border: 1px solid rgba(59,158,255,0.35);
  background: rgba(59,158,255,0.07);
  color: var(--blue); font-size: .68rem; font-weight: 600;
  letter-spacing: .1em; text-transform: uppercase;
  padding: 7px 16px; border-radius: 100px; margin-bottom: 32px;
  opacity: 0; animation: fadeUp .7s .3s forwards;
}
#soma-root .hero-badge-dot {
  width: 6px; height: 6px; background: var(--grn);
  border-radius: 50%; animation: pulse 2s infinite;
  box-shadow: 0 0 6px var(--grn);
}
#soma-root .hero-h1 {
  font-family: 'Syne', sans-serif; font-weight: 800;
  font-size: clamp(5rem,11vw,12rem); line-height: .85; letter-spacing: -.05em;
  opacity: 0; animation: fadeUp 1s .45s cubic-bezier(.22,1,.36,1) forwards;
}
#soma-root .hero-h1 .out {
  -webkit-text-stroke: clamp(1px,.15vw,2px) rgba(240,237,232,0.3);
  color: transparent;
}
#soma-root .dash-wrap {
  position: relative; z-index: 2; margin-top: 52px;
  opacity: 0; animation: fadeUp 1.1s .9s cubic-bezier(.22,1,.36,1) forwards;
}
#soma-root .dash-fade {
  position: absolute; bottom: 0; left: 0; right: 0; height: 200px;
  background: linear-gradient(to top, var(--bg), transparent);
  z-index: 3; pointer-events: none;
}
#soma-root .dash-screen {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-bottom: none; border-radius: 16px 16px 0 0; overflow: hidden;
}
#soma-root .dash-bar {
  background: rgba(255,255,255,0.04);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 14px 20px; display: flex; align-items: center; gap: 10px;
}
#soma-root .dash-dots { display: flex; gap: 6px; }
#soma-root .dash-dot { width: 10px; height: 10px; border-radius: 50%; }
#soma-root .dd1 { background: #ff5f57; }
#soma-root .dd2 { background: #ffbd2e; }
#soma-root .dd3 { background: #28c840; }
#soma-root .dash-url {
  flex: 1; background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08); border-radius: 6px;
  padding: 6px 14px; font-size: .72rem; color: var(--muted);
}
#soma-root .dash-body { display: grid; grid-template-columns: 220px 1fr; min-height: 400px; }
#soma-root .dash-sidebar {
  border-right: 1px solid rgba(255,255,255,0.06);
  padding: 24px 16px; display: flex; flex-direction: column; gap: 4px;
}
#soma-root .dash-logo {
  font-family: 'Syne', sans-serif; font-weight: 800; font-size: .82rem;
  color: var(--ink); margin-bottom: 16px; padding: 0 8px;
  display: flex; align-items: center; gap: 7px;
}
#soma-root .dash-logo-dot { width: 7px; height: 7px; background: var(--grn); border-radius: 50%; box-shadow: 0 0 8px var(--grn); }
#soma-root .nav-item { padding: 9px 12px; border-radius: 8px; font-size: .78rem; color: var(--muted); display: flex; align-items: center; gap: 10px; cursor: pointer; }
#soma-root .nav-item.on { background: rgba(0,232,154,0.08); color: var(--ink); border: 1px solid rgba(0,232,154,0.15); }
#soma-root .ni-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.15); flex-shrink: 0; }
#soma-root .nav-item.on .ni-dot { background: var(--grn); box-shadow: 0 0 6px var(--grn); }

#soma-root .dash-main { padding: 28px 32px; }
#soma-root .dash-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; }
#soma-root .dash-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; letter-spacing: -.01em; }
#soma-root .dash-live { background: rgba(0,232,154,0.1); border: 1px solid rgba(0,232,154,0.25); color: var(--grn); font-size: .62rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 5px 12px; border-radius: 100px; display: flex; align-items: center; gap: 6px; }
#soma-root .dlb-dot { width: 5px; height: 5px; background: var(--grn); border-radius: 50%; animation: pulse 1.5s infinite; }

/* SOAP cards */
#soma-root .aa-box { background: linear-gradient(135deg,rgba(0,232,154,0.07),rgba(0,232,154,0.02)); border: 1px solid rgba(0,232,154,0.18); border-radius: 10px; padding: 16px 20px; display: flex; gap: 14px; }
#soma-root .aa-av { width: 32px; height: 32px; background: linear-gradient(135deg,var(--grn),#00b876); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: .9rem; flex-shrink: 0; }
#soma-root .aa-l { font-size: .6rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--grn); margin-bottom: 5px; }
#soma-root .aa-t { font-size: .76rem; line-height: 1.55; color: var(--muted); }
#soma-root .aa-t b { color: var(--ink); font-weight: 500; }

/* Waveform */
#soma-root .waveform { height: 40px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden; display: flex; align-items: center; padding: 0 16px; gap: 2px; }
#soma-root .wbar { border-radius: 2px; background: var(--grn); opacity: .55; flex-shrink: 0; width: 3px; animation: wv 1.2s ease-in-out infinite alternate; }

/* Marquee */
#soma-root .mq-wrap { overflow: hidden; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 14px 0; background: rgba(255,255,255,0.015); }
#soma-root .mq-track { display: flex; width: max-content; animation: march 30s linear infinite; }
#soma-root .mq-item { white-space: nowrap; padding: 0 28px; font-family: 'Syne', sans-serif; font-size: .67rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: rgba(240,237,232,0.22); }
#soma-root .mq-item .s { color: var(--grn); }

/* Sections */
#soma-root .sec { padding: clamp(80px,10vw,140px) var(--r); }
#soma-root .sec-tag { display: flex; align-items: center; gap: 12px; font-family: 'Syne', sans-serif; font-size: .67rem; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: var(--blue); margin-bottom: 20px; }
#soma-root .sec-tag::before { content: ''; display: block; width: 24px; height: 1.5px; background: var(--blue); box-shadow: 0 0 8px var(--blue-glow); }
#soma-root .sec-h { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(2.6rem,5.5vw,5.5rem); line-height: .88; letter-spacing: -.045em; }
#soma-root .sec-h .out { -webkit-text-stroke: 1.5px rgba(240,237,232,0.22); color: transparent; }
#soma-root .sec-h .g { color: var(--blue); }
#soma-root .sec-sub { font-size: 1rem; line-height: 1.8; color: var(--muted); max-width: 460px; margin-top: 20px; }

/* Scroll reveal */
#soma-root .rv { opacity: 0; transform: translateY(40px); transition: opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1); }
#soma-root .rv.in { opacity: 1; transform: none; }
#soma-root .rv.d1 { transition-delay: .1s; }
#soma-root .rv.d2 { transition-delay: .2s; }
#soma-root .rv.d3 { transition-delay: .3s; }
#soma-root .rv.d4 { transition-delay: .4s; }

/* Problem section */
#soma-root #problem { border-top: 1px solid rgba(255,255,255,0.06); }
#soma-root .prob-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); margin-top: 60px; }
#soma-root .prob-card { background: var(--bg); padding: 48px 36px; transition: background .3s; }
#soma-root .prob-card:hover { background: rgba(255,255,255,0.025); }
#soma-root .prob-n { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 4.5rem; color: var(--blue); letter-spacing: -.04em; line-height: 1; text-shadow: 0 0 60px var(--blue-glow); margin-bottom: 12px; }
#soma-root .prob-l { font-size: .67rem; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
#soma-root .prob-d { font-size: .92rem; line-height: 1.7; color: rgba(240,237,232,0.5); }
#soma-root .prob-full { grid-column: 1/-1; background: rgba(0,232,154,0.05); border-top: 1px solid rgba(0,232,154,0.12); padding: 36px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
#soma-root .prob-full-t { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(1.2rem,2.5vw,2rem); letter-spacing: -.03em; }
#soma-root .ptags { display: flex; gap: 10px; flex-wrap: wrap; }
#soma-root .ptag { background: rgba(0,232,154,0.08); border: 1px solid rgba(0,232,154,0.18); color: var(--grn); font-size: .67rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; padding: 8px 16px; border-radius: 100px; }

/* Features */
#soma-root #features { border-top: 1px solid rgba(255,255,255,0.06); }
#soma-root .feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); margin-top: 60px; }
#soma-root .feat-card { background: var(--bg); padding: 44px 36px; position: relative; overflow: hidden; transition: background .25s; }
#soma-root .feat-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg,rgba(0,232,154,0.06),transparent); opacity: 0; transition: opacity .3s; }
#soma-root .feat-card:hover { background: rgba(255,255,255,0.02); }
#soma-root .feat-card:hover::before { opacity: 1; }
#soma-root .feat-row2 { border-top: 1px solid rgba(255,255,255,0.06); }
#soma-root .feat-ico { font-size: 1.5rem; margin-bottom: 20px; }
#soma-root .feat-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; letter-spacing: -.01em; margin-bottom: 10px; }
#soma-root .feat-desc { font-size: .86rem; line-height: 1.7; color: var(--muted); }
#soma-root .feat-live { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,232,154,0.08); border: 1px solid rgba(0,232,154,0.22); color: var(--grn); font-size: .6rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 5px 12px; border-radius: 100px; margin-top: 16px; }
#soma-root .feat-live-dot { width: 5px; height: 5px; background: var(--grn); border-radius: 50%; animation: pulse 2s infinite; }

/* Dashboard section */
#soma-root #ds-sec { border-top: 1px solid rgba(255,255,255,0.06); padding: clamp(80px,10vw,140px) var(--r); overflow: hidden; }
#soma-root .ds-hd { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 60px; flex-wrap: wrap; gap: 24px; }
#soma-root .ds-wrap { position: relative; }
#soma-root .ds-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 70%; height: 60%; background: radial-gradient(ellipse,rgba(0,232,154,0.07) 0%,transparent 70%); pointer-events: none; }
#soma-root .ds-screen { position: relative; z-index: 1; background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.09); border-radius: 20px; overflow: hidden; }
#soma-root .ds-bar2 { background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 16px 24px; display: flex; align-items: center; gap: 10px; }
#soma-root .ds-inner { display: grid; grid-template-columns: 240px 1fr 280px; min-height: 520px; }
#soma-root .ds-side { border-right: 1px solid rgba(255,255,255,0.05); padding: 28px 20px; }
#soma-root .ds-side-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: .88rem; margin-bottom: 28px; display: flex; align-items: center; gap: 8px; color: var(--ink); }
#soma-root .ds-sld { width: 8px; height: 8px; background: var(--grn); border-radius: 50%; box-shadow: 0 0 10px var(--grn); }
#soma-root .ds-ni { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px; font-size: .8rem; color: var(--muted); margin-bottom: 2px; }
#soma-root .ds-ni.on { background: rgba(0,232,154,0.08); color: var(--ink); border: 1px solid rgba(0,232,154,0.14); }
#soma-root .ds-ni-ico { font-size: .9rem; width: 18px; text-align: center; }
#soma-root .ds-center { padding: 32px 36px; }
#soma-root .ds-ct { display: flex; justify-content: space-between; align-items: center; margin-bottom: 26px; }
#soma-root .ds-cth { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.05rem; letter-spacing: -.01em; }
#soma-root .ds-rec { background: rgba(0,232,154,0.08); border: 1px solid rgba(0,232,154,0.22); color: var(--grn); font-size: .62rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 6px 14px; border-radius: 100px; display: flex; align-items: center; gap: 7px; }
#soma-root .ds-rec-dot { width: 6px; height: 6px; background: #ff4040; border-radius: 50%; animation: pulse 1s infinite; }
#soma-root .ds-sg { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; }
#soma-root .ds-sc { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 18px; }
#soma-root .ds-sl { font-size: .6rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--grn); margin-bottom: 8px; }
#soma-root .ds-st { font-size: .78rem; line-height: 1.6; color: var(--muted); }
#soma-root .ds-st b { color: var(--ink); font-weight: 500; }
#soma-root .ds-aa { background: linear-gradient(135deg,rgba(0,232,154,0.07),rgba(0,232,154,0.02)); border: 1px solid rgba(0,232,154,0.18); border-radius: 12px; padding: 18px 22px; display: flex; gap: 14px; }
#soma-root .ds-aa-av { width: 36px; height: 36px; background: linear-gradient(135deg,var(--grn),#00b876); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
#soma-root .ds-aa-l { font-size: .6rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--grn); margin-bottom: 5px; }
#soma-root .ds-aa-t { font-size: .78rem; line-height: 1.55; color: var(--muted); }
#soma-root .ds-aa-t b { color: var(--ink); font-weight: 500; }
#soma-root .ds-wv { margin-top: 18px; height: 44px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; display: flex; align-items: center; padding: 0 18px; gap: 3px; }
#soma-root .ds-right { border-left: 1px solid rgba(255,255,255,0.05); padding: 28px 24px; }
#soma-root .ds-rt { font-family: 'Syne', sans-serif; font-weight: 700; font-size: .82rem; letter-spacing: -.01em; margin-bottom: 18px; color: var(--muted); }
#soma-root .ds-pat { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 14px; margin-bottom: 10px; }
#soma-root .ds-pn { font-family: 'Syne', sans-serif; font-weight: 700; font-size: .82rem; margin-bottom: 4px; }
#soma-root .ds-pi { font-size: .7rem; color: var(--muted); line-height: 1.5; }
#soma-root .ds-ptag { display: inline-block; background: rgba(0,232,154,0.08); color: var(--grn); font-size: .58rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; padding: 3px 8px; border-radius: 100px; margin-top: 8px; }
#soma-root .ds-metric { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
#soma-root .ds-metric:last-child { border-bottom: none; }
#soma-root .ds-ml { font-size: .72rem; color: var(--muted); }
#soma-root .ds-mv { font-family: 'Syne', sans-serif; font-weight: 700; font-size: .88rem; color: var(--grn); }

/* How */
#soma-root #how { background: rgba(255,255,255,0.015); border-top: 1px solid rgba(255,255,255,0.06); }
#soma-root .how-grid { display: grid; gap: 1px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); margin-top: 60px; }
#soma-root .how-card { background: rgba(8,8,8,1); padding: 44px 32px; transition: background .25s; }
#soma-root .how-card:hover { background: rgba(255,255,255,0.02); }
#soma-root .how-n { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 4rem; color: rgba(255,255,255,0.04); line-height: 1; letter-spacing: -.05em; margin-bottom: 20px; }
#soma-root .how-t { font-family: 'Syne', sans-serif; font-weight: 700; font-size: .98rem; letter-spacing: -.01em; margin-bottom: 12px; }
#soma-root .how-d { font-size: .86rem; line-height: 1.7; color: var(--muted); }

/* Roadmap */
#soma-root #roadmap { border-top: 1px solid rgba(255,255,255,0.06); }
#soma-root .road-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); margin-top: 60px; }
#soma-root .road-card { background: var(--bg); padding: 44px 32px; position: relative; transition: background .3s; }
#soma-root .road-card:hover { background: rgba(255,255,255,0.02); }
#soma-root .road-phase { font-size: .62rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
#soma-root .road-t { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; letter-spacing: -.01em; margin-bottom: 16px; line-height: 1.2; }
#soma-root .road-live { position: absolute; top: 18px; right: 18px; background: rgba(59,158,255,0.1); border: 1px solid rgba(59,158,255,0.3); color: var(--blue); font-size: .58rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 5px 11px; border-radius: 100px; }
#soma-root .road-items { list-style: none; display: flex; flex-direction: column; gap: 8px; }
#soma-root .road-items li { font-size: .8rem; line-height: 1.5; color: rgba(240,237,232,0.4); padding-left: 14px; position: relative; }
#soma-root .road-items li::before { content: '→'; position: absolute; left: 0; color: var(--grn); font-size: .68rem; }
#soma-root .road-date { font-size: .62rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: rgba(240,237,232,0.16); margin-top: 20px; }

/* Investors */
#soma-root #investors { border-top: 1px solid rgba(255,255,255,0.06); }
#soma-root .inv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-top: 60px; align-items: start; }
#soma-root .inv-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); }
#soma-root .inv-stat { background: var(--bg); padding: 40px 32px; transition: background .25s; }
#soma-root .inv-stat:hover { background: rgba(255,255,255,0.02); }
#soma-root .inv-n { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 3rem; letter-spacing: -.04em; color: var(--blue); text-shadow: 0 0 40px var(--blue-glow); line-height: 1; }
#soma-root .inv-l { font-size: .67rem; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin-top: 8px; }
#soma-root .why-list { display: flex; flex-direction: column; }
#soma-root .why-item { display: flex; gap: 20px; padding: 24px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
#soma-root .why-item:first-child { border-top: 1px solid rgba(255,255,255,0.06); }
#soma-root .why-n { font-family: 'Syne', sans-serif; font-weight: 700; font-size: .82rem; color: var(--blue); flex-shrink: 0; width: 28px; }
#soma-root .why-t { font-family: 'Syne', sans-serif; font-weight: 700; font-size: .92rem; margin-bottom: 5px; }
#soma-root .why-d { font-size: .84rem; line-height: 1.65; color: var(--muted); }
#soma-root .deck-link { display: inline-flex; align-items: center; gap: 10px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: .88rem; background: var(--blue); color: #fff; padding: 15px 32px; border-radius: 100px; text-decoration: none; margin-top: 36px; transition: background .2s, transform .15s, box-shadow .2s; }
#soma-root .deck-link:hover { background: var(--blue2); transform: translateY(-3px); box-shadow: 0 12px 40px var(--blue-glow); }

/* CTA */
#soma-root #cta { border-top: 1px solid rgba(255,255,255,0.06); text-align: center; padding: clamp(80px,10vw,140px) var(--r); }
#soma-root .cta-h { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(3.5rem,8vw,8.5rem); line-height: .88; letter-spacing: -.05em; margin: 28px 0; }
#soma-root .cta-h .out { -webkit-text-stroke: clamp(1px,.15vw,2px) rgba(240,237,232,0.22); color: transparent; }
#soma-root .cta-h .g { color: var(--blue); text-shadow: 0 0 100px var(--blue-glow); }
#soma-root .cta-sub { font-size: 1rem; line-height: 1.8; color: var(--muted); max-width: 440px; margin: 0 auto 44px; }
#soma-root .cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
#soma-root .cta-b1 { font-family: 'Syne', sans-serif; font-size: .92rem; font-weight: 700; background: var(--blue); color: #fff; padding: 17px 38px; border-radius: 100px; text-decoration: none; transition: background .2s, transform .15s, box-shadow .2s; }
#soma-root .cta-b1:hover { background: var(--blue2); transform: translateY(-3px); box-shadow: 0 16px 48px var(--blue-glow); }
#soma-root .cta-b2 { font-family: 'Syne', sans-serif; font-size: .92rem; font-weight: 700; background: transparent; color: var(--ink); padding: 16px 34px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.14); text-decoration: none; transition: border-color .2s, transform .15s; }
#soma-root .cta-b2:hover { border-color: rgba(255,255,255,0.4); transform: translateY(-3px); }
#soma-root .cta-note { font-size: .76rem; color: var(--dim); margin-top: 20px; }

/* Footer */
#soma-root footer { background: rgba(255,255,255,0.015); border-top: 1px solid rgba(255,255,255,0.06); padding: 72px var(--r) 40px; }
#soma-root .foot-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 56px; }
#soma-root .foot-brand { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1rem; margin-bottom: 14px; display: flex; align-items: center; gap: 9px; }
#soma-root .foot-tag { font-size: .86rem; line-height: 1.75; color: var(--muted); max-width: 260px; }
#soma-root .foot-col-h { font-family: 'Syne', sans-serif; font-size: .65rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--dim); margin-bottom: 18px; }
#soma-root .foot-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
#soma-root .foot-links a { font-size: .84rem; color: var(--muted); text-decoration: none; transition: color .2s; }
#soma-root .foot-links a:hover { color: var(--ink); }
#soma-root .foot-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.06); flex-wrap: wrap; gap: 12px; }
#soma-root .foot-copy { font-size: .76rem; color: var(--dim); }
#soma-root .foot-aa { display: flex; align-items: center; gap: 8px; font-size: .76rem; color: var(--dim); }
#soma-root .aa-dot { width: 6px; height: 6px; background: var(--grn); border-radius: 50%; box-shadow: 0 0 6px var(--grn); }

/* ── Keyframes ── */
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
@keyframes wv { 0%{height:3px} 100%{height:28px} }
@keyframes march { from{transform:translateX(0)} to{transform:translateX(-50%)} }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes fadeUp { from{opacity:0;transform:translateY(44px)} to{opacity:1;transform:translateY(0)} }
`
