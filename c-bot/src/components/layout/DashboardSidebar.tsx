import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Activity, MessageSquare, Video, Shield, Settings,
  LogOut, Crown, Home, ClipboardList,
} from "lucide-react";

const DashboardSidebar = () => {
  const location = useLocation();
  const { signOut, profile } = useAuth();

  const links = [
    { href: "/dashboard", icon: Home, label: "Command Center" },
    { href: "/dashboard/chat", icon: MessageSquare, label: "AI Chat" },
    { href: "/dashboard/soap", icon: ClipboardList, label: "SOAP Notes" },
    { href: "/dashboard/forms", icon: Shield, label: "Legal Forms" },
    { href: "/library", icon: Video, label: "Video Library" },
  ];

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold text-foreground">SomaSync AI</span>
            <p className="text-xs text-muted-foreground">Therapist Dashboard</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

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
            <p className="text-xs text-muted-foreground">Therapist</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={signOut} className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
