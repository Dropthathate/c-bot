import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Landing from './Landing.jsx'
import TherapistDashboard from './pages/therapist/TherapistDashboard.tsx'
import TherapistChat from './pages/therapist/TherapistChat.tsx'
import SoapNotes from './pages/therapist/SoapNotes.tsx'
import Onboarding from './pages/Onboarding.tsx'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Therapist dashboard and nested pages */}
        <Route path="/therapist" element={<TherapistDashboard />} />
        <Route path="/therapist/chat" element={<TherapistChat />} />
        <Route path="/therapist/soap" element={<SoapNotes />} />

        {/* Legacy/alternate paths redirect to therapist */}
        <Route path="/dashboard" element={<Navigate to="/therapist" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
)
