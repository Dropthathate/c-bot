import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const STATS = [
  { label: "Notes Generated",  value: "—",     unit: "sessions",  color: "var(--grn)",    icon: "📋" },
  { label: "ICD Codes Mapped", value: "—",     unit: "codes",     color: "var(--blue)",   icon: "⚡" },
  { label: "Avg Confidence",   value: "88.5%", unit: "accuracy",  color: "#34c759",       icon: "✓"  },
  { label: "Time Saved",       value: "~3×",   unit: "vs manual", color: "var(--orange)", icon: "⏱"  },
];

const QUICK_ACTIONS = [
  { to: "/dashboard/soap",      icon: "📋", label: "New SOAP Note",   desc: "Voice-powered clinical documentation"  },
  { to: "/dashboard/icd",       icon: "⚡", label: "ICD-10 Lookup",   desc: "Search and map diagnostic codes"       },
  { to: "/dashboard/analytics", icon: "📊", label: "View Analytics",  desc: "Practice performance and trends"       },
  { to: "/dashboard/settings",  icon: "⚙", label: "Settings",        desc: "Account, legal, and preferences"       },
];

export default function Dashboard() {
  const { user } = useAuth();
  const name = user?.email?.split("@")[0] ?? "Practitioner";

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Good morning, {name} 👋</h1>
          <p className="page-sub">SomaSync AI · AALIYAH.IO Dashboard · Phase 1 Beta</p>
        </div>
        <div className="beta-warning">⚠ Beta — AI outputs require clinician verification</div>
      </div>

      <div className="stats-grid">
        {STATS.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ color: s.color }}>{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-unit">{s.unit}</div>
          </div>
        ))}
      </div>

      <div className="section-title">Quick Actions</div>
      <div className="actions-grid">
        {QUICK_ACTIONS.map((a) => (
          <Link key={a.to} to={a.to} className="action-card">
            <div className="action-icon">{a.icon}</div>
            <div>
              <div className="action-label">{a.label}</div>
              <div className="action-desc">{a.desc}</div>
            </div>
            <div className="action-arrow">→</div>
          </Link>
        ))}
      </div>

      <div className="disclaimer-card">
        <div className="disclaimer-title">🤖 AI Disclaimer</div>
        <p className="disclaimer-text">
          SomaSync AI generates documentation suggestions using artificial intelligence.
          All SOAP notes, ICD-10 codes, and clinical language produced by this platform
          are <strong>AI-generated suggestions only</strong> and must be reviewed, verified,
          and approved by a licensed clinician before use in any clinical, billing, or
          legal context. This tool does not constitute medical advice and does not replace
          professional clinical judgment.
        </p>
      </div>
    </div>
  );
}
