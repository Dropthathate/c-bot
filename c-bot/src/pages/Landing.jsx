import { useEffect, useRef } from 'react'

export default function Landing() {
  const ref = useRef(null)

  useEffect(() => {
    document.title = 'SomaSyncAI — The Gold Standard Clinical OS for Manual Therapists'

    window.__SOMA_API_BASE_URL__ = import.meta.env.VITE_CLINICAL_API_URL || 'http://localhost:4000/api/v1'

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
#soma-root .device-showcase { display:grid; grid-template-columns:minmax(300px,.86fr) minmax(420px,1.14fr); gap:clamp(34px,7vw,90px); align-items:center; border-top:1px solid var(--line); background:linear-gradient(135deg,rgba(97,239,225,.035),rgba(74,156,255,.055),transparent); }
#soma-root .device-copy .section-heading { font-size:clamp(2.7rem,5vw,5.5rem); }
#soma-root .device-steps { display:grid; gap:10px; margin-top:30px; }
#soma-root .device-step { display:grid; grid-template-columns:35px 1fr; gap:12px; align-items:start; padding:14px 0; border-bottom:1px solid var(--line); }
#soma-root .device-step:last-child { border-bottom:0; }
#soma-root .device-step-index { color:var(--cyan); font-family:'DM Mono',monospace; font-size:.66rem; padding-top:3px; }
#soma-root .device-step strong { display:block; margin-bottom:4px; font-size:.87rem; }
#soma-root .device-step p { margin:0; color:var(--muted); font-size:.78rem; line-height:1.65; }
#soma-root .device-image-frame { position:relative; overflow:hidden; padding:1px; border-radius:26px; background:linear-gradient(145deg,rgba(97,239,225,.75),rgba(74,156,255,.12) 40%,rgba(74,156,255,.65)); box-shadow:0 28px 80px rgba(0,0,0,.35),0 0 80px rgba(74,156,255,.18); }
#soma-root .device-image-frame img { display:block; width:100%; aspect-ratio:16/9; object-fit:cover; border-radius:25px; }
#soma-root .device-caption { position:absolute; right:18px; bottom:18px; max-width:250px; padding:13px 15px; color:#dce7ff; border:1px solid rgba(97,239,225,.28); border-radius:14px; background:rgba(5,10,18,.72); backdrop-filter:blur(12px); font-size:.7rem; line-height:1.55; }
#soma-root .device-caption b { display:block; margin-bottom:4px; color:var(--cyan); font-family:'DM Mono',monospace; font-size:.58rem; letter-spacing:.1em; text-transform:uppercase; }
#soma-root .device-note { margin-top:20px; color:#77879e; font-size:.68rem; line-height:1.6; }
#soma-root .impact { overflow:hidden; background:linear-gradient(135deg,rgba(74,156,255,.06),rgba(97,239,225,.035) 46%,transparent); border-top:1px solid var(--line); border-bottom:1px solid var(--line); }
#soma-root .impact-grid { display:grid; grid-template-columns:minmax(0,1.08fr) minmax(300px,.92fr); gap:20px; margin-top:54px; }
#soma-root .calculator-card, #soma-root .impact-report { border:1px solid var(--line); border-radius:24px; background:rgba(9,14,23,.7); }
#soma-root .calculator-card { padding:clamp(24px,3vw,36px); }
#soma-root .calc-head { display:flex; align-items:start; justify-content:space-between; gap:16px; margin-bottom:28px; }
#soma-root .calc-head h3 { margin:0 0 6px; font-family:'Syne',sans-serif; font-size:1.25rem; }
#soma-root .calc-head p { margin:0; color:var(--muted); font-size:.78rem; line-height:1.6; }
#soma-root .calc-live { display:inline-flex; align-items:center; gap:7px; flex:0 0 auto; padding:7px 9px; color:var(--lime); border:1px solid rgba(167,255,128,.22); border-radius:999px; background:rgba(167,255,128,.055); font-family:'DM Mono',monospace; font-size:.53rem; letter-spacing:.08em; text-transform:uppercase; }
#soma-root .calc-live::before { content:''; width:5px; height:5px; border-radius:50%; background:var(--lime); box-shadow:0 0 8px var(--lime); }
#soma-root .calc-control { margin-top:23px; }
#soma-root .calc-label { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:11px; color:#c8d3e4; font-size:.76rem; font-weight:700; }
#soma-root .calc-label b { color:var(--cyan); font-family:'DM Mono',monospace; font-size:.72rem; font-weight:500; }
#soma-root .calc-range { width:100%; accent-color:var(--cyan); cursor:pointer; }
#soma-root .calc-choice { display:flex; flex-wrap:wrap; gap:7px; }
#soma-root .calc-choice button, #soma-root .model-tabs button { min-width:43px; padding:8px 10px; color:var(--muted); border:1px solid var(--line); border-radius:9px; background:rgba(255,255,255,.025); font:700 .66rem 'DM Mono',monospace; cursor:pointer; transition:.18s ease; }
#soma-root .calc-choice button:hover, #soma-root .model-tabs button:hover { color:var(--ink); border-color:rgba(97,239,225,.44); }
#soma-root .calc-choice button.active, #soma-root .model-tabs button.active { color:#061118; border-color:var(--cyan); background:var(--cyan); }
#soma-root .impact-report { position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between; min-height:330px; padding:clamp(25px,4vw,43px); background:radial-gradient(circle at 78% 10%,rgba(97,239,225,.18),transparent 37%),linear-gradient(145deg,rgba(74,156,255,.15),rgba(255,255,255,.025)); }
#soma-root .impact-report::after { content:''; position:absolute; right:-90px; bottom:-110px; width:280px; height:280px; border:1px solid rgba(97,239,225,.16); border-radius:50%; box-shadow:0 0 0 26px rgba(97,239,225,.025),0 0 0 54px rgba(97,239,225,.018); }
#soma-root .report-label { position:relative; z-index:1; color:var(--cyan); font-family:'DM Mono',monospace; font-size:.59rem; letter-spacing:.12em; text-transform:uppercase; }
#soma-root .report-number { position:relative; z-index:1; margin:19px 0 8px; color:var(--ink); font-family:'Syne',sans-serif; font-size:clamp(4.6rem,8vw,7.2rem); line-height:.8; letter-spacing:-.09em; }
#soma-root .report-number span { color:var(--lime); }
#soma-root .report-number em { margin-left:7px; color:var(--ink); font-size:.27em; font-style:normal; letter-spacing:-.04em; }
#soma-root .report-copy, #soma-root .report-micro { position:relative; z-index:1; max-width:350px; color:var(--muted); font-size:.8rem; line-height:1.7; }
#soma-root .report-micro { margin-top:auto; padding-top:24px; color:#72829a; font-size:.65rem; }
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
#soma-root .safeguards { border-top:1px solid var(--line); background:linear-gradient(180deg,transparent,rgba(97,239,225,.025),transparent); }
#soma-root .professional-record{border-top:1px solid var(--line);background:linear-gradient(135deg,rgba(97,239,225,.045),rgba(74,156,255,.02),transparent)}#soma-root .professional-grid{display:grid;grid-template-columns:180px minmax(0,1fr);gap:clamp(28px,5vw,72px);align-items:center;margin-top:48px}.professional-mark{display:grid;place-items:center;width:150px;height:150px;border:1px solid rgba(97,239,225,.25);border-radius:50%;color:var(--cyan);background:radial-gradient(circle,rgba(97,239,225,.13),rgba(74,156,255,.045));box-shadow:0 0 0 16px rgba(97,239,225,.018),0 0 55px rgba(74,156,255,.12);font:800 5rem 'Syne',sans-serif}.professional-record .section-heading{margin-top:0}.professional-note{max-width:610px;margin-top:18px;color:#77879e;font-size:.69rem;line-height:1.7}@media(max-width:680px){#soma-root .professional-grid{grid-template-columns:1fr}.professional-mark{width:106px;height:106px;font-size:3.6rem}}
#soma-root .safeguard-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-top:54px; }
#soma-root .safeguard-card { display:flex; flex-direction:column; min-height:278px; padding:25px; border:1px solid var(--line); border-radius:19px; background:rgba(255,255,255,.022); transition:transform .2s ease,border-color .2s ease,background .2s ease; }
#soma-root .safeguard-card:hover { transform:translateY(-3px); border-color:rgba(97,239,225,.35); background:rgba(97,239,225,.04); }
#soma-root .status-badge { display:inline-flex; align-items:center; width:max-content; gap:6px; padding:6px 8px; color:var(--cyan); border:1px solid rgba(97,239,225,.21); border-radius:999px; background:rgba(97,239,225,.055); font-family:'DM Mono',monospace; font-size:.51rem; letter-spacing:.09em; text-transform:uppercase; }
#soma-root .status-badge::before { content:''; width:5px; height:5px; border-radius:50%; background:currentColor; box-shadow:0 0 8px currentColor; }
#soma-root .safeguard-card h3 { margin:25px 0 10px; font-family:'Syne',sans-serif; font-size:1rem; line-height:1.2; }
#soma-root .safeguard-card p { margin:0; color:var(--muted); font-size:.76rem; line-height:1.65; }
#soma-root .status-toggle { display:flex; align-items:center; justify-content:space-between; width:100%; margin-top:auto; padding:17px 0 0; color:var(--ink); border:0; border-top:1px solid var(--line); background:transparent; font:800 .68rem 'Manrope',sans-serif; text-align:left; cursor:pointer; }
#soma-root .status-toggle span { color:var(--cyan); font-size:1rem; transition:transform .2s ease; }
#soma-root .status-toggle[aria-expanded="true"] span { transform:rotate(45deg); }
#soma-root .status-detail { margin-top:15px; padding-top:15px; border-top:1px dashed var(--line); color:#8595ab; font-size:.69rem; line-height:1.65; }
#soma-root .status-detail a { color:var(--cyan); text-decoration:none; }
#soma-root .market { overflow:hidden; }
#soma-root .market-grid { display:grid; grid-template-columns:minmax(0,1.18fr) minmax(295px,.82fr); gap:20px; margin-top:54px; }
#soma-root .workforce-panel, #soma-root .model-panel { border:1px solid var(--line); border-radius:24px; background:rgba(9,14,23,.7); }
#soma-root .workforce-panel { padding:clamp(24px,3vw,35px); }
#soma-root .workforce-top { display:flex; align-items:start; justify-content:space-between; gap:20px; }
#soma-root .workforce-top h3, #soma-root .model-panel h3 { margin:0; font-family:'Syne',sans-serif; font-size:1.13rem; }
#soma-root .source-note { max-width:295px; margin:7px 0 0; color:var(--muted); font-size:.72rem; line-height:1.6; }
#soma-root .source-note a { color:var(--cyan); text-decoration:none; }
#soma-root .workforce-total { flex:0 0 auto; color:var(--lime); font-family:'Syne',sans-serif; font-size:2.6rem; line-height:.8; letter-spacing:-.075em; text-align:right; }
#soma-root .workforce-total small { display:block; margin-top:9px; color:#7e8da2; font-family:'DM Mono',monospace; font-size:.52rem; letter-spacing:.09em; text-transform:uppercase; }
#soma-root .workforce-table { width:100%; margin-top:28px; border-collapse:collapse; }
#soma-root .workforce-table th { padding:0 0 10px; color:#72829a; border-bottom:1px solid var(--line); font:500 .54rem 'DM Mono',monospace; letter-spacing:.1em; text-align:left; text-transform:uppercase; }
#soma-root .workforce-table td { padding:14px 0; color:#c7d1e1; border-bottom:1px solid rgba(182,210,255,.08); font-size:.74rem; }
#soma-root .workforce-table td:nth-child(n+2) { color:var(--cyan); font-family:'DM Mono',monospace; font-size:.69rem; }
#soma-root .workforce-table tr:last-child td { border-bottom:0; }
#soma-root .model-panel { position:relative; display:flex; flex-direction:column; justify-content:space-between; padding:clamp(25px,3vw,38px); background:radial-gradient(circle at 82% 16%,rgba(74,156,255,.2),transparent 40%),rgba(255,255,255,.025); }
#soma-root .model-kicker { margin-bottom:13px; color:var(--blue); font-family:'DM Mono',monospace; font-size:.58rem; letter-spacing:.11em; text-transform:uppercase; }
#soma-root .model-tabs { display:flex; gap:7px; margin:24px 0 21px; }
#soma-root .model-value { color:var(--ink); font-family:'Syne',sans-serif; font-size:clamp(3.8rem,7vw,6.3rem); line-height:.82; letter-spacing:-.095em; }
#soma-root .model-value span { color:var(--blue); }
#soma-root .model-copy { max-width:330px; margin:13px 0 0; color:var(--muted); font-size:.77rem; line-height:1.65; }
#soma-root .model-disclaimer { margin-top:29px; color:#72829a; font-size:.64rem; line-height:1.65; }
#soma-root .model-panel .deck-link { margin-top:16px; }
#soma-root .cta { text-align: center; }
#soma-root .cta-box { max-width: 970px; margin: 0 auto; padding: clamp(38px, 7vw, 80px); border: 1px solid var(--line-bright); border-radius: 32px; background: radial-gradient(circle at 50% 0%, rgba(74,156,255,.22), transparent 60%), rgba(255,255,255,.022); }
#soma-root .cta .section-heading { margin-left: auto; margin-right: auto; }
#soma-root .cta .section-copy { margin: 0 auto 32px; }
#soma-root .signup { display: flex; max-width: 510px; gap: 8px; margin: 0 auto; padding: 7px; border: 1px solid var(--line); border-radius: 999px; background: rgba(5,8,13,.7); }
#soma-root .signup input { min-width: 0; flex: 1; padding: 0 16px; color: var(--ink); border: 0; outline: 0; background: transparent; font: 500 .87rem 'Manrope', sans-serif; }
#soma-root .signup input::placeholder { color: #78869a; }
#soma-root #lead-msg { min-height: 22px; margin-top: 16px; color: var(--muted); font-size: .8rem; }
#soma-root .signup-notice { max-width: 560px; margin: 14px auto 0; color: #8694aa; font-size: .66rem; line-height: 1.7; }
#soma-root .signup-notice a { color: var(--cyan); text-decoration: none; border-bottom: 1px solid rgba(97,239,225,.3); }
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
@media (max-width: 1120px) { #soma-root .feature-grid { grid-template-columns: repeat(3, 1fr); } #soma-root .roadmap-grid, #soma-root .safeguard-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 900px) { #soma-root .impact-grid, #soma-root .market-grid { grid-template-columns:1fr; } }
@media (max-width: 900px) { #soma-root .hero-layout, #soma-root .investor-layout, #soma-root .device-showcase { grid-template-columns: 1fr; } #soma-root .product-frame { max-width: 620px; width: 100%; margin: 0 auto; transform: none; } #soma-root .workflow-grid { grid-template-columns: repeat(2, 1fr); } #soma-root .footer-grid { grid-template-columns: 1.7fr 1fr 1fr; } #soma-root .footer-brand { grid-column: 1 / -1; } }
@media (max-width: 680px) { #soma-root nav { padding: 17px 20px; } #soma-root .brand img { height: 27px; } #soma-root .nav-links { display: none; } #soma-root .nav-cta { padding: 10px 13px; font-size: .7rem; } #soma-root section { padding: 90px 22px; } #soma-root .hero { padding-top: 125px; } #soma-root .hero-title { font-size: clamp(3.65rem, 16vw, 5.5rem); } #soma-root .stats { gap: 13px; margin-top: 38px; } #soma-root .stat { padding-right: 13px; } #soma-root .stat strong { font-size: 1.55rem; } #soma-root .feature-grid, #soma-root .workflow-grid, #soma-root .roadmap-grid, #soma-root .safeguard-grid { grid-template-columns: 1fr; } #soma-root .feature { min-height: 215px; } #soma-root .feature-index { margin-bottom: 26px; } #soma-root .screen { padding: 14px; } #soma-root .investor-card { padding: 26px; } #soma-root .signup { flex-direction: column; border-radius: 18px; padding: 11px; } #soma-root .signup input { height: 42px; } #soma-root .signup .button-primary { width: 100%; } #soma-root .footer-grid { grid-template-columns: 1fr 1fr; } #soma-root .footer-bottom { flex-direction: column; } }
`

const HTML = `
<div class="ambient"></div>
<div class="grid"></div>
<div class="shell">
  <nav id="nav">
    <a class="brand" href="#top"><img src="/ss.png" alt="SomaSyncAI" /></a>
    <div class="nav-links">
      <a href="#features">Features</a><a href="#impact">Impact</a><a href="#market">Data</a><a href="#roadmap">Roadmap</a><a href="#investors">Investors</a>
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
        <div class="stats reveal"><div class="stat"><strong><span>87</span>%</strong><small>Beta benchmark · not a guarantee</small></div><div class="stat"><strong><span>100</span>%</strong><small>Voice-first workflow</small></div></div>
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

  <div class="marquee"><span><b>VOICE-FIRST CLINICAL DOCUMENTATION</b> · SOAP NOTES · ICD-10-CM REFERENCE · SESSION HISTORY · PHI SAFEGUARDS · <b>VOICE-FIRST CLINICAL DOCUMENTATION</b> · SOAP NOTES · ICD-10-CM REFERENCE · SESSION HISTORY · PHI SAFEGUARDS ·</span></div>

  <section id="features">
    <div class="eyebrow reveal">01 / Core capabilities</div>
    <h2 class="section-heading reveal">Everything you need,<br><span class="blue">nothing you don't.</span></h2>
    <p class="section-copy reveal">Purpose-built for manual therapy documentation—not a repurposed generic medical EHR.</p>
    <div class="feature-grid">
      <article class="feature reveal"><span class="feature-index">01</span><h3>Hands-Free Voice Capture</h3><p>Talk naturally during a session—no typing, no pausing to take notes.</p><span class="feature-live">Live in beta</span></article>
      <article class="feature reveal"><span class="feature-index">02</span><h3>AI-Structured SOAP Notes</h3><p>Your session is organized into Subjective, Objective, Assessment, and Plan automatically.</p><span class="feature-live">Live in beta</span></article>
      <article class="feature reveal"><span class="feature-index">03</span><h3>ICD-10-CM Reference Lookup</h3><p>Search U.S. diagnosis-code references and verify every selection against current official guidance before clinical, billing, or coverage use.</p></article>
      <article class="feature reveal"><span class="feature-index">04</span><h3>Built-In PHI Safeguards</h3><p>Clear on-screen reminders to keep identifying client details out of AI-processed notes.</p></article>
      <article class="feature reveal"><span class="feature-index">05</span><h3>Session History</h3><p>Every note saved, searchable, and editable—review and refine any past documentation.</p></article>
      <article class="feature reveal"><span class="feature-index">06</span><h3>Minutes, Not Hours</h3><p>Confirm a structured note in seconds instead of typing it from scratch after every session.</p></article>
    </div>
  </section>

  <section class="device-showcase" id="device">
    <div class="device-copy">
      <div class="eyebrow reveal">02 / Bluetooth capture</div>
      <h2 class="section-heading reveal">Your hands stay on the work.<br><span class="blue">Bluetooth keeps the note moving.</span></h2>
      <p class="section-copy reveal">Use a compatible Bluetooth audio device as your selected input, then speak naturally while you work. SomaSyncAI organizes the session into a draft for your review—without asking you to stop and type.</p>
      <div class="device-steps">
        <div class="device-step reveal"><span class="device-step-index">01</span><div><strong>Pair and select your input</strong><p>Connect your preferred Bluetooth audio device to the device running SomaSyncAI, then select it as the session audio input.</p></div></div>
        <div class="device-step reveal"><span class="device-step-index">02</span><div><strong>Work and speak naturally</strong><p>Keep focused on the treatment while your spoken observations are captured as session context.</p></div></div>
        <div class="device-step reveal"><span class="device-step-index">03</span><div><strong>Review before anything is saved</strong><p>Confirm and edit the structured note with your own clinical judgment before using it in documentation.</p></div></div>
      </div>
      <p class="device-note">Bluetooth device shown for illustration. Compatibility and audio quality depend on the connected device, operating system, and browser permissions.</p>
    </div>
    <div class="device-image-frame reveal"><img src="/images/somasync-bluetooth-workflow.jpg" alt="Manual therapy practitioner using a discreet Bluetooth audio device while SomaSyncAI organizes a clinical note" /><div class="device-caption"><b>Hands-free capture</b>Bluetooth audio input flows into a reviewable structured documentation draft.</div></div>
  </section>

  <section class="impact" id="impact">
    <div class="eyebrow reveal">03 / Practice impact</div>
    <h2 class="section-heading reveal">Turn charting debt<br>into <span class="blue">time back.</span></h2>
    <p class="section-copy reveal">Use your own session volume and current after-session documentation time to see the administrative time SomaSyncAI is designed to help you reclaim. This is an interactive estimate—not a performance promise.</p>
    <div class="impact-grid">
      <div class="calculator-card reveal">
        <div class="calc-head"><div><h3>Practice-impact estimator</h3><p>Calibrate the estimate to your actual schedule.</p></div><span class="calc-live">Interactive</span></div>
        <div class="calc-control"><div class="calc-label"><span>Sessions per day</span><b id="sessions-value">22</b></div><input class="calc-range" id="sessions-range" type="range" min="4" max="40" value="22" /></div>
        <div class="calc-control"><div class="calc-label"><span>Current charting time after each session</span><b id="minutes-value">8 min</b></div><input class="calc-range" id="minutes-range" type="range" min="2" max="30" value="8" /></div>
        <div class="calc-control"><div class="calc-label"><span>Clinical days per week</span><b id="days-value">4 days</b></div><div class="calc-choice" id="days-choice"><button type="button" data-days="3">3</button><button type="button" data-days="4" class="active">4</button><button type="button" data-days="5">5</button><button type="button" data-days="6">6</button></div></div>
      </div>
      <aside class="impact-report reveal"><div><div class="report-label">Estimated weekly documentation time</div><div class="report-number"><span id="hours-value">11.7</span><em>hours</em></div><p class="report-copy">This is your current documentation-time baseline before any change in workflow.</p></div><p class="report-micro">Your estimate updates locally in your browser. It is not stored, shared, or a guarantee of results.</p></aside>
    </div>
  </section>

  <section class="workflow" id="workflow">
    <div class="eyebrow reveal">04 / Workflow</div>
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
    <div class="eyebrow reveal">05 / Roadmap</div>
    <h2 class="section-heading reveal">Where we're<br><span class="blue">headed.</span></h2>
    <p class="section-copy reveal">Built with practitioners, in the open.</p>
    <div class="roadmap-grid">
      <article class="road-card live reveal"><span class="phase">Phase 1 — Beta / Live now</span><h3>Voice-to-SOAP Documentation</h3><ul><li>Hands-free session recording</li><li>AI-structured SOAP notes</li><li>Reference-only ICD-10-CM lookup</li></ul></article>
      <article class="road-card reveal"><span class="phase">Phase 2 — Next</span><h3>Analytics & Practice Insights</h3><ul><li>Documentation time savings</li><li>Session trends</li><li>Coding-accuracy tracking</li></ul></article>
      <article class="road-card reveal"><span class="phase">Phase 3 — Planned</span><h3>Technique Library</h3><ul><li>Searchable manual therapy techniques</li><li>Evidence-based references</li></ul></article>
      <article class="road-card reveal"><span class="phase">Phase 4 — Planned</span><h3>Team Accounts</h3><ul><li>Multi-practitioner practices</li><li>Shared client records</li><li>Role-based access</li></ul></article>
    </div>
  </section>

  <section class="safeguards" id="safeguards">
    <div class="eyebrow reveal">06 / Product controls</div>
    <h2 class="section-heading reveal">Signals of care.<br>Not <span class="outline">certification claims.</span></h2>
    <p class="section-copy reveal">These badges describe implemented product controls and current beta status. They do not represent HIPAA, CMIA, SOC 2, medical-device, or other third-party certification.</p>
    <div class="safeguard-grid">
      <article class="safeguard-card reveal"><span class="status-badge">Active product control</span><h3>Voice-consent gate</h3><p>Voice capture requires the practitioner to acknowledge responsibility for required participant notice and consent before starting.</p><button class="status-toggle" type="button" aria-expanded="false" aria-controls="status-consent">What this means <span>+</span></button><div class="status-detail" id="status-consent" hidden>This is an in-app workflow guardrail. Each practice remains responsible for its own lawful consent process and documentation.</div></article>
      <article class="safeguard-card reveal"><span class="status-badge">Reference-only output</span><h3>ICD-10-CM lookup</h3><p>Suggested code references are clearly presented for professional review rather than billing or coverage determinations.</p><button class="status-toggle" type="button" aria-expanded="false" aria-controls="status-icd">Reference source <span>+</span></button><div class="status-detail" id="status-icd" hidden>Verify every selection against the <a href="https://icd10cmtool.cdc.gov/" target="_blank" rel="noreferrer">official CDC/NCHS browser</a> and current payer requirements.</div></article>
      <article class="safeguard-card reveal"><span class="status-badge">Beta guidance</span><h3>Minimum-necessary reminder</h3><p>On-screen beta disclosures tell practitioners not to enter identifiable client information without an appropriate basis and safeguards.</p><button class="status-toggle" type="button" aria-expanded="false" aria-controls="status-privacy">Privacy details <span>+</span></button><div class="status-detail" id="status-privacy" hidden>See our <a href="/privacy-policy.html">Privacy Policy</a> for data-use notices and the California privacy-request contact.</div></article>
      <article class="safeguard-card reveal"><span class="status-badge">BAA workflow</span><h3>Agreement template ready</h3><p>A downstream Business Associate Agreement template is available for counsel-led review before any production PHI arrangement.</p><button class="status-toggle" type="button" aria-expanded="false" aria-controls="status-baa">What this means <span>+</span></button><div class="status-detail" id="status-baa" hidden>A template does not authorize PHI use. Executed agreements, vendor review, and production controls are required before PHI enablement.</div></article>
    </div>
  </section>

  <section class="professional-record" id="background">
    <div class="eyebrow reveal">07 / Professional background</div>
    <div class="professional-grid">
      <div class="professional-mark reveal" aria-hidden="true">S</div>
      <div class="reveal"><h2 class="section-heading">Built with a manual-therapy<br><span class="blue">practice perspective.</span></h2><p class="section-copy">Founder and developer Nate Dropthehate Santos graduated from the Massage Core Program and Advanced Neuromuscular Therapy Program (1,250 hours) at National Holistic Institute in Modesto, California.</p><p class="professional-note">Educational background is stated as factual professional context. SomaSync AI does not display third-party association, school, government, or HIPAA logos without the applicable authorization.</p></div>
    </div>
  </section>

  <section class="market" id="market">
    <div class="eyebrow reveal">07 / Market signal</div>
    <h2 class="section-heading reveal">A growing workforce<br>still running on <span class="blue">after-hours notes.</span></h2>
    <p class="section-copy reveal">The original SomaSyncAI investor narrative focused on an overlooked manual-therapy segment. We restored that story with a clear distinction between official workforce data and the company’s internal opportunity model.</p>
    <div class="market-grid">
      <div class="workforce-panel reveal"><div class="workforce-top"><div><h3>U.S. occupational reach</h3><p class="source-note">2024 employment from the U.S. Bureau of Labor Statistics. These occupations are a workforce indicator—not SomaSyncAI customer, user, or revenue counts.</p></div><div class="workforce-total">595.2K<small>Combined 2024 jobs</small></div></div><table class="workforce-table"><thead><tr><th>Occupation</th><th>2024 jobs</th><th>2024–34 growth</th><th>Source</th></tr></thead><tbody><tr><td>Physical therapists</td><td>267.2K</td><td>11%</td><td><a href="https://www.bls.gov/ooh/healthcare/physical-therapists.htm" target="_blank" rel="noreferrer">BLS ↗</a></td></tr><tr><td>Occupational therapists</td><td>160.0K</td><td>14%</td><td><a href="https://www.bls.gov/ooh/healthcare/occupational-therapists.htm" target="_blank" rel="noreferrer">BLS ↗</a></td></tr><tr><td>Massage therapists</td><td>168.0K</td><td>15%</td><td><a href="https://www.bls.gov/ooh/healthcare/massage-therapists.htm" target="_blank" rel="noreferrer">BLS ↗</a></td></tr></tbody></table></div>
      <aside class="model-panel reveal"><div><div class="model-kicker">Restored investor overview</div><h3>Opportunity model</h3><div class="model-tabs"><button class="active" type="button" data-model="tam">TAM</button><button type="button" data-model="sam">SAM</button><button type="button" data-model="som">SOM</button></div><div class="model-value" id="model-value"><span>$</span>28B</div><p class="model-copy" id="model-copy">Global clinical documentation software market.</p></div><div><p class="model-disclaimer">Internal investor-model figures from the original SomaSyncAI pitch deck. They are planning assumptions, not audited revenue, a market-research citation, or a public investment offer.</p><a class="deck-link" href="/investor-pitch.html">Read the full investor overview</a></div></aside>
    </div>
  </section>

  <section id="investors">
    <div class="eyebrow reveal">08 / Investors</div>
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
      <form class="signup" id="lead-form"><input id="lead-hp" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px" /><input id="lead-email" type="email" required placeholder="you@practice.com" aria-label="Your email address" /><button class="button-primary" type="submit">Join Beta — Free</button></form><p class="signup-notice">California Notice at Collection: we collect this email only to administer beta interest and access updates. We do not sell or share it for cross-context behavioral advertising. <a href="/privacy-policy.html">Privacy Policy</a>. Do not submit client or patient information in this form.</p><div id="lead-msg" aria-live="polite"></div>
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

  const sessionsRange = document.getElementById('sessions-range')
  const minutesRange = document.getElementById('minutes-range')
  const sessionsValue = document.getElementById('sessions-value')
  const minutesValue = document.getElementById('minutes-value')
  const daysValue = document.getElementById('days-value')
  const hoursValue = document.getElementById('hours-value')
  let clinicalDays = 4
  const updateImpact = () => {
    if (!sessionsRange || !minutesRange || !hoursValue) return
    const sessions = Number(sessionsRange.value)
    const minutes = Number(minutesRange.value)
    sessionsValue.textContent = sessions
    minutesValue.textContent = minutes + ' min'
    daysValue.textContent = clinicalDays + (clinicalDays === 1 ? ' day' : ' days')
    hoursValue.textContent = ((sessions * minutes * clinicalDays) / 60).toFixed(1)
  }
  sessionsRange?.addEventListener('input', updateImpact)
  minutesRange?.addEventListener('input', updateImpact)
  document.querySelectorAll('[data-days]').forEach((button) => button.addEventListener('click', () => {
    clinicalDays = Number(button.dataset.days)
    document.querySelectorAll('[data-days]').forEach((choice) => choice.classList.toggle('active', choice === button))
    updateImpact()
  }))
  updateImpact()

  document.querySelectorAll('.status-toggle').forEach((button) => button.addEventListener('click', () => {
    const detail = document.getElementById(button.getAttribute('aria-controls'))
    const open = button.getAttribute('aria-expanded') === 'true'
    button.setAttribute('aria-expanded', String(!open))
    if (detail) detail.hidden = open
  }))

  const marketModels = {
    tam: { value: '$28B', copy: 'Global clinical documentation software market.' },
    sam: { value: '$4.2B', copy: 'Manual therapy and outpatient rehabilitation documentation in the U.S.' },
    som: { value: '$420M', copy: 'Original pitch assumption for direct-practitioner reach within 36 months.' }
  }
  const modelValue = document.getElementById('model-value')
  const modelCopy = document.getElementById('model-copy')
  document.querySelectorAll('[data-model]').forEach((button) => button.addEventListener('click', () => {
    const model = marketModels[button.dataset.model]
    if (!model || !modelValue || !modelCopy) return
    modelValue.innerHTML = '<span>$</span>' + model.value.slice(1)
    modelCopy.textContent = model.copy
    document.querySelectorAll('[data-model]').forEach((choice) => choice.classList.toggle('active', choice === button))
  }))

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
        const response = await fetch(window.__SOMA_API_BASE_URL__ + '/public/beta-leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })
        if (!response.ok) throw new Error('Lead submission failed')
        message.textContent = "You're on the beta list — taking you to login."
        message.style.color = '#a7ff80'
        form.reset()
        window.setTimeout(() => window.location.assign('/login'), 900)
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
