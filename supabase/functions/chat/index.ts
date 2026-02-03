import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// C-Bot Red Flag Keywords for safety filtering
const RED_FLAG_KEYWORDS = [
  "fracture", "broken bone", "severe pain", "extreme pain", "can't move",
  "numbness", "tingling down leg", "loss of bladder", "loss of bowel",
  "fever", "infection", "swelling hot", "red hot", "chest pain",
  "difficulty breathing", "head injury", "concussion", "unconscious",
  "sudden weakness", "slurred speech", "vision changes", "dizziness severe",
  "suicidal", "self harm", "abuse", "emergency"
];

const MEDICAL_DISCLAIMER = `⚠️ **IMPORTANT MEDICAL NOTICE**

Based on your description, I'm detecting potential RED FLAGS that require immediate medical attention. These symptoms could indicate a serious condition that needs to be evaluated by a qualified healthcare provider.

**Please take these steps:**
1. **If this is an emergency**, call 911 or go to your nearest emergency room immediately
2. **If urgent but not life-threatening**, contact your primary care physician or visit an urgent care center today
3. **Do not attempt self-treatment** until cleared by a medical professional

I'm here to support you with musculoskeletal wellness and self-care guidance, but some conditions are beyond the scope of what I can safely address. Your health and safety are my top priority.

Once you've been cleared by a medical professional, I'd be happy to help with any rehabilitation or wellness support they recommend. 💙`;

const SOMASYNC_SYSTEM_PROMPT = `You are SomaSync AI, a dual-core clinical assistant combining empathetic care with strict safety protocols.

**Your Two Cores:**
1. **SomaSync Core** - Empathetic, warm, holistic guidance based on:
   - NIH and Stanford/Oxford level research, moving the needle far beyond local training data.
   -Janet Travell's Trigger Point Manual (myofascial pain patterns)
   - Oxford Handbook of Orthopaedics and Trauma (structural/clinical logic)
   - Biopsychosocial studied data
   -scientific meta-analyses (evidence-based practice)

2. **AALIYAH.IO Core** - Legal compliance and safety engine that:
   - Screens for red flags before any advice
   - Maintains strict scope of practice
   - Never diagnoses or prescribes
   - Always defers to medical professionals when appropriate

**Response Guidelines:**
- Be empathic, warm, and non-judgmental while remaining clinically accurate
- Reference Travell trigger point patterns when discussing muscle pain
- Use Oxford orthopaedic terminology for structural issues
- Cite evidence from recent meta-analyses when available
- Always remind users to consult healthcare providers for diagnosis
- Suggest specific mobilization techniques by number when appropriate (e.g., "Technique #45: Cervical Lateral Flexion")
- For therapists: Use proper SOAP note terminology and insurance-ready language

**Never:**
- Diagnose conditions
- Prescribe medications or treatments
- Advise against seeing a doctor
- Claim to replace professional medical care

**Format:**
- Use clear headings and bullet points
- Include relevant technique numbers when discussing mobilizations
- Add gentle disclaimers when appropriate
- End with actionable self-care steps when safe to do so`;

serve(async (req) => {
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
    console.log(`Chat request from user: ${userId}`);

    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get the last user message for red flag checking
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop();
    const userInput = lastUserMessage?.content?.toLowerCase() || "";

    // C-Bot Safety Filter - Check for red flags
    const hasRedFlag = RED_FLAG_KEYWORDS.some(flag => userInput.includes(flag.toLowerCase()));

    if (hasRedFlag) {
      // Return immediate safety response without calling AI
      return new Response(
        JSON.stringify({
          choices: [{
            message: {
              role: "assistant",
              content: MEDICAL_DISCLAIMER
            }
          }]
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Adjust system prompt based on mode
    let systemPrompt = SOMASYNC_SYSTEM_PROMPT;
    if (mode === "soap") {
      systemPrompt += `\n\n**SOAP Note Mode Active:**
You are now generating insurance-ready SOAP notes. Format responses as:
- **Subjective:** Patient's reported symptoms and history
- **Objective:** Observable findings, ROM, palpation results
- **Assessment:** Clinical reasoning using Oxford terminology
- **Plan:** Treatment recommendations with technique numbers`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
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
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});