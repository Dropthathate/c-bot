import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/useAuth";

// Lazy-load pages for better performance
const Landing = lazy(() => import("./Landing"));
const Auth = lazy(() => import("./pages/Auth"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const VideoLibrary = lazy(() => import("./pages/VideoLibrary"));
const TherapistDashboard = lazy(() => import("./pages/therapist/TherapistDashboard"));
const TherapistChat = lazy(() => import("./pages/therapist/TherapistChat"));
const SoapNotes = lazy(() => import("./components/VoiceSoap"));
const LegalForms = lazy(() => import("./pages/therapist/LegalForms"));
const Intake = lazy(() => import("./pages/therapist/intake"));
const NotFound = lazy(() => import("./pages/NotFound"));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse text-muted-foreground text-sm">Loading…</div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />

          {/* Protected — Therapist */}
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><TherapistDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/chat" element={<ProtectedRoute><TherapistChat /></ProtectedRoute>} />
          <Route path="/dashboard/soap" element={<ProtectedRoute><SoapNotes /></ProtectedRoute>} />
          <Route path="/dashboard/forms" element={<ProtectedRoute><LegalForms /></ProtectedRoute>} />
          <Route path="/dashboard/intake" element={<ProtectedRoute><Intake /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><VideoLibrary /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}
