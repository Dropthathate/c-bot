import { useEffect, useRef } from 'react'

export default function Landing() {
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) return
    mounted.current = true

    document.title = 'SomaSyncAI — The Gold Standard Clinical OS for Manual Therapists'

    // Fonts
    if (!document.getElementById('soma-fonts')) {
      const link = document.createElement('link')
      link.id = 'soma-fonts'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@300;400;500;600;700&display=swap'
      document.head.appendChild(link)
    }

    // Inject scoped styles
    if (!document.getElementById('soma-styles')) {
      const style = document.createElement('style')
      style.id = 'soma-styles'
      style.textContent = `#soma-root { all: initial; display: block; }
#soma-root * { box-sizing: border-box; }
` + CSS
      document.head.appendChild(style)
    }

    // Inject JS after render
    const s = document.createElement('script')
    s.textContent = JS
    document.body.appendChild(s)

    return () => {
      const s = document.getElementById('soma-styles')
      if (s) s.remove()
      mounted.current = false
    }
  }, [])

  return (
    <div id="soma-root" style={{all:'initial',display:'block'}}
      dangerouslySetInnerHTML={{ __html: HTML }}
    />
  )
}

const CSS = `

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#080808;--ink:#f0ede8;--muted:rgba(240,237,232,0.45);--dim:rgba(240,237,232,0.18);--grn:#00e89a;--blue:#3b9eff;--blue2:#1a7ee0;--blue-glow:rgba(59,158,255,0.25);--r:clamp(24px,5vw,80px)}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--ink);font-family:'Manrope',sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased;cursor:none}
#cd,#cr{position:fixed;border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%)}
#cd{width:8px;height:8px;background:var(--grn)}
#cr{width:34px;height:34px;border:1px solid rgba(0,232,154,0.5);transition:width .2s,height .2s,transform .13s}
body.h #cr{width:52px;height:52px;border-color:var(--grn)}
nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:24px var(--r);transition:background .4s,box-shadow .4s}
nav.stuck{background:rgba(8,8,8,0.9);backdrop-filter:blur(20px);box-shadow:0 1px 0 rgba(255,255,255,0.06)}
.n-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:.95rem;color:var(--ink);text-decoration:none;display:flex;align-items:center;gap:10px}
.n-logo-dot{width:8px;height:8px;background:var(--grn);border-radius:50%;box-shadow:0 0 10px var(--grn)}
.n-pill{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:100px;padding:4px;display:flex}
.n-pill a{font-size:.74rem;color:var(--muted);text-decoration:none;padding:8px 18px;border-radius:100px;transition:background .2s,color .2s}
.n-pill a:hover{background:rgba(255,255,255,0.08);color:var(--ink)}
.n-cta{font-family:'Syne',sans-serif;font-size:.78rem;font-weight:700;background:var(--blue);color:#fff;padding:11px 22px;border-radius:100px;text-decoration:none;transition:background .2s,transform .15s,box-shadow .2s}
.n-cta:hover{background:var(--blue2);transform:scale(1.04);box-shadow:0 0 24px var(--blue-glow)}
#hero{min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;padding:130px var(--r) 0;position:relative;overflow:hidden}
canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0}
.hero-inner{position:relative;z-index:2}
.hero-top-stats{position:absolute;top:130px;right:var(--r);display:flex;flex-direction:column;gap:20px;z-index:2;text-align:right;opacity:0;animation:fadeIn 1s 1s forwards}
.ts-n{font-family:'Syne',sans-serif;font-weight:800;font-size:1.6rem;letter-spacing:-.03em;line-height:1}
.ts-n span{color:var(--grn)}
.ts-l{font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-top:3px}
.hero-badge{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(59,158,255,0.35);background:rgba(59,158,255,0.07);color:var(--blue);font-size:.68rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:7px 16px;border-radius:100px;margin-bottom:32px;opacity:0;animation:fadeUp .7s .3s forwards}
.hero-badge-dot{width:6px;height:6px;background:var(--grn);border-radius:50%;animation:pulse 2s infinite;box-shadow:0 0 6px var(--grn)}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.hero-h1{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(5rem,11vw,12rem);line-height:.85;letter-spacing:-.05em;opacity:0;animation:fadeUp 1s .45s cubic-bezier(.22,1,.36,1) forwards}
.hero-h1 .out{-webkit-text-stroke:clamp(1px,.15vw,2px) rgba(240,237,232,0.3);color:transparent}

.dash-wrap{position:relative;z-index:2;margin-top:52px;opacity:0;animation:fadeUp 1.1s .9s cubic-bezier(.22,1,.36,1) forwards}
.dash-fade{position:absolute;bottom:0;left:0;right:0;height:200px;background:linear-gradient(to top,var(--bg),transparent);z-index:3;pointer-events:none}
.dash-screen{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-bottom:none;border-radius:16px 16px 0 0;overflow:hidden}
.dash-bar{background:rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.06);padding:14px 20px;display:flex;align-items:center;gap:10px}
.dash-dots{display:flex;gap:6px}
.dash-dot{width:10px;height:10px;border-radius:50%}
.dd1{background:#ff5f57}.dd2{background:#ffbd2e}.dd3{background:#28c840}
.dash-url{flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:6px 14px;font-size:.72rem;color:var(--muted)}
.dash-body{display:grid;grid-template-columns:220px 1fr;min-height:400px}
.dash-sidebar{border-right:1px solid rgba(255,255,255,0.06);padding:24px 16px;display:flex;flex-direction:column;gap:4px}
.dash-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:.82rem;color:var(--ink);margin-bottom:16px;padding:0 8px;display:flex;align-items:center;gap:7px}
.dash-logo-dot{width:7px;height:7px;background:var(--grn);border-radius:50%;box-shadow:0 0 8px var(--grn)}
.nav-item{padding:9px 12px;border-radius:8px;font-size:.78rem;color:var(--muted);display:flex;align-items:center;gap:10px;cursor:pointer}
.nav-item.on{background:rgba(0,232,154,0.08);color:var(--ink);border:1px solid rgba(0,232,154,0.15)}
.ni-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.15);flex-shrink:0}
.nav-item.on .ni-dot{background:var(--grn);box-shadow:0 0 6px var(--grn)}
.dash-main{padding:28px 32px}
.dash-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px}
.dash-title{font-family:'Syne',sans-serif;font-weight:700;font-size:1rem;letter-spacing:-.01em}
.dash-live{background:rgba(0,232,154,0.1);border:1px solid rgba(0,232,154,0.25);color:var(--grn);font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:5px 12px;border-radius:100px;display:flex;align-items:center;gap:6px}
.dlb-dot{width:5px;height:5px;background:var(--grn);border-radius:50%;animation:pulse 1.5s infinite}
.soap-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px}
.soap-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:16px}
.soap-l{font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--grn);margin-bottom:8px}
.soap-t{font-size:.75rem;line-height:1.6;color:var(--muted)}
.soap-t b{color:var(--ink);font-weight:500}
.aa-box{background:linear-gradient(135deg,rgba(0,232,154,0.07),rgba(0,232,154,0.02));border:1px solid rgba(0,232,154,0.18);border-radius:10px;padding:16px 20px;display:flex;gap:14px}
.aa-av{width:32px;height:32px;background:linear-gradient(135deg,var(--grn),#00b876);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.9rem;flex-shrink:0}
.aa-l{font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--grn);margin-bottom:5px}
.aa-t{font-size:.76rem;line-height:1.55;color:var(--muted)}
.aa-t b{color:var(--ink);font-weight:500}
.waveform{margin-top:18px;height:40px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:8px;overflow:hidden;display:flex;align-items:center;padding:0 16px;gap:2px}
.wbar{border-radius:2px;background:var(--grn);opacity:.55;flex-shrink:0;width:3px;animation:wv 1.2s ease-in-out infinite alternate}
@keyframes wv{0%{height:3px}100%{height:28px}}
.mq-wrap{overflow:hidden;border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);padding:14px 0;background:rgba(255,255,255,0.015)}
.mq-track{display:flex;width:max-content;animation:march 30s linear infinite}
.mq-item{white-space:nowrap;padding:0 28px;font-family:'Syne',sans-serif;font-size:.67rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(240,237,232,0.22)}
.mq-item .s{color:var(--grn)}
@keyframes march{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.sec{padding:clamp(80px,10vw,140px) var(--r)}
.sec-tag{display:flex;align-items:center;gap:12px;font-family:'Syne',sans-serif;font-size:.67rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--blue);margin-bottom:20px}
.sec-tag::before{content:'';display:block;width:24px;height:1.5px;background:var(--blue);box-shadow:0 0 8px var(--blue-glow)}
.sec-h{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(2.6rem,5.5vw,5.5rem);line-height:.88;letter-spacing:-.045em}
.sec-h .out{-webkit-text-stroke:1.5px rgba(240,237,232,0.22);color:transparent}
.sec-h .g{color:var(--blue)}
.sec-sub{font-size:1rem;line-height:1.8;color:var(--muted);max-width:460px;margin-top:20px}
.rv{opacity:0;transform:translateY(40px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}
.rv.in{opacity:1;transform:none}
.rv.d1{transition-delay:.1s}.rv.d2{transition-delay:.2s}.rv.d3{transition-delay:.3s}.rv.d4{transition-delay:.4s}
#problem{border-top:1px solid rgba(255,255,255,0.06)}
.prob-row{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.06);margin-top:60px}
.prob-card{background:var(--bg);padding:48px 36px;transition:background .3s}
.prob-card:hover{background:rgba(255,255,255,0.025)}
.prob-n{font-family:'Syne',sans-serif;font-weight:800;font-size:4.5rem;color:var(--blue);letter-spacing:-.04em;line-height:1;text-shadow:0 0 60px var(--blue-glow);margin-bottom:12px}
.prob-l{font-size:.67rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:10px}
.prob-d{font-size:.92rem;line-height:1.7;color:rgba(240,237,232,0.5)}
.prob-full{grid-column:1/-1;background:rgba(0,232,154,0.05);border-top:1px solid rgba(0,232,154,0.12);padding:36px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px}
.prob-full-t{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(1.2rem,2.5vw,2rem);letter-spacing:-.03em}
.ptags{display:flex;gap:10px;flex-wrap:wrap}
.ptag{background:rgba(0,232,154,0.08);border:1px solid rgba(0,232,154,0.18);color:var(--grn);font-size:.67rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:8px 16px;border-radius:100px}
#features{border-top:1px solid rgba(255,255,255,0.06)}
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.06);margin-top:60px}
.feat-card{background:var(--bg);padding:44px 36px;position:relative;overflow:hidden;transition:background .25s}
.feat-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,232,154,0.06),transparent);opacity:0;transition:opacity .3s}
.feat-card:hover{background:rgba(255,255,255,0.02)}
.feat-card:hover::before{opacity:1}
.feat-row2{border-top:1px solid rgba(255,255,255,0.06)}
.feat-ico{font-size:1.5rem;margin-bottom:20px}
.feat-title{font-family:'Syne',sans-serif;font-weight:700;font-size:1rem;letter-spacing:-.01em;margin-bottom:10px}
.feat-desc{font-size:.86rem;line-height:1.7;color:var(--muted)}
.feat-live{display:inline-flex;align-items:center;gap:6px;background:rgba(0,232,154,0.08);border:1px solid rgba(0,232,154,0.22);color:var(--grn);font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:5px 12px;border-radius:100px;margin-top:16px}
.feat-live-dot{width:5px;height:5px;background:var(--grn);border-radius:50%;animation:pulse 2s infinite}
#ds-sec{border-top:1px solid rgba(255,255,255,0.06);padding:clamp(80px,10vw,140px) var(--r);overflow:hidden}
.ds-hd{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:60px;flex-wrap:wrap;gap:24px}
.ds-wrap{position:relative}
.ds-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:70%;height:60%;background:radial-gradient(ellipse,rgba(0,232,154,0.07) 0%,transparent 70%);pointer-events:none}
.ds-screen{position:relative;z-index:1;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.09);border-radius:20px;overflow:hidden}
.ds-bar2{background:rgba(255,255,255,0.03);border-bottom:1px solid rgba(255,255,255,0.06);padding:16px 24px;display:flex;align-items:center;gap:10px}
.ds-inner{display:grid;grid-template-columns:240px 1fr 280px;min-height:520px}
.ds-side{border-right:1px solid rgba(255,255,255,0.05);padding:28px 20px}
.ds-side-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:.88rem;margin-bottom:28px;display:flex;align-items:center;gap:8px;color:var(--ink)}
.ds-sld{width:8px;height:8px;background:var(--grn);border-radius:50%;box-shadow:0 0 10px var(--grn)}
.ds-ni{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;font-size:.8rem;color:var(--muted);margin-bottom:2px}
.ds-ni.on{background:rgba(0,232,154,0.08);color:var(--ink);border:1px solid rgba(0,232,154,0.14)}
.ds-ni-ico{font-size:.9rem;width:18px;text-align:center}
.ds-center{padding:32px 36px}
.ds-ct{display:flex;justify-content:space-between;align-items:center;margin-bottom:26px}
.ds-cth{font-family:'Syne',sans-serif;font-weight:700;font-size:1.05rem;letter-spacing:-.01em}
.ds-rec{background:rgba(0,232,154,0.08);border:1px solid rgba(0,232,154,0.22);color:var(--grn);font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:6px 14px;border-radius:100px;display:flex;align-items:center;gap:7px}
.ds-rec-dot{width:6px;height:6px;background:#ff4040;border-radius:50%;animation:pulse 1s infinite}
.ds-sg{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px}
.ds-sc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px}
.ds-sl{font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--grn);margin-bottom:8px}
.ds-st{font-size:.78rem;line-height:1.6;color:var(--muted)}
.ds-st b{color:var(--ink);font-weight:500}
.ds-aa{background:linear-gradient(135deg,rgba(0,232,154,0.07),rgba(0,232,154,0.02));border:1px solid rgba(0,232,154,0.18);border-radius:12px;padding:18px 22px;display:flex;gap:14px}
.ds-aa-av{width:36px;height:36px;background:linear-gradient(135deg,var(--grn),#00b876);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
.ds-aa-l{font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--grn);margin-bottom:5px}
.ds-aa-t{font-size:.78rem;line-height:1.55;color:var(--muted)}
.ds-aa-t b{color:var(--ink);font-weight:500}
.ds-wv{margin-top:18px;height:44px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:10px;overflow:hidden;display:flex;align-items:center;padding:0 18px;gap:3px}
.ds-right{border-left:1px solid rgba(255,255,255,0.05);padding:28px 24px}
.ds-rt{font-family:'Syne',sans-serif;font-weight:700;font-size:.82rem;letter-spacing:-.01em;margin-bottom:18px;color:var(--muted)}
.ds-pat{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:14px;margin-bottom:10px}
.ds-pn{font-family:'Syne',sans-serif;font-weight:700;font-size:.82rem;margin-bottom:4px}
.ds-pi{font-size:.7rem;color:var(--muted);line-height:1.5}
.ds-ptag{display:inline-block;background:rgba(0,232,154,0.08);color:var(--grn);font-size:.58rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:100px;margin-top:8px}
.ds-metric{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05)}
.ds-metric:last-child{border-bottom:none}
.ds-ml{font-size:.72rem;color:var(--muted)}
.ds-mv{font-family:'Syne',sans-serif;font-weight:700;font-size:.88rem;color:var(--grn)}
#how{background:rgba(255,255,255,0.015);border-top:1px solid rgba(255,255,255,0.06)}
.how-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.06);margin-top:60px}
.how-card{background:rgba(8,8,8,1);padding:44px 32px;transition:background .25s}
.how-card:hover{background:rgba(255,255,255,0.02)}
.how-n{font-family:'Syne',sans-serif;font-weight:800;font-size:4rem;color:rgba(255,255,255,0.04);line-height:1;letter-spacing:-.05em;margin-bottom:20px}
.how-t{font-family:'Syne',sans-serif;font-weight:700;font-size:.98rem;letter-spacing:-.01em;margin-bottom:12px}
.how-d{font-size:.86rem;line-height:1.7;color:var(--muted)}
#roadmap{border-top:1px solid rgba(255,255,255,0.06)}
.road-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.06);margin-top:60px}
.road-card{background:var(--bg);padding:44px 32px;position:relative;transition:background .3s}
.road-card:hover{background:rgba(255,255,255,0.02)}
.road-phase{font-size:.62rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}
.road-t{font-family:'Syne',sans-serif;font-weight:700;font-size:1rem;letter-spacing:-.01em;margin-bottom:16px;line-height:1.2}
.road-live{position:absolute;top:18px;right:18px;background:rgba(59,158,255,0.1);border:1px solid rgba(59,158,255,0.3);color:var(--blue);font-size:.58rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:5px 11px;border-radius:100px}
.road-items{list-style:none;display:flex;flex-direction:column;gap:8px}
.road-items li{font-size:.8rem;line-height:1.5;color:rgba(240,237,232,0.4);padding-left:14px;position:relative}
.road-items li::before{content:'→';position:absolute;left:0;color:var(--grn);font-size:.68rem}
.road-date{font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(240,237,232,0.16);margin-top:20px}
#investors{border-top:1px solid rgba(255,255,255,0.06)}
.inv-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;margin-top:60px;align-items:start}
.inv-stats{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.06)}
.inv-stat{background:var(--bg);padding:40px 32px;transition:background .25s}
.inv-stat:hover{background:rgba(255,255,255,0.02)}
.inv-n{font-family:'Syne',sans-serif;font-weight:800;font-size:3rem;letter-spacing:-.04em;color:var(--blue);text-shadow:0 0 40px var(--blue-glow);line-height:1}
.inv-l{font-size:.67rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-top:8px}
.why-list{display:flex;flex-direction:column}
.why-item{display:flex;gap:20px;padding:24px 0;border-bottom:1px solid rgba(255,255,255,0.06)}
.why-item:first-child{border-top:1px solid rgba(255,255,255,0.06)}
.why-n{font-family:'Syne',sans-serif;font-weight:700;font-size:.82rem;color:var(--blue);flex-shrink:0;width:28px}
.why-t{font-family:'Syne',sans-serif;font-weight:700;font-size:.92rem;margin-bottom:5px}
.why-d{font-size:.84rem;line-height:1.65;color:var(--muted)}
.deck-link{display:inline-flex;align-items:center;gap:10px;font-family:'Syne',sans-serif;font-weight:700;font-size:.88rem;background:var(--blue);color:#fff;padding:15px 32px;border-radius:100px;text-decoration:none;margin-top:36px;transition:background .2s,transform .15s,box-shadow .2s}
.deck-link:hover{background:var(--blue2);transform:translateY(-3px);box-shadow:0 12px 40px var(--blue-glow)}
#cta{border-top:1px solid rgba(255,255,255,0.06);text-align:center;padding:clamp(80px,10vw,140px) var(--r)}
.cta-h{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(3.5rem,8vw,8.5rem);line-height:.88;letter-spacing:-.05em;margin:28px 0}
.cta-h .out{-webkit-text-stroke:clamp(1px,.15vw,2px) rgba(240,237,232,0.22);color:transparent}
.cta-h .g{color:var(--blue);text-shadow:0 0 100px var(--blue-glow)}
.cta-sub{font-size:1rem;line-height:1.8;color:var(--muted);max-width:440px;margin:0 auto 44px}
.cta-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.cta-b1{font-family:'Syne',sans-serif;font-size:.92rem;font-weight:700;background:var(--blue);color:#fff;padding:17px 38px;border-radius:100px;text-decoration:none;transition:background .2s,transform .15s,box-shadow .2s}
.cta-b1:hover{background:var(--blue2);transform:translateY(-3px);box-shadow:0 16px 48px var(--blue-glow)}
.cta-b2{font-family:'Syne',sans-serif;font-size:.92rem;font-weight:700;background:transparent;color:var(--ink);padding:16px 34px;border-radius:100px;border:1px solid rgba(255,255,255,0.14);text-decoration:none;transition:border-color .2s,transform .15s}
.cta-b2:hover{border-color:rgba(255,255,255,0.4);transform:translateY(-3px)}
.cta-note{font-size:.76rem;color:var(--dim);margin-top:20px}
footer{background:rgba(255,255,255,0.015);border-top:1px solid rgba(255,255,255,0.06);padding:72px var(--r) 40px}
.foot-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:56px}
.foot-brand{font-family:'Syne',sans-serif;font-weight:800;font-size:1rem;margin-bottom:14px;display:flex;align-items:center;gap:9px}
.foot-brand-dot{display:none}
.foot-tag{font-size:.86rem;line-height:1.75;color:var(--muted);max-width:260px}
.foot-col-h{font-family:'Syne',sans-serif;font-size:.65rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);margin-bottom:18px}
.foot-links{list-style:none;display:flex;flex-direction:column;gap:10px}
.foot-links a{font-size:.84rem;color:var(--muted);text-decoration:none;transition:color .2s}
.foot-links a:hover{color:var(--ink)}
.foot-bottom{display:flex;justify-content:space-between;align-items:center;padding-top:28px;border-top:1px solid rgba(255,255,255,0.06);flex-wrap:wrap;gap:12px}
.foot-copy{font-size:.76rem;color:var(--dim)}
.foot-aa{display:flex;align-items:center;gap:8px;font-size:.76rem;color:var(--dim)}
.aa-dot{width:6px;height:6px;background:var(--grn);border-radius:50%;box-shadow:0 0 6px var(--grn)}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(44px)}to{opacity:1;transform:translateY(0)}}

`

const HTML = `
<div id="cd"></div><div id="cr"></div>
<div id="cd"></div><div id="cr"></div>
<nav id="nav">
  <a class="n-logo" href="#" style="gap:0"><img src="./ss.png" alt="SomaSyncAI" style="height:38px;width:auto;object-fit:contain;filter:drop-shadow(0 0 8px rgba(59,158,255,0.4))"/></a>
  <div class="n-pill"><a href="#features">Features</a><a href="#roadmap">Roadmap</a><a href="#how">Workflow</a><a href="#investors">Investors</a></div>
  <a class="n-cta" href="https://somasyncai.com/auth">Join Beta — Free</a>
</nav>
<section id="hero">
  <canvas id="c"></canvas>
  <div class="hero-top-stats">
    <div><div class="ts-n"><span>87</span>%</div><div class="ts-l">Less charting</div></div>
    <div><div class="ts-n"><span>100</span>%</div><div class="ts-l">Hands-free</div></div>
  </div>
  <div class="hero-inner">
    <div class="hero-badge"><div class="hero-badge-dot"></div>Now in Beta — Limited Access</div>
    <h1 class="hero-h1">THE <span class="out">GOLD</span><br><span style="color:var(--blue);text-shadow:0 0 80px var(--blue-glow)">STANDARD</span><br>CLINICAL <span class="out">OS</span></h1>
    <div style="margin-top:24px;font-family:'Syne',sans-serif;font-size:clamp(.9rem,1.5vw,1.2rem);font-weight:700;letter-spacing:.04em;color:var(--muted);opacity:0;animation:fadeUp .8s .7s forwards">The Intelligence of You.</div>
  </div>
  <div class="dash-wrap">
    <div class="dash-fade"></div>
    <div class="dash-screen">
      <div class="dash-bar"><div class="dash-dots"><div class="dash-dot dd1"></div><div class="dash-dot dd2"></div><div class="dash-dot dd3"></div></div><div class="dash-url">app.somasyncai.com/session/live</div></div>
      <div class="dash-body">
        <div class="dash-sidebar">
          <div class="dash-logo"><div class="dash-logo-dot"></div>SomaSyncAI</div>
          <div class="nav-item on"><div class="ni-dot"></div>Live Session</div>
          <div class="nav-item"><div class="ni-dot"></div>SOAP Notes</div>
          <div class="nav-item"><div class="ni-dot"></div>Patients</div>
          <div class="nav-item"><div class="ni-dot"></div>Treatment Memory</div>
          <div class="nav-item"><div class="ni-dot"></div>ICD-10 Assist</div>
          <div class="nav-item"><div class="ni-dot"></div>Analytics</div>
          <div class="nav-item"><div class="ni-dot"></div>Settings</div>
        </div>
        <div class="dash-main">
          <div class="dash-header"><div class="dash-title">New Session — Sarah M. · PT Visit #4</div><div class="dash-live"><div class="dlb-dot"></div>AALIYAH Ready</div></div>
          <!-- Session progress steps -->
          <div style="display:flex;gap:0;margin-bottom:20px;border:1px solid rgba(255,255,255,0.07);border-radius:10px;overflow:hidden">
            <div style="flex:1;padding:10px 12px;background:rgba(0,232,154,0.12);border-right:1px solid rgba(255,255,255,0.07);text-align:center">
              <div style="font-size:.55rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--grn)">✓ Intake</div>
            </div>
            <div style="flex:1;padding:10px 12px;background:rgba(0,232,154,0.08);border-right:1px solid rgba(255,255,255,0.07);text-align:center">
              <div style="font-size:.55rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--grn)">● Calibration</div>
            </div>
            <div style="flex:1;padding:10px 12px;border-right:1px solid rgba(255,255,255,0.07);text-align:center;opacity:.35">
              <div style="font-size:.55rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)">Analysis</div>
            </div>
            <div style="flex:1;padding:10px 12px;border-right:1px solid rgba(255,255,255,0.07);text-align:center;opacity:.35">
              <div style="font-size:.55rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)">Assessment</div>
            </div>
            <div style="flex:1;padding:10px 12px;border-right:1px solid rgba(255,255,255,0.07);text-align:center;opacity:.35">
              <div style="font-size:.55rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)">Generate</div>
            </div>
            <div style="flex:1;padding:10px 12px;text-align:center;opacity:.35">
              <div style="font-size:.55rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)">Live Session</div>
            </div>
          </div>
          <!-- Calibration + Consent panel -->
          <div class="aa-box" style="margin-bottom:16px">
            <div class="aa-av">🔒</div>
            <div style="flex:1">
              <div class="aa-l">Consent — Required Before Calibration</div>
              <div class="aa-t" style="margin-bottom:10px">AALIYAH will listen and process voice during this session. Client consent is required and logged.</div>
              <div style="display:flex;gap:8px">
                <div style="background:var(--grn);color:#080808;font-size:.65rem;font-weight:700;padding:6px 14px;border-radius:100px;letter-spacing:.06em">✓ Consent Given</div>
                <div style="background:rgba(255,255,255,0.06);color:var(--muted);font-size:.65rem;font-weight:700;padding:6px 14px;border-radius:100px;letter-spacing:.06em">View Policy</div>
              </div>
            </div>
          </div>
          <div class="aa-box">
            <div class="aa-av">🎧</div>
            <div style="flex:1">
              <div class="aa-l">AALIYAH — Voice Calibration</div>
              <div class="aa-t" style="margin-bottom:10px">Say the following phrase clearly: <b>"AALIYAH, begin session for Sarah Mitchell."</b> Calibrating to your voice in current environment.</div>
              <div class="waveform" id="wf1" style="margin-top:0;height:32px;border:none;background:transparent;padding:0"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<div class="mq-wrap"><div class="mq-track"><span class="mq-item">Live In-Ear AI <span class="s">◆</span></span><span class="mq-item">Automatic SOAP Notes <span class="s">◆</span></span><span class="mq-item">Voice Charting <span class="s">◆</span></span><span class="mq-item">Treatment Memory <span class="s">◆</span></span><span class="mq-item">Gold Standard Documentation <span class="s">◆</span></span><span class="mq-item">Physical Therapy <span class="s">◆</span></span><span class="mq-item">Chiropractic <span class="s">◆</span></span><span class="mq-item">Massage Therapy <span class="s">◆</span></span><span class="mq-item">Sports Medicine <span class="s">◆</span></span><span class="mq-item">ICD-10 Assist <span class="s">◆</span></span><span class="mq-item">AALIYAH.IO Powered <span class="s">◆</span></span><span class="mq-item">Live In-Ear AI <span class="s">◆</span></span><span class="mq-item">Automatic SOAP Notes <span class="s">◆</span></span><span class="mq-item">Voice Charting <span class="s">◆</span></span><span class="mq-item">Treatment Memory <span class="s">◆</span></span><span class="mq-item">Gold Standard Documentation <span class="s">◆</span></span><span class="mq-item">Physical Therapy <span class="s">◆</span></span><span class="mq-item">Chiropractic <span class="s">◆</span></span><span class="mq-item">Massage Therapy <span class="s">◆</span></span><span class="mq-item">Sports Medicine <span class="s">◆</span></span><span class="mq-item">ICD-10 Assist <span class="s">◆</span></span><span class="mq-item">AALIYAH.IO Powered <span class="s">◆</span></span></div></div>
<section id="problem" class="sec">
  <div class="sec-tag rv">The Problem</div>
  <h2 class="sec-h rv d1">YOU DIDN'T<br>TRAIN TO <span class="out">CHART.</span></h2>
  <p class="sec-sub rv d2">Manual therapists spend nearly as much time documenting as treating. That ends now.</p>
  <div class="prob-row">
    <div class="prob-card rv d1"><div class="prob-n">3H</div><div class="prob-l">Daily Documentation Burden</div><div class="prob-d">Average practitioner spends 3+ hours per day on notes, charting, and admin tasks.</div></div>
    <div class="prob-card rv d2"><div class="prob-n">40%</div><div class="prob-l">Of Clinical Time Lost</div><div class="prob-d">Nearly half your working day goes to paperwork instead of patient care.</div></div>
    <div class="prob-card rv d3"><div class="prob-n">#1</div><div class="prob-l">Cause of Burnout</div><div class="prob-d">Documentation overload is the leading driver of burnout across every manual therapy discipline.</div></div>
    <div class="prob-full rv"><div class="prob-full-t">SOMASYNCAI SOLVES THIS</div><div class="ptags"><span class="ptag">🎧 Live In-Ear Guidance</span><span class="ptag">🎤 Voice → SOAP Note</span><span class="ptag">🧠 Treatment Memory</span></div></div>
  </div>
</section>
<section id="features" class="sec">
  <div class="sec-tag rv">Core Features — Live Now</div>
  <h2 class="sec-h rv d1">BUILT FOR THE<br><span class="out">TREATMENT</span> TABLE</h2>
  <div class="feat-grid">
    <div class="feat-card rv d1"><div class="feat-ico">🎧</div><div class="feat-title">Live In-Ear AI Guidance</div><div class="feat-desc">Real-time suggestions whispered during assessments. Like having a brilliant clinical colleague on every case.</div><div class="feat-live"><div class="feat-live-dot"></div>Live Now</div></div>
    <div class="feat-card rv d2"><div class="feat-ico">📋</div><div class="feat-title">Automatic SOAP Notes</div><div class="feat-desc">Speak naturally. SomaSyncAI structures everything instantly into compliant, ready-to-sign documentation.</div><div class="feat-live"><div class="feat-live-dot"></div>Live Now</div></div>
    <div class="feat-card rv d3"><div class="feat-ico">🎤</div><div class="feat-title">Voice Charting</div><div class="feat-desc">Hands on the patient. Voice on the record. Document without breaking contact.</div><div class="feat-live"><div class="feat-live-dot"></div>Live Now</div></div>
    <div class="feat-card feat-row2 rv d1"><div class="feat-ico">🧠</div><div class="feat-title">Treatment Memory</div><div class="feat-desc">Every session deepens the AI's understanding. Pattern recognition compounds across all visits.</div><div class="feat-live"><div class="feat-live-dot"></div>Live Now</div></div>
    <div class="feat-card feat-row2 rv d2"><div class="feat-ico">🔬</div><div class="feat-title">ICD-10 Code Assist</div><div class="feat-desc">AI suggests relevant diagnostic codes from your documentation. Reduce billing errors instantly.</div><div class="feat-live"><div class="feat-live-dot"></div>Live Now</div></div>
    <div class="feat-card feat-row2 rv d3"><div class="feat-ico">⚡</div><div class="feat-title">Instant Documentation</div><div class="feat-desc">Walk out of treatment with complete notes already generated. No after-hours charting. Ever again.</div><div class="feat-live"><div class="feat-live-dot"></div>Live Now</div></div>
  </div>
</section>
<section id="ds-sec">
  <div class="ds-hd">
    <div><div class="sec-tag rv">The Dashboard</div><h2 class="sec-h rv d1">YOUR CLINICAL<br><span class="g">COMMAND</span> CENTER</h2></div>
    <p class="sec-sub rv d2">Live sessions, patient history, SOAP notes, and AALIYAH's real-time guidance — all in one place.</p>
  </div>
  <div class="ds-wrap rv">
    <div class="ds-glow"></div>
    <div class="ds-screen">
      <div class="ds-bar2"><div class="dash-dots"><div class="dash-dot dd1"></div><div class="dash-dot dd2"></div><div class="dash-dot dd3"></div></div><div class="dash-url" style="max-width:300px">app.somasyncai.com/dashboard</div></div>
      <div class="ds-inner">
        <div class="ds-side">
          <div class="ds-side-logo"><div class="ds-sld"></div>SomaSyncAI</div>
          <div class="ds-ni on"><span class="ds-ni-ico">🎧</span>Live Session</div>
          <div class="ds-ni"><span class="ds-ni-ico">📋</span>SOAP Notes</div>
          <div class="ds-ni"><span class="ds-ni-ico">👤</span>Patients</div>
          <div class="ds-ni"><span class="ds-ni-ico">🧠</span>Treatment Memory</div>
          <div class="ds-ni"><span class="ds-ni-ico">🔬</span>ICD-10 Assist</div>
          <div class="ds-ni"><span class="ds-ni-ico">📊</span>Analytics</div>
          <div class="ds-ni"><span class="ds-ni-ico">⚙️</span>Settings</div>
        </div>
        <div class="ds-center">
          <div class="ds-ct"><div class="ds-cth">James R. — Health History Review</div><div class="ds-rec"><div class="ds-rec-dot" style="background:var(--grn)"></div>Analyzing</div></div>
          <!-- Step progress -->
          <div style="display:flex;gap:0;margin-bottom:22px;border:1px solid rgba(255,255,255,0.07);border-radius:10px;overflow:hidden">
            <div style="flex:1;padding:9px 10px;background:rgba(0,232,154,0.1);border-right:1px solid rgba(255,255,255,0.07);text-align:center"><div style="font-size:.52rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--grn)">✓ Intake</div></div>
            <div style="flex:1;padding:9px 10px;background:rgba(0,232,154,0.1);border-right:1px solid rgba(255,255,255,0.07);text-align:center"><div style="font-size:.52rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--grn)">✓ Calibration</div></div>
            <div style="flex:1;padding:9px 10px;background:rgba(0,232,154,0.14);border-right:1px solid rgba(255,255,255,0.07);text-align:center"><div style="font-size:.52rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--grn)">● Analysis</div></div>
            <div style="flex:1;padding:9px 10px;border-right:1px solid rgba(255,255,255,0.07);text-align:center;opacity:.3"><div style="font-size:.52rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)">Assessment</div></div>
            <div style="flex:1;padding:9px 10px;border-right:1px solid rgba(255,255,255,0.07);text-align:center;opacity:.3"><div style="font-size:.52rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)">Generate</div></div>
            <div style="flex:1;padding:9px 10px;text-align:center;opacity:.3"><div style="font-size:.52rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)">Live Session</div></div>
          </div>
          <div class="ds-sg">
            <div class="ds-sc"><div class="ds-sl">Chief Complaint</div><div class="ds-st">Cervical pain and <b>tension headaches.</b> Onset 3 months ago. Progressive. Desk worker, 10hr/day average.</div></div>
            <div class="ds-sc"><div class="ds-sl">Relevant History</div><div class="ds-st">No prior surgeries. <b>Hypertension (managed).</b> Previous whiplash 2018. No current medications contraindicated.</div></div>
            <div class="ds-sc" style="background:rgba(255,80,80,0.04);border-color:rgba(255,100,100,0.2)"><div class="ds-sl" style="color:#ff8080">⚠ Contraindication Check</div><div class="ds-st">Hypertension noted — <b>avoid aggressive cervical manipulation.</b> AALIYAH flagged: confirm BP before session.</div></div>
            <div class="ds-sc" style="background:rgba(0,232,154,0.04);border-color:rgba(0,232,154,0.18)"><div class="ds-sl">AALIYAH Recommends</div><div class="ds-st">Perform <b>cervical orthopedic tests:</b> Spurling's, distraction, Valsalva. Check dermatomal patterns before bodywork.</div></div>
          </div>
          <div class="ds-aa"><div class="ds-aa-av">🎧</div><div><div class="ds-aa-l">AALIYAH — Contraindication Analysis Complete</div><div class="ds-aa-t">Health history processed. <b>1 flag raised</b> (hypertension). No session-blocking contraindications. Cleared to proceed — confirm BP reading, then begin visual assessment.</div></div></div>
          <div class="ds-wv" id="wf2"></div>
        </div>
        <div class="ds-right">
          <div class="ds-rt">Today's Patients</div>
          <div class="ds-pat"><div class="ds-pn">James R.</div><div class="ds-pi">9:00 AM · Cervical / PT<br>Session #7 of 12</div><div class="ds-ptag">● Active Now</div></div>
          <div class="ds-pat"><div class="ds-pn">Maria S.</div><div class="ds-pi">10:30 AM · Lower Back<br>Session #3 of 8</div></div>
          <div class="ds-pat"><div class="ds-pn">David K.</div><div class="ds-pi">12:00 PM · Shoulder / Sports<br>New Patient</div></div>
          <div style="margin-top:20px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.06)">
            <div class="ds-rt">Session Metrics</div>
            <div class="ds-metric"><div class="ds-ml">Charting Time Saved</div><div class="ds-mv">47 min</div></div>
            <div class="ds-metric"><div class="ds-ml">Notes Generated</div><div class="ds-mv">3 / 3</div></div>
            <div class="ds-metric"><div class="ds-ml">ICD-10 Codes</div><div class="ds-mv">M54.2, M54.5</div></div>
            <div class="ds-metric"><div class="ds-ml">AALIYAH Insights</div><div class="ds-mv">12 today</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<section id="how" class="sec">
  <div class="sec-tag rv">Full Session Workflow</div>
  <h2 class="sec-h rv d1">A SESSION WITH <span class="g">AALIYAH</span></h2>
  <p class="sec-sub rv d2">AALIYAH.IO is the clinical intelligence powering SomaSyncAI. Here's exactly how a session flows — from intake to documentation.</p>
  <div class="how-grid" style="grid-template-columns:repeat(3,1fr);margin-top:60px">
    <div class="how-card rv d1">
      <div class="how-n">01</div>
      <div class="how-t">Intake Form & Health History</div>
      <div class="how-d">Client fills out the intake form while you prepare. No rushing — a complete health history is the foundation of everything that follows.</div>
      <div style="margin-top:16px;font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--grn)">Intake & Preparation</div>
    </div>
    <div class="how-card rv d2">
      <div class="how-n">02</div>
      <div class="how-t">AALIYAH Wakes Up</div>
      <div class="how-d">Power on the earpiece, open the SOAP dashboard. AALIYAH shows consent first — always. Then runs a brief voice calibration so she recognises your voice precisely in any environment.</div>
      <div style="margin-top:16px;font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--grn)">Calibration & Consent</div>
    </div>
    <div class="how-card rv d3">
      <div class="how-n">03</div>
      <div class="how-t">AALIYAH Analyzes for Contraindications</div>
      <div class="how-d">Reflect the client's intake history out loud. AALIYAH starts clinical analysis — checking contraindications first, flagging conditions, suggesting orthopedic tests.</div>
      <div style="margin-top:16px;font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--grn)">Clinical Analysis</div>
    </div>
    <div class="how-card rv d1" style="border-top:1px solid rgba(255,255,255,0.06)">
      <div class="how-n">04</div>
      <div class="how-t">Visual Assessment — Circle the Client</div>
      <div class="how-d">Analyze gait, posture, and alignment while circling the client. Call out what you see. AALIYAH captures every observation, merging Western anatomy with TCM principles in real time.</div>
      <div style="margin-top:16px;font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--grn)">Visual & Postural Assessment</div>
    </div>
    <div class="how-card rv d2" style="border-top:1px solid rgba(255,255,255,0.06)">
      <div class="how-n">05</div>
      <div class="how-t">Generate Documentation</div>
      <div class="how-d">Before bodywork begins, hit Generate. AALIYAH produces a full treatment plan and SOAP note draft from everything captured. You review and verify — AI assists, the clinician decides.</div>
      <div style="margin-top:16px;display:inline-flex;align-items:center;gap:7px;background:rgba(0,232,154,0.1);border:1px solid rgba(0,232,154,0.25);color:var(--grn);font-size:.62rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:5px 14px;border-radius:100px">⚡ Generate Documentation</div>
    </div>
    <div class="how-card rv d3" style="border-top:1px solid rgba(255,255,255,0.06)">
      <div class="how-n">06</div>
      <div class="how-t">Document Live During Bodywork</div>
      <div class="how-d">Session begins. Start live voice documentation while treating. Tissue response, adjustments, outcomes — all logged in real time by AALIYAH. Walk out with complete notes. Every session. No exceptions.</div>
      <div style="margin-top:16px;font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--grn)">Live Treatment Session</div>
    </div>
  </div>
</section>
<section id="roadmap" class="sec">
  <div class="sec-tag rv">Product Roadmap</div>
  <h2 class="sec-h rv d1">FOUR PHASES.<br><span class="out">ONE</span> VISION.</h2>
  <div class="road-grid">
    <div class="road-card rv d1"><div class="road-live">Live Now</div><div class="road-phase">Phase 01 — Q1 2026</div><div class="road-t">Clinical Documentation MVP</div><ul class="road-items"><li>Live in-ear AI guidance</li><li>Automatic SOAP notes</li><li>Voice charting</li><li>Treatment memory</li><li>ICD-10 code assist</li><li>Dashboard & chat</li></ul></div>
    <div class="road-card rv d2"><div class="road-phase">Phase 02 — Q3 2026</div><div class="road-t">Intelligence Expansion</div><ul class="road-items"><li>SomaSphere 3D visualizer</li><li>SyncLearn in-ear education</li><li>EHR integrations</li><li>Mobile app (iOS)</li><li>Practice dashboard</li><li>Billing code assist</li></ul><div class="road-date">Coming Q3 2026</div></div>
    <div class="road-card rv d3"><div class="road-phase">Phase 03 — Q4 2026</div><div class="road-t">Wearable + Population Layer</div><ul class="road-items"><li>Wearable device integration</li><li>Real-time biometrics</li><li>Population analytics</li><li>Outcome tracking</li><li>Referral insights</li><li>Pattern reporting</li></ul><div class="road-date">Coming Q4 2026</div></div>
    <div class="road-card rv d4"><div class="road-phase">Phase 04 — 2027</div><div class="road-t">Predictive Care OS</div><ul class="road-items"><li>Predictive care AI</li><li>Re-injury risk flags</li><li>Personalised care paths</li><li>Multi-location enterprise</li><li>API for EHR vendors</li><li>International expansion</li></ul><div class="road-date">Coming 2027</div></div>
  </div>
</section>
<!-- ══ COMING SOON ══ -->
<section id="coming" class="sec" style="border-top:1px solid rgba(255,255,255,0.06)">
  <div class="sec-tag rv">The Full Vision</div>
  <h2 class="sec-h rv d1">WHAT'S <span class="g">COMING</span></h2>
  <p class="sec-sub rv d2">SomaSyncAI is evolving into a full Practitioner Hub — collaborative intelligence, continuous learning, and global reach in one platform.</p>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.06);margin-top:60px">
    <div class="feat-card rv d1" style="grid-column:span 1">
      <div class="feat-ico">🌐</div>
      <div class="feat-title">SomaSphere</div>
      <div class="feat-desc">A live interactive 3D anatomical model overlaid with population-level heat maps. See the statistical prevalence of deviations — anterior pelvic tilt, upper crossed syndrome — across anonymized demographics. Move from treating one patient to understanding community-level musculoskeletal health trends.</div>
      <div style="margin-top:16px;font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);border:1px solid rgba(255,255,255,0.1);padding:5px 12px;border-radius:100px;display:inline-block">Coming Q3 2026</div>
    </div>
    <div class="feat-card rv d2">
      <div class="feat-ico">📚</div>
      <div class="feat-title">SyncLearn</div>
      <div class="feat-desc">Just-in-time clinical education delivered in your ear during treatment. When AALIYAH detects Upper Crossed Syndrome, a Learn icon appears. Tap for a 30–90 second video — palpation techniques, involved muscle groups, or associated TCM patterns. Every session becomes a learning opportunity.</div>
      <div style="margin-top:16px;font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);border:1px solid rgba(255,255,255,0.1);padding:5px 12px;border-radius:100px;display:inline-block">Coming Q3 2026</div>
    </div>
    <div class="feat-card rv d3">
      <div class="feat-ico">⌚</div>
      <div class="feat-title">Wearable Integration</div>
      <div class="feat-desc">Real-time biometric data from patient wearables feeding directly into the clinical AI. HRV, movement quality, muscle activation patterns, and recovery metrics woven into every session record and treatment recommendation.</div>
      <div style="margin-top:16px;font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);border:1px solid rgba(255,255,255,0.1);padding:5px 12px;border-radius:100px;display:inline-block">Coming Q4 2026</div>
    </div>
    <div class="feat-card feat-row2 rv d1">
      <div class="feat-ico">🔮</div>
      <div class="feat-title">Predictive Care Intelligence</div>
      <div class="feat-desc">AI that predicts patient outcomes before they happen. Re-injury risk flags, treatment response forecasting, and personalised care pathway generation based on population-level pattern intelligence and individual longitudinal data.</div>
      <div style="margin-top:16px;font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);border:1px solid rgba(255,255,255,0.1);padding:5px 12px;border-radius:100px;display:inline-block">Coming 2027</div>
    </div>
    <div class="feat-card feat-row2 rv d2">
      <div class="feat-ico">🌍</div>
      <div class="feat-title">Global Expansion</div>
      <div class="feat-desc">SomaSyncAI is being translated into dozens of languages to serve practitioners worldwide. The gold standard clinical OS is not just a California product — it's a global one. International beta cohorts launching after the US foundation is set.</div>
      <div style="margin-top:16px;font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);border:1px solid rgba(255,255,255,0.1);padding:5px 12px;border-radius:100px;display:inline-block">Coming 2027</div>
    </div>
    <div class="feat-card feat-row2 rv d3">
      <div class="feat-ico">🏛</div>
      <div class="feat-title">The Practitioner Hub</div>
      <div class="feat-desc">The full Hub brings everything together — SomaSphere collaborative insights, SyncLearn education, session review, SOAP documentation, and community-powered wisdom. One ecosystem. Every tool a modern bodywork professional needs, in one place.</div>
      <div style="margin-top:16px;font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);border:1px solid rgba(255,255,255,0.1);padding:5px 12px;border-radius:100px;display:inline-block">The Full Vision</div>
    </div>
  </div>
</section>

<!-- ══ DISCIPLINES ══ -->
<section id="who" style="border-top:1px solid rgba(255,255,255,0.06);padding:clamp(80px,10vw,140px) var(--r)">
  <div class="sec-tag rv">Disciplines</div>
  <h2 class="sec-h rv d1">BUILT FOR EVERY<br><span class="out">HANDS-ON</span> PRACTITIONER</h2>
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.06);margin-top:60px">
    <div class="feat-card rv d1" style="padding:52px 44px">
      <div style="font-size:2rem;margin-bottom:20px">💆</div>
      <div class="feat-title" style="font-size:1.2rem;margin-bottom:12px">Massage Therapists</div>
      <div class="feat-desc">Document trigger points, muscle tension, and treatment responses without lifting your hands. Build longitudinal client records that elevate your practice above the rest.</div>
    </div>
    <div class="feat-card rv d2" style="padding:52px 44px">
      <div style="font-size:2rem;margin-bottom:20px">🏃</div>
      <div class="feat-title" style="font-size:1.2rem;margin-bottom:12px">Physical Therapists</div>
      <div class="feat-desc">Real-time AI guidance during functional assessments. Automatic documentation of ROM measurements, functional tests, and treatment progressions.</div>
    </div>
    <div class="feat-card rv d3" style="padding:52px 44px;border-top:1px solid rgba(255,255,255,0.06)">
      <div style="font-size:2rem;margin-bottom:20px">🦴</div>
      <div class="feat-title" style="font-size:1.2rem;margin-bottom:12px">Chiropractors</div>
      <div class="feat-desc">Voice-charted spinal assessments, adjustment records, and patient progress notes. Documentation that keeps pace with your adjusting table.</div>
    </div>
    <div class="feat-card rv d4" style="padding:52px 44px;border-top:1px solid rgba(255,255,255,0.06)">
      <div style="font-size:2rem;margin-bottom:20px">⚽</div>
      <div class="feat-title" style="font-size:1.2rem;margin-bottom:12px">Sports Medicine & Athletic Trainers</div>
      <div class="feat-desc">Sideline-ready documentation. Rapid injury assessment recording, return-to-play tracking, and performance pattern recognition across your roster.</div>
    </div>
  </div>
</section>

<!-- ══ TRUSTED INSTITUTIONS ══ -->
<div style="border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);padding:56px var(--r);background:rgba(255,255,255,0.015)">
  <div style="font-family:'Syne',sans-serif;font-size:.65rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(240,237,232,0.25);text-align:center;margin-bottom:40px">Aligned With Leading Medical & Academic Institutions</div>
  <!-- SCROLLING LOGO STRIP -->
  <div style="overflow:hidden;position:relative">
    <!-- Fade edges -->
    <div style="position:absolute;left:0;top:0;bottom:0;width:120px;background:linear-gradient(to right,#080808,transparent);z-index:2;pointer-events:none"></div>
    <div style="position:absolute;right:0;top:0;bottom:0;width:120px;background:linear-gradient(to left,#080808,transparent);z-index:2;pointer-events:none"></div>
    <div class="logo-track" style="display:flex;align-items:center;width:max-content;animation:march 40s linear infinite;gap:0">

      <!-- ─────────────────────────────────────────────────
           LOGO SLOTS — replace each .logo-slot img src
           with the path to your official SVG file.
           Recommended: white/light version of each logo.
           Height: 28–36px. All SVGs should be monochrome
           white or very light so they read on dark bg.
      ───────────────────────────────────────────────── -->

      <!-- SLOT 1: Stanford Medicine -->
      <div class="logo-slot" style="padding:0 48px;display:flex;align-items:center;flex-shrink:0;opacity:.45;transition:opacity .2s" onmouseenter="this.style.opacity='.9'" onmouseleave="this.style.opacity='.45'">
        <!-- REPLACE src WITH: /path/to/stanford-medicine.svg -->
        <span style="font-family:'Syne',sans-serif;font-weight:800;font-size:.88rem;letter-spacing:.04em;color:#fff;white-space:nowrap">STANFORD<br><span style="font-weight:400;font-size:.72rem;letter-spacing:.1em;opacity:.6">MEDICINE</span></span>
      </div>

      <!-- SLOT 2: Johns Hopkins Medicine -->
      <div class="logo-slot" style="padding:0 48px;display:flex;align-items:center;flex-shrink:0;opacity:.45;transition:opacity .2s" onmouseenter="this.style.opacity='.9'" onmouseleave="this.style.opacity='.45'">
        <!-- REPLACE src WITH: /path/to/johns-hopkins.svg -->
        <span style="font-family:'Syne',sans-serif;font-weight:800;font-size:.88rem;letter-spacing:.04em;color:#fff;white-space:nowrap">JOHNS HOPKINS<br><span style="font-weight:400;font-size:.72rem;letter-spacing:.1em;opacity:.6">MEDICINE</span></span>
      </div>

      <!-- SLOT 3: Mayo Clinic -->
      <div class="logo-slot" style="padding:0 48px;display:flex;align-items:center;flex-shrink:0;opacity:.45;transition:opacity .2s" onmouseenter="this.style.opacity='.9'" onmouseleave="this.style.opacity='.45'">
        <!-- REPLACE src WITH: /path/to/mayo-clinic.svg -->
        <span style="font-family:'Syne',sans-serif;font-weight:800;font-size:.88rem;letter-spacing:.04em;color:#fff;white-space:nowrap">MAYO<br><span style="font-weight:400;font-size:.72rem;letter-spacing:.1em;opacity:.6">CLINIC</span></span>
      </div>

      <!-- SLOT 4: UCSF Health -->
      <div class="logo-slot" style="padding:0 48px;display:flex;align-items:center;flex-shrink:0;opacity:.45;transition:opacity .2s" onmouseenter="this.style.opacity='.9'" onmouseleave="this.style.opacity='.45'">
        <!-- REPLACE src WITH: /path/to/ucsf.svg -->
        <span style="font-family:'Syne',sans-serif;font-weight:800;font-size:.88rem;letter-spacing:.04em;color:#fff;white-space:nowrap">UCSF<br><span style="font-weight:400;font-size:.72rem;letter-spacing:.1em;opacity:.6">HEALTH</span></span>
      </div>

      <!-- SLOT 5: APTA — American Physical Therapy Association -->
      <div class="logo-slot" style="padding:0 48px;display:flex;align-items:center;flex-shrink:0;opacity:.45;transition:opacity .2s" onmouseenter="this.style.opacity='.9'" onmouseleave="this.style.opacity='.45'">
        <!-- REPLACE src WITH: /path/to/apta.svg -->
        <span style="font-family:'Syne',sans-serif;font-weight:800;font-size:.88rem;letter-spacing:.04em;color:#fff;white-space:nowrap">APTA<br><span style="font-weight:400;font-size:.72rem;letter-spacing:.1em;opacity:.6">AMERICAN PT ASSOC.</span></span>
      </div>

      <!-- SLOT 6: AMTA — American Massage Therapy Association -->
      <div class="logo-slot" style="padding:0 48px;display:flex;align-items:center;flex-shrink:0;opacity:.45;transition:opacity .2s" onmouseenter="this.style.opacity='.9'" onmouseleave="this.style.opacity='.45'">
        <!-- REPLACE src WITH: /path/to/amta.svg -->
        <span style="font-family:'Syne',sans-serif;font-weight:800;font-size:.88rem;letter-spacing:.04em;color:#fff;white-space:nowrap">AMTA<br><span style="font-weight:400;font-size:.72rem;letter-spacing:.1em;opacity:.6">MASSAGE THERAPY ASSOC.</span></span>
      </div>

      <!-- SLOT 7: ACA — American Chiropractic Association -->
      <div class="logo-slot" style="padding:0 48px;display:flex;align-items:center;flex-shrink:0;opacity:.45;transition:opacity .2s" onmouseenter="this.style.opacity='.9'" onmouseleave="this.style.opacity='.45'">
        <!-- REPLACE src WITH: /path/to/aca-chiro.svg -->
        <span style="font-family:'Syne',sans-serif;font-weight:800;font-size:.88rem;letter-spacing:.04em;color:#fff;white-space:nowrap">ACA<br><span style="font-weight:400;font-size:.72rem;letter-spacing:.1em;opacity:.6">CHIROPRACTIC ASSOC.</span></span>
      </div>

      <!-- SLOT 8: HIPAA Compliance -->
      <div class="logo-slot" style="padding:0 48px;display:flex;align-items:center;flex-shrink:0;opacity:.45;transition:opacity .2s" onmouseenter="this.style.opacity='.9'" onmouseleave="this.style.opacity='.45'">
        <!-- REPLACE src WITH: /path/to/hipaa-seal.svg -->
        <span style="font-family:'Syne',sans-serif;font-weight:800;font-size:.88rem;letter-spacing:.04em;color:#fff;white-space:nowrap">HIPAA<br><span style="font-weight:400;font-size:.72rem;letter-spacing:.1em;opacity:.6">COMPLIANT</span></span>
      </div>

      <!-- DUPLICATE SET for seamless loop -->
      <div class="logo-slot" style="padding:0 48px;display:flex;align-items:center;flex-shrink:0;opacity:.45;transition:opacity .2s" onmouseenter="this.style.opacity='.9'" onmouseleave="this.style.opacity='.45'"><span style="font-family:'Syne',sans-serif;font-weight:800;font-size:.88rem;letter-spacing:.04em;color:#fff;white-space:nowrap">STANFORD<br><span style="font-weight:400;font-size:.72rem;letter-spacing:.1em;opacity:.6">MEDICINE</span></span></div>
      <div class="logo-slot" style="padding:0 48px;display:flex;align-items:center;flex-shrink:0;opacity:.45;transition:opacity .2s" onmouseenter="this.style.opacity='.9'" onmouseleave="this.style.opacity='.45'"><span style="font-family:'Syne',sans-serif;font-weight:800;font-size:.88rem;letter-spacing:.04em;color:#fff;white-space:nowrap">JOHNS HOPKINS<br><span style="font-weight:400;font-size:.72rem;letter-spacing:.1em;opacity:.6">MEDICINE</span></span></div>
      <div class="logo-slot" style="padding:0 48px;display:flex;align-items:center;flex-shrink:0;opacity:.45;transition:opacity .2s" onmouseenter="this.style.opacity='.9'" onmouseleave="this.style.opacity='.45'"><span style="font-family:'Syne',sans-serif;font-weight:800;font-size:.88rem;letter-spacing:.04em;color:#fff;white-space:nowrap">MAYO<br><span style="font-weight:400;font-size:.72rem;letter-spacing:.1em;opacity:.6">CLINIC</span></span></div>
      <div class="logo-slot" style="padding:0 48px;display:flex;align-items:center;flex-shrink:0;opacity:.45;transition:opacity .2s" onmouseenter="this.style.opacity='.9'" onmouseleave="this.style.opacity='.45'"><span style="font-family:'Syne',sans-serif;font-weight:800;font-size:.88rem;letter-spacing:.04em;color:#fff;white-space:nowrap">UCSF<br><span style="font-weight:400;font-size:.72rem;letter-spacing:.1em;opacity:.6">HEALTH</span></span></div>
      <div class="logo-slot" style="padding:0 48px;display:flex;align-items:center;flex-shrink:0;opacity:.45;transition:opacity .2s" onmouseenter="this.style.opacity='.9'" onmouseleave="this.style.opacity='.45'"><span style="font-family:'Syne',sans-serif;font-weight:800;font-size:.88rem;letter-spacing:.04em;color:#fff;white-space:nowrap">APTA<br><span style="font-weight:400;font-size:.72rem;letter-spacing:.1em;opacity:.6">AMERICAN PT ASSOC.</span></span></div>
      <div class="logo-slot" style="padding:0 48px;display:flex;align-items:center;flex-shrink:0;opacity:.45;transition:opacity .2s" onmouseenter="this.style.opacity='.9'" onmouseleave="this.style.opacity='.45'"><span style="font-family:'Syne',sans-serif;font-weight:800;font-size:.88rem;letter-spacing:.04em;color:#fff;white-space:nowrap">AMTA<br><span style="font-weight:400;font-size:.72rem;letter-spacing:.1em;opacity:.6">MASSAGE THERAPY ASSOC.</span></span></div>
      <div class="logo-slot" style="padding:0 48px;display:flex;align-items:center;flex-shrink:0;opacity:.45;transition:opacity .2s" onmouseenter="this.style.opacity='.9'" onmouseleave="this.style.opacity='.45'"><span style="font-family:'Syne',sans-serif;font-weight:800;font-size:.88rem;letter-spacing:.04em;color:#fff;white-space:nowrap">ACA<br><span style="font-weight:400;font-size:.72rem;letter-spacing:.1em;opacity:.6">CHIROPRACTIC ASSOC.</span></span></div>
      <div class="logo-slot" style="padding:0 48px;display:flex;align-items:center;flex-shrink:0;opacity:.45;transition:opacity .2s" onmouseenter="this.style.opacity='.9'" onmouseleave="this.style.opacity='.45'"><span style="font-family:'Syne',sans-serif;font-weight:800;font-size:.88rem;letter-spacing:.04em;color:#fff;white-space:nowrap">HIPAA<br><span style="font-weight:400;font-size:.72rem;letter-spacing:.1em;opacity:.6">COMPLIANT</span></span></div>

    </div>
  </div>
</div>

<!-- ══ TESTIMONIAL ══ -->
<section style="border-top:1px solid rgba(255,255,255,0.06);padding:clamp(80px,10vw,140px) var(--r);background:rgba(255,255,255,0.015)">
  <div class="sec-tag rv">Early Access Feedback</div>
  <div class="rv d1" style="font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(1.6rem,3.5vw,3rem);line-height:1.15;letter-spacing:-.03em;max-width:900px;margin:36px 0 20px;border-left:3px solid var(--grn);padding-left:32px">"I finished my last patient and my notes were already done. For the first time in 12 years of practice, I left on time."</div>
  <div class="rv d2" style="font-size:.88rem;color:var(--muted);padding-left:35px">Beta Practitioner — Physical Therapist, California</div>
</section>

<!-- ══ CALIFORNIA LOCATIONS ══ -->
<section style="border-top:1px solid rgba(255,255,255,0.06);padding:clamp(80px,10vw,140px) var(--r)">
  <div class="sec-tag rv">Serving California & Beyond</div>
  <h2 class="sec-h rv d1">BUILT FOR<br><span class="g">CALIFORNIA</span> PRACTITIONERS</h2>
  <p class="sec-sub rv d2">Currently prioritising California practitioners in our first beta cohort — with national expansion underway.</p>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:40px;margin-top:60px">
    <div class="rv d1">
      <div style="font-family:'Syne',sans-serif;font-size:.65rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--grn);margin-bottom:16px">Central Valley</div>
      <ul style="list-style:none;display:flex;flex-direction:column;gap:10px">
        <li style="font-size:.88rem;color:var(--muted)"><strong style="color:var(--ink);display:block;font-size:.88rem">Fresno, CA</strong>Physical therapy & chiropractic</li>
        <li style="font-size:.88rem;color:var(--muted)"><strong style="color:var(--ink);display:block;font-size:.88rem">Bakersfield, CA</strong>Manual therapy & sports medicine</li>
        <li style="font-size:.88rem;color:var(--muted)"><strong style="color:var(--ink);display:block;font-size:.88rem">Stockton, CA</strong>Massage therapy & rehabilitation</li>
        <li style="font-size:.88rem;color:var(--muted)"><strong style="color:var(--ink);display:block;font-size:.88rem">Modesto, CA</strong>Chiropractic & wellness</li>
      </ul>
    </div>
    <div class="rv d2">
      <div style="font-family:'Syne',sans-serif;font-size:.65rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--grn);margin-bottom:16px">Los Angeles Region</div>
      <ul style="list-style:none;display:flex;flex-direction:column;gap:10px">
        <li style="font-size:.88rem;color:var(--muted)"><strong style="color:var(--ink);display:block;font-size:.88rem">Los Angeles, CA</strong>Manual therapy & sports medicine</li>
        <li style="font-size:.88rem;color:var(--muted)"><strong style="color:var(--ink);display:block;font-size:.88rem">Long Beach, CA</strong>Physical therapy & chiropractic</li>
        <li style="font-size:.88rem;color:var(--muted)"><strong style="color:var(--ink);display:block;font-size:.88rem">Pasadena, CA</strong>Sports medicine & PT</li>
        <li style="font-size:.88rem;color:var(--muted)"><strong style="color:var(--ink);display:block;font-size:.88rem">Glendale, CA</strong>Massage therapy & wellness</li>
      </ul>
    </div>
    <div class="rv d3">
      <div style="font-family:'Syne',sans-serif;font-size:.65rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--grn);margin-bottom:16px">Bay Area</div>
      <ul style="list-style:none;display:flex;flex-direction:column;gap:10px">
        <li style="font-size:.88rem;color:var(--muted)"><strong style="color:var(--ink);display:block;font-size:.88rem">San Francisco, CA</strong>Physical therapy & chiropractic</li>
        <li style="font-size:.88rem;color:var(--muted)"><strong style="color:var(--ink);display:block;font-size:.88rem">San Jose, CA</strong>Sports medicine & PT</li>
        <li style="font-size:.88rem;color:var(--muted)"><strong style="color:var(--ink);display:block;font-size:.88rem">Oakland, CA</strong>Massage therapy & rehab</li>
        <li style="font-size:.88rem;color:var(--muted)"><strong style="color:var(--ink);display:block;font-size:.88rem">Palo Alto, CA</strong>Clinical AI & sports medicine</li>
      </ul>
    </div>
    <div class="rv d4">
      <div style="font-family:'Syne',sans-serif;font-size:.65rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--grn);margin-bottom:16px">Sacramento & Beyond</div>
      <ul style="list-style:none;display:flex;flex-direction:column;gap:10px">
        <li style="font-size:.88rem;color:var(--muted)"><strong style="color:var(--ink);display:block;font-size:.88rem">Sacramento, CA</strong>Rehabilitation & chiropractic</li>
        <li style="font-size:.88rem;color:var(--muted)"><strong style="color:var(--ink);display:block;font-size:.88rem">San Diego, CA</strong>Athletic training & massage</li>
        <li style="font-size:.88rem;color:var(--muted)"><strong style="color:var(--ink);display:block;font-size:.88rem">New York, NY</strong>Multi-discipline practices</li>
        <li style="font-size:.88rem;color:var(--muted)"><strong style="color:var(--ink);display:block;font-size:.88rem">Chicago, IL</strong>Sports & orthopedic therapy</li>
      </ul>
    </div>
  </div>
</section>

<section id="investors" class="sec">
  <div class="sec-tag rv">For Investors</div>
  <h2 class="sec-h rv d1">THE <span class="g">OPPORTUNITY</span></h2>
  <p class="sec-sub rv d2">Building the AI OS for a $28B clinical documentation market with no purpose-built real-time solution.</p>
  <div class="inv-grid">
    <div class="inv-stats">
      <div class="inv-stat rv d1"><div class="inv-n">$28B</div><div class="inv-l">Global TAM</div></div>
      <div class="inv-stat rv d2"><div class="inv-n">1.2M</div><div class="inv-l">US Practitioners</div></div>
      <div class="inv-stat rv d3"><div class="inv-n">87%</div><div class="inv-l">Charting Reduction</div></div>
      <div class="inv-stat rv d4"><div class="inv-n">$2.5M</div><div class="inv-l">Seed Round</div></div>
    </div>
    <div>
      <div class="why-list">
        <div class="why-item rv d1"><div class="why-n">01</div><div><div class="why-t">Real-Time vs Post-Session</div><div class="why-d">Every competitor transcribes after the session. We operate live during treatment.</div></div></div>
        <div class="why-item rv d2"><div class="why-n">02</div><div><div class="why-t">Discipline-Specific Intelligence</div><div class="why-d">Built for manual therapy from the ground up — not generic medical transcription.</div></div></div>
        <div class="why-item rv d3"><div class="why-n">03</div><div><div class="why-t">Longitudinal Treatment Memory</div><div class="why-d">Session-to-session intelligence that compounds. Deep switching costs that grow with usage.</div></div></div>
        <div class="why-item rv d4"><div class="why-n">04</div><div><div class="why-t">The Full OS Vision</div><div class="why-d">SomaSphere, SyncLearn, Wearables, Predictive Care — a moat competitors can't replicate.</div></div></div>
      </div>
      <a class="deck-link rv" href="https://somasyncai.com/investor-pitch">View Full Pitch Deck →</a>
    </div>
  </div>
</section>
<!-- ══ FREE EBOOKS ══ -->
<section id="ebooks" style="border-top:1px solid rgba(255,255,255,0.06);padding:clamp(80px,10vw,140px) var(--r)">
  <div class="sec-tag rv">Free Resources</div>
  <h2 class="sec-h rv d1">FREE CLINICAL<br><span class="g">LIBRARY</span></h2>
  <p style="font-size:1rem;line-height:1.8;color:var(--muted);max-width:500px;margin-top:20px;margin-bottom:60px" class="rv d2">Gold standard references for every manual therapist — free to download. No email required.</p>

  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">

    <!-- EBOOK 1 -->
    <a href="https://drive.google.com/file/d/1_e4YjvFsmpocpoJIdsmOtuILvUeG7ep7/view?usp=drivesdk" target="_blank" class="rv d1"
      style="display:block;text-decoration:none;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:32px 28px;position:relative;overflow:hidden;transition:background .25s,border-color .25s;cursor:pointer"
      onmouseenter="this.style.background='rgba(0,232,154,0.05)';this.style.borderColor='rgba(0,232,154,0.25)'"
      onmouseleave="this.style.background='rgba(255,255,255,0.03)';this.style.borderColor='rgba(255,255,255,0.08)'">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--grn),transparent)"></div>
      <div style="font-size:2rem;margin-bottom:16px">📖</div>
      <div style="font-family:'Syne',sans-serif;font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--grn);margin-bottom:8px">Manual Therapy</div>
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.98rem;letter-spacing:-.01em;color:#fff;margin-bottom:10px;line-height:1.3">Handbook of Massage Therapy</div>
      <div style="font-size:.78rem;line-height:1.6;color:var(--muted);margin-bottom:20px">Emil Scheider's comprehensive reference covering massage techniques, protocols, and clinical applications for manual therapists.</div>
      <div style="display:inline-flex;align-items:center;gap:8px;font-family:'Syne',sans-serif;font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--grn)">⬇ Download Free</div>
    </a>

    <!-- EBOOK 2 — UPDATE TITLE if wrong -->
    <a href="https://drive.google.com/file/d/1Y5dbHmhOwi2tsu3J9C-NRwQFaPdufW_H/view?usp=drivesdk" target="_blank" class="rv d2"
      style="display:block;text-decoration:none;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:32px 28px;position:relative;overflow:hidden;transition:background .25s,border-color .25s"
      onmouseenter="this.style.background='rgba(0,232,154,0.05)';this.style.borderColor='rgba(0,232,154,0.25)'"
      onmouseleave="this.style.background='rgba(255,255,255,0.03)';this.style.borderColor='rgba(255,255,255,0.08)'">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--grn),transparent)"></div>
      <div style="font-size:2rem;margin-bottom:16px">📖</div>
      <div style="font-family:'Syne',sans-serif;font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--grn);margin-bottom:8px">Chinese Medicine</div>
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.98rem;letter-spacing:-.01em;color:#fff;margin-bottom:10px;line-height:1.3"><!-- UPDATE TITLE --></div>
      <div style="font-size:.78rem;line-height:1.6;color:var(--muted);margin-bottom:20px">Traditional Chinese Medicine principles applied to manual therapy practice — meridians, TCM patterns, and clinical integration.</div>
      <div style="display:inline-flex;align-items:center;gap:8px;font-family:'Syne',sans-serif;font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--grn)">⬇ Download Free</div>
    </a>

    <!-- EBOOK 3 — UPDATE TITLE if wrong -->
    <a href="https://drive.google.com/file/d/1dcVmz-91bSgK0MsmiQ4RgsGoPQUb877J/view?usp=drivesdk" target="_blank" class="rv d3"
      style="display:block;text-decoration:none;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:32px 28px;position:relative;overflow:hidden;transition:background .25s,border-color .25s"
      onmouseenter="this.style.background='rgba(0,232,154,0.05)';this.style.borderColor='rgba(0,232,154,0.25)'"
      onmouseleave="this.style.background='rgba(255,255,255,0.03)';this.style.borderColor='rgba(255,255,255,0.08)'">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--grn),transparent)"></div>
      <div style="font-size:2rem;margin-bottom:16px">📖</div>
      <div style="font-family:'Syne',sans-serif;font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--grn);margin-bottom:8px">Orthopedic Manual Therapy</div>
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.98rem;letter-spacing:-.01em;color:#fff;margin-bottom:10px;line-height:1.3"><!-- UPDATE TITLE --></div>
      <div style="font-size:.78rem;line-height:1.6;color:var(--muted);margin-bottom:20px">Orthopedic assessment and treatment protocols for manual therapists — joint mechanics, special tests, and evidence-based interventions.</div>
      <div style="display:inline-flex;align-items:center;gap:8px;font-family:'Syne',sans-serif;font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--grn)">⬇ Download Free</div>
    </a>

    <!-- EBOOK 4 — UPDATE TITLE if wrong -->
    <a href="https://drive.google.com/file/d/1fSaVCEKT-Y7UYIsqFfBUCtoMnlYxzUih/view?usp=drivesdk" target="_blank" class="rv d1"
      style="display:block;text-decoration:none;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:32px 28px;position:relative;overflow:hidden;transition:background .25s,border-color .25s"
      onmouseenter="this.style.background='rgba(0,232,154,0.05)';this.style.borderColor='rgba(0,232,154,0.25)'"
      onmouseleave="this.style.background='rgba(255,255,255,0.03)';this.style.borderColor='rgba(255,255,255,0.08)'">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--grn),transparent)"></div>
      <div style="font-size:2rem;margin-bottom:16px">📖</div>
      <div style="font-family:'Syne',sans-serif;font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--grn);margin-bottom:8px">Anatomy Reference</div>
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.98rem;letter-spacing:-.01em;color:#fff;margin-bottom:10px;line-height:1.3"><!-- UPDATE TITLE --></div>
      <div style="font-size:.78rem;line-height:1.6;color:var(--muted);margin-bottom:20px">Clinical anatomy reference for hands-on practitioners — musculoskeletal structures, nerve pathways, and palpation landmarks.</div>
      <div style="display:inline-flex;align-items:center;gap:8px;font-family:'Syne',sans-serif;font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--grn)">⬇ Download Free</div>
    </a>

    <!-- EBOOK 5 — UPDATE TITLE if wrong -->
    <a href="https://drive.google.com/file/d/16T4mgR8Z0twnoxbzAdQdFmVJYNlVkoIS/view?usp=drivesdk" target="_blank" class="rv d2"
      style="display:block;text-decoration:none;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:32px 28px;position:relative;overflow:hidden;transition:background .25s,border-color .25s"
      onmouseenter="this.style.background='rgba(0,232,154,0.05)';this.style.borderColor='rgba(0,232,154,0.25)'"
      onmouseleave="this.style.background='rgba(255,255,255,0.03)';this.style.borderColor='rgba(255,255,255,0.08)'">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--grn),transparent)"></div>
      <div style="font-size:2rem;margin-bottom:16px">📖</div>
      <div style="font-family:'Syne',sans-serif;font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--grn);margin-bottom:8px">Manual Therapy</div>
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.98rem;letter-spacing:-.01em;color:#fff;margin-bottom:10px;line-height:1.3"><!-- UPDATE TITLE --></div>
      <div style="font-size:.78rem;line-height:1.6;color:var(--muted);margin-bottom:20px">Essential manual therapy reference covering soft tissue techniques, joint mobilisation, and clinical reasoning frameworks.</div>
      <div style="display:inline-flex;align-items:center;gap:8px;font-family:'Syne',sans-serif;font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--grn)">⬇ Download Free</div>
    </a>

    <!-- EBOOK 6 — UPDATE TITLE if wrong -->
    <a href="https://drive.google.com/file/d/1O4wxECMZ4fKQF01wQAjZS2Jz5IOyGLry/view?usp=drivesdk" target="_blank" class="rv d3"
      style="display:block;text-decoration:none;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:32px 28px;position:relative;overflow:hidden;transition:background .25s,border-color .25s"
      onmouseenter="this.style.background='rgba(0,232,154,0.05)';this.style.borderColor='rgba(0,232,154,0.25)'"
      onmouseleave="this.style.background='rgba(255,255,255,0.03)';this.style.borderColor='rgba(255,255,255,0.08)'">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--grn),transparent)"></div>
      <div style="font-size:2rem;margin-bottom:16px">📖</div>
      <div style="font-family:'Syne',sans-serif;font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--grn);margin-bottom:8px">Chinese Medicine</div>
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.98rem;letter-spacing:-.01em;color:#fff;margin-bottom:10px;line-height:1.3"><!-- UPDATE TITLE --></div>
      <div style="font-size:.78rem;line-height:1.6;color:var(--muted);margin-bottom:20px">Advanced TCM clinical protocols for bodywork practitioners — acupuncture points, five element theory, and treatment strategies.</div>
      <div style="display:inline-flex;align-items:center;gap:8px;font-family:'Syne',sans-serif;font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--grn)">⬇ Download Free</div>
    </a>

    <!-- EBOOK 7 — UPDATE TITLE if wrong -->
    <a href="https://drive.google.com/file/d/1pQ3-f91zNkBB5tcmdJB7ZBBADapcL2D1/view?usp=drivesdk" target="_blank" class="rv d1"
      style="display:block;text-decoration:none;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:32px 28px;position:relative;overflow:hidden;transition:background .25s,border-color .25s"
      onmouseenter="this.style.background='rgba(0,232,154,0.05)';this.style.borderColor='rgba(0,232,154,0.25)'"
      onmouseleave="this.style.background='rgba(255,255,255,0.03)';this.style.borderColor='rgba(255,255,255,0.08)'">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--grn),transparent)"></div>
      <div style="font-size:2rem;margin-bottom:16px">📖</div>
      <div style="font-family:'Syne',sans-serif;font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--grn);margin-bottom:8px">Anatomy Reference</div>
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.98rem;letter-spacing:-.01em;color:#fff;margin-bottom:10px;line-height:1.3">Netter's Atlas of Human Anatomy</div>
      <div style="font-size:.78rem;line-height:1.6;color:var(--muted);margin-bottom:20px">The gold standard anatomical atlas for clinical practitioners — Frank Netter's legendary illustrations of musculoskeletal, nervous, and vascular systems.</div>
      <div style="display:inline-flex;align-items:center;gap:8px;font-family:'Syne',sans-serif;font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--grn)">⬇ Download Free</div>
    </a>

    <!-- EBOOK 8 — UPDATE TITLE if wrong -->
    <a href="https://drive.google.com/file/d/1T7sgcTXZYIb4XPm_WAgalWxhjCWEiksy/view?usp=drivesdk" target="_blank" class="rv d2"
      style="display:block;text-decoration:none;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:32px 28px;position:relative;overflow:hidden;transition:background .25s,border-color .25s"
      onmouseenter="this.style.background='rgba(0,232,154,0.05)';this.style.borderColor='rgba(0,232,154,0.25)'"
      onmouseleave="this.style.background='rgba(255,255,255,0.03)';this.style.borderColor='rgba(255,255,255,0.08)'">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--grn),transparent)"></div>
      <div style="font-size:2rem;margin-bottom:16px">📖</div>
      <div style="font-family:'Syne',sans-serif;font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--grn);margin-bottom:8px">Orthopedic Manual Therapy</div>
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.98rem;letter-spacing:-.01em;color:#fff;margin-bottom:10px;line-height:1.3"><!-- UPDATE TITLE --></div>
      <div style="font-size:.78rem;line-height:1.6;color:var(--muted);margin-bottom:20px">Orthopedic manual therapy techniques — Maitland, Mulligan, and McKenzie approaches with clinical decision-making frameworks.</div>
      <div style="display:inline-flex;align-items:center;gap:8px;font-family:'Syne',sans-serif;font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--grn)">⬇ Download Free</div>
    </a>

    <!-- EBOOK 9 — UPDATE TITLE if wrong -->
    <a href="https://drive.google.com/file/d/1VvL3wVqm7Z4KVeJUhVVFSvkVxALoNVQP/view?usp=drivesdk" target="_blank" class="rv d3"
      style="display:block;text-decoration:none;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:32px 28px;position:relative;overflow:hidden;transition:background .25s,border-color .25s"
      onmouseenter="this.style.background='rgba(0,232,154,0.05)';this.style.borderColor='rgba(0,232,154,0.25)'"
      onmouseleave="this.style.background='rgba(255,255,255,0.03)';this.style.borderColor='rgba(255,255,255,0.08)'">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--grn),transparent)"></div>
      <div style="font-size:2rem;margin-bottom:16px">📖</div>
      <div style="font-family:'Syne',sans-serif;font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--grn);margin-bottom:8px">Manual Therapy Protocols</div>
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.98rem;letter-spacing:-.01em;color:#fff;margin-bottom:10px;line-height:1.3"><!-- UPDATE TITLE --></div>
      <div style="font-size:.78rem;line-height:1.6;color:var(--muted);margin-bottom:20px">Advanced manual therapy protocols integrating Western and Eastern approaches for complex musculoskeletal presentations.</div>
      <div style="display:inline-flex;align-items:center;gap:8px;font-family:'Syne',sans-serif;font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--grn)">⬇ Download Free</div>
    </a>

  </div>
  <div style="text-align:center;margin-top:20px;font-size:.76rem;color:var(--muted)">All resources free to download. No email. No paywall. Just knowledge.</div>
</section>

<!-- ══ TEAM ══ -->
<section id="team" style="border-top:1px solid rgba(255,255,255,0.06);padding:clamp(80px,10vw,140px) var(--r)">
  <div class="sec-tag rv">Join the Founding Team</div>
  <h2 class="sec-h rv d1">WE'RE BUILDING<br><span class="out">SOMETHING</span> RARE</h2>
  <p style="font-size:1rem;line-height:1.8;color:var(--muted);max-width:460px;margin-top:20px" class="rv d2">We're looking for rare people who see the full vision and want to help build it from the ground up.</p>
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.06);margin-top:60px">
    <div class="feat-card rv d1" style="padding:52px 44px">
      <div style="font-size:1.8rem;margin-bottom:20px">🤝</div>
      <div style="font-family:'Syne',sans-serif;font-size:.65rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--grn);margin-bottom:8px">Co-Founder</div>
      <div class="feat-title" style="font-size:1.2rem;margin-bottom:12px">Build This With Me</div>
      <div class="feat-desc" style="margin-bottom:24px">Looking for a co-founder who is obsessed with healthcare technology, understands the manual therapy space, and wants to own a significant piece of something that could change how 1.2 million practitioners work every day.</div>
      <a href="/cdn-cgi/l/email-protection#5e363b3232311e2d31333f2d27303d3f37703d3133612d2b3c343b3d2a631d317318312b303a3b2c7e17302f2b372c27" style="font-family:'Syne',sans-serif;font-size:.8rem;font-weight:700;color:var(--grn);text-decoration:none;display:inline-flex;align-items:center;gap:6px">Get In Touch →</a>
    </div>
    <div class="feat-card rv d2" style="padding:52px 44px">
      <div style="font-size:1.8rem;margin-bottom:20px">💰</div>
      <div style="font-family:'Syne',sans-serif;font-size:.65rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--grn);margin-bottom:8px">Investor</div>
      <div class="feat-title" style="font-size:1.2rem;margin-bottom:12px">Seed Round Open</div>
      <div class="feat-desc" style="margin-bottom:24px">We are raising a $2.5M seed round. Live MVP. Real beta users. A $28B addressable market with no purpose-built real-time solution. If you invest in healthcare AI at the seed stage, let's talk.</div>
      <a href="https://somasyncai.com/investor-pitch" style="font-family:'Syne',sans-serif;font-size:.8rem;font-weight:700;color:var(--grn);text-decoration:none;display:inline-flex;align-items:center;gap:6px">View Pitch Deck →</a>
    </div>
    <div class="feat-card rv d3" style="padding:52px 44px;border-top:1px solid rgba(255,255,255,0.06)">
      <div style="font-size:1.8rem;margin-bottom:20px">⚙️</div>
      <div style="font-family:'Syne',sans-serif;font-size:.65rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--grn);margin-bottom:8px">Engineer / Developer</div>
      <div class="feat-title" style="font-size:1.2rem;margin-bottom:12px">Build the Infrastructure</div>
      <div class="feat-desc" style="margin-bottom:24px">We need engineers excited about real-time AI, voice processing, and healthcare infrastructure. React, Node, Supabase, voice AI. Build something that genuinely matters in people's working lives.</div>
      <a href="/cdn-cgi/l/email-protection#adc5c8c1c1c2eddec2c0ccded4c3ceccc483cec2c092ded8cfc7c8ced990e8c3cac4c3c8c8df8de4c3dcd8c4dfd4" style="font-family:'Syne',sans-serif;font-size:.8rem;font-weight:700;color:var(--grn);text-decoration:none;display:inline-flex;align-items:center;gap:6px">Get In Touch →</a>
    </div>
    <div class="feat-card rv d4" style="padding:52px 44px;border-top:1px solid rgba(255,255,255,0.06)">
      <div style="font-size:1.8rem;margin-bottom:20px">🔬</div>
      <div style="font-family:'Syne',sans-serif;font-size:.65rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--grn);margin-bottom:8px">Data Researcher</div>
      <div class="feat-title" style="font-size:1.2rem;margin-bottom:12px">Shape the Intelligence Layer</div>
      <div class="feat-desc" style="margin-bottom:24px">SomaSphere and Predictive Care are built on population-level clinical data. We need researchers with backgrounds in clinical NLP, musculoskeletal data, or healthcare AI who want to define what that intelligence layer looks like.</div>
      <a href="/cdn-cgi/l/email-protection#e189848d8d8ea1928e8c8092988f828088cf828e8cde9294838b848295dca5809580c1b3849284809382898493c1a88f9094889398" style="font-family:'Syne',sans-serif;font-size:.8rem;font-weight:700;color:var(--grn);text-decoration:none;display:inline-flex;align-items:center;gap:6px">Get In Touch →</a>
    </div>
  </div>
  <div style="margin-top:32px;text-align:center;font-size:.84rem;color:var(--muted)">Don't fit neatly into a box but feel the pull? <a href="/cdn-cgi/l/email-protection#0169646d6d6e41726e6c6072786f6260682f626e6c3e7274636b6462753c46646f6473606d21486f7074687378" style="color:var(--grn);text-decoration:none">Reach out anyway →</a></div>
</section>

<!-- ══ BETA CTA ══ -->
<section id="cta">
  <div class="sec-tag rv" style="justify-content:center">Beta Access — Limited Spots</div>
  <h2 class="cta-h rv d1">JOIN THE<br><span class="out">GOLD</span><br><span class="g">STANDARD</span></h2>
  <p class="cta-sub rv d2">Lifetime free access for every practitioner who completes all three steps below.</p>

  <!-- Lifetime access steps -->
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.08);max-width:860px;margin:0 auto 48px;border-radius:12px;overflow:hidden" class="rv d2">
    <div style="padding:28px 24px;background:rgba(255,255,255,0.03);text-align:center">
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:2rem;color:var(--grn);margin-bottom:8px">01</div>
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.88rem;margin-bottom:8px">Use SomaSyncAI</div>
      <div style="font-size:.78rem;line-height:1.6;color:var(--muted)">Join beta. Use it in your practice. Experience the difference hands-free documentation makes.</div>
    </div>
    <div style="padding:28px 24px;background:rgba(255,255,255,0.03);text-align:center;border-left:1px solid rgba(255,255,255,0.08);border-right:1px solid rgba(255,255,255,0.08)">
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:2rem;color:var(--grn);margin-bottom:8px">02</div>
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.88rem;margin-bottom:8px">Give Feedback</div>
      <div style="font-size:.78rem;line-height:1.6;color:var(--muted)">Share honest feedback on what works, what doesn't, and what you wish it could do.</div>
    </div>
    <div style="padding:28px 24px;background:rgba(255,255,255,0.03);text-align:center">
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:2rem;color:var(--grn);margin-bottom:8px">03</div>
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.88rem;margin-bottom:8px">Refer One Therapist</div>
      <div style="font-size:.78rem;line-height:1.6;color:var(--muted)">Refer one colleague who beta tests, gives feedback, and refers someone too. Everyone who completes all 3 gets lifetime free access — no exceptions, no expiry.</div>
    </div>
  </div>

  <div class="cta-btns rv d3"><a class="cta-b1" href="https://somasyncai.com/auth">Create Free Account →</a><a class="cta-b2" href="https://somasyncai.com/dashboard/chat">Open Dashboard</a></div>
  <div class="cta-note rv d4">No credit card. No commitment. California practitioners prioritised in first cohort.<br>Early adopters grandfathered at beta pricing when paid tiers launch.</div>
</section>
<footer>
  <div class="foot-top">
    <div><div class="foot-brand" style="margin-bottom:16px"><img src="./ss.png" alt="SomaSyncAI" style="height:44px;width:auto;object-fit:contain;filter:drop-shadow(0 0 10px rgba(59,158,255,0.35))"/></div><div class="foot-tag">The gold standard AI operating system for manual therapists. Live in-ear guidance. Zero documentation debt.</div></div>
    <div><div class="foot-col-h">Product</div><ul class="foot-links"><li><a href="#features">Features</a></li><li><a href="#roadmap">Roadmap</a></li><li><a href="#how">How It Works</a></li><li><a href="#cta">Beta Access</a></li></ul></div>
    <div><div class="foot-col-h">Disciplines</div><ul class="foot-links"><li><a href="#">Massage Therapy</a></li><li><a href="#">Physical Therapy</a></li><li><a href="#">Chiropractic</a></li><li><a href="#">Sports Medicine</a></li></ul></div>
    <div><div class="foot-col-h">Company</div><ul class="foot-links"><li><a href="#">Join the Team</a></li><li><a href="https://somasyncai.com/investor-pitch">Pitch Deck</a></li><li><a href="https://somasyncai.com/privacy-policy">Privacy</a></li><li><a href="/cdn-cgi/l/email-protection#dab2bfb6b6b59aa9b5b7bba9a3b4b9bbb3f4b9b5b7">Contact</a></li></ul></div>
  </div>
  <div class="foot-bottom"><div class="foot-copy">© 2026 SomaSyncAI. Built for the gold standard practitioner.</div><div class="foot-aa"><div class="aa-dot"></div>Powered by AALIYAH.IO</div></div>
</footer>
<script>
const cd=document.getElementById('cd'),cr=document.getElementById('cr');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cd.style.left=mx+'px';cd.style.top=my+'px'});
(function loop(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;cr.style.left=rx+'px';cr.style.top=ry+'px';requestAnimationFrame(loop)})();
document.querySelectorAll('a,button,.feat-card,.how-card,.road-card,.inv-stat,.prob-card,.ds-ni,.nav-item').forEach(el=>{el.addEventListener('mouseenter',()=>document.body.classList.add('h'));el.addEventListener('mouseleave',()=>document.body.classList.remove('h'))});
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('stuck',scrollY>60));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
function buildWave(id,cls){
  const el=document.getElementById(id);if(!el)return;
  for(let i=0;i<60;i++){const b=document.createElement('div');b.className=cls;b.style.cssText=\`width:3px;height:4px;flex-shrink:0;animation-delay:\${(i*.06).toFixed(2)}s;animation-duration:\${(.8+Math.random()*.9).toFixed(2)}s\`;el.appendChild(b)}
}
buildWave('wf1','wbar');buildWave('wf2','wbar');
const canvas=document.getElementById('c'),ctx=canvas.getContext('2d');
let W,H,t=0;
function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight}
resize();window.addEventListener('resize',resize);
const blobs=[{x:.72,y:.25,r:340,hue:210},{x:.2,y:.65,r:270,hue:195},{x:.55,y:.75,r:210,hue:225}];
function drawBlob(cx,cy,r,hue){
  ctx.beginPath();
  for(let i=0;i<=16;i++){const a=(i/16)*Math.PI*2,noise=Math.sin(a*3+t*.7)*35+Math.cos(a*2+t*.5)*22,rad=r+noise,x=cx+Math.cos(a)*rad,y=cy+Math.sin(a)*rad;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)}
  ctx.closePath();
  const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r+60);
  g.addColorStop(0,\`hsla(\${hue},80%,50%,.17)\`);g.addColorStop(.6,\`hsla(\${hue},70%,40%,.08)\`);g.addColorStop(1,
`

const JS = `

`
