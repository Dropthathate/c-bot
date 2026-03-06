import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { 
  MessageSquare, Video, Shield, ClipboardList, ArrowRight, Crown, 
  FileText, AlertTriangle, CheckCircle2, Activity 
} from "lucide-react";

const TherapistDashboard = () => {
  const { profile, subscriptionTier } = useAuth();
  const hasPro = subscriptionTier === "pro";

  return (
    <DashboardLayout requiredRole="therapist">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Therapist Command Center
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.fullName?.split(" ")[0] || "Doctor"}. Manage your practice with C-Bot compliance protection.
          </p>
        </div>

        {/* Pro Features Banner */}
        {!hasPro && (
          <Card className="mb-8 border-2 border-soma-purple bg-gradient-to-r from-soma-purple-light to-background">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-soma-purple flex items-center justify-center">
                  <Crown className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Unlock Pro Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Get SOAP note generation, legal templates, and unlimited C-Bot audits
                  </p>
                </div>
              </div>
              <Button className="bg-soma-purple hover:bg-soma-purple/90">
                Upgrade to Pro - $49/mo
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* AI Chat */}
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-3">
                <MessageSquare className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle>Clinical AI Chat</CardTitle>
              <CardDescription>
                Get clinical guidance with Oxford terminology and Travell patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/therapist/chat">
                  Open Chat
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* SOAP Notes */}
          <Card className={`hover:shadow-lg transition-shadow border-2 ${!hasPro ? "border-dashed" : "hover:border-primary/50"}`}>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-soma-blue-light flex items-center justify-center mb-3">
                <ClipboardList className="h-6 w-6 text-soma-blue" />
              </div>
              <CardTitle className="flex items-center gap-2">
                SOAP Note Generator
                {!hasPro && <Crown className="h-4 w-4 text-soma-orange" />}
              </CardTitle>
              <CardDescription>
                Dictate raw notes and get insurance-ready SOAP documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasPro ? (
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/therapist/soap">
                    Generate Notes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" className="w-full">
                  Upgrade to Access
                  <Crown className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Legal Forms */}
          <Card className={`hover:shadow-lg transition-shadow border-2 ${!hasPro ? "border-dashed" : "hover:border-primary/50"}`}>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-soma-green-light flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-soma-green" />
              </div>
              <CardTitle className="flex items-center gap-2">
                Legal Form Finder
                {!hasPro && <Crown className="h-4 w-4 text-soma-orange" />}
              </CardTitle>
              <CardDescription>
                Search waivers and consent forms by modality (Deep Tissue, Cupping, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasPro ? (
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/therapist/legal">
                    Find Forms
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" className="w-full">
                  Upgrade to Access
                  <Crown className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Video Library */}
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-soma-teal-light flex items-center justify-center mb-3">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Technique Library</CardTitle>
              <CardDescription>
                276 mobilization techniques with Oxford references
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" className="w-full">
                <Link to="/dashboard/videos">
                  Browse Library
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* C-Bot Status Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* C-Bot Overview */}
          <Card className="bg-gradient-to-br from-soma-blue-light to-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-soma-blue" />
                C-Bot Legal Guardian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                C-Bot is your compliance partner, ensuring all documentation meets legal standards 
                and stays within your scope of practice.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-soma-green" />
                  <span>Insurance-ready SOAP formatting</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-soma-green" />
                  <span>Scope of practice warnings</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-soma-green" />
                  <span>Red flag detection</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scope Warning Example */}
          <Card className="bg-gradient-to-br from-soma-orange-light to-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-soma-orange" />
                Scope of Practice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                C-Bot monitors your documentation for techniques that may fall outside your license type. 
                Examples of flagged activities:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span>LMT documenting spinal adjustments</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span>Diagnosis language without MD credential</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TherapistDashboard;