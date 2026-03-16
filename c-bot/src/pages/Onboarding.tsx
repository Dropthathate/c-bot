import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Onboarding = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const autoOnboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const userId = session.user.id;

      // Check if already onboarded
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("user_id", userId)
        .single();

      if (profile?.onboarding_completed) {
        navigate("/therapist");
        return;
      }

      // Auto-set as therapist, no role selection screen
      try {
        await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: "therapist" });

        await supabase
          .from("profiles")
          .update({ onboarding_completed: true })
          .eq("user_id", userId);
      } catch (e) {
        // Role may already exist, ignore error
      }

      navigate("/therapist");
    };

    autoOnboard();
  }, [navigate]);

  // Just a simple loading screen while redirecting
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <img src="/ss.png" alt="SomaSync AI" style={{ width: '80px', height: '80px' }} />
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #334155',
        borderTopColor: '#3b82f6',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Onboarding;