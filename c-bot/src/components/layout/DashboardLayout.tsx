import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "./DashboardSidebar";
import BetaConsentModal from "@/components/BetaConsentModal";
import VoiceCalibration from "@/components/VoiceCalibration";
import { Loader2 } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  requiredRole?: string;
  requiredTier?: string;
  comingSoon?: boolean;
  comingSoonLabel?: string;
}

const DashboardLayout = ({ children, comingSoon, comingSoonLabel }: DashboardLayoutProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showConsent, setShowConsent] = useState(false);
  const [showCalibration, setShowCalibration] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user && !loading) {
      const accepted = localStorage.getItem('somasync_beta_accepted');
      const calibrated = localStorage.getItem('somasync_calibrated');
      if (!accepted) {
        setShowConsent(true);
      } else if (!calibrated) {
        setShowCalibration(true);
      } else {
        setReady(true);
      }
    }
  }, [user, loading]);

  const handleConsentAccepted = () => {
    setShowConsent(false);
    setShowCalibration(true);
  };

  const handleCalibrationComplete = () => {
    localStorage.setItem('somasync_calibrated', '1');
    setShowCalibration(false);
    setReady(true);
  };

  const handleCalibrationSkip = () => {
    localStorage.setItem('somasync_calibrated', 'skipped');
    setShowCalibration(false);
    setReady(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex flex-col items-center justify-center">
        <div className="text-xl font-black tracking-tighter mb-4 text-white">ΛΛLIYΛH<span className="text-[#30d9c0]">.IO</span></div>
        <Loader2 className="h-6 w-6 animate-spin text-[#30d9c0]" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      {showConsent && <BetaConsentModal onAccepted={handleConsentAccepted} />}
      {showCalibration && !showConsent && (
        <VoiceCalibration onComplete={handleCalibrationComplete} onSkip={handleCalibrationSkip} />
      )}

      <div className="min-h-screen bg-[#0a0c10] flex" style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.3s' }}>
        <DashboardSidebar />
        <main className="flex-1 overflow-auto bg-slate-50/5 relative">
          {comingSoon && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 10,
              background: 'rgba(10, 12, 16, 0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '16px',
              fontFamily: "'IBM Plex Mono', monospace",
            }}>
              <div style={{
                background: 'rgba(48,217,192,0.06)', border: '1px solid rgba(48,217,192,0.2)',
                borderRadius: '16px', padding: '36px 48px', textAlign: 'center', maxWidth: '420px',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔜</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.03em', marginBottom: '8px' }}>
                  {comingSoonLabel || 'Coming Soon'}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.8 }}>
                  This feature is in development and will be available in the next beta release. Thank you for testing SomaSync AI.
                </div>
                <div style={{
                  marginTop: '20px', padding: '8px 14px',
                  background: 'rgba(48,217,192,0.08)', border: '1px solid rgba(48,217,192,0.15)',
                  borderRadius: '8px', fontSize: '11px', color: '#30d9c0', fontWeight: 700, letterSpacing: '0.06em',
                }}>
                  BETA v1.0
                </div>
              </div>
            </div>
          )}
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
