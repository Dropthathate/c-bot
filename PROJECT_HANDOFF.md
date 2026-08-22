# c-bot / SomaSync AI — Project Handoff

## Purpose and current status

c-bot is the codebase for **SomaSync AI**, a voice-oriented neuromuscular assessment and clinical-documentation product for bodywork practitioners. It consists of a React/Vite/Tailwind frontend in `c-bot/` and a separate Express API in `api/`. The frontend is suitable for development and demo use with its current guardrails. Production clinical use is not complete until the organization finishes the required privacy, security, contracting, validation, and operational work.

> **Critical boundary:** The current beta is not authorized for PHI or client-identifying information. Product notices and consent gates are guardrails, not HIPAA certification or authorization to process PHI.

## Repository map

| Location | What it controls |
|---|---|
| `c-bot/` | React 18, Vite, Tailwind, dashboard, front-end product experience, and static deployment configuration. |
| `api/` | Express service for authenticated transcription and note-draft generation. |
| `api/.env.example` | Environment-variable template; copy locally and never commit secrets. |
| `api/db/` | Database schema and persistence-related files. |
| `api/deploy/AWS_DEPLOYMENT.md` | Controlled AWS deployment plan for the API. |
| `c-bot/vercel.json` | Static frontend build and SPA-routing configuration. |
| `c-bot/docs/HIPAA_READINESS.md` | Production-readiness conditions and compliance boundaries. |

## Run the frontend locally

From the repository root, use the frontend application directory:

```bash
cd c-bot
npm install
npm run dev
```

Use `npm run lint` before sharing changes, `npm run build` to create the production bundle, and `npm run preview` to inspect the built frontend locally. The static build output is `c-bot/dist/`.

## Run the API locally

The API is the server-side boundary for transcription and SOAP-note generation. It—not the browser—holds Deepgram, AWS, database, and encryption credentials.

```bash
cd api
cp .env.example .env
npm install
npm run check
npm run dev
```

Initialize a local database only with synthetic data:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

Never place service keys, database credentials, recordings, PHI, or client-identifying data in the frontend or in Git. Keep local secrets in `api/.env`, which must remain untracked.

## Production deployment sequence

The frontend can be built as a static Vite site. The existing `vercel.json` expects `npm install`, `npm run build`, and `dist/` output, with SPA rewrites for `/login` and `/dashboard/:path*`. If using another static host, reproduce the same SPA fallback behavior and set the API base URL and allowed origins correctly.

The API should be deployed only behind HTTPS through AWS API Gateway or an Application Load Balancer, using a private encrypted PostgreSQL database. The runtime needs an IAM role limited to the approved Bedrock model, secrets held in AWS Secrets Manager, database TLS validation, restricted CORS origins, and `REQUIRE_HTTPS=true` outside local development. Follow `api/deploy/AWS_DEPLOYMENT.md` for the detailed environment, network, logging, and monitoring sequence.

## Production-readiness gate

| Must be complete before PHI or client-identifying data is enabled | Why it matters |
|---|---|
| Business Associate Agreements and vendor configuration | Documents appropriate roles and service boundaries. |
| Security and privacy risk analysis | Identifies real deployment risks and controls. |
| Encrypted private database, TLS, secret management, and access control | Prevents the browser or public infrastructure from holding sensitive credentials or data. |
| Training, consent process, incident response, and operational monitoring | Ensures staff can use the workflow safely and consistently. |
| Clinical, legal, and organizational approval | Product behavior must match the organization’s actual authority and practice. |

## Completion status and next action

The codebase is structured for a controlled pilot and has explicit no-PHI boundaries. The next appropriate action is a **synthetic-data pilot**: deploy the static frontend and API in a non-PHI environment, test sign-in, consent, audio flow, note drafts, error handling, and audit logging, then use the readiness documents to decide whether a regulated production program should proceed.
