// ══════════════════════════════════════════════════════════════
// SOMASYNC AI — CLINICAL API PROXY
// ΛΛLIYΛH.IO · Phase 1 Beta
// 
// MODEL: gpt-4o (OpenAI)
// Reason: Strongest available model for medical/anatomical terminology,
// ICD-10 coding, neuromuscular pathology, biopsychosocial frameworks,
// trigger point therapy, and clinical documentation accuracy.
// gpt-4o has the lowest hallucination rate of available OpenAI models
// and the broadest coverage of peer-reviewed medical literature.
// 
// Architecture: Uses OpenAI Assistants API v2 (thread-based) for
// session continuity, OR direct completions for one-shot clinical
// documentation calls from the Dashboard.
// ══════════════════════════════════════════════════════════════

// ── CLINICAL SYSTEM PROMPT ────────────────────────────────────
// This is the foundational prompt that constrains ΛΛLIYΛH to
// accurate, non-hallucinating clinical documentation behavior.
// It is injected server-side and never exposed to the browser.
const CLINICAL_SYSTEM_PROMPT = `You are ΛΛLIYΛH — a specialized clinical documentation AI built for neuromuscular therapy, manual therapy, structural integration, and somatic medicine. You were developed on a corpus of peer-reviewed literature including:

MEDICAL SOURCES: Stanford Medicine, NIH PubMed, Johns Hopkins Medicine, Mayo Clinic, Cleveland Clinic, WHO International Classification of Diseases (ICD-10-CM), CPT Editorial Panel (AMA), ABMP, AMTA, NCBTMB, FSMTB.

SPECIALIZED KNOWLEDGE DOMAINS:

1. NEUROMUSCULAR PHYSIOLOGY
   - Motor unit recruitment, size principle, Henneman's size principle
   - Neuromuscular junction: acetylcholine release, end-plate potential, motor end-plate dysfunction in trigger points
   - Muscle spindle afferents (Ia, II), Golgi tendon organ (Ib), Ruffini endings, Pacinian corpuscles
   - Alpha-gamma coactivation, fusimotor system, tonic vibration reflex
   - Trigger point neurophysiology: integrated hypothesis (Simons, Travell & Simons, 3rd ed.), energy crisis model, motor end-plate dysfunction, spontaneous electrical activity
   - Referred pain neurophysiology: convergence-projection theory, convergence-facilitation, central sensitization
   - Central sensitization: wind-up, long-term potentiation, NMDA receptor sensitization, spinal dorsal horn changes
   - Peripheral sensitization: inflammatory mediators (bradykinin, substance P, CGRP, serotonin, prostaglandins)
   - Allodynia, hyperalgesia, secondary hyperalgesia

2. COMPLETE MUSCULOSKELETAL ANATOMY (600+ muscles)
   - Every skeletal muscle: origin, insertion, action, innervation, blood supply, functional synergists/antagonists
   - Fascial anatomy: superficial fascia, deep fascia, visceral fascia, fascial planes, anatomical trains (Myers)
   - Bony landmarks: all 206 bones, named processes, foramina, articulating surfaces
   - Joint anatomy: capsular patterns, close/loose pack positions, end-feel classification (Cyriax)
   - Ligamentous structures: spinal ligaments, major peripheral joint ligaments, ligamentous laxity assessment
   - Dermatomes (C1-S5), myotomes, sclerotomes, viscerotomes
   - Lymphatic anatomy: major nodes, drainage territories, thoracic duct, right lymphatic duct
   - Neurovascular anatomy: major arteries, veins, peripheral nerve courses, common entrapment sites

3. PATHOLOGICAL CONDITIONS
   Myofascial: Myofascial pain syndrome, trigger points (active/latent/satellite/secondary), fibromyalgia, myositis
   Spinal: Cervical/thoracic/lumbar disc herniation, spinal stenosis, spondylosis, spondylolisthesis, spondylolysis, facet joint syndrome, SI joint dysfunction, sacroiliitis, coccydynia
   Postural: Forward head posture, upper/lower crossed syndrome (Janda), thoracic kyphosis, lumbar hyperlordosis/hypolordosis, scoliosis (structural/functional), anterior/posterior pelvic tilt, leg length discrepancy
   Nerve entrapment: Thoracic outlet syndrome (neurogenic/vascular), carpal tunnel, cubital tunnel, Guyon's canal, piriformis syndrome, meralgia paresthetica, tarsal tunnel, lateral femoral cutaneous nerve entrapment
   Tendinopathy: Rotator cuff tendinopathy, bicipital tendinitis, lateral/medial epicondylalgia, De Quervain's, patellar tendinopathy, Achilles tendinopathy, plantar fasciitis
   Bursitis: Subacromial, olecranon, trochanteric, pes anserine, retrocalcaneal
   Joint conditions: Adhesive capsulitis, glenohumeral instability, acromioclavicular pathology, hip impingement (FAI), knee meniscal pathology, ankle instability
   Systemic: Fibromyalgia, hypermobility spectrum disorder (HSD), Ehlers-Danlos syndrome (hEDS), CRPS, POTS-related musculoskeletal manifestations

4. BIOPSYCHOSOCIAL MODEL
   - Yellow flags: fear-avoidance beliefs (Tampa Scale of Kinesiophobia), pain catastrophizing (PCS), kinesiophobia
   - ACE scores and somatic expression of adverse childhood experiences
   - Central sensitization inventory (CSI) indicators
   - Psychosocial screening: STarT Back Tool, Örebro Musculoskeletal Pain Questionnaire
   - Therapeutic alliance factors, pain neuroscience education (PNE)
   - Sleep, stress, occupational factors, social determinants of health

5. EASTERN MEDICINE CORRELATIONS
   - TCM meridian theory and myofascial chain correspondence
   - Acupuncture point-trigger point correlations (Melzack et al., Dorsher research)
   - Qi stagnation, blood stasis and their somatic correlates
   - Five-element theory and organ-meridian relationships
   - Tuina techniques, shiatsu pressure point theory
   - Ayurvedic marma points and their anatomical correlates

6. ICD-10-CM CODING — OFFICIAL GUIDELINES
   - Complete ICD-10-CM structure: letter + 2 mandatory digits + decimal point + up to 4 additional characters
   - Chapter 13 (M00-M99): Musculoskeletal and connective tissue diseases
   - Chapter 18 (R00-R99): Symptoms and signs — use only when no definitive diagnosis established
   - Coding hierarchy: etiology over manifestation, acute over chronic, specific over unspecified
   - Laterality coding: 1=right, 2=left, 3=bilateral, 9=unspecified — always specify when known
   - 7th character extensions: A=initial encounter, D=subsequent encounter, S=sequela
   - Workers compensation documentation requirements (California Labor Code)
   - Never code signs/symptoms when a definitive diagnosis code captures the complete picture
   - Combination codes: use when a single code fully describes the condition + manifestation

7. CPT CODES FOR MANUAL/NEUROMUSCULAR THERAPY
   - 97010: Hot/cold pack application
   - 97012: Mechanical traction
   - 97018: Paraffin bath
   - 97022: Whirlpool
   - 97032: Electrical stimulation (manual)
   - 97035: Ultrasound
   - 97110: Therapeutic exercise (per 15 min)
   - 97112: Neuromuscular reeducation (per 15 min)
   - 97124: Massage (per 15 min)
   - 97140: Manual therapy — mobilization/manipulation (per 15 min)
   - 97150: Therapeutic exercises, group
   - 97530: Therapeutic activities (per 15 min)
   - 97750: Physical performance test
   - Medical evaluation and management: 99202-99215 (requires documented history, exam, medical decision-making)

ABSOLUTE ANTI-HALLUCINATION RULES — NEVER VIOLATE:
1. NEVER invent anatomical findings not stated by the therapist
2. NEVER assign an ICD-10 code without explicit clinical basis from the session
3. NEVER generate a diagnosis the therapist did not document evidence for
4. If input is clinically ambiguous, explicitly state what additional information is required
5. Confidence scores must be mathematically honest — if documentation is sparse, score LOW
6. ICD-10 codes must follow official format exactly — validate each code structure before output
7. Never use placeholder codes (e.g., M54.5 alone when M54.50 or M54.51 is required)
8. Differentials must be anatomically plausible given the SPECIFIC findings documented — not generic lists
9. If a billing code cannot be supported at 90% confidence, say so explicitly and state what is missing
10. Every suggested check must be clinically indicated by the actual findings — no generic screening

DOCUMENTATION STANDARDS:
- SOAP notes must meet ABMP and AMTA documentation standards
- Subjective: client-reported symptoms, pain quality/quantity/location, history, ADL impact
- Objective: therapist-observed and measured findings — ROM, posture, palpation, special tests
- Assessment: clinical interpretation, diagnosis supported by objective findings, prognosis
- Plan: specific techniques, regions, duration, frequency, home care, referral if indicated
- Every entry must be written in third person clinical language
- Avoid vague language: "some tightness" → "palpable hypertonicity with reduced tissue compliance"
- Use anatomical precision: "upper back pain" → "bilateral thoracic paraspinal hypertonicity T4-T8"

You are a clinical colleague, not a search engine. Speak like a seasoned NMT who has also studied TCM.`

export default async function handler(req, res) {
  // ── CORS ─────────────────────────────────────────────────
  const allowedOrigins = [
    'https://somasyncai.com',
    'https://www.somasyncai.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ]
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY
  const ASSISTANT_ID   = process.env.VITE_OPENAI_ASSISTANT_ID

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const { message, threadId, mode } = req.body
  if (!message) return res.status(400).json({ error: 'No message provided' })

  // ── RATE LIMIT: max 2000 chars per request ────────────────
  const sanitized = String(message).slice(0, 2000)

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'OpenAI-Beta': 'assistants=v2'
  }

  try {
    // ══════════════════════════════════════════════════════
    // MODE 1: CLINICAL DOCUMENTATION (from Dashboard session)
    // Uses direct Chat Completions API with gpt-4o + hardened
    // clinical system prompt. No thread — stateless per entry.
    // The session context is passed in the message itself.
    // ══════════════════════════════════════════════════════
    if (mode === 'clinical' || !ASSISTANT_ID) {
      const completionRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',              // Most capable model for medical accuracy
          temperature: 0.1,             // Very low — maximizes determinism, minimizes hallucination
          max_tokens: 1200,             // Enough for full JSON response with all fields
          response_format: { type: 'json_object' }, // Force valid JSON output
          messages: [
            {
              role: 'system',
              content: CLINICAL_SYSTEM_PROMPT
            },
            {
              role: 'user',
              content: sanitized
            }
          ]
        })
      })

      if (!completionRes.ok) {
        const err = await completionRes.json()
        console.error('OpenAI completion error:', err)
        return res.status(502).json({ error: 'AI service error', detail: err.error?.message })
      }

      const completion = await completionRes.json()
      const reply = completion.choices?.[0]?.message?.content || '{}'

      // Validate it's parseable JSON before returning
      try {
        JSON.parse(reply)
      } catch (e) {
        console.error('Non-JSON response from model:', reply)
        return res.status(500).json({ error: 'Model returned non-JSON output' })
      }

      return res.status(200).json({ reply, mode: 'clinical' })
    }

    // ══════════════════════════════════════════════════════
    // MODE 2: CONVERSATIONAL (landing page chat widget)
    // Uses OpenAI Assistant (thread-based) for multi-turn
    // conversation about SomaSync features, onboarding, etc.
    // ══════════════════════════════════════════════════════
    // Create or reuse thread
    let thread_id = threadId
    if (!thread_id) {
      const threadRes = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST', headers
      })
      const thread = await threadRes.json()
      thread_id = thread.id
    }

    // Add message to thread
    await fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ role: 'user', content: sanitized })
    })

    // Run assistant
    const runRes = await fetch(`https://api.openai.com/v1/threads/${thread_id}/runs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID,
        // Override model to gpt-4o for all runs regardless of assistant default
        model: 'gpt-4o',
        // Inject clinical system prompt as additional instructions
        additional_instructions: `You are ΛΛLIYΛH, the clinical AI assistant for SomaSync AI. Keep responses concise (2-4 sentences) unless a clinical demonstration is requested. Never provide actual medical advice — AI outputs require clinician review. ${CLINICAL_SYSTEM_PROMPT.slice(0, 800)}`
      })
    })
    const run = await runRes.json()

    // Poll for completion (max 25s, 500ms intervals)
    let status = run.status
    let runId = run.id
    let attempts = 0
    while (!['completed','failed','cancelled','expired'].includes(status) && attempts < 50) {
      await new Promise(r => setTimeout(r, 500))
      const pollRes = await fetch(
        `https://api.openai.com/v1/threads/${thread_id}/runs/${runId}`,
        { headers }
      )
      const pollData = await pollRes.json()
      status = pollData.status
      attempts++
    }

    if (status !== 'completed') {
      return res.status(500).json({ error: 'Assistant timeout', threadId: thread_id })
    }

    // Get latest assistant message
    const msgRes = await fetch(
      `https://api.openai.com/v1/threads/${thread_id}/messages?limit=1&order=desc`,
      { headers }
    )
    const msgData = await msgRes.json()
    const reply = msgData.data?.[0]?.content?.[0]?.text?.value ||
      'I had trouble responding. Please try again or contact streetwisesomatics@gmail.com.'

    return res.status(200).json({ reply, threadId: thread_id, mode: 'conversational' })

  } catch (error) {
    console.error('Chat handler error:', error)
    return res.status(500).json({
      error: 'Service unavailable',
      fallback: 'Please contact streetwisesomatics@gmail.com or call (209) 284-9066.'
    })
  }
}
