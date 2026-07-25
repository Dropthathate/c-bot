import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import BetaConsentModal from "./BetaConsentModal";
import VoiceCalibration from "./VoiceCalibration";

interface OnboardingGateProps {
  children: React.ReactNode;
}

export default function OnboardingGate({ children }: OnboardingGateProps) {
  const { profile } = useAuth();
  const [showBetaConsent, setShowBetaConsent] = useState(false);
  const [showVoiceCalibration, setShowVoiceCalibration] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      // Check localStorage for beta consent
      const betaAccepted = localStorage.getItem("somasync_beta_accepted");
      if (!betaAccepted) {
        setShowBetaConsent(true);
        setLoading(false);
        return;
      }

      // Check localStorage for voice calibration
      const voiceCalibrated = localStorage.getItem("somasync_voice_calibrated");
      if (!voiceCalibrated) {
        setShowVoiceCalibration(true);
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    checkOnboardingStatus();
  }, [profile?.id]);

  const handleBetaAccepted = () => {
    setShowBetaConsent(false);
    // Check if voice calibration is needed
    const voiceCalibrated = localStorage.getItem("somasync_voice_calibrated");
    if (!voiceCalibrated) {
      setShowVoiceCalibration(true);
    }
  };

  const handleVoiceCalibrationComplete = () => {
    localStorage.setItem("somasync_voice_calibrated", "1");
    setShowVoiceCalibration(false);
  };

  const handleVoiceCalibrationSkip = () => {
    localStorage.setItem("somasync_voice_calibrated_skipped", "1");
    setShowVoiceCalibration(false);
  };

  if (loading) {
    return <div>{children}</div>;
  }

  if (showBetaConsent) {
    return <BetaConsentModal onAccepted={handleBetaAccepted} />;
  }

  if (showVoiceCalibration) {
    return (
      <VoiceCalibration
        onComplete={handleVoiceCalibrationComplete}
        onSkip={handleVoiceCalibrationSkip}
      />
    );
  }

  return <>{children}</>;
}
