# SomaSyncAI Staging Gateway Configuration Runbook

**Scope:** Connect `feature/clinical-context-vanilla-refactor` to a real **staging-only** persistent Node gateway, identity provider, database, and vendor services. This runbook never authorizes a production merge, production database migration, DNS change, or credential disclosure.

> The Vercel preview is a static interface preview. It cannot be the persistent WebSocket gateway. The API container in `api/Dockerfile` must run on a persistent Node/Docker service behind HTTPS with WebSocket upgrade support.

## 1. Target staging topology

Use only staging names under the controlled `somasyncai.com` zone. The preview’s `*.vercel.app` domain cannot share a `.somasyncai.com` cookie, so the actual integration test needs custom staging subdomains.

| Component | Recommended staging identifier | Required property | Contains secrets? |
|---|---|---|---|
| Vanilla clinical workspace | `workspace-staging.somasyncai.com` | Static deployment mapped to `feature/clinical-context-vanilla-refactor` | No |
| Vanilla calendar client | `calendar-staging.somasyncai.com` | Separate static deployment and origin | No |
| Persistent Node gateway | `api-staging.somasyncai.com` | Docker/Node host with HTTPS, HTTP/1.1 upgrade, WSS, health checks, and one staging instance | Yes, server secret manager only |
| Staging PostgreSQL | Provider-private hostname | TLS enabled and reachable only from the staging gateway | Yes, server secret manager only |
| Staging Supabase Auth | Separate staging project URL | Test users only; no production users or service-role key | Public project settings plus a server-held public anon key |

The gateway may run on any managed persistent Node/Docker host that supports a continuously running process and WebSocket upgrades. Do **not** deploy it as a Vercel static artifact or serverless function. For the initial staging test, run one gateway instance so the active WebSocket session remains with the process holding its bounded in-memory stream state.

## 2. External configuration actions required

### 2.1 Provision the persistent gateway host

Create a new staging service from the API directory’s existing Dockerfile. Set the health probe to `GET /healthz`, configure the container port as `4000` (or map the host-provided `$PORT` to the process), and terminate TLS at the host load balancer or reverse proxy. The proxy must forward `X-Forwarded-Proto: https` and support `Connection: Upgrade` / `Upgrade: websocket` for `/api/v1/realtime/transcription`.

Create `api-staging.somasyncai.com` only after the service endpoint is ready. Use a normal DNS record that targets the selected host and has a valid TLS certificate. Do not alter `api.somasyncai.com`, `somasyncai.com`, `www.somasyncai.com`, or existing Cloudflare controls.

### 2.2 Create staging-only static origins

Map the protected branch to `workspace-staging.somasyncai.com`. Deploy the calendar directory as a distinct static project or deployment mapped to `calendar-staging.somasyncai.com`. Configure both public configuration files before this deployment:

| File | Value to set for staging | Do not put here |
|---|---|---|
| `c-bot/public/clinical-workspace/assets/config.js` | `apiBaseUrl: "https://api-staging.somasyncai.com/api/v1"`; approved BLE name prefix and service UUID | Passwords, JWTs, Deepgram key, AWS keys, database URL, CSRF secret |
| `c-bot/calendar/assets/calendar-config.js` | `apiBaseUrl: "https://api-staging.somasyncai.com/api/v1"`; staging access URL | Passwords, JWTs, Deepgram key, AWS keys, database URL, CSRF secret |

The API must allow precisely these two origins. Do not place `https://www.somasyncai.com`, `https://somasyncai.com`, or a Vercel preview URL in the staging allowlist during the first integration test.

### 2.3 Create the staging database

Provision a separate PostgreSQL database and network policy. The database must be empty of patient/client information and reachable from the gateway only. Enable `pgcrypto` before applying the staging migrations because `calendar_time_blocks` uses `gen_random_uuid()`.

After an explicit staging-migration authorization, apply only these two new migrations:

1. `api/db/20260828000000_create_calendar_time_blocks.sql`
2. `api/db/20260828000001_create_clinical_audit_events.sql`

The gateway database identity needs only connection, schema usage, table read/write for `calendar_time_blocks`, and insert-only access to `clinical_audit_events`. Do not reuse a broad owner credential at runtime. The audit ledger is intentionally limited to operational event type, operation, clinician identity, and time; it must never receive raw audio, transcript, SOAP content, patient/client data, cookies, headers, or tokens.

### 2.4 Configure staging Supabase Auth

Create or designate a **staging-only** Supabase Auth project. Configure one synthetic test clinician account and enable the password flow used by the standalone access page. The server-side access route exchanges the credentials with Supabase and returns no access token to browser JavaScript; it sets only secure session cookies after validating the returned token.

Retrieve the staging project URL, the public anon key, the JWKS URL, issuer, and expected `authenticated` audience. Never provide a service-role key to the gateway or browser. The public anon key is still not to be committed to the repository; store it with the gateway’s deployment configuration to keep one controlled staging configuration surface.

### 2.5 Configure speech and structured-drafting vendors

Create a distinct staging Deepgram project/API key. Its key must be available only to the gateway runtime. Permit gateway egress to `api.deepgram.com:443`. The live adapter requests `no_store=true`, but account-level vendor retention and data-processing settings must also be reviewed before any non-synthetic content is contemplated.

Configure the gateway runtime with an AWS workload identity rather than long-lived access keys. Grant the workload identity only `bedrock:InvokeModel` for the chosen **staging** model identifier. Confirm the selected model accepts strict tool use (`strict: true`) and accepts the forced `emit_soap_note` tool choice. The gateway currently uses the Bedrock `InvokeModel` endpoint, not a client-side model call.

## 3. Gateway environment values

Set these values in the selected gateway host’s server-side secret/configuration manager. Values marked **secret** must never be placed in source control, Vercel environment variables exposed to a client build, browser configuration files, logs, terminal output, or chat.

| Variable | Source / owner | Staging value rule | Classification |
|---|---|---|---|
| `NODE_ENV` | Gateway host | `production` so secure-cookie behavior stays on in staging | Configuration |
| `PORT` | Gateway host | `4000` unless the host injects its own port | Configuration |
| `REQUIRE_HTTPS` | Gateway host | `true` | Configuration |
| `CORS_ORIGINS` | Deployment configuration | `https://workspace-staging.somasyncai.com,https://calendar-staging.somasyncai.com` exactly | Configuration |
| `COOKIE_DOMAIN` | Deployment configuration | `.somasyncai.com` | Configuration |
| `SESSION_COOKIE_NAME` | Deployment configuration | `somasync_session` | Configuration |
| `CSRF_COOKIE_NAME` | Deployment configuration | `somasync_csrf` | Configuration |
| `CSRF_HMAC_SECRET` | New random value | At least 32 bytes of high-entropy random material; unique to staging | **Secret** |
| `SESSION_TTL_SECONDS` | Deployment configuration | `28800` initially | Configuration |
| `ALLOW_BEARER_API_TOKENS` | Deployment configuration | `false` | Security control |
| `WS_MAX_PAYLOAD_BYTES` | Deployment configuration | `65536` | Resource limit |
| `WS_MAX_CONNECTIONS_PER_USER` | Deployment configuration | `2` | Resource limit |
| `WS_MAX_MESSAGES_PER_MINUTE` | Deployment configuration | `600` | Resource limit |
| `WS_MAX_SESSION_SECONDS` | Deployment configuration | `10800` | Resource limit |
| `SUPABASE_URL` | Staging Supabase project | Staging project URL only | Configuration |
| `SUPABASE_ANON_KEY` | Staging Supabase project | Staging public anon key, supplied server-side only | Sensitive configuration |
| `SUPABASE_JWKS_URL` | Staging Supabase project | `<staging-url>/auth/v1/.well-known/jwks.json` | Configuration |
| `SUPABASE_JWT_ISSUER` | Staging Supabase project | `<staging-url>/auth/v1` | Configuration |
| `SUPABASE_JWT_AUDIENCE` | Staging Supabase project | `authenticated` unless staging Auth is deliberately configured otherwise | Configuration |
| `DEEPGRAM_API_KEY` | New staging Deepgram project | Server-only staging key | **Secret** |
| `DEEPGRAM_MODEL` | Staging configuration | `nova-3` initially | Configuration |
| `AWS_REGION` | AWS account / region | Region hosting the approved Bedrock model | Configuration |
| `BEDROCK_MODEL_ID` | AWS Bedrock catalog | Model that supports the strict tool contract in this code | Configuration |
| `DATABASE_URL` | Staging database | TLS PostgreSQL connection string for the least-privileged runtime role | **Secret** |
| `DB_SSL` | Staging database | `true` | Security control |
| `DB_CA_CERT_BASE64` | Database provider | Required if the host does not trust the provider CA bundle | **Secret/sensitive configuration** |

## 4. Hardware information required (not a credential)

The browser can stream audio from a user-selected Bluetooth microphone through normal media capture, but Web Bluetooth only manages the BLE GATT companion channel. Before the hardware controls can be activated, obtain the device’s approved integration sheet:

| Required fact | Example format | Why it is needed |
|---|---|---|
| Advertised device-name prefix | `SomaSync` | Limits the browser chooser filter. |
| BLE service UUID | Canonical UUID | Replaces the blank `controlServiceUuid` placeholder. |
| Control characteristic UUIDs | Canonical UUIDs and read/write/notify properties | Allows a user action, not an invented protocol, to control the companion. |
| Battery strategy | Standard Battery Service or custom characteristic | Determines live battery telemetry. |
| Message format and safe commands | Versioned bytes/JSON, acknowledgements, retries | Prevents sending unknown commands to a medical-adjacent hardware device. |
| Firmware version and test device | Exact version; nonclinical device | Makes staging test results repeatable. |

## 5. Ordered staging connection sequence

1. **Do not change production.** Keep `main`, `somasyncai.com`, `www.somasyncai.com`, current `api.somasyncai.com`, and the existing production database untouched.
2. Provision the empty staging database and least-privileged runtime role. Apply the two migrations only after staging-migration approval.
3. Create the staging Supabase project and synthetic clinician account. Record its URL, anon key, JWKS URL, issuer, and audience in the gateway host configuration.
4. Create separate Deepgram staging credentials and grant the gateway workload identity the restricted Bedrock invoke permission. Add these server-side values only.
5. Deploy `api/Dockerfile` as one persistent staging gateway instance. Verify `GET /healthz` through HTTPS and verify WSS upgrade support with no browser or patient data.
6. Add `api-staging.somasyncai.com`, `workspace-staging.somasyncai.com`, and `calendar-staging.somasyncai.com` after their targets are ready. Reuse the controlled root domain only; do not alter production records.
7. Set the API’s exact staging CORS origins and `.somasyncai.com` cookie domain. Update the two public static config files with only the staging API base URL and hardware UUID facts.
8. Deploy the branch to the two staging static origins. Do not use the temporary `*.vercel.app` URL for real cookie-bridge testing.
9. Execute synthetic end-to-end tests: sign in, confirm Secure/HttpOnly cookie attributes, establish WSS, stream a nonclinical test microphone sample, verify final transcript behavior, trigger strict SOAP output acceptance/rejection tests, create a generic calendar block, and verify the audit event contains no clinical text.
10. Document the evidence, disconnect the test hardware, rotate any testing keys used outside the secret manager, and keep staging distinct until an explicit production-release decision.

## 6. The specific inputs and approvals needed next

Provide or authorize these **by reference in the relevant provider dashboard**, not by pasting secrets into chat or terminal:

| Needed now | Owner/action | What I need to proceed |
|---|---|---|
| Persistent staging host | Project owner | Chosen hosting provider/project and authorization to deploy the existing Docker API there. |
| Staging subdomains/DNS | Domain owner | Authorization to create only the three `*-staging.somasyncai.com` records after the service targets are known. |
| Staging database | Database owner | Separate database project/instance and explicit authorization to apply the two staging migrations. |
| Staging Supabase Auth | Identity owner | Separate staging project, synthetic clinician test account, and server-side environment configuration—not a pasted secret. |
| Deepgram | Vendor owner | Staging project/key stored directly in the gateway host’s secret manager. |
| AWS Bedrock | AWS owner | Workload identity/role with restricted model invocation and an approved strict-tool-capable model ID. |
| BLE integration sheet | Hardware owner | Device-name prefix, service/characteristic UUIDs, battery behavior, command protocol, firmware version, and test-device availability. |

No production credential, service-role key, patient/client record, raw audio, Cloudflare setting, or production database permission is needed for these steps.
## 7. Staging acceptance criteria

The preview is ready to become a true staging integration only when the following evidence exists:

| Gate | Required evidence |
|---|---|
| Cookie bridge | Browser receives only secure HttpOnly session cookie and signed CSRF proof; no access token appears in browser storage for the new clinical route. |
| Origin/CSRF controls | Untrusted Origin and missing/mismatched CSRF requests are rejected for session mutation, calendar mutation, and WSS upgrade. |
| Live stream | One synthetic microphone session maintains WSS, sends PCM frames, survives a controlled reconnect with a visible gap marker, and issues upstream keepalives during silence. |
| Strict SOAP | A synthetic transcript produces exactly the four supported fields; malformed/extra/prose output is rejected. Clinician review remains required for export. |
| Calendar/audit | Generic documentation block is created for the synthetic clinician, and its audit row contains only allowed operational metadata. |
| Privacy | No raw audio in browser storage, logs, database, error reporting, or audit rows; no production data used. |
| Hardware | Test device confirms approved connect/disconnect, battery status, and command semantics without any fabricated BLE protocol. |
