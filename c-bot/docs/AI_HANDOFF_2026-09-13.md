# SomaSync AI Handoff Summary

## Current objective

The requested product flow is a low-friction, one-time clinical documentation session. A user should enter an email address, receive a verification link, complete a temporary session without entering personal identifiers or retaining a recording, review a structured SOAP note, save it as a PDF, and review ICD-10-CM reference suggestions. The implementation must minimize new infrastructure and avoid unnecessary AI usage because the owner has limited Manus credits.

## Repository and deployment

The repository is `Dropthathate/c-bot`. The Vercel project is `c-bot`, deployed from the GitHub `main` branch. The production custom domain is `https://somasyncai.com/`.

The animated waveform workspace is live at `https://somasyncai.com/clinical-workspace/`. Its static assets were restored from the historical branch `feature/gold-standard-realtime-clinical-workspace` in commit `d407445c79b1527ea124378f802c2d86351f2601`, titled `Restore public waveform clinical workspace`.

## Work completed in this turn

| Area | Implementation | Files |
|---|---|---|
| Email sign-in | Added Supabase passwordless magic-link sign-in. A new email can create an account when Supabase email sign-ups are enabled. The link verifies the email and redirects to the requested path. | `src/context/AuthContext.jsx`, `src/pages/Login.jsx` |
| Verification UI | Replaced the password-only login form with an email-only form that shows an inbox verification state and preserves `?next=` routing. | `src/pages/Login.jsx`, `src/App.css` |
| PDF export | Added a `Save PDF` action for a generated SOAP note. It opens the browser print dialog with print-only styling so the user can choose “Save as PDF.” | `src/pages/SoapGenerator.jsx`, `src/App.css` |
| Ephemeral audio handling | Cleared the in-memory audio chunk reference immediately after creating the one-request Blob and retained the existing microphone-track shutdown behavior. | `src/pages/SoapGenerator.jsx` |
| ICD-10 references | The existing SOAP generator already renders returned `icd10` references, and the existing dashboard includes a searchable illustrative ICD-10-CM reference picker with official-source disclaimer. | `src/pages/SoapGenerator.jsx`, `src/pages/IcdCoder.jsx` |
| AI continuation | Added this document for continuation by another AI. | `docs/AI_HANDOFF_2026-09-13.md` |

## Important architecture facts

The React dashboard uses Supabase sessions. The clinical API accepts a Supabase access token in the `Authorization: Bearer <token>` header. The frontend clinical API wrapper already retrieves that token through `supabase.auth.getSession()` before transcription and SOAP-generation requests.

The animated `/clinical-workspace/` route is a separate static application. Its current `app.js` checks `GET /api/v1/auth/session` with cookies, but the current Express API exposes `/api/v1/voice/*` and does not expose that cookie session endpoint. Therefore, the static waveform page can be publicly loaded, but its secure-session gate will continue to require the API session mechanism until the two auth flows are explicitly unified.

This distinction is the highest-priority follow-up. Do not claim that a magic-link login unlocks the static waveform workspace until the static workspace sends the Supabase bearer token to the API or the API provides a verified Supabase-to-session bridge.

## Required Supabase configuration

In the Supabase project used by Vercel, verify the following settings before testing a new account:

1. Email provider is enabled.
2. New user sign-ups are allowed.
3. The production redirect URL includes `https://somasyncai.com/dashboard`.
4. The production redirect URL includes `https://somasyncai.com/clinical-workspace/` if the static workspace is made to consume the Supabase session.
5. The Vercel production environment contains `VITE_SUPABASE_URL` or `VITE_SUPABASE_PROJECT_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` or `VITE_SUPABASE_ANON_KEY`.
6. The clinical API has matching Supabase issuer, JWKS, and audience configuration.

## Privacy boundary

The current client clears microphone tracks when a session ends and clears the in-memory audio chunk array before processing. The existing UI instructs users not to enter identifiable patient information unless their practice has approved the applicable safeguards. This is a product boundary, not proof of a complete legal or compliance posture.

Before marketing “not recorded” as an absolute guarantee, inspect the API and its upstream transcription provider for request logging, temporary file handling, retention, and model-provider data policies. The correct user-facing wording should be “audio is not retained by this browser session after processing” unless server-side retention has been independently verified.

## Recommended next implementation steps

### 1. Unify waveform authentication

Choose one of these approaches:

| Approach | Result | Recommendation |
|---|---|---|
| Pass Supabase bearer token from the static workspace to `/voice/*` and `/auth/session` | One identity system and no duplicate cookies | Preferred |
| Add an API endpoint that exchanges a verified Supabase bearer token for a short-lived HttpOnly workspace cookie | Keeps static workspace code simple but adds a session bridge | Acceptable if cookie isolation is required |
| Keep separate Vercel/clinical API login | Two account systems and confusing redirects | Do not continue this design |

The preferred path is to update static `app.js` so it obtains a Supabase access token and sends `Authorization: Bearer <token>` to the API. Update `verifySession()` to call a real API health/session endpoint that validates that bearer token. Update the API route if needed; do not weaken authentication.

### 2. Add an explicit “End and erase session” action

After PDF export, provide a control that clears transcript, SOAP fields, selected codes, in-memory audio, and temporary UI state. Keep the downloaded PDF under the user’s control. Do not store the note in browser local storage by default.

### 3. Improve ICD-10 safety

Keep ICD-10-CM suggestions as references only. Label generated codes as “suggested references,” require clinician/coder verification, and link to the current official browser. Do not represent the feature as a diagnosis, billing decision, payer decision, or medical-necessity determination.

### 4. Verify the complete user journey

Test with a fresh email address: open the live workspace, follow sign-in, receive the email, return to the intended workspace, grant microphone permission, record a short non-identifying sample, end the session, review the SOAP draft, save the PDF, and confirm the browser session no longer holds microphone tracks or the raw audio chunks.

## Validation already performed

`npm run build:dev` completed successfully in the local clone. The production build was not run locally because the clone lacks the deployment’s required Supabase environment variables; Vercel is expected to provide those variables during deployment.

The live production waveform route returned HTTP 200 and contained the expected Clinical Workspace title, `signalCanvas` markup, and animation script.

## Files to inspect first

- `src/context/AuthContext.jsx`
- `src/pages/Login.jsx`
- `src/pages/SoapGenerator.jsx`
- `src/pages/IcdCoder.jsx`
- `src/lib/clinicalApi.js`
- `public/clinical-workspace/assets/app.js`
- `public/clinical-workspace/index.html`
- `api/src/auth.ts`
- `api/src/app.ts`
- `api/src/routes/voice.ts`

## Completion criteria

The work is complete when a fresh user can verify by email, reach the waveform workspace without a second account system, complete one non-identifying session, receive a reviewed SOAP draft with clearly labeled ICD-10 references, save a clean PDF, and end the session with raw audio and note data cleared from transient browser state. The system must preserve clinician review requirements and must not make unsupported “HIPAA compliant” or absolute “never recorded” claims.

## References

[1]: https://supabase.com/docs/guides/auth/auth-email "Supabase email authentication documentation"
[2]: https://icd10cmtool.cdc.gov/ "CDC/NCHS ICD-10-CM Browser"
