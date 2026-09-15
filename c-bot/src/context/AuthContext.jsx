import { createContext, useContext, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase, supabaseConfigurationMessage } from "../integrations/supabase/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return undefined;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const sendMagicLink = async (email, nextPath = "/dashboard") => {
    if (!isSupabaseConfigured) return { success: false, error: supabaseConfigurationMessage };
    const safeNextPath = nextPath.startsWith("/clinical-workspace") ? "/clinical-workspace" : nextPath;
    const redirectTo = `${window.location.origin}${safeNextPath}`;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const login = async (email, password) => {
    if (!isSupabaseConfigured) return { success: false, error: supabaseConfigurationMessage };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const logout = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, sendMagicLink, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
