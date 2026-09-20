import { z } from "zod";

/**
 * This contract is deliberately narrow. It supports terminology normalization in
 * clinician-provided transcript material; it does not authorize clinical inference.
 */
export const soapNoteSchema = z.object({
  subjective: z.string().trim().min(1).max(6000),
  objective: z.string().trim().min(1).max(6000),
  assessment: z.string().trim().min(1).max(6000),
  plan: z.string().trim().min(1).max(6000)
}).strict();

export type SoapNote = z.infer<typeof soapNoteSchema>;

export const SOAP_TOOL_NAME = "emit_soap_note";

// JSON Schema is intentionally simple: Bedrock structured-output mode accepts
// additionalProperties:false but does not support string length constraints.
export const soapToolInputSchema = {
  type: "object",
  properties: {
    subjective: {
      type: "string",
      description: "Only patient-reported symptoms, pain scale, aggravating or easing factors, stated mechanism, stated self-care, and explicitly stated energetic complaints. Preserve the patient's own words when clinically meaningful. Do not infer symptoms or patterns."
    },
    objective: {
      type: "string",
      description: "Only explicitly reported visual, palpatory, postural, range-of-motion, muscle-tone, tissue-texture, trigger-point, referral-pattern, nerve, and meridian findings. Preserve NMT terms such as hypertonicity, taut band, active or latent trigger point, ischemic compression, reciprocal inhibition, origin/insertion, myofascial restriction, nerve entrapment, and postural distortion pattern when stated. Include side and region when stated. Do not invent examination findings."
    },
    assessment: {
      type: "string",
      description: "Only the clinician's stated assessment or a clearly labeled clinician-review item based on explicitly documented findings. Preserve distinctions among observed hypertonicity, trigger-point referral, movement restriction, postural asymmetry, and diagnosis. Never convert an NMT finding into a diagnosis or synthesize an unstated condition."
    },
    plan: {
      type: "string",
      description: "Only techniques, dosage, sequence, reassessment, home care, follow-up, referrals, or acupoints explicitly stated by the clinician. Preserve NMT technique names and target structures. If no plan was stated, say clinician completion is required; never invent a treatment recommendation."
    }
  },
  required: ["subjective", "objective", "assessment", "plan"],
  additionalProperties: false
} as const;

export const clinicalDocumentationSystemPrompt = `You are SomaSync AI, a clinical documentation drafting assistant for licensed or otherwise credentialed manual therapists, Neuromuscular Therapists (NMT), and integrative bodyworkers. Your job is to turn the supplied session input into a clear, clinician-reviewable SOAP note document.

You may normalize an unambiguous phonetic transcription error to its established clinical term when surrounding transcript context supports it. Examples include "fast ya" to "fascia", "sub scap" to "subscapularis", "quad lumb" to "quadratus lumborum", "glute med" to "gluteus medius", and "ischial compression" to "ischemic compression" only when context makes the intended term clear. Preserve the clinician's NMT terminology rather than replacing it with generic language. You must not add an anatomy, NMT, pathology, symptom, finding, modality, acupoint, diagnosis, recommendation, or plan that was not explicitly stated in the supplied input.

Your terminology knowledge includes advanced anatomy and physiology (muscle origins and insertions, actions, planes of motion, joint mechanics, and kinesiology); NMT documentation terms (hypertonicity, taut bands, active or latent trigger points, referral patterns, ischemic compression, reciprocal inhibition, origin/insertion work, myofascial restriction, nerve compression or entrapment, and postural distortion patterns); and TCM bodywork terms (meridian pathways, acupressure points such as GB20 or LI4, Qi stagnation, and yin/yang balance). Use these terms only to document facts explicitly stated by the clinician or patient; never infer a TCM diagnosis, meridian assessment, trigger point, pathology, or treatment.

Organize the note as a real SOAP document: Subjective contains patient report; Objective contains directly observed or palpated findings and named NMT structures/techniques; Assessment contains only the clinician's stated interpretation or a clearly labeled verification-needed item; Plan contains only the clinician's stated treatment, reassessment, home care, follow-up, or referral. Preserve laterality, region, dosage, sequence, and reassessment measures when stated. If a field is unsupported, state that the information was not stated and clinician verification or completion is required. Preserve uncertainty. Do not claim insurance compliance, medical necessity, diagnosis, or finalization.

Call exactly one tool named ${SOAP_TOOL_NAME}. Do not emit text, Markdown, commentary, code fences, citations, or any key outside the four tool-input fields. Each field must be a concise plain-text string.`;

export function clinicalTranscriptMessage(transcript: string) {
  const normalized = transcript.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, " ").trim();
  if (!normalized) throw new Error("A final transcript is required for SOAP drafting.");
  return `Create the strict SOAP draft only from this finalized clinician session transcript:\n\n${normalized}`;
}

export function normalizeSoapNote(value: unknown): SoapNote {
  const note = soapNoteSchema.parse(value);
  return {
    subjective: note.subjective.replace(/\s+/g, " ").trim(),
    objective: note.objective.replace(/\s+/g, " ").trim(),
    assessment: note.assessment.replace(/\s+/g, " ").trim(),
    plan: note.plan.replace(/\s+/g, " ").trim()
  };
}

// ── PRE-SESSION INTAKE BRIEF ─────────────────────────────────────────────────

export const intakeBriefToolName = "emit_presession_brief";

export const intakeBriefToolSchema = {
  type: "object",
  properties: {
    postural_assessment_priorities: {
      type: "string",
      description: "Anatomically specific postural landmarks and distortion patterns the therapist should assess before making contact, based on intake data. Reference specific muscles, joint positions, and observable landmarks. Do not diagnose."
    },
    likely_involved_structures: {
      type: "string",
      description: "Muscles, fascia, nerves, and trigger point locations most likely involved based on symptom location, quality, referral pattern, and duration. Reference Travell and Simons referral maps where applicable. Use language like 'consider' and 'consistent with' — never 'diagnosis is'."
    },
    clinical_reasoning: {
      type: "string",
      description: "Step-by-step NMT clinical reasoning connecting intake findings to likely myofascial or postural etiology. Include biopsychosocial factors that may influence tissue response or pain perception."
    },
    session_priorities: {
      type: "string",
      description: "Ordered treatment focus areas based on functional impact scores and symptom severity. What to address first and why, based solely on the intake data."
    },
    therapist_prompts: {
      type: "string",
      description: "Specific questions or observations for the therapist to gather during the session to complete the clinical picture. What data is still missing from the intake."
    },
    biopsychosocial_flags: {
      type: "string",
      description: "Stress, sleep, lifestyle, and coinciding life event factors from intake that may affect tissue response, pain threshold, or session pacing. No psychological diagnosis — clinical context only."
    }
  },
  required: [
    "postural_assessment_priorities",
    "likely_involved_structures",
    "clinical_reasoning",
    "session_priorities",
    "therapist_prompts",
    "biopsychosocial_flags"
  ],
  additionalProperties: false
} as const;

export const intakeBriefSystemPrompt = `You are SomaSync AI — a clinical reasoning assistant for licensed Neuromuscular Therapists (NMT) and manual therapy practitioners.

Your role is to analyze a client's anonymous pre-session intake assessment and generate a precise, anatomically-informed pre-session brief for the treating therapist. This brief is delivered through the therapist's earpiece before they make contact with the client.

CLINICAL KNOWLEDGE BASE:
- Advanced anatomy: muscle origins, insertions, actions, innervation, and fascial relationships
- Travell and Simons myofascial trigger point referral patterns and their clinical presentations
- NMT postural distortion patterns: upper crossed syndrome, lower crossed syndrome, layered syndrome, and their associated muscle imbalances
- Biopsychosocial model: how stress, sleep, occupational posture, and psychosocial factors modulate pain perception and tissue response
- Central sensitization indicators and how they modify treatment approach
- Functional movement assessment landmarks observable before and during treatment

STRICT RULES:
- Never diagnose. Use language like "consistent with", "consider", "likely involved", "warrants assessment"
- Never invent findings not present in the intake data
- Always distinguish between what the client reported and what the therapist should look for
- Flag missing clinical data explicitly so the therapist knows what to gather during the session
- If intake data is insufficient for a structure, say so — do not fill gaps with assumptions
- Biopsychosocial factors inform approach and pacing, never diagnosis
- ICD-10 codes are never generated — reference only anatomical and functional terminology

OUTPUT: Call exactly one tool named ${intakeBriefToolName}. No text, markdown, or commentary outside the tool fields.`;

export function intakeBriefUserMessage(intakeSummary: string): string {
  return `Generate the pre-session clinical brief for the following anonymous client intake assessment:\n\n${intakeSummary}`;
}
