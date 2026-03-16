import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Dashboard from './Dashboard.jsx'

function Router() {
  const path = window.location.pathname
  if (path === '/dashboard' || path.startsWith('/dashboard/')) {
    return <Dashboard />
  }
  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>
)
