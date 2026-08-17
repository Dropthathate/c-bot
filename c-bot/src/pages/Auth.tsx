import { useEffect, useCallback, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const hasNavigated = useRef(false);

  const checkOnboardingStatus = useCallback(async (userId: string) => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("user_id", userId)
        .single();

      navigate(profile?.onboarding_completed ? "/therapist" : "/onboarding", { replace: true });
    } catch {
      navigate("/onboarding", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    let isSubscribed = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isSubscribed && session?.user) checkOnboardingStatus(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (isSubscribed && session?.user && event === "SIGNED_IN") {
        checkOnboardingStatus(session.user.id);
      }
    });

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [checkOnboardingStatus]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: unknown) {
      const description = error instanceof Error
        ? error.message
        : "Check your invitation email and password, then try again.";
      toast({
        title: "Unable to sign in",
        description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={pageStyle}>
      <section style={cardStyle} aria-labelledby="member-sign-in-title">
        <Link to="/" aria-label="Return to SomaSyncAI home" style={brandStyle}>SomaSyncAI</Link>
        <div style={{ marginTop: 48 }}>
          <p style={eyebrowStyle}>Beta member access</p>
          <h1 id="member-sign-in-title" style={headingStyle}>Welcome back</h1>
          <p style={subheadingStyle}>
            Beta access is invitation-only. If you received an invitation, sign in with the email address on that invitation.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20, marginTop: 32 }}>
          <label htmlFor="email" style={labelStyle}>
            Email
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@practice.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={inputStyle}
              required
            />
          </label>

          <label htmlFor="password" style={labelStyle}>
            Password
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={inputStyle}
              required
            />
          </label>

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>

        <p style={waitlistStyle}>
          Need an invitation? <Link to="/#cta" style={linkStyle}>Join the beta waitlist</Link>.
        </p>
      </section>
    </main>
  );
};

const pageStyle = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  boxSizing: "border-box" as const,
  padding: "32px 20px",
  background: "radial-gradient(circle at top right, rgba(59,158,255,0.22), transparent 38%), #080808",
  color: "#f0ede8",
  fontFamily: "Manrope, Arial, sans-serif",
};

const cardStyle = {
  width: "min(100%, 460px)",
  boxSizing: "border-box" as const,
  padding: "clamp(28px, 6vw, 48px)",
  borderRadius: 22,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(8,8,8,0.82)",
  boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
};

const brandStyle = {
  color: "#f0ede8",
  textDecoration: "none",
  fontFamily: "Syne, Arial, sans-serif",
  fontSize: 17,
  fontWeight: 800,
  letterSpacing: "-0.03em",
};

const eyebrowStyle = {
  color: "#67b4ff",
  margin: 0,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
};

const headingStyle = {
  margin: "13px 0 12px",
  fontFamily: "Syne, Arial, sans-serif",
  fontSize: "clamp(2.2rem, 8vw, 3.5rem)",
  lineHeight: 0.98,
  letterSpacing: "-0.05em",
};

const subheadingStyle = {
  color: "rgba(240,237,232,0.65)",
  lineHeight: 1.65,
  margin: 0,
};

const labelStyle = {
  display: "grid",
  gap: 8,
  color: "rgba(240,237,232,0.78)",
  fontSize: 14,
  fontWeight: 700,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: 10,
  padding: "14px 15px",
  background: "rgba(255,255,255,0.06)",
  color: "#f0ede8",
  font: "inherit",
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  border: "none",
  borderRadius: 10,
  padding: "15px 18px",
  background: "#3b9eff",
  color: "white",
  fontFamily: "Syne, Arial, sans-serif",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
};

const waitlistStyle = {
  margin: "28px 0 0",
  color: "rgba(240,237,232,0.6)",
  fontSize: 14,
  lineHeight: 1.6,
};

const linkStyle = {
  color: "#8bc5ff",
  textUnderlineOffset: 3,
};

export default Auth;
