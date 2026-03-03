import { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    // Inject CSS
    const style = document.createElement('style')
    style.textContent = CSS
    document.head.appendChild(style)

    // Google Fonts
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap'
    document.head.appendChild(link)

    // Chart.js then run main JS
    const chart = document.createElement('script')
    chart.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js'
    chart.onload = () => {
      const s = document.createElement('script')
      s.textContent = JS
      document.body.appendChild(s)
    }
    document.head.appendChild(chart)
  }, [])

  return <div dangerouslySetInnerHTML={{ __html: HTML }} />
}

const CSS = `
/* ═══════════════════════════════════════════════════
   RESET & TOKENS
═══════════════════════════════════════════════════ */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --teal:#30d9c0;--teal-mid:#1fc4ac;--teal-deep:#0aab94;
  --blue:#0a84ff;--purple:#bf5af2;--orange:#ff9f0a;--green:#34c759;--red:#ff453a;
  --ink:#1d1d1f;--ink2:#424245;--ink3:#6e6e73;--ink4:#a1a1a6;
  --bg:#ffffff;--bg2:#f5f5f7;--bg3:#e8e8ed;
  --dark:#0a0c10;--dark2:#111418;--dark3:#181c22;
  --border:rgba(0,0,0,0.08);--border-light:rgba(255,255,255,0.08);
  --shadow-sm:0 2px 12px rgba(0,0,0,0.06);
  --shadow-md:0 8px 32px rgba(0,0,0,0.1);
  --shadow-lg:0 24px 64px rgba(0,0,0,0.15);
  --shadow-xl:0 40px 100px rgba(0,0,0,0.22);
  --r:20px;--r-sm:12px;--r-xs:8px;
  /* Satin/silk overlay */
  --satin:linear-gradient(135deg,rgba(255,255,255,0.12) 0%,rgba(255,255,255,0.04) 40%,rgba(48,217,192,0.06) 70%,rgba(10,132,255,0.04) 100%);
}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased;}
body{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:var(--bg);color:var(--ink);overflow-x:hidden;}

/* ═══════════════════════════════════════════════════
   SATIN OVERLAY UTILITY
═══════════════════════════════════════════════════ */
.satin{position:relative;}
.satin::after{
  content:'';position:absolute;inset:0;pointer-events:none;z-index:1;
  background:var(--satin);
  border-radius:inherit;
}
.satin>*{position:relative;z-index:2;}

/* ═══════════════════════════════════════════════════
   BETA BANNER
═══════════════════════════════════════════════════ */
.beta-banner{
  background:linear-gradient(90deg,#c45000,#ff9f0a,#c45000);
  background-size:200% 100%;
  animation:bannerShift 4s ease-in-out infinite;
  padding:9px 24px;text-align:center;
  font-size:12px;font-weight:700;color:#fff;
  letter-spacing:0.03em;
}
.beta-banner span{opacity:0.8;font-weight:400;}
@keyframes bannerShift{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}

/* ═══════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════ */
nav{
  position:sticky;top:0;z-index:200;
  height:56px;display:flex;align-items:center;justify-content:space-between;
  padding:0 40px;
  background:rgba(255,255,255,0.86);
  backdrop-filter:saturate(200%) blur(28px);
  -webkit-backdrop-filter:saturate(200%) blur(28px);
  border-bottom:0.5px solid rgba(0,0,0,0.1);
}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;}
.nav-logo-img{height:32px;width:auto;object-fit:contain;}
.nav-logo-text{font-size:15px;font-weight:800;letter-spacing:-0.04em;color:var(--ink);}
.nav-logo-text span{background:linear-gradient(135deg,var(--teal-mid),var(--blue));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.nav-center{display:flex;align-items:center;gap:28px;list-style:none;}
.nav-center a{font-size:13px;color:var(--ink3);text-decoration:none;transition:color 0.15s;font-weight:500;}
.nav-center a:hover{color:var(--ink);}
.nav-right{display:flex;align-items:center;gap:10px;}
.btn-outline{background:transparent;border:1px solid var(--border);color:var(--ink2);padding:7px 16px;border-radius:980px;font-size:13px;font-weight:500;font-family:inherit;cursor:pointer;transition:all 0.2s;}
.btn-outline:hover{border-color:var(--ink2);color:var(--ink);}
.btn-dark{background:var(--ink);color:#fff;border:none;padding:8px 18px;border-radius:980px;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;transition:all 0.2s;letter-spacing:-0.01em;}
.btn-dark:hover{background:#000;transform:scale(1.02);}

/* ═══════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════ */
.hero{
  min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:80px 32px 60px;text-align:center;
  position:relative;overflow:hidden;
  background:var(--dark);
}
.hero-mesh{
  position:absolute;inset:0;z-index:0;
  background:
    radial-gradient(ellipse 80% 60% at 50% -10%,rgba(48,217,192,0.18) 0%,transparent 60%),
    radial-gradient(ellipse 60% 50% at 90% 60%,rgba(10,132,255,0.12) 0%,transparent 55%),
    radial-gradient(ellipse 50% 50% at 10% 80%,rgba(191,90,242,0.08) 0%,transparent 55%),
    radial-gradient(ellipse 40% 40% at 50% 50%,rgba(48,217,192,0.04) 0%,transparent 70%);
}
/* Satin silk overlay on hero */
.hero-satin{
  position:absolute;inset:0;z-index:1;pointer-events:none;
  background:
    linear-gradient(125deg,rgba(255,255,255,0.06) 0%,transparent 30%,rgba(48,217,192,0.04) 60%,rgba(255,255,255,0.03) 100%);
}
.hero-noise{
  position:absolute;inset:0;z-index:1;opacity:0.03;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
}
.hero-inner{position:relative;z-index:2;max-width:860px;margin:0 auto;}
.hero-eyebrow{
  display:inline-flex;align-items:center;gap:10px;
  background:rgba(255,255,255,0.07);
  border:1px solid rgba(255,255,255,0.12);
  backdrop-filter:blur(12px);
  border-radius:980px;padding:7px 18px;
  font-size:12px;font-weight:600;color:rgba(255,255,255,0.7);
  letter-spacing:0.06em;text-transform:uppercase;
  margin-bottom:40px;
  animation:fadeUp 0.8s ease both;
  box-shadow:0 0 30px rgba(48,217,192,0.1);
}
.eyebrow-img{height:18px;width:auto;object-fit:contain;border-radius:3px;}
.eyebrow-pulse{width:7px;height:7px;border-radius:50%;background:var(--teal);animation:pulseGlow 2s ease-in-out infinite;}
@keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 rgba(48,217,192,0.6);}50%{box-shadow:0 0 0 8px rgba(48,217,192,0);}}
.hero h1{
  font-size:clamp(58px,10vw,108px);
  font-weight:900;letter-spacing:-0.05em;line-height:0.92;
  color:#fff;margin-bottom:32px;
  animation:fadeUp 0.8s 0.1s ease both;
}
.hero h1 .grad{
  background:linear-gradient(125deg,var(--teal) 0%,#7ef4e4 30%,var(--blue) 60%,var(--purple) 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  filter:drop-shadow(0 0 40px rgba(48,217,192,0.3));
}
.hero-sub{
  font-size:20px;font-weight:300;
  color:rgba(255,255,255,0.5);
  line-height:1.6;letter-spacing:-0.02em;
  max-width:580px;margin:0 auto 52px;
  animation:fadeUp 0.8s 0.2s ease both;
}
.hero-actions{
  display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;
  animation:fadeUp 0.8s 0.3s ease both;
}
.btn-hero-primary{
  background:linear-gradient(135deg,var(--teal-deep),var(--teal-mid));
  color:#0a1a18;border:none;cursor:pointer;
  padding:16px 36px;border-radius:980px;
  font-size:16px;font-weight:800;font-family:inherit;
  display:inline-flex;align-items:center;gap:8px;
  transition:all 0.25s;letter-spacing:-0.02em;
  box-shadow:0 8px 32px rgba(30,196,172,0.35);
  text-decoration:none;
}
.btn-hero-primary:hover{transform:translateY(-3px);box-shadow:0 16px 48px rgba(30,196,172,0.45);}
.btn-hero-ghost{
  background:rgba(255,255,255,0.07);
  border:1px solid rgba(255,255,255,0.15);
  color:rgba(255,255,255,0.75);
  backdrop-filter:blur(8px);
  padding:15px 28px;border-radius:980px;
  font-size:16px;font-weight:500;font-family:inherit;
  cursor:pointer;transition:all 0.2s;letter-spacing:-0.02em;
}
.btn-hero-ghost:hover{background:rgba(255,255,255,0.12);color:#fff;}
.hero-stats{
  display:flex;gap:0;justify-content:center;align-items:center;
  margin-top:64px;
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:20px;padding:24px 40px;
  backdrop-filter:blur(12px);
  animation:fadeUp 0.8s 0.5s ease both;
  width:fit-content;margin-left:auto;margin-right:auto;margin-top:64px;
}
.hero-stat{text-align:center;padding:0 32px;}
.hero-stat-num{font-size:28px;font-weight:800;letter-spacing:-0.04em;color:#fff;}
.hero-stat-num span{background:linear-gradient(135deg,var(--teal),var(--blue));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.hero-stat-lbl{font-size:11px;color:rgba(255,255,255,0.3);font-weight:500;letter-spacing:0.03em;margin-top:3px;}
.stat-div{width:1px;height:40px;background:rgba(255,255,255,0.08);}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}

/* Floating ambient cards */
.float-card{
  position:absolute;z-index:3;pointer-events:none;
  background:rgba(255,255,255,0.07);
  border:1px solid rgba(255,255,255,0.12);
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  border-radius:16px;padding:14px 18px;
  font-size:12px;font-weight:600;color:rgba(255,255,255,0.7);
}
.fc1{top:22%;left:4%;animation:floatA 7s ease-in-out infinite;}
.fc2{top:30%;right:3%;animation:floatB 8s ease-in-out infinite;}
.fc3{bottom:22%;left:7%;animation:floatA 9s 1s ease-in-out infinite;}
.fc-val{font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.04em;}
.fc-sub{font-size:10px;color:rgba(255,255,255,0.35);margin-top:2px;}
@keyframes floatA{0%,100%{transform:translateY(0);}50%{transform:translateY(-14px);}}
@keyframes floatB{0%,100%{transform:translateY(-8px);}50%{transform:translateY(10px);}}

/* ═══════════════════════════════════════════════════
   WAVEFORM SECTION
═══════════════════════════════════════════════════ */
.wave-section{background:var(--dark);padding:0 32px 80px;}
.wave-card{
  max-width:860px;margin:0 auto;
  background:var(--dark2);
  border:1px solid rgba(255,255,255,0.06);
  border-radius:28px;padding:48px;
  position:relative;overflow:hidden;
  box-shadow:0 32px 80px rgba(0,0,0,0.4);
}
/* silk overlay on wave card */
.wave-card::before{
  content:'';position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(125deg,rgba(255,255,255,0.04) 0%,transparent 40%,rgba(48,217,192,0.05) 100%);
  border-radius:inherit;
}
.wave-card-inner{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:18px;}
.wave-label{font-size:11px;font-weight:700;letter-spacing:0.1em;color:rgba(255,255,255,0.2);text-transform:uppercase;}
.wave-bars{display:flex;align-items:center;gap:4px;height:80px;}
.wbar{width:3px;border-radius:2px;background:linear-gradient(to top,var(--teal-deep),var(--teal));animation:wv 1.6s ease-in-out infinite;}
@keyframes wv{0%,100%{transform:scaleY(0.12);opacity:0.3;}50%{transform:scaleY(1);opacity:1;}}
.wave-status{display:flex;align-items:center;gap:10px;font-size:13px;color:rgba(255,255,255,0.35);}
.wave-dot{width:8px;height:8px;border-radius:50%;background:var(--teal);animation:pulseGlow 2s ease-in-out infinite;}
.wave-transcript{
  width:100%;max-width:600px;
  background:rgba(255,255,255,0.03);
  border:1px solid rgba(255,255,255,0.06);
  border-radius:14px;padding:18px 20px;
  margin-top:6px;
}
.wt-line{
  display:flex;gap:10px;align-items:flex-start;
  font-size:13px;color:rgba(255,255,255,0.5);
  line-height:1.6;padding:6px 0;
  border-bottom:1px solid rgba(255,255,255,0.04);
}
.wt-line:last-child{border-bottom:none;}
.wt-tag{
  font-size:10px;font-weight:700;padding:2px 7px;border-radius:5px;
  white-space:nowrap;margin-top:2px;flex-shrink:0;
}
.wt-ai{background:rgba(48,217,192,0.15);color:var(--teal);}
.wt-client{background:rgba(10,132,255,0.15);color:var(--blue);}
.wt-flag{background:rgba(255,69,58,0.15);color:var(--red);}

/* ═══════════════════════════════════════════════════
   KNOWLEDGE BASE / LOGOS TICKER
═══════════════════════════════════════════════════ */
.ticker-section{background:var(--bg2);padding:52px 0;overflow:hidden;}
.ticker-label{text-align:center;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink4);margin-bottom:28px;}
.ticker-label span{color:var(--teal-deep);}
.ticker-track{display:flex;overflow:hidden;width:100%;}
.ticker-inner{
  display:flex;flex-direction:row;align-items:center;
  animation:ticker 45s linear infinite;
  flex-shrink:0;white-space:nowrap;
  will-change:transform;
}
.ticker-inner2{animation-delay:-22.5s;}
@keyframes ticker{from{transform:translateX(0);}to{transform:translateX(-100%)}}
.ticker-item{
  display:inline-flex;flex-direction:row;align-items:center;gap:12px;
  flex-shrink:0;padding:0 44px;
  opacity:0.55;transition:opacity 0.3s;
  border-right:1px solid var(--border);
  white-space:nowrap;
}
.ticker-item:hover{opacity:1;}
.ticker-badge{
  width:40px;height:40px;border-radius:10px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:900;letter-spacing:-0.03em;
}
.ticker-logo-text{font-size:14px;font-weight:800;letter-spacing:-0.03em;color:var(--ink);}
.ticker-logo-sub{font-size:10px;font-weight:500;color:var(--ink4);margin-top:1px;display:block;}

/* ═══════════════════════════════════════════════════
   SECTION SHELL
═══════════════════════════════════════════════════ */
.section{padding:100px 32px;}
.section.gray{background:var(--bg2);}
.section.dark{background:var(--dark);}
.section.dark2{background:var(--dark2);}
.s-head{text-align:center;max-width:680px;margin:0 auto 80px;}
.s-tag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--teal-deep);background:rgba(48,217,192,0.1);padding:5px 14px;border-radius:980px;margin-bottom:18px;border:1px solid rgba(48,217,192,0.2);}
.dark .s-tag,.dark2 .s-tag{color:var(--teal);background:rgba(48,217,192,0.08);}
.s-h2{font-size:clamp(36px,5.5vw,60px);font-weight:800;letter-spacing:-0.05em;line-height:1.0;color:var(--ink);margin-bottom:20px;}
.dark .s-h2,.dark2 .s-h2{color:#fff;}
.s-p{font-size:18px;font-weight:300;color:var(--ink3);line-height:1.65;letter-spacing:-0.01em;}
.dark .s-p,.dark2 .s-p{color:rgba(255,255,255,0.35);}

/* ═══════════════════════════════════════════════════
   HOW IT WORKS — 4 STEP FLOW
═══════════════════════════════════════════════════ */
.flow-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;max-width:1060px;margin:0 auto;}
.flow-card{
  background:var(--bg);border:1px solid var(--border);
  border-radius:var(--r);padding:32px 24px;
  box-shadow:var(--shadow-sm);
  transition:all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
  opacity:0;transform:translateY(32px);
  position:relative;overflow:hidden;
}
.flow-card::before{
  content:'';position:absolute;inset:0;pointer-events:none;
  background:var(--satin);opacity:0;transition:opacity 0.3s;
}
.flow-card:hover::before{opacity:1;}
.flow-card:hover{transform:translateY(-8px);box-shadow:var(--shadow-xl);}
.flow-card.vis{opacity:1;transform:translateY(0);}
.step-n{font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink4);margin-bottom:18px;}
.flow-ico{width:52px;height:52px;border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:20px;}
.fi1{background:linear-gradient(135deg,rgba(48,217,192,0.18),rgba(10,132,255,0.1));}
.fi2{background:linear-gradient(135deg,rgba(10,132,255,0.18),rgba(191,90,242,0.1));}
.fi3{background:linear-gradient(135deg,rgba(255,159,10,0.18),rgba(255,69,58,0.1));}
.fi4{background:linear-gradient(135deg,rgba(52,199,89,0.18),rgba(48,217,192,0.1));}
.flow-card h3{font-size:19px;font-weight:700;letter-spacing:-0.03em;margin-bottom:10px;}
.flow-card p{font-size:13px;color:var(--ink3);line-height:1.65;font-weight:300;}

/* ═══════════════════════════════════════════════════
   LIVE DEMO — TABS
═══════════════════════════════════════════════════ */
.demo-wrap{max-width:1000px;margin:0 auto;}
.demo-tabs{
  display:flex;gap:4px;background:rgba(255,255,255,0.06);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:14px;padding:4px;margin-bottom:28px;
  width:fit-content;
}
.demo-tab{
  padding:10px 22px;border-radius:10px;font-size:13px;font-weight:600;
  color:rgba(255,255,255,0.35);cursor:pointer;border:none;
  background:transparent;font-family:inherit;transition:all 0.2s;
  letter-spacing:-0.01em;
}
.demo-tab.active{
  background:rgba(255,255,255,0.1);color:#fff;
  border:1px solid rgba(255,255,255,0.1);
  box-shadow:0 2px 8px rgba(0,0,0,0.2);
}
.demo-panel{display:none;}
.demo-panel.active{display:grid;grid-template-columns:1fr 1.1fr;gap:20px;align-items:start;}
.demo-in-card{
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:var(--r);overflow:hidden;
}
/* Silk satin on demo card */
.demo-in-card::before{
  content:'';position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(135deg,rgba(255,255,255,0.05) 0%,transparent 50%);
}
.demo-in-card{position:relative;}
.chrome-bar{
  display:flex;align-items:center;gap:6px;
  padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);
  background:rgba(255,255,255,0.02);
}
.cdot{width:11px;height:11px;border-radius:50%;}
.cdot.r{background:#ff5f57;}.cdot.y{background:#febc2e;}.cdot.g{background:#28c840;}
.clabel{margin-left:auto;font-size:10px;font-weight:700;color:rgba(255,255,255,0.2);letter-spacing:0.06em;text-transform:uppercase;}
.raw-body{padding:20px;}
.raw-line{
  display:flex;gap:8px;align-items:flex-start;
  padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);
  font-size:14px;color:rgba(255,255,255,0.55);line-height:1.55;
}
.raw-line:last-child{border-bottom:none;}
.qm{color:rgba(255,255,255,0.2);font-size:18px;line-height:1;flex-shrink:0;margin-top:1px;}
.out-card{
  background:#080b0f;border-radius:var(--r);overflow:hidden;
  box-shadow:0 24px 64px rgba(0,0,0,0.5);
  border:1px solid rgba(255,255,255,0.05);
}
.icd-list{padding:16px 20px;}
.icd-row{
  display:flex;align-items:center;gap:12px;
  padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04);
  animation:slideIn 0.4s ease both;
}
.icd-row:last-of-type{border-bottom:none;}
@keyframes slideIn{from{opacity:0;transform:translateX(14px);}to{opacity:1;transform:translateX(0);}}
.badge{font-size:11px;font-weight:800;font-family:'SF Mono','Fira Code',monospace;padding:4px 9px;border-radius:7px;min-width:52px;text-align:center;letter-spacing:0.02em;}
.bg-t{background:rgba(48,217,192,0.15);color:#30d9c0;}
.bg-b{background:rgba(10,132,255,0.15);color:#6ab5ff;}
.bg-o{background:rgba(255,159,10,0.15);color:#ffb340;}
.bg-p{background:rgba(191,90,242,0.15);color:#bf5af2;}
.bg-g{background:rgba(52,199,89,0.15);color:#34c759;}
.icd-name{font-size:14px;color:#c8cfd8;}
.conf-section{padding:16px 20px;border-top:1px solid rgba(255,255,255,0.05);}
.conf-row{display:flex;align-items:center;gap:12px;margin-bottom:10px;}
.conf-row:last-child{margin-bottom:0;}
.conf-key{font-size:11px;color:rgba(255,255,255,0.2);font-weight:700;letter-spacing:0.04em;min-width:78px;}
.conf-track{flex:1;height:5px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;}
.conf-fill{height:100%;border-radius:3px;transition:width 1.4s cubic-bezier(0.22,1,0.36,1);}
.conf-pct{font-size:12px;font-weight:800;min-width:38px;text-align:right;}

/* SOAP card */
.soap-out{
  background:var(--bg);border:1px solid var(--border);
  border-radius:var(--r);overflow:hidden;
  box-shadow:var(--shadow-md);
}
.soap-body{padding:24px;}
.soap-block{margin-bottom:20px;}
.soap-block:last-child{margin-bottom:0;}
.soap-lbl{
  display:inline-block;font-size:11px;font-weight:800;
  letter-spacing:0.06em;text-transform:uppercase;
  padding:3px 9px;border-radius:6px;margin-bottom:10px;
}
.sl-s{background:rgba(10,132,255,0.1);color:var(--blue);}
.sl-o{background:rgba(48,217,192,0.1);color:var(--teal-deep);}
.sl-a{background:rgba(255,159,10,0.1);color:var(--orange);}
.sl-p{background:rgba(52,199,89,0.1);color:var(--green);}
.soap-text{font-size:13px;color:var(--ink2);line-height:1.7;font-weight:300;}
.soap-text strong{font-weight:600;color:var(--ink);}

/* ═══════════════════════════════════════════════════
   SPHERE PRODUCT SECTION
═══════════════════════════════════════════════════ */
.sphere-section{
  background:var(--dark);
  padding:100px 32px;
  position:relative;overflow:hidden;
}
.sphere-satin{
  position:absolute;inset:0;pointer-events:none;
  background:
    linear-gradient(135deg,rgba(255,255,255,0.04) 0%,transparent 40%,rgba(48,217,192,0.06) 70%,rgba(10,132,255,0.03) 100%);
}
.sphere-grid-inner{max-width:1060px;margin:0 auto;}
.sphere-hero-row{
  display:grid;grid-template-columns:1fr 1fr;gap:48px;
  align-items:center;margin-bottom:64px;
}
.sphere-text h2{
  font-size:clamp(38px,5vw,60px);font-weight:800;
  letter-spacing:-0.05em;line-height:1.0;color:#fff;margin-bottom:20px;
}
.sphere-text h2 em{
  font-style:italic;font-family:'Playfair Display',serif;
  background:linear-gradient(125deg,var(--teal),var(--blue));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.sphere-text p{font-size:16px;color:rgba(255,255,255,0.4);line-height:1.7;font-weight:300;margin-bottom:24px;}
.sphere-visual{
  position:relative;display:flex;align-items:center;justify-content:center;
  height:320px;
}
.sphere-orb{
  width:220px;height:220px;border-radius:50%;
  background:radial-gradient(circle at 35% 35%,rgba(48,217,192,0.8),rgba(10,132,255,0.6) 50%,rgba(191,90,242,0.4) 80%,transparent);
  box-shadow:
    0 0 60px rgba(48,217,192,0.25),
    0 0 120px rgba(10,132,255,0.15),
    inset 0 0 40px rgba(255,255,255,0.1);
  animation:orbPulse 4s ease-in-out infinite;
  position:relative;
}
.sphere-orb::after{
  content:'';position:absolute;inset:-2px;border-radius:50%;
  background:linear-gradient(135deg,rgba(255,255,255,0.25) 0%,transparent 50%);
}
@keyframes orbPulse{0%,100%{transform:scale(1);box-shadow:0 0 60px rgba(48,217,192,0.25),0 0 120px rgba(10,132,255,0.15);}50%{transform:scale(1.04);box-shadow:0 0 80px rgba(48,217,192,0.4),0 0 160px rgba(10,132,255,0.2);}}
.orb-ring{
  position:absolute;border-radius:50%;
  border:1px solid rgba(48,217,192,0.2);
  animation:ringExpand 3s ease-in-out infinite;
}
.orb-ring.r1{width:280px;height:280px;animation-delay:0s;}
.orb-ring.r2{width:340px;height:340px;animation-delay:0.8s;}
.orb-ring.r3{width:400px;height:400px;animation-delay:1.6s;}
@keyframes ringExpand{0%,100%{opacity:0.4;transform:scale(1);}50%{opacity:0.15;transform:scale(1.03);}}
.orb-label{
  position:absolute;font-size:11px;font-weight:700;letter-spacing:0.04em;
  color:rgba(255,255,255,0.6);text-transform:uppercase;
  background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);
  backdrop-filter:blur(8px);border-radius:8px;padding:6px 12px;
  white-space:nowrap;
}
.orb-label.l1{top:10%;right:5%;}
.orb-label.l2{bottom:15%;right:0%;}
.orb-label.l3{bottom:20%;left:2%;}

/* Sphere components */
.sphere-components{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.sc-card{
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.07);
  border-radius:16px;padding:24px;
  transition:all 0.3s;
  opacity:0;transform:translateY(24px);
  position:relative;overflow:hidden;
}
.sc-card::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,255,255,0.04) 0%,transparent 60%);
  pointer-events:none;
}
.sc-card:hover{background:rgba(255,255,255,0.07);transform:translateY(-4px)!important;border-color:rgba(255,255,255,0.12);}
.sc-card.vis{opacity:1;transform:translateY(0);}
.sc-icon{font-size:28px;margin-bottom:14px;}
.sc-card h4{font-size:16px;font-weight:700;color:#fff;margin-bottom:8px;letter-spacing:-0.03em;}
.sc-card p{font-size:13px;color:rgba(255,255,255,0.35);line-height:1.65;font-weight:300;}
.sc-badge{
  display:inline-block;font-size:10px;font-weight:700;
  letter-spacing:0.06em;text-transform:uppercase;
  padding:3px 9px;border-radius:980px;margin-bottom:12px;
}

/* ═══════════════════════════════════════════════════
   COMING SOON FEATURES — ANIMATED LIST
═══════════════════════════════════════════════════ */
.features-marquee{background:var(--dark2);padding:72px 0;overflow:hidden;}
.features-marquee-label{text-align:center;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.2);margin-bottom:32px;}
.marquee-track{display:flex;gap:0;overflow:hidden;}
.marquee-row{display:flex;align-items:center;gap:32px;animation:marqueeScroll 35s linear infinite;flex-shrink:0;padding:0 16px;}
.marquee-row2{animation:marqueeScroll 35s linear infinite reverse;animation-delay:-17.5s;margin-top:16px;}
@keyframes marqueeScroll{from{transform:translateX(0);}to{transform:translateX(-100%);}}
.feature-pill{
  display:flex;align-items:center;gap:10px;
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.07);
  border-radius:980px;padding:10px 20px;
  white-space:nowrap;flex-shrink:0;
  font-size:13px;font-weight:500;color:rgba(255,255,255,0.5);
}
.fp-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}

/* ═══════════════════════════════════════════════════
   CHARTS / ANALYTICS
═══════════════════════════════════════════════════ */
.charts-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;max-width:1060px;margin:0 auto;}
.chart-card{
  background:var(--bg);border:1px solid var(--border);
  border-radius:var(--r);padding:28px;
  box-shadow:var(--shadow-sm);
  opacity:0;transform:translateY(24px);transition:all 0.5s ease;
  position:relative;overflow:hidden;
}
.chart-card::after{
  content:'';position:absolute;inset:0;pointer-events:none;
  background:var(--satin);opacity:0.6;
}
.chart-card.vis{opacity:1;transform:translateY(0);}
.chart-card:hover{box-shadow:var(--shadow-lg);}
.ct{font-size:15px;font-weight:700;letter-spacing:-0.03em;margin-bottom:3px;}
.cs{font-size:12px;color:var(--ink4);margin-bottom:20px;}
.cc{position:relative;height:160px;}
.big-chart{
  background:var(--bg);border:1px solid var(--border);
  border-radius:var(--r);padding:32px;max-width:1060px;margin:16px auto 0;
  box-shadow:var(--shadow-sm);
  opacity:0;transform:translateY(24px);transition:all 0.5s ease;
  position:relative;overflow:hidden;
}
.big-chart::after{content:'';position:absolute;inset:0;pointer-events:none;background:var(--satin);opacity:0.6;}
.big-chart.vis{opacity:1;transform:translateY(0);}
.bcc{position:relative;height:240px;}
.chart-legend{display:flex;gap:20px;margin-bottom:16px;flex-wrap:wrap;}
.cl-item{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--ink3);font-weight:500;}
.cl-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}

/* Metric cards row */
.metrics-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;max-width:1060px;margin:0 auto 20px;}
.metric-card{
  background:var(--bg);border:1px solid var(--border);border-radius:var(--r);
  padding:24px;text-align:center;box-shadow:var(--shadow-sm);
  opacity:0;transform:translateY(18px);transition:all 0.4s ease;
  position:relative;overflow:hidden;
}
.metric-card::after{content:'';position:absolute;inset:0;pointer-events:none;background:var(--satin);opacity:0.6;}
.metric-card.vis{opacity:1;transform:translateY(0);}
.metric-val{font-size:34px;font-weight:800;letter-spacing:-0.05em;color:var(--ink);}
.metric-val span{background:linear-gradient(135deg,var(--teal-mid),var(--blue));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.metric-lbl{font-size:12px;color:var(--ink4);margin-top:4px;font-weight:500;}
.metric-delta{font-size:11px;font-weight:600;margin-top:6px;color:var(--green);}

/* ═══════════════════════════════════════════════════
   BENTO FEATURES
═══════════════════════════════════════════════════ */
.bento{display:grid;grid-template-columns:1.2fr 1fr;gap:16px;max-width:1060px;margin:0 auto;}
.bc{
  background:var(--bg);border:1px solid var(--border);
  border-radius:var(--r);padding:40px 36px;
  box-shadow:var(--shadow-sm);
  opacity:0;transform:translateY(24px);transition:all 0.4s ease;
  position:relative;overflow:hidden;
}
.bc::before{content:'';position:absolute;inset:0;background:var(--satin);pointer-events:none;opacity:0.7;}
.bc>*{position:relative;z-index:1;}
.bc.vis{opacity:1;transform:translateY(0);}
.bc:hover{box-shadow:var(--shadow-xl);transform:translateY(-4px)!important;}
.bc.ink{background:var(--ink);border-color:transparent;}
.bc.ink::before{background:linear-gradient(135deg,rgba(255,255,255,0.06) 0%,transparent 50%,rgba(48,217,192,0.05) 100%);}
.bc.col2{grid-column:span 2;}
.bc.right-col{display:flex;flex-direction:column;gap:16px;}
.bc.inner-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:28px 24px;}
.bc-tag{display:inline-block;font-size:10px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--teal-deep);background:rgba(48,217,192,0.1);padding:4px 10px;border-radius:980px;margin-bottom:14px;border:1px solid rgba(48,217,192,0.15);}
.ink .bc-tag{color:var(--teal);background:rgba(48,217,192,0.1);}
.bc h3{font-size:26px;font-weight:800;letter-spacing:-0.04em;margin-bottom:14px;color:var(--ink);line-height:1.1;}
.ink h3{color:#fff;}
.bc p{font-size:15px;color:var(--ink3);line-height:1.7;font-weight:300;}
.ink p{color:rgba(255,255,255,0.35);}
.checklist{margin-top:22px;list-style:none;display:flex;flex-direction:column;gap:0;}
.checklist li{
  display:flex;align-items:flex-start;gap:10px;
  font-size:14px;line-height:1.55;
  padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);
  color:rgba(255,255,255,0.5);
}
.checklist li:last-child{border-bottom:none;}
.ck{width:20px;height:20px;border-radius:50%;background:rgba(48,217,192,0.15);display:flex;align-items:center;justify-content:center;color:var(--teal);font-size:10px;flex-shrink:0;margin-top:1px;}

/* ═══════════════════════════════════════════════════
   PRACTITIONER HUB
═══════════════════════════════════════════════════ */
.hub-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:1060px;margin:0 auto;}
.hub-card{
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.07);
  border-radius:var(--r);padding:28px;
  opacity:0;transform:translateY(24px);transition:all 0.4s ease;
  position:relative;overflow:hidden;
}
.hub-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.04) 0%,transparent 60%);pointer-events:none;}
.hub-card>*{position:relative;z-index:1;}
.hub-card:hover{background:rgba(255,255,255,0.07);transform:translateY(-4px)!important;}
.hub-card.vis{opacity:1;transform:translateY(0);}
.hub-icon{font-size:26px;margin-bottom:14px;}
.hub-card h4{font-size:16px;font-weight:700;color:#fff;margin-bottom:8px;letter-spacing:-0.03em;}
.hub-card p{font-size:13px;color:rgba(255,255,255,0.35);line-height:1.65;font-weight:300;}

/* ═══════════════════════════════════════════════════
   GLOBAL / LANGUAGES
═══════════════════════════════════════════════════ */
.global-section{background:var(--dark2);padding:96px 32px;position:relative;overflow:hidden;}
.globe-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;max-width:1060px;margin:0 auto;}
.globe-visual{position:relative;display:flex;align-items:center;justify-content:center;height:340px;}
.globe-orb{
  width:240px;height:240px;border-radius:50%;
  background:radial-gradient(circle at 40% 35%,rgba(10,132,255,0.7),rgba(48,217,192,0.5) 50%,rgba(191,90,242,0.3) 80%,transparent);
  box-shadow:0 0 80px rgba(10,132,255,0.2),inset 0 0 40px rgba(255,255,255,0.08);
  animation:orbPulse 5s ease-in-out infinite;
  position:relative;
}
.globe-ring{position:absolute;border-radius:50%;border:1px solid rgba(10,132,255,0.15);animation:ringExpand 4s ease-in-out infinite;}
.globe-ring.gr1{width:300px;height:300px;}
.globe-ring.gr2{width:360px;height:360px;animation-delay:1s;}
.lang-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px;}
.lang-pill{
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:980px;padding:7px 16px;
  font-size:12px;font-weight:600;color:rgba(255,255,255,0.5);
  transition:all 0.2s;cursor:default;
}
.lang-pill:hover{background:rgba(48,217,192,0.1);border-color:rgba(48,217,192,0.2);color:var(--teal);}

/* ═══════════════════════════════════════════════════
   ACCESS GATE
═══════════════════════════════════════════════════ */
.access-section{background:var(--bg2);padding:96px 32px;}
.access-inner{max-width:1060px;margin:0 auto;}
.access-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start;margin-top:0;}
.access-left h2{font-size:clamp(32px,4vw,48px);font-weight:800;letter-spacing:-0.05em;line-height:1.0;margin-bottom:18px;}
.access-left p{font-size:16px;color:var(--ink3);line-height:1.7;font-weight:300;margin-bottom:16px;}
.beta-notice{
  background:rgba(255,159,10,0.06);
  border:1px solid rgba(255,159,10,0.2);
  border-radius:12px;padding:16px 18px;margin-top:16px;
}
.bn-title{font-size:13px;font-weight:700;color:var(--orange);margin-bottom:5px;}
.bn-body{font-size:12px;color:var(--ink3);line-height:1.65;}
.access-card{
  background:var(--bg);border:1px solid var(--border);
  border-radius:var(--r);padding:36px;
  box-shadow:var(--shadow-lg);
  position:relative;overflow:hidden;
}
.access-card::before{content:'';position:absolute;inset:0;background:var(--satin);pointer-events:none;opacity:0.8;}
.access-card>*{position:relative;z-index:1;}
.access-title{font-size:22px;font-weight:800;letter-spacing:-0.04em;margin-bottom:4px;}
.access-sub{font-size:13px;color:var(--ink4);margin-bottom:22px;}
.feat-list{list-style:none;margin-bottom:24px;}
.feat-list li{display:flex;align-items:center;gap:10px;font-size:14px;color:var(--ink2);padding:8px 0;border-bottom:1px solid var(--bg3);}
.feat-list li:last-child{border-bottom:none;}
.fl-dot{width:7px;height:7px;border-radius:50%;background:var(--teal-mid);flex-shrink:0;}
.fg{margin-bottom:14px;}
.fg label{display:block;font-size:11px;font-weight:700;color:var(--ink4);letter-spacing:0.04em;text-transform:uppercase;margin-bottom:6px;}
.fi-input{
  width:100%;background:var(--bg2);border:1px solid var(--bg3);
  border-radius:10px;padding:13px 15px;font-size:14px;
  font-family:inherit;color:var(--ink);outline:none;transition:all 0.2s;
}
.fi-input:focus{border-color:var(--teal-mid);background:#fff;box-shadow:0 0 0 3px rgba(48,217,192,0.1);}
.btn-access{
  width:100%;background:var(--ink);color:#fff;
  border:none;padding:15px;border-radius:12px;
  font-size:15px;font-weight:800;font-family:inherit;
  cursor:pointer;transition:all 0.25s;
  letter-spacing:-0.02em;margin-top:4px;
}
.btn-access:hover{background:#000;transform:translateY(-2px);box-shadow:var(--shadow-md);}
.form-disclaimer{font-size:11px;color:var(--ink4);line-height:1.65;margin-top:14px;padding-top:14px;border-top:1px solid var(--bg3);}

/* ═══════════════════════════════════════════════════
   SPECIALTIES
═══════════════════════════════════════════════════ */
.spec-section{padding:80px 32px;text-align:center;}
.spec-section h2{font-size:clamp(30px,4vw,44px);font-weight:800;letter-spacing:-0.05em;margin-bottom:36px;}
.spec-tags{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;max-width:760px;margin:0 auto;}
.stag{
  background:var(--bg2);border:1px solid var(--border);
  border-radius:980px;padding:11px 24px;
  font-size:14px;font-weight:500;color:var(--ink2);
  transition:all 0.22s;cursor:default;
}
.stag:hover{background:var(--ink);color:#fff;border-color:var(--ink);transform:scale(1.03);}

/* ═══════════════════════════════════════════════════
   CTA
═══════════════════════════════════════════════════ */
.cta-wrap{margin:0 20px 20px;}
.cta-box{
  background:var(--dark);border-radius:32px;
  padding:100px 48px;text-align:center;
  position:relative;overflow:hidden;
}
.cta-box::before{
  content:'';position:absolute;top:-100px;left:50%;transform:translateX(-50%);
  width:800px;height:500px;
  background:radial-gradient(ellipse,rgba(48,217,192,0.12),transparent 65%);
}
.cta-box::after{
  content:'';position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(135deg,rgba(255,255,255,0.05) 0%,transparent 40%,rgba(48,217,192,0.04) 80%,rgba(10,132,255,0.03) 100%);
}
.cta-content{position:relative;z-index:1;max-width:640px;margin:0 auto;}
.cta-box h2{font-size:clamp(40px,7vw,72px);font-weight:900;letter-spacing:-0.05em;line-height:0.95;color:#fff;margin-bottom:20px;}
.cta-box p{font-size:17px;color:rgba(255,255,255,0.35);font-weight:300;margin-bottom:52px;letter-spacing:-0.01em;}
.email-row{display:flex;gap:10px;max-width:460px;margin:0 auto 16px;}
.ei{flex:1;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);color:#fff;font-family:inherit;font-size:15px;padding:16px 20px;border-radius:980px;outline:none;transition:all 0.2s;letter-spacing:-0.01em;}
.ei::placeholder{color:rgba(255,255,255,0.2);}
.ei:focus{border-color:var(--teal);background:rgba(255,255,255,0.1);}
.btn-teal{background:linear-gradient(135deg,var(--teal-deep),var(--teal-mid));color:#061412;border:none;cursor:pointer;padding:16px 28px;border-radius:980px;font-size:15px;font-weight:800;font-family:inherit;white-space:nowrap;transition:all 0.2s;box-shadow:0 6px 24px rgba(30,196,172,0.3);}
.btn-teal:hover{transform:scale(1.04);box-shadow:0 10px 36px rgba(30,196,172,0.45);}
.cta-fine{font-size:12px;color:rgba(255,255,255,0.16);}

/* ═══════════════════════════════════════════════════
   LEGAL
═══════════════════════════════════════════════════ */
.legal-section{padding:64px 32px;background:var(--bg2);}
.legal-inner{max-width:960px;margin:0 auto;}
.legal-title{font-size:24px;font-weight:800;letter-spacing:-0.04em;margin-bottom:28px;}
.legal-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px;}
.lc{background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm);padding:24px;position:relative;overflow:hidden;}
.lc::before{content:'';position:absolute;inset:0;background:var(--satin);pointer-events:none;opacity:0.8;}
.lc>*{position:relative;z-index:1;}
.lc-icon{font-size:24px;margin-bottom:12px;}
.lc h4{font-size:14px;font-weight:700;letter-spacing:-0.02em;margin-bottom:8px;}
.lc p{font-size:12px;color:var(--ink3);line-height:1.7;font-weight:300;}
.legal-full{background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm);padding:28px;font-size:12px;color:var(--ink3);line-height:1.9;}
.legal-full h5{font-size:11px;font-weight:800;letter-spacing:0.07em;text-transform:uppercase;color:var(--ink4);margin-top:18px;margin-bottom:7px;}
.legal-full h5:first-child{margin-top:0;}

/* ═══════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════ */
footer{padding:28px 40px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;}
.footer-left{display:flex;align-items:center;gap:14px;}
.footer-logo-img{height:24px;width:auto;object-fit:contain;opacity:0.7;}
.footer-copy{font-size:12px;color:var(--ink4);}
.footer-links{display:flex;gap:24px;flex-wrap:wrap;}
.footer-links a{font-size:12px;color:var(--ink4);text-decoration:none;transition:color 0.15s;}
.footer-links a:hover{color:var(--ink2);}

/* ═══════════════════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════════════════ */
@media(max-width:1000px){
  .flow-grid{grid-template-columns:1fr 1fr;}
  .demo-panel.active{grid-template-columns:1fr;}
  .charts-grid{grid-template-columns:1fr 1fr;}
  .bento{grid-template-columns:1fr;}
  .bc.col2{grid-column:auto;}
  .sphere-hero-row{grid-template-columns:1fr;}
  .sphere-components{grid-template-columns:1fr 1fr;}
  .hub-grid{grid-template-columns:1fr 1fr;}
  .globe-grid{grid-template-columns:1fr;}
  .access-grid{grid-template-columns:1fr;}
  .metrics-row{grid-template-columns:1fr 1fr;}
  .legal-cards{grid-template-columns:1fr 1fr;}
  .float-card{display:none;}
}
@media(max-width:640px){
  nav{padding:0 16px;}
  .nav-center{display:none;}
  .flow-grid{grid-template-columns:1fr;}
  .charts-grid{grid-template-columns:1fr;}
  .hub-grid{grid-template-columns:1fr;}
  .sphere-components{grid-template-columns:1fr;}
  .metrics-row{grid-template-columns:1fr 1fr;}
  .legal-cards{grid-template-columns:1fr;}
  .section{padding:64px 16px;}
  .sphere-section{padding:72px 16px;}
  .access-section{padding:64px 16px;}
  .cta-box{padding:64px 24px;border-radius:24px;}
  .email-row{flex-direction:column;}
  footer{flex-direction:column;text-align:center;padding:24px 16px;}
}
`

const HTML = `<!-- BETA BANNER -->
<div class="beta-banner">
  ⚠️ BETA / TESTING PHASE — <span>SomaSync AI is in pre-release. All AI outputs are for demonstration only and do not constitute medical advice or clinical documentation.</span>
</div>

<!-- NAV -->
<nav>
  <a href="#" class="nav-logo">
    <img src="/favicon.png" alt="SomaSync" class="nav-logo-img" onerror="this.style.display='none'">
    <span class="nav-logo-text">SomaSync <span>AI</span></span>
  </a>
  <ul class="nav-center">
    <li><a href="#demo">Demo</a></li>
    <li><a href="#sphere">Sphere</a></li>
    <li><a href="#analytics">Analytics</a></li>
    <li><a href="#hub">Practitioner Hub</a></li>
    <li><a href="#access">Request Access</a></li>
  </ul>
  <div class="nav-right">
    <button class="btn-outline" onclick="document.getElementById('access').scrollIntoView({behavior:'smooth'})">Dashboard Login</button>
    <button class="btn-dark" onclick="document.getElementById('access').scrollIntoView({behavior:'smooth'})">Join Waitlist</button>
  </div>
</nav>

<!-- ══════════ HERO ══════════ -->
<section class="hero">
  <div class="hero-mesh"></div>
  <div class="hero-satin"></div>
  <div class="hero-noise"></div>

  <div class="float-card fc1">
    <div style="font-size:20px;margin-bottom:4px;">🩺</div>
    <div class="fc-val">2.4s</div>
    <div class="fc-sub">Avg. SOAP generation</div>
  </div>
  <div class="float-card fc2">
    <div style="font-size:20px;margin-bottom:4px;">✅</div>
    <div class="fc-val">ICD-10</div>
    <div class="fc-sub">Auto-aligned output</div>
  </div>
  <div class="float-card fc3">
    <div style="font-size:20px;margin-bottom:4px;">🌐</div>
    <div class="fc-val">Global</div>
    <div class="fc-sub">Multilingual · Coming soon</div>
  </div>

  <div class="hero-inner">
    <div class="hero-eyebrow">
      <img src="/aaliyah-logo.png" alt="AALIYAH.IO" class="eyebrow-img" onerror="this.style.display='none'">
      <div class="eyebrow-pulse"></div>
      Introducing SomaSync AI · AALIYAH.IO
    </div>
    <h1>Intelligence<br>That <span class="grad">Listens</span></h1>
    <p class="hero-sub">From rough clinical observations to ICD-10-aligned SOAP notes — automatically, in real time. The gold standard for clinical documentation.</p>
    <div class="hero-actions">
      <a href="#demo" class="btn-hero-primary">See Live Demo →</a>
      <button class="btn-hero-ghost" onclick="document.getElementById('access').scrollIntoView({behavior:'smooth'})">Request Dashboard Access</button>
    </div>
    <div class="hero-stats">
      <div class="hero-stat">
        <div class="hero-stat-num"><span>88</span>%</div>
        <div class="hero-stat-lbl">Avg confidence score</div>
      </div>
      <div class="stat-div"></div>
      <div class="hero-stat">
        <div class="hero-stat-num"><span>3</span>×</div>
        <div class="hero-stat-lbl">Faster documentation</div>
      </div>
      <div class="stat-div"></div>
      <div class="hero-stat">
        <div class="hero-stat-num"><span>ICD</span>-10</div>
        <div class="hero-stat-lbl">Diagnostic alignment</div>
      </div>
      <div class="stat-div"></div>
      <div class="hero-stat">
        <div class="hero-stat-num"><span>β</span></div>
        <div class="hero-stat-lbl">Active beta</div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════ WAVEFORM / LIVE TRANSCRIPTION ══════════ -->
<div class="wave-section">
  <div class="wave-card">
    <div class="wave-card-inner">
      <div class="wave-label">⚡ Live Session Processing · AALIYAH Engine Active</div>
      <div class="wave-bars" id="wbars"></div>
      <div class="wave-status">
        <div class="wave-dot"></div>
        Listening for clinical observations &amp; patient feedback in real time...
      </div>
      <div class="wave-transcript">
        <div class="wt-line">
          <span class="wt-tag wt-ai">AALIYAH</span>
          Session started. Listening for contraindications and biopsychosocial markers.
        </div>
        <div class="wt-line">
          <span class="wt-tag wt-client">CLIENT</span>
          "Pain is maybe a 6 out of 10... mostly in my lower back, sometimes it shoots down my left leg."
        </div>
        <div class="wt-line">
          <span class="wt-tag wt-ai">AALIYAH</span>
          <span style="color:rgba(255,255,255,0.7);">Flagging: radicular pattern detected → <span style="color:var(--teal);">M54.42 Lumbago w/ sciatica L</span></span>
        </div>
        <div class="wt-line">
          <span class="wt-tag wt-flag">⚠ FLAG</span>
          <span style="color:rgba(255,69,58,0.8);">Biopsychosocial note: client reports high work stress, poor sleep. Document in plan.</span>
        </div>
        <div class="wt-line">
          <span class="wt-tag wt-ai">AALIYAH</span>
          SOAP note generating... ICD-10 codes confirmed. Confidence: 91.2%
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ══════════ KNOWLEDGE BASE TICKER ══════════ -->
<div class="ticker-section">
  <div class="ticker-label">Knowledge Base: <span>Data-driven intelligence from leading medical institutions — continuously updated</span></div>
  <div class="ticker-track">
    <div class="ticker-inner" id="t1"><div class="ticker-item"><div class="ticker-badge" style="background:#8c1515;color:#fff;">S</div><div><div class="ticker-logo-text">Stanford Medicine</div><span class="ticker-logo-sub">Clinical Research</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#003f8a;color:#fff;">NIH</div><div><div class="ticker-logo-text">Natl. Institutes of Health</div><span class="ticker-logo-sub">Federal Health Research</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#a51c30;color:#fff;">H</div><div><div class="ticker-logo-text">Harvard Medical School</div><span class="ticker-logo-sub">Clinical Studies</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#002d62;color:#fff;">JH</div><div><div class="ticker-logo-text">Johns Hopkins Medicine</div><span class="ticker-logo-sub">Medical Research</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#c8102e;color:#fff;">M</div><div><div class="ticker-logo-text">Mayo Clinic</div><span class="ticker-logo-sub">Applied Clinical Research</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#009cbd;color:#fff;">WHO</div><div><div class="ticker-logo-text">World Health Organization</div><span class="ticker-logo-sub">Eastern &amp; Western Medicine</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#2774ae;color:#fff;">UCLA</div><div><div class="ticker-logo-text">UCLA Health</div><span class="ticker-logo-sub">Integrative Medicine</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#004b87;color:#fff;">NCBI</div><div><div class="ticker-logo-text">PubMed / NCBI</div><span class="ticker-logo-sub">Evidence-Based Research</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#5b2d8e;color:#fff;">BPS</div><div><div class="ticker-logo-text">Biopsychosocial Model</div><span class="ticker-logo-sub">Pain Science Research</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#006747;color:#fff;">TCM</div><div><div class="ticker-logo-text">Traditional Chinese Medicine</div><span class="ticker-logo-sub">Eastern Practices</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#1a1a2e;color:#fff;">ABMP</div><div><div class="ticker-logo-text">ABMP &amp; AMTA</div><span class="ticker-logo-sub">Massage Therapy Standards</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#cc0000;color:#fff;">ICD</div><div><div class="ticker-logo-text">ICD-10 Framework</div><span class="ticker-logo-sub">Diagnostic Standards</span></div></div></div>
    <div class="ticker-inner ticker-inner2" aria-hidden="true"><div class="ticker-item"><div class="ticker-badge" style="background:#8c1515;color:#fff;">S</div><div><div class="ticker-logo-text">Stanford Medicine</div><span class="ticker-logo-sub">Clinical Research</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#003f8a;color:#fff;">NIH</div><div><div class="ticker-logo-text">Natl. Institutes of Health</div><span class="ticker-logo-sub">Federal Health Research</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#a51c30;color:#fff;">H</div><div><div class="ticker-logo-text">Harvard Medical School</div><span class="ticker-logo-sub">Clinical Studies</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#002d62;color:#fff;">JH</div><div><div class="ticker-logo-text">Johns Hopkins Medicine</div><span class="ticker-logo-sub">Medical Research</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#c8102e;color:#fff;">M</div><div><div class="ticker-logo-text">Mayo Clinic</div><span class="ticker-logo-sub">Applied Clinical Research</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#009cbd;color:#fff;">WHO</div><div><div class="ticker-logo-text">World Health Organization</div><span class="ticker-logo-sub">Eastern &amp; Western Medicine</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#2774ae;color:#fff;">UCLA</div><div><div class="ticker-logo-text">UCLA Health</div><span class="ticker-logo-sub">Integrative Medicine</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#004b87;color:#fff;">NCBI</div><div><div class="ticker-logo-text">PubMed / NCBI</div><span class="ticker-logo-sub">Evidence-Based Research</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#5b2d8e;color:#fff;">BPS</div><div><div class="ticker-logo-text">Biopsychosocial Model</div><span class="ticker-logo-sub">Pain Science Research</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#006747;color:#fff;">TCM</div><div><div class="ticker-logo-text">Traditional Chinese Medicine</div><span class="ticker-logo-sub">Eastern Practices</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#1a1a2e;color:#fff;">ABMP</div><div><div class="ticker-logo-text">ABMP &amp; AMTA</div><span class="ticker-logo-sub">Massage Therapy Standards</span></div></div><div class="ticker-item"><div class="ticker-badge" style="background:#cc0000;color:#fff;">ICD</div><div><div class="ticker-logo-text">ICD-10 Framework</div><span class="ticker-logo-sub">Diagnostic Standards</span></div></div></div>
  </div>
</div>

<!-- ══════════ HOW IT WORKS ══════════ -->
<section class="section gray" id="features">
  <div class="s-head">
    <div class="s-tag">How It Works</div>
    <h2 class="s-h2">Seamless Clinical Flow</h2>
    <p class="s-p">Four intelligent steps from rough spoken notes to reimbursement-ready documentation.</p>
  </div>
  <div class="flow-grid">
    <div class="flow-card" data-delay="0"><div class="step-n">Step 01</div><div class="flow-ico fi1">🎙</div><h3>Listen</h3><p>Captures practitioner observations, rough spoken notes, and client responses in real time via therapist earpiece and session mic.</p></div>
    <div class="flow-card" data-delay="100"><div class="step-n">Step 02</div><div class="flow-ico fi2">⚡</div><h3>Analyze</h3><p>AALIYAH interprets posture, movement, pain patterns, and biopsychosocial context with deep clinical logic trained on peer-reviewed data.</p></div>
    <div class="flow-card" data-delay="200"><div class="step-n">Step 03</div><div class="flow-ico fi3">🔄</div><h3>Translate</h3><p>Converts messy clinical observations into structured, billable diagnostic language. ICD-10 codes, CPT codes, and terminology auto-generated.</p></div>
    <div class="flow-card" data-delay="300"><div class="step-n">Step 04</div><div class="flow-ico fi4">📄</div><h3>Document</h3><p>Outputs complete SOAP notes, treatment plans, and billing-ready documentation — aligned with ICD-10 frameworks and payer standards.</p></div>
  </div>
</section>

<!-- ══════════ LIVE DEMO ══════════ -->
<section class="section dark" id="demo">
  <div class="s-head">
    <div class="s-tag">Interactive Demo</div>
    <h2 class="s-h2">See the Transformation</h2>
    <p class="s-p">Rough clinical language becomes structured, reimbursable documentation in seconds.</p>
  </div>
  <div class="demo-wrap">
    <div class="demo-tabs">
      <button class="demo-tab active" onclick="switchTab('icd')">ICD-10 Coding</button>
      <button class="demo-tab" onclick="switchTab('soap')">SOAP Note</button>
      <button class="demo-tab" onclick="switchTab('billing')">Billing Ready</button>
    </div>

    <!-- ICD-10 -->
    <div class="demo-panel active" id="panel-icd">
      <div class="demo-in-card">
        <div class="chrome-bar"><div class="cdot r"></div><div class="cdot y"></div><div class="cdot g"></div><span class="clabel">Rough Input</span></div>
        <div class="raw-body">
          <div class="raw-line"><span class="qm">"</span>Client has low back tightness, worse mornings<span class="qm">"</span></div>
          <div class="raw-line"><span class="qm">"</span>Hypertonicity throughout lumbar paraspinals bilaterally<span class="qm">"</span></div>
          <div class="raw-line"><span class="qm">"</span>Pain increases with forward flexion, relief in extension<span class="qm">"</span></div>
          <div class="raw-line"><span class="qm">"</span>Radiating discomfort into left glute, rates 7/10<span class="qm">"</span></div>
        </div>
      </div>
      <div class="out-card">
        <div class="chrome-bar"><div class="cdot r"></div><div class="cdot y"></div><div class="cdot g"></div><span class="clabel" style="color:#3a3f4a;">⚡ ICD-10 Output</span></div>
        <div class="icd-list">
          <div class="icd-row" style="animation-delay:0.1s"><span class="badge bg-t">M54.5</span><span class="icd-name">Low back pain</span></div>
          <div class="icd-row" style="animation-delay:0.2s"><span class="badge bg-b">M62.838</span><span class="icd-name">Muscle spasm, lumbar</span></div>
          <div class="icd-row" style="animation-delay:0.3s"><span class="badge bg-o">R29.3</span><span class="icd-name">Abnormal posture</span></div>
          <div class="icd-row" style="animation-delay:0.4s"><span class="badge bg-p">M54.42</span><span class="icd-name">Lumbago w/ sciatica, left</span></div>
        </div>
        <div class="conf-section">
          <div class="conf-row"><span class="conf-key">Accuracy</span><div class="conf-track"><div class="conf-fill" style="width:88.5%;background:linear-gradient(90deg,#0aab94,#30d9c0);"></div></div><span class="conf-pct" style="color:#30d9c0;">88.5%</span></div>
          <div class="conf-row"><span class="conf-key">Specificity</span><div class="conf-track"><div class="conf-fill" style="width:82%;background:linear-gradient(90deg,#0050c8,#6ab5ff);"></div></div><span class="conf-pct" style="color:#6ab5ff;">82.0%</span></div>
          <div class="conf-row"><span class="conf-key">Billability</span><div class="conf-track"><div class="conf-fill" style="width:91%;background:linear-gradient(90deg,#b05a00,#ffb340);"></div></div><span class="conf-pct" style="color:#ffb340;">91.0%</span></div>
        </div>
      </div>
    </div>

    <!-- SOAP -->
    <div class="demo-panel" id="panel-soap">
      <div class="demo-in-card">
        <div class="chrome-bar"><div class="cdot r"></div><div class="cdot y"></div><div class="cdot g"></div><span class="clabel">Rough Notes</span></div>
        <div class="raw-body">
          <div class="raw-line"><span class="qm">"</span>Saw Sarah today, neck and shoulder stuff again<span class="qm">"</span></div>
          <div class="raw-line"><span class="qm">"</span>Pain 6/10, 2 weeks, desk job, high stress<span class="qm">"</span></div>
          <div class="raw-line"><span class="qm">"</span>Tight traps and levator, left worse, some head pain<span class="qm">"</span></div>
          <div class="raw-line"><span class="qm">"</span>Worked traps, NMT levator, passive stretch finish<span class="qm">"</span></div>
        </div>
      </div>
      <div class="soap-out">
        <div class="chrome-bar" style="background:var(--bg2);border-bottom:1px solid var(--border);"><div class="cdot r"></div><div class="cdot y"></div><div class="cdot g"></div><span class="clabel">Generated SOAP Note</span></div>
        <div class="soap-body">
          <div class="soap-block"><span class="soap-lbl sl-s">S — Subjective</span><p class="soap-text">Client presents with <strong>bilateral cervical and upper trapezius pain</strong>, rated 6/10, onset ~2 weeks. Attributes to prolonged desk posture and occupational stress. Reports associated <strong>tension-type headaches</strong>.</p></div>
          <div class="soap-block"><span class="soap-lbl sl-o">O — Objective</span><p class="soap-text">Palpation reveals <strong>significant hypertonicity in bilateral upper trapezius</strong>, left greater than right, with active trigger points in left levator scapulae. ROM restricted in left lateral flexion and rotation.</p></div>
          <div class="soap-block"><span class="soap-lbl sl-a">A — Assessment</span><p class="soap-text"><strong>M54.2 Cervicalgia</strong> with associated myofascial dysfunction (M79.3). Postural strain consistent with prolonged flexion loading. Left levator involvement contributing to referred cephalic symptoms.</p></div>
          <div class="soap-block"><span class="soap-lbl sl-p">P — Plan</span><p class="soap-text">NMT to bilateral upper trapezius. Specific NMT protocol left levator scapulae and cervical paraspinals. Passive cervical stretch. Client education on ergonomics. <strong>Reassess in 1 week.</strong></p></div>
        </div>
      </div>
    </div>

    <!-- Billing -->
    <div class="demo-panel" id="panel-billing">
      <div class="demo-in-card">
        <div class="chrome-bar"><div class="cdot r"></div><div class="cdot y"></div><div class="cdot g"></div><span class="clabel">Session Input</span></div>
        <div class="raw-body">
          <div class="raw-line"><span class="qm">"</span>60 min deep tissue, focus lower back and hips<span class="qm">"</span></div>
          <div class="raw-line"><span class="qm">"</span>Myofascial release, glute med trigger points<span class="qm">"</span></div>
          <div class="raw-line"><span class="qm">"</span>Client on workers comp claim — State Farm<span class="qm">"</span></div>
          <div class="raw-line"><span class="qm">"</span>Improvement noted, less pain on gait assessment<span class="qm">"</span></div>
        </div>
      </div>
      <div class="out-card">
        <div class="chrome-bar"><div class="cdot r"></div><div class="cdot y"></div><div class="cdot g"></div><span class="clabel" style="color:#3a3f4a;">💰 Billing Output</span></div>
        <div class="icd-list">
          <div class="icd-row" style="animation-delay:0.1s"><span class="badge bg-t">97124</span><span class="icd-name">Massage therapy · 60 min</span></div>
          <div class="icd-row" style="animation-delay:0.2s"><span class="badge bg-b">97140</span><span class="icd-name">Manual therapy techniques</span></div>
          <div class="icd-row" style="animation-delay:0.3s"><span class="badge bg-o">M54.5</span><span class="icd-name">Low back pain — Primary Dx</span></div>
          <div class="icd-row" style="animation-delay:0.4s"><span class="badge bg-g">M79.3</span><span class="icd-name">Myofascial pain syndrome</span></div>
        </div>
        <div class="conf-section">
          <div class="conf-row"><span class="conf-key">Billability</span><div class="conf-track"><div class="conf-fill" style="width:94%;background:linear-gradient(90deg,#1a8c36,#34c759);"></div></div><span class="conf-pct" style="color:#34c759;">94%</span></div>
          <div class="conf-row"><span class="conf-key">Compliance</span><div class="conf-track"><div class="conf-fill" style="width:91%;background:linear-gradient(90deg,#0aab94,#30d9c0);"></div></div><span class="conf-pct" style="color:#30d9c0;">91%</span></div>
        </div>
      </div>
    </div>
  </div>
  <p style="text-align:center;font-size:11px;color:rgba(255,255,255,0.2);margin-top:20px;font-style:italic;">Illustrative example only. Final diagnosis remains clinician decision. Not for clinical use during beta.</p>
</section>

<!-- ══════════ SOMASYNC SPHERE ══════════ -->
<section class="sphere-section" id="sphere">
  <div class="sphere-satin"></div>
  <div class="sphere-grid-inner" style="position:relative;z-index:1;">
    <div class="s-head" style="margin-bottom:52px;">
      <div class="s-tag">Product Roadmap</div>
      <h2 class="s-h2" style="color:#fff;">Introducing<br><em style="font-family:'Playfair Display',serif;background:linear-gradient(125deg,var(--teal),var(--blue));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">SomaSync Sphere™</em></h2>
      <p class="s-p">The complete clinical intelligence ecosystem — from the table to the chart.</p>
    </div>
    <div class="sphere-hero-row">
      <div class="sphere-text">
        <p>SomaSync Sphere is the full-package upgrade. A precision-engineered ecosystem designed to capture patient data, assist the therapist hands-free, and produce professional-grade documentation — all in real time, all without lifting a pen.</p>
        <p>Three components. One seamless system. Built for the modern clinical practice.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;">
          <span style="background:rgba(48,217,192,0.1);border:1px solid rgba(48,217,192,0.2);color:var(--teal);font-size:12px;font-weight:700;padding:6px 14px;border-radius:980px;letter-spacing:0.03em;">Production Roadmap 2026</span>
          <span style="background:rgba(255,159,10,0.1);border:1px solid rgba(255,159,10,0.2);color:var(--orange);font-size:12px;font-weight:700;padding:6px 14px;border-radius:980px;letter-spacing:0.03em;">Patent Pending</span>
        </div>
      </div>
      <div class="sphere-visual">
        <div class="orb-ring r1"></div>
        <div class="orb-ring r2"></div>
        <div class="orb-ring r3"></div>
        <div class="sphere-orb"></div>
        <div class="orb-label l1">🎧 Earpiece</div>
        <div class="orb-label l2">📡 Table Sensor</div>
        <div class="orb-label l3">📊 Dashboard</div>
      </div>
    </div>
    <div class="sphere-components">
      <div class="sc-card" data-delay="0">
        <div class="sc-icon">🎧</div>
        <span class="sc-badge" style="background:rgba(48,217,192,0.1);color:var(--teal);">Component 01</span>
        <h4>Therapist Earpiece</h4>
        <p>Sleek, discreet Bluetooth earpiece worn by the therapist. AALIYAH whispers real-time assistance — flagging contraindications, suggesting questions, and transcribing client feedback during active bodywork. Completely hands-free.</p>
      </div>
      <div class="sc-card" data-delay="100">
        <div class="sc-icon">📡</div>
        <span class="sc-badge" style="background:rgba(10,132,255,0.1);color:var(--blue);">Component 02</span>
        <h4>Table Sensor Device</h4>
        <p>A sleek, branded device placed centered underneath the massage table. Captures the client's physiological responses, movement patterns, and vocal feedback in real time during the actual bodywork session — invisibly and precisely.</p>
      </div>
      <div class="sc-card" data-delay="200">
        <div class="sc-icon">🖥</div>
        <span class="sc-badge" style="background:rgba(191,90,242,0.1);color:var(--purple);">Component 03</span>
        <h4>Dashboard Portal</h4>
        <p>The full AALIYAH.IO dashboard interface — a therapist portal for securely saving patient session data, reviewing AI-generated SOAP notes, managing ICD-10 codes, and completing documentation between sessions or in real time.</p>
      </div>
    </div>
  </div>
</section>

<!-- ══════════ COMING SOON FEATURES MARQUEE ══════════ -->
<div class="features-marquee">
  <div class="features-marquee-label">Coming in Production Release · SomaSync AI Full Feature Set</div>
  <div class="marquee-track">
    <div class="marquee-row" id="mrow1">
      <div class="feature-pill"><span class="fp-dot" style="background:var(--teal);"></span>Real-Time Contraindication Detection</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--blue);"></span>SOAP Note Auto-Generation</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--purple);"></span>ICD-10 Auto-Coding · Confidence Scoring</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--orange);"></span>Biopsychosocial Intake Analysis</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--green);"></span>Therapist Journal + Session Notes</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--teal);"></span>Bluetooth Earpiece Integration</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--blue);"></span>Table Sensor Physiological Capture</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--red);"></span>Consent & Liability Form Library</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--purple);"></span>Assessment Sheet Builder</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--orange);"></span>EHR / Billing Workflow Export</div>
    </div>
    <div class="marquee-row" id="mrow1b" aria-hidden="true">
      <div class="feature-pill"><span class="fp-dot" style="background:var(--teal);"></span>Real-Time Contraindication Detection</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--blue);"></span>SOAP Note Auto-Generation</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--purple);"></span>ICD-10 Auto-Coding · Confidence Scoring</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--orange);"></span>Biopsychosocial Intake Analysis</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--green);"></span>Therapist Journal + Session Notes</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--teal);"></span>Bluetooth Earpiece Integration</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--blue);"></span>Table Sensor Physiological Capture</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--red);"></span>Consent & Liability Form Library</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--purple);"></span>Assessment Sheet Builder</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--orange);"></span>EHR / Billing Workflow Export</div>
    </div>
  </div>
  <div class="marquee-track" style="margin-top:14px;">
    <div class="marquee-row marquee-row2">
      <div class="feature-pill"><span class="fp-dot" style="background:var(--green);"></span>Client-Therapist Secure Messaging</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--teal);"></span>Multi-Language Support · East to West</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--blue);"></span>Treatment Plan Builder</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--purple);"></span>Secure Patient Portal</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--orange);"></span>Workers Comp Documentation Suite</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--green);"></span>Eastern ↔ Western Medicine Bridge</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--teal);"></span>PDF Export · All Documents</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--blue);"></span>Analytics Dashboard · Practice Metrics</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--red);"></span>HIPAA-Compliant Secure Storage</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--purple);"></span>Continuing Education Integration</div>
    </div>
    <div class="marquee-row marquee-row2" aria-hidden="true">
      <div class="feature-pill"><span class="fp-dot" style="background:var(--green);"></span>Client-Therapist Secure Messaging</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--teal);"></span>Multi-Language Support · East to West</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--blue);"></span>Treatment Plan Builder</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--purple);"></span>Secure Patient Portal</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--orange);"></span>Workers Comp Documentation Suite</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--green);"></span>Eastern ↔ Western Medicine Bridge</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--teal);"></span>PDF Export · All Documents</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--blue);"></span>Analytics Dashboard · Practice Metrics</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--red);"></span>HIPAA-Compliant Secure Storage</div>
      <div class="feature-pill"><span class="fp-dot" style="background:var(--purple);"></span>Continuing Education Integration</div>
    </div>
  </div>
</div>

<!-- ══════════ ANALYTICS ══════════ -->
<section class="section gray" id="analytics">
  <div class="s-head">
    <div class="s-tag">Practice Analytics</div>
    <h2 class="s-h2">Data That Drives Better Care</h2>
    <p class="s-p">SomaSync tracks documentation quality, coding accuracy, and practice performance — giving you the insights investors and payers want to see.</p>
  </div>
  <div class="metrics-row">
    <div class="metric-card" data-delay="0"><div class="metric-val"><span>88</span>%</div><div class="metric-lbl">Avg. confidence score</div><div class="metric-delta">↑ 14% since onboarding</div></div>
    <div class="metric-card" data-delay="80"><div class="metric-val"><span>3.1</span>×</div><div class="metric-lbl">Faster documentation</div><div class="metric-delta">↑ 2.1× from manual baseline</div></div>
    <div class="metric-card" data-delay="160"><div class="metric-val"><span>94</span>%</div><div class="metric-lbl">First-pass billing accuracy</div><div class="metric-delta">↑ vs. 71% industry avg.</div></div>
    <div class="metric-card" data-delay="240"><div class="metric-val"><span>∞</span></div><div class="metric-lbl">Knowledge updates</div><div class="metric-delta">Continuously learning</div></div>
  </div>
  <div class="charts-grid">
    <div class="chart-card" data-delay="0"><div class="ct">Documentation Speed</div><div class="cs">Minutes saved per session (weekly)</div><div class="cc"><canvas id="speedChart"></canvas></div></div>
    <div class="chart-card" data-delay="100"><div class="ct">ICD-10 Accuracy Trend</div><div class="cs">Confidence score over 8 weeks</div><div class="cc"><canvas id="accChart"></canvas></div></div>
    <div class="chart-card" data-delay="200"><div class="ct">Top Diagnoses Coded</div><div class="cs">Most frequent conditions this month</div><div class="cc"><canvas id="dxChart"></canvas></div></div>
  </div>
  <div class="big-chart">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
      <div><div class="ct">Session Volume vs. Documentation Time</div><div class="cs">Monthly sessions processed vs. avg. minutes per note</div></div>
      <div class="chart-legend">
        <div class="cl-item"><div class="cl-dot" style="background:var(--teal-mid);"></div>Sessions processed</div>
        <div class="cl-item"><div class="cl-dot" style="background:var(--blue);"></div>Avg. doc time (min)</div>
      </div>
    </div>
    <div class="bcc"><canvas id="bigChart"></canvas></div>
  </div>
</section>

<!-- ══════════ FEATURES BENTO ══════════ -->
<section class="section">
  <div class="s-head">
    <div class="s-tag">Why SomaSync</div>
    <h2 class="s-h2">Built Different. Built Right.</h2>
    <p class="s-p">The only AI documentation platform built specifically for manual therapists — trained on real clinical data, aligned with the standards payers and state boards actually use.</p>
  </div>
  <div class="bento">
    <div class="bc ink vis" style="transition-delay:0s">
      <div class="bc-tag">Clinical Intelligence</div>
      <h3>Not Transcription.<br>Not Generic AI.</h3>
      <p>SomaSync doesn't just record and replay. It understands the clinical logic behind observations — trained on Stanford, NIH, and peer-reviewed data — and maps them to reimbursable language automatically.</p>
      <ul class="checklist">
        <li><div class="ck">✓</div>ICD-10 & CPT aligned documentation</li>
        <li><div class="ck">✓</div>Biopsychosocial model integration</li>
        <li><div class="ck">✓</div>Eastern & Western medicine knowledge base</li>
        <li><div class="ck">✓</div>Continuously updated LLM — never static</li>
        <li><div class="ck">✓</div>State board & ABMP/AMTA compliance awareness</li>
      </ul>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div class="bc vis" style="transition-delay:0.1s">
        <div class="bc-tag">Clinician First</div>
        <h3>Built for Manual Therapists</h3>
        <p>Not a retrofitted generic AI. Every decision made for neuromuscular, massage, and manual therapy workflows. It speaks your clinical language.</p>
      </div>
      <div class="bc vis" style="transition-delay:0.2s">
        <div class="bc-tag">Privacy Core</div>
        <h3>Enterprise Security</h3>
        <p>HIPAA-aligned architecture. End-to-end encryption. Zero data retention in beta. Your clients are protected at every step.</p>
      </div>
    </div>
  </div>
</section>

<!-- ══════════ PRACTITIONER HUB ══════════ -->
<section class="section dark2" id="hub">
  <div class="s-head">
    <div class="s-tag">Practitioner Hub</div>
    <h2 class="s-h2">Everything You Need.<br>One Place.</h2>
    <p class="s-p">The AALIYAH.IO Practitioner Hub is your complete clinical command center — from intake to invoice, from consent to communication.</p>
  </div>
  <div class="hub-grid">
    <div class="hub-card" data-delay="0"><div class="hub-icon">📋</div><h4>Document Library</h4><p>Consent forms, liability waivers, SOAP note templates, assessment sheets, intake forms — all accessible, fillable, and exportable as professional PDFs instantly.</p></div>
    <div class="hub-card" data-delay="80"><div class="hub-icon">🧾</div><h4>Clinical Documentation</h4><p>AI-generated SOAP notes reviewed, proofread, and structured into professional documentation ready for billing, insurance submission, or treatment planning.</p></div>
    <div class="hub-card" data-delay="160"><div class="hub-icon">💬</div><h4>Client-Therapist Messaging</h4><p>Secure instant messaging portal. Send consent requests, intake forms, session recaps, and appointment reminders directly to clients — completely hands-free.</p></div>
    <div class="hub-card" data-delay="240"><div class="hub-icon">📓</div><h4>Therapist Journal</h4><p>Private session notes, personal observations, and professional reflections. AI-assisted organization and trend analysis. Your thoughts, structured and searchable.</p></div>
    <div class="hub-card" data-delay="320"><div class="hub-icon">📈</div><h4>Treatment Plans</h4><p>Build and track multi-session treatment plans with goal-setting, progress notes, and outcome tracking — aligned with evidence-based standards and payer requirements.</p></div>
    <div class="hub-card" data-delay="400"><div class="hub-icon">🌐</div><h4>East ↔ West Medicine Bridge</h4><p>A growing knowledge portal connecting Eastern and Western clinical modalities — TCM, Ayurveda, NMT, orthopedic massage — with cross-referenced diagnostic frameworks.</p></div>
  </div>
</section>

<!-- ══════════ GLOBAL / LANGUAGES ══════════ -->
<section class="global-section">
  <div class="globe-grid">
    <div>
      <div class="s-tag" style="color:var(--teal);background:rgba(48,217,192,0.08);">Global Vision</div>
      <h2 style="font-size:clamp(36px,5vw,54px);font-weight:800;letter-spacing:-0.05em;color:#fff;margin-bottom:20px;line-height:1.0;">Nation to Nation.<br>East to West.<br>And Back Around.</h2>
      <p style="font-size:16px;color:rgba(255,255,255,0.38);line-height:1.7;font-weight:300;margin-bottom:28px;">SomaSync AI is built to transcend borders. We're expanding multilingual support so practitioners worldwide can document in their language, with the same intelligence, the same accuracy, the same standard of care.</p>
      <div class="lang-pills">
        <span class="lang-pill">🇺🇸 English</span>
        <span class="lang-pill">🇪🇸 Español</span>
        <span class="lang-pill">🇫🇷 Français</span>
        <span class="lang-pill">🇨🇳 中文</span>
        <span class="lang-pill">🇯🇵 日本語</span>
        <span class="lang-pill">🇧🇷 Português</span>
        <span class="lang-pill">🇩🇪 Deutsch</span>
        <span class="lang-pill">🇰🇷 한국어</span>
        <span class="lang-pill">🇸🇦 العربية</span>
        <span class="lang-pill">🇮🇳 हिंदी</span>
        <span class="lang-pill">+ More Coming</span>
      </div>
    </div>
    <div class="globe-visual">
      <div class="globe-ring gr1"></div>
      <div class="globe-ring gr2"></div>
      <div class="globe-orb"></div>
    </div>
  </div>
</section>

<!-- ══════════ SPECIALTIES ══════════ -->
<section class="spec-section">
  <h2>Built For Your Practice</h2>
  <div class="spec-tags">
    <span class="stag">Neuromuscular Therapy</span>
    <span class="stag">Medical Massage</span>
    <span class="stag">Sports & Injury Recovery</span>
    <span class="stag">Postural Assessment</span>
    <span class="stag">Workers' Compensation</span>
    <span class="stag">Personal Injury</span>
    <span class="stag">Orthopedic Massage</span>
    <span class="stag">Manual Therapy</span>
    <span class="stag">Lymphatic Drainage</span>
    <span class="stag">Craniosacral Therapy</span>
  </div>
</section>

<!-- ══════════ ACCESS GATE ══════════ -->
<section class="access-section" id="access">
  <div class="access-inner">
    <div class="s-head" style="margin-bottom:52px;">
      <div class="s-tag">AALIYAH.IO Dashboard</div>
      <h2 class="s-h2">Request Access to the Full Platform</h2>
      <p class="s-p">Closed beta — SOAP generator, ICD-10 coder, Sphere integration, and the full Practitioner Hub. Access granted by review within 48 hours.</p>
    </div>
    <div class="access-grid">
      <div class="access-left">
        <img src="/aaliyah-logo.png" alt="AALIYAH.IO" style="height:36px;width:auto;margin-bottom:20px;opacity:0.85;" onerror="this.style.display='none'">
        <h2>Your Clinical Assistant<br><em style="font-weight:300;font-style:italic;">is Ready.</em></h2>
        <p>The AALIYAH.IO dashboard is a closed MVP beta. Approved practitioners receive full access to the SomaSync AI documentation suite — live SOAP generation, ICD-10 coding, confidence scoring, and export-ready clinical notes.</p>
        <p>Fill out the form. Access is granted within 48 hours for qualified applicants. No payment required during beta.</p>
        <div class="beta-notice">
          <div class="bn-title">⚠️ Beta Testing Notice</div>
          <div class="bn-body">All features are in active development. AI outputs should be reviewed and verified by a licensed clinician before use in any clinical, billing, or legal context. This platform does not replace clinical judgment.</div>
        </div>
      </div>
      <div class="access-card">
        <div class="access-title">Request Dashboard Access</div>
        <div class="access-sub">AALIYAH.IO · SomaSync MVP Beta</div>
        <ul class="feat-list">
          <li><div class="fl-dot"></div>SOAP Note Generator (AI-powered, real-time)</li>
          <li><div class="fl-dot"></div>ICD-10 Auto-Coding with confidence scores</li>
          <li><div class="fl-dot"></div>Practice Analytics Dashboard</li>
          <li><div class="fl-dot"></div>Billing Code Suggestions</li>
          <li><div class="fl-dot"></div>Practitioner Hub (documents, forms, journal)</li>
          <li><div class="fl-dot"></div>Early access to SomaSync Sphere™ beta</li>
        </ul>
        <div class="fg"><label>Full Name</label><input class="fi-input" type="text" placeholder="Your full name"></div>
        <div class="fg"><label>Email Address</label><input class="fi-input" type="email" placeholder="you@practice.com"></div>
        <div class="fg"><label>Profession / Specialty</label><input class="fi-input" type="text" placeholder="e.g. NMT, LMT, Sports Therapist, PT"></div>
        <div class="fg"><label>State / Country of Practice</label><input class="fi-input" type="text" placeholder="e.g. California, USA"></div>
        <div class="fg"><label>How did you hear about us?</label><input class="fi-input" type="text" placeholder="Referral, social media, conference..."></div>
        <button class="btn-access" id="accessBtn">Request Access →</button>
        <div class="form-disclaimer">By submitting you acknowledge SomaSync AI is a beta product for demonstration and testing only. AI-generated outputs are not a substitute for professional clinical judgment. See full disclaimers below.</div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════ CTA ══════════ -->
<div class="cta-wrap">
  <div class="cta-box">
    <div class="cta-content">
      <h2>Join the Future<br>of Clinical Notes</h2>
      <p>Get early access to the documentation tool that pays for itself. Built by a therapist, for therapists.</p>
      <div class="email-row">
        <input class="ei" type="email" placeholder="Enter your email address" id="ctaEmail">
        <button class="btn-teal" onclick="handleCTA()">Join Waitlist</button>
      </div>
      <p class="cta-fine">Limited beta spots. No spam. No payment during beta. Cancel anytime.</p>
    </div>
  </div>
</div>

<!-- ══════════ LEGAL ══════════ -->
<section class="legal-section">
  <div class="legal-inner">
    <div class="legal-title">Legal & AI Disclaimers</div>
    <div class="legal-cards">
      <div class="lc"><div class="lc-icon">🤖</div><h4>AI-Generated Content</h4><p>All documentation produced by SomaSync AI is generated by artificial intelligence and may contain errors or clinically inaccurate information. All outputs must be reviewed and verified by a licensed clinician before use in any clinical, billing, or legal context.</p></div>
      <div class="lc"><div class="lc-icon">⚕️</div><h4>Not Medical Advice</h4><p>SomaSync AI does not provide medical advice, diagnosis, or treatment. AI-generated SOAP notes and ICD-10 codes are suggestions only and do not replace the professional judgment of a licensed healthcare provider.</p></div>
      <div class="lc"><div class="lc-icon">🔬</div><h4>Beta / Testing Phase</h4><p>This product is in beta testing and is not approved for regulated clinical use. Features, accuracy, and outputs may change without notice. Use in live billing or medical records is at the practitioner's sole discretion and risk.</p></div>
    </div>
    <div class="legal-full">
      <h5>Full AI & Clinical Disclaimer</h5>
      SomaSync AI ("the Platform") is an artificial intelligence-powered documentation assistance tool developed by AALIYAH.IO. The Platform is designed to assist licensed healthcare and manual therapy practitioners in drafting clinical notes and identifying potentially relevant diagnostic codes. THE PLATFORM DOES NOT PROVIDE MEDICAL ADVICE AND IS NOT A LICENSED MEDICAL DEVICE.
      <h5>No Clinical Reliance</h5>
      Outputs generated by the Platform — including SOAP notes, ICD-10 code suggestions, CPT code suggestions, and confidence scores — are provided for informational and administrative assistance purposes only. These outputs are NOT a substitute for professional clinical evaluation, diagnosis, or treatment planning. A licensed clinician must review, verify, and take full responsibility for all documentation before use in any clinical, legal, billing, or insurance context.
      <h5>Billing & Coding Disclaimer</h5>
      ICD-10 and CPT code suggestions are not guaranteed to be accurate, complete, or appropriate for any specific patient or payer. The Platform does not guarantee reimbursement. Practitioners are solely responsible for ensuring accuracy and compliance with applicable federal, state, and payer regulations.
      <h5>Beta Software Notice</h5>
      SomaSync AI is in pre-release beta testing. The software is provided "as is" without warranty of any kind. AALIYAH.IO makes no representations regarding accuracy, reliability, or fitness for a particular purpose. Use during beta is at the user's sole risk.
      <h5>Privacy & HIPAA</h5>
      Users are responsible for ensuring that any patient information entered into the Platform complies with applicable privacy laws, including HIPAA. Do not enter identifiable patient information during the beta testing phase unless appropriate data use agreements are in place.
      <h5>Knowledge Base</h5>
      SomaSync AI's knowledge base draws from publicly available peer-reviewed research, clinical guidelines, and published medical literature including sources from NIH, Stanford, WHO, and related institutions. References to these institutions do not imply endorsement, affiliation, or partnership. The Platform continuously updates its training data to improve accuracy and compliance with current standards.
      <h5>Limitation of Liability</h5>
      To the maximum extent permitted by applicable law, AALIYAH.IO shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from use of or reliance on AI-generated outputs from this Platform.
      <h5>Contact</h5>
      For questions regarding access, disclaimers, or data practices, submit a request through the AALIYAH.IO dashboard access form. © 2026 AALIYAH.IO. All rights reserved.
    </div>
  </div>
</section>

<!-- ══════════ FOOTER ══════════ -->
<footer>
  <div class="footer-left">
    <img src="/favicon.png" alt="SomaSync" class="footer-logo-img" onerror="this.style.display='none'">
    <img src="/aaliyah-logo.png" alt="AALIYAH.IO" class="footer-logo-img" onerror="this.style.display='none'">
    <span class="footer-copy">© 2026 AALIYAH.IO · SomaSync AI. All rights reserved.</span>
  </div>
  <div class="footer-links">
    <a href="#">Privacy Policy</a>
    <a href="#">Terms of Use</a>
    <a href="#">AI Disclaimer</a>
    <a href="#access">Request Access</a>
    <a href="#sphere">Sphere™</a>
    <a href="#">Contact</a>
  </div>
</footer>

<!-- ══════════ SCRIPTS ══════════ -->
<script>
/* WAVEFORM */
const wbars = document.getElementById('wbars');
[10,14,20,28,38,50,58,68,72,78,84,80,88,84,80,88,80,72,80,86,78,68,60,50,42,34,26,18,12,10].forEach((h,i)=>{
  const b=document.createElement('div');b.className='wbar';
  b.style.cssText=\`height:\${h}px;animation-delay:\${(i*0.055).toFixed(2)}s\`;
  wbars.appendChild(b);
});

/* DEMO TABS */
function switchTab(id){
  document.querySelectorAll('.demo-tab').forEach((t,i)=>t.classList.toggle('active',['icd','soap','billing'][i]===id));
  document.querySelectorAll('.demo-panel').forEach(p=>p.classList.toggle('active',p.id===\`panel-\${id}\`));
}

/* SCROLL REVEAL */
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const d=+(e.target.dataset.delay||0);
      setTimeout(()=>e.target.classList.add('vis'),d);
      io.unobserve(e.target);
    }
  });
},{threshold:0.08});
document.querySelectorAll('.flow-card,.chart-card,.big-chart,.bc,.sc-card,.hub-card,.metric-card').forEach(el=>{
  if(!el.classList.contains('vis'))io.observe(el);
});

/* CHARTS */
const tealGrad=(ctx,a,b)=>{const g=ctx.createLinearGradient(0,0,0,200);g.addColorStop(0,a);g.addColorStop(1,b);return g;};

// Speed
const sc=document.getElementById('speedChart').getContext('2d');
new Chart(sc,{type:'bar',data:{
  labels:['Mon','Tue','Wed','Thu','Fri','Sat'],
  datasets:[{data:[18,22,19,25,28,24],backgroundColor:'rgba(48,217,192,0.15)',borderColor:'#1fc4ac',borderWidth:2,borderRadius:8}]
},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:10,family:'Inter'},color:'#a1a1a6'}},y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:10,family:'Inter'},color:'#a1a1a6'}}}}});

// Accuracy
const ac=document.getElementById('accChart').getContext('2d');
const aGrad=ac.createLinearGradient(0,0,0,160);aGrad.addColorStop(0,'rgba(10,132,255,0.15)');aGrad.addColorStop(1,'rgba(10,132,255,0)');
new Chart(ac,{type:'line',data:{
  labels:['W1','W2','W3','W4','W5','W6','W7','W8'],
  datasets:[{data:[74,78,80,82,83,85,87,88.5],borderColor:'#0a84ff',backgroundColor:aGrad,borderWidth:2.5,tension:0.4,fill:true,pointBackgroundColor:'#0a84ff',pointRadius:3}]
},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:10,family:'Inter'},color:'#a1a1a6'}},y:{min:65,max:100,grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:10,family:'Inter'},color:'#a1a1a6'}}}}});

// Donut
new Chart(document.getElementById('dxChart'),{type:'doughnut',data:{
  labels:['Cervicalgia','Low Back','Myalgia','Sciatica','Other'],
  datasets:[{data:[28,34,18,12,8],backgroundColor:['#30d9c0','#0a84ff','#ff9f0a','#bf5af2','#e8e8ed'],borderWidth:0,hoverOffset:6}]
},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,position:'bottom',labels:{font:{size:10,family:'Inter'},color:'#6e6e73',boxWidth:10,padding:8}}}}});

// Big chart
new Chart(document.getElementById('bigChart'),{type:'bar',data:{
  labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  datasets:[
    {label:'Sessions',data:[42,58,64,72,80,88,94,102,110,98,115,124],backgroundColor:'rgba(48,217,192,0.15)',borderColor:'#1fc4ac',borderWidth:2,borderRadius:8,yAxisID:'y'},
    {label:'Avg Doc Time (min)',data:[18,16,15,14,12,11,10,9,9,8,8,7],type:'line',borderColor:'#0a84ff',backgroundColor:'rgba(10,132,255,0.08)',borderWidth:2.5,tension:0.4,fill:true,pointBackgroundColor:'#0a84ff',pointRadius:3,yAxisID:'y1'}
  ]
},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{
  x:{grid:{display:false},ticks:{font:{size:11,family:'Inter'},color:'#a1a1a6'}},
  y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:11,family:'Inter'},color:'#a1a1a6'},position:'left'},
  y1:{grid:{display:false},ticks:{font:{size:11,family:'Inter'},color:'#6ab5ff'},position:'right'}
}}});

/* FORMS */
document.getElementById('accessBtn').addEventListener('click',()=>{
  const btn=document.getElementById('accessBtn');
  const name=document.querySelector('.fi-input[type="text"]')?.value||'';
  const email=document.querySelector('.fi-input[type="email"]')?.value||'';
  const specialty=document.querySelectorAll('.fi-input[type="text"]')[1]?.value||'';
  const state=document.querySelectorAll('.fi-input[type="text"]')[2]?.value||'';
  if(!email.includes('@')){alert('Please enter a valid email address.');return;}
  SA.track('access_request',{name,email,specialty,state,timestamp:new Date().toISOString()});
  btn.textContent='✓ Request Submitted — We\\'ll review and respond within 48 hours';
  btn.style.background='#34c759';btn.disabled=true;
});
function handleCTA(){
  const el=document.getElementById('ctaEmail');
  if(el.value.includes('@')){
    SA.track('waitlist_signup',{email:el.value,source:'cta_bottom',timestamp:new Date().toISOString()});
    el.value='';el.placeholder='✓ You\\'re on the list!';
    document.querySelector('.btn-teal').textContent='Done ✓';
    document.querySelector('.btn-teal').style.background='#34c759';
  }
}
</script>

<!-- ════════════════════════════════════════════════
     SOMASYNC ANALYTICS ENGINE
     Tracks: sessions, scroll depth, geo, clicks,
     demo interactions, time on page, tab switches
     Stores to localStorage + optional webhook
════════════════════════════════════════════════ -->
<script>
(function(){
'use strict';

/* ── CONFIG ─────────────────────────────── */
const CONFIG = {
  appName: 'SomaSync AI',
  version: '1.0.0',
  webhookUrl: null, // Set to your endpoint: 'https://api.yoursite.com/analytics'
  debug: false,     // Set true to see console logs during dev
  storageKey: 'ss_analytics',
  sessionKey: 'ss_session',
};

/* ── SESSION ─────────────────────────────── */
const sessionId = 'ss_' + Math.random().toString(36).slice(2,11) + '_' + Date.now();
const sessionStart = Date.now();
let pageData = {
  sessionId,
  sessionStart: new Date().toISOString(),
  referrer: document.referrer || 'direct',
  userAgent: navigator.userAgent,
  screen: \`\${screen.width}x\${screen.height}\`,
  viewport: \`\${window.innerWidth}x\${window.innerHeight}\`,
  language: navigator.language,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  geo: null,
  events: [],
  scrollDepth: 0,
  demoTabsViewed: [],
  sectionsViewed: [],
  timeOnPage: 0,
  formStarted: false,
  accessRequested: false,
  waitlistSignup: false,
};

/* ── STORAGE ─────────────────────────────── */
function getStore(){
  try{ return JSON.parse(localStorage.getItem(CONFIG.storageKey)||'{"sessions":[],"aggregate":{}}'); }
  catch(e){ return {sessions:[],aggregate:{}}; }
}
function saveStore(data){ try{ localStorage.setItem(CONFIG.storageKey,JSON.stringify(data)); }catch(e){} }
function getAggregate(){
  const s=getStore();
  return s.aggregate||{totalSessions:0,totalPageviews:0,accessRequests:0,waitlistSignups:0,avgTimeOnPage:0,topReferrers:{},topGeo:{},demoInteractions:0,topSections:{}};
}

/* ── GEO DETECTION ───────────────────────── */
async function detectGeo(){
  try{
    const res = await fetch('https://ipapi.co/json/',{signal:AbortSignal.timeout(4000)});
    if(!res.ok) throw new Error();
    const d = await res.json();
    pageData.geo = {
      country: d.country_name,
      countryCode: d.country_code,
      region: d.region,
      city: d.city,
      timezone: d.timezone,
      org: d.org,
      lat: d.latitude,
      lon: d.longitude,
    };
    log('Geo detected:', pageData.geo);
    updateGeoUI(pageData.geo);
  } catch(e){
    // Try fallback
    try{
      const r2 = await fetch('https://api.country.is/',{signal:AbortSignal.timeout(3000)});
      const d2 = await r2.json();
      pageData.geo = { countryCode: d2.country, country: d2.country };
    } catch(e2){ pageData.geo = { country:'Unknown' }; }
  }
}

function updateGeoUI(geo){
  // Swap nav language hint based on country
  const langMap = {
    'MX':'🇲🇽 Hola','ES':'🇪🇸 Hola','FR':'🇫🇷 Bonjour','DE':'🇩🇪 Hallo',
    'JP':'🇯🇵 こんにちは','KR':'🇰🇷 안녕하세요','CN':'🇨🇳 你好','BR':'🇧🇷 Olá',
    'SA':'🇸🇦 مرحبا','IN':'🇮🇳 नमस्ते'
  };
  const code = geo.countryCode;
  if(langMap[code]){
    const pill = document.querySelector('.hero-eyebrow');
    if(pill){
      const span = document.createElement('span');
      span.style.cssText='font-size:11px;color:rgba(255,255,255,0.4);margin-left:6px;';
      span.textContent = langMap[code];
      pill.appendChild(span);
    }
  }
  // Show location-aware stat (city if US, country otherwise)
  if(geo.city && geo.country === 'United States'){
    injectGeoBar(\`📍 Now viewing from \${geo.city}, \${geo.region}\`);
  } else if(geo.country && geo.country !== 'Unknown'){
    injectGeoBar(\`📍 Viewing from \${geo.country} — Global access available\`);
  }
}

function injectGeoBar(msg){
  const bar = document.createElement('div');
  bar.style.cssText='background:rgba(48,217,192,0.06);border-bottom:1px solid rgba(48,217,192,0.12);text-align:center;padding:7px;font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:0.02em;';
  bar.textContent = msg;
  const beta = document.querySelector('.beta-banner');
  if(beta) beta.insertAdjacentElement('afterend',bar);
}

/* ── SCROLL DEPTH ────────────────────────── */
let maxScroll = 0;
const scrollMilestones = [25,50,75,90,100];
const hitMilestones = new Set();
window.addEventListener('scroll',()=>{
  const pct = Math.round((window.scrollY/(document.body.scrollHeight-window.innerHeight))*100);
  if(pct > maxScroll){ maxScroll = pct; pageData.scrollDepth = pct; }
  scrollMilestones.forEach(m=>{
    if(pct >= m && !hitMilestones.has(m)){
      hitMilestones.add(m);
      SA.track('scroll_depth',{percent:m});
    }
  });
},{passive:true});

/* ── SECTION VISIBILITY ──────────────────── */
const sectionObserver = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const id = e.target.id || e.target.className.split(' ')[0];
      if(!pageData.sectionsViewed.includes(id)){
        pageData.sectionsViewed.push(id);
        SA.track('section_view',{section:id});
      }
    }
  });
},{threshold:0.3});
document.querySelectorAll('section[id], .wave-section, .ticker-section, .features-marquee, .sphere-section, .global-section').forEach(el=>sectionObserver.observe(el));

/* ── DEMO TAB TRACKING ───────────────────── */
const origSwitch = window.switchTab;
window.switchTab = function(id){
  origSwitch(id);
  if(!pageData.demoTabsViewed.includes(id)) pageData.demoTabsViewed.push(id);
  SA.track('demo_tab',{tab:id});
};

/* ── FORM INTERACTION ────────────────────── */
document.querySelectorAll('.fi-input').forEach(input=>{
  input.addEventListener('focus',()=>{
    if(!pageData.formStarted){
      pageData.formStarted=true;
      SA.track('form_started',{form:'access_request'});
    }
  },{once:true});
});
document.querySelector('.ei')?.addEventListener('focus',()=>{
  SA.track('form_started',{form:'cta_waitlist'});
},{once:true});

/* ── CLICK TRACKING ──────────────────────── */
document.addEventListener('click',e=>{
  const el=e.target.closest('button,a,.stag,.lang-pill,.demo-tab,.flow-card,.sc-card,.hub-card');
  if(!el) return;
  const label = el.textContent.trim().slice(0,60);
  const type = el.tagName.toLowerCase();
  SA.track('click',{element:type,label,href:el.href||null});
});

/* ── TIME ON PAGE ─────────────────────────── */
setInterval(()=>{pageData.timeOnPage=Math.round((Date.now()-sessionStart)/1000);},5000);
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden') flush();
});
window.addEventListener('beforeunload',flush);

/* ── FLUSH ───────────────────────────────── */
function flush(){
  pageData.timeOnPage=Math.round((Date.now()-sessionStart)/1000);
  pageData.scrollDepthFinal=maxScroll;
  const store=getStore();
  store.sessions.push({...pageData,flushedAt:new Date().toISOString()});
  if(store.sessions.length>200) store.sessions=store.sessions.slice(-200);
  // Update aggregate
  const agg=getAggregate();
  agg.totalSessions=(agg.totalSessions||0)+1;
  agg.totalPageviews=(agg.totalPageviews||0)+1;
  if(pageData.accessRequested) agg.accessRequests=(agg.accessRequests||0)+1;
  if(pageData.waitlistSignup) agg.waitlistSignups=(agg.waitlistSignups||0)+1;
  agg.demoInteractions=(agg.demoInteractions||0)+pageData.demoTabsViewed.length;
  agg.avgTimeOnPage=Math.round(((agg.avgTimeOnPage||0)*(agg.totalSessions-1)+pageData.timeOnPage)/agg.totalSessions);
  if(pageData.geo?.country){
    agg.topGeo=agg.topGeo||{};
    agg.topGeo[pageData.geo.country]=(agg.topGeo[pageData.geo.country]||0)+1;
  }
  const ref=pageData.referrer.split('/')[2]||'direct';
  agg.topReferrers=agg.topReferrers||{};
  agg.topReferrers[ref]=(agg.topReferrers[ref]||0)+1;
  pageData.sectionsViewed.forEach(s=>{
    agg.topSections=agg.topSections||{};
    agg.topSections[s]=(agg.topSections[s]||0)+1;
  });
  store.aggregate=agg;
  saveStore(store);
  if(CONFIG.webhookUrl) sendWebhook(pageData);
}

/* ── WEBHOOK ─────────────────────────────── */
async function sendWebhook(data){
  try{
    await fetch(CONFIG.webhookUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),keepalive:true});
  }catch(e){}
}

/* ── LOGGER ──────────────────────────────── */
function log(...args){ if(CONFIG.debug) console.log('[SomaSync Analytics]',...args); }

/* ── PUBLIC API ──────────────────────────── */
window.SA = {
  track(event, props={}){
    const entry={event,props,timestamp:new Date().toISOString(),sessionId};
    pageData.events.push(entry);
    if(event==='access_request') pageData.accessRequested=true;
    if(event==='waitlist_signup') pageData.waitlistSignup=true;
    log('Event:',event,props);
  },
  /* getReport() — call from console or your dashboard */
  getReport(){
    const store=getStore();
    const agg=store.aggregate||{};
    const sessions=store.sessions||[];
    const avgScroll=sessions.length ? Math.round(sessions.reduce((a,s)=>a+(s.scrollDepthFinal||0),0)/sessions.length) : 0;
    const topTabs={};
    sessions.forEach(s=>(s.demoTabsViewed||[]).forEach(t=>{topTabs[t]=(topTabs[t]||0)+1;}));
    const deviceTypes={mobile:0,tablet:0,desktop:0};
    sessions.forEach(s=>{
      const w=parseInt((s.viewport||'0').split('x')[0]);
      if(w<768) deviceTypes.mobile++;
      else if(w<1024) deviceTypes.tablet++;
      else deviceTypes.desktop++;
    });
    return {
      summary:{
        totalSessions:agg.totalSessions||0,
        accessRequests:agg.accessRequests||0,
        waitlistSignups:agg.waitlistSignups||0,
        avgTimeOnPage:\`\${agg.avgTimeOnPage||0}s\`,
        avgScrollDepth:\`\${avgScroll}%\`,
        demoInteractions:agg.demoInteractions||0,
      },
      topGeo:agg.topGeo||{},
      topReferrers:agg.topReferrers||{},
      topSections:agg.topSections||{},
      topDemoTabs:topTabs,
      deviceTypes,
      recentSessions:sessions.slice(-10).map(s=>({
        id:s.sessionId,
        date:s.sessionStart,
        geo:s.geo,
        timeOnPage:s.timeOnPage+'s',
        scrollDepth:s.scrollDepthFinal+'%',
        demoTabsViewed:s.demoTabsViewed,
        accessRequested:s.accessRequested,
        waitlistSignup:s.waitlistSignup,
        referrer:s.referrer,
        events:s.events?.length||0,
      })),
    };
  },
  /* showDashboard() — renders a live overlay panel */
  showDashboard(){
    const existing=document.getElementById('sa-dash');
    if(existing){ existing.remove(); return; }
    const r=this.getReport();
    const dash=document.createElement('div');
    dash.id='sa-dash';
    dash.style.cssText=\`
      position:fixed;bottom:20px;right:20px;z-index:9999;
      width:420px;max-height:80vh;overflow-y:auto;
      background:#0f1318;border:1px solid rgba(255,255,255,0.1);
      border-radius:20px;padding:24px;
      font-family:'Inter',sans-serif;font-size:13px;color:#c8cfd8;
      box-shadow:0 24px 80px rgba(0,0,0,0.6);
    \`;
    const fmt=(obj)=>Object.entries(obj||{}).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>\`<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.04)"><span style="color:rgba(255,255,255,0.5)">\${k}</span><span style="font-weight:700;color:#30d9c0">\${v}</span></div>\`).join('');
    dash.innerHTML=\`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <span style="font-size:14px;font-weight:800;color:#fff;letter-spacing:-0.03em">📊 SomaSync Analytics</span>
        <button onclick="document.getElementById('sa-dash').remove()" style="background:rgba(255,255,255,0.1);border:none;color:#fff;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px">
        \${[['Sessions',r.summary.totalSessions],['Access Requests',r.summary.accessRequests],['Waitlist Signups',r.summary.waitlistSignups],['Avg Time',r.summary.avgTimeOnPage],['Avg Scroll',r.summary.avgScrollDepth],['Demo Interactions',r.summary.demoInteractions]].map(([l,v])=>\`<div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:12px"><div style="font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">\${l}</div><div style="font-size:20px;font-weight:800;color:#fff">\${v}</div></div>\`).join('')}
      </div>
      <div style="margin-bottom:16px"><div style="font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:8px">Top Countries</div>\${fmt(r.topGeo)||'<div style="color:rgba(255,255,255,0.2)">No data yet</div>'}</div>
      <div style="margin-bottom:16px"><div style="font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:8px">Top Referrers</div>\${fmt(r.topReferrers)}</div>
      <div style="margin-bottom:16px"><div style="font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:8px">Sections Viewed</div>\${fmt(r.topSections)}</div>
      <div style="margin-bottom:16px"><div style="font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:8px">Demo Tabs</div>\${fmt(r.topDemoTabs)}</div>
      <div style="margin-bottom:16px"><div style="font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:8px">Devices</div>
        <div style="display:flex;gap:8px">\${Object.entries(r.deviceTypes).map(([k,v])=>\`<div style="flex:1;background:rgba(255,255,255,0.04);border-radius:8px;padding:8px;text-align:center"><div style="font-size:10px;color:rgba(255,255,255,0.3)">\${k}</div><div style="font-weight:700;color:#30d9c0">\${v}</div></div>\`).join('')}</div>
      </div>
      <div style="font-size:10px;color:rgba(255,255,255,0.15);text-align:center;margin-top:12px">Type <code style="color:#30d9c0">SA.getReport()</code> in console for full JSON</div>
    \`;
    document.body.appendChild(dash);
  },
  clearData(){ localStorage.removeItem(CONFIG.storageKey); console.log('Analytics data cleared.'); },
};

/* ── INIT ─────────────────────────────────── */
detectGeo();
SA.track('pageview',{url:location.href,title:document.title});

// Secret keystroke: press Alt+Shift+A to open analytics panel
document.addEventListener('keydown',e=>{
  if(e.altKey && e.shiftKey && e.key==='A') SA.showDashboard();
});

log('Analytics engine initialized. Session:',sessionId);
log('Press Alt+Shift+A to open the analytics dashboard.');

})();
</script>`

const JS = `
/* WAVEFORM */
const wbars = document.getElementById('wbars');
[10,14,20,28,38,50,58,68,72,78,84,80,88,84,80,88,80,72,80,86,78,68,60,50,42,34,26,18,12,10].forEach((h,i)=>{
  const b=document.createElement('div');b.className='wbar';
  b.style.cssText=\`height:\${h}px;animation-delay:\${(i*0.055).toFixed(2)}s\`;
  wbars.appendChild(b);
});

/* DEMO TABS */
function switchTab(id){
  document.querySelectorAll('.demo-tab').forEach((t,i)=>t.classList.toggle('active',['icd','soap','billing'][i]===id));
  document.querySelectorAll('.demo-panel').forEach(p=>p.classList.toggle('active',p.id===\`panel-\${id}\`));
}

/* SCROLL REVEAL */
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const d=+(e.target.dataset.delay||0);
      setTimeout(()=>e.target.classList.add('vis'),d);
      io.unobserve(e.target);
    }
  });
},{threshold:0.08});
document.querySelectorAll('.flow-card,.chart-card,.big-chart,.bc,.sc-card,.hub-card,.metric-card').forEach(el=>{
  if(!el.classList.contains('vis'))io.observe(el);
});

/* CHARTS */
const tealGrad=(ctx,a,b)=>{const g=ctx.createLinearGradient(0,0,0,200);g.addColorStop(0,a);g.addColorStop(1,b);return g;};

// Speed
const sc=document.getElementById('speedChart').getContext('2d');
new Chart(sc,{type:'bar',data:{
  labels:['Mon','Tue','Wed','Thu','Fri','Sat'],
  datasets:[{data:[18,22,19,25,28,24],backgroundColor:'rgba(48,217,192,0.15)',borderColor:'#1fc4ac',borderWidth:2,borderRadius:8}]
},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:10,family:'Inter'},color:'#a1a1a6'}},y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:10,family:'Inter'},color:'#a1a1a6'}}}}});

// Accuracy
const ac=document.getElementById('accChart').getContext('2d');
const aGrad=ac.createLinearGradient(0,0,0,160);aGrad.addColorStop(0,'rgba(10,132,255,0.15)');aGrad.addColorStop(1,'rgba(10,132,255,0)');
new Chart(ac,{type:'line',data:{
  labels:['W1','W2','W3','W4','W5','W6','W7','W8'],
  datasets:[{data:[74,78,80,82,83,85,87,88.5],borderColor:'#0a84ff',backgroundColor:aGrad,borderWidth:2.5,tension:0.4,fill:true,pointBackgroundColor:'#0a84ff',pointRadius:3}]
},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:10,family:'Inter'},color:'#a1a1a6'}},y:{min:65,max:100,grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:10,family:'Inter'},color:'#a1a1a6'}}}}});

// Donut
new Chart(document.getElementById('dxChart'),{type:'doughnut',data:{
  labels:['Cervicalgia','Low Back','Myalgia','Sciatica','Other'],
  datasets:[{data:[28,34,18,12,8],backgroundColor:['#30d9c0','#0a84ff','#ff9f0a','#bf5af2','#e8e8ed'],borderWidth:0,hoverOffset:6}]
},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,position:'bottom',labels:{font:{size:10,family:'Inter'},color:'#6e6e73',boxWidth:10,padding:8}}}}});

// Big chart
new Chart(document.getElementById('bigChart'),{type:'bar',data:{
  labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  datasets:[
    {label:'Sessions',data:[42,58,64,72,80,88,94,102,110,98,115,124],backgroundColor:'rgba(48,217,192,0.15)',borderColor:'#1fc4ac',borderWidth:2,borderRadius:8,yAxisID:'y'},
    {label:'Avg Doc Time (min)',data:[18,16,15,14,12,11,10,9,9,8,8,7],type:'line',borderColor:'#0a84ff',backgroundColor:'rgba(10,132,255,0.08)',borderWidth:2.5,tension:0.4,fill:true,pointBackgroundColor:'#0a84ff',pointRadius:3,yAxisID:'y1'}
  ]
},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{
  x:{grid:{display:false},ticks:{font:{size:11,family:'Inter'},color:'#a1a1a6'}},
  y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:11,family:'Inter'},color:'#a1a1a6'},position:'left'},
  y1:{grid:{display:false},ticks:{font:{size:11,family:'Inter'},color:'#6ab5ff'},position:'right'}
}}});

/* FORMS */
document.getElementById('accessBtn').addEventListener('click',()=>{
  const btn=document.getElementById('accessBtn');
  const name=document.querySelector('.fi-input[type="text"]')?.value||'';
  const email=document.querySelector('.fi-input[type="email"]')?.value||'';
  const specialty=document.querySelectorAll('.fi-input[type="text"]')[1]?.value||'';
  const state=document.querySelectorAll('.fi-input[type="text"]')[2]?.value||'';
  if(!email.includes('@')){alert('Please enter a valid email address.');return;}
  SA.track('access_request',{name,email,specialty,state,timestamp:new Date().toISOString()});
  btn.textContent='✓ Request Submitted — We\\'ll review and respond within 48 hours';
  btn.style.background='#34c759';btn.disabled=true;
});
function handleCTA(){
  const el=document.getElementById('ctaEmail');
  if(el.value.includes('@')){
    SA.track('waitlist_signup',{email:el.value,source:'cta_bottom',timestamp:new Date().toISOString()});
    el.value='';el.placeholder='✓ You\\'re on the list!';
    document.querySelector('.btn-teal').textContent='Done ✓';
    document.querySelector('.btn-teal').style.background='#34c759';
  }
}


(function(){
'use strict';

/* ── CONFIG ─────────────────────────────── */
const CONFIG = {
  appName: 'SomaSync AI',
  version: '1.0.0',
  webhookUrl: null, // Set to your endpoint: 'https://api.yoursite.com/analytics'
  debug: false,     // Set true to see console logs during dev
  storageKey: 'ss_analytics',
  sessionKey: 'ss_session',
};

/* ── SESSION ─────────────────────────────── */
const sessionId = 'ss_' + Math.random().toString(36).slice(2,11) + '_' + Date.now();
const sessionStart = Date.now();
let pageData = {
  sessionId,
  sessionStart: new Date().toISOString(),
  referrer: document.referrer || 'direct',
  userAgent: navigator.userAgent,
  screen: \`\${screen.width}x\${screen.height}\`,
  viewport: \`\${window.innerWidth}x\${window.innerHeight}\`,
  language: navigator.language,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  geo: null,
  events: [],
  scrollDepth: 0,
  demoTabsViewed: [],
  sectionsViewed: [],
  timeOnPage: 0,
  formStarted: false,
  accessRequested: false,
  waitlistSignup: false,
};

/* ── STORAGE ─────────────────────────────── */
function getStore(){
  try{ return JSON.parse(localStorage.getItem(CONFIG.storageKey)||'{"sessions":[],"aggregate":{}}'); }
  catch(e){ return {sessions:[],aggregate:{}}; }
}
function saveStore(data){ try{ localStorage.setItem(CONFIG.storageKey,JSON.stringify(data)); }catch(e){} }
function getAggregate(){
  const s=getStore();
  return s.aggregate||{totalSessions:0,totalPageviews:0,accessRequests:0,waitlistSignups:0,avgTimeOnPage:0,topReferrers:{},topGeo:{},demoInteractions:0,topSections:{}};
}

/* ── GEO DETECTION ───────────────────────── */
async function detectGeo(){
  try{
    const res = await fetch('https://ipapi.co/json/',{signal:AbortSignal.timeout(4000)});
    if(!res.ok) throw new Error();
    const d = await res.json();
    pageData.geo = {
      country: d.country_name,
      countryCode: d.country_code,
      region: d.region,
      city: d.city,
      timezone: d.timezone,
      org: d.org,
      lat: d.latitude,
      lon: d.longitude,
    };
    log('Geo detected:', pageData.geo);
    updateGeoUI(pageData.geo);
  } catch(e){
    // Try fallback
    try{
      const r2 = await fetch('https://api.country.is/',{signal:AbortSignal.timeout(3000)});
      const d2 = await r2.json();
      pageData.geo = { countryCode: d2.country, country: d2.country };
    } catch(e2){ pageData.geo = { country:'Unknown' }; }
  }
}

function updateGeoUI(geo){
  // Swap nav language hint based on country
  const langMap = {
    'MX':'🇲🇽 Hola','ES':'🇪🇸 Hola','FR':'🇫🇷 Bonjour','DE':'🇩🇪 Hallo',
    'JP':'🇯🇵 こんにちは','KR':'🇰🇷 안녕하세요','CN':'🇨🇳 你好','BR':'🇧🇷 Olá',
    'SA':'🇸🇦 مرحبا','IN':'🇮🇳 नमस्ते'
  };
  const code = geo.countryCode;
  if(langMap[code]){
    const pill = document.querySelector('.hero-eyebrow');
    if(pill){
      const span = document.createElement('span');
      span.style.cssText='font-size:11px;color:rgba(255,255,255,0.4);margin-left:6px;';
      span.textContent = langMap[code];
      pill.appendChild(span);
    }
  }
  // Show location-aware stat (city if US, country otherwise)
  if(geo.city && geo.country === 'United States'){
    injectGeoBar(\`📍 Now viewing from \${geo.city}, \${geo.region}\`);
  } else if(geo.country && geo.country !== 'Unknown'){
    injectGeoBar(\`📍 Viewing from \${geo.country} — Global access available\`);
  }
}

function injectGeoBar(msg){
  const bar = document.createElement('div');
  bar.style.cssText='background:rgba(48,217,192,0.06);border-bottom:1px solid rgba(48,217,192,0.12);text-align:center;padding:7px;font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:0.02em;';
  bar.textContent = msg;
  const beta = document.querySelector('.beta-banner');
  if(beta) beta.insertAdjacentElement('afterend',bar);
}

/* ── SCROLL DEPTH ────────────────────────── */
let maxScroll = 0;
const scrollMilestones = [25,50,75,90,100];
const hitMilestones = new Set();
window.addEventListener('scroll',()=>{
  const pct = Math.round((window.scrollY/(document.body.scrollHeight-window.innerHeight))*100);
  if(pct > maxScroll){ maxScroll = pct; pageData.scrollDepth = pct; }
  scrollMilestones.forEach(m=>{
    if(pct >= m && !hitMilestones.has(m)){
      hitMilestones.add(m);
      SA.track('scroll_depth',{percent:m});
    }
  });
},{passive:true});

/* ── SECTION VISIBILITY ──────────────────── */
const sectionObserver = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const id = e.target.id || e.target.className.split(' ')[0];
      if(!pageData.sectionsViewed.includes(id)){
        pageData.sectionsViewed.push(id);
        SA.track('section_view',{section:id});
      }
    }
  });
},{threshold:0.3});
document.querySelectorAll('section[id], .wave-section, .ticker-section, .features-marquee, .sphere-section, .global-section').forEach(el=>sectionObserver.observe(el));

/* ── DEMO TAB TRACKING ───────────────────── */
const origSwitch = window.switchTab;
window.switchTab = function(id){
  origSwitch(id);
  if(!pageData.demoTabsViewed.includes(id)) pageData.demoTabsViewed.push(id);
  SA.track('demo_tab',{tab:id});
};

/* ── FORM INTERACTION ────────────────────── */
document.querySelectorAll('.fi-input').forEach(input=>{
  input.addEventListener('focus',()=>{
    if(!pageData.formStarted){
      pageData.formStarted=true;
      SA.track('form_started',{form:'access_request'});
    }
  },{once:true});
});
document.querySelector('.ei')?.addEventListener('focus',()=>{
  SA.track('form_started',{form:'cta_waitlist'});
},{once:true});

/* ── CLICK TRACKING ──────────────────────── */
document.addEventListener('click',e=>{
  const el=e.target.closest('button,a,.stag,.lang-pill,.demo-tab,.flow-card,.sc-card,.hub-card');
  if(!el) return;
  const label = el.textContent.trim().slice(0,60);
  const type = el.tagName.toLowerCase();
  SA.track('click',{element:type,label,href:el.href||null});
});

/* ── TIME ON PAGE ─────────────────────────── */
setInterval(()=>{pageData.timeOnPage=Math.round((Date.now()-sessionStart)/1000);},5000);
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden') flush();
});
window.addEventListener('beforeunload',flush);

/* ── FLUSH ───────────────────────────────── */
function flush(){
  pageData.timeOnPage=Math.round((Date.now()-sessionStart)/1000);
  pageData.scrollDepthFinal=maxScroll;
  const store=getStore();
  store.sessions.push({...pageData,flushedAt:new Date().toISOString()});
  if(store.sessions.length>200) store.sessions=store.sessions.slice(-200);
  // Update aggregate
  const agg=getAggregate();
  agg.totalSessions=(agg.totalSessions||0)+1;
  agg.totalPageviews=(agg.totalPageviews||0)+1;
  if(pageData.accessRequested) agg.accessRequests=(agg.accessRequests||0)+1;
  if(pageData.waitlistSignup) agg.waitlistSignups=(agg.waitlistSignups||0)+1;
  agg.demoInteractions=(agg.demoInteractions||0)+pageData.demoTabsViewed.length;
  agg.avgTimeOnPage=Math.round(((agg.avgTimeOnPage||0)*(agg.totalSessions-1)+pageData.timeOnPage)/agg.totalSessions);
  if(pageData.geo?.country){
    agg.topGeo=agg.topGeo||{};
    agg.topGeo[pageData.geo.country]=(agg.topGeo[pageData.geo.country]||0)+1;
  }
  const ref=pageData.referrer.split('/')[2]||'direct';
  agg.topReferrers=agg.topReferrers||{};
  agg.topReferrers[ref]=(agg.topReferrers[ref]||0)+1;
  pageData.sectionsViewed.forEach(s=>{
    agg.topSections=agg.topSections||{};
    agg.topSections[s]=(agg.topSections[s]||0)+1;
  });
  store.aggregate=agg;
  saveStore(store);
  if(CONFIG.webhookUrl) sendWebhook(pageData);
}

/* ── WEBHOOK ─────────────────────────────── */
async function sendWebhook(data){
  try{
    await fetch(CONFIG.webhookUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),keepalive:true});
  }catch(e){}
}

/* ── LOGGER ──────────────────────────────── */
function log(...args){ if(CONFIG.debug) console.log('[SomaSync Analytics]',...args); }

/* ── PUBLIC API ──────────────────────────── */
window.SA = {
  track(event, props={}){
    const entry={event,props,timestamp:new Date().toISOString(),sessionId};
    pageData.events.push(entry);
    if(event==='access_request') pageData.accessRequested=true;
    if(event==='waitlist_signup') pageData.waitlistSignup=true;
    log('Event:',event,props);
  },
  /* getReport() — call from console or your dashboard */
  getReport(){
    const store=getStore();
    const agg=store.aggregate||{};
    const sessions=store.sessions||[];
    const avgScroll=sessions.length ? Math.round(sessions.reduce((a,s)=>a+(s.scrollDepthFinal||0),0)/sessions.length) : 0;
    const topTabs={};
    sessions.forEach(s=>(s.demoTabsViewed||[]).forEach(t=>{topTabs[t]=(topTabs[t]||0)+1;}));
    const deviceTypes={mobile:0,tablet:0,desktop:0};
    sessions.forEach(s=>{
      const w=parseInt((s.viewport||'0').split('x')[0]);
      if(w<768) deviceTypes.mobile++;
      else if(w<1024) deviceTypes.tablet++;
      else deviceTypes.desktop++;
    });
    return {
      summary:{
        totalSessions:agg.totalSessions||0,
        accessRequests:agg.accessRequests||0,
        waitlistSignups:agg.waitlistSignups||0,
        avgTimeOnPage:\`\${agg.avgTimeOnPage||0}s\`,
        avgScrollDepth:\`\${avgScroll}%\`,
        demoInteractions:agg.demoInteractions||0,
      },
      topGeo:agg.topGeo||{},
      topReferrers:agg.topReferrers||{},
      topSections:agg.topSections||{},
      topDemoTabs:topTabs,
      deviceTypes,
      recentSessions:sessions.slice(-10).map(s=>({
        id:s.sessionId,
        date:s.sessionStart,
        geo:s.geo,
        timeOnPage:s.timeOnPage+'s',
        scrollDepth:s.scrollDepthFinal+'%',
        demoTabsViewed:s.demoTabsViewed,
        accessRequested:s.accessRequested,
        waitlistSignup:s.waitlistSignup,
        referrer:s.referrer,
        events:s.events?.length||0,
      })),
    };
  },
  /* showDashboard() — renders a live overlay panel */
  showDashboard(){
    const existing=document.getElementById('sa-dash');
    if(existing){ existing.remove(); return; }
    const r=this.getReport();
    const dash=document.createElement('div');
    dash.id='sa-dash';
    dash.style.cssText=\`
      position:fixed;bottom:20px;right:20px;z-index:9999;
      width:420px;max-height:80vh;overflow-y:auto;
      background:#0f1318;border:1px solid rgba(255,255,255,0.1);
      border-radius:20px;padding:24px;
      font-family:'Inter',sans-serif;font-size:13px;color:#c8cfd8;
      box-shadow:0 24px 80px rgba(0,0,0,0.6);
    \`;
    const fmt=(obj)=>Object.entries(obj||{}).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>\`<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.04)"><span style="color:rgba(255,255,255,0.5)">\${k}</span><span style="font-weight:700;color:#30d9c0">\${v}</span></div>\`).join('');
    dash.innerHTML=\`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <span style="font-size:14px;font-weight:800;color:#fff;letter-spacing:-0.03em">📊 SomaSync Analytics</span>
        <button onclick="document.getElementById('sa-dash').remove()" style="background:rgba(255,255,255,0.1);border:none;color:#fff;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px">
        \${[['Sessions',r.summary.totalSessions],['Access Requests',r.summary.accessRequests],['Waitlist Signups',r.summary.waitlistSignups],['Avg Time',r.summary.avgTimeOnPage],['Avg Scroll',r.summary.avgScrollDepth],['Demo Interactions',r.summary.demoInteractions]].map(([l,v])=>\`<div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:12px"><div style="font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">\${l}</div><div style="font-size:20px;font-weight:800;color:#fff">\${v}</div></div>\`).join('')}
      </div>
      <div style="margin-bottom:16px"><div style="font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:8px">Top Countries</div>\${fmt(r.topGeo)||'<div style="color:rgba(255,255,255,0.2)">No data yet</div>'}</div>
      <div style="margin-bottom:16px"><div style="font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:8px">Top Referrers</div>\${fmt(r.topReferrers)}</div>
      <div style="margin-bottom:16px"><div style="font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:8px">Sections Viewed</div>\${fmt(r.topSections)}</div>
      <div style="margin-bottom:16px"><div style="font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:8px">Demo Tabs</div>\${fmt(r.topDemoTabs)}</div>
      <div style="margin-bottom:16px"><div style="font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:8px">Devices</div>
        <div style="display:flex;gap:8px">\${Object.entries(r.deviceTypes).map(([k,v])=>\`<div style="flex:1;background:rgba(255,255,255,0.04);border-radius:8px;padding:8px;text-align:center"><div style="font-size:10px;color:rgba(255,255,255,0.3)">\${k}</div><div style="font-weight:700;color:#30d9c0">\${v}</div></div>\`).join('')}</div>
      </div>
      <div style="font-size:10px;color:rgba(255,255,255,0.15);text-align:center;margin-top:12px">Type <code style="color:#30d9c0">SA.getReport()</code> in console for full JSON</div>
    \`;
    document.body.appendChild(dash);
  },
  clearData(){ localStorage.removeItem(CONFIG.storageKey); console.log('Analytics data cleared.'); },
};

/* ── INIT ─────────────────────────────────── */
detectGeo();
SA.track('pageview',{url:location.href,title:document.title});

// Secret keystroke: press Alt+Shift+A to open analytics panel
document.addEventListener('keydown',e=>{
  if(e.altKey && e.shiftKey && e.key==='A') SA.showDashboard();
});

log('Analytics engine initialized. Session:',sessionId);
log('Press Alt+Shift+A to open the analytics dashboard.');

})();
`
