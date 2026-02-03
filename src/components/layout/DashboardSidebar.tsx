import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Activity,
  MessageSquare,
  Video,
  Shield,
  Settings,
  LogOut,
  Crown,
  Home,
  ClipboardList,
} from "lucide-react";

const DashboardSidebar = () => {
  const location = useLocation();
  const { isTherapist, subscriptionTier, signOut, profile } = useAuth();

  const patientLinks = [
    { href: "/patient", icon: Home, label: "Dashboard" },
    { href: "/patient/chat", icon: MessageSquare, label: "AI Chat" },
    { href: "/patient/videos", icon: Video, label: "Video Library", tier: "active_recovery" },
  ];

  const therapistLinks = [
    { href: "/therapist", icon: Home, label: "Command Center" },
    { href: "/therapist/chat", icon: MessageSquare, label: "AI Chat" },
    { href: "/therapist/soap", icon: ClipboardList, label: "SOAP Notes", tier: "pro" },
    { href: "/therapist/legal", icon: Shield, label: "Legal Forms", tier: "pro" },
    { href: "/therapist/videos", icon: Video, label: "Video Library" },
  ];

  const links = isTherapist ? therapistLinks : patientLinks;
  const basePath = isTherapist ? "/therapist" : "/patient";

  const isLocked = (tier?: string) => {
    if (!tier) return false;
    if (tier === "active_recovery") return subscriptionTier === "free";
    if (tier === "pro") return subscriptionTier !== "pro";
    return false;
  };

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to={basePath} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold text-foreground">SomaSync AI</span>
            <p className="text-xs text-muted-foreground">
              {isTherapist ? "Therapist Mode" : "Patient Mode"}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const locked = isLocked(link.tier);
          const isActive = location.pathname === link.href;

          return (
            <Link
              key={link.href}
              to={locked ? "#" : link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : locked
                  ? "text-muted-foreground cursor-not-allowed opacity-60"
                  : "text-foreground hover:bg-accent"
              )}
              onClick={(e) => locked && e.preventDefault()}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{link.label}</span>
              {locked && (
                <Crown className="h-4 w-4 ml-auto text-soma-orange" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Subscription Badge */}
      <div className="p-4 border-t border-border">
        <div className={cn(
          "p-4 rounded-xl",
          subscriptionTier === "pro" ? "bg-soma-purple-light" :
          subscriptionTier === "active_recovery" ? "bg-soma-teal-light" :
          "bg-muted"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <Crown className={cn(
              "h-4 w-4",
              subscriptionTier === "pro" ? "text-soma-purple" :
              subscriptionTier === "active_recovery" ? "text-primary" :
              "text-muted-foreground"
            )} />
            <span className="text-sm font-semibold text-foreground">
              {subscriptionTier === "pro" ? "Pro Plan" :
               subscriptionTier === "active_recovery" ? "Active Recovery" :
               "Free Plan"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {subscriptionTier === "free" && "Upgrade to unlock all features"}
            {subscriptionTier === "active_recovery" && "Full video library access"}
            {subscriptionTier === "pro" && "All features unlocked"}
          </p>
          {subscriptionTier !== "pro" && (
            <Button size="sm" className="w-full" variant="outline">
              Upgrade Plan
            </Button>
          )}
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-sm font-semibold text-secondary-foreground">
              {profile?.fullName?.charAt(0) || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {profile?.fullName || "User"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isTherapist ? "Therapist" : "Patient"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="flex-1" asChild>
            <Link to={`${basePath}/settings`}>
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
