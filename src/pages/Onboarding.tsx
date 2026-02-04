import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Activity, Heart, Stethoscope, ArrowRight, Shield, BookOpen, FileText } from "lucide-react";

type UserRole = "patient" | "therapist";

const Onboarding = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);

      // Check if already onboarded
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("user_id", session.user.id)
        .single();

      if (profile?.onboarding_completed) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();

        if (roles?.role === "therapist") {
          navigate("/therapist");
        } else {
          navigate("/patient");
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const handleContinue = async () => {
    if (!selectedRole || !userId) return;
    setLoading(true);

    try {
      // ✅ SECURITY FIX: user_id is already included correctly here
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: selectedRole });

      if (roleError) throw roleError;

      // ✅ SECURITY FIX: Using eq() filter is secure with RLS
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("user_id", userId);

      if (profileError) throw profileError;

      toast({
        title: "Welcome to SomaSync AI!",
        description: `You're all set as a ${selectedRole === "therapist" ? "Therapist" : "Patient"}.`,
      });

      // Navigate to appropriate dashboard
      if (selectedRole === "therapist") {
        navigate("/therapist");
      } else {
        navigate("/patient");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete onboarding",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center shadow-glow">
              <Activity className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Who are you relieving pain for today?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your path to personalized care. Your selection helps us tailor
            the SomaSync experience to your specific needs.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Patient Card */}
          <button
            onClick={() => setSelectedRole("patient")}
            className={`p-8 rounded-2xl border-2 text-left transition-all duration-300 hover:shadow-lg ${
              selectedRole === "patient"
                ? "border-primary bg-accent shadow-glow"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                selectedRole === "patient" ? "bg-primary" : "bg-soma-teal-light"
              }`}>
                <Heart className={`h-8 w-8 ${
                  selectedRole === "patient" ? "text-primary-foreground" : "text-primary"
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  I'm Relieving My Own Pain
                </h3>
                <p className="text-muted-foreground mb-4">
                  Seeking relief, self-care guidance, and holistic wellness support
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>AI-powered symptom guidance</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Access to mobilization video library</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Activity className="h-4 w-4 text-primary" />
                <span>Trigger point maps & self-care tips</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <span className="text-sm font-medium text-primary">
                Free tier available • Upgrade for full library
              </span>
            </div>
          </button>

          {/* Therapist Card */}
          <button
            onClick={() => setSelectedRole("therapist")}
            className={`p-8 rounded-2xl border-2 text-left transition-all duration-300 hover:shadow-lg ${
              selectedRole === "therapist"
                ? "border-primary bg-accent shadow-glow"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                selectedRole === "therapist" ? "bg-primary" : "bg-soma-blue-light"
              }`}>
                <Stethoscope className={`h-8 w-8 ${
                  selectedRole === "therapist" ? "text-primary-foreground" : "text-soma-blue"
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  I'm Helping Others Relieve Pain
                </h3>
                <p className="text-muted-foreground mb-4">
                  Practice management, legal compliance, and clinical documentation
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <FileText className="h-4 w-4 text-soma-blue" />
                <span>SOAP note generator (insurance-ready)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-soma-blue" />
                <span>Legal template library & waivers</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Activity className="h-4 w-4 text-soma-blue" />
                <span>C-Bot compliance checker</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <span className="text-sm font-medium text-soma-blue">
                Pro features • $49/month for full access
              </span>
            </div>
          </button>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            disabled={!selectedRole || loading}
            onClick={handleContinue}
            className="px-12"
          >
            {loading ? "Setting up your account..." : (
              <>
                Continue to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground">
          You can change your role anytime in settings. Both roles have access to
          the core SomaSync AI chat.
        </p>
      </div>
    </div>
  );
};

export default Onboarding;