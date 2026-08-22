# SomaSync AI / c-bot Completion Runbook

> **Draft operational guide — review with qualified counsel and your security lead before using it to authorize PHI.** This runbook describes the current code and a practical launch sequence. It is not a HIPAA certification, a legal opinion, or a substitute for the organization’s formal risk analysis, BAAs, policies, training, and approval process.

## 1. What Exists Today

The public application is the `c-bot/c-bot` Vite frontend, currently published at `https://www.somasyncai.com`. The production clinical service is a separate Express application at `c-bot/api`. The frontend never contains Deepgram, AWS, Bedrock, database, or encryption credentials. The API is the intended server-side boundary for authenticated voice transcription and SOAP-note generation.

| Area | Current status | Meaning |
| --- | --- | --- |
| Public website | Deployed and crawlable through `www.somasyncai.com` and `somasyncai.com` | Suitable for public product information and a **no-PHI beta**. |
| Supabase browser configuration | Intentionally absent in the public Vercel environment | The site stays available; account sign-in and clinical calls are disabled rather than failing at startup. |
| Therapist login | Frontend/client support exists, but the production identity project and invitation workflow are not yet configured | Do not promise active therapist accounts until Step 4 is completed. |
| Clinical API | Express source, JWT verification, Deepgram no-store calls, Bedrock SOAP generation, and PostgreSQL schema are present in `../api` | It is not deployed or approved for PHI. |
| BAA/readiness artifacts | Template and operational documents are in this repository | They require legal and organizational completion, not merely code review. |
| PHI status | **Prohibited** | Do not submit client audio, notes, identifiers, insurance data, or clinical content. |

## 2. Choose the Right Launch Stage

Do not mix the stages below. The active system should remain in one stage until the next stage’s completion criteria are satisfied.

| Stage | Allowed use | Required configuration | PHI permitted? |
| --- | --- | --- | --- |
| A. Public site | Marketing, interest capture, legal pages, product explanation | Domain, SEO, public Vercel deployment | **No** |
| B. Authenticated no-PHI beta | Owner/therapist sign-in, non-identifying product walkthroughs, synthetic testing | Supabase Auth, invite-only access, roles, Vercel public identity variables | **No** |
| C. PHI pilot | Authorized clinicians, real audio/transcripts/notes under an approved program | Signed BAAs, private AWS API/RDS, vendor controls, risk analysis, tested operations, written approval | **Yes, only after authorization** |

## 3. Immediate Owner Checklist: Public Site

Complete these items now. They do not require a BAA because they do not authorize PHI handling.

| Task | Where | Exact setting or action | Done when |
| --- | --- | --- | --- |
| Confirm canonical domain | Vercel → Project → Settings → Domains | Keep `www.somasyncai.com` and `somasyncai.com`; choose one canonical redirect behavior and use `https://www.somasyncai.com/` in site metadata. | Both domains return HTTPS and one redirects consistently. |
| Confirm live production branch | Vercel → Project → Git | Production branch: `main`. | Latest GitHub commit is marked **READY**. |
| Preserve Vercel protection distinction | Vercel → Project → Settings → Deployment Protection | The `*.vercel.app` branch alias may remain protected; public users must receive the custom domain only. | Custom domain is public; protected alias is not used in marketing. |
| Submit SEO assets | Google Search Console and Bing Webmaster Tools | Add the canonical domain, verify ownership, submit `/sitemap.xml`. | Both tools accept `https://www.somasyncai.com/sitemap.xml`. |
| Validate social preview | Social debuggers | Refresh the URL after deployment so cache refreshes use `/og-preview.png`. | The 1200×630 SomaSync preview renders. |

The deployed SEO assets are `public/robots.txt`, `public/sitemap.xml`, `public/site.webmanifest`, `public/favicon.png`, and `public/og-preview.png`. The `index.html` metadata includes canonical, Open Graph, Twitter, JSON-LD, and favicon references. Do not replace the official SomaSync favicon with a third-party association mark.

## 4. Enable Therapist Accounts for a No-PHI Beta

**Recommended provider:** use **Supabase Auth** because c-bot already validates Supabase user sessions in the browser and verifies Supabase JWTs in the Express API. Supabase states that PHI environments require a signed BAA and HIPAA project controls; this is not required merely to configure an account-only, no-PHI beta, but is required before PHI use.[1]

### 4.1 Create the Supabase Auth Project

1. Create a Supabase project dedicated to SomaSync. Use a business-owned email and enable MFA for the project owner.
2. In **Authentication → URL Configuration**, set **Site URL** to `https://www.somasyncai.com`.
3. Add approved redirect URLs, at minimum:

   ```text
   https://www.somasyncai.com/**
   https://somasyncai.com/**
   http://localhost:5173/**
   ```

4. In **Authentication → Providers**, enable email/password or email magic-link only. Do not enable social providers unless you have a policy reason to collect the relevant provider data.
5. In **Authentication → Settings**, require email confirmation and disable open public sign-up. Use invitations administered by the owner instead.
6. Create the initial owner account through the Supabase dashboard. For the temporary no-PHI beta, invite additional therapists through the dashboard rather than exposing a public registration form.

> The current c-bot code can validate a Supabase session but does **not** yet include a production owner console, invitation endpoint, therapist role store, or role enforcement in the API. Those are implementation tasks before treating a multi-therapist beta as operationally complete.

### 4.2 Add Vercel Browser Variables

In **Vercel → c-bot Project → Settings → Environment Variables**, add the following for **Production**, **Preview**, and your local development equivalent. Vite embeds `VITE_*` values into the browser bundle, so only public identifiers belong here.

| Name | Production value | Sensitivity |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | `https://<your-project-ref>.supabase.co` | Public browser configuration |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | The Supabase publishable/anon key | Public browser configuration |
| `VITE_CLINICAL_API_URL` | `https://api.somasyncai.com/api/v1` after the API is deployed | Public endpoint URL only |

Never enter `SUPABASE_SERVICE_ROLE_KEY`, Deepgram credentials, AWS credentials, database URLs, signing secrets, or encryption keys in Vercel frontend variables. After setting variables, redeploy `main`. The current frontend fallback means the public site remains available if these variables are missing; account and clinical functions remain unavailable by design.

### 4.3 Complete the Missing Role and Invitation Code

Before you call this a therapist-account product, implement the following in the API and database. These items are **not yet complete** in the current repository.

| Needed change | Recommended implementation | Acceptance evidence |
| --- | --- | --- |
| Role model | Add `app_users`/`therapist_profiles` data with `owner`, `practice_admin`, and `therapist` roles, linked to the Supabase JWT `sub`. | A role matrix and migration reviewed by the owner. |
| Invite workflow | Add an API-only owner action that validates the caller role, creates an invite through the Supabase Admin API, and records the action. | Invite succeeds for an approved email; non-owners receive 403. |
| API authorization | Extend `api/src/auth.ts` so it resolves the authenticated `sub` to a local role and verifies scope before every protected operation. | Unit/integration tests prove cross-therapist access is denied. |
| Therapist record mapping | On approved onboarding, derive a stable hash from the authenticated `sub` and create/reconcile `therapists.external_subject_hash`. | A signed-in therapist maps to one local therapist record. |
| Deprovisioning | Disable user, revoke session, remove roles, rotate credentials where necessary, and retain approval evidence. | A tested leaver procedure. |
| MFA | Require or enforce MFA for owner/admin roles according to your approved policy. | MFA test evidence and access-review record. |

## 5. Provision the Clinical API on AWS

Do **not** place the API in Vercel as a frontend function. Deploy `../api` as an AWS container service behind TLS.

### 5.1 Required AWS Services and Settings

| Component | Recommended setup | Critical settings |
| --- | --- | --- |
| Account | Dedicated AWS account or clearly segregated environment | Enable MFA, CloudTrail/central logging, named break-glass procedure, and least privilege. |
| Container registry | Amazon ECR | Build from `api/Dockerfile`; scan image before release. |
| Runtime | ECS Fargate preferred for the MVP, or a managed EC2 container runtime | Private subnets; task role only; no static AWS keys in the image. |
| Ingress | Application Load Balancer or API Gateway | Valid TLS certificate, HTTP-to-HTTPS redirect, health path `/healthz`, rate limiting/WAF policy. |
| Database | Amazon RDS for PostgreSQL | Private subnets, storage encryption, encrypted backups, Multi-AZ decision, backup restore test, no public endpoint. |
| Secrets | AWS Secrets Manager or SSM Parameter Store | Runtime reads secrets; no secret is committed or embedded in an image. |
| Observability | CloudWatch plus an approved alerting route | Redact authorization headers, bodies, audio metadata, transcript, note text, and identifiers from logs. |

### 5.2 API Environment Values

Use `api/.env.example` as the canonical inventory. In production, set the following values in Secrets Manager or Parameter Store, then map them into the container runtime.

| Variable | Production requirement |
| --- | --- |
| `NODE_ENV` | `production` |
| `PORT` | Runtime/container port, such as `4000` |
| `REQUIRE_HTTPS` | `true` |
| `CORS_ORIGINS` | Exact frontend domains only, for example `https://www.somasyncai.com,https://somasyncai.com` |
| `SUPABASE_URL` | Same project URL used by Auth |
| `SUPABASE_JWKS_URL` | `https://<project-ref>.supabase.co/auth/v1/.well-known/jwks.json` |
| `SUPABASE_JWT_ISSUER` | `https://<project-ref>.supabase.co/auth/v1` |
| `SUPABASE_JWT_AUDIENCE` | `authenticated` unless your approved identity design uses a different audience |
| `DEEPGRAM_API_KEY` | Secrets Manager value; never browser-visible |
| `DEEPGRAM_MODEL` | Approved transcription model, currently `nova-3` in the template |
| `AWS_REGION` | Region where you have approved Bedrock model access |
| `BEDROCK_MODEL_ID` | Approved Claude 3 model identifier, currently Haiku in the template |
| `DATABASE_URL` | Runtime database user only; never RDS master credentials |
| `DB_SSL` | `true` |
| `DB_CA_CERT_BASE64` | Current validated RDS CA bundle, base64 encoded |

The API currently exposes authenticated `POST /api/v1/voice/transcribe` and `POST /api/v1/voice/generate-soap` routes. It holds uploaded audio in memory and uses the configured no-store Deepgram request path; it does not currently persist sessions from those routes. The `therapists`, `clients`, and `sessions` schema is prepared for a later session-storage path, but persistence, audit trails, role authorization, and application-level encryption key management need completion before PHI enablement.

### 5.3 Database and Model Setup

1. Create an RDS PostgreSQL instance with private networking and TLS. Create separate `migration` and `runtime` database users. The runtime user must not own the schema or use the RDS master account.
2. Apply `api/db/schema.sql` only through the migration role:

   ```bash
   psql "$DATABASE_URL" -f db/schema.sql
   ```

3. In AWS Bedrock, request/confirm access to the chosen model and attach an IAM task role scoped to only `bedrock:InvokeModel` for that approved model.
4. Test `/healthz` with no PHI, then test identity rejection, invalid audio rejection, transcript generation, and SOAP generation with synthetic content only.

## 6. Vendor, BAA, and Legal Gates Before PHI

The following actions must be completed **before** permitting real client content. HHS explains that the business-associate relationship and contract requirement arise when a covered entity or business associate uses another party to create, receive, maintain, or transmit PHI on its behalf.[2]

| Counterparty | Action before PHI | Owner |
| --- | --- | --- |
| Each therapist/clinic customer | Execute the SomaSync downstream BAA in `docs/BAA_TEMPLATE.md`, reviewed for the actual parties and applicable state law. | Founder + counsel |
| Supabase | Use an eligible HIPAA environment, execute its BAA, and apply the HIPAA project controls if it will handle PHI. | Founder + security owner |
| AWS | Execute the applicable AWS BAA/Addendum and restrict the architecture to services in scope for your approved use. | Founder + AWS account owner |
| Deepgram | Obtain and execute the appropriate agreement/BAA for the selected product and your PHI use case; document the approved data-retention configuration. | Founder + counsel/privacy owner |
| Vercel/hosting, analytics, email, support, error tracking | Document whether each can receive PHI. Keep PHI out of frontend telemetry and public hosting unless you have a reviewed agreement and approved architecture. | Security/privacy owner |
| Subprocessors | Maintain the `docs/VENDOR_INVENTORY.csv` with agreement, region, retention, and owner fields completed. | Security/privacy owner |

The BAA template is a working contract draft, not an automatically executed agreement. HHS notes that sample provisions do not replace legal review or the contract requirements that may apply under state law.[2]

## 7. Required Security and Clinical Operations

Complete these operating controls; code alone cannot complete them.

| Workstream | Required action | Existing repository artifact |
| --- | --- | --- |
| Access reviews | Run quarterly and after privileged-role changes; compare users with approved roles, remove stale access, and retain evidence. | `docs/ACCESS_REVIEW.md` |
| Vendor management | Complete the vendor inventory, document PHI role/region/retention/subprocessors, and record approval. | `docs/VENDOR_INVENTORY.csv` |
| Incident response | Name responders, establish notification path, preserve evidence, test a tabletop exercise, and get legal review. | `docs/PRODUCTION_ACCEPTANCE.md` |
| Risk analysis | Perform and document a HIPAA Security Rule risk analysis and treatment decisions. | `docs/HIPAA_READINESS.md` |
| Logging | Prove no audio, transcript, note, identifiers, or authorization headers appear in telemetry/logs. | `api/deploy/AWS_DEPLOYMENT.md` |
| Clinical review | Create clinician training, review/sign-off rules, and clear product limits. Generated SOAP drafts are not final records. | `docs/HIPAA_READINESS.md` |
| Vulnerabilities | Resolve or formally accept the outstanding frontend dependency findings, then re-run audit before PHI approval. | `docs/PRODUCTION_ACCEPTANCE.md` |

## 8. Testing and Go-Live Evidence

Run all tests with synthetic data until the written PHI approval exists.

| Test | Expected result |
| --- | --- |
| Public browser smoke test | Homepage renders; no Supabase missing-variable exception; SEO, favicon, and social preview return HTTP 200. |
| Authentication | Owner can invite an approved therapist; uninvited sign-up is blocked; MFA policy is enforced for privileged roles. |
| API authentication | Missing/invalid token returns 401; therapist token cannot access another therapist’s session data. |
| Clinical handling | Audio route accepts only intended media under the size limit; no audio remains on disk; no sensitive body appears in logs. |
| Database | Runtime connection requires TLS; RDS certificate validates; backup restoration test succeeds; runtime user has least privilege. |
| Incident exercise | Team can disable a user, rotate a secret, preserve logs, document a timeline, and reach counsel/security contacts. |
| Privacy/legal review | Privacy notice, terms, BAA, vendor inventory, and user-facing product claims are approved and consistent. |

The accountable executive—not the developer or AI—must sign the final production acceptance record before changing the product’s no-PHI boundary.

## 9. Change Record: Original SomaSync AI vs. c-bot

The original project remains at `/home/ubuntu/somasync-ai` with checkpoints `6c589d5` and `df7813e`. It is a separate static React/Tailwind project, not the production c-bot repository.

| Original SomaSync AI change | Location | Migrated into c-bot? | Notes |
| --- | --- | --- | --- |
| Clinical Cartography design system and therapist dashboard | `somasync-ai/client/src/pages/Home.tsx`, `index.css`, `ideas.md` | **No direct code migration** | This original dashboard remains a separate visual prototype/reference. |
| Browser audio capture, transcript UI, SOAP-draft UI, local TTS review | `somasync-ai/client` | **No direct code migration** | c-bot has its own UI and now routes clinical calls through `../api`. |
| Original standalone Express/Deepgram/Bedrock/RDS architecture and docs | `somasync-ai-api` and `somasync-ai/docs` | **Reimplemented in c-bot** | c-bot now owns `../api`, its RDS schema, AWS guide, and authenticated clinical boundary. |
| Downstream BAA template | `somasync-ai/docs/DOWNSTREAM_BAA_TEMPLATE.md` | **Copied into c-bot** | Current working template is `c-bot/docs/DOWNSTREAM_BAA_TEMPLATE.md`. |
| Original environment, local setup, architecture docs | `somasync-ai/docs` | **Superseded for c-bot by new docs** | Keep for historical reference; follow c-bot runbook for the production path. |
| Original platform-independent SEO/GEO, favicon, manifest, robots, sitemap, About page, founder JSON-LD | `somasync-ai` checkpoint `df7813e` | **Reimplemented in c-bot** | c-bot now has its own portable SEO assets and official icon; do not rely on the original project for the live site. |

### c-bot Changes Already Delivered

| Commit | Delivered change |
| --- | --- |
| `39a9738` | Portable SEO/GEO, official favicon, BAA/readiness/trust documentation, compliance center, and public product language. |
| `bb919a1` | Express clinical API scaffold, JWT boundary, Deepgram/Bedrock/RDS configuration, hardened browser clinical API client, vendor/access/acceptance docs. |
| `5ad4acc` | No-PHI privacy-policy correction and dedicated 1200×630 social-preview image. |
| `052cba6` | Supabase-missing-config fallback so the public site does not crash when therapist identity is not yet provisioned. |

## 10. Definition of Done

The project is not “finished” at code completion. It is ready for a PHI pilot only when all the following are true:

1. The owner can invite, approve, review, and deprovision individual therapist accounts using a tested role model.
2. The AWS API and RDS deployment are private, encrypted, monitored, backed up, and tested.
3. All relevant BAAs and vendor agreements are executed and filed.
4. The approved vendor inventory, risk analysis, incident response plan, access review, retention/deletion policy, and clinician-review process exist with named owners.
5. Browser/telemetry/logging paths are verified free of PHI, and authenticated API routes enforce least privilege.
6. Frontend dependency issues are remediated or formally accepted, then re-tested.
7. Counsel, the security/privacy owner, and the accountable executive approve the written production acceptance record.

## References

[1] [Supabase: HIPAA Compliance and Supabase](https://supabase.com/docs/guides/security/hipaa-compliance)  
[2] [HHS: Business Associate Contracts and Sample BAA Provisions](https://www.hhs.gov/hipaa/for-professionals/covered-entities/sample-business-associate-agreement-provisions/index.html)  
[3] [AWS: Compliance validation for Amazon Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/compliance-validation.html)  
[4] [c-bot API AWS deployment handoff](../../api/deploy/AWS_DEPLOYMENT.md)  
[5] [c-bot production acceptance record](PRODUCTION_ACCEPTANCE.md)
