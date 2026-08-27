import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "patient" | "therapist";
export type SubscriptionTier = "free" | "active_recovery" | "pro";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: AppRole | null;
  subscriptionTier: SubscriptionTier;
  profile: {
    fullName: string | null;
    avatarUrl: string | null;
    onboardingCompleted: boolean;
  } | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    role: null,
    subscriptionTier: "free",
    profile: null,
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
        }));

        // Defer fetching profile and role data
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setAuthState(prev => ({
            ...prev,
            loading: false,
            role: null,
            profile: null,
            subscriptionTier: "free",
          }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
      }));

      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile and role in parallel
      const [profileResult, roleResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, avatar_url, subscription_tier, onboarding_completed")
          .eq("user_id", userId)
          .single(),
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .single(),
      ]);

      setAuthState(prev => ({
        ...prev,
        loading: false,
        role: (roleResult.data?.role as AppRole) ?? null,
        subscriptionTier: (profileResult.data?.subscription_tier as SubscriptionTier) ?? "free",
        profile: profileResult.data ? {
          fullName: profileResult.data.full_name,
          avatarUrl: profileResult.data.avatar_url,
          onboardingCompleted: profileResult.data.onboarding_completed,
        } : null,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    ...authState,
    signOut,
    isPatient: authState.role === "patient",
    isTherapist: authState.role === "therapist",
    hasActiveRecovery: authState.subscriptionTier === "active_recovery" || authState.subscriptionTier === "pro",
    hasPro: authState.subscriptionTier === "pro",
  };
}