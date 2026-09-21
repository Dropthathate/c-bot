# Persistent Intake Token Rollout

The intake flow now supports cross-device retrieval through the clinical API. The public client form submits a validated, synthetic/de-identified payload to `POST /api/v1/public/intakes`. The API generates the `ss-XXXXXX` token, stores a SHA-256 token hash and JSON payload in PostgreSQL, and returns the display token. The practitioner workspace submits that token to authenticated `POST /api/v1/intake/brief`, which retrieves the active, unexpired payload and generates the pre-session brief. The workspace retains a same-device `sessionStorage` fallback for older beta sessions.

## Required database migration

Apply `api/db/migrations/20260921000000_create_intake_submissions.sql` through the approved migration role on the private encrypted PostgreSQL instance before testing cross-device retrieval. The runtime role needs `SELECT`, `INSERT`, and `UPDATE` on `intake_submissions`; it does not need browser access. The migration creates seven-day expiry and active-token indexes.

For a database that is initialized from scratch, the same table and indexes are included in `api/db/schema.sql`.

## Deployment order

Deploy the API after applying the migration, then verify `GET /api/v1/public/intakes/ready` returns `{ "ready": true }` without exposing intake data. Deploy the frontend afterward. The public form must be able to reach `https://api.somasyncai.com/api/v1/public/intakes`, and the practitioner session must be able to reach `https://api.somasyncai.com/api/v1/intake/brief` with the session cookie and `X-SomaSync-CSRF` header.

## Synthetic acceptance test

Use only synthetic values. Submit an intake on one device, copy the server-returned token, and enter it in the practitioner workspace on a different device/browser. The workspace should display the generated pre-session brief. A malformed, unknown, or expired token should return an error and should never return raw intake data.

## Current privacy boundary

This implementation is for the existing no-PHI beta boundary. It does not establish HIPAA authorization, vendor agreements, clinical validity, or approval to store client-identifying information. Before real client use, complete the documented privacy, security, encryption, retention, access-control, vendor, and legal readiness work.
