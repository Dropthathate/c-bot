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

## Correct Supabase project verified

The authorized production project is **SomaSyncAi_2025** at `https://ucqprtpuuyflnxjmatwo.supabase.co` (project ref `ucqprtpuuyflnxjmatwo`). It is healthy, connected to `Dropthathate/c-bot`, and its dashboard reports no recorded migrations. The separate OPsPilot project was not modified.
The SQL editor refreshed before text entry, and no migration statement was submitted or executed at that point.
The migration was visibly entered in the Supabase SQL editor, but the editor returned `query: Too small: expected string to have >=1 characters` on execution. This indicates the browser editor did not register the injected text as an executable query; no beta-lead schema change was applied.
After the initial execution attempt, the SQL editor still displayed the full migration text but continued to report that no executable query was registered. No database change was confirmed.
The authorized user manually ran the committed migration in the SomaSyncAi_2025 SQL editor, which returned `Success. No rows returned`. A subsequent browser navigation request to the public beta form did not leave the Supabase editor, so the live form will be verified through a separate public request path.
The live frontend currently serves the revised beta-lead code but does not embed either a Supabase project URL or a public key, so the beta form will remain unavailable until its production environment variables are correctly applied. Attempts to inspect the authorized dashboard configuration were blocked by a My Browser extension timeout; no additional settings were changed.
The verified SomaSyncAi_2025 project is accessible through its Data API settings pages, which are the authorized source for the frontend project URL and public publishable key. No setting was changed during this review.
The Data API settings page was opened by direct verified-project URL after the dynamic settings navigation refreshed. No configuration was modified.
The authorized project’s Data API settings currently report `0 of 12 tables exposed`. The `public.beta_leads` table must be explicitly exposed to the Data API before the public beta form can perform its permitted insert. No Data API exposure setting was changed during review.
Immediately before the approved Data API change, the project exposed the `public` schema but no individual table. The only intended table exposure is `public.beta_leads`.
The Data API table selector lists `public.beta_leads` but indicates its schema is not currently exposed. No table setting has been saved; the required prerequisite is to include the `public` schema, then select only `public.beta_leads`.
Selecting the `public` schema revealed that the current unsaved Data API state would automatically expose 11 existing tables because automatic table exposure is enabled. This is broader than approved. The setting has **not been saved** and will be narrowed to the beta-lead table only before any save occurs.
With automatic exposure disabled, the unsaved selector currently marks the existing public tables as exposed. This temporary state has not been saved. The next step is to unselect every current public table except `public.beta_leads`, then save the resulting one-table configuration.
The unsaved selector now excludes `public.beta_access` and `public.beta_signatures`; `public.beta_leads` remains selected. No Data API configuration has been saved yet.
The unsaved selector now excludes `public.clients` and `public.intake_forms`, in addition to the previously removed unrelated tables. `public.beta_leads` remains selected, and the configuration remains unsaved.
The unsaved selector now also excludes `public.leads` and `public.patients`. The dedicated `public.beta_leads` entry remains selected; no Data API configuration has been saved.
The unsaved selector now also excludes `public.profiles` and `public.sessions`. The configuration remains unsaved and continues to retain `public.beta_leads` as the intended sole Data API table.
The unsaved selector now also excludes `public.soap_notes` and `public.user_roles`. All listed unrelated public tables have been removed from the unsaved exposure set; only `public.beta_leads` is intended to remain.
The approved Data API Save action was invoked after narrowing the staged selection. The settings page did not display a success toast in the immediate response, so persistence will be verified with a refreshed page before moving to frontend deployment.
The approved Data API configuration persisted with exactly `1 of 12 tables exposed` and automatic table exposure disabled. The c-bot Vercel project lists `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`, but the live bundle previously lacked both values, indicating that their production scope or deployed values still require correction.
The c-bot Vercel project has `VITE_SUPABASE_PUBLISHABLE_KEY` scoped to Production and Preview and `VITE_SUPABASE_URL` scoped to All Environments. Because the live bundle lacks both, their stored values will be explicitly replaced with the verified SomaSyncAi_2025 public configuration and a fresh production deployment will be triggered.
The existing c-bot Vercel publishable-key variable has an available Edit action. No Vercel variable value has been changed yet.
The Vercel editor now contains the verified SomaSyncAi_2025 publishable key for `VITE_SUPABASE_PUBLISHABLE_KEY`, scoped to Production and Preview. The replacement is staged but not yet saved.
Vercel rejected the staged publishable-key save while the variable remained a Secret. The verified value is still staged but unsaved; it must be set as a public Config variable because its `VITE_` name intentionally embeds it in the browser bundle.
The attempted edit of the existing secret `VITE_SUPABASE_PUBLISHABLE_KEY` was canceled without saving. To preserve the existing secret while correctly exposing the verified public key to the Vite build, the compatible `VITE_SUPABASE_ANON_KEY` fallback will be added as a public Config variable.
A new Vercel environment-variable form is open. It supports a public Config variable scoped to Production, which will be used to add the compatible `VITE_SUPABASE_ANON_KEY` fallback without altering the existing secret.
A new public Config variable named `VITE_SUPABASE_ANON_KEY` is staged for Production. Its value has not yet been entered or saved.
The verified public Config variable `VITE_SUPABASE_ANON_KEY` was successfully added to the c-bot Production environment. Vercel now requires a fresh deployment for the build to include the new value.
Vercel’s production redeploy confirmation is open for the current main deployment, assigned to `somasyncai.com` and `www.somasyncai.com`. The final redeploy action remains pending confirmation execution.
A new c-bot Production deployment was created after the verified public fallback key was added. The live bundle will be checked after the deployment finishes to confirm it embeds the expected beta-capture configuration.
The latest c-bot redeploy is marked Ready in Vercel. A direct deployment-bundle check did not locate an index asset in its initial response, so the deployment’s direct response will be inspected before deciding whether a no-cache redeploy is necessary.
The first fresh deployment embedded the verified public key but not the project URL, confirming the legacy URL variable was not browser-available. The frontend and build guard now prioritize verified public URL and key fallbacks; a local production build passed with both values embedded alongside the beta-lead capture path.
