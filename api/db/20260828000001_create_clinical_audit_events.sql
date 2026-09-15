-- Operational audit ledger only. This table must never contain raw audio, transcripts,
-- SOAP content, PHI, patient identifiers, cookies, request headers, access tokens, or secrets.
CREATE TABLE IF NOT EXISTS clinical_audit_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clinician_id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('calendar_block_created')),
  operation text NOT NULL CHECK (operation IN ('calendar')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS clinical_audit_events_clinician_created_at_idx
  ON clinical_audit_events (clinician_id, created_at DESC);

REVOKE UPDATE, DELETE ON clinical_audit_events FROM PUBLIC;
