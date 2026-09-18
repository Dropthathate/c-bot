import { useEffect, useRef, useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

// ── Clinical tips rotated daily ──────────────────────────────
const TIPS = [
  { tag: 'NMT', title: 'Upper Trapezius Trigger Points', body: 'Active TrPs in the upper trapezius refer pain to the posterolateral neck and temple. Palpate along the descending fibers from occiput to acromion. Client-reported unilateral headache with ipsilateral shoulder elevation is a classic presentation.' },
  { tag: 'NMT', title: 'Infraspinatus Referral Pattern', body: 'Infraspinatus TrPs refer deep into the anterior shoulder and down the lateral arm to the radial forearm. Often misread as rotator cuff tear or bicipital tendinitis. Assess with shoulder IR and ER range of motion.' },
  { tag: 'Posture', title: 'Upper Crossed Syndrome', body: 'Tight: upper traps, levator scapulae, pectorals. Weak: deep cervical flexors, lower and mid trapezius. Observable: forward head, elevated rounded shoulders, hyperlordotic cervical curve. Address inhibited muscles before releasing tight ones.' },
  { tag: 'BPS', title: 'Biopsychosocial Considerations', body: 'Stress and sleep quality modulate pain thresholds directly. A client reporting 8/10 stress with 3/10 sleep may present with heightened tissue sensitivity regardless of structural findings. Adjust pressure and pacing accordingly.' },
  { tag: 'NMT', title: 'Scalene Trigger Points', body: 'Anterior and middle scalene TrPs refer to the chest, medial scapular border, and radial forearm into the thumb and index finger. Can mimic thoracic outlet syndrome. Assess with cervical lateral flexion and rotation.' },
  { tag: 'Technique', title: 'Ischemic Compression Protocol', body: 'Apply sustained pressure at the TrP until the referred sensation begins to diminish — typically 8 to 12 seconds. Release slowly. Repeat 2 to 3 times per point. Coordinate with the client\'s breathing: pressure on exhale, hold through inhale.' },
  { tag: 'NMT', title: 'Quadratus Lumborum', body: 'QL TrPs refer to the lateral hip, SI joint, and lateral thigh. Often overlooked in low back presentations. Palpate in side-lying with the hip dropped to open the QL. Client-reported pain rolling over in bed is a key indicator.' },
  { tag: 'Posture', title: 'Lower Crossed Syndrome', body: 'Tight: hip flexors, lumbar erectors. Weak: gluteus maximus, abdominals. Observable: anterior pelvic tilt, increased lumbar lordosis, knee hyperextension. Address glute inhibition before releasing hip flexors.' },
  { tag: 'Pain Science', title: 'Central Sensitization', body: 'When central sensitization is present, tissue-level findings may not correlate with pain intensity. Clients may be hypersensitive to light touch in areas with no structural pathology. Prioritize nervous system regulation — slow rhythmic techniques, breathing cues, therapeutic presence.' },
  { tag: 'NMT', title: 'Suboccipital Muscles', body: 'Rectus capitis posterior minor TrPs can refer diffuse pain deep inside the head — often described as an internal headache. Often coexists with upper trap and SCM involvement. Palpate just inferior to the occiput with client prone.' },
]

const NEWS = [
  { tag: 'Research', title: 'Myofascial release shows significant reduction in chronic low back pain', src: 'Journal of Bodywork & Movement Therapies', time: '3 days ago' },
  { tag: 'Pain Science', title: 'Biopsychosocial model outperforms structural-only approach in outcome prediction', src: 'Pain Medicine', time: '1 week ago' },
  { tag: 'Clinical', title: 'Deepgram live transcription latency improvements benefit real-time documentation', src: 'Deepgram Blog', time: '2 weeks ago' },
  { tag: 'NMT', title: 'Trigger point dry needling vs ischemic compression — comparable outcomes at 6 weeks', src: 'Manual Therapy Journal', time: '3 weeks ago' },
  { tag: 'Practice', title: 'CAMTC updates continuing education requirements for 2026 renewal cycle', src: 'CAMTC', time: '1 month ago' },
]

const VOICE_COMMANDS = [
  { cmd: '"begin session"', desc: 'Start session after earpiece checklist' },
  { cmd: '"noting"',        desc: 'Open audio gate — Deepgram starts capturing' },
  { cmd: '"pause"',         desc: 'Close audio gate — stops logging' },
  { cmd: '"end session"',   desc: 'Close session with grounding-out prompt' },
  { cmd: '"replay"',        desc: 'Hear last 3 logged observations' },
  { cmd: '"time check"',    desc: 'Hear remaining session time' },
  { cmd: '"client check"',  desc: 'Prompt to confirm symptoms' },
  { cmd: '"soma okay"',     desc: 'Dismiss active earpiece reminder' },
]

// ── Animated signal canvas ────────────────────────────────────
function SignalCanvas({ active, ambient = false }) {
  const ref   = useRef(null)
  const frame = useRef(null)
  const phase = useRef(0)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w, h

    function resize() {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width  = w * devicePixelRatio
      canvas.height = h * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      ctx.clearRect(0, 0, w, h)
      const mid   = h / 2
      const speed = active ? 0.055 : ambient ? 0.008 : 0.014
      phase.current += speed

      const lines = active ? 3 : 1
      for (let l = 0; l < lines; l++) {
        ctx.beginPath()
        for (let x = 0; x <= w; x++) {
          const t   = (x / w) * Math.PI * (active ? 10 : 6) + phase.current + l * 1.1
          const amp = active
            ? mid * 0.5 * (0.5 + 0.5 * Math.sin(t * 0.8 + l)) * Math.sin(t * 1.2 + l * 0.5)
            : mid * (ambient ? 0.08 : 0.1) * Math.sin(t * 0.5 + phase.current * 0.2)
          x === 0 ? ctx.moveTo(x, mid + amp) : ctx.lineTo(x, mid + amp)
        }
        const g = ctx.createLinearGradient(0, 0, w, 0)
        const alpha = active ? (l === 0 ? .9 : .35) : ambient ? .12 : .2
        g.addColorStop(0,   `rgba(0,201,167,0)`)
        g.addColorStop(0.3, `rgba(0,201,167,${alpha})`)
        g.addColorStop(0.7, `rgba(61,139,255,${alpha * .8})`)
        g.addColorStop(1,   `rgba(0,201,167,0)`)
        ctx.strokeStyle = g
        ctx.lineWidth   = active ? (l === 0 ? 2 : 1) : 1.2
        ctx.shadowColor = '#00c9a7'
        ctx.shadowBlur  = active ? 14 : ambient ? 6 : 5
        ctx.stroke()
      }
      frame.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(frame.current); window.removeEventListener('resize', resize) }
  }, [active, ambient])

  return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />
}

// ── Live clock ────────────────────────────────────────────────
function Clock() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i) }, [])
  return <>{t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</>
}

// ── Tag pill ──────────────────────────────────────────────────
function Tag({ label, color = '#00c9a7' }) {
  return (
    <span style={{
      fontSize: '.6rem', fontWeight: 700, letterSpacing: '.07em',
      background: `${color}14`, color,
      border: `1px solid ${color}30`,
      borderRadius: 100, padding: '3px 9px',
    }}>{label}</span>
  )
}

// ── Main dashboard ────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth()
  const name     = user?.email?.split('@')[0] ?? 'Practitioner'
  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const tip      = TIPS[new Date().getDate() % TIPS.length]

  const [copied, setCopied]     = useState(false)
  const [tokenInput, setToken]  = useState('')
  const [intakeCount]           = useState(0) // future: pull from Supabase
  const [sessionCount]          = useState(0)

  const copyIntakeLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.origin + '/intake/')
    setCopied(true)
    setTimeout(() => setCopied(false), 2400)
  }, [])

  return (
    <div style={S.page}>

      {/* ════ TOP BAR ════ */}
      <div style={S.topbar}>
        <div>
          <div style={S.greeting}>{greeting}, {name}</div>
          <div style={S.meta}>
            <span style={S.liveDot} />
            <span style={{ color: '#00c9a7', fontWeight: 600 }}>System ready</span>
            <span style={S.sep} />
            <Clock />
            <span style={S.sep} />
            <Tag label="Beta" color="#f5a623" />
          </div>
        </div>
        <Link to="/clinical-workspace/" style={S.primaryBtn}>
          Open workspace →
        </Link>
      </div>

      {/* ════ HERO — SIGNAL MONITOR ════ */}
      <div style={S.hero}>
        <div style={S.heroAmbient} />
        <div style={S.heroLeft}>
          <div style={S.heroEyebrow}>
            <span style={S.heroDot} />
            SOMASYNC // SIGNAL MONITOR
          </div>
          <div style={S.heroTitle}>No active session.</div>
          <div style={S.heroSub}>
            Enter a client's intake token, open the workspace, and say{' '}
            <code style={S.inlineCode}>"begin session"</code> — your earpiece
            handles the rest.
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap' }}>
            <Link to="/clinical-workspace/" style={S.primaryBtn}>Start session</Link>
            <button onClick={copyIntakeLink} style={S.ghostBtn}>
              {copied ? '✓ Link copied' : '📋 Copy intake link'}
            </button>
          </div>
        </div>
        <div style={S.heroCanvas}>
          <div style={S.canvasLabel}>IDLE // AWAITING SESSION</div>
          <SignalCanvas active={false} ambient />
          <div style={S.canvasFooter}>
            <span>PCM OFFLINE</span>
            <span>WSS OFFLINE</span>
            <span>STT OFFLINE</span>
          </div>
        </div>
      </div>

      {/* ════ STATS ROW ════ */}
      <div style={S.statsRow}>
        {[
          { label: 'Sessions this month', value: sessionCount || '—', sub: 'Beta period' },
          { label: 'Intakes received', value: intakeCount || '—', sub: 'Via email notification' },
          { label: 'SOAP notes exported', value: '—', sub: 'Clinician-reviewed only' },
          { label: 'Platform status', value: '✓ Live', sub: 'All systems operational', teal: true },
        ].map(s => (
          <div key={s.label} style={S.statCard}>
            <div style={{ ...S.statVal, ...(s.teal ? { color: '#00c9a7' } : {}) }}>{s.value}</div>
            <div style={S.statLabel}>{s.label}</div>
            <div style={S.statSub}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ════ THREE COLUMN ════ */}
      <div style={S.threeCol}>

        {/* ── Quick actions ── */}
        <div style={{ ...S.panel, gridColumn: '1 / 3' }}>
          <div style={S.panelHead}>
            <span style={S.panelTitle}>Quick actions</span>
          </div>
          <div style={S.actionsGrid}>
            {[
              { to: '/clinical-workspace/', icon: '🎙️', label: 'Start session', desc: 'Open real-time workspace' },
              { action: copyIntakeLink, icon: '📋', label: copied ? 'Copied!' : 'Copy intake link', desc: 'Send to client before appointment' },
              { to: '/dashboard/soap', icon: '📝', label: 'SOAP generator', desc: 'REST-based note generation' },
              { to: '/dashboard/icd', icon: '🔍', label: 'ICD-10 reference', desc: 'Search codes — reference only' },
              { to: '/dashboard/analytics', icon: '📊', label: 'Analytics', desc: 'Session and practice data' },
              { href: '/intake/', icon: '📱', label: 'Preview intake form', desc: 'See what your clients see' },
            ].map(a => (
              a.action
                ? <button key={a.label} onClick={a.action} style={S.actionCard}>
                    <span style={S.aIcon}>{a.icon}</span>
                    <div><div style={S.aLabel}>{a.label}</div><div style={S.aDesc}>{a.desc}</div></div>
                  </button>
                : a.href
                  ? <a key={a.label} href={a.href} target="_blank" rel="noreferrer" style={S.actionCard}>
                      <span style={S.aIcon}>{a.icon}</span>
                      <div><div style={S.aLabel}>{a.label}</div><div style={S.aDesc}>{a.desc}</div></div>
                    </a>
                  : <Link key={a.label} to={a.to} style={S.actionCard}>
                      <span style={S.aIcon}>{a.icon}</span>
                      <div><div style={S.aLabel}>{a.label}</div><div style={S.aDesc}>{a.desc}</div></div>
                    </Link>
            ))}
          </div>
        </div>

        {/* ── Token quick-load ── */}
        <div style={S.panel}>
          <div style={S.panelHead}>
            <span style={S.panelTitle}>Load intake</span>
            <Tag label="Token" />
          </div>
          <p style={S.panelSub}>Enter a client's session code to pre-load their clinical brief before opening the workspace.</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input
              value={tokenInput}
              onChange={e => setToken(e.target.value.toUpperCase())}
              placeholder="SS-XXXXXX"
              maxLength={9}
              style={S.tokenInput}
            />
            <Link
              to="/clinical-workspace/"
              style={{ ...S.primaryBtn, fontSize: '.78rem', padding: '9px 14px', whiteSpace: 'nowrap' }}
            >
              Open →
            </Link>
          </div>
          <p style={{ fontSize: '.7rem', color: '#2a5a6a' }}>
            Token comes from the intake email. Client sees it on their confirmation screen.
          </p>
        </div>

      </div>

      {/* ════ TWO COLUMN — TIP + FLOW ════ */}
      <div style={S.twoCol}>

        {/* Clinical tip */}
        <div style={S.panel}>
          <div style={S.panelHead}>
            <span style={S.panelTitle}>Clinical insight</span>
            <Tag label={tip.tag} />
          </div>
          <div style={S.tipTitle}>{tip.title}</div>
          <div style={S.tipBody}>{tip.body}</div>
          <div style={S.tipFooter}>NMT clinical knowledge base · Reference only · Rotates daily</div>
        </div>

        {/* Session flow */}
        <div style={S.panel}>
          <div style={S.panelHead}>
            <span style={S.panelTitle}>Session flow</span>
            <Tag label="How to use" color="#3d8bff" />
          </div>
          {[
            ['01', 'Send intake link', 'Copy and send to client before their appointment — they fill it out on their phone'],
            ['02', 'Client completes SIP', '5-step Somatic Intake Protocol: body map, symptoms, functional impact, biopsychosocial, preferences'],
            ['03', 'You receive the token', 'Email arrives at nate@somasyncai.com with session code and full summary'],
            ['04', 'Enter token in workspace', 'SomaSyncAI generates a pre-session NMT clinical brief for your earpiece'],
            ['05', 'Begin session', 'Say "begin session" — earpiece walks you through the brief then grounds you in'],
          ].map(([n, t, d]) => (
            <div key={n} style={S.flowRow}>
              <div style={S.flowNum}>{n}</div>
              <div>
                <div style={S.flowTitle}>{t}</div>
                <div style={S.flowDesc}>{d}</div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ════ NEWS + VOICE COMMANDS ════ */}
      <div style={S.twoCol}>

        {/* News feed */}
        <div style={S.panel}>
          <div style={S.panelHead}>
            <span style={S.panelTitle}>Clinical news & research</span>
            <Tag label="Feed" color="#a78bfa" />
          </div>
          {NEWS.map(n => (
            <div key={n.title} style={S.newsRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <Tag label={n.tag} color="#a78bfa" />
                <span style={{ fontSize: '.65rem', color: '#2a5a6a' }}>{n.time}</span>
              </div>
              <div style={S.newsTitle}>{n.title}</div>
              <div style={S.newsSrc}>{n.src}</div>
            </div>
          ))}
        </div>

        {/* Voice commands */}
        <div style={S.panel}>
          <div style={S.panelHead}>
            <span style={S.panelTitle}>Voice commands</span>
            <Tag label="Earpiece" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {VOICE_COMMANDS.map(v => (
              <div key={v.cmd} style={S.cmdRow}>
                <code style={S.cmdCode}>{v.cmd}</code>
                <span style={S.cmdDesc}>{v.desc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ════ BODY MECHANICS REMINDER ════ */}
      <div style={S.mechanicsCard}>
        <div style={S.mechIcon}>🧘</div>
        <div>
          <div style={S.mechTitle}>Body mechanics check</div>
          <div style={S.mechBody}>
            Neutral wrist position. Dropped shoulders. Weight distributed through your stance, not your lower back.
            Use your body weight, not muscular effort. Check in with your own posture every 20 minutes during sessions.
          </div>
        </div>
      </div>

      {/* ════ DISCLAIMER ════ */}
      <div style={S.disclaimer}>
        <strong>AI Disclaimer —</strong> SomaSyncAI generates documentation suggestions and clinical orientation only. All SOAP notes, pre-session briefs, and ICD-10 references must be reviewed and verified by a licensed clinician before use in any clinical, billing, or legal context. This platform does not diagnose, prescribe, or replace professional clinical judgment. ICD-10 codes are for reference only and require clinician verification.
      </div>

    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────
const C = {
  bg:    '#050d14',
  panel: '#0a1825',
  p2:    '#0e2030',
  teal:  '#00c9a7',
  tealA: 'rgba(0,201,167,.1)',
  tealB: 'rgba(0,201,167,.18)',
  ink:   '#eef4f7',
  muted: '#6a8a99',
  line:  'rgba(0,201,167,.1)',
  r:     '10px',
}

const S = {
  page: {
    padding: 'clamp(20px,3vw,40px)',
    maxWidth: 1140,
    fontFamily: "'Inter', ui-sans-serif, sans-serif",
    color: C.ink,
    WebkitFontSmoothing: 'antialiased',
  },
  topbar: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28, gap: 16, flexWrap: 'wrap',
  },
  greeting: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 'clamp(1.3rem,2.5vw,1.9rem)',
    letterSpacing: '-.035em',
    marginBottom: 6,
  },
  meta: {
    display: 'flex', alignItems: 'center',
    gap: 8, fontSize: '.78rem', color: C.muted,
  },
  liveDot: {
    width: 7, height: 7, borderRadius: '50%',
    background: '#00c9a7',
    boxShadow: '0 0 8px #00c9a7',
    display: 'inline-block', flexShrink: 0,
    animation: 'pulse 2s ease-in-out infinite',
  },
  sep: {
    width: 3, height: 3, borderRadius: '50%',
    background: C.muted, display: 'inline-block',
  },
  primaryBtn: {
    background: C.teal, color: '#050d14',
    fontWeight: 700, fontSize: '.85rem',
    padding: '11px 22px', borderRadius: C.r,
    textDecoration: 'none', display: 'inline-block',
    fontFamily: "'Inter', sans-serif",
    border: 'none', cursor: 'pointer',
    transition: 'opacity .2s',
  },
  ghostBtn: {
    background: 'transparent',
    border: `1px solid ${C.tealB}`,
    color: C.teal, fontWeight: 600, fontSize: '.82rem',
    padding: '11px 18px', borderRadius: C.r,
    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
  },

  // Hero
  hero: {
    background: C.panel,
    border: `1px solid ${C.line}`,
    borderRadius: 16, padding: '32px 32px 28px',
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: 32, alignItems: 'center',
    marginBottom: 16,
    position: 'relative', overflow: 'hidden',
  },
  heroAmbient: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(0,201,167,.05), transparent)',
  },
  heroLeft: { display: 'flex', flexDirection: 'column', position: 'relative' },
  heroEyebrow: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontSize: '.65rem', fontWeight: 700, color: C.teal,
    letterSpacing: '.08em', marginBottom: 14,
  },
  heroDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: C.teal, display: 'inline-block',
    boxShadow: '0 0 8px #00c9a7',
  },
  heroTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 'clamp(1.4rem,2.8vw,2.2rem)',
    letterSpacing: '-.03em', marginBottom: 10,
  },
  heroSub: {
    fontSize: '.88rem', color: C.muted,
    lineHeight: 1.75, maxWidth: 420,
  },
  inlineCode: {
    fontFamily: "'Syne', monospace",
    background: C.p2, color: C.teal,
    padding: '1px 6px', borderRadius: 4,
    fontSize: '.82rem',
  },
  heroCanvas: {
    background: C.p2,
    border: `1px solid ${C.line}`,
    borderRadius: 12, overflow: 'hidden',
    height: 140, display: 'flex',
    flexDirection: 'column', position: 'relative',
  },
  canvasLabel: {
    fontSize: '.58rem', fontWeight: 700,
    color: C.teal, letterSpacing: '.08em',
    padding: '8px 12px',
    borderBottom: `1px solid ${C.line}`,
    flexShrink: 0,
  },
  canvasFooter: {
    display: 'flex', gap: 12,
    padding: '6px 12px',
    borderTop: `1px solid ${C.line}`,
    fontSize: '.55rem', color: '#2a5a6a',
    fontWeight: 600, letterSpacing: '.04em',
    flexShrink: 0,
  },

  // Stats
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4,1fr)',
    gap: 8, marginBottom: 16,
  },
  statCard: {
    background: C.panel,
    border: `1px solid ${C.line}`,
    borderRadius: C.r, padding: '18px 20px',
  },
  statVal: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800, fontSize: '1.6rem',
    letterSpacing: '-.02em', marginBottom: 4,
  },
  statLabel: { fontSize: '.75rem', color: C.ink, fontWeight: 500, marginBottom: 2 },
  statSub:   { fontSize: '.68rem', color: C.muted },

  // Grids
  threeCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 280px',
    gap: 8, marginBottom: 16,
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,1fr)',
    gap: 8, marginBottom: 16,
  },

  // Panel
  panel: {
    background: C.panel,
    border: `1px solid ${C.line}`,
    borderRadius: 14, padding: '22px',
  },
  panelHead: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 16,
  },
  panelTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700, fontSize: '.9rem',
  },
  panelSub: { fontSize: '.78rem', color: C.muted, lineHeight: 1.65, marginBottom: 14 },

  // Actions
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: 6,
  },
  actionCard: {
    background: C.p2,
    border: `1px solid ${C.line}`,
    borderRadius: 8, padding: '14px 14px',
    display: 'flex', alignItems: 'center', gap: 12,
    textDecoration: 'none', color: C.ink,
    cursor: 'pointer', transition: 'border-color .18s',
    fontFamily: "'Inter', sans-serif",
  },
  aIcon:  { fontSize: '1.1rem', flexShrink: 0 },
  aLabel: { fontSize: '.8rem', fontWeight: 600, marginBottom: 2 },
  aDesc:  { fontSize: '.68rem', color: C.muted },

  // Token
  tokenInput: {
    flex: 1,
    background: C.p2,
    border: `1px solid rgba(0,201,167,.2)`,
    borderRadius: 7, padding: '9px 12px',
    color: C.ink,
    fontFamily: "'Syne', monospace",
    fontWeight: 700, fontSize: '.9rem',
    letterSpacing: '.08em',
    textTransform: 'uppercase',
    outline: 'none',
  },

  // Tip
  tipTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700, fontSize: '.95rem',
    marginBottom: 10,
  },
  tipBody: {
    fontSize: '.82rem', color: C.muted,
    lineHeight: 1.8, marginBottom: 14,
  },
  tipFooter: {
    fontSize: '.63rem', color: '#2a5a6a',
    borderTop: `1px solid ${C.line}`, paddingTop: 10,
  },

  // Flow
  flowRow: {
    display: 'flex', gap: 14,
    paddingBottom: 12, marginBottom: 12,
    borderBottom: `1px solid rgba(0,201,167,.06)`,
  },
  flowNum: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800, fontSize: '.72rem',
    color: C.teal, flexShrink: 0, paddingTop: 1,
  },
  flowTitle: { fontSize: '.82rem', fontWeight: 600, marginBottom: 2 },
  flowDesc:  { fontSize: '.73rem', color: C.muted, lineHeight: 1.6 },

  // News
  newsRow: {
    paddingBottom: 14, marginBottom: 14,
    borderBottom: `1px solid rgba(0,201,167,.06)`,
  },
  newsTitle: { fontSize: '.82rem', fontWeight: 600, lineHeight: 1.5, marginBottom: 4 },
  newsSrc:   { fontSize: '.68rem', color: C.muted },

  // Commands
  cmdRow: {
    background: C.p2,
    border: `1px solid ${C.line}`,
    borderRadius: 7, padding: '10px 12px',
    display: 'flex', flexDirection: 'column', gap: 3,
  },
  cmdCode: {
    fontFamily: "'Syne', monospace",
    fontSize: '.73rem', fontWeight: 700,
    color: C.teal, letterSpacing: '.02em',
  },
  cmdDesc: { fontSize: '.71rem', color: C.muted, lineHeight: 1.5 },

  // Mechanics
  mechanicsCard: {
    background: `linear-gradient(135deg, ${C.panel} 0%, #0a2030 100%)`,
    border: `1px solid rgba(0,201,167,.2)`,
    borderRadius: 14, padding: '20px 24px',
    display: 'flex', gap: 18, alignItems: 'flex-start',
    marginBottom: 16,
  },
  mechIcon:  { fontSize: '1.8rem', flexShrink: 0, marginTop: 2 },
  mechTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700, fontSize: '.9rem',
    marginBottom: 8,
  },
  mechBody: { fontSize: '.8rem', color: C.muted, lineHeight: 1.75 },

  // Disclaimer
  disclaimer: {
    background: C.p2,
    border: `1px solid ${C.line}`,
    borderRadius: 10, padding: '14px 18px',
    fontSize: '.73rem', color: C.muted, lineHeight: 1.7,
  },
}
