import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VoiceCalibrationProps {
  onComplete: () => void;
  onSkip: () => void;
}

const PHRASES = [
  "Neuromuscular therapy to the lumbar paraspinals",
  "Ischemic compression to the piriformis trigger point",
  "Upper Crossed Syndrome with forward head posture",
  "ICD-10 M54.5 — lumbago with sciatica",
  "Myofascial release to the thoracolumbar fascia",
];

export default function VoiceCalibration({ onComplete, onSkip }: VoiceCalibrationProps) {
  const [step, setStep] = useState(0); // 0 = intro, 1-5 = phrases, 6 = done
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState<boolean[]>(new Array(PHRASES.length).fill(false));
  const [transcripts, setTranscripts] = useState<string[]>(new Array(PHRASES.length).fill(''));
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const phraseIndex = step - 1;

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await sendToWhisper(blob);
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
    } catch (e) {
      setError('Microphone access denied. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const sendToWhisper = async (blob: Blob) => {
    try {
      const form = new FormData();
      form.append('audio', blob, 'calibration.webm');
      form.append('prompt', PHRASES[phraseIndex]);
      const { data } = await supabase.functions.invoke('transcribe', { body: form });
      const transcript = data?.transcript || '';
      const newTranscripts = [...transcripts];
      newTranscripts[phraseIndex] = transcript;
      setTranscripts(newTranscripts);
      const newRecorded = [...recorded];
      newRecorded[phraseIndex] = true;
      setRecorded(newRecorded);
    } catch (e) {
      setError('Transcription failed. Try again.');
    }
  };

  const allDone = recorded.every(Boolean);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      background: '#0a0c10',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
    }}>
      <div style={{ maxWidth: '580px', width: '100%' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(48,217,192,0.06)', border: '1px solid rgba(48,217,192,0.15)',
            borderRadius: '12px', padding: '10px 18px',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '7px',
              background: 'linear-gradient(135deg,#0aab94,#30d9c0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: '13px', color: '#061412',
            }}>Λ</div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#30d9c0', letterSpacing: '-0.02em' }}>Voice Calibration</span>
          </div>
        </div>

        {step === 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.04em', marginBottom: '12px' }}>
              Train ΛΛLIYΛH to your voice
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '420px', margin: '0 auto 32px' }}>
              Read 5 clinical phrases aloud so Whisper can calibrate to your accent and terminology. Takes about 60 seconds. This improves transcription accuracy significantly.
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setStep(1)} style={btnStyle('primary')}>
                Start Calibration →
              </button>
              <button onClick={onSkip} style={btnStyle('ghost')}>
                Skip for now
              </button>
            </div>
          </div>
        )}

        {step >= 1 && step <= PHRASES.length && (
          <div>
            {/* Progress */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '28px', justifyContent: 'center' }}>
              {PHRASES.map((_, i) => (
                <div key={i} style={{
                  height: '3px', flex: 1, borderRadius: '99px',
                  background: recorded[i] ? '#30d9c0' : i === phraseIndex ? 'rgba(48,217,192,0.4)' : 'rgba(255,255,255,0.08)',
                  transition: 'all 0.3s',
                }} />
              ))}
            </div>

            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginBottom: '20px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Phrase {step} of {PHRASES.length}
            </div>

            {/* Phrase to read */}
            <div style={{
              background: 'rgba(48,217,192,0.04)', border: '1px solid rgba(48,217,192,0.15)',
              borderRadius: '14px', padding: '24px 28px', marginBottom: '20px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '11px', color: '#30d9c0', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>Read aloud:</div>
              <div style={{ fontSize: '17px', color: '#f1f5f9', fontWeight: 600, lineHeight: 1.6, letterSpacing: '-0.02em' }}>
                "{PHRASES[phraseIndex]}"
              </div>
            </div>

            {/* Transcript result */}
            {transcripts[phraseIndex] && (
              <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', padding: '12px 16px', marginBottom: '16px',
              }}>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Heard:</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{transcripts[phraseIndex]}</div>
              </div>
            )}

            {error && (
              <div style={{ color: '#ff453a', fontSize: '12px', textAlign: 'center', marginBottom: '12px' }}>{error}</div>
            )}

            {/* Controls */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {!recorded[phraseIndex] ? (
                <button
                  onClick={recording ? stopRecording : startRecording}
                  style={btnStyle(recording ? 'danger' : 'primary')}
                >
                  {recording ? '⏹ Stop Recording' : '● Record'}
                </button>
              ) : (
                <>
                  <button onClick={() => {
                    const newRecorded = [...recorded];
                    newRecorded[phraseIndex] = false;
                    setRecorded(newRecorded);
                    setTranscripts(prev => { const n = [...prev]; n[phraseIndex] = ''; return n; });
                  }} style={{ ...btnStyle('ghost'), flex: 'none', width: 'auto', padding: '11px 16px' }}>
                    Re-record
                  </button>
                  <button onClick={() => step < PHRASES.length ? setStep(step + 1) : setStep(PHRASES.length + 1)} style={btnStyle('primary')}>
                    {step < PHRASES.length ? `Next →` : 'Finish →'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {step === PHRASES.length + 1 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>✓</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#30d9c0', letterSpacing: '-0.04em', marginBottom: '10px' }}>
              Calibration complete
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, marginBottom: '28px' }}>
              ΛΛLIYΛH has learned your voice patterns. Transcription accuracy will be improved for your sessions.
            </div>
            <button onClick={onComplete} style={btnStyle('primary')}>
              Enter SomaSync AI →
            </button>
          </div>
        )}
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap');`}</style>
    </div>
  );
}

function btnStyle(variant: 'primary' | 'ghost' | 'danger'): React.CSSProperties {
  const base: React.CSSProperties = {
    flex: 1, padding: '13px 20px', border: '1px solid transparent',
    borderRadius: '10px', fontSize: '13px', fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.2s',
    fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.01em',
  };
  if (variant === 'primary') return { ...base, background: 'linear-gradient(135deg,#0aab94,#30d9c0)', color: '#061412', borderColor: 'transparent' };
  if (variant === 'danger') return { ...base, background: 'linear-gradient(135deg,#c00,#ff453a)', color: '#fff', borderColor: 'transparent' };
  return { ...base, background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' };
}
