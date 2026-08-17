import { useEffect, useCallback, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Lock, Mail } from "lucide-react";

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
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <section className="w-full max-w-md space-y-8" aria-labelledby="member-sign-in-title">
        <div className="text-center space-y-4">
          <Link to="/" aria-label="Return to SomaSyncAI home">
            <img src="/ss.png" alt="SomaSyncAI" className="w-16 h-16 mx-auto" />
          </Link>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.16em] text-primary font-semibold">Beta member access</p>
            <h1 id="member-sign-in-title" className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">
              Beta access is invitation-only. If you received an invitation, sign in with the email address on that invitation.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@practice.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Signing in…" : <>Sign in <ArrowRight className="ml-2 h-5 w-5" /></>}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Need an invitation? <Link to="/#cta" className="underline underline-offset-4 hover:text-foreground">Join the beta waitlist</Link>.
        </p>
      </section>
    </main>
  );
};

export default Auth;
