# SomaSyncAI — Completed System Blueprint

**Repository:** `Dropthathate/c-bot`  
**Blueprint date:** September 27, 2026  
**Current product status:** Controlled synthetic-data beta/pilot foundation. The product is **not authorized for PHI or client-identifying information** until the privacy, security, vendor, clinical, legal, and operational readiness gates are completed.

> **Core product boundary:** SomaSyncAI assists with intake organization, safety review, terminology normalization, voice transcription, SOAP drafting, and therapist review prompts. It does not diagnose, clear a client for bodywork, prescribe treatment, replace a licensed clinician, or finalize a clinical record.

---

## 1. The complete intended order

This is the end-to-end sequence that should be used when looking at the system:

1. **Landing and beta access**
2. **Practitioner sign-in and privacy gate**
3. **Dashboard hub**
4. **Create/send client intake link**
5. **Client completes the public intake**
6. **Server creates a cross-device intake token**
7. **Practitioner opens the clinical workspace**
8. **Practitioner loads the intake token**
9. **System generates a pre-session brief and safety/terminology review**
10. **Practitioner decides whether the session can proceed**
11. **Practitioner records posture or other directly observed findings**
12. **Practitioner selects microphone/device and session duration**
13. **Voice capture and real-time transcription begin**
14. **Practitioner uses hands-free logging and session commands**
15. **Practitioner requests a strict SOAP draft**
16. **System returns four SOAP fields plus separate review panels**
17. **Eastern and Western knowledge layers remain separated**
18. **Practitioner edits and verifies the draft**
19. **Practitioner exports only after confirming review**
20. **Future progress/referral workflows remain planned, not fully completed**

---

## 2. Entry point and authentication

### 2.1 Landing page

**Route:** `/`

The landing experience introduces SomaSyncAI and directs users toward beta access or sign-in.

### 2.2 Practitioner sign-in

**Route:** `/login`

The practitioner must authenticate before accessing protected clinical features. The API establishes a secure session using an HttpOnly cookie and CSRF protection.

### 2.3 Privacy gate

Protected dashboard and clinical workspace access are wrapped in a privacy/consent gate. The current beta boundary is explicit:

- Use synthetic/de-identified information only.
- Do not enter a real client name, date of birth, address, diagnosis, or other identifying information.
- The beta is not HIPAA authorization or HIPAA certification.

---

## 3. Dashboard hub

**Route:** `/dashboard`

The dashboard is the practitioner’s operating hub. Completed dashboard elements include:

- Greeting and system-ready status
- Animated **SOMASYNC // SIGNAL MONITOR** panel
- Live clock and dashboard status indicators
- Intake-token panel
- Quick actions
- Practice tip and voice-command panel
- News/practice content area
- Navigation to clinical tools

### Dashboard navigation

| Route | Purpose | Current status |
|---|---|---|
| `/dashboard` | Dashboard home | Completed |
| `/dashboard/soap` | Text-based SOAP generator | Completed |
| `/dashboard/icd` | ICD reference interface | Present; clinician verification required |
| `/dashboard/analytics` | Analytics page | Present in dashboard shell |
| `/dashboard/compliance` | Compliance/readiness page | Present in dashboard shell |
| `/dashboard/settings` | Settings | Present in dashboard shell |
| `/clinical-workspace` | Live voice-oriented workspace | Completed and deployed |

The dashboard is a navigation and operating hub. It is not the clinical decision-maker.

---

## 4. Client intake flow

**Public route:** `/intake/`

The intake is designed to collect a structured, synthetic/de-identified pre-session picture without requiring a client name.

### Intake Step 0 — Before the session

The client sees:

- Purpose of the assessment
- Estimated completion time of approximately 4–6 minutes
- Statement that no name is collected
- A private session code/token concept
- Start assessment button

### Intake Step 1 — Where it lives

The client uses front and back body maps to mark:

- Primary complaint
- Secondary area
- Radiation area
- Side and approximate location

The back map was corrected so chest/breast outlines are not displayed on the back view.

### Intake Step 2 — How it feels

The client can record:

- Aching/dull
- Sharp/stabbing
- Burning/hot
- Throbbing/pulsing
- Tight/pulling
- Numb/tingling
- Constant or intermittent pattern
- Worse with movement
- Duration/timeline
- What coincided with onset, such as injury, stress, work/posture change, sleep disruption, exercise, or no clear reason

### Intake Step 3 — Functional impact

The client rates how much the concern affects activities. This identifies what matters most to the client and creates a baseline for later reassessment.

### Intake Step 4 — Biopsychosocial context

The client can provide context such as:

- Stress level
- Sleep quality
- Work/lifestyle context
- Activity and environmental factors
- Other context relevant to pacing and session preparation

This is context, not a psychological diagnosis.

### Intake Step 5 — Preferences and consent

The client completes the final intake preferences/consent step and submits the assessment.

### Intake data boundary

The intake payload is validated and constrained. The client-facing intake is not intended to be a diagnosis form, treatment prescription form, or PHI-authorized chart.

---

## 5. Persistent intake token and cross-device flow

After submission:

1. The server creates an `ss-XXXXXX`-style intake token.
2. The database stores a SHA-256 hash of the token rather than the raw token.
3. The intake payload is stored as synthetic/de-identified structured data.
4. Submissions expire after seven days.
5. The practitioner can enter the token from another device.
6. The authenticated API retrieves the active intake.
7. The browser does not need to rely on `sessionStorage` for the primary cross-device flow.
8. A temporary same-device compatibility fallback remains for older pre-persistence submissions.

Relevant API behavior:

- `POST /api/v1/public/intakes` — public intake submission/token creation
- `POST /api/v1/intake/brief` — authenticated practitioner lookup and brief generation

The production database bootstrap/migration work was added so the API can create/use the intake table when connected to the configured database.

---

## 6. Clinical workspace

**Route:** `/clinical-workspace/`

The live workspace is the main therapist documentation environment.

### Workspace guardrails

The workspace visibly states:

- Clinician review is required.
- SOAP fields remain editable.
- Unsupported findings, assessments, and plans must be completed or corrected by the clinician.
- SomaSyncAI does not diagnose, make treatment decisions, or finalize a record.
- Automated flags must not be used alone to begin bodywork.

### Guided workflow rail

The workspace displays:

1. Load intake
2. Safety review
3. Assess
4. Capture
5. Review SOAP
6. Progress

The progress step is currently a workflow placeholder for future therapist-approved progress functionality; it is not yet a complete automated client-progress module.

---

## 7. Pre-session intake loading and clinical review

The practitioner enters the client’s token in **Client intake token** and selects **Load intake**.

The API returns:

1. A structured pre-session brief
2. A deterministic safety review
3. A terminology review

### 7.1 Pre-session brief

The brief can contain:

- Postural assessment priorities
- Structures to consider assessing
- Clinical reasoning based on provided intake information
- Session priorities
- Therapist prompts for missing information
- Biopsychosocial context affecting pacing or tissue response

The brief is written as an assessment aid. It uses language such as “consider,” “consistent with,” and “warrants assessment,” rather than making a diagnosis.

### 7.2 Intake safety screen

The deterministic safety screen flags explicit text involving possible:

- Chest pain or breathing difficulty
- Fainting or loss of consciousness
- Progressive weakness or new paralysis
- Loss of bowel/bladder control
- Possible clot/DVT or pulmonary embolism language
- Fever, active infection, open wound, recent fracture
- Cancer treatment
- Pregnancy
- Recent surgery
- Prescription blood thinners

The status can be:

- **No text flags detected**
- **Therapist review required**
- **Urgent follow-up review**

The safety screen does not clear the client and does not diagnose. It tells the practitioner to pause, clarify, follow practice protocol, seek medical guidance when appropriate, or refer out.

### 7.3 Massage/NMT terminology review

Basic wording can be surfaced as a suggestion, for example:

| Spoken/basic phrase | Suggested documentation term | Limitation |
|---|---|---|
| Upper trap | Upper trapezius | Confirm region and side |
| Glute med | Gluteus medius | Confirm the therapist identified that structure |
| Quad lumb | Quadratus lumborum | Preserve only when intended structure is clear |
| Sub scap | Subscapularis | Confirm intended structure |
| Shoulder blade | Scapular/periscapular region | Does not infer a specific muscle |
| Knot | Reported area of localized tissue tension | Does not create a diagnosis |
| Tight muscle | Reported or observed muscle hypertonicity | Observed only when therapist documented an exam finding |
| Low back muscles | Lumbar paraspinal region | Confirm specific structure if known |

The system suggests terminology; the therapist confirms or edits it.

---

## 8. Direct assessment and posture capture

The workspace includes a postural assessment panel before the live capture controls. The practitioner records only what they directly observe.

Available finding categories include:

- Head-forward position
- Shoulder elevation
- Shoulder protraction
- Scapular asymmetry
- Thoracic curve
- Lumbar curve
- Pelvic tilt/rotation
- Knee alignment
- Foot/ankle position

The practitioner can also record:

- Side/pattern
- Free-text clinician observations
- Saved assessment summary

The posture tool explicitly states that it organizes findings and does not diagnose, interpret, or prescribe treatment.

---

## 9. Audio, device, and live transcription flow

The workspace supports:

- Approved microphone selection
- Optional supported BLE companion-device connection
- Microphone input level visualization
- PCM frame count
- Audio format/sample-rate status
- Secure WebSocket streaming path
- Reconnection handling with bounded in-memory recovery
- Real-time final/interim transcript display
- Session duration selection
- Operational event trail

The event trail is privacy-scoped and contains state codes only. It is designed not to display raw audio, credentials, device identifiers, or SOAP content.

### Session start order

1. Select a microphone.
2. Optionally connect the supported companion device.
3. Load the intake token and review the brief/safety panel.
4. Select session duration.
5. Start the secure session.
6. Confirm the microphone signal and secure stream state.
7. Begin documenting only synthetic/de-identified practice content in the current beta.

### Voice assistant commands

The practice flow supports commands such as:

- “Begin session”
- “Noting”
- “Pause”
- “Replay”
- “Time check”
- “End session”

These commands control the documentation workflow; they do not make clinical decisions.

---

## 10. SOAP generation

The SOAP generator accepts finalized clinician session context and returns exactly four fields:

1. **Subjective** — patient/client-reported symptoms, function, aggravating/easing factors, and stated history
2. **Objective** — directly observed, palpated, postural, movement, tissue, or named technique findings
3. **Assessment** — only the clinician’s stated assessment or a clearly labeled verification-needed item
4. **Plan** — only explicitly stated treatment, dosage, reassessment, home care, follow-up, or referral information

The server uses a strict structured tool contract and rejects malformed output, prose outside the contract, or extra fields.

### SOAP restrictions

The drafting system must not invent:

- Diagnoses
- Anatomy not stated in the source
- Findings not observed or reported
- Symptoms
- Pathology
- Modalities not documented
- Recommendations not stated
- Treatment plans not stated
- Medical necessity
- Insurance-compliance claims
- Finalization/approval status

If information is missing, the note must indicate that clinician completion or verification is required.

---

## 11. Eastern and Western knowledge separation

This is now a distinct review layer attached to the SOAP-generation flow.

### Eastern concepts that can be detected

- Qi/chi or energy-flow language
- Yin/yang
- Five elements/five phases
- Dampness, deficiency, excess, wind-heat, qi stagnation
- Acupuncture
- Acupressure
- Moxibustion
- Cupping
- Gua sha
- Tui na
- Meridians
- Acupoint references such as GB20 or LI4

### Separation behavior

Eastern terminology is recognized for comprehension but is not silently converted into a Western diagnosis, pathology, or assessment.

If explicitly documented:

- A named Eastern modality may remain as a named intervention.
- An acupoint may remain as a named location/intervention when explicitly stated.
- A client/practitioner statement may be preserved as attributed context.
- The statement cannot become an objective finding or medical conclusion without appropriate Western documentation and clinician verification.

The final SOAP remains Western-format documentation based on:

- Symptoms
- Function
- Anatomy
- Observed/palpated findings
- Movement measures
- Treatment actually performed
- Response
- Follow-up/referral
- Clinician-verified ICD-10-CM reference when applicable

The system does not generate ICD-10-CM codes automatically.

---

## 12. End-session review panel

When the SOAP draft is returned, the workspace shows a separate review panel. This panel is not inserted into the four SOAP fields.

### Technique/reassessment prompts

The panel can recognize explicit language involving:

- Sustained/ischemic compression
- Myofascial release
- Muscle energy/reciprocal inhibition
- Trigger points/taut bands
- Joint mobilization
- Range-of-motion reassessment

It prompts the practitioner to verify:

- Target structure
- Side and region
- Duration, pressure, grade, or dosage when applicable
- Client response
- Whether a finding was reported or observed
- Reassessment using the same measure when appropriate
- Whether improvement was actually documented

### Eastern/Western panel

The panel also displays:

- Whether Eastern terminology was detected
- The detected phrase/category
- How it should be handled in SOAP documentation
- The Western SOAP scope reminder
- The separation notice

The review panel is advisory and therapist-controlled.

---

## 13. Clinician review and export gate

Before export:

1. Read every SOAP field.
2. Correct terminology and laterality.
3. Remove unsupported or inferred content.
4. Confirm that the Assessment does not become an unsupported diagnosis.
5. Confirm that Plan reflects only what was actually stated/decided.
6. Review the safety and Eastern/Western panels.
7. Check the clinician-review checkbox.
8. Export/print the draft.

Export is disabled until the review control is selected. The exported document is a clinician-reviewed draft, not an automatically finalized record.

---

## 14. API and data-flow map

| API boundary | Purpose | Authentication |
|---|---|---|
| `GET /healthz` | Health check | Public |
| `POST /api/v1/auth/session/exchange` | Exchange trusted auth token for secure session | Trusted browser request |
| `POST /api/v1/auth/session/password` | Password session bridge | Trusted browser request/rate limited |
| `GET /api/v1/auth/session` | Session summary | Authenticated |
| `DELETE /api/v1/auth/session` | End session | Authenticated + CSRF |
| `POST /api/v1/public/beta-leads` | Beta interest only; not clinical intake | Public, constrained |
| `POST /api/v1/public/intakes` | Create persistent intake token/submission | Public intake boundary |
| `POST /api/v1/intake/brief` | Retrieve intake and create brief/reviews | Authenticated |
| `POST /api/v1/voice/transcribe` | Audio upload transcription | Authenticated |
| `POST /api/v1/voice/generate-soap` | Text SOAP draft + review objects | Authenticated |
| Secure realtime WebSocket | Live transcription and SOAP request | Authenticated, CSRF/origin checked |

Server-side credentials are kept in the API boundary rather than the browser.

---

## 15. Completed deployment and validation history

| Commit | Completed work |
|---|---|
| `b6ec358` | Intake token wired into workspace and pre-session brief/earpiece flow |
| `ff1c4e3` | Dashboard rebuild with live signal canvas, stats, and intake flow |
| `6b78cc5` | NMT SOAP documentation and PDF/export improvements |
| `4747325` | Synthetic SOAP/dashboard practice script |
| `ef63b6a` | Corrected intake back-view anatomy graphic |
| `2d8ceba` | Cross-device persistent intake tokens |
| `20272f9` | API database bootstrap for intake table |
| `a455fb5` | Guided workflow, intake safety review, terminology review, and session review prompts |
| `2f24073` | Fixed GitHub Pages deployment action pin |
| `5a65bc3` | Eastern/Western SOAP knowledge separation module |

Validation for the latest module:

- 13/13 API tests passed
- TypeScript check passed
- Production API build passed
- Workspace JavaScript syntax check passed
- GitHub Pages deployment completed successfully
- Live workspace asset contains the separation review wiring

---

## 16. What is completed versus what remains

### Completed foundation

- Landing and sign-in routes
- Dashboard shell and navigation
- Public synthetic intake flow
- Front/back body map
- Intake token generation and cross-device persistence
- Authenticated practitioner token lookup
- Pre-session clinical brief
- Intake safety screen
- Massage/NMT terminology suggestions
- Postural observation panel
- Microphone/device flow
- Secure realtime transcription path
- Voice assistant command flow
- Strict four-field SOAP generation
- SOAP review/edit/export gate
- Technique/reassessment review prompts
- Eastern/Western knowledge-layer separation
- Synthetic practice script
- Deployment workflow correction

### Not yet completed

- Production PHI authorization
- HIPAA/BAA/privacy/security readiness
- Jurisdiction-specific scope-of-practice rules
- Human-reviewed evidence library with citations and evidence strength
- Full accept/edit/dismiss controls for each recommendation
- Automated before/after progress comparison
- Therapist-approved client-facing progress summary
- Referral directory and referral messaging workflow
- Automated appointment hold/confirmation/referral notification system
- Full clinical validation and organizational approval
- Complete operational incident-response and monitoring program

---

## 17. Safe operating rule for the current beta

Use the supplied practice script and synthetic data only.

A successful synthetic run is:

1. Sign in.
2. Open the dashboard.
3. Create/open the intake flow.
4. Submit fictional intake information.
5. Load the token in the workspace.
6. Read the brief and safety review.
7. Record fictional posture findings.
8. Start a short voice session.
9. Generate a SOAP draft.
10. Review the four fields and the separate review panels.
11. Confirm the review gate.
12. Export only the synthetic draft.
13. Clear the practice data.

This confirms that the interface and workflow operate. It does **not** establish clinical validity, HIPAA authorization, vendor compliance, medical clearance, or permission to use real client information.
