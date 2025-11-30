import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { MessageSquare, Video, Activity, Heart, ArrowRight, Crown, BookOpen, Shield } from "lucide-react";

const PatientDashboard = () => {
  const { profile, subscriptionTier } = useAuth();

  return (
    <DashboardLayout requiredRole="patient">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {profile?.fullName?.split(" ")[0] || "there"}! 💙
          </h1>
          <p className="text-muted-foreground">
            Your journey to holistic wellness continues. What would you like to explore today?
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Chat Card */}
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-3">
                <MessageSquare className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle>AI Symptom Guide</CardTitle>
              <CardDescription>
                Describe your symptoms and get evidence-based guidance powered by Travell's Trigger Points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/patient/chat">
                  Start Conversation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Video Library Card */}
          <Card className={`hover:shadow-lg transition-shadow border-2 ${subscriptionTier === "free" ? "border-dashed" : "hover:border-primary/50"}`}>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-soma-teal-light flex items-center justify-center mb-3">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="flex items-center gap-2">
                Video Library
                {subscriptionTier === "free" && (
                  <Crown className="h-4 w-4 text-soma-orange" />
                )}
              </CardTitle>
              <CardDescription>
                Access 276 mobilization techniques with step-by-step video guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscriptionTier === "free" ? (
                <Button variant="outline" className="w-full">
                  Upgrade to Access
                  <Crown className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/patient/videos">
                    Browse Techniques
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Self-Care Tips Card */}
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-soma-green-light flex items-center justify-center mb-3">
                <Heart className="h-6 w-6 text-soma-green" />
              </div>
              <CardTitle>Self-Care Toolkit</CardTitle>
              <CardDescription>
                Daily exercises, stretches, and wellness tips personalized for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Educational Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* About SomaSync */}
          <Card className="bg-gradient-to-br from-soma-teal-light to-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                About SomaSync AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                SomaSync AI combines the wisdom of <strong>Janet Travell's Trigger Point Manual</strong> with 
                the clinical precision of the <strong>Oxford Handbook of Orthopaedics</strong> to provide 
                you with evidence-based guidance for musculoskeletal wellness.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-soma-blue" />
                <span className="text-muted-foreground">Protected by C-Bot Safety Engine</span>
              </div>
            </CardContent>
          </Card>

          {/* Safety Notice */}
          <Card className="bg-gradient-to-br from-soma-orange-light to-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-soma-orange" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                SomaSync AI provides educational wellness guidance only. It is <strong>not a substitute</strong> for 
                professional medical advice, diagnosis, or treatment.
              </p>
              <p className="text-sm text-muted-foreground">
                Always consult a qualified healthcare provider for medical concerns. If you experience 
                severe pain or emergency symptoms, seek immediate medical attention.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;