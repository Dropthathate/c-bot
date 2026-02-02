import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// THE FIX: pointing to the 'layouts' folder with an 's'
import DashboardLayout from "./layouts/DashboardLayout"; 
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import TherapistDashboard from "./pages/therapist/TherapistDashboard";
import Intake from "./pages/therapist/Intake";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Therapist Routes */}
          <Route path="/therapist" element={<DashboardLayout requiredRole="therapist"><TherapistDashboard /></DashboardLayout>} />
          <Route path="/therapist/intake" element={<DashboardLayout requiredRole="therapist"><Intake /></DashboardLayout>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App; // Ensure this path is correct
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import TherapistDashboard from "./pages/therapist/TherapistDashboard";
import Intake from "./pages/therapist/Intake";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Therapist Routes wrapped in Layout */}
          <Route path="/therapist" element={<DashboardLayout requiredRole="therapist"><TherapistDashboard /></DashboardLayout>} />
          <Route path="/therapist/intake" element={<DashboardLayout requiredRole="therapist"><Intake /></DashboardLayout>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;