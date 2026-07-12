import { useState, ReactNode } from 'react';

interface NoPhiGuardProps {
  children: ReactNode;
}

const DISMISS_KEY = 'somasync_nophi_dismissed';

export default function NoPhiGuard({ children }: NoPhiGuardProps) {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {}
    setDismissed(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {!dismissed && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 20px',
            background: 'rgba(255,159,10,0.08)',
            borderBottom: '1px solid rgba(255,159,10,0.2)',
            fontFamily: "'IBM Plex Mono','Courier New',monospace",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '14px', color: '#ff9f0a', flexShrink: 0 }}>⚠</span>
          <span
            style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.5,
              flex: 1,
            }}
          >
            <strong style={{ color: '#ff9f0a', fontWeight: 700 }}>No PHI:</strong>{' '}
            Do not enter real client names, contact info, or other identifying health
            details. Use de-identified or placeholder data — session content is
            processed by third-party AI services (OpenAI Whisper, Anthropic).
          </span>
          <button
            onClick={handleDismiss}
            style={{
              flexShrink: 0,
              background: 'transparent',
              border: '1px solid rgba(255,159,10,0.3)',
              borderRadius: '6px',
              color: '#ff9f0a',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Dismiss
          </button>
        </div>
      )}
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
}
