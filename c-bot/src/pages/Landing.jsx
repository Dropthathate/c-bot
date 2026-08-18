import { useEffect, useRef } from 'react'

export default function Landing() {
  const ref = useRef(null)

  useEffect(() => {
    document.title = 'SomaSyncAI — The Gold Standard Clinical OS for Manual Therapists'

    window.__SOMA_SUPABASE_URL__ = import.meta.env.VITE_SUPABASE_URL || 'https://ucqprtpuuyflnxjmatwo.supabase.co'
    window.__SOMA_SUPABASE_KEY__ = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcXBydHB1dXlmbG54am1hdHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NjMzMjYsImV4cCI6MjA4ODEyMzMyNn0.rU855zMtb1ZFQgLx5aBUdWd5R8mjmLCwEmmx6KuJvwk'

    if (!document.getElementById('soma-fonts')) {
      const link = document.createElement('link')
      link.id = 'soma-fonts'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap'
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
#soma-root, #soma-root *, #soma-root *::before, #soma-root *::after { box-sizing: border-box; }
#soma-root {
  --obsidian: #06080d;
  --panel: #0c1018;
  --panel-2: #101725;
  --line: rgba(182, 210, 255, 0.13);
  --line-bright: rgba(118, 175, 255, 0.34);
  --ink: #f3f6ff;
  --muted: #9ca9bd;
  --blue: #4a9cff;
  --cyan: #61efe1;
  --lime: #a7ff80;
  --danger: #ff6e7e;
  --radius: clamp(22px, 3vw, 34px);
  min-height: 100vh;
  color: var(--ink);
  background: var(--obsidian);
  font-family: 'Manrope', sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
#soma-root .ambient, #soma-root .grid { position: fixed; inset: 0; pointer-events: none; }
#soma-root .ambient {
  z-index: 0;
  background:
    radial-gradient(ellipse 55% 45% at 50% -8%, rgba(74, 156, 255, .22), transparent 70%),
    radial-gradient(ellipse 35% 40% at 5% 68%, rgba(97, 239, 225, .09), transparent 75%),
    radial-gradient(ellipse 45% 35% at 95% 84%, rgba(96, 111, 255, .11), transparent 75%);
}
#soma-root .grid {
  z-index: 0;
  opacity: .32;
  background-image: linear-gradient(rgba(130, 178, 255, .08) 1px, transparent 1px), linear-gradient(90deg, rgba(130, 178, 255, .08) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(circle at var(--px, 50%) var(--py, 20%), black 0%, transparent 65%);
}
#soma-root a { color: inherit; }
#soma-root .shell { position: relative; z-index: 1; }
#soma-root nav {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 25px clamp(22px, 5vw, 84px);
  transition: .3s ease;
}
#soma-root nav.stuck {
  padding-top: 13px;
  padding-bottom: 13px;
  background: rgba(6, 8, 13, .78);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(18px);
}
#soma-root .brand { display: inline-flex; align-items: center; text-decoration: none; }
#soma-root .brand img { width: auto; height: 34px; filter: drop-shadow(0 0 16px rgba(74,156,255,.45)); }
#soma-root .nav-links { display: flex; gap: 3px; padding: 4px; border: 1px solid var(--line); background: rgba(13, 18, 28, .66); border-radius: 999px; }
#soma-root .nav-links a { color: var(--muted); text-decoration: none; font-size: .76rem; font-weight: 700; padding: 9px 15px; border-radius: 999px; transition: .2s ease; }
#soma-root .nav-links a:hover { color: var(--ink); background: rgba(255,255,255,.08); }
#soma-root .nav-cta, #soma-root .button-primary { display: inline-flex; align-items: center; justify-content: center; text-decoration: none; border: 0; color: #05101a; background: linear-gradient(135deg, var(--cyan), var(--blue)); font-family: inherit; font-size: .78rem; font-weight: 800; padding: 12px 19px; border-radius: 999px; cursor: pointer; box-shadow: 0 8px 30px rgba(74,156,255,.22); transition: transform .2s ease, box-shadow .2s ease; }
#soma-root .nav-cta:hover, #soma-root .button-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 38px rgba(74,156,255,.36); }
#soma-root .button-secondary { display: inline-flex; align-items: center; justify-content: center; padding: 12px 19px; color: var(--ink); border: 1px solid var(--line-bright); background: rgba(255,255,255,.025); border-radius: 999px; text-decoration: none; font-size: .78rem; font-weight: 800; transition: .2s ease; }
#soma-root .button-secondary:hover { border-color: var(--cyan); background: rgba(97,239,225,.08); }
#soma-root section { position: relative; z-index: 1; padding: 130px clamp(22px, 7vw, 112px); }
#soma-root .eyebrow { display: inline-flex; align-items: center; gap: 10px; color: var(--cyan); font-family: 'DM Mono', monospace; font-size: .68rem; font-weight: 500; letter-spacing: .11em; text-transform: uppercase; }
#soma-root .eyebrow::before { content: ''; width: 26px; height: 1px; background: currentColor; box-shadow: 0 0 12px currentColor; }
#soma-root .eyebrow.dot::after { content: ''; width: 7px; height: 7px; background: var(--lime); border-radius: 50%; box-shadow: 0 0 12px var(--lime); animation: somaPulse 1.5s infinite; }
#soma-root .section-heading { max-width: 800px; margin: 20px 0 20px; font-family: 'Syne', sans-serif; font-size: clamp(2.8rem, 6.2vw, 6.4rem); line-height: .91; letter-spacing: -.065em; }
#soma-root .section-heading .blue { color: var(--blue); text-shadow: 0 0 46px rgba(74,156,255,.3); }
#soma-root .section-heading .outline { color: transparent; -webkit-text-stroke: 1px rgba(243,246,255,.35); }
#soma-root .section-copy { max-width: 610px; color: var(--muted); font-size: 1rem; line-height: 1.8; }
#soma-root .hero { min-height: 100vh; display: grid; align-content: center; padding-top: 155px; overflow: hidden; }
#soma-root .hero-layout { display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(330px, .92fr); gap: clamp(42px, 7vw, 120px); align-items: center; }
#soma-root .hero-title { margin: 22px 0 24px; max-width: 880px; font-family: 'Syne', sans-serif; font-size: clamp(4.15rem, 8.5vw, 9rem); line-height: .78; letter-spacing: -.085em; }
#soma-root .hero-title .stroke { display: block; color: transparent; -webkit-text-stroke: 1px rgba(243,246,255,.38); }
#soma-root .hero-title .electric { display: block; color: var(--blue); text-shadow: 0 0 64px rgba(74,156,255,.42); }
#soma-root .hero-sub { max-width: 550px; margin: 28px 0; color: var(--muted); font-size: clamp(.96rem, 1.5vw, 1.14rem); line-height: 1.75; }
#soma-root .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; }
#soma-root .stats { display: flex; gap: 24px; margin-top: 56px; }
#soma-root .stat { padding-right: 24px; border-right: 1px solid var(--line); }
#soma-root .stat:last-child { border: 0; padding: 0; }
#soma-root .stat strong { display: block; font-family: 'Syne', sans-serif; font-size: 2rem; line-height: 1; letter-spacing: -.07em; }
#soma-root .stat strong span { color: var(--lime); }
#soma-root .stat small { display: block; margin-top: 7px; color: var(--muted); font-family: 'DM Mono', monospace; font-size: .58rem; letter-spacing: .13em; text-transform: uppercase; }
#soma-root .product-frame { position: relative; padding: 1px; background: linear-gradient(140deg, rgba(97,239,225,.62), rgba(74,156,255,.08) 28%, rgba(74,156,255,.54)); border-radius: 28px; box-shadow: 0 35px 100px rgba(0,0,0,.42), 0 0 90px rgba(74,156,255,.16); transform: perspective(1200px) rotateY(-5deg) rotateX(3deg); }
#soma-root .product-frame::before { content: ''; position: absolute; inset: -35% -20%; z-index: -1; background: radial-gradient(circle, rgba(97,239,225,.16), transparent 65%); filter: blur(20px); }
#soma-root .product { overflow: hidden; padding: 16px; background: linear-gradient(160deg, #101827, #090d15); border-radius: 27px; }
#soma-root .window-bar { display: flex; align-items: center; gap: 8px; padding: 3px 4px 16px; }
#soma-root .window-bar i { width: 8px; height: 8px; border-radius: 50%; background: #ff8b96; }
#soma-root .window-bar i:nth-child(2) { background: #ffd979; }
#soma-root .window-bar i:nth-child(3) { background: var(--lime); }
#soma-root .window-name { margin-left: auto; color: #66758d; font-family: 'DM Mono', monospace; font-size: .56rem; letter-spacing: .09em; }
#soma-root .screen { padding: 20px; border: 1px solid rgba(151,192,255,.12); background: linear-gradient(155deg, rgba(255,255,255,.045), rgba(255,255,255,.012)); border-radius: 18px; }
#soma-root .screen-top { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
#soma-root .screen-brand { display: flex; align-items: center; gap: 8px; color: #f4f7ff; font-family: 'Syne', sans-serif; font-size: .72rem; font-weight: 800; }
#soma-root .screen-mark { width: 19px; height: 19px; border-radius: 6px; background: linear-gradient(135deg, var(--cyan), var(--blue)); }
#soma-root .live-tag { display: inline-flex; align-items: center; gap: 6px; padding: 6px 9px; color: var(--lime); background: rgba(167,255,128,.08); border: 1px solid rgba(167,255,128,.18); border-radius: 999px; font-family: 'DM Mono', monospace; font-size: .52rem; letter-spacing: .09em; }
#soma-root .live-tag::before { content: ''; width: 5px; height: 5px; background: var(--lime); border-radius: 50%; box-shadow: 0 0 8px var(--lime); }
#soma-root .recording { margin: 22px 0 14px; padding: 14px; border: 1px solid rgba(97,239,225,.15); background: linear-gradient(135deg, rgba(97,239,225,.08), rgba(74,156,255,.035)); border-radius: 13px; }
#soma-root .recording strong { display: block; margin-bottom: 8px; font-size: .68rem; }
#soma-root .wave { display: flex; height: 27px; align-items: center; gap: 3px; }
#soma-root .wave b { width: 3px; height: 30%; background: var(--cyan); border-radius: 3px; opacity: .7; animation: wave 1.1s ease-in-out infinite alternate; }
#soma-root .wave b:nth-child(2n) { animation-delay: .23s; } #soma-root .wave b:nth-child(3n) { animation-delay: .5s; }
#soma-root .notes { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
#soma-root .note { min-height: 83px; padding: 11px; border: 1px solid rgba(151,192,255,.11); background: rgba(255,255,255,.025); border-radius: 11px; }
#soma-root .note span { display: block; margin-bottom: 7px; color: var(--cyan); font-family: 'DM Mono', monospace; font-size: .5rem; letter-spacing: .1em; }
#soma-root .note p { color: #9daac0; font-size: .62rem; line-height: 1.45; }
#soma-root .marquee { display: flex; gap: 44px; overflow: hidden; padding: 15px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: rgba(255,255,255,.018); white-space: nowrap; color: #78879e; font-family: 'DM Mono', monospace; font-size: .61rem; letter-spacing: .15em; text-transform: uppercase; }
#soma-root .marquee span { display: inline-flex; align-items: center; gap: 44px; }
#soma-root .marquee b { color: var(--cyan); font-weight: 500; }
#soma-root .feature-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1px; margin-top: 62px; background: var(--line); border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; }
#soma-root .feature { position: relative; min-height: 265px; padding: 31px 26px; background: rgba(8,11,18,.96); transition: background .25s ease; }
#soma-root .feature:hover { background: #101a2a; }
#soma-root .feature-index { display: block; margin-bottom: 44px; color: var(--blue); font-family: 'DM Mono', monospace; font-size: .68rem; }
#soma-root .feature h3, #soma-root .road-card h3 { margin: 0 0 10px; font-family: 'Syne', sans-serif; font-size: .93rem; line-height: 1.2; }
#soma-root .feature p, #soma-root .road-card li { margin: 0; color: var(--muted); font-size: .79rem; line-height: 1.65; }
#soma-root .feature-live { position: absolute; bottom: 24px; left: 26px; color: var(--lime); font-family: 'DM Mono', monospace; font-size: .54rem; letter-spacing: .08em; text-transform: uppercase; }
#soma-root .workflow { background: linear-gradient(180deg, transparent, rgba(74,156,255,.045), transparent); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
#soma-root .workflow-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 58px; }
#soma-root .step { position: relative; padding: 28px; border: 1px solid var(--line); background: rgba(255,255,255,.025); border-radius: 20px; }
#soma-root .step-number { display: flex; width: 42px; height: 42px; align-items: center; justify-content: center; margin-bottom: 45px; color: var(--cyan); border: 1px solid rgba(97,239,225,.28); border-radius: 50%; font-family: 'DM Mono', monospace; font-size: .65rem; }
#soma-root .step h3 { font-family: 'Syne', sans-serif; font-size: 1rem; margin: 0 0 10px; }
#soma-root .step p { margin: 0; color: var(--muted); font-size: .82rem; line-height: 1.7; }
#soma-root .roadmap-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 58px; }
#soma-root .road-card { position: relative; padding: 32px 25px 27px; border: 1px solid var(--line); border-radius: 20px; background: rgba(255,255,255,.025); }
#soma-root .road-card.live { border-color: rgba(97,239,225,.35); background: linear-gradient(160deg, rgba(97,239,225,.105), rgba(74,156,255,.03)); }
#soma-root .phase { display: block; margin-bottom: 15px; color: var(--muted); font-family: 'DM Mono', monospace; font-size: .61rem; letter-spacing: .1em; text-transform: uppercase; }
#soma-root .road-card.live .phase { color: var(--cyan); }
#soma-root .road-card ul { padding: 0; margin: 19px 0 0; list-style: none; }
#soma-root .road-card li { position: relative; padding-left: 12px; margin-bottom: 7px; }
#soma-root .road-card li::before { content: '—'; position: absolute; left: 0; color: var(--cyan); }
#soma-root .investor-layout { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(270px, .75fr); gap: clamp(35px, 7vw, 100px); margin-top: 55px; }
#soma-root .thesis { display: grid; gap: 1px; border: 1px solid var(--line); border-radius: 20px; overflow: hidden; }
#soma-root .thesis-item { display: grid; grid-template-columns: 48px 1fr; gap: 14px; padding: 27px; background: rgba(255,255,255,.023); }
#soma-root .thesis-index { color: var(--blue); font-family: 'DM Mono', monospace; font-size: .68rem; }
#soma-root .thesis h3 { margin: 0 0 7px; font-family: 'Syne', sans-serif; font-size: .98rem; }
#soma-root .thesis p { margin: 0; color: var(--muted); font-size: .83rem; line-height: 1.65; }
#soma-root .investor-card { padding: 35px; border: 1px solid var(--line-bright); border-radius: 24px; background: linear-gradient(150deg, rgba(74,156,255,.14), rgba(255,255,255,.025)); }
#soma-root .investor-card small { color: var(--cyan); font-family: 'DM Mono', monospace; font-size: .6rem; letter-spacing: .13em; text-transform: uppercase; }
#soma-root .investor-metric { padding: 27px 0; border-bottom: 1px solid var(--line); }
#soma-root .investor-metric:last-of-type { border: 0; }
#soma-root .investor-metric strong { display: block; color: var(--blue); font-family: 'Syne', sans-serif; font-size: 3.4rem; line-height: .9; letter-spacing: -.075em; }
#soma-root .investor-metric span { display: block; margin-top: 8px; color: var(--muted); font-size: .78rem; }
#soma-root .deck-link { display: inline-flex; gap: 9px; align-items: center; margin-top: 30px; color: var(--ink); font-size: .8rem; font-weight: 800; text-decoration: none; }
#soma-root .deck-link::after { content: '↗'; color: var(--cyan); font-size: 1rem; }
#soma-root .cta { text-align: center; }
#soma-root .cta-box { max-width: 970px; margin: 0 auto; padding: clamp(38px, 7vw, 80px); border: 1px solid var(--line-bright); border-radius: 32px; background: radial-gradient(circle at 50% 0%, rgba(74,156,255,.22), transparent 60%), rgba(255,255,255,.022); }
#soma-root .cta .section-heading { margin-left: auto; margin-right: auto; }
#soma-root .cta .section-copy { margin: 0 auto 32px; }
#soma-root .signup { display: flex; max-width: 510px; gap: 8px; margin: 0 auto; padding: 7px; border: 1px solid var(--line); border-radius: 999px; background: rgba(5,8,13,.7); }
#soma-root .signup input { min-width: 0; flex: 1; padding: 0 16px; color: var(--ink); border: 0; outline: 0; background: transparent; font: 500 .87rem 'Manrope', sans-serif; }
#soma-root .signup input::placeholder { color: #78869a; }
#soma-root #lead-msg { min-height: 22px; margin-top: 16px; color: var(--muted); font-size: .8rem; }
#soma-root footer { position: relative; z-index: 1; padding: 72px clamp(22px, 7vw, 112px) 35px; border-top: 1px solid var(--line); background: rgba(255,255,255,.015); }
#soma-root .footer-grid { display: grid; grid-template-columns: 2fr repeat(3, 1fr); gap: 42px; }
#soma-root .footer-brand img { height: 27px; width: auto; margin-bottom: 16px; }
#soma-root .footer-brand p { max-width: 270px; color: var(--muted); font-size: .82rem; line-height: 1.7; }
#soma-root .footer-column h4 { margin: 0 0 16px; color: #6e7d92; font-family: 'DM Mono', monospace; font-size: .61rem; letter-spacing: .12em; text-transform: uppercase; }
#soma-root .footer-column a { display: block; margin: 9px 0; color: var(--muted); font-size: .8rem; text-decoration: none; }
#soma-root .footer-column a:hover { color: var(--ink); }
#soma-root .footer-bottom { display: flex; justify-content: space-between; gap: 16px; margin-top: 55px; padding-top: 23px; border-top: 1px solid var(--line); color: #69778b; font-family: 'DM Mono', monospace; font-size: .61rem; letter-spacing: .04em; }
#soma-root .footer-status { display: inline-flex; align-items: center; gap: 8px; }
#soma-root .footer-status::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--lime); box-shadow: 0 0 9px var(--lime); }
#soma-root .reveal { opacity: 0; transform: translateY(24px); transition: opacity .65s ease, transform .65s ease; }
#soma-root .reveal.show { opacity: 1; transform: none; }
@keyframes somaPulse { 50% { opacity: .35; transform: scale(.75); } }
@keyframes wave { from { height: 24%; } to { height: 100%; } }
@media (max-width: 1120px) { #soma-root .feature-grid { grid-template-columns: repeat(3, 1fr); } #soma-root .roadmap-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 900px) { #soma-root .hero-layout, #soma-root .investor-layout { grid-template-columns: 1fr; } #soma-root .product-frame { max-width: 620px; width: 100%; margin: 0 auto; transform: none; } #soma-root .workflow-grid { grid-template-columns: repeat(2, 1fr); } #soma-root .footer-grid { grid-template-columns: 1.7fr 1fr 1fr; } #soma-root .footer-brand { grid-column: 1 / -1; } }
@media (max-width: 680px) { #soma-root nav { padding: 17px 20px; } #soma-root .brand img { height: 27px; } #soma-root .nav-links { display: none; } #soma-root .nav-cta { padding: 10px 13px; font-size: .7rem; } #soma-root section { padding: 90px 22px; } #soma-root .hero { padding-top: 125px; } #soma-root .hero-title { font-size: clamp(3.65rem, 16vw, 5.5rem); } #soma-root .stats { gap: 13px; margin-top: 38px; } #soma-root .stat { padding-right: 13px; } #soma-root .stat strong { font-size: 1.55rem; } #soma-root .feature-grid, #soma-root .workflow-grid, #soma-root .roadmap-grid { grid-template-columns: 1fr; } #soma-root .feature { min-height: 215px; } #soma-root .feature-index { margin-bottom: 26px; } #soma-root .screen { padding: 14px; } #soma-root .investor-card { padding: 26px; } #soma-root .signup { flex-direction: column; border-radius: 18px; padding: 11px; } #soma-root .signup input { height: 42px; } #soma-root .signup .button-primary { width: 100%; } #soma-root .footer-grid { grid-template-columns: 1fr 1fr; } #soma-root .footer-bottom { flex-direction: column; } }
`

const HTML = `
<div class="ambient"></div>
<div class="grid"></div>
<div class="shell">
  <nav id="nav">
    <a class="brand" href="#top"><img src="/ss.png" alt="SomaSyncAI" /></a>
    <div class="nav-links">
      <a href="#features">Features</a><a href="#roadmap">Roadmap</a><a href="#workflow">Workflow</a><a href="#investors">Investors</a>
    </div>
    <a class="nav-cta" href="/login">Join Beta — Free</a>
  </nav>

  <section class="hero" id="top">
    <div class="hero-layout">
      <div>
        <div class="eyebrow dot reveal">Now in Beta — Limited Access</div>
        <h1 class="hero-title reveal">THE <span class="stroke">GOLD</span><span class="electric">STANDARD</span> CLINICAL <span class="stroke">OS</span></h1>
        <p class="hero-sub reveal">The intelligence of you. A voice-first clinical documentation system created specifically for manual therapy practitioners—so your hands remain on the client, not the keyboard.</p>
        <div class="hero-actions reveal"><a class="button-primary" href="#beta">Request Beta Access</a><a class="button-secondary" href="/investor-pitch.html">View Investor Overview</a></div>
        <div class="stats reveal"><div class="stat"><strong><span>87</span>%</strong><small>Less charting</small></div><div class="stat"><strong><span>100</span>%</strong><small>Hands-free</small></div></div>
      </div>
      <div class="product-frame reveal" aria-label="SomaSyncAI dashboard preview">
        <div class="product"><div class="window-bar"><i></i><i></i><i></i><span class="window-name">SOMASYNC // CLINICAL SESSION</span></div>
          <div class="screen"><div class="screen-top"><div class="screen-brand"><span class="screen-mark"></span>SomaSyncAI</div><div class="live-tag">Session live</div></div>
            <div class="recording"><strong>VOICE CAPTURE ACTIVE</strong><div class="wave"><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b></div></div>
            <div class="notes"><div class="note"><span>SUBJECTIVE</span><p>Reports improved shoulder mobility after the previous session.</p></div><div class="note"><span>OBJECTIVE</span><p>Reduced upper-trap guarding; range improved with guided movement.</p></div><div class="note"><span>ASSESSMENT</span><p>Positive response to soft-tissue work and movement re-education.</p></div><div class="note"><span>PLAN</span><p>Continue current protocol; reassess range at next visit.</p></div></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="marquee"><span><b>VOICE-FIRST CLINICAL DOCUMENTATION</b> · SOAP NOTES · ICD-10 REFERENCE · SESSION HISTORY · PHI SAFEGUARDS · <b>VOICE-FIRST CLINICAL DOCUMENTATION</b> · SOAP NOTES · ICD-10 REFERENCE · SESSION HISTORY · PHI SAFEGUARDS ·</span></div>

  <section id="features">
    <div class="eyebrow reveal">01 / Core capabilities</div>
    <h2 class="section-heading reveal">Everything you need,<br><span class="blue">nothing you don't.</span></h2>
    <p class="section-copy reveal">Purpose-built for manual therapy documentation—not a repurposed generic medical EHR.</p>
    <div class="feature-grid">
      <article class="feature reveal"><span class="feature-index">01</span><h3>Hands-Free Voice Capture</h3><p>Talk naturally during a session—no typing, no pausing to take notes.</p><span class="feature-live">Live in beta</span></article>
      <article class="feature reveal"><span class="feature-index">02</span><h3>AI-Structured SOAP Notes</h3><p>Your session is organized into Subjective, Objective, Assessment, and Plan automatically.</p><span class="feature-live">Live in beta</span></article>
      <article class="feature reveal"><span class="feature-index">03</span><h3>ICD-10 Reference Lookup</h3><p>Search diagnostic codes for reference—always confirmed with the prescribing provider before use.</p></article>
      <article class="feature reveal"><span class="feature-index">04</span><h3>Built-In PHI Safeguards</h3><p>Clear on-screen reminders to keep identifying client details out of AI-processed notes.</p></article>
      <article class="feature reveal"><span class="feature-index">05</span><h3>Session History</h3><p>Every note saved, searchable, and editable—review and refine any past documentation.</p></article>
      <article class="feature reveal"><span class="feature-index">06</span><h3>Minutes, Not Hours</h3><p>Confirm a structured note in seconds instead of typing it from scratch after every session.</p></article>
    </div>
  </section>

  <section class="workflow" id="workflow">
    <div class="eyebrow reveal">02 / Workflow</div>
    <h2 class="section-heading reveal">From session<br><span class="outline">to note.</span></h2>
    <p class="section-copy reveal">Four steps. No charting pile-up at the end of the day.</p>
    <div class="workflow-grid">
      <article class="step reveal"><span class="step-number">01</span><h3>Speak</h3><p>Start a session and talk naturally while you work with your client.</p></article>
      <article class="step reveal"><span class="step-number">02</span><h3>AI Structures It</h3><p>Your session is organized into a standard SOAP note automatically.</p></article>
      <article class="step reveal"><span class="step-number">03</span><h3>Review</h3><p>Every AI draft is reviewed and confirmed by you—your clinical judgment, always.</p></article>
      <article class="step reveal"><span class="step-number">04</span><h3>Done</h3><p>Your note is saved and ready—confirmed in seconds, not typed for minutes.</p></article>
    </div>
  </section>

  <section id="roadmap">
    <div class="eyebrow reveal">03 / Roadmap</div>
    <h2 class="section-heading reveal">Where we're<br><span class="blue">headed.</span></h2>
    <p class="section-copy reveal">Built with practitioners, in the open.</p>
    <div class="roadmap-grid">
      <article class="road-card live reveal"><span class="phase">Phase 1 — Beta / Live now</span><h3>Voice-to-SOAP Documentation</h3><ul><li>Hands-free session recording</li><li>AI-structured SOAP notes</li><li>Reference-only ICD-10 lookup</li></ul></article>
      <article class="road-card reveal"><span class="phase">Phase 2 — Next</span><h3>Analytics & Practice Insights</h3><ul><li>Documentation time savings</li><li>Session trends</li><li>Coding-accuracy tracking</li></ul></article>
      <article class="road-card reveal"><span class="phase">Phase 3 — Planned</span><h3>Technique Library</h3><ul><li>Searchable manual therapy techniques</li><li>Evidence-based references</li></ul></article>
      <article class="road-card reveal"><span class="phase">Phase 4 — Planned</span><h3>Team Accounts</h3><ul><li>Multi-practitioner practices</li><li>Shared client records</li><li>Role-based access</li></ul></article>
    </div>
  </section>

  <section id="investors">
    <div class="eyebrow reveal">04 / Investors</div>
    <h2 class="section-heading reveal">Built for a market<br><span class="blue">no one's served.</span></h2>
    <div class="investor-layout">
      <div class="thesis">
        <article class="thesis-item reveal"><span class="thesis-index">01</span><div><h3>Underserved by generic EHRs</h3><p>Manual therapy has been forced into documentation tools built for physicians, not bodyworkers.</p></div></article>
        <article class="thesis-item reveal"><span class="thesis-index">02</span><div><h3>Voice-first, not form-first</h3><p>Practitioners' hands are on clients, not keyboards—SomaSyncAI is built around that reality.</p></div></article>
        <article class="thesis-item reveal"><span class="thesis-index">03</span><div><h3>Compliance-aware by design</h3><p>Reference-only diagnostic coding and PHI safeguards built in from day one, not bolted on later.</p></div></article>
      </div>
      <aside class="investor-card reveal"><small>At a glance</small><div class="investor-metric"><strong>Beta</strong><span>Currently live</span></div><div class="investor-metric"><strong>4</strong><span>Roadmap phases</span></div><a class="deck-link" href="/investor-pitch.html">View Pitch Deck</a></aside>
    </div>
  </section>

  <section class="cta" id="beta">
    <div class="cta-box reveal"><div class="eyebrow">Join the beta</div><h2 class="section-heading">Chart <span class="blue">less.</span><br>Practice <span class="outline">more.</span></h2><p class="section-copy">Limited access beta. Get early updates and an invite when a spot opens up.</p>
      <form class="signup" id="lead-form"><input id="lead-hp" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px" /><input id="lead-email" type="email" required placeholder="you@practice.com" aria-label="Your email address" /><button class="button-primary" type="submit">Join Beta — Free</button></form><div id="lead-msg" aria-live="polite"></div>
    </div>
  </section>

  <footer>
    <div class="footer-grid"><div class="footer-brand"><img src="/ss.png" alt="SomaSyncAI" /><p>Clinical documentation at the speed of conversation, for manual therapy practitioners.</p></div><div class="footer-column"><h4>Product</h4><a href="#features">Features</a><a href="#workflow">Workflow</a><a href="#roadmap">Roadmap</a></div><div class="footer-column"><h4>Company</h4><a href="#investors">Investors</a><a href="/about.html">About</a></div><div class="footer-column"><h4>Legal</h4><a href="/privacy-policy.html">Privacy</a><a href="/terms-and-conditions.html">Terms</a></div></div>
    <div class="footer-bottom"><span>© 2026 SomaSyncAI. Built for the gold standard practitioner.</span><span class="footer-status">Powered by AALIYAH.IO</span></div>
  </footer>
</div>
`

const JS = `
(() => {
  const nav = document.getElementById('nav')
  window.addEventListener('scroll', () => nav?.classList.toggle('stuck', window.scrollY > 30))
  document.addEventListener('mousemove', (event) => {
    document.documentElement.style.setProperty('--px', (event.clientX / window.innerWidth) * 100 + '%')
    document.documentElement.style.setProperty('--py', (event.clientY / window.innerHeight) * 100 + '%')
  })

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('show') })
  }, { threshold: .11 })
  document.querySelectorAll('#soma-root .reveal').forEach((element) => observer.observe(element))

  const form = document.getElementById('lead-form')
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      if (document.getElementById('lead-hp').value) return
      const email = document.getElementById('lead-email').value.trim()
      const message = document.getElementById('lead-msg')
      const button = form.querySelector('button')
      button.disabled = true
      button.textContent = 'Joining...'
      try {
        const response = await fetch(window.__SOMA_SUPABASE_URL__ + '/rest/v1/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: window.__SOMA_SUPABASE_KEY__, Authorization: 'Bearer ' + window.__SOMA_SUPABASE_KEY__, Prefer: 'return=minimal' },
          body: JSON.stringify({ email })
        })
        if (!response.ok) throw new Error('Lead submission failed')
        message.textContent = "You're on the list — we'll be in touch."
        message.style.color = '#a7ff80'
        form.reset()
      } catch (error) {
        message.textContent = 'Something went wrong — try again in a moment.'
        message.style.color = '#ff6e7e'
      } finally {
        button.disabled = false
        button.textContent = 'Join Beta — Free'
      }
    })
  }
})()
`
