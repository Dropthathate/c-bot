# SomaSyncAI Deployment Status — August 26, 2026

## Observed production state

The public frontend at `https://www.somasyncai.com` currently serves asset `assets/index-DcpF-gSK.js`. That bundle still contains the `http://localhost:4000/api/v1` fallback and does not include the beta-access repair committed as `2772c00`.

`https://api.somasyncai.com/healthz` does not resolve in DNS, so no public API hostname currently exists for the beta-lead endpoint.

The `c-bot` Vercel project is active and its environment-variable inventory includes `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. It does not list `VITE_CLINICAL_API_URL`, which the repaired production build requires. The Vercel project is only the static frontend host; it does not deploy the sibling Express API.

## Consequence

No live end-to-end beta-email capture can be verified until an HTTPS API service and a database with the `beta_leads` schema are deployed, the frontend receives the service URL via `VITE_CLINICAL_API_URL`, and a new production build succeeds.
The connected browser session is not authenticated to Supabase. Its dashboard redirects to the Supabase sign-in screen, so the existing `api.leads` migration cannot be checked or applied through the authorized dashboard without a later user login.

## Live frontend update

After commit `48dd00a` was pushed, `https://www.somasyncai.com` began serving `assets/index-CFfhpDXY.js`. The deployed bundle contains the `beta_leads` Supabase insertion path and no longer contains the former `http://localhost:4000/api/v1` beta-lead fallback.

## Remaining activation requirement

The deployed frontend can now submit beta signups only after the Supabase migration `c-bot/supabase/migrations/20260826000000_create_public_beta_leads.sql` is applied to the configured production project. The connected browser is not authenticated to Supabase, so applying that migration and performing an end-to-end live insertion test requires a later authorized Supabase sign-in.
