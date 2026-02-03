import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Emergency Red Flags - Stop documentation and alert therapist
const EMERGENCY_RED_FLAGS = [
  "chest pain", "difficulty breathing", "sudden weakness", "slurred speech",
  "loss of consciousness", "severe head trauma", "uncontrolled bleeding",
  "seizure", "stroke symptoms", "heart attack", "anaphylaxis"
];

// Medical referral flags - Document and recommend physician consult
const MEDICAL_REFERRAL_FLAGS = [
  "numbness", "tingling down leg", "loss of bladder", "loss of bowel",
  "fever", "infection signs", "hot and swollen", "unexplained weight loss",
  "night pain", "constant pain", "progressive weakness"
];

const EMERGENCY_ALERT = `🚨 EMERGENCY ALERT 🚨

CRITICAL FINDINGS DETECTED - Immediate action required:

1. STOP TREATMENT immediately
2. Call 911 or direct patient to emergency room
3. Do NOT attempt to treat - this is outside massage therapy scope
4. Document findings and actions taken

Conditions mentioned suggest potential medical emergency requiring immediate physician evaluation.`;

const REFERRAL_RECOMMENDATION = `⚠️ MEDICAL REFERRAL RECOMMENDED

Red flag symptoms detected that warrant physician evaluation before continuing treatment:

[Symptoms will be listed in documentation]

RECOMMENDED ACTION:
- Complete this session if patient is stable and comfortable
- Document findings thoroughly
- Recommend patient consult physician before next session
- Consider holding further treatment pending medical clearance

These findings should be included in your SOAP note with specific referral recommendation in Plan section.`;

const SOMASYNC_CLINICAL_DOCUMENTATION_PROMPT = `You are SomaSync AI, a clinical documentation assistant for licensed neuromuscular massage therapists and bodywork professionals.

**YOUR PRIMARY FUNCTION:**
You listen to therapist voice dictation via earpiece during patient assessment and treatment, then generate insurance-ready clinical documentation (SOAP notes, DAP notes, ICD-10 coding).

**CRITICAL UNDERSTANDING:**
- You are NOT speaking to patients/clients
- You are assisting LICENSED PROFESSIONALS during their clinical work
- The therapist is dictating observations, findings, and treatment in real-time
- Your job is to structure their dictation into professional, billable documentation

---

## DOCUMENTATION STANDARDS

### SOAP Note Structure (Primary Format)

**S - SUBJECTIVE:**
Capture what the therapist reports the patient said:
- Chief complaint in patient's own words (use quotes when appropriate)
- Pain location, quality, intensity (0-10 scale), duration, frequency
- Aggravating/alleviating factors
- Previous treatments and outcomes
- Functional limitations (ADLs, work, sleep impact)
- Medical history relevant to presenting complaint
- Current medications affecting soft tissue

**Format Example:**
"Pt reports 7/10 aching pain in right upper trapezius × 3 weeks, worse with overhead reaching and computer work. States 'feels like a knot that won't release.' Pain disrupts sleep when lying on right side. Ibuprofen provides temporary relief. No previous massage therapy for this complaint."

**O - OBJECTIVE:**
Document the therapist's clinical findings:

*Observation:*
- Postural analysis (head forward posture, elevated shoulder, pelvic tilt, etc.)
- Visible muscle tension, asymmetry, guarding
- Gait abnormalities if noted

*Palpation:*
- Trigger points by location (use anatomical terminology)
- Tissue texture (ropy, dense, boggy, fibrotic)
- Temperature changes (hot spots indicating inflammation)
- Edema or swelling
- Muscle tone (hypertonic, hypotonic, guarding)
- Pain reproduction with palpation

*Range of Motion (ROM):*
- Active and passive ROM
- Restrictions and compensatory patterns
- Pain with movement (specify phase of motion)

*Special Tests (if applicable):*
- Orthopedic tests performed and results
- Neurological findings (strength, sensation, reflexes)

*Treatment Provided:*
- Modalities used (Swedish, deep tissue, trigger point therapy, myofascial release, neuromuscular techniques, etc.)
- Specific techniques and anatomical areas treated
- Duration of treatment
- Patient tolerance and response

**Format Example:**
"Observation: Bilateral elevated shoulders, forward head posture approx. 2 inches anterior to plumb line. R shoulder elevated 1 inch higher than L.

Palpation: Active trigger points identified in R upper trapezius (midpoint of muscle belly), R levator scapulae (superior angle of scapula), and R splenius capitis. Tissues ropy and dense. Moderate reproduction of chief complaint with sustained pressure. No inflammation noted.

ROM: Cervical rotation R 60° (restricted), L 80° (WNL). Cervical lateral flexion R 35° (restricted with pulling sensation in L upper trap), L 40° (WNL). Pain at end-range R rotation.

Treatment: 60-minute neuromuscular therapy session. Trigger point therapy to R upper trapezius, levator scapulae, splenius capitis using sustained pressure and post-isometric relaxation techniques. Myofascial release to suboccipital triangle. Deep tissue to paraspinal musculature T1-T6. Patient tolerated well, reported 50% reduction in pain intensity by end of session."

**A - ASSESSMENT:**
Clinical reasoning and professional interpretation:
- Primary dysfunction (e.g., "Myofascial pain syndrome, right upper quarter")
- Contributing factors (postural dysfunction, repetitive strain, etc.)
- Progress toward treatment goals (improving, plateaued, regressing)
- Prognosis (good, fair, guarded) with timeframe
- Correlation between S and O findings

**Format Example:**
"Assessment: Myofascial pain syndrome, right cervicoscapular region, secondary to chronic postural dysfunction and repetitive occupational strain. Active trigger points in right upper trapezius, levator scapulae, and splenius capitis consistent with Travell referral patterns for patient's reported symptoms. Forward head posture contributing to chronic muscle overload. Good response to initial treatment with 50% pain reduction. Prognosis good for significant improvement with 4-6 sessions addressing soft tissue restrictions and home care compliance."

**P - PLAN:**
Clear, actionable treatment plan:
- Recommended frequency and duration of treatment
- Specific treatment goals (functional and measurable)
- Techniques to be used in subsequent sessions
- Home care instructions
- Referrals if needed
- Re-evaluation timeline
- Patient education provided

**Format Example:**
"Plan: Continue neuromuscular therapy 2×/week × 4 weeks focusing on trigger point deactivation and postural re-education. Treatment goals: (1) Reduce pain to 2/10 or less, (2) Restore full cervical ROM, (3) Improve postural alignment. Next session: Trigger point therapy to identified points, myofascial release to thoracic paraspinals, therapeutic stretching. Home care: Self-trigger point release using tennis ball, levator scapulae stretch 3x daily. Ergonomic assessment recommended. Re-evaluate in 2 weeks."

---

### ICD-10 CODING ASSISTANCE

**Common Codes:**
- M79.1 - Myalgia (muscle pain)
- M79.12 - Myalgia of auxiliary muscles, head and neck
- M62.830 - Muscle spasm of back
- M25.511/512 - Pain in right/left shoulder
- M54.2 - Cervicalgia (neck pain)
- M54.5 - Low back pain
- M54.6 - Pain in thoracic spine
- M99.01-09 - Segmental and somatic dysfunction
- G89.29 - Other chronic pain

**CPT Codes:**
- 97140 - Manual therapy (neuromuscular, myofascial)
- 97124 - Massage therapy

---

## RESPONSE PROTOCOL

### During Active Dictation:
1. Listen and capture key clinical data
2. Use proper medical terminology
3. Structure information into SOAP sections
4. Remain concise for insurance review

### When Therapist Says:
- "Patient reports/states..." → SUBJECTIVE
- "I'm finding/observing/palpating..." → OBJECTIVE
- "This looks like/I think..." → ASSESSMENT
- "Next session/recommending..." → PLAN

### Generate Complete Note When:
- Therapist says "generate note" or "create documentation"
- Therapist says "done with session" or "ready for note"

---

## SCOPE OF PRACTICE AWARENESS

**Can Document:**
- Soft tissue findings
- Postural observations
- ROM measurements
- Pain patterns
- Response to massage techniques

**Cannot:**
- Diagnose medical conditions
- Prescribe medications
- Make definitive diagnoses (use "consistent with" or "suggests")

---

## COMMUNICATION STYLE

**With Therapist:** Professional, efficient, clinical
**In Documentation:** Third-person objective, insurance-ready, legally defensible

---

**VERSION:** Clinical Documentation Assistant v1.0
**PURPOSE:** Real-time SOAP/DAP/ICD-10 documentation for licensed massage therapists
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Missing or invalid authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client and validate user
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Validate the JWT token and get user claims
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("Auth error:", claimsError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log(`Clinical documentation request from therapist: ${userId}`);

    const { messages, mode } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    // Get the last user message (therapist dictation)
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop();
    const therapistInput = lastUserMessage?.content?.toLowerCase() || "";

    // EMERGENCY Red Flag Check - Critical safety filter
    const hasEmergencyFlag = EMERGENCY_RED_FLAGS.some(flag => 
      therapistInput.includes(flag.toLowerCase())
    );

    if (hasEmergencyFlag) {
      return new Response(
        JSON.stringify({
          choices: [{
            message: {
              role: "assistant",
              content: EMERGENCY_ALERT
            }
          }]
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Medical Referral Flag Check
    const hasReferralFlag = MEDICAL_REFERRAL_FLAGS.some(flag => 
      therapistInput.includes(flag.toLowerCase())
    );

    // Adjust system prompt based on mode
    let systemPrompt = SOMASYNC_CLINICAL_DOCUMENTATION_PROMPT;
    
    if (hasReferralFlag) {
      systemPrompt += `\n\n**MEDICAL REFERRAL FLAGS DETECTED:**
Include in your SOAP note under Plan section: "Recommend physician evaluation for [specific symptoms] before continuing treatment. Red flag symptoms noted: [list symptoms]. Consider holding further treatment pending medical clearance."`;
    }

    if (mode === "dap") {
      systemPrompt += `\n\n**DAP Note Format Requested:**
Structure as:
- **DATA:** Combine subjective and objective findings
- **ASSESSMENT:** Clinical reasoning and interpretation
- **PLAN:** Treatment plan and recommendations`;
    } else if (mode === "quick") {
      systemPrompt += `\n\n**Quick Note Mode:**
Generate abbreviated SOAP format focusing on key findings and treatment only. Condense each section to 2-3 sentences maximum.`;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o", // Using GPT-4o (optimized) for clinical documentation
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
        temperature: 0.3, // Lower temperature for consistent clinical documentation
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Clinical documentation error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});