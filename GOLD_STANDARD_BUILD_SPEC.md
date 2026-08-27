# SomaSyncAI Gold-Standard Realtime Documentation Build

## Release boundary

The live `main` branch remains the known working application. All work described here is confined to `feature/gold-standard-realtime-clinical-workspace`, with preview validation required before any merge. No beta, clinical, or account feature is considered released merely because its interface exists.

## Product boundary

SomaSyncAI is a hands-free clinical documentation workflow for manual therapists and neuromuscular therapists. It is not a generic recording or transcription product. It captures session context, produces a draft for clinician review, and must not diagnose, treat, make clinical decisions, or submit documentation automatically.

## Architecture options evaluated

| Approach | Tradeoffs | Cost | Setup complexity |
| --- | --- | --- | --- |
| Browser connects directly to an STT vendor | Lowest initial latency, but exposes vendor credentials and makes session, audit, and policy controls weak | Lower infrastructure cost | Low, but unacceptable for production clinical workflows |
| Serverless request/response audio API | Simple deployment model, but repeated uploads create latency and serverless runtimes cannot reliably own long-lived bidirectional streams | Low to moderate | Moderate |
| **Persistent realtime gateway with browser WebSocket** | Maintains a secure, low-latency binary stream, preserves vendor credentials server-side, and centralizes authentication, audit, rate limits, and reconnect behavior | Moderate managed-host cost | Higher, selected for production readiness |

The selected design uses a **persistent Node.js realtime gateway** behind HTTPS/WSS. The public frontend connects only to the gateway. The gateway validates the clinician’s session, forwards binary audio frames to the STT provider over a separate provider WebSocket, emits structured transcript events, and never exposes the provider credential to browser JavaScript.

## Component model

```text
Clinician browser
  ├─ Web Bluetooth BLE controls and battery telemetry
  ├─ Browser-selected Bluetooth microphone via getUserMedia
  ├─ AudioWorklet → signed WSS /v1/realtime/transcription
  └─ Clinician review interface

Persistent realtime gateway
  ├─ Secure HttpOnly root-domain session verification
  ├─ Origin allowlist, CSRF validation for HTTP mutations, WSS upgrade checks
  ├─ Per-user and per-session rate limits
  ├─ Deepgram streaming WebSocket adapter and silent-period keepalive
  ├─ Strict SOAP JSON generation adapter
  └─ Append-only audit-event writer

Data services
  ├─ Identity provider and session exchange
  ├─ Encrypted database for clinician-approved records only
  ├─ Calendar service at calendar.somasyncai.com
  └─ Secret manager for STT and LLM credentials
```

## Browser and hardware contract

Web Bluetooth is restricted to HTTPS contexts, explicit user gestures, user-selected BLE devices, and browser support that is not universal. The companion-device connection is therefore for control/telemetry only. Audio input is independently selected through browser microphone permission, allowing a paired Bluetooth headset or other approved microphone to provide audio. The app must show capability status before any clinical session begins, never claim a connection if one is not present, and provide a supported-browser fallback.

The device adapter will request only the documented SomaSync service UUIDs plus the standard `battery_service`. It will subscribe to notifications only after connection, clear stale GATT objects after a disconnect, use bounded exponential reconnect attempts, and serialize GATT operations. No device identifier is sent to the API unless a clinician explicitly approves device registration.

## Realtime transcription contract

1. The authenticated browser opens a single `wss://api.somasyncai.com/v1/realtime/transcription` stream while a session is active.
2. The browser sends a `session.start` JSON control frame, then raw signed 16-bit PCM audio frames from an AudioWorklet. No multipart upload, base64 conversion, or HTTP audio POST is permitted.
3. The gateway permits only expected control messages and binary audio. It validates maximum frame size, session ownership, stream duration, and backpressure.
4. The gateway opens an STT provider socket with its server-side credential. It sends text `KeepAlive` frames every three seconds during silence and maps interim/final results to versioned transcript events.
5. On a transient upstream failure, the gateway announces the state and creates a replacement stream. The browser maintains at most three seconds of audio in memory while reconnecting, then discards it. It never writes raw audio to local storage, IndexedDB, logs, analytics, or disk.
6. A final transcript event includes a monotonically increasing sequence number, stream segment identifier, and timestamp offset. The UI de-duplicates events and identifies any reconnect gap to the clinician.
7. On `session.stop`, the browser stops tracks, the gateway sends `CloseStream`, clears in-memory buffers, and emits a completion audit event.

## Authentication and calendar bridge

The selected session model is a short-lived, server-verified JWT held only in a `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`, `Domain=.somasyncai.com` cookie. The browser never stores access tokens in local storage, session storage, URL fragments, or readable JavaScript variables.

The root domain, `app.somasyncai.com`, `api.somasyncai.com`, and `calendar.somasyncai.com` must be explicitly allowlisted. Credentialed cross-origin requests must set `credentials: "include"`; the API must return the requesting approved origin rather than `*`, include `Vary: Origin`, and require a double-submit CSRF token for state-changing HTTP endpoints. WebSocket upgrades validate the `Origin` header and cookie session before accepting audio.

The calendar subdomain receives the same root-domain session cookie. Calendar records are separate from transcript and note content. The initial implementation stores clinician-owned documentation time blocks, not patient content, and every mutation creates an audit event.

## Strict SOAP JSON contract

The LLM adapter uses a provider-enforced structured-output/tool schema, not prompt-only JSON instructions. A result is accepted only if it has exactly these keys:

```json
{
  "subjective": "string",
  "objective": "string",
  "assessment": "string",
  "plan": "string"
}
```

The API rejects Markdown fences, explanatory prose, undeclared keys, non-string values, oversized fields, and malformed JSON. Output remains an unfinalized draft. The UI must prominently require clinician review and explicit approval before any note is saved or exported.

## Privacy, reliability, and audit requirements

* Production secrets exist only in the server-side secret manager; no service-role database key, STT key, LLM credential, or signing secret is built into the frontend.
* Raw audio, authorization headers, cookies, and clinical text are redacted from application logs.
* Transcript and note retention are explicit product policies, not defaults. Raw audio is never retained by this application.
* The audit ledger captures security-relevant events, session start/stop, reconnection gaps, SOAP generation, clinician review, and approved-note export, without storing raw audio.
* Production requires a signed vendor/privacy review, data-processing agreements, encryption at rest and in transit, incident response procedures, and a formal clinical validation process before patient data is introduced.

## Staged release gates

| Gate | Required evidence | Release decision |
| --- | --- | --- |
| Local integration | Synthetic audio through gateway, schema rejection tests, mocked device adapter, and static checks pass | Feature branch only |
| Preview | HTTPS/WSS preview endpoint, synthetic accounts, test STT/LLM credentials, browser compatibility and reconnect tests pass | Internal tester access only |
| Security review | Origin/cookie/CSRF/WSS checks, secret scan, rate-limit checks, and audit-log redaction pass | Eligible for limited beta |
| Clinical readiness | Hardware protocol finalized, retention policy approved, provider agreements complete, clinician review workflow tested | Eligible for production cutover |

## Source notes

Chrome’s Web Bluetooth guidance requires HTTPS and an explicit user gesture for device discovery, supports GATT notifications and disconnect events, and cautions that GATT characteristics must be reacquired after reconnects. MDN identifies Web Bluetooth as experimental with limited browser availability. Deepgram’s streaming guidance calls for explicit WebSocket lifecycle management, binary audio frames, text keepalives during silence, and reconnection handling; its audio keepalive guidance specifies a text `{"type":"KeepAlive"}` frame every 3–5 seconds to avoid an approximately 10-second silence timeout.

## References

[1]: https://developer.chrome.com/docs/capabilities/bluetooth "Communicating with Bluetooth devices over JavaScript — Chrome for Developers"
[2]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API "Web Bluetooth API — MDN"
[3]: https://developers.deepgram.com/docs/lower-level-websockets "Using Lower-Level Websockets with the Streaming API — Deepgram"
[4]: https://developers.deepgram.com/docs/audio-keep-alive "Audio Keep Alive — Deepgram"
[5]: https://developers.deepgram.com/docs/recovering-from-connection-errors-and-timeouts-when-live-streaming-audio "Recovering From Connection Errors & Timeouts When Live Streaming — Deepgram"

## Security implementation decisions

The gateway will use WSS only, disable WebSocket per-message compression, enforce a 64 KiB maximum payload, apply connection and message rate limits, validate a strict origin allowlist during every upgrade, reject malformed or replayed control messages, and revalidate session expiry during long-lived streams. It will not rely solely on a cookie at handshake time. Every state-changing HTTP request requires an origin check, Fetch Metadata check when present, and a session-bound signed double-submit CSRF token in a custom header. Credentialed CORS returns an explicit approved origin and `Access-Control-Allow-Credentials: true`; it never returns `*` with credentials.

These controls reflect OWASP guidance on WebSocket origin validation, message-level input limits, rate limiting, secure WSS transport, session revalidation, and avoiding sensitive data in logs. They also reflect OWASP CSRF guidance that cookie-authenticated state changes need a token or equivalent defense-in-depth control, and MDN’s credentialed-CORS requirement that the response explicitly allow credential inclusion.

[6]: https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html "WebSocket Security Cheat Sheet — OWASP"
[7]: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html "Cross-Site Request Forgery Prevention Cheat Sheet — OWASP"
[8]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Access-Control-Allow-Credentials "Access-Control-Allow-Credentials — MDN"
