import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "./DashboardSidebar";
import { Loader2 } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  requiredRole?: "patient" | "therapist";
  requiredTier?: "active_recovery" | "pro";
}

const DashboardLayout = ({ children, requiredRole, requiredTier }: DashboardLayoutProps) => {
  const { user, loading, role, subscriptionTier, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
        return;
      }

      if (!profile?.onboardingCompleted) {
        navigate("/onboarding");
        return;
      }

      if (requiredRole && role !== requiredRole) {
        navigate(role === "therapist" ? "/therapist" : "/patient");
        return;
      }

      // Check tier requirements
      if (requiredTier) {
        const hasAccess = 
          requiredTier === "active_recovery" 
            ? subscriptionTier === "active_recovery" || subscriptionTier === "pro"
            : subscriptionTier === "pro";
        
        if (!hasAccess) {
          navigate(role === "therapist" ? "/therapist" : "/patient");
        }
      }
    }
  }, [loading, user, role, profile, requiredRole, requiredTier, subscriptionTier, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;