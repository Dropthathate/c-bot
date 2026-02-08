import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Activity, Mail, Lock, User, ArrowRight } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkOnboardingStatus = useCallback(async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("user_id", userId)
        .single();

      if (profile?.onboarding_completed) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .single();

        if (roles?.role === "therapist") {
          navigate("/therapist", { replace: true });
        } else {
          navigate("/patient", { replace: true });
        }
      } else {
        navigate("/onboarding", { replace: true });
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    }
  }, [navigate]);

  useEffect(() => {
    let isSubscribed = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (isSubscribed && session?.user && event === 'SIGNED_IN') {
        checkOnboardingStatus(session.user.id);
      }
    });

    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isSubscribed && session?.user) {
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
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Navigation will be handled by onAuthStateChange
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
          description: "Please complete the onboarding to continue.",
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

  // ... rest of your JSX remains the same
