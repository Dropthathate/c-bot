import { createContext, useContext, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase, supabaseConfigurationMessage } from "../integrations/supabase/client";
import { clearClinicalSession, establishClinicalSession } from "../lib/clinicalSessionBridge";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return undefined;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.access_token) void establishClinicalSession(session.access_token);
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.access_token) void establishClinicalSession(session.access_token);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (!isSupabaseConfigured) return { success: false, error: supabaseConfigurationMessage };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    if (data.session?.access_token) await establishClinicalSession(data.session.access_token);
    return { success: true };
  };

  const logout = async () => {
    if (!isSupabaseConfigured) return;
    await clearClinicalSession();
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
