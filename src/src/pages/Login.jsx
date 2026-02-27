import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already logged in → redirect
  if (user) { navigate("/dashboard"); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error ?? "Login failed.");
    }
  };

  return (
    <div className="login-page">
      {/* Mesh background */}
      <div className="login-mesh" />

      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo-badge">🩺</div>
          <h1 className="login-title">SomaSync AI</h1>
          <p className="login-sub">AALIYAH.IO Dashboard</p>
        </div>

        {/* Beta notice */}
        <div className="login-notice">
          <span className="notice-icon">🔒</span>
          <span>
            Access is restricted to approved beta testers.{" "}
            <Link to="/#access" className="notice-link">Request access →</Link>
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <label className="field-label">Email</label>
            <input
              className="field-input"
              type="email"
              placeholder="you@practice.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="field">
            <label className="field-label">Password</label>
            <input
              className="field-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <Link to="/" className="back-link">← Back to homepage</Link>
          <p className="login-disclaimer">
            ⚠️ AI outputs are for demonstration only and require clinician review before clinical use.
          </p>
        </div>
      </div>
    </div>
  );
}
