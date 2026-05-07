import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Landing from './Landing.jsx'
import TherapistDashboard from './pages/therapist/TherapistDashboard.tsx'

function Router() {
  const path = window.location.pathname

  if (path === '/dashboard') {
    return <TherapistDashboard />
  }

  return <Landing />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>
)
