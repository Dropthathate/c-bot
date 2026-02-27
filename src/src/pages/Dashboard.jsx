import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const STATS = [
  { label: "Notes Generated",  value: "—",     unit: "sessions",  color: "#30d9c0", icon: "📋" },
  { label: "ICD Codes Mapped", value: "—",     unit: "codes",     color: "#0a84ff", icon: "⚡" },
  { label: "Avg Confidence",   value: "88.5%", unit: "accuracy",  color: "#34c759", icon: "✓"  },
  { label: "Time Saved",       value: "~3×",   unit: "vs manual", color: "#ff9f0a", icon: "⏱"  },
];

const QUICK_ACTIONS = [
  { to: "/dashboard/soap", icon: "📋", label: "New SOAP Note",   desc: "Generate from rough notes"    },
  { to: "/dashboard/icd",  icon: "⚡", label: "ICD-10 Lookup",   desc: "Code a clinical observation"  },
  { to: "/dashboard/analytics", icon: "📊", label: "View Analytics", desc: "Practice performance data" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const name = user?.email?.split("@")[0] ?? "Practitioner";

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Good morning, {name} 👋</h1>
          <p className="page-sub">SomaSync AI · AALIYAH.IO Dashboard · Beta</p>
        </div>
        <div className="beta-warning">
          ⚠️ Beta — All AI outputs require clinician verification
        </div>
      </div>

      {/* Stats row */}
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

      {/* Quick actions */}
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

      {/* Disclaimer card */}
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
