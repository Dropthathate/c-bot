import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Landing from './Landing.jsx'
import TherapistLayout from './pages/therapist/TherapistLayout.tsx'
import TherapistDashboard from './pages/therapist/TherapistDashboard.tsx'
import TherapistChat from './pages/therapist/TherapistChat.tsx'
import SoapNotes from './pages/therapist/SoapNotes.tsx'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Landing />} />

        {/* Therapist area as a nested layout */}
        <Route path="/therapist" element={<TherapistLayout />}>
          <Route index element={<TherapistDashboard />} />
          <Route path="chat" element={<TherapistChat />} />
          <Route path="soap" element={<SoapNotes />} />
        </Route>

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
