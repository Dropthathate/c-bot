import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientChat from "./pages/patient/PatientChat";
import TherapistDashboard from "./pages/therapist/TherapistDashboard";
import TherapistChat from "./pages/therapist/TherapistChat";
import SoapNotes from "./pages/therapist/SoapNotes";
import LegalForms from "./pages/therapist/LegalForms";
import VideoLibrary from "./pages/VideoLibrary";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Patient Routes */}
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/patient/chat" element={<PatientChat />} />
          <Route path="/patient/videos" element={<VideoLibrary />} />

          {/* Therapist Routes */}
          <Route path="/therapist" element={<TherapistDashboard />} />
          <Route path="/therapist/chat" element={<TherapistChat />} />
          <Route path="/therapist/soap" element={<SoapNotes />} />
          <Route path="/therapist/legal" element={<LegalForms />} />
          <Route path="/therapist/videos" element={<VideoLibrary />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;