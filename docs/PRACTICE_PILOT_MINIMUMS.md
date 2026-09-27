# SomaSyncAI — Minimum Requirements to Offer Practices a Pilot

## Executive answer

The fastest responsible offer is:

> **A de-identified documentation-assistance pilot for massage and manual-therapy practices.**

Do not market the current beta as a production EHR, diagnostic system, medical-clearance system, or HIPAA-ready platform. Let practices test the intake, pre-session brief, voice-to-SOAP drafting, terminology separation, and clinician review workflow using synthetic or properly de-identified information.

Offering the system with real client health information is a separate launch gate.

## Lane A — Minimum safe pilot you can offer first

### Product requirements

- Practice account and practitioner sign-in
- Clear workspace entry flow
- Client intake link and private session token
- Structured intake with:
  - Chief complaint and body map
  - Symptom quality, duration, and functional impact
  - Relevant history and preferences
  - Biopsychosocial context
  - Consent and privacy notice
- Cross-device token lookup
- Pre-session brief
- Safety/contraindication review that says **flag for therapist judgment**, not “cleared” or “diagnosed”
- Voice-capture simulation or real transcription only with explicit consent and an approved vendor path
- Strict four-field SOAP draft:
  - Subjective
  - Objective
  - Assessment
  - Plan
- Eastern context displayed separately from the Western SOAP
- Therapist edit/review step
- Export only after clinician review
- Delete/reset workflow for pilot data
- Visible status showing what is live, beta, simulated, or unavailable

### Pilot guardrails

- Use synthetic/de-identified information only.
- Do not collect names, dates of birth, addresses, phone numbers, email addresses, medical-record numbers, insurance information, exact appointment dates, photographs, or other identifiers.
- Do not use real client audio or voice prints in the de-identified pilot.
- Do not claim that the system diagnoses, clears, treats, prescribes, determines medical necessity, or replaces a licensed clinician.
- Do not promise that a safety flag is a contraindication determination. The therapist must apply scope, consent, and referral procedures.
- Keep the therapist responsible for confirming findings, assessments, plans, referrals, and exports.

### Business materials

Prepare these before approaching practices:

1. One-page product overview
2. Pilot agreement with:
   - Pilot duration
   - Permitted data types
   - Practice responsibilities
   - Support channel
   - Data deletion date
   - No-PHI limitation
3. Privacy notice
4. Terms of use
5. Audio/transcription consent language for any voice feature
6. Subprocessor list
7. Security and beta limitations page
8. 20-minute onboarding script
9. Synthetic practice script
10. Feedback form and issue-reporting process

### Minimum pilot acceptance test

A practice should be able to complete this with synthetic information:

1. Create or receive a session token.
2. Complete the intake from a phone-sized screen.
3. Load the token on a desktop workspace.
4. See a pre-session brief and safety-review output.
5. Run the synthetic voice demo or approved test transcription.
6. Generate a four-field SOAP draft.
7. Toggle Eastern reference context without mixing it into the Western SOAP.
8. Edit the draft.
9. Confirm the review checkbox.
10. Export or download the reviewed draft.
11. Delete the pilot record.

## Lane B — Requirements before real client information

Before a practice enters real health information, complete these gates with qualified privacy/security counsel and the relevant vendors:

### 1. Determine the legal data relationship

Determine whether each practice is a HIPAA covered entity and whether SomaSyncAI is acting as a business associate. If SomaSyncAI creates, receives, maintains, or transmits ePHI for a covered entity, the cloud/software arrangement generally requires a HIPAA-compliant Business Associate Agreement and appropriate safeguards. HHS states that a cloud service provider can be a business associate even when the data is encrypted and the provider cannot view the key.

### 2. Complete a documented risk analysis

Document threats and safeguards for:

- Intake data
- Session tokens
- Transcripts
- Audio streams
- SOAP drafts
- Exports
- Email notifications
- Admin access
- Backups and logs
- Vendors and subprocessors

### 3. Make the infrastructure support the promise

At minimum, implement and verify:

- HTTPS everywhere
- Encryption in transit and at rest
- Tenant/practice isolation
- Role-based access control
- Strong authentication and MFA for practitioners/admins
- Short-lived session tokens and token rotation/revocation
- Audit logs for access, edits, exports, and deletes
- No raw audio or transcript in browser local storage
- Defined retention and deletion policies
- Encrypted backups and restore testing
- Secrets management
- Dependency and vulnerability monitoring
- Incident response and breach-notification procedures
- Vendor BAAs where required

### 4. Treat audio as sensitive data

Voice capture can create highly sensitive information. Use a transcription provider and storage path whose contract, security posture, retention behavior, and BAA status match the intended deployment. Do not assume that “we do not save the audio” alone makes the workflow compliant.

### 5. Validate the intake safety workflow

Have qualified clinical and legal reviewers approve:

- Questions asked
- Flag logic
- Escalation wording
- Referral wording
- Therapist notification
- Client notification
- Appointment-hold behavior
- Scope-of-practice boundaries by target jurisdiction

The system should say that a possible concern requires therapist review and possible follow-up with an appropriate licensed professional. It should not independently clear a client or instruct a client to seek a specific treatment.

### 6. Validate marketing language

Market SomaSyncAI as documentation assistance and workflow support. Avoid unsupported claims such as:

- “Prevents injury”
- “Finds the diagnosis”
- “Clears clients for massage”
- “Replaces chart review”
- “Guaranteed compliant”
- “Gold-standard clinical decision-making”

## Recommended first offer

### Founding Practice Pilot

**Audience:** Massage therapists, NMT practitioners, and small manual-therapy practices.

**Promise:** Improve intake completeness and reduce post-session documentation time using a clinician-reviewed workflow.

**Included:**

- Practice onboarding
- De-identified intake flow
- Session-token handoff
- Pre-session brief
- Voice-to-SOAP demonstration or approved test transcription
- Western SOAP structure
- Separate Eastern reference layer
- Export after therapist review
- Weekly feedback session

**Not included:**

- PHI processing
- Insurance or billing decisions
- Diagnosis or medical clearance
- Autonomous treatment recommendations
- Automated appointment approval based solely on AI flags
- Clinical or regulatory certification claims

## Practical go/no-go checklist

### You can start a de-identified pilot when all are true

- [ ] Privacy notice and beta terms are visible
- [ ] No-PHI rule is enforced in onboarding and UI
- [ ] Synthetic practice script works end to end
- [ ] Intake token works across phone and desktop
- [ ] SOAP output is four fields and editable
- [ ] Eastern context is clearly separate
- [ ] Safety flags require therapist judgment
- [ ] Export requires review confirmation
- [ ] Pilot data can be deleted
- [ ] Support and incident contact are published
- [ ] At least one practice completes the acceptance test

### You should not accept real client information until all are true

- [ ] Data-role analysis is complete
- [ ] Required BAAs are signed
- [ ] Vendor/subprocessor contracts are reviewed
- [ ] Risk analysis is documented
- [ ] Access control and MFA are live
- [ ] Audit logs and deletion workflows are verified
- [ ] Retention and incident response are documented
- [ ] Audio/transcription path is approved
- [ ] Intake safety/referral logic is clinically reviewed
- [ ] Target-jurisdiction scope and privacy requirements are reviewed
- [ ] Marketing claims are reviewed

## Official references

- [HHS: De-identification guidance](https://www.hhs.gov/hipaa/for-professionals/special-topics/de-identification/index.html) — Safe Harbor and Expert Determination methods.
- [HHS: HIPAA and cloud computing](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html) — cloud providers processing or storing ePHI and BAA obligations.
- [FTC: Mobile health app developer best practices](https://www.ftc.gov/business-guidance/resources/mobile-health-app-developers-ftc-best-practices) — data minimization, access control, authentication, security by design, and affirmative consent.

This checklist is product-planning guidance, not legal advice. Have counsel and qualified security/clinical reviewers approve the real-client launch path.
