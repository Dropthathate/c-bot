import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Intake from "./pages/therapist/Intake";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        {/* Automatically load Intake page on site load */}
        <Route path="/" element={<Navigate to="/therapist/Intake" />} />
        <Route path="/therapist/Intake" element={<Intake />} />
        <Route path="*" element={<NotFound />} /> {/* fallback 404 */}
      </Routes>
    </Router>
  );
}

export default App;
