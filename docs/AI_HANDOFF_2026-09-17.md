# AI Handoff — SomaSyncAI Platform
**Date:** 2026-09-17
**Repo:** Dropthathate/c-bot
**Production:** https://somasyncai.com
**API:** https://api.somasyncai.com
**Local clone:** /tmp/c-bot-inspect

---

## What SomaSyncAI Is

SomaSyncAI is a multi-tenant clinical operating system for manual therapy practitioners — neuromuscular therapists (NMT), massage therapists, chiropractors, and physical therapists. It was conceived and built by a CAMTC-certified NMT practitioner (NHI Graduate, Group 208, 1,250+ clinical hours).

**Core value proposition:**
- Documents clinical sessions in real time while therapist hands stay on the client
- Live voice pipeline: mic → Deepgram STT → realtime transcript → Bedrock SOAP generation
- Pre-session clinical intelligence delivered through earpiece based on client intake data
- NMT-informed SOAP notes grounded in trigger point anatomy and biopsychosocial context
- Clinician review required before any note exports — AI never finalizes a record
- Postural assessment orientation before contact — pointing therapist to anatomically likely structures based on intake, without diagnosing

**Business model:** Multi-tenant SaaS. $49/mo solo, $129/mo small clinic, $299/mo multi-location. Free during beta.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript, Vercel |
| Auth | Supabase magic-link (no passwords) |
| Clinical workspace | Vanilla static HTML/JS at public/clinical-workspace/ |
| Intake form | Vanilla static HTML/JS at public/intake/ |
| API | Node.js + Express + TypeScript |
| AI SOAP | AWS Bedrock (Claude Sonnet) |
| AI Intake brief | AWS Bedrock (Claude Sonnet) |
| STT | Deepgram live WebSocket |
| DB | Supabase PostgreSQL |
| Email | Resend via nate@somasyncai.com |
| Intake notifications | Google Apps Script (temporary, pre-BAA) |

---

## Repository Structure

```
c-bot/
  src/
    pages/Landing.jsx          marketing landing page
    pages/Login.jsx            Supabase magic-link login
    pages/SecureSpace.jsx      legacy React approximation (NOT served at /clinical-workspace/)
    context/AuthContext.jsx    Supabase auth provider
    App.jsx                    React router (dashboard routes only)
  public/
    clinical-workspace/        EXACT staging workspace (vanilla static) — the product
      index.html               auth bridge + workspace shell
      assets/workspace.js      full clinical session engine + voice assistant
      assets/workspace.css     dark teal UI
      assets/config.js         API URLs, voice commands, session config
      assets/audio-worklet.js  PCM audio capture
    intake/
      index.html               Somatic Intake Protocol (SIP) — 5-step anonymous form
    calendar/                  calendar sub-app
  vercel.json                  routing, security headers

api/
  src/
    app.ts                     route registration, CORS, middleware
    server.ts                  HTTP + WebSocket server
    auth.ts                    Supabase JWT validation, session cookies, CSRF
    config.ts                  environment variable schema
    realtime.ts                WebSocket STT pipeline (Deepgram)
    routes/session.ts          POST /auth/session/exchange, GET/DELETE /auth/session
    routes/voice.ts            REST transcription/SOAP (SoapGenerator dependency)
    routes/intake.ts           POST /intake/brief (pre-session clinical brief) — BUILT, NOT YET WIRED TO WORKSPACE
    services/bedrock.ts        strict tool-use SOAP via Bedrock
    services/clinical-prompt.ts all system prompts, schemas, intake brief prompt
    services/deepgram-live.ts  Deepgram WebSocket client
  test/clinical-contract.test.ts  5 tests, all passing
  scripts/validate-clinical-context-refactor.mjs  safeguard validator
```

---

## Authentication Flow

```
CTA click -> /login?next=%2Fclinical-workspace%2F
-> Supabase magic link
-> lands on /clinical-workspace/
-> index.html: POST /api/v1/auth/session/exchange (Authorization: Bearer <token>)
-> API validates JWT, sets HttpOnly session cookie + CSRF cookie
-> workspace.js verifySession() confirms cookie
-> voice assistant boots, earpiece ready
```

---

## Voice Assistant (workspace.js)

Always-on SpeechRecognition. Commands:

| Phrase | Action |
|---|---|
| "begin session" | pre-session checklist then starts session |
| "noting" | opens audio gate to Deepgram |
| "pause" | closes audio gate |
| "end session" | grounding-out prompt, closes session |
| "replay" | reads last 3 segments via SpeechSynthesis |
| "time check" | reads remaining session time |
| "client check" | prompts symptom confirmation |
| "soma okay" | dismisses active spoken reminder |

Automatic earpiece reminders: area coverage at session thirds, body mechanics every 20min, time at 15 and 5min remaining, touch permission at 2min, grounding in and out.

Pre-session checklist: ground in, disclosure script, pressure prefs, areas to avoid, session brief.

---

## Somatic Intake Protocol (SIP) — /intake/

Anonymous 5-step client intake. No name collected. Token-based only (ss-XXXXXX format).

- Step 1: Interactive SVG body map front+back, tap to mark primary/secondary/radiation dots, anatomical region labels
- Step 2: 9 sensation quality chips + draggable duration timeline + biopsychosocial coincide triggers
- Step 3: Functional Impact Scale — 10 activities rated 1-5 dots (replaces 0-10 pain scale)
- Step 4: Stress/sleep sliders, posture chips, open notes
- Step 5: Pressure preference, areas to avoid, session goals, consent checkbox

On submit: token in sessionStorage, summary POSTed to Apps Script -> email to drophategrx@gmail.com + Google Sheet Intake tab.

PLANNED: route intake email to authenticated practitioner's account email. Store in Supabase once BAA is active.

---

## Pre-Session Clinical Brief — /api/v1/intake/brief

POST /api/v1/intake/brief
Auth: session cookie + CSRF
Body: { summary: string }

Returns:
```json
{
  "brief": {
    "postural_assessment_priorities": "...",
    "likely_involved_structures": "...",
    "clinical_reasoning": "...",
    "session_priorities": "...",
    "therapist_prompts": "...",
    "biopsychosocial_flags": "..."
  }
}
```

NMT-specific system prompt: Travell & Simons trigger point referral maps, upper/lower crossed syndrome, layered syndrome, biopsychosocial model. Never diagnoses. Language: "consistent with", "consider", "warrants assessment."

NOT YET WIRED TO WORKSPACE. This is the immediate next task.

---

## What Is Not Built Yet — Next Tasks In Order

### 1. IMMEDIATE: Wire intake token into workspace
- Add token input to clinical-workspace/index.html before session starts
- workspace.js fetches /api/v1/intake/brief with token summary
- Brief fields fed into earpiece pre-session checklist
- Files: index.html, workspace.js, api/src/routes/intake.ts (add GET by token)

### 2. Authenticated dashboard
Full post-login page with:
- Live animated breathing signal canvas (idle state)
- Today's intake queue (tokens waiting)
- Copy intake link button
- Clinical tip of day
- Session history
- News feed (pain science, manual therapy research)
- Session stats and streak

### 3. Multi-tenant intake routing
- Supabase practitioners table
- Intake URL accepts practitioner_id param
- Intake email routes to practitioner account email
- Each practice fully isolated

### 4. RAG clinical knowledge base
- Founder's NHI clinical notes (PDF, Adobe Acrobat)
- Travell & Simons trigger point volumes
- Pain neuroscience literature (Moseley)
- Biopsychosocial outcome studies
- Architecture: Supabase pgvector (already in stack, needs BAA first)

### 5. Supabase BAA + Team plan upgrade
$25/mo. Required before storing any PHI. Request at supabase.com Settings > Legal > Request BAA.

---

## Environment Variables (API)

```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_JWKS_URI
SUPABASE_JWT_ISSUER
SUPABASE_JWT_AUDIENCE
AWS_REGION
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
BEDROCK_MODEL_ID
DEEPGRAM_API_KEY
SESSION_COOKIE_NAME
SESSION_HMAC_SECRET
CSRF_COOKIE_NAME
CORS_ORIGINS
```

---

## Critical Rules — Never Break

1. Never deploy partial UI — if env var or API piece missing, stop and report
2. Clinician review gate is non-negotiable — exportDraft locked until clinicianReviewed checked
3. No PHI in event logs — state codes only, never transcript/SOAP/audio/identifiers
4. Audio gate — Deepgram receives PCM only when assistant.logActive === true
5. No credentials in browser code — Deepgram/AWS/Supabase service keys are API-only
6. Strict SOAP schema — four fields only, model rejects anything outside
7. Do not merge staging branch wholesale — cherry-pick only from origin/feature/clinical-context-vanilla-refactor
8. SecureSpace.jsx is NOT served at /clinical-workspace/ — the vanilla static workspace is the product

---

## Test Commands

```bash
cd /tmp/c-bot-inspect/c-bot && npm run build:dev
cd /tmp/c-bot-inspect/api && npm run build
cd /tmp/c-bot-inspect/api && npm test
node /tmp/c-bot-inspect/api/scripts/validate-clinical-context-refactor.mjs
```

---

## Brand

Colors: teal #00c9a7, navy #050d14, panel #0a1825, ink #eef4f7
Typography: Syne (headings 700/800), Inter (body 400/500/600)
Favicon: soma.jpg — 3D S-form with waveform, teal on black
Names: SomaSyncAI, ΛΛLIYΛH (parent ecosystem), DropTheHate Network
Voice: practitioner-first, specific over generic, no AI slop

---

## Current Commit State (main)

b856804 New SomaSyncAI logo — favicon
eceb346 Fix body map labels
14511bc Wire intake to Apps Script
34ab84f Add Somatic Intake Protocol
16285e8 Rebuild landing page
d9a885b Add voice assistant engine
839e1e0 Restore exact staging Secure Space

---

## Contact

Builder: Nate
Email: drophategrx@gmail.com / nate@somasyncai.com
GitHub: Dropthathate
