import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Manrope',sans-serif;background:#080808;color:#f0ede8;min-height:100vh;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
:root{
  --bg:#080808;--ink:#f0ede8;--muted:rgba(240,237,232,0.45);--dim:rgba(240,237,232,0.18);
  --grn:#00e89a;--grn2:#00c47f;--blue:#3b9eff;--blue2:#1a7ee0;
  --blue-glow:rgba(59,158,255,0.25);--grn-glow:rgba(0,232,154,0.2);
  --red:#ff453a;--orange:#ff9f0a;--border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.12);
  --card:rgba(255,255,255,0.03);--sidebar:160px;
}

/* ── LAYOUT ── */
.app-shell{display:grid;grid-template-columns:var(--sidebar) 1fr;min-height:100vh;}
.sidebar{background:rgba(255,255,255,0.02);border-right:1px solid var(--border);display:flex;flex-direction:column;padding:24px 0;position:sticky;top:0;height:100vh;overflow:hidden;}
.sidebar-logo{padding:0 20px 28px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border);margin-bottom:16px;}
.sidebar-logo-dot{width:8px;height:8px;border-radius:50%;background:var(--grn);box-shadow:0 0 8px var(--grn);flex-shrink:0;}
.sidebar-logo-text{font-family:'Syne',sans-serif;font-weight:800;font-size:0.82rem;letter-spacing:-0.02em;color:var(--ink);}
.sidebar-logo-text span{color:var(--grn);}
.nav-links{display:flex;flex-direction:column;gap:2px;padding:0 10px;flex:1;}
.nav-link{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;font-size:0.78rem;font-weight:500;color:var(--muted);text-decoration:none;transition:all 0.2s;white-space:nowrap;}
.nav-link:hover{background:rgba(255,255,255,0.04);color:var(--ink);}
.nav-link.active{background:rgba(0,232,154,0.08);color:var(--ink);border:1px solid rgba(0,232,154,0.15);}
.nav-link .nav-dot{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,0.15);flex-shrink:0;}
.nav-link.active .nav-dot{background:var(--grn);box-shadow:0 0 6px var(--grn);}
.nav-link .nav-icon{font-size:0.9rem;width:16px;text-align:center;flex-shrink:0;}
.sidebar-bottom{padding:16px 10px 0;border-top:1px solid var(--border);margin-top:auto;}
.sidebar-user{padding:8px 12px;font-size:0.72rem;color:var(--dim);display:flex;align-items:center;gap:8px;cursor:pointer;border-radius:10px;transition:background 0.2s;}
.sidebar-user:hover{background:rgba(255,255,255,0.04);color:var(--muted);}
.main-content{overflow:auto;min-height:100vh;}

/* ── PAGE ── */
.page{padding:clamp(24px,4vw,48px);max-width:1100px;}
.page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:16px;}
.page-title{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(1.4rem,3vw,2rem);letter-spacing:-0.04em;color:var(--ink);margin-bottom:6px;}
.page-sub{font-size:0.82rem;color:var(--muted);}
.beta-warning{font-size:0.7rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;background:rgba(255,159,10,0.08);color:var(--orange);border:1px solid rgba(255,159,10,0.18);border-radius:8px;padding:5px 12px;white-space:nowrap;}
.section-title{font-family:'Syne',sans-serif;font-weight:700;font-size:0.78rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--dim);margin:28px 0 14px;}

/* ── CARDS ── */
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;margin-bottom:16px;}
.card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
.card-title{font-family:'Syne',sans-serif;font-weight:700;font-size:0.9rem;letter-spacing:-0.01em;color:var(--ink);}
.card-tag{font-size:0.62rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;background:rgba(0,232,154,0.08);color:var(--grn);border:1px solid rgba(0,232,154,0.2);border-radius:100px;padding:3px 10px;}

/* ── STATS ── */
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:28px;}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:20px;transition:background 0.2s;}
.stat-card:hover{background:rgba(255,255,255,0.05);}
.stat-icon{font-size:1.2rem;margin-bottom:10px;}
.stat-value{font-family:'Syne',sans-serif;font-weight:800;font-size:1.8rem;letter-spacing:-0.04em;line-height:1;margin-bottom:6px;}
.stat-label{font-size:0.78rem;font-weight:600;color:var(--ink);margin-bottom:2px;}
.stat-unit{font-size:0.68rem;color:var(--dim);}

/* ── ACTIONS ── */
.actions-grid{display:flex;flex-direction:column;gap:8px;margin-bottom:28px;}
.action-card{display:flex;align-items:center;gap:16px;padding:18px 20px;background:var(--card);border:1px solid var(--border);border-radius:14px;text-decoration:none;color:var(--ink);transition:all 0.2s;}
.action-card:hover{background:rgba(255,255,255,0.05);border-color:var(--border2);transform:translateX(3px);}
.action-icon{font-size:1.3rem;flex-shrink:0;}
.action-label{font-family:'Syne',sans-serif;font-weight:700;font-size:0.9rem;letter-spacing:-0.01em;margin-bottom:3px;}
.action-desc{font-size:0.75rem;color:var(--muted);}
.action-arrow{margin-left:auto;color:var(--dim);font-size:1rem;transition:transform 0.2s;}
.action-card:hover .action-arrow{transform:translateX(4px);color:var(--grn);}

/* ── DISCLAIMER ── */
.disclaimer-card{background:rgba(59,158,255,0.04);border:1px solid rgba(59,158,255,0.12);border-radius:14px;padding:20px;}
.disclaimer-title{font-family:'Syne',sans-serif;font-weight:700;font-size:0.82rem;letter-spacing:-0.01em;margin-bottom:10px;color:var(--blue);}
.disclaimer-text{font-size:0.82rem;color:var(--muted);line-height:1.75;}
.disclaimer-text strong{color:var(--ink);}
.ai-disclaimer-bar{background:rgba(255,159,10,0.06);border:1px solid rgba(255,159,10,0.14);border-radius:12px;padding:10px 16px;font-size:0.78rem;color:rgba(255,159,10,0.9);margin-bottom:20px;}

/* ── BUTTONS ── */
.btn-primary{background:var(--blue);color:#fff;border:none;padding:13px 24px;border-radius:12px;font-family:'Syne',sans-serif;font-size:0.85rem;font-weight:700;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 16px var(--blue-glow);}
.btn-primary:hover{background:var(--blue2);transform:translateY(-1px);box-shadow:0 8px 24px var(--blue-glow);}
.btn-primary:disabled{opacity:0.35;transform:none;cursor:not-allowed;}
.btn-ghost{background:rgba(255,255,255,0.05);border:1px solid var(--border2);color:var(--ink);padding:10px 18px;border-radius:10px;font-size:0.82rem;font-weight:600;cursor:pointer;transition:all 0.2s;}
.btn-ghost:hover{background:rgba(255,255,255,0.08);}
.btn-copy{background:rgba(0,232,154,0.08);border:1px solid rgba(0,232,154,0.2);color:var(--grn);padding:6px 14px;border-radius:8px;font-family:'Syne',sans-serif;font-size:0.72rem;font-weight:700;cursor:pointer;transition:all 0.2s;}
.btn-copy:hover{background:rgba(0,232,154,0.15);}
.btn-signout{background:rgba(255,69,58,0.08);border:1px solid rgba(255,69,58,0.2);color:var(--red);padding:12px 20px;border-radius:10px;font-family:'Syne',sans-serif;font-size:0.82rem;font-weight:700;cursor:pointer;transition:all 0.2s;width:100%;}
.btn-signout:hover{background:rgba(255,69,58,0.14);}

/* ── INPUTS ── */
.field{margin-bottom:16px;}
.field-label{display:block;font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--dim);margin-bottom:8px;}
.field-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:12px;padding:13px 16px;font-size:0.9rem;font-family:'Manrope',sans-serif;color:var(--ink);outline:none;transition:all 0.2s;}
.field-input:focus{border-color:rgba(0,232,154,0.3);background:rgba(255,255,255,0.06);box-shadow:0 0 0 3px rgba(0,232,154,0.07);}
.field-input::placeholder{color:var(--dim);}

/* ── STATUS ── */
.status-pill{display:inline-flex;align-items:center;gap:7px;padding:5px 12px;border-radius:100px;font-size:0.72rem;font-weight:700;letter-spacing:0.06em;}
.status-dot{width:6px;height:6px;border-radius:50%;}
.badge-pill{font-size:0.68rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:3px 10px;border-radius:100px;}
.badge-pill.green{background:rgba(0,232,154,0.08);color:var(--grn);border:1px solid rgba(0,232,154,0.2);}

/* ── SETTINGS ── */
.settings-card{margin-bottom:14px;}
.settings-section-title{font-family:'Syne',sans-serif;font-weight:700;font-size:0.82rem;letter-spacing:-0.01em;color:var(--ink);margin-bottom:16px;}
.settings-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border);}
.settings-row.border-none{border-bottom:none;}
.settings-label{font-size:0.82rem;color:var(--muted);}
.settings-value{font-size:0.82rem;color:var(--ink);font-weight:500;}
.settings-body-text{font-size:0.82rem;color:var(--muted);line-height:1.75;}

/* ── ICD ── */
.icd-layout{display:grid;grid-template-columns:1fr 340px;gap:16px;}
@media(max-width:800px){.icd-layout{grid-template-columns:1fr;}}
.icd-search-card{display:flex;flex-direction:column;}
.icd-search-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:12px;padding:13px 16px;font-size:0.88rem;font-family:'Manrope',sans-serif;color:var(--ink);outline:none;margin-bottom:14px;transition:all 0.2s;}
.icd-search-input:focus{border-color:rgba(0,232,154,0.3);box-shadow:0 0 0 3px rgba(0,232,154,0.07);}
.icd-search-input::placeholder{color:var(--dim);}
.icd-results{display:flex;flex-direction:column;gap:6px;}
.icd-result-row{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:rgba(255,255,255,0.02);border:1px solid var(--border);border-radius:12px;cursor:pointer;transition:all 0.15s;}
.icd-result-row:hover{background:rgba(255,255,255,0.05);border-color:var(--border2);}
.icd-row-selected{background:rgba(0,232,154,0.05) !important;border-color:rgba(0,232,154,0.2) !important;}
.icd-result-left{display:flex;align-items:center;gap:12px;flex:1;}
.icd-result-code{font-size:0.72rem;font-weight:700;padding:4px 9px;border-radius:7px;white-space:nowrap;flex-shrink:0;}
.icd-result-desc{font-size:0.82rem;color:var(--ink);font-weight:500;margin-bottom:2px;}
.icd-result-cat{font-size:0.68rem;color:var(--dim);}
.icd-check{font-size:0.9rem;color:var(--grn);font-weight:700;flex-shrink:0;margin-left:8px;}
.icd-empty{font-size:0.82rem;color:var(--dim);padding:16px 0;text-align:center;}
.icd-hint{padding:8px 0;}
.icd-hint-title{font-size:0.7rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--dim);margin-bottom:10px;}
.icd-quick-btn{background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:8px;color:var(--muted);font-size:0.78rem;padding:6px 12px;cursor:pointer;margin:0 6px 6px 0;font-family:'Manrope',sans-serif;transition:all 0.2s;}
.icd-quick-btn:hover{background:rgba(0,232,154,0.06);border-color:rgba(0,232,154,0.2);color:var(--grn);}
.icd-selected-col{}
.icd-selected-empty{text-align:center;padding:28px 16px;color:var(--dim);font-size:0.82rem;}
.icd-selected-list{display:flex;flex-direction:column;gap:8px;}
.icd-selected-row{display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:10px;}
.icd-remove-btn{margin-left:auto;background:none;border:none;color:var(--dim);font-size:1rem;cursor:pointer;padding:2px 6px;transition:color 0.2s;flex-shrink:0;}
.icd-remove-btn:hover{color:var(--red);}

/* ── SOAP ── */
.soap-layout{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
@media(max-width:800px){.soap-layout{grid-template-columns:1fr;}}
.soap-controls-col{display:flex;flex-direction:column;gap:16px;}
.soap-output-col{display:flex;flex-direction:column;gap:16px;}
.controls-body{display:flex;flex-direction:column;gap:14px;}
.voice-tip{font-size:0.78rem;color:var(--muted);background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:10px;padding:10px 14px;line-height:1.6;}
.voice-tip strong{color:var(--grn);}
.controls-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.ctrl-btn{display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px 10px;border-radius:12px;border:1px solid var(--border);background:rgba(255,255,255,0.03);font-family:'Syne',sans-serif;font-size:0.72rem;font-weight:700;letter-spacing:0.04em;color:var(--muted);cursor:pointer;transition:all 0.2s;}
.ctrl-btn:hover:not(:disabled){background:rgba(255,255,255,0.06);color:var(--ink);}
.ctrl-btn:disabled{opacity:0.25;cursor:not-allowed;}
.ctrl-icon{font-size:1.2rem;}
.ctrl-start:not(:disabled){border-color:rgba(0,232,154,0.2);color:var(--grn);}
.ctrl-start:not(:disabled):hover{background:rgba(0,232,154,0.06);}
.ctrl-generate:not(:disabled){border-color:rgba(59,158,255,0.2);color:var(--blue);}
.ctrl-generate:not(:disabled):hover{background:rgba(59,158,255,0.06);}
.transcript-body{min-height:120px;}
.transcript-empty{font-size:0.82rem;color:var(--dim);padding:20px 0;display:flex;align-items:center;gap:10px;}
.recording-pulse{width:8px;height:8px;border-radius:50%;background:var(--grn);box-shadow:0 0 8px var(--grn);animation:pulse 1.2s ease-in-out infinite;flex-shrink:0;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.8)}}
.transcript-list{display:flex;flex-direction:column;gap:6px;}
.transcript-line{display:flex;gap:10px;padding:8px 12px;background:rgba(255,255,255,0.03);border-radius:8px;font-size:0.82rem;line-height:1.6;}
.t-num{color:var(--grn);font-weight:700;font-size:0.72rem;flex-shrink:0;margin-top:2px;}
.t-text{color:var(--muted);}
.soap-generating{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;background:var(--card);border:1px solid var(--border);border-radius:16px;gap:14px;}
.gen-spinner{width:36px;height:36px;border:3px solid rgba(0,232,154,0.15);border-top-color:var(--grn);border-radius:50%;animation:spin 0.8s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
.gen-text{font-family:'Syne',sans-serif;font-weight:700;font-size:0.9rem;color:var(--ink);}
.gen-sub{font-size:0.78rem;color:var(--muted);}
.soap-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;background:var(--card);border:1px solid var(--border);border-radius:16px;text-align:center;gap:10px;}
.empty-icon{font-size:2rem;}
.empty-title{font-family:'Syne',sans-serif;font-weight:700;font-size:1rem;color:var(--ink);}
.empty-sub{font-size:0.78rem;color:var(--muted);}
.soap-result{display:flex;flex-direction:column;gap:0;}
.draft-badge{font-size:0.72rem;font-weight:700;color:var(--orange);background:rgba(255,159,10,0.07);border:1px solid rgba(255,159,10,0.15);border-radius:8px;padding:8px 12px;margin-bottom:16px;}
.soap-section{padding:14px 0;border-bottom:1px solid var(--border);}
.soap-section:last-child{border-bottom:none;}
.soap-section-label{font-family:'Syne',sans-serif;font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;display:block;margin-bottom:8px;}
.soap-s{color:var(--blue);}
.soap-o{color:var(--grn);}
.soap-a{color:rgba(191,90,242,0.9);}
.soap-p{color:var(--orange);}
.soap-icd{color:var(--grn);}
.soap-cpt{color:var(--blue);}
.soap-mn{color:var(--muted);}
.soap-section-text{font-size:0.85rem;color:rgba(255,255,255,0.75);line-height:1.75;}
.code-list{display:flex;flex-direction:column;gap:6px;}
.code-row{display:flex;align-items:center;gap:10px;}
.code-badge{font-size:0.7rem;font-weight:700;padding:3px 9px;border-radius:7px;white-space:nowrap;}
.code-teal{background:rgba(0,232,154,0.08);color:var(--grn);}
.code-blue{background:rgba(59,158,255,0.08);color:var(--blue);}
.code-desc{font-size:0.8rem;color:var(--muted);}
.code-units{color:var(--dim);}
.error-card{background:rgba(255,69,58,0.07);border:1px solid rgba(255,69,58,0.18);border-radius:12px;padding:14px 18px;font-size:0.82rem;color:var(--red);}

/* ── ANALYTICS ── */
.charts-3col{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
@media(max-width:900px){.charts-3col{grid-template-columns:1fr;}}
.chart-card{display:flex;flex-direction:column;}
.chart-card-header{margin-bottom:14px;}
.chart-card-title{font-family:'Syne',sans-serif;font-weight:700;font-size:0.88rem;letter-spacing:-0.01em;color:var(--ink);margin-bottom:4px;}
.chart-card-sub{font-size:0.72rem;color:var(--dim);}
.chart-wrap{height:160px;position:relative;}

/* ── LOGIN ── */
.login-page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:var(--bg);position:relative;overflow:hidden;}
.login-page::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 0%,rgba(0,232,154,0.06),transparent 60%),radial-gradient(ellipse 50% 70% at 100% 100%,rgba(59,158,255,0.04),transparent 60%);pointer-events:none;}
.login-mesh{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px);background-size:32px 32px;pointer-events:none;}
.login-card{background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:20px;padding:40px;width:100%;max-width:440px;position:relative;z-index:1;}
.login-header{text-align:center;margin-bottom:28px;}
.login-logo-badge{font-size:2rem;margin-bottom:12px;display:block;}
.login-title{font-family:'Syne',sans-serif;font-weight:800;font-size:1.5rem;letter-spacing:-0.04em;color:var(--ink);margin-bottom:6px;}
.login-sub{font-size:0.82rem;color:var(--muted);}
.login-notice{display:flex;align-items:flex-start;gap:10px;background:rgba(59,158,255,0.05);border:1px solid rgba(59,158,255,0.12);border-radius:10px;padding:12px 14px;font-size:0.8rem;color:var(--muted);margin-bottom:24px;line-height:1.6;}
.notice-icon{flex-shrink:0;}
.notice-link{color:var(--blue);text-decoration:none;font-weight:600;}
.notice-link:hover{text-decoration:underline;}
.login-form{display:flex;flex-direction:column;gap:0;}
.login-error{font-size:0.8rem;color:var(--red);background:rgba(255,69,58,0.07);border:1px solid rgba(255,69,58,0.15);border-radius:8px;padding:10px 14px;margin-bottom:14px;}
.login-btn{width:100%;background:var(--blue);color:#fff;border:none;padding:14px;border-radius:12px;font-family:'Syne',sans-serif;font-size:0.9rem;font-weight:700;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 16px var(--blue-glow);margin-top:8px;}
.login-btn:hover:not(:disabled){background:var(--blue2);transform:translateY(-1px);box-shadow:0 8px 24px var(--blue-glow);}
.login-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
.login-footer{margin-top:24px;text-align:center;display:flex;flex-direction:column;gap:12px;}
.back-link{font-size:0.8rem;color:var(--dim);text-decoration:none;transition:color 0.2s;}
.back-link:hover{color:var(--muted);}
.login-disclaimer{font-size:0.72rem;color:var(--dim);line-height:1.6;}

/* ── RESPONSIVE ── */
@media(max-width:700px){
  .app-shell{grid-template-columns:1fr;grid-template-rows:auto 1fr;}
  .sidebar{flex-direction:row;height:auto;padding:12px 16px;position:fixed;bottom:0;left:0;right:0;top:auto;border-right:none;border-top:1px solid var(--border);z-index:100;overflow-x:auto;}
  .sidebar-logo{display:none;}
  .nav-links{flex-direction:row;padding:0;gap:4px;}
  .nav-link{flex-direction:column;padding:6px 10px;font-size:0.6rem;gap:4px;}
  .nav-link .nav-icon{font-size:1.1rem;}
  .sidebar-bottom{display:none;}
  .main-content{padding-bottom:80px;}
}
`;

const NAV = [
  { to: "/dashboard",           icon: "◈", label: "Overview"     },
  { to: "/dashboard/soap",      icon: "📋", label: "SOAP Notes"  },
  { to: "/dashboard/icd",       icon: "⚡", label: "ICD-10"      },
  { to: "/dashboard/analytics", icon: "📊", label: "Analytics"   },
  { to: "/dashboard/settings",  icon: "⚙", label: "Settings"    },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const name = user?.email?.split("@")[0] ?? "You";

  return (
    <>
      <style>{CSS}</style>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-dot" />
            <div className="sidebar-logo-text">Soma<span>Sync</span></div>
          </div>
          <nav className="nav-links">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`nav-link ${location.pathname === n.to ? "active" : ""}`}
              >
                <div className="nav-dot" />
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div
              className="sidebar-user"
              onClick={async () => { await logout(); navigate("/"); }}
              title="Sign out"
            >
              ↩ {name}
            </div>
          </div>
        </aside>
        <main className="main-content">{children}</main>
      </div>
    </>
  );
}
