# SomaSyncAI Vanilla Voice and Calendar Architecture

## Scope

This refactor replaces the frontend application bundle with standard **HTML, CSS, and browser-native JavaScript**. It does not ship React, Vite, a browser-side JWT, or audio-file upload code. The browser application remains a clinical documentation draft tool for manual therapists and neuromuscular therapists; final documentation remains subject to clinician review and approval.

## Deployment topology

| Surface | Deployment target | Responsibility |
|---|---|---|
| `www.somasyncai.com` | Static site from `c-bot/site` | Web Bluetooth companion, selected microphone capture, persistent transcription client, transcript display, SOAP review, and calendar bridge. |
| `calendar.somasyncai.com` | Separate static calendar client from `c-bot/calendar` plus a same-origin API reverse proxy | Time-block display and creation. The service uses the root-domain session and does not host voice capture. |
| `api.somasyncai.com` or internal API origin | Node/Express service in `api` behind TLS | JWT validation, HttpOnly session establishment, WebSocket gateway, live STT relay, strict SOAP generation, and calendar REST endpoints. |

The calendar subdomain should reverse-proxy `/api/v1/calendar/*` and `/api/v1/auth/session` to the Node API. The main voice application can call `https://calendar.somasyncai.com/api/v1/calendar/*` with `credentials: "include"`; its public runtime configuration already exposes `window.SomaSyncCalendarBridge` for those calls.

## Browser files

| File | Purpose |
|---|---|
| `c-bot/site/index.html` | Framework-free main clinical workspace. |
| `c-bot/site/assets/app.js` | Bluetooth GATT lifecycle, battery telemetry, microphone selection, AudioWorklet capture, persistent WebSocket lifecycle, transcript display, strict SOAP object rendering, and calendar bridge. |
| `c-bot/site/assets/audio-processor.js` | Low-latency PCM chunking in an AudioWorklet. Chunks are dropped during reconnects rather than buffered in browser storage. |
| `c-bot/site/assets/runtime-config.js` | Public endpoint and Bluetooth UUID configuration only; it must not contain a secret or session token. |
| `c-bot/calendar/*` | Separate framework-free calendar interface with credentialed API calls. |

Web Bluetooth works only in browsers and operating systems that expose the required GATT services over HTTPS. The runtime configuration deliberately leaves the vendor-specific service and characteristic UUIDs blank until the hardware protocol is finalized. The browser can select a Bluetooth microphone through standard media-device permissions independently of the GATT companion connection.

## Real-time transcription protocol

The browser opens one authenticated WebSocket at `/api/v1/voice/stream` with the `somasync.stt.v1` subprotocol. Its first control message is a strict `start` object. Subsequent binary messages are 16-bit mono PCM frames; no HTTP audio endpoint remains mounted.

| Direction | Message | Meaning |
|---|---|---|
| Browser → API | `start` JSON | Declares protocol version, `linear16` encoding, sample rate, and optional non-identifying session reference. |
| Browser → API | Binary | Raw PCM frame, maximum 64 KiB; the server limits traffic to 256 KiB per second. |
| API → Browser | `transcript` JSON | Interim or final transcript text. |
| Browser → API | `generate_soap` JSON | Requests one strict SOAP object from final transcript text. |
| API → Browser | `soap` JSON | Exactly `subjective`, `objective`, `assessment`, and `plan` string fields. |
| Either | `stop` / close | Ends the session and upstream STT connection. |

The Node API opens one vendor WebSocket per clinical session, with no-store processing enabled. Vendor agreements, data handling, and privacy configuration must be reviewed before any production PHI use.

## Strict SOAP JSON

`api/src/services/bedrock.ts` uses a forced Anthropic Bedrock tool call named `emit_soap_note`. Its JSON schema forbids additional properties, while server-side Zod validation rejects missing, non-string, extra, Markdown-wrapped, or conversational output. Only the four required fields may reach the browser.

## Authentication and cross-subdomain calls

The API validates an identity-provider JWT, then establishes a browser session in a cookie with these production attributes:

| Attribute | Value |
|---|---|
| Cookie domain | `.somasyncai.com` |
| Session cookie | `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/` |
| Browser token storage | None; JWTs are never stored in local storage, session storage, or URL fragments. |
| CSRF protection | Root-domain double-submit token required for state-changing HTTP API calls. |
| WebSocket protection | Verified HttpOnly session cookie and exact allowed `Origin`. |
| CORS | Credentialed requests only from configured main and calendar origins. |

The one-time `POST /api/v1/auth/session/exchange` endpoint accepts an identity token only to set the HttpOnly session and CSRF cookies. It must be called by a trusted authentication callback, never by storing a token in browser JavaScript. Production values for `CORS_ORIGINS`, `APP_ORIGIN`, `CALENDAR_ORIGIN`, and `COOKIE_DOMAIN` are listed in `api/.env.example`.

## Required deployment actions

1. Apply `api/db/20260827000000_create_calendar_time_blocks.sql` to the API database.
2. Deploy `api` behind HTTPS and provide all server-only environment values from a secret manager.
3. Set production `CORS_ORIGINS` to include only the approved `www`, calendar, and API origins; do not use `*` with credentialed requests.
4. Publish `c-bot/site` as the primary static site and publish `c-bot/calendar` to `calendar.somasyncai.com` with the API reverse proxy described above.
5. Set the hardware service and characteristic UUIDs and endpoint URLs in the generated deployment copy of `runtime-config.js`; do not commit private values.
6. Validate browser Bluetooth compatibility against the actual companion firmware before clinical rollout.

## Search indexing correction

The prior `/about` Google result is traceable to the legacy public `about.html` asset and a public landing-page footer link. The new static build excludes that legacy page entirely, provides a sitemap containing only the intended public URLs, and adds crawl directives that disallow the legacy paths. Google removes a prior result only after it recrawls the retired URL and observes the 404 response; submit the revised sitemap and use Search Console’s temporary-removal tool if immediate suppression is needed.
