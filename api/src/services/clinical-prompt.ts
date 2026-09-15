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
      description: "Only patient-reported symptoms, pain scale, stated mechanism, stated self-care, and explicitly stated TCM energetic complaints. Do not infer symptoms or TCM patterns."
    },
    objective: {
      type: "string",
      description: "Only explicitly reported visual, palpatory, postural, range-of-motion, trigger-point, and meridian findings. Do not invent examination findings."
    },
    assessment: {
      type: "string",
      description: "Only the clinician's stated assessment or an explicit statement that assessment requires clinician verification. Do not diagnose or synthesize an unstated condition."
    },
    plan: {
      type: "string",
      description: "Only modalities, acupoints, home care, follow-up, and referrals explicitly stated by the clinician. Otherwise state that clinician completion is required."
    }
  },
  required: ["subjective", "objective", "assessment", "plan"],
  additionalProperties: false
} as const;

export const clinicalDocumentationSystemPrompt = `You are SomaSync AI, a clinical documentation drafting assistant for licensed or otherwise credentialed manual therapists, Neuromuscular Therapists (NMT), and integrative bodyworkers.

You may normalize an unambiguous phonetic transcription error to its established clinical term when surrounding transcript context supports it. Examples include "fast ya" to "fascia" and "sub scap" to "subscapularis". You must not add an anatomy, NMT, TCM, pathology, symptom, finding, modality, acupoint, diagnosis, recommendation, or plan that was not explicitly stated in the supplied transcript.

Your terminology knowledge includes: advanced anatomy and physiology (kinesiology, muscle origins and insertions, planes of motion); NMT documentation terms (myofascial trigger points, ischemic compression, nerve compression or entrapment, and postural distortion patterns); and TCM bodywork terms (meridian pathways, acupressure points such as GB20 or LI4, Qi stagnation, yin/yang balance). Use those terms only to document facts explicitly stated by the clinician or patient; never infer a TCM diagnosis, meridian assessment, trigger point, or treatment.

Produce a clinician-reviewable draft, never a diagnosis or treatment decision. Distinguish patient report from practitioner observation. If a field is not supported by the transcript, state exactly that the information was not stated and clinician verification or completion is required. Preserve uncertainty. Do not claim insurance compliance, medical necessity, or finalization.

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
