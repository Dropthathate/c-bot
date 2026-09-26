import { z } from "zod";

export const medicineLayerReviewSchema = z.object({
  detected: z.boolean(),
  eastern_context: z.array(z.object({
    phrase: z.string(),
    category: z.enum(["energetic_framework", "traditional_pattern", "eastern_modality", "eastern_location"]),
    soap_handling: z.string()
  }).strict()),
  western_soap_scope: z.string(),
  separation_notice: z.string()
}).strict();
export type MedicineLayerReview = z.infer<typeof medicineLayerReviewSchema>;

const easternRules: Array<[RegExp, MedicineLayerReview["eastern_context"][number]["category"]]> = [
  [/\b(?:qi|chi|energy flow|energy blockage|prana)\b/i, "energetic_framework"],
  [/\b(?:yin\s*\/\s*yang|yin and yang|five elements|five phases|dampness|deficiency|excess|wind[- ]heat|qi stagnation)\b/i, "traditional_pattern"],
  [/\b(?:acupuncture|acupressure|moxibustion|cupping|gua sha|tui na)\b/i, "eastern_modality"],
  [/\bmeridian(?:s)?\b|\b(?:GB|LI|ST|SP|LR|SI|BL|KI|CV|GV)\s*\d{1,3}\b/i, "eastern_location"]
];

const westernSoapScope = "Western SOAP documentation only: patient-reported symptoms and function; observable or palpated anatomy and movement findings; named treatment actually performed; measured or reported response; follow-up, home care, referral, and clinician-verified ICD-10-CM reference when applicable. No diagnosis is created by this module.";

export function separateMedicineLayers(transcript: string): MedicineLayerReview {
  const source = transcript.trim();
  const eastern_context = easternRules.flatMap(([pattern, category]) => {
    const match = source.match(pattern);
    return match ? [{
      phrase: match[0],
      category,
      soap_handling: category === "eastern_modality"
        ? "If the practitioner explicitly performed or documented this modality, record it only as a named intervention and target; do not add an Eastern rationale or Western diagnosis."
        : "Keep the Eastern interpretation out of the SOAP Assessment. If clinically relevant, preserve it only as an attributed client or practitioner report in plain language; do not translate it into a Western diagnosis."
    }] : [];
  });
  return {
    detected: eastern_context.length > 0,
    eastern_context,
    western_soap_scope: westernSoapScope,
    separation_notice: eastern_context.length
      ? "Eastern terminology was detected and separated for clinician review. The SOAP draft must remain Western-format documentation and must not make an Eastern or Western diagnosis from it."
      : "No Eastern terminology was detected. The SOAP draft remains restricted to documented Western clinical facts and clinician-reviewed plan items."
  };
}

export const medicineLayerPromptRules = `KNOWLEDGE-LAYER SEPARATION:
- Use Western clinical documentation as the SOAP layer: symptoms, function, anatomy, observed or palpated findings, movement measures, treatment actually performed, response, follow-up, referral, and clinician-verified ICD-10-CM reference only.
- Eastern terminology may be recognized for comprehension, but it is a separate context layer. Do not turn qi/chi, meridian imbalance, yin/yang, five-element language, dampness, deficiency, excess, or other traditional patterns into a Western diagnosis, pathology, or clinical conclusion.
- If an Eastern modality or acupoint was explicitly performed or documented, preserve it only as an attributed named intervention or location in the appropriate SOAP field; do not add an Eastern rationale and do not claim that it treats a condition.
- If an Eastern interpretation is explicitly reported by the client or practitioner and is relevant to the record, attribute it plainly (for example, "client reports that a practitioner described qi stagnation"). Do not present that statement as an objective finding, assessment, diagnosis, or medical conclusion.
- Never generate an ICD-10-CM code. If a clinician supplies or requests a code reference, keep it outside the SOAP draft and label it clinician verification required.
- The final SOAP output must contain only Subjective, Objective, Assessment, and Plan fields.`;
