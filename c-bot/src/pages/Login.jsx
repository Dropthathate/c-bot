import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { sendMagicLink, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const nextPath = new URLSearchParams(location.search).get("next") || "/dashboard";

  useEffect(() => {
    if (user) navigate(nextPath, { replace: true });
  }, [user, navigate, nextPath]);

  if (user) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSent(false);
    setLoading(true);
    const result = await sendMagicLink(email, nextPath);
    setLoading(false);
    if (result.success) setSent(true);
    else setError(result.error ?? "Could not send the sign-in email.");
  };

  return (
    <div className="login-page">
      <div className="login-mesh" />
      <div className="login-card">
        <div className="login-header">
          <img className="login-logo-image" src="/favicon.png" alt="SomaSync AI" />
          <h1 className="login-title">SomaSync AI</h1>
          <p className="login-sub">One-time clinical documentation session</p>
        </div>

        <div className="login-notice">
          <span className="notice-icon">✉</span>
          <span>Enter your email and we’ll send a secure sign-in link. The link verifies the email and creates an account when needed.</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <label className="field-label" htmlFor="login-email">Email address</label>
            <input id="login-email" name="email" className="field-input" type="email" autoComplete="email" placeholder="you@practice.com"
              value={email} onChange={(event) => setEmail(event.target.value)} required autoFocus />
          </div>
          {sent && <div className="login-success">Check your inbox. Open the SomaSync link to verify your email and continue.</div>}
          {error && <div className="login-error">{error}</div>}
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Sending secure link…" : "Email me a sign-in link →"}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/" className="back-link">← Back to homepage</Link>
          <p className="login-disclaimer">
            One-time sessions are designed for temporary, clinician-reviewed drafts. Do not enter patient identifiers unless your practice has approved the applicable privacy safeguards. AI output is not a diagnosis and must be reviewed before use.
          </p>
        </div>
      </div>
    </div>
  );
}
