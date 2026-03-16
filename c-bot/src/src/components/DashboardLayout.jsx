import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const NAV_ITEMS = [
  { to: "/dashboard",           icon: "▦",  label: "Overview"      },
  { to: "/dashboard/soap",      icon: "📋", label: "SOAP Notes"    },
  { to: "/dashboard/icd",       icon: "⚡", label: "ICD-10 Coder" },
  { to: "/dashboard/analytics", icon: "📊", label: "Analytics"     },
  { to: "/dashboard/settings",  icon: "⚙️", label: "Settings"      },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const initials = user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="dash-shell">
      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside className={`dash-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-top">
          {/* Logo */}
          <div className="sidebar-logo">
            <div className="logo-badge">🩺</div>
            {!collapsed && (
              <div>
                <div className="logo-name">SomaSync</div>
                <div className="logo-sub">AALIYAH.IO</div>
              </div>
            )}
          </div>

          {!collapsed && <div className="beta-pill">BETA</div>}

          {/* Nav links */}
          <nav className="sidebar-nav">
            {NAV_ITEMS.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/dashboard"}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "nav-item-active" : ""}`
                }
              >
                <span className="nav-icon">{icon}</span>
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom user block */}
        <div className="sidebar-bottom">
          {!collapsed && (
            <>
              <div className="user-card">
                <div className="user-avatar">{initials}</div>
                <div className="user-info">
                  <div className="user-name">{user?.email?.split("@")[0]}</div>
                  <div className="user-email">{user?.email}</div>
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Sign Out
              </button>
              <div className="sidebar-disclaimer">
                ⚠️ Beta — AI outputs require clinician review before clinical use.
              </div>
            </>
          )}
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ───────────────────────── */}
      <main className="dash-main">
        <Outlet />
      </main>
    </div>
  );
}
