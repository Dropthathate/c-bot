import { useState, useEffect, useRef } from 'react';

interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  icd10?: Array<{ code: string; description: string }>;
  cpt?: Array<{ code: string; description: string; units?: number }>;
  medical_necessity?: string;
}

type SessionState = 'idle' | 'active' | 'paused' | 'generating';

export default function VoiceSoap() {
  const [state, setState] = useState<SessionState>('idle');
  const [transcript, setTranscript] = useState<Array<{ text: string; type: string; time: string }>>([]);
  const [soapNote, setSoapNote] = useState<SoapNote | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const rawTranscriptRef = useRef<string[]>([]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        if (result.isFinal) {
          handleSpeech(result[0].transcript.trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      recognitionRef.current.onend = () => {
        if (state === 'active') {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.error('Failed to restart recognition:', e);
          }
        }
      };
    } else {
      setError('Speech recognition not supported. Please use Chrome.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSpeech = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('pause session')) {
      pauseSession();
      return;
    }
    if (lowerText.includes('end session')) {
      endSession();
      return;
    }
    
    rawTranscriptRef.current.push(text);
    addToTranscript(text, 'voice');
  };

  const startSession = () => {
    setState('active');
    setTranscript([]);
    setSoapNote(null);
    setError(null);
    rawTranscriptRef.current = [];
    
    if (recognitionRef.current) {
      recognitionRef.current.start();
      addToTranscript('Session started', 'system');
    }
  };

  const pauseSession = () => {
    setState('paused');
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      addToTranscript('Session paused', 'system');
    }
  };

  const resumeSession = () => {
    setState('active');
    if (recognitionRef.current) {
      recognitionRef.current.start();
      addToTranscript('Session resumed', 'system');
    }
  };

  const endSession = async () => {
    setState('generating');
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const fullTranscript = rawTranscriptRef.current.join('. ');
    if (!fullTranscript.trim()) {
      setError('No content recorded');
      setState('idle');
      return;
    }

    await generateSOAP(fullTranscript);
  };

  const generateSOAP = async (rawNotes: string) => {
    try {
      const response = await fetch(
        'https://ucqprtpuuyflnxjmatwo.supabase.co/functions/v1/generate-soap',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer YOUR_SUPABASE_ANON_KEY_HERE`
          },
          body: JSON.stringify({ rawNotes, conversationHistory: [] })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setSoapNote(data.soap);
      addToTranscript('Documentation generated', 'system');
      setState('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate SOAP note');
      setState('idle');
    }
  };

  const addToTranscript = (text: string, type: string) => {
    setTranscript(prev => [...prev, {
      text,
      type,
      time: new Date().toLocaleTimeString()
    }]);
  };

  return (
    <div className="voice-soap-container">
      <div className="voice-soap-sidebar">
        <div className="voice-soap-header">
          <div className="voice-soap-logo">
            <img src="/ss.png" alt="SomaSync AI" className="voice-soap-logo-img" />
            <div className="voice-soap-logo-info">
              <div className="voice-soap-logo-title">SomaSync AI</div>
              <div className="voice-soap-logo-subtitle">Pro Documentation</div>
            </div>
          </div>
          
          <div className="voice-soap-status">
            <div className={`voice-soap-pulse ${state}`}></div>
            <div className="voice-soap-status-label">
              {state === 'active' && 'Recording Session'}
              {state === 'paused' && 'Session Paused'}
              {state === 'generating' && 'AI Processing...'}
              {state === 'idle' && 'Ready to Record'}
            </div>
          </div>
        </div>

        <div className="voice-soap-controls">
          <button 
            className="voice-soap-btn voice-soap-btn-primary"
            onClick={startSession}
            disabled={state !== 'idle'}
          >
            <span>●</span> Start Recording
          </button>
          
          <button 
            className="voice-soap-btn voice-soap-btn-warning"
            onClick={pauseSession}
            disabled={state !== 'active'}
          >
            <span>⏸</span> Pause
          </button>
          
          <button 
            className="voice-soap-btn voice-soap-btn-secondary"
            onClick={resumeSession}
            disabled={state !== 'paused'}
          >
            <span>▶</span> Resume
          </button>
          
          <button 
            className="voice-soap-btn voice-soap-btn-danger"
            onClick={endSession}
            disabled={state !== 'active' && state !== 'paused'}
          >
            <span>⏹</span> Generate Documentation
          </button>
        </div>

        <div className="voice-soap-transcript-section">
          <div className="voice-soap-section-header">Session Transcript</div>
          <div className="voice-soap-transcript-list">
            {transcript.length === 0 ? (
              <div className="voice-soap-transcript-empty">
                Click <strong>Start Recording</strong> to begin voice dictation
              </div>
            ) : (
              transcript.map((item, idx) => (
                <div key={idx} className="voice-soap-transcript-item">
                  <div className="voice-soap-transcript-meta">
                    {item.time} · {item.type}
                  </div>
                  <div className="voice-soap-transcript-text">{item.text}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="voice-soap-main">
        <div className="voice-soap-topbar">
          <div className="voice-soap-topbar-header">
            <div>
              <div className="voice-soap-topbar-title">Insurance-Grade Documentation</div>
              <div className="voice-soap-topbar-subtitle">ICD-10 & CPT Coded • Billable SOAP Notes</div>
            </div>
            <div className="voice-soap-topbar-badge">✓ Insurance Ready</div>
          </div>
        </div>

        <div className="voice-soap-content">
          {error && (
            <div className="voice-soap-empty">
              <div className="voice-soap-empty-icon error">⚠</div>
              <div className="voice-soap-empty-title">Error</div>
              <div className="voice-soap-empty-subtitle">{error}</div>
            </div>
          )}

          {!error && state === 'generating' && (
            <div className="voice-soap-empty">
              <div className="voice-soap-spinner"></div>
              <div className="voice-soap-empty-title">Generating Insurance Documentation</div>
              <div className="voice-soap-empty-subtitle">Creating SOAP note with ICD-10 and CPT codes...</div>
            </div>
          )}

          {!error && state !== 'generating' && !soapNote && (
            <div className="voice-soap-empty">
              <div className="voice-soap-empty-icon">📋</div>
              <div className="voice-soap-empty-title">No Documentation Generated</div>
              <div className="voice-soap-empty-subtitle">Start recording your session to generate billable SOAP notes</div>
            </div>
          )}

          {!error && soapNote && (
            <div className="voice-soap-grid">
              <div className="voice-soap-card subjective">
                <div className="voice-soap-card-header">
                  <div className="voice-soap-icon">S</div>
                  <div className="voice-soap-label">Subjective</div>
                </div>
                <div className="voice-soap-body">{soapNote.subjective || 'Not documented'}</div>
              </div>

              <div className="voice-soap-card objective">
                <div className="voice-soap-card-header">
                  <div className="voice-soap-icon">O</div>
                  <div className="voice-soap-label">Objective</div>
                </div>
                <div className="voice-soap-body">{soapNote.objective || 'Not documented'}</div>
              </div>

              <div className="voice-soap-card assessment">
                <div className="voice-soap-card-header">
                  <div className="voice-soap-icon">A</div>
                  <div className="voice-soap-label">Assessment</div>
                </div>
                <div className="voice-soap-body">{soapNote.assessment || 'Not documented'}</div>
              </div>

              <div className="voice-soap-card plan">
                <div className="voice-soap-card-header">
                  <div className="voice-soap-icon">P</div>
                  <div className="voice-soap-label">Plan</div>
                </div>
                <div className="voice-soap-body">{soapNote.plan || 'Not documented'}</div>
              </div>

              <div className="voice-soap-card billing">
                <div className="voice-soap-card-header">
                  <div className="voice-soap-icon billing-icon">💰</div>
                  <div className="voice-soap-label">Billing Codes</div>
                </div>

                {soapNote.icd10 && soapNote.icd10.length > 0 && (
                  <div className="voice-soap-billing-section">
                    <div className="voice-soap-billing-title">ICD-10 Diagnosis Codes</div>
                    <div className="voice-soap-code-chips">
                      {soapNote.icd10.map((code, idx) => (
                        <div key={idx} className="voice-soap-code-chip">
                          <span className="voice-soap-code-number">{code.code}</span>
                          <span className="voice-soap-code-desc">{code.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {soapNote.cpt && soapNote.cpt.length > 0 && (
                  <div className="voice-soap-billing-section">
                    <div className="voice-soap-billing-title">CPT Procedure Codes</div>
                    <div className="voice-soap-code-chips">
                      {soapNote.cpt.map((code, idx) => (
                        <div key={idx} className="voice-soap-code-chip">
                          <span className="voice-soap-code-number">{code.code}</span>
                          <span className="voice-soap-code-desc">{code.description}</span>
                          {code.units && <span className="voice-soap-code-units">({code.units}u)</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {soapNote.medical_necessity && (
                  <div className="voice-soap-billing-section">
                    <div className="voice-soap-billing-title">Medical Necessity Statement</div>
                    <div className="voice-soap-necessity">{soapNote.medical_necessity}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .voice-soap-container {
          display: grid;
          grid-template-columns: 380px 1fr;
          height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #f1f5f9;
        }

        .voice-soap-sidebar {
          background: #1e293b;
          border-right: 1px solid #334155;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .voice-soap-sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 300px;
          background: linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%);
          pointer-events: none;
        }

        .voice-soap-header {
          padding: 24px;
          border-bottom: 1px solid #334155;
          position: relative;
          z-index: 1;
        }

        .voice-soap-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .voice-soap-logo-img {
          width: 48px;
          height: 48px;
          border-radius: 12px;
        }

        .voice-soap-logo-title {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }

        .voice-soap-logo-subtitle {
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .voice-soap-status {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(14, 165, 233, 0.1));
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .voice-soap-pulse {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #94a3b8;
        }

        .voice-soap-pulse.active {
          background: #059669;
          animation: pulse-ring 2s infinite;
        }

        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(5, 150, 105, 0); }
          100% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0); }
        }

        .voice-soap-pulse.paused { background: #d97706; }
        .voice-soap-pulse.generating { background: #0ea5e9; }

        .voice-soap-status-label {
          font-size: 13px;
          font-weight: 600;
        }

        .voice-soap-controls {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          z-index: 1;
        }

        .voice-soap-btn {
          width: 100%;
          padding: 14px 20px;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .voice-soap-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.4);
        }

        .voice-soap-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .voice-soap-btn-primary {
          background: linear-gradient(135deg, #3b82f6, #0ea5e9);
          color: white;
        }

        .voice-soap-btn-warning {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        }

        .voice-soap-btn-danger {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }

        .voice-soap-btn-secondary {
          background: #334155;
          border: 1px solid #334155;
          color: #f1f5f9;
        }

        .voice-soap-transcript-section {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          position: relative;
          z-index: 1;
        }

        .voice-soap-section-header {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #94a3b8;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .voice-soap-section-header::before {
          content: '';
          width: 3px;
          height: 14px;
          background: linear-gradient(180deg, #3b82f6, #0ea5e9);
          border-radius: 2px;
        }

        .voice-soap-transcript-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .voice-soap-transcript-empty {
          text-align: center;
          color: #94a3b8;
          padding: 60px 20px;
          font-size: 13px;
          line-height: 1.6;
        }

        .voice-soap-transcript-empty strong {
          color: #3b82f6;
        }

        .voice-soap-transcript-item {
          background: #334155;
          border: 1px solid #334155;
          border-radius: 10px;
          padding: 12px 14px;
          transition: all 0.2s;
        }

        .voice-soap-transcript-item:hover {
          border-color: rgba(59, 130, 246, 0.3);
          background: rgba(59, 130, 246, 0.05);
        }

        .voice-soap-transcript-meta {
          font-size: 10px;
          color: #94a3b8;
          margin-bottom: 6px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .voice-soap-transcript-text {
          font-size: 13px;
          line-height: 1.6;
        }

        .voice-soap-main {
          background: #0f172a;
          display: flex;
          flex-direction: column;
        }

        .voice-soap-topbar {
          padding: 24px 36px;
          border-bottom: 1px solid #334155;
          background: rgba(30, 41, 59, 0.8);
        }

        .voice-soap-topbar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .voice-soap-topbar-title {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .voice-soap-topbar-badge {
          background: linear-gradient(135deg, rgba(5, 150, 105, 0.2), rgba(14, 165, 233, 0.2));
          border: 1px solid rgba(5, 150, 105, 0.3);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #059669;
        }

        .voice-soap-topbar-subtitle {
          font-size: 13px;
          color: #94a3b8;
          margin-top: 4px;
        }

        .voice-soap-content {
          flex: 1;
          padding: 36px;
          overflow-y: auto;
        }

        .voice-soap-empty {
          text-align: center;
          padding: 120px 40px;
        }

        .voice-soap-empty-icon {
          font-size: 72px;
          margin-bottom: 24px;
          opacity: 0.2;
        }

        .voice-soap-empty-icon.error {
          color: #dc2626;
          opacity: 1;
        }

        .voice-soap-empty-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .voice-soap-empty-subtitle {
          font-size: 14px;
          color: #94a3b8;
        }

        .voice-soap-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #334155;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 24px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .voice-soap-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .voice-soap-card {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 16px;
          padding: 24px;
          min-height: 200px;
          transition: all 0.3s;
        }

        .voice-soap-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.4);
          border-color: rgba(59, 130, 246, 0.4);
        }

        .voice-soap-card.subjective { border-top: 4px solid #3b82f6; }
        .voice-soap-card.objective { border-top: 4px solid #10b981; }
        .voice-soap-card.assessment { border-top: 4px solid #8b5cf6; }
        .voice-soap-card.plan { border-top: 4px solid #f59e0b; }
        .voice-soap-card.billing { 
          grid-column: 1 / -1;
          background: linear-gradient(135deg, #1e293b, #334155);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .voice-soap-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #334155;
        }

        .voice-soap-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 800;
          color: white;
        }

        .subjective .voice-soap-icon { background: #3b82f6; }
        .objective .voice-soap-icon { background: #10b981; }
        .assessment .voice-soap-icon { background: #8b5cf6; }
        .plan .voice-soap-icon { background: #f59e0b; }
        .billing-icon { background: linear-gradient(135deg, #10b981, #059669); }

        .voice-soap-label {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #94a3b8;
        }

        .voice-soap-body {
          font-size: 14px;
          line-height: 1.8;
          white-space: pre-wrap;
        }

        .voice-soap-billing-section {
          margin-bottom: 24px;
        }

        .voice-soap-billing-section:last-child {
          margin-bottom: 0;
        }

        .voice-soap-billing-title {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #94a3b8;
          margin-bottom: 12px;
        }

        .voice-soap-code-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .voice-soap-code-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 10px;
          transition: all 0.2s;
        }

        .voice-soap-code-chip:hover {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }

        .voice-soap-code-number {
          font-weight: 700;
          color: #3b82f6;
          font-size: 14px;
        }

        .voice-soap-code-desc {
          font-size: 13px;
        }

        .voice-soap-code-units {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 600;
        }

        .voice-soap-necessity {
          background: rgba(5, 150, 105, 0.05);
          border: 1px solid rgba(5, 150, 105, 0.2);
          border-radius: 12px;
          padding: 16px 20px;
          font-size: 14px;
          line-height: 1.7;
        }
      `}</style>
    </div>
  );
}
