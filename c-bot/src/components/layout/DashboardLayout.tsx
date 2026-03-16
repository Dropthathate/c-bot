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

      // If you're stuck in a loop, comment out these next 4 lines
      if (!profile?.onboardingCompleted) {
        navigate("/onboarding");
        return;
      }

      if (requiredRole && role !== requiredRole) {
        navigate(role === "therapist" ? "/therapist" : "/patient");
        return;
      }

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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-xl font-black tracking-tighter mb-4">ΛΛLIYΛH<span className="text-blue-600">.IO</span></div>
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar stays on the left */}
      <DashboardSidebar />
      
      <main className="flex-1 overflow-auto bg-slate-50/50">
        {/* Your Intake Grid or Chat will show up here */}
        <div className="p-8">
           {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;