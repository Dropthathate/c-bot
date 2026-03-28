import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// ── ASSESSMENT PROTOCOL STEPS ──────────────────────────────
const PROTOCOL = [
  {
    phase: 'INTAKE',
    steps: [
      { id: 1, label: 'Client History', prompt: 'Read the client intake form aloud — name of condition, chief complaint, duration, and prior treatment history.', keywords: ['history', 'complaint', 'duration', 'treated', 'injury', 'pain', 'condition'] },
      { id: 2, label: 'Daily Living', prompt: 'Ask the client about their daily activities — type of work, repetitive movements, sleep position, recreational activities, and stress levels.', keywords: ['work', 'sleep', 'activity', 'stress', 'exercise', 'sit', 'stand', 'drive'] },
      { id: 3, label: 'Pain Assessment', prompt: 'Ask the client to rate their pain on a scale of 1 to 10 and describe the quality — sharp, dull, burning, radiating, constant, or intermittent.', keywords: ['pain', 'rate', 'scale', 'sharp', 'dull', 'burning', 'radiating', 'constant'] },
    ]
  },
  {
    phase: 'POSTURAL ASSESSMENT',
    steps: [
      { id: 4, label: 'Visual Anterior', prompt: 'Observe the client from the front. Call any visible deviations — head tilt, shoulder elevation, hip shift, knee valgus or varus, foot pronation or supination.', keywords: ['anterior', 'front', 'tilt', 'elevation', 'shift', 'valgus', 'varus', 'pronation'] },
      { id: 5, label: 'Visual Lateral', prompt: 'Observe the client from the side. Note forward head posture, thoracic kyphosis, lumbar lordosis, anterior or posterior pelvic tilt, and knee hyperextension.', keywords: ['lateral', 'side', 'forward head', 'kyphosis', 'lordosis', 'pelvic', 'hyperextension'] },
      { id: 6, label: 'Visual Posterior', prompt: 'Observe from the rear. Note scoliotic curves, scapular winging, gluteal asymmetry, popliteal crease height, and calcaneal alignment.', keywords: ['posterior', 'rear', 'scoliosis', 'scapular', 'winging', 'gluteal', 'calcaneal'] },
    ]
  },
  {
    phase: 'RANGE OF MOTION',
    steps: [
      { id: 7, label: 'Active ROM', prompt: 'Guide the client through active range of motion. Note restrictions, pain provocation, and compensatory patterns. State the region and movement tested.', keywords: ['active', 'range', 'motion', 'flexion', 'extension', 'rotation', 'restriction', 'pain'] },
      { id: 8, label: 'Passive ROM', prompt: 'Perform passive range of motion assessment. Note end-feel quality — soft, firm, or hard. State any hypomobility or hypermobility findings.', keywords: ['passive', 'end feel', 'soft', 'firm', 'hard', 'hypomobility', 'hypermobility'] },
    ]
  },
  {
    phase: 'PALPATION',
    steps: [
      { id: 9, label: 'Soft Tissue', prompt: 'Begin palpation. State the muscle or structure you are palpating. Report tissue quality — tone, temperature, edema, fibrosis, or guarding.', keywords: ['palpating', 'muscle', 'tone', 'temperature', 'edema', 'fibrosis', 'guarding', 'spasm'] },
      { id: 10, label: 'Trigger Points', prompt: 'Identify and call trigger points as you locate them. State the muscle, the referral pattern if present, and the client response — local twitch, referred pain, or reproduction of symptoms.', keywords: ['trigger', 'point', 'referral', 'twitch', 'referred', 'reproduction', 'active', 'latent'] },
      { id: 11, label: 'Joint Assessment', prompt: 'Assess joint mobility and tenderness. State the joint, the motion tested, and any findings — restriction, hypermobility, crepitus, or inflammation.', keywords: ['joint', 'mobility', 'tenderness', 'restriction', 'crepitus', 'inflammation', 'hypermobile'] },
    ]
  },
  {
    phase: 'DIFFERENTIAL CHECK',
    steps: [
      { id: 12, label: 'Rule-Outs', prompt: 'ΛΛLIYΛH will suggest conditions to rule out based on your findings. Confirm each with yes or no.', keywords: ['rule', 'out', 'confirm', 'yes', 'no', 'negative', 'positive', 'exclude'] },
      { id: 13, label: 'Special Tests', prompt: 'Perform any indicated special orthopedic tests. State the test name and result — positive or negative.', keywords: ['test', 'positive', 'negative', 'orthopedic', 'special', 'result'] },
    ]
  },
  {
    phase: 'TREATMENT PLAN',
    steps: [
      { id: 14, label: 'Treatment Goals', prompt: 'State the primary treatment goals for this session — pain reduction, mobility improvement, neuromuscular re-education, or other.', keywords: ['goal', 'reduce', 'improve', 'treat', 'session', 'objective', 'target'] },
      { id: 15, label: 'Techniques', prompt: 'State the techniques you will apply — effleurage, petrissage, trigger point release, myofascial release, passive stretch, or other. State the region and expected duration.', keywords: ['technique', 'effleurage', 'petrissage', 'trigger', 'myofascial', 'stretch', 'release'] },
    ]
  }
]

const ALL_STEPS = PROTOCOL.flatMap(p => p.steps.map(s => ({ ...s, phase: p.phase })))

// ── CONFIRMATION CHIME ─────────────────────────────────────
function playChime(type = 'confirm') {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  if (type === 'confirm') {
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.start(); osc.stop(ctx.currentTime + 0.4)
  } else if (type === 'error') {
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.start(); osc.stop(ctx.currentTime + 0.3)
  } else if (type === 'ready') {
    [528, 660, 880].forEach((f, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain()
      o.connect(g); g.connect(ctx.destination)
      o.frequency.value = f
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12)
      g.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.12 + 0.05)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3)
      o.start(ctx.currentTime + i * 0.12)
      o.stop(ctx.currentTime + i * 0.12 + 0.3)
    })
  }
}

// ── SPEAK (TTS) ────────────────────────────────────────────
function speak(text, onEnd) {
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.rate = 0.92; utt.pitch = 1.05; utt.volume = 1
  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find(v => v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Moira') || (v.lang === 'en-US' && v.localService))
  if (preferred) utt.voice = preferred
  if (onEnd) utt.onend = onEnd
  window.speechSynthesis.speak(utt)
}

// ── MAIN DASHBOARD ─────────────────────────────────────────
export default function Dashboard() {
  const [screen, setScreen] = useState('access') // access|liability|calibration|bluetooth|prechecks|session|review
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [therapistName, setTherapistName] = useState('')
  const [liabilitySigned, setLiabilitySigned] = useState(false)
  const [signatureName, setSignatureName] = useState('')
  const [clientNumber, setClientNumber] = useState('')
  const [icd10Enabled, setIcd10Enabled] = useState(false)
  const [btStatus, setBtStatus] = useState('disconnected') // disconnected|connecting|connected
  const [btDevice, setBtDevice] = useState(null)
  const [micStatus, setMicStatus] = useState('idle')
  const [calibrationStep, setCalibrationStep] = useState(0)
  const [calibrationDone, setCalibrationDone] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [transcript, setTranscript] = useState([])
  const [pendingLog, setPendingLog] = useState(null)
  const [soapNote, setSoapNote] = useState({ S: [], O: [], A: [], P: [] })
  const [icdCodes, setIcdCodes] = useState([])
  const [differentials, setDifferentials] = useState([])
  const [sessionLogs, setSessionLogs] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [aaliyahMsg, setAaliyahMsg] = useState('')
  const [sessionId] = useState(() => 'SS-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000))
  const [sessionActive, setSessionActive] = useState(false)
  const [processingVoice, setProcessingVoice] = useState(false)
  const [activeTab, setActiveTab] = useState('guide')
  const [billingAlerts, setBillingAlerts] = useState([])
  const [suggestedChecks, setSuggestedChecks] = useState([])
  const [sessionPaused, setSessionPaused] = useState(false)
  const [lastLoggedEntry, setLastLoggedEntry] = useState(null)

  const recognitionRef = useRef(null)
  const transcriptRef = useRef([])
  const stepRef = useRef(0)
  const pendingRef = useRef(null)

  const CALIBRATION_PHRASES = [
    'ΛΛLIYΛH begin session',
    'Client reports pain in the lower back',
    'Palpating the lumbar paraspinals I notice hypertonicity',
    'Confirm log',
    'End session and generate SOAP note'
  ]

  // ── ACCESS CHECK ─────────────────────────────────────────
  async function checkAccess() {
    setEmailError('')
    if (!email.includes('@')) { setEmailError('Enter a valid email address.'); return }
    const { data, error } = await supabase.from('beta_access').select('name, approved').eq('email', email.toLowerCase()).single()
    if (error || !data) { setEmailError('Email not found in beta. Request access at somasyncai.com'); return }
    if (!data.approved) { setEmailError('Your access is pending approval. Check back soon.'); return }
    setTherapistName(data.name || email.split('@')[0])
    setScreen('liability')
  }

  // ── GENERATE CLIENT NUMBER ──────────────────────────────
  useEffect(() => {
    if (screen === 'prechecks') {
      const num = 'SS-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 90000) + 10000)
      setClientNumber(num)
    }
  }, [screen])

  // ── BLUETOOTH ────────────────────────────────────────────
  async function connectBluetooth() {
    setBtStatus('connecting')
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'generic_access']
      })
      setBtDevice(device)
      setBtStatus('connected')
      speak('Bluetooth device connected. ' + device.name + '. Ready to proceed.')
      playChime('ready')
    } catch (e) {
      setBtStatus('disconnected')
    }
  }

  // ── SPEECH RECOGNITION SETUP ─────────────────────────────
  const setupRecognition = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return null
    const r = new SR()
    r.continuous = true
    r.interimResults = true
    r.lang = 'en-US'
    r.maxAlternatives = 3
    return r
  }, [])

  // ── VOICE CALIBRATION ────────────────────────────────────
  function startCalibration() {
    const r = setupRecognition()
    if (!r) { alert('Speech recognition not supported on this browser. Use Chrome.'); return }
    recognitionRef.current = r
    speak(CALIBRATION_PHRASES[0], () => {
      r.start()
      setMicStatus('listening')
    })
    r.onresult = (e) => {
      const last = e.results[e.results.length - 1]
      if (last.isFinal) {
        const heard = last[0].transcript.toLowerCase()
        playChime('confirm')
        r.stop()
        const next = calibrationStep + 1
        if (next >= CALIBRATION_PHRASES.length) {
          setCalibrationDone(true)
          setMicStatus('idle')
          speak('Voice calibration complete. ΛΛLIYΛH is now tuned to your voice. Proceed to session setup.')
          playChime('ready')
        } else {
          setCalibrationStep(next)
          setTimeout(() => {
            speak(CALIBRATION_PHRASES[next], () => { r.start(); setMicStatus('listening') })
          }, 800)
        }
      }
    }
    r.onerror = () => { setMicStatus('error') }
  }

  // ── AALIYAH MESSAGE ───────────────────────────────────────
  function setAaliyah(msg, alsoSpeak = true) {
    setAaliyahMsg(msg)
    if (alsoSpeak) speak(msg)
  }

  // ── SESSION START ─────────────────────────────────────────
  function startSession() {
    setSessionActive(true)
    stepRef.current = 0
    setCurrentStep(0)
    playChime('ready')
    const intro = `ΛΛLIYΛH online. Session ID ${sessionId}. ${icd10Enabled ? 'ICD-10 documentation enabled.' : ''} Beginning assessment protocol. Step 1 — ${ALL_STEPS[0].label}. ${ALL_STEPS[0].prompt}`
    setAaliyah(intro, true)
    startListening()
  }

  // ── LISTENING ENGINE ─────────────────────────────────────
  function startListening() {
    const r = setupRecognition()
    if (!r) return
    recognitionRef.current = r
    r.continuous = true
    r.interimResults = false
    setIsListening(true)
    setMicStatus('listening')

    r.onresult = async (e) => {
      const result = e.results[e.results.length - 1]
      if (!result.isFinal) return
      const text = result[0].transcript.trim()
      handleVoiceInput(text)
    }

    r.onend = () => {
      if (sessionActive && isListening) {
        setTimeout(() => { try { r.start() } catch(e) {} }, 300)
      }
    }

    r.onerror = (e) => {
      if (e.error !== 'no-speech') setMicStatus('error')
    }

    try { r.start() } catch(e) {}
  }

  // ── VOICE COMMAND HANDLER ─────────────────────────────────
  async function handleVoiceInput(text) {
    const lower = text.toLowerCase()
    transcriptRef.current = [...transcriptRef.current, { text, time: new Date().toLocaleTimeString(), step: stepRef.current }]
    setTranscript([...transcriptRef.current])

    // CONFIRM command
    if (lower.includes('confirm') || lower.includes('correct') || lower.includes('log it') || lower.includes('that\'s right')) {
      if (pendingRef.current) {
        playChime('confirm')
        const logged = pendingRef.current
        setSessionLogs(prev => [...prev, logged])
        setLastLoggedEntry(logged.text)
        await processWithAI(logged)
        pendingRef.current = null
        setPendingLog(null)
        setAaliyah('Logged. Continue.')
      }
      return
    }

    // REDO command
    if (lower.includes('redo') || lower.includes('delete that') || lower.includes('scratch that')) {
      pendingRef.current = null
      setPendingLog(null)
      playChime('error')
      setAaliyah('Last entry cleared. Please repeat your observation.')
      return
    }

    // NEXT STEP command
    if (lower.includes('next step') || lower.includes('move on') || lower.includes('continue')) {
      advanceStep()
      return
    }

    // END SESSION
    if (lower.includes('end session') || lower.includes('generate soap') || lower.includes('finish session')) {
      endSession()
      return
    }

    // ── PAUSE SESSION ──
    if (lower.includes('pause session')) {
      setIsListening(false)
      setSessionPaused(true)
      if (recognitionRef.current) { try { recognitionRef.current.stop() } catch(e) {} }
      playChime('error')
      setAaliyah('Session paused. Say resume session to continue.', true)
      return
    }

    // ── RESUME SESSION ──
    if (lower.includes('resume session')) {
      setSessionPaused(false)
      setIsListening(true)
      startListening()
      playChime('ready')
      setAaliyah('Session resumed. ' + (ALL_STEPS[stepRef.current]?.label || '') + '. Continue.', true)
      return
    }

    // ── RECALL LAST ENTRY ──
    if (lower.includes('recall last entry') || lower.includes('what did you log') || lower.includes('read last entry')) {
      if (lastLoggedEntry) {
        setAaliyah('Last logged entry: ' + lastLoggedEntry, true)
      } else {
        setAaliyah('No entries have been logged yet this session.', true)
      }
      return
    }

    // ── OVERVIEW COMMANDS ──
    if (lower.includes('overview of subjective') || lower.includes('overview subjective')) {
      const entries = soapNote.S
      if (entries.length === 0) { setAaliyah('No subjective findings logged yet.', true); return }
      setAaliyah('Subjective overview. ' + entries.join('. '), true)
      return
    }
    if (lower.includes('overview of objective') || lower.includes('overview objective')) {
      const entries = soapNote.O
      if (entries.length === 0) { setAaliyah('No objective findings logged yet.', true); return }
      setAaliyah('Objective overview. ' + entries.join('. '), true)
      return
    }
    if (lower.includes('overview of assessment') || lower.includes('overview assessment')) {
      const entries = soapNote.A
      if (entries.length === 0) { setAaliyah('No assessment findings logged yet.', true); return }
      setAaliyah('Assessment overview. ' + entries.join('. '), true)
      return
    }
    if (lower.includes('overview of plan') || lower.includes('overview plan')) {
      const entries = soapNote.P
      if (entries.length === 0) { setAaliyah('No plan entries logged yet.', true); return }
      setAaliyah('Plan overview. ' + entries.join('. '), true)
      return
    }
    if (lower.includes('overview') && !lower.includes('overview of')) {
      const total = Object.values(soapNote).flat().length
      const msg = `Session overview. ${total} total entries logged. Subjective: ${soapNote.S.length}. Objective: ${soapNote.O.length}. Assessment: ${soapNote.A.length}. Plan: ${soapNote.P.length}. ICD-10 codes: ${icdCodes.length}. ${billingAlerts.length > 0 ? billingAlerts.length + ' billing alerts pending.' : 'No billing alerts.'}`
      setAaliyah(msg, true)
      return
    }

    // ── BILLING STATUS CHECK ──
    if (lower.includes('billing status') || lower.includes('check billing') || lower.includes('documentation status')) {
      const total = Object.values(soapNote).flat().length
      if (total < 4) {
        setAaliyah('Documentation alert. Insufficient entries to support billing codes. You need at minimum: chief complaint, objective findings, at least one ICD-10 supported diagnosis, and a treatment plan.', true)
        playChime('error')
      } else if (billingAlerts.length > 0) {
        setAaliyah('Billing alerts active. ' + billingAlerts[billingAlerts.length - 1].missing, true)
        playChime('error')
      } else {
        setAaliyah('Documentation appears sufficient for current billing codes. Continue with treatment plan.', true)
        playChime('confirm')
      }
      return
    }

    // ── WHAT SHOULD I CHECK ──
    if (lower.includes('what should i check') || lower.includes('what else') || lower.includes('suggested checks')) {
      if (suggestedChecks.length > 0) {
        setAaliyah('Suggested checks based on current findings. ' + suggestedChecks.join('. '), true)
      } else {
        setAaliyah('No additional checks suggested at this time. Continue with current step.', true)
      }
      return
    }

    // Regular clinical observation — queue for confirmation
    pendingRef.current = { text, step: stepRef.current, stepLabel: ALL_STEPS[stepRef.current]?.label, phase: ALL_STEPS[stepRef.current]?.phase }
    setPendingLog({ text, stepLabel: ALL_STEPS[stepRef.current]?.label })
    setAaliyah(`I heard: "${text}" — Say confirm to log, or redo to re-record.`, true)
  }

  // ── ADVANCE STEP ─────────────────────────────────────────
  function advanceStep() {
    const next = stepRef.current + 1
    if (next >= ALL_STEPS.length) {
      endSession()
      return
    }
    stepRef.current = next
    setCurrentStep(next)
    const step = ALL_STEPS[next]
    setAaliyah(`Step ${step.id} — ${step.label}. ${step.prompt}`, true)
  }

  // ── AI PROCESSING ─────────────────────────────────────────
  async function processWithAI(log) {
    setProcessingVoice(true)
    try {
      const sessionContext = sessionLogs.slice(-5).map(l => l.text).join(' | ')
      const prompt = `You are ΛΛLIYΛH — a specialized clinical documentation AI for neuromuscular therapy, manual therapy, and somatic medicine. You were trained on peer-reviewed research from Stanford Medicine, NIH, Johns Hopkins, Mayo Clinic, WHO, ABMP, AMTA, and the global manual therapy literature. Your anatomical and physiological knowledge spans:

NEUROMUSCULAR: Motor unit physiology, neuromuscular junction, proprioception, spindle afferents, Golgi tendon organs, alpha-gamma coactivation, trigger point neurophysiology (Simons, Travell & Simons), referred pain patterns, central sensitization, wind-up, allodynia, hyperalgesia.

ANATOMY: All 600+ skeletal muscles with origin, insertion, action, innervation. Fascial planes (superficial, deep, visceral). Bony landmarks, joint capsules, ligamentous structures. Dermatomes, myotomes, sclerotomes. Lymphatic drainage pathways.

PATHOLOGY: Myofascial pain syndrome, fibromyalgia, tendinopathy, enthesopathy, bursitis, adhesive capsulitis, disc herniation, spinal stenosis, spondylosis, scoliosis, kyphosis, lordosis, spondylolisthesis, facet syndrome, piriformis syndrome, TOS, carpal tunnel, cubital tunnel, meralgia paresthetica, plantar fasciitis, ITB syndrome.

BIOPSYCHOSOCIAL: Yellow flags, fear-avoidance, pain catastrophizing, kinesiophobia, central sensitization inventory, ACE scores, adverse childhood experiences and somatic expression, psychosocial screening.

EASTERN MEDICINE: TCM meridian theory as it relates to myofascial chains, acupuncture point correlations with trigger points, Qi stagnation and its somatic correlates, tuina, shiatsu.

DOCUMENTATION STANDARDS: ICD-10-CM official coding guidelines, CPT codes for massage therapy and neuromuscular therapy (97010, 97012, 97018, 97022, 97032, 97033, 97034, 97035, 97036, 97110, 97112, 97124, 97140, 97150, 97530, 97750, 97755, 97760, 97761, 97762, 99201-99215). SOAP note format per ABMP and AMTA standards. Medicare/Medicaid documentation requirements. Workers compensation documentation in California.

CRITICAL RULES — NEVER VIOLATE:
1. NEVER invent anatomy, codes, or findings not present in the therapist input
2. If the input is ambiguous, state what additional information is needed — do not assume
3. ICD-10 codes must follow official format: letter + 2 digits + decimal + up to 4 more characters (e.g. M54.50, not M54.5x)
4. Confidence scores must reflect actual documentation completeness — do not inflate
5. If findings are insufficient to support a code, flag it explicitly in missing_for_billing
6. Every differential must be anatomically plausible given the specific findings stated
7. Do not add clinical findings the therapist did not observe or report

CURRENT SESSION CONTEXT (last 5 logged entries for continuity):
${sessionContext}

CURRENT PHASE: ${log.phase}
CURRENT STEP: ${log.stepLabel}
THERAPIST INPUT: "${log.text}"

Respond ONLY with this JSON structure — no markdown, no preamble:
{
  "soap_section": "S" or "O" or "A" or "P",
  "soap_entry": "Precise clinical sentence using correct anatomical terminology. Must reflect only what was stated.",
  "icd_codes": [
    {
      "code": "M54.50",
      "description": "Low back pain, unspecified",
      "confidence": 82,
      "clinical_basis": "Therapist reported lumbar hypertonicity with forward flexion restriction",
      "format_valid": true
    }
  ],
  "missing_for_billing": "Describe what additional documentation is needed to support these codes at 90%+ confidence, or empty string if sufficient",
  "differentials": ["Piriformis syndrome — rule out with FAIR test", "L4-L5 disc herniation — check dermatomal pattern"],
  "suggested_checks": ["Palpate piriformis for active trigger point", "Assess hip internal rotation ROM"],
  "aaliyah_response": "Spoken response to therapist — what to check next, or alert about insufficient documentation. Max 2 sentences. Speak like a clinical colleague.",
  "billing_alert": true or false
}`

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, mode: 'clinical', threadId: null })
      })
      const data = await res.json()
      const raw = data.reply || ''
      try {
        const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
        if (parsed.soap_entry) {
          setSoapNote(prev => ({
            ...prev,
            [parsed.soap_section]: [...(prev[parsed.soap_section] || []), parsed.soap_entry]
          }))
        }
        if (parsed.icd_codes?.length) {
          setIcdCodes(prev => {
            const existing = prev.map(c => c.code)
            const newCodes = parsed.icd_codes.filter(c => !existing.includes(c.code))
            return [...prev, ...newCodes]
          })
        }
        if (parsed.differentials?.length) {
          setDifferentials(prev => [...new Set([...prev, ...parsed.differentials])])
        }
        // Billing alert — insufficient documentation
        if (parsed.billing_alert && parsed.missing_for_billing) {
          setBillingAlerts(prev => [...prev, {
            step: log.stepLabel,
            missing: parsed.missing_for_billing,
            codes: parsed.icd_codes?.map(c => c.code).join(', ') || ''
          }])
          // Speak the alert
          const alertMsg = 'Documentation alert. ' + parsed.missing_for_billing
          setAaliyah(alertMsg, true)
          playChime('error')
        } else if (parsed.aaliyah_response) {
          setAaliyah(parsed.aaliyah_response, true)
        }
        // Suggested checks
        if (parsed.suggested_checks?.length) {
          setSuggestedChecks(parsed.suggested_checks)
        }
      } catch (e) {}
    } catch (e) {}
    setProcessingVoice(false)
  }

  // ── END SESSION ───────────────────────────────────────────
  async function endSession() {
    setIsListening(false)
    if (recognitionRef.current) { try { recognitionRef.current.stop() } catch(e) {} }
    playChime('ready')
    speak('Session complete. Generating your SOAP note and ICD-10 documentation now.')

    // Save to Supabase anonymously
    await supabase.from('sessions').insert({
      session_id: sessionId,
      soap_note: soapNote,
      icd_codes: icdCodes,
      transcript: transcriptRef.current,
      logs: sessionLogs,
      icd10_enabled: icd10Enabled,
      created_at: new Date().toISOString()
    })

    setScreen('review')
  }

  // ── GENERATE PDF ─────────────────────────────────────────
  function downloadPDF() {
    const content = `SOMASYNC AI — SESSION DOCUMENTATION
Session ID: ${sessionId}
Date: ${new Date().toLocaleDateString()}
Generated by: ΛΛLIYΛH.IO
BETA — For testing purposes only. Requires clinician review.

══════════════════════════════════════
SOAP NOTE
══════════════════════════════════════

SUBJECTIVE:
${soapNote.S.map((s, i) => `${i + 1}. ${s}`).join('\n') || 'No subjective findings logged.'}

OBJECTIVE:
${soapNote.O.map((s, i) => `${i + 1}. ${s}`).join('\n') || 'No objective findings logged.'}

ASSESSMENT:
${soapNote.A.map((s, i) => `${i + 1}. ${s}`).join('\n') || 'No assessment findings logged.'}

PLAN:
${soapNote.P.map((s, i) => `${i + 1}. ${s}`).join('\n') || 'No plan logged.'}

══════════════════════════════════════
ICD-10 CODES
══════════════════════════════════════
${icdCodes.map(c => `${c.code} — ${c.description} (${c.confidence}% confidence)`).join('\n') || 'No ICD-10 codes logged.'}

══════════════════════════════════════
DISCLAIMER
══════════════════════════════════════
This document was generated by ΛΛLIYΛH.IO SomaSync AI during Phase 1 beta testing.
All outputs require review and approval by a licensed clinician before clinical use.
Not for billing, insurance, or medical record use without clinician verification.
© 2026 ΛΛLIYΛH.IO · SomaSync AI`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `SomaSync-${sessionId}-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── STYLES ───────────────────────────────────────────────
  const S = `
   @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#080808;
  --ink:#f0ede8;
  --muted:rgba(240,237,232,0.45);
  --dim:rgba(240,237,232,0.18);
  --grn:#00e89a;
  --grn2:#00c47f;
  --blue:#3b9eff;
  --blue2:#1a7ee0;
  --blue-glow:rgba(59,158,255,0.25);
  --grn-glow:rgba(0,232,154,0.2);
  --red:#ff453a;
  --orange:#ff9f0a;
  --purple:#bf5af2;
  --border:rgba(255,255,255,0.07);
  --border2:rgba(255,255,255,0.12);
  --card:rgba(255,255,255,0.03);
}
body{font-family:'Manrope',sans-serif;background:var(--bg);color:var(--ink);min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
input,textarea,select{font-family:inherit;}
button{font-family:inherit;cursor:pointer;}
 
/* ── SCREEN ── */
.screen{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;position:relative;overflow:hidden;background:var(--bg);}
.screen::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(0,232,154,0.05),transparent 60%),radial-gradient(ellipse 60% 80% at 100% 100%,rgba(59,158,255,0.04),transparent 60%);pointer-events:none;}
.card{background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:20px;padding:40px;width:100%;max-width:480px;position:relative;overflow:hidden;backdrop-filter:blur(12px);}
.card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.03) 0%,transparent 60%);pointer-events:none;}
.card>*{position:relative;z-index:1;}
 
/* ── LOGO ── */
.dash-logo{display:flex;align-items:center;gap:10px;margin-bottom:32px;}
.dash-logo img{width:34px;height:34px;object-fit:contain;filter:drop-shadow(0 0 8px rgba(59,158,255,0.4));}
.dash-logo-text{font-family:'Syne',sans-serif;font-weight:800;font-size:0.95rem;letter-spacing:-0.03em;}
.dash-logo-text span{color:var(--grn);}
.dash-logo-badge{font-size:9px;font-weight:700;background:rgba(255,159,10,0.12);color:var(--orange);border:1px solid rgba(255,159,10,0.2);border-radius:6px;padding:2px 8px;letter-spacing:0.08em;text-transform:uppercase;margin-left:4px;}
 
/* ── TYPOGRAPHY ── */
.screen-title{font-family:'Syne',sans-serif;font-size:clamp(20px,4vw,26px);font-weight:800;letter-spacing:-0.04em;margin-bottom:8px;}
.screen-sub{font-size:13px;color:var(--muted);line-height:1.7;margin-bottom:28px;}
.step-num{font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--blue);margin-bottom:8px;}
 
/* ── INPUTS ── */
.field{margin-bottom:18px;}
.field label{display:block;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--dim);margin-bottom:8px;}
.field input,.field textarea,.field select{width:100%;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:12px;padding:13px 16px;font-size:14px;color:var(--ink);outline:none;transition:all 0.2s;}
.field input:focus,.field textarea:focus{border-color:rgba(0,232,154,0.35);background:rgba(255,255,255,0.06);box-shadow:0 0 0 3px rgba(0,232,154,0.08);}
.field input::placeholder{color:var(--dim);}
.error-msg{font-size:12px;color:var(--red);margin-top:6px;padding:8px 12px;background:rgba(255,69,58,0.08);border-radius:8px;border:1px solid rgba(255,69,58,0.18);}
 
/* ── BUTTONS ── */
.btn-primary{width:100%;background:var(--blue);color:#fff;border:none;padding:15px;border-radius:12px;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;letter-spacing:0.02em;transition:all 0.2s;box-shadow:0 4px 20px var(--blue-glow);}
.btn-primary:hover{background:var(--blue2);transform:translateY(-1px);box-shadow:0 8px 28px var(--blue-glow);}
.btn-primary:disabled{opacity:0.35;transform:none;cursor:not-allowed;}
.btn-secondary{width:100%;background:rgba(255,255,255,0.05);border:1px solid var(--border2);color:var(--ink);padding:13px;border-radius:12px;font-size:13px;font-weight:600;transition:all 0.2s;margin-top:10px;}
.btn-secondary:hover{background:rgba(255,255,255,0.08);}
 
/* ── STATUS ROWS ── */
.status-row{display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--card);border:1px solid var(--border);border-radius:12px;margin-bottom:10px;}
.status-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.status-dot.green{background:var(--grn);box-shadow:0 0 8px var(--grn-glow);animation:pulseDot 2s ease-in-out infinite;}
.status-dot.orange{background:var(--orange);}
.status-dot.red{background:var(--red);}
.status-dot.idle{background:rgba(255,255,255,0.15);}
@keyframes pulseDot{0%,100%{box-shadow:0 0 4px var(--grn-glow);}50%{box-shadow:0 0 14px rgba(0,232,154,0.4);}}
.status-label{font-size:13px;font-weight:600;color:var(--ink);}
.status-sub{font-size:11px;color:var(--dim);margin-left:auto;}
 
/* ── CALIBRATION ── */
.cal-phrase{background:rgba(0,232,154,0.05);border:1px solid rgba(0,232,154,0.12);border-radius:12px;padding:14px 18px;font-size:14px;color:var(--grn);margin-bottom:12px;font-style:italic;transition:all 0.2s;}
.cal-phrase.done{opacity:0.3;color:var(--muted);border-color:var(--border);background:transparent;text-decoration:line-through;}
.cal-phrase.active{animation:phraseGlow 1.5s ease-in-out infinite;border-color:rgba(0,232,154,0.3);}
@keyframes phraseGlow{0%,100%{box-shadow:none;}50%{box-shadow:0 0 20px rgba(0,232,154,0.15);}}
.mic-ring{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--grn2),var(--blue));display:flex;align-items:center;justify-content:center;margin:20px auto;box-shadow:0 0 32px var(--grn-glow);animation:micPulse 1.5s ease-in-out infinite;}
@keyframes micPulse{0%,100%{transform:scale(1);box-shadow:0 0 24px var(--grn-glow);}50%{transform:scale(1.05);box-shadow:0 0 48px rgba(0,232,154,0.3);}}
 
/* ── SESSION SCREEN ── */
.session-screen{min-height:100vh;min-height:100dvh;display:grid;grid-template-rows:auto auto 1fr auto;background:var(--bg);overflow:hidden;}
.session-header{padding:12px 20px;background:rgba(255,255,255,0.02);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10;backdrop-filter:blur(20px);}
.session-id-badge{font-size:10px;font-weight:700;color:var(--grn);background:rgba(0,232,154,0.08);border:1px solid rgba(0,232,154,0.18);border-radius:8px;padding:3px 10px;letter-spacing:0.06em;}
.session-body{display:flex;flex-direction:column;overflow-y:auto;-webkit-overflow-scrolling:touch;padding-bottom:80px;}
.session-panel{padding:16px 20px;border-bottom:1px solid var(--border);}
.session-panel:last-child{border-bottom:none;}
.panel-title{font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--dim);margin-bottom:14px;display:flex;align-items:center;gap:8px;}
.panel-title::after{content:'';flex:1;height:1px;background:var(--border);}
 
/* AALIYAH banner */
.aaliyah-banner{background:linear-gradient(135deg,rgba(0,232,154,0.07),rgba(59,158,255,0.04));border:1px solid rgba(0,232,154,0.15);border-radius:16px;padding:18px 20px;margin-bottom:14px;}
.aaliyah-name{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--grn);margin-bottom:8px;display:flex;align-items:center;gap:6px;}
.aaliyah-name::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--grn);box-shadow:0 0 6px var(--grn);animation:pulseDot 1.5s ease-in-out infinite;}
.aaliyah-text{font-size:15px;color:rgba(255,255,255,0.88);line-height:1.65;}
 
/* Current step */
.current-step-card{background:rgba(0,232,154,0.06);border:1px solid rgba(0,232,154,0.2);border-radius:16px;padding:18px 20px;margin-bottom:12px;}
.current-step-num{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--grn);margin-bottom:6px;}
.current-step-title{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;letter-spacing:-0.03em;color:var(--ink);margin-bottom:8px;}
.current-step-prompt{font-size:13px;color:var(--muted);line-height:1.65;}
 
/* Mic orb */
.mic-orb{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--grn2),var(--blue));display:flex;align-items:center;justify-content:center;box-shadow:0 0 40px var(--grn-glow);flex-shrink:0;}
.mic-orb.active{animation:micPulse 1.4s ease-in-out infinite;}
.mic-orb.idle{background:rgba(255,255,255,0.06);box-shadow:none;}
 
/* Phase pills */
.phase-pills{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;}
.phase-pill{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:5px 12px;border-radius:100px;border:1px solid var(--border);color:var(--dim);}
.phase-pill.active{background:rgba(0,232,154,0.08);border-color:rgba(0,232,154,0.25);color:var(--grn);}
.phase-pill.done{background:rgba(59,158,255,0.06);border-color:rgba(59,158,255,0.2);color:var(--blue);}
 
/* Transcript */
.transcript-entry{padding:10px 14px;border-radius:10px;margin-bottom:8px;border-left:3px solid transparent;font-size:13px;line-height:1.65;}
.transcript-entry.logged{background:rgba(0,232,154,0.05);border-color:var(--grn);color:rgba(255,255,255,0.8);}
.transcript-entry.pending{background:rgba(255,159,10,0.05);border-color:var(--orange);color:rgba(255,255,255,0.8);}
.transcript-time{font-size:10px;color:var(--dim);margin-bottom:3px;}
 
/* ICD + SOAP */
.icd-badge{display:flex;align-items:center;gap:10px;background:rgba(0,232,154,0.06);border:1px solid rgba(0,232,154,0.15);border-radius:12px;padding:12px 14px;margin-bottom:8px;}
.icd-code{font-size:12px;font-weight:700;color:var(--grn);flex-shrink:0;}
.icd-desc{font-size:12px;color:var(--muted);flex:1;}
.icd-conf{font-size:10px;color:var(--dim);flex-shrink:0;}
.soap-label{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--grn);margin-bottom:8px;}
.soap-entry{font-size:13px;color:rgba(255,255,255,0.75);padding:10px 14px;background:var(--card);border:1px solid var(--border);border-radius:10px;margin-bottom:8px;line-height:1.65;}
 
/* Confirm bar */
.confirm-bar{position:fixed;bottom:0;left:0;right:0;background:rgba(8,8,8,0.95);border-top:1px solid rgba(255,159,10,0.25);padding:16px 20px 28px;display:flex;flex-direction:column;gap:10px;z-index:20;backdrop-filter:blur(20px);}
.pending-text{font-size:14px;color:var(--ink);font-style:italic;line-height:1.5;}
.confirm-buttons{display:flex;gap:10px;}
.btn-confirm{flex:1;background:var(--grn);color:#080808;border:none;padding:16px;border-radius:12px;font-family:'Syne',sans-serif;font-size:15px;font-weight:800;min-height:52px;}
.btn-redo{flex:1;background:rgba(255,69,58,0.1);border:1px solid rgba(255,69,58,0.25);color:var(--red);padding:16px;border-radius:12px;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;min-height:52px;}
 
/* Tabs */
.session-tabs{display:flex;background:rgba(255,255,255,0.02);border-bottom:1px solid var(--border);position:sticky;top:57px;z-index:9;}
.session-tab{flex:1;padding:12px 8px;font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--dim);border:none;background:none;cursor:pointer;border-bottom:2px solid transparent;transition:all 0.2s;}
.session-tab.active{color:var(--grn);border-bottom-color:var(--grn);}
 
/* Billing + suggestions */
.billing-alert{background:rgba(255,69,58,0.06);border:1px solid rgba(255,69,58,0.2);border-radius:14px;padding:16px;margin-bottom:14px;}
.suggest-box{background:rgba(59,158,255,0.05);border:1px solid rgba(59,158,255,0.15);border-radius:14px;padding:14px;margin-bottom:14px;}
 
/* BT orb */
.bt-orb{width:96px;height:96px;border-radius:50%;background:rgba(59,158,255,0.08);border:1px solid rgba(59,158,255,0.2);display:flex;align-items:center;justify-content:center;margin:24px auto;font-size:40px;}
.bt-orb.connecting{animation:micPulse 1s ease-in-out infinite;}
.bt-orb.connected{background:rgba(0,232,154,0.08);border-color:rgba(0,232,154,0.25);}
 
/* Liability */
.liability-scroll{max-height:280px;overflow-y:auto;background:rgba(0,0,0,0.2);border:1px solid var(--border);border-radius:12px;padding:18px;font-size:12px;color:var(--muted);line-height:1.8;margin-bottom:20px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.08) transparent;}
.checkbox-row{display:flex;align-items:flex-start;gap:12px;margin-bottom:16px;}
.checkbox-row input[type=checkbox]{width:18px;height:18px;margin-top:2px;accent-color:var(--grn);flex-shrink:0;}
.checkbox-row label{font-size:13px;color:var(--muted);line-height:1.6;}
 
/* Review */
.review-section{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:22px;margin-bottom:14px;}
.review-section-title{font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--grn);margin-bottom:14px;}
.review-soap-s{border-left:3px solid var(--blue);}
.review-soap-o{border-left:3px solid var(--grn);}
.review-soap-a{border-left:3px solid rgba(191,90,242,0.8);}
.review-soap-p{border-left:3px solid rgba(255,159,10,0.8);}
.editable{width:100%;background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:10px;padding:12px;color:var(--ink);font-size:13px;font-family:'Manrope',sans-serif;line-height:1.7;min-height:80px;resize:vertical;outline:none;}
.editable:focus{border-color:rgba(0,232,154,0.3);}
 
/* Responsive */
@media(min-width:900px){
  .session-body{flex-direction:row;}
  .session-panel{flex:1;overflow-y:auto;max-height:calc(100vh - 100px);border-bottom:none;border-right:1px solid var(--border);}
  .session-panel:last-child{border-right:none;}
  .confirm-bar{position:sticky;bottom:0;padding-bottom:16px;}
}
  `

  // ── RENDER ───────────────────────────────────────────────

  const LogoHeader = () => (
    <div className="dash-logo">
      <img src="/Aaliyah-logo.png" alt="ΛΛLIYΛH" onError={e => e.target.style.display='none'} />
      <div className="dash-logo-text"><span>ΛΛLIYΛH</span>.IO · SomaSync AI</div>
      <div className="dash-logo-badge">Beta</div>
    </div>
  )

  // ACCESS SCREEN
  if (screen === 'access') return (
    <>
      <style>{S}</style>
      <div className="screen">
        <div className="card">
          <LogoHeader />
          <div className="step-num">Beta Access</div>
          <div className="screen-title">Enter Your Email</div>
          <div className="screen-sub">Beta access is by invitation only. Enter the email you registered with to continue.</div>
          <div className="field">
            <label>Email Address</label>
            <input type="email" placeholder="you@practice.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && checkAccess()} />
            {emailError && <div className="error-msg">{emailError}</div>}
          </div>
          <button className="btn-primary" onClick={checkAccess}>Continue →</button>
          <div style={{textAlign:'center',marginTop:16}}>
            <a href="/" style={{fontSize:13,color:'rgba(255,255,255,0.3)',textDecoration:'none'}}>← Back to SomaSync AI</a>
          </div>
        </div>
      </div>
    </>
  )

  // LIABILITY SCREEN
  if (screen === 'liability') return (
    <>
      <style>{S}</style>
      <div className="screen">
        <div className="card" style={{maxWidth:560}}>
          <LogoHeader />
          <div className="step-num">Step 1 of 5 — Agreement</div>
          <div className="screen-title">Beta Tester Agreement</div>
          <div className="screen-sub">Welcome, {therapistName}. Before accessing the SomaSync AI dashboard, please read and sign the following agreement.</div>
          <div className="liability-scroll">
            <strong style={{color:'white',display:'block',marginBottom:12}}>SOMASYNC AI — PHASE 1 BETA TESTER AGREEMENT</strong>
            <strong style={{color:'white',display:'block',marginBottom:8}}>ΛΛLIYΛH.IO · SomaSync AI — Phase 1 Beta Testing Agreement</strong>
            Effective Date: {new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}<br/><br/>
            <strong style={{color:'white'}}>1. Nature of the Software</strong><br/>
            SomaSync AI is an artificial intelligence-assisted clinical documentation tool currently in Phase 1 beta testing. It is not a licensed medical device, not approved for regulated clinical use, and not a substitute for professional clinical judgment. All AI-generated outputs — including SOAP notes, ICD-10 code suggestions, and clinical observations — are experimental and require review by a licensed clinician before any clinical, billing, or insurance use.<br/><br/>
            <strong style={{color:'white'}}>2. No Clinical Reliance</strong><br/>
            You agree that you will not rely on SomaSync AI outputs as final clinical documentation. You assume full professional and legal responsibility for any clinical decisions made in connection with this software.<br/><br/>
            <strong style={{color:'white'}}>3. Data Collection & Privacy (California CCPA Compliance)</strong><br/>
            During beta testing, SomaSync AI collects: (a) anonymized session data identified by a pseudonymous client number only — no client names, dates of birth, or identifying information are stored; (b) your voice audio for calibration purposes, processed locally and not transmitted to third parties; (c) de-identified SOAP notes and ICD-10 code outputs for product improvement. No personal health information (PHI) as defined under HIPAA is intentionally collected. You agree to not input client names, insurance information, or other identifying data into the system during beta testing.<br/><br/>
            <strong style={{color:'white'}}>4. Voice Processing Consent</strong><br/>
            You consent to your voice being recorded and processed during the calibration and session phases solely for the purpose of improving speech recognition accuracy. Voice data is processed on-device where possible and is not shared with third parties.<br/><br/>
            <strong style={{color:'white'}}>5. Accuracy Disclaimer</strong><br/>
            AI-generated documentation may contain errors, omissions, or clinically inaccurate content. ΛΛLIYΛH.IO makes no warranty regarding the accuracy, completeness, or fitness for purpose of any output. Confidence scores are estimates only.<br/><br/>
            <strong style={{color:'white'}}>6. Limitation of Liability</strong><br/>
            To the maximum extent permitted by California law, ΛΛLIYΛH.IO shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of SomaSync AI during beta testing, including but not limited to clinical errors, billing errors, or regulatory violations.<br/><br/>
            <strong style={{color:'white'}}>7. Voluntary Participation</strong><br/>
            Your participation in Phase 1 beta testing is entirely voluntary. You may withdraw at any time by ceasing use of the platform. Withdrawal does not affect your standing or any prior agreements.<br/><br/>
            <strong style={{color:'white'}}>8. Feedback & Intellectual Property</strong><br/>
            Anonymized session data and feedback you provide during beta testing may be used by ΛΛLIYΛH.IO to improve the product. You retain no ownership claim over the software or its outputs. Any feedback you submit grants ΛΛLIYΛH.IO a perpetual, royalty-free license to use such feedback for product development.<br/><br/>
            <strong style={{color:'white'}}>9. Governing Law</strong><br/>
            This agreement is governed by the laws of the State of California. Any disputes shall be resolved in the courts of Stanislaus County, California.<br/><br/>
            By signing below, you acknowledge that you have read, understood, and agree to all terms of this Phase 1 Beta Testing Agreement.
          </div>
          <div className="checkbox-row">
            <input type="checkbox" id="liab" checked={liabilitySigned} onChange={e => setLiabilitySigned(e.target.checked)} />
            <label htmlFor="liab">I have read and agree to the SomaSync AI Phase 1 Beta Testing Agreement. I understand this software is experimental and not approved for regulated clinical use.</label>
          </div>
          <div className="field">
            <label>Type Your Full Name as Signature</label>
            <input type="text" placeholder="Your legal name" value={signatureName} onChange={e => setSignatureName(e.target.value)} />
          </div>
          <button className="btn-primary" disabled={!liabilitySigned || signatureName.length < 3} onClick={async () => {
            await supabase.from('beta_signatures').insert({ email, name: signatureName, signed_at: new Date().toISOString(), agreement_version: 'v1.0-phase1' })
            setScreen('calibration')
          }}>Sign & Continue →</button>
        </div>
      </div>
    </>
  )

  // CALIBRATION SCREEN
  if (screen === 'calibration') return (
    <>
      <style>{S}</style>
      <div className="screen">
        <div className="card">
          <LogoHeader />
          <div className="step-num">Step 2 of 5 — Voice Calibration</div>
          <div className="screen-title">Calibrate Your Voice</div>
          <div className="screen-sub">ΛΛLIYΛH will learn to recognize your voice. Read each phrase aloud clearly when prompted. This takes about 60 seconds.</div>
          {!calibrationDone ? (
            <>
              {CALIBRATION_PHRASES.map((p, i) => (
                <div key={i} className={`cal-phrase ${i < calibrationStep ? 'done' : i === calibrationStep ? 'active' : ''}`}>
                  {i < calibrationStep ? '✓ ' : i === calibrationStep && micStatus === 'listening' ? '🎙 ' : `${i + 1}. `}{p}
                </div>
              ))}
              {micStatus === 'listening' && (
                <div className="mic-ring">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="white"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
              )}
              <button className="btn-primary" onClick={startCalibration} disabled={micStatus === 'listening'}>
                {micStatus === 'listening' ? 'Listening...' : calibrationStep === 0 ? 'Start Calibration' : 'Continue'}
              </button>
            </>
          ) : (
            <>
              <div style={{textAlign:'center',padding:'24px 0'}}>
                <div style={{fontSize:48,marginBottom:16}}>✓</div>
                <div style={{fontSize:18,fontWeight:700,color:'var(--green)',marginBottom:8}}>Voice Calibrated</div>
                <div style={{fontSize:14,color:'var(--text2)'}}>ΛΛLIYΛH is now tuned to your voice.</div>
              </div>
              <button className="btn-primary" onClick={() => setScreen('bluetooth')}>Connect Bluetooth Device →</button>
            </>
          )}
          <button className="btn-secondary" onClick={() => setScreen('bluetooth')}>Skip — Use Device Microphone</button>
        </div>
      </div>
    </>
  )

  // BLUETOOTH SCREEN
  if (screen === 'bluetooth') return (
    <>
      <style>{S}</style>
      <div className="screen">
        <div className="card">
          <LogoHeader />
          <div className="step-num">Step 3 of 5 — Bluetooth</div>
          <div className="screen-title">Connect Your Device</div>
          <div className="screen-sub">Pair your Bluetooth earpiece or audio device. Ensure it's powered on and in pairing mode.</div>
          <div className={`bt-orb ${btStatus}`}>
            {btStatus === 'connected' ? '✓' : '🎧'}
          </div>
          <div className="status-row">
            <div className={`status-dot ${btStatus === 'connected' ? 'green' : btStatus === 'connecting' ? 'orange' : 'idle'}`}></div>
            <div className="status-label">{btStatus === 'connected' ? `Connected — ${btDevice?.name || 'Device'}` : btStatus === 'connecting' ? 'Scanning...' : 'No device connected'}</div>
          </div>
          {btStatus !== 'connected' && (
            <button className="btn-primary" onClick={connectBluetooth} disabled={btStatus === 'connecting'}>
              {btStatus === 'connecting' ? 'Scanning for devices...' : 'Pair Bluetooth Device'}
            </button>
          )}
          <button className="btn-secondary" onClick={() => setScreen('prechecks')}>
            {btStatus === 'connected' ? 'Continue →' : 'Skip — Use Phone Speaker'}
          </button>
        </div>
      </div>
    </>
  )

  // PRE-SESSION CHECKS
  if (screen === 'prechecks') return (
    <>
      <style>{S}</style>
      <div className="screen">
        <div className="card" style={{maxWidth:520}}>
          <LogoHeader />
          <div className="step-num">Step 4 of 5 — Session Setup</div>
          <div className="screen-title">Pre-Session Checklist</div>
          <div className="screen-sub">Review before starting. This session's client ID is assigned below.</div>

          <div className="status-row" style={{marginBottom:8,background:'rgba(48,217,192,0.06)',borderColor:'rgba(48,217,192,0.2)'}}>
            <div className="status-dot green"></div>
            <div>
              <div className="status-label">Client Session ID</div>
              <div style={{fontFamily:'DM Mono',fontSize:13,color:'var(--teal)',marginTop:2}}>{clientNumber}</div>
            </div>
            <div className="status-sub">Pseudonymous — no PII</div>
          </div>

          <div className="status-row">
            <div className={`status-dot ${btStatus === 'connected' ? 'green' : 'idle'}`}></div>
            <div className="status-label">Bluetooth</div>
            <div className="status-sub">{btStatus === 'connected' ? btDevice?.name || 'Connected' : 'Phone microphone'}</div>
          </div>

          <div className="status-row">
            <div className="status-dot green"></div>
            <div className="status-label">ΛΛLIYΛH Voice Engine</div>
            <div className="status-sub">{calibrationDone ? 'Calibrated' : 'Default mode'}</div>
          </div>

          <div className="status-row" style={{cursor:'pointer',userSelect:'none'}} onClick={() => setIcd10Enabled(!icd10Enabled)}>
            <div className={`status-dot ${icd10Enabled ? 'green' : 'idle'}`}></div>
            <div>
              <div className="status-label">ICD-10 Documentation</div>
              <div style={{fontSize:11,color:'var(--text3)',marginTop:2}}>Tap to {icd10Enabled ? 'disable' : 'enable'}</div>
            </div>
            <div style={{marginLeft:'auto',fontSize:20}}>{icd10Enabled ? '☑' : '☐'}</div>
          </div>

          <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid var(--border)',borderRadius:12,padding:16,marginBottom:20,marginTop:8}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'var(--text3)',marginBottom:8}}>Voice Commands</div>
            {[['confirm / correct / log it', 'Log current observation'],['redo / scratch that', 'Clear and re-record'],['next step', 'Advance to next protocol step'],['end session', 'Finish and generate SOAP note']].map(([cmd, desc]) => (
              <div key={cmd} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',fontSize:12}}>
                <span style={{fontFamily:'DM Mono',color:'var(--teal)'}}>{cmd}</span>
                <span style={{color:'var(--text3)'}}>{desc}</span>
              </div>
            ))}
          </div>

          <button className="btn-primary" onClick={startSession}>Start Session — ΛΛLIYΛH Online ▶</button>
        </div>
      </div>
    </>
  )

  // SESSION SCREEN — PHONE FIRST, HANDS FREE
  if (screen === 'session') {
    const currentPhase = ALL_STEPS[currentStep]?.phase || ''
    const completedPhases = [...new Set(ALL_STEPS.slice(0, currentStep).map(s => s.phase))]
    return (
    <>
      <style>{S}</style>
      <div className="session-screen">

        {/* HEADER */}
        <div className="session-header">
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <img src="/Aaliyah-logo.png" alt="" style={{width:24,height:24,objectFit:'contain'}} onError={e=>e.target.style.display='none'} />
            <span style={{fontWeight:700,fontSize:13,letterSpacing:'-0.03em'}}><span style={{background:'linear-gradient(125deg,#30d9c0,#0a84ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>ΛΛLIYΛH</span>.IO</span>
          </div>
          <div className="session-id-badge mono">{clientNumber}</div>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:isListening?'#34c759':'#ff453a',boxShadow:isListening?'0 0 8px rgba(52,199,89,0.6)':''}}></div>
            <span style={{fontSize:11,color:'rgba(255,255,255,0.35)',fontWeight:600}}>{isListening?'LIVE':'PAUSED'}</span>
          </div>
        </div>

        {/* TABS */}
        <div className="session-tabs">
          {[['guide','Guide'],['soap','SOAP'],['icd','ICD-10'],['log','Log']].map(([id,label]) => (
            <button key={id} className={`session-tab ${activeTab===id?'active':''}`} onClick={()=>setActiveTab(id)}>
              {label}{id==='icd'&&icdCodes.length>0&&<span style={{marginLeft:4,background:'var(--teal)',color:'#061412',borderRadius:'50%',width:14,height:14,fontSize:9,fontWeight:800,display:'inline-flex',alignItems:'center',justifyContent:'center'}}>{icdCodes.length}</span>}
            </button>
          ))}
        </div>

        <div className="session-body">

          {/* GUIDE TAB */}
          {activeTab === 'guide' && (
            <div className="session-panel">

              {/* ΛΛLIYΛH speaks here */}
              <div className="aaliyah-banner">
                <div className="aaliyah-name">
                  ΛΛLIYΛH {processingVoice && <span style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginLeft:4}}>· processing...</span>}
                </div>
                <div className="aaliyah-text">{aaliyahMsg || 'Listening — speak your clinical observations.'}</div>
              </div>

              {/* Current step — big and readable */}
              {ALL_STEPS[currentStep] && (
                <div className="current-step-card">
                  <div className="current-step-num">STEP {ALL_STEPS[currentStep].id} of {ALL_STEPS.length} · {ALL_STEPS[currentStep].phase}</div>
                  <div className="current-step-title">{ALL_STEPS[currentStep].label}</div>
                  <div className="current-step-prompt">{ALL_STEPS[currentStep].prompt}</div>
                </div>
              )}

              {/* Phase progress pills */}
              <div className="phase-pills">
                {PROTOCOL.map(p => (
                  <div key={p.phase} className={`phase-pill ${p.phase === currentPhase ? 'active' : completedPhases.includes(p.phase) ? 'done' : ''}`}>
                    {completedPhases.includes(p.phase) ? '✓ ' : ''}{p.phase}
                  </div>
                ))}
              </div>

              {/* Mic status orb */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:20,padding:'20px 0',borderTop:'1px solid var(--border)',marginTop:8}}>
                <div className={`mic-orb ${isListening?'active':'idle'}`}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="white"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:isListening?'var(--green)':'rgba(255,255,255,0.3)',marginBottom:4}}>{isListening?'Listening':'Microphone off'}</div>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.25)',lineHeight:1.5}}>Say <span style={{color:'var(--teal)',fontFamily:'DM Mono'}}>confirm</span> to log<br/>Say <span style={{color:'var(--teal)',fontFamily:'DM Mono'}}>next step</span> to advance</div>
                </div>
              </div>

              {/* Billing alerts — shown prominently if any */}
              {billingAlerts.length > 0 && (
                <div style={{background:'rgba(255,69,58,0.08)',border:'2px solid rgba(255,69,58,0.3)',borderRadius:16,padding:16,marginBottom:16}}>
                  <div style={{fontSize:11,fontWeight:800,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--red)',marginBottom:8,display:'flex',alignItems:'center',gap:6}}>
                    ⚠ Documentation Alert
                  </div>
                  {billingAlerts.slice(-1).map((a,i) => (
                    <div key={i}>
                      <div style={{fontSize:13,color:'rgba(255,255,255,0.8)',lineHeight:1.6,marginBottom:8}}>{a.missing}</div>
                      {a.codes && <div style={{fontSize:11,fontFamily:'DM Mono',color:'var(--red)'}}>Affected codes: {a.codes}</div>}
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested checks from AI */}
              {suggestedChecks.length > 0 && (
                <div style={{background:'rgba(10,132,255,0.06)',border:'1px solid rgba(10,132,255,0.2)',borderRadius:14,padding:14,marginBottom:16}}>
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--blue)',marginBottom:10}}>ΛΛLIYΛH Suggests</div>
                  {suggestedChecks.map((s,i) => (
                    <div key={i} style={{fontSize:13,color:'rgba(255,255,255,0.7)',padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',lineHeight:1.6}}>→ {s}</div>
                  ))}
                </div>
              )}

              {/* Voice commands quick ref */}
              <div style={{background:'rgba(255,255,255,0.03)',borderRadius:14,padding:14,border:'1px solid var(--border)'}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text3)',marginBottom:10}}>Voice Commands</div>
                {[
                  ['"confirm" / "correct"','Log observation'],
                  ['"redo" / "scratch that"','Clear + re-record'],
                  ['"next step"','Advance protocol'],
                  ['"pause session"','Pause listening'],
                  ['"resume session"','Resume listening'],
                  ['"recall last entry"','Hear last log'],
                  ['"overview"','Full session summary'],
                  ['"overview of subjective"','Read subjective'],
                  ['"overview of objective"','Read objective'],
                  ['"overview of assessment"','Read assessment'],
                  ['"overview of plan"','Read plan'],
                  ['"billing status"','Check documentation'],
                  ['"what should I check"','AI suggestions'],
                  ['"end session"','Finish + generate'],
                ].map(([cmd,desc]) => (
                  <div key={cmd} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',gap:12}}>
                    <span style={{fontFamily:'DM Mono',fontSize:10,color:'var(--teal)',flexShrink:0}}>{cmd}</span>
                    <span style={{fontSize:10,color:'var(--text3)',textAlign:'right'}}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SOAP TAB */}
          {activeTab === 'soap' && (
            <div className="session-panel">
              <div className="panel-title">SOAP Note — Building Live</div>
              {['S','O','A','P'].map(k => (
                <div key={k} style={{marginBottom:20}}>
                  <div className="soap-label">{k==='S'?'Subjective':k==='O'?'Objective':k==='A'?'Assessment':'Plan'}</div>
                  {soapNote[k].length > 0
                    ? soapNote[k].map((e,i) => <div key={i} className="soap-entry">{e}</div>)
                    : <div style={{fontSize:13,color:'var(--text3)',fontStyle:'italic',padding:'8px 0'}}>Populating as you document...</div>
                  }
                </div>
              ))}
            </div>
          )}

          {/* ICD TAB */}
          {activeTab === 'icd' && (
            <div className="session-panel">
              <div className="panel-title">ICD-10 Codes {!icd10Enabled && <span style={{color:'var(--orange)',fontWeight:400,textTransform:'none',letterSpacing:0}}>— disabled</span>}</div>
              {!icd10Enabled && <div style={{fontSize:14,color:'var(--text2)',padding:'8px 0'}}>Enable ICD-10 documentation in pre-session setup to auto-populate codes.</div>}
              {icd10Enabled && icdCodes.length === 0 && <div style={{fontSize:14,color:'var(--text3)',fontStyle:'italic'}}>Codes will appear as findings are logged...</div>}
              {icdCodes.map((c,i) => (
                <div key={i} className="icd-badge">
                  <div className="icd-code">{c.code}</div>
                  <div className="icd-desc">{c.description}</div>
                  <div className="icd-conf">{c.confidence}%</div>
                </div>
              ))}
              {differentials.length > 0 && (
                <>
                  <div className="panel-title" style={{marginTop:20}}>Rule-Outs — Confirm Each</div>
                  {differentials.map((d,i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 14px',background:'rgba(255,159,10,0.06)',border:'1px solid rgba(255,159,10,0.15)',borderRadius:12,marginBottom:8,fontSize:14,color:'rgba(255,255,255,0.75)'}}>
                      {d}
                      <div style={{display:'flex',gap:8,flexShrink:0,marginLeft:12}}>
                        <button onClick={()=>{ speak('Ruling out '+d+'. Noted.'); setDifferentials(prev=>prev.filter(x=>x!==d)) }} style={{background:'rgba(255,69,58,0.15)',border:'1px solid rgba(255,69,58,0.3)',color:'var(--red)',padding:'6px 12px',borderRadius:8,fontSize:12,fontWeight:700}}>Rule Out</button>
                        <button onClick={()=>{ speak('Confirming '+d+'. Adding to assessment.'); setDifferentials(prev=>prev.filter(x=>x!==d)); setSoapNote(prev=>({...prev,A:[...prev.A,d+' — confirmed differential']})) }} style={{background:'rgba(52,199,89,0.15)',border:'1px solid rgba(52,199,89,0.3)',color:'var(--green)',padding:'6px 12px',borderRadius:8,fontSize:12,fontWeight:700}}>Confirm</button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* LOG TAB */}
          {activeTab === 'log' && (
            <div className="session-panel">
              <div className="panel-title">Session Transcript</div>
              {transcript.length === 0 && <div style={{fontSize:14,color:'var(--text3)',fontStyle:'italic'}}>Transcript will appear as you speak...</div>}
              {[...transcript].reverse().slice(0,30).map((t,i) => (
                <div key={i} className={`transcript-entry ${sessionLogs.find(l=>l.text===t.text)?'logged':'pending'}`}>
                  <div className="transcript-time">{t.time} · Step {t.step+1} — {ALL_STEPS[t.step]?.label}</div>
                  {t.text}
                </div>
              ))}
            </div>
          )}

        </div>

        {/* CONFIRM BAR — fixed bottom, hands-free backup touch */}
        {pendingLog && (
          <div className="confirm-bar">
            <div className="pending-text">"{pendingLog.text}"</div>
            <div className="confirm-buttons">
              <button className="btn-redo" onClick={()=>{ pendingRef.current=null; setPendingLog(null); playChime('error'); speak('Entry cleared. Please repeat.') }}>
                ✕ Redo
              </button>
              <button className="btn-confirm" onClick={()=>{
                if(pendingRef.current){
                  const logged=pendingRef.current
                  setSessionLogs(prev=>[...prev,logged])
                  processWithAI(logged)
                  pendingRef.current=null; setPendingLog(null)
                  playChime('confirm'); speak('Logged. Continue.')
                }
              }}>
                ✓ Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )}

  // REVIEW SCREEN
  if (screen === 'review') return (
    <>
      <style>{S}</style>
      <div className="screen" style={{alignItems:'stretch',padding:20}}>
        <div style={{maxWidth:720,margin:'0 auto',width:'100%'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
            <div className="dash-logo">
              <img src="/Aaliyah-logo.png" alt="" style={{width:32,height:32}} onError={e=>e.target.style.display='none'} />
              <div className="dash-logo-text"><span>ΛΛLIYΛH</span>.IO</div>
            </div>
            <div className="session-id-badge" style={{fontFamily:'DM Mono',fontSize:12,color:'var(--teal)',background:'rgba(48,217,192,0.1)',border:'1px solid rgba(48,217,192,0.2)',borderRadius:8,padding:'4px 12px'}}>{clientNumber}</div>
          </div>

          <div style={{fontSize:22,fontWeight:700,letterSpacing:'-0.04em',marginBottom:6}}>Session Complete</div>
          <div style={{fontSize:14,color:'var(--text2)',marginBottom:24}}>Review and edit before downloading. All outputs require clinician review before clinical use.</div>

          {['S','O','A','P'].map(k => (
            <div key={k} className={`review-section review-soap-${k.toLowerCase()}`}>
              <div className="review-section-title">
                {k === 'S' ? 'Subjective' : k === 'O' ? 'Objective' : k === 'A' ? 'Assessment' : 'Plan'}
              </div>
              <textarea className="editable" defaultValue={soapNote[k].join('\n') || 'No findings logged for this section.'} />
            </div>
          ))}

          {icd10Enabled && (
            <div className="review-section">
              <div className="review-section-title">ICD-10 Codes</div>
              {icdCodes.length > 0 ? icdCodes.map((c, i) => (
                <div key={i} className="icd-badge" style={{marginBottom:8}}>
                  <div className="icd-code">{c.code}</div>
                  <div className="icd-desc">{c.description}</div>
                  <div className="icd-conf">{c.confidence}%</div>
                </div>
              )) : <div style={{fontSize:14,color:'var(--text3)'}}>No ICD-10 codes logged.</div>}
            </div>
          )}

          <div style={{display:'flex',gap:12,marginTop:8,flexWrap:'wrap'}}>
            <button className="btn-primary" style={{flex:1,minWidth:180}} onClick={downloadPDF}>Download Session Notes</button>
            <button className="btn-secondary" style={{flex:1,minWidth:180,marginTop:0}} onClick={() => { setScreen('prechecks'); setSoapNote({S:[],O:[],A:[],P:[]}); setIcdCodes([]); setTranscript([]); setSessionLogs([]); transcriptRef.current = []; }}>New Session</button>
          </div>

          <div style={{fontSize:11,color:'var(--text3)',textAlign:'center',marginTop:20,lineHeight:1.8}}>
            Beta outputs require clinician review · Not for billing or insurance use without verification<br/>
            © 2026 ΛΛLIYΛH.IO · SomaSync AI · Phase 1 Beta
          </div>
        </div>
      </div>
    </>
  )

  return null
}
