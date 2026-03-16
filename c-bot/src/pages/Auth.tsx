import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
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

      if (profile?.onboarding_completed) {
        navigate("/therapist", { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }
    } catch (error) {
      navigate("/onboarding", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    let isSubscribed = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isSubscribed && session?.user) {
        checkOnboardingStatus(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (isSubscribed && session?.user && event === 'SIGNED_IN') {
        checkOnboardingStatus(session.user.id);
      }
    });

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [checkOnboardingStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Redirecting you now...",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <img src="/ss.png" alt="SomaSync AI" className="w-16 h-16 mx-auto" />
          <h1 className="text-3xl font-bold">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? "Sign in to SomaSync AI" : "Start your SomaSync AI journey"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="fullName" type="text" placeholder="Your full name"
                  value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="pl-10" required={!isLogin} />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="your@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="pl-10" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="pl-10" required />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Please wait..." : (
              <>{isLogin ? "Sign In" : "Create Account"}<ArrowRight className="ml-2 h-5 w-5" /></>
            )}
          </Button>
        </form>

        <div className="text-center">
          <button type="button" onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;