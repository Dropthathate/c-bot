import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Landing from './Landing.jsx'
import TherapistLayout from './pages/therapist/TherapistLayout.tsx'
import TherapistDashboard from './pages/therapist/TherapistDashboard.tsx'
import TherapistChat from './pages/therapist/TherapistChat.tsx'
import SoapNotes from './pages/therapist/SoapNotes.tsx'
import Analytics from './pages/therapist/Analytics.tsx'
import IcdCoder from './pages/therapist/IcdCoder.tsx'
import SoapGenerator from './pages/therapist/SoapGenerator.tsx'
import Settings from './pages/therapist/Settings.tsx'
import VideoLibrary from './pages/therapist/VideoLibrary.tsx'
import OnboardingGate from './components/OnboardingGate.tsx'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Landing />} />

        {/* Therapist area as a nested layout with onboarding gate */}
        <Route path="/therapist" element={<OnboardingGate><TherapistLayout /></OnboardingGate>}>
          <Route index element={<TherapistDashboard />} />
          <Route path="chat" element={<TherapistChat />} />
          <Route path="soap" element={<SoapNotes />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="icd" element={<IcdCoder />} />
          <Route path="settings" element={<Settings />} />
          <Route path="videos" element={<VideoLibrary />} />
        </Route>

        {/* SOAP Generator as sibling route (no nested outlet in SoapNotes) */}
        <Route path="/therapist/soap-live" element={<SoapGenerator />} />

        {/* Backwards compatibility redirects */}
        <Route path="/dashboard/*" element={<Navigate to="/therapist" replace />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />

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
