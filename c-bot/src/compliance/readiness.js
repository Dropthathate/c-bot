/**
 * HIPAA-oriented readiness model for the c-bot beta.
 * This is an operational checklist, not a declaration of HIPAA certification or legal compliance.
 */
export const readinessItems = [
  {
    id: "beta-boundary",
    label: "Current PHI boundary",
    state: "not-authorized",
    summary: "The current beta is not authorized for PHI or client-identifying information.",
    detail: "Do not enter, dictate, upload, or retain client identifiers until the production controls, contracts, and governance requirements are complete."
  },
  {
    id: "baa",
    label: "Covered Entity agreement",
    state: "template-ready",
    summary: "A downstream BAA template is included for counsel-led review and execution.",
    detail: "A template does not authorize PHI processing. A fully executed agreement and implementation review are required for each applicable Covered Entity relationship."
  },
  {
    id: "vendor",
    label: "Vendor due diligence",
    state: "required",
    summary: "Every service that creates, receives, maintains, or transmits PHI requires vendor assessment.",
    detail: "Confirm BAAs, appropriate account controls, data flow, region, retention, and subcontractor posture before enabling PHI in production."
  },
  {
    id: "security",
    label: "Production security baseline",
    state: "required",
    summary: "Production requires authenticated access, least privilege, auditability, encryption, and documented incident response.",
    detail: "The repository includes architecture guidance, but production controls must be deployed, tested, monitored, and governed by the operating organization."
  },
  {
    id: "clinical",
    label: "Clinical review",
    state: "active-control",
    summary: "AI-generated material is a draft and must be reviewed by the responsible clinician.",
    detail: "The product does not provide diagnosis, treatment direction, billing determinations, or a substitute for professional judgment."
  }
];

export const statusLabels = {
  "not-authorized": "Not authorized for PHI",
  "template-ready": "Template ready",
  required: "Required before PHI",
  "active-control": "Active product control"
};
