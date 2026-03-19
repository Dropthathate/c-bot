
"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    
  }, []);

  return (
    <>
      <style>{`
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
`}</style>
      <div id="cd"></div><div id="cr"></div>
      
    </>
  );
}
