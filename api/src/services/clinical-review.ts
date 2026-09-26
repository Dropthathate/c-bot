import { z } from "zod";

export const safetyReviewSchema = z.object({
  status: z.enum(["no_flags_detected", "therapist_review_required", "urgent_follow_up_review"]),
  flags: z.array(z.object({
    category: z.enum(["red_flag", "contraindication", "scope_review"]),
    matched_phrase: z.string(),
    reason: z.string(),
    therapist_action: z.string(),
    client_message: z.string()
  }).strict()),
  disclaimer: z.string()
}).strict();
export type SafetyReview = z.infer<typeof safetyReviewSchema>;

export const terminologyReviewSchema = z.array(z.object({
  spoken_phrase: z.string(),
  suggested_term: z.string(),
  note: z.string()
}).strict());
export type TerminologyReview = z.infer<typeof terminologyReviewSchema>;

const safetyRules = [
  { category: "red_flag" as const, pattern: /chest pain|shortness of breath|difficulty breathing|fainting|loss of consciousness/i, reason: "This report may require prompt medical evaluation before bodywork.", therapist_action: "Pause automatic appointment confirmation and follow your practice emergency/referral protocol.", client_message: "Your intake mentions a symptom that may need medical evaluation before bodywork. Please contact your healthcare provider or emergency services as appropriate." },
  { category: "red_flag" as const, pattern: /loss of bowel|loss of bladder|can not control (?:my )?(?:bowel|bladder)|progressive weakness|new paralysis/i, reason: "This report may indicate a time-sensitive neurological concern.", therapist_action: "Do not proceed based on this screen alone; seek prompt medical guidance and follow your practice protocol.", client_message: "Your intake mentions a symptom that should be medically evaluated before bodywork. Please contact a healthcare professional promptly." },
  { category: "contraindication" as const, pattern: /blood clot|deep vein thrombosis|dvt|pulmonary embol|unexplained calf swelling|calf swelling and warmth/i, reason: "Possible vascular concern reported; massage suitability must be determined by a qualified clinician.", therapist_action: "Do not massage the area until the therapist reviews the report and obtains appropriate medical clearance when indicated.", client_message: "Your intake includes a health concern that should be reviewed with your healthcare provider before bodywork is confirmed." },
  { category: "contraindication" as const, pattern: /fever|active infection|contagious|open wound|unhealed incision|recent fracture/i, reason: "The report may require postponement, area avoidance, or medical clearance.", therapist_action: "Review before confirming; document the affected area and follow the practice infection, wound, or injury protocol.", client_message: "Your intake includes a condition that may affect whether bodywork is appropriate right now. Please follow up with your healthcare provider." },
  { category: "scope_review" as const, pattern: /diagnosed cancer|chemotherapy|radiation treatment|pregnant|pregnancy|recent surgery|prescription blood thinner/i, reason: "This history may require treatment modification, clearance, or scope review.", therapist_action: "Contact the client for clarification and determine whether medical clearance or a modified session is appropriate.", client_message: "Your intake includes a health-history item that your therapist should review before confirming the appointment." }
];

const terminologyRules = [
  [/\bupper trap(?:ezius)?\b/gi, "upper trapezius", "Common shorthand; confirm the intended region and side."],
  [/\bglute med\b/gi, "gluteus medius", "Common abbreviation; confirm that the therapist identified this structure."],
  [/\bquad(?:ratus)? lumb(?:orum)?\b/gi, "quadratus lumborum", "Common shorthand; preserve only when the intended structure is clear."],
  [/\bsub scap\b/gi, "subscapularis", "Common shorthand; confirm the intended structure."],
  [/\bshoulder blade\b/gi, "scapular / periscapular region", "Region-level normalization; do not infer a specific muscle."],
  [/\bknot(?:s)?\b/gi, "reported area of localized tissue tension", "Documentation wording preserves the report without asserting a diagnosis."],
  [/\btight muscle\b/gi, "reported or observed muscle hypertonicity", "Use observed only when the therapist documented an examination finding."],
  [/\blow back muscle(?:s)?\b/gi, "lumbar paraspinal region", "Region-level normalization; confirm the specific structure if known."]
] as const;

export function reviewIntakeText(text: string): { safetyReview: SafetyReview; terminologyReview: TerminologyReview } {
  const source = text.trim();
  const flags = safetyRules.flatMap((rule) => {
    const match = source.match(rule.pattern);
    return match ? [{ category: rule.category, matched_phrase: match[0], reason: rule.reason, therapist_action: rule.therapist_action, client_message: rule.client_message }] : [];
  });
  const terminologyReview = terminologyRules.flatMap(([pattern, suggested_term, note]) => {
    pattern.lastIndex = 0;
    const match = pattern.exec(source);
    pattern.lastIndex = 0;
    return match ? [{ spoken_phrase: match[0], suggested_term, note }] : [];
  });
  return {
    safetyReview: {
      status: flags.some((flag) => flag.category === "red_flag") ? "urgent_follow_up_review" : flags.length ? "therapist_review_required" : "no_flags_detected",
      flags,
      disclaimer: "This is a conservative text screen, not a diagnosis or clearance. Therapist review and applicable practice protocols are required."
    },
    terminologyReview
  };
}

export const sessionReviewSchema = z.object({
  recognized_techniques: z.array(z.object({
    technique: z.string(),
    review_prompt: z.string(),
    reassess: z.string()
  }).strict()),
  terminology_review: terminologyReviewSchema,
  safety_note: z.string()
}).strict();
export type SessionReview = z.infer<typeof sessionReviewSchema>;

export function reviewSessionTranscript(transcript: string): SessionReview {
  const source = transcript.trim();
  const techniqueRules: Array<[RegExp, string, string, string]> = [
    [/ischemic compression|sustained compression/i, "Sustained / ischemic compression", "Confirm the named target structure, duration, pressure, client response, and reassessment before accepting the note.", "Reassess the documented region and the client-reported functional change; do not infer improvement."],
    [/myofascial release|fascial release/i, "Myofascial release", "Confirm the treated region, direction, client tolerance, and observed response.", "Reassess tissue tolerance and the functional measure documented before treatment."],
    [/muscle energy|reciprocal inhibition/i, "Muscle energy / reciprocal inhibition", "Confirm the intended muscle or joint, contraction instructions, dosage, and response.", "Reassess the documented range or movement measure and compare with the initial report."],
    [/trigger point|taut band/i, "Trigger-point / taut-band language", "Confirm whether this was a client report or a therapist-observed finding and document side and region.", "Reassess the named referral or movement complaint without converting it into a diagnosis."],
    [/joint mobilization|mobilization|range of motion|rom/i, "Joint or movement reassessment language", "Confirm the joint, movement, grade or dosage if used, and client response.", "Repeat the same documented movement measure when appropriate."]
  ];
  const recognized_techniques = techniqueRules.flatMap(([pattern, technique, review_prompt, reassess]) => pattern.test(source) ? [{ technique, review_prompt, reassess }] : []);
  return {
    recognized_techniques,
    terminology_review: reviewIntakeText(source).terminologyReview,
    safety_note: "Evidence-informed review prompts are for therapist verification only; they are not treatment instructions, diagnoses, or a substitute for scope and referral judgment."
  };
}
