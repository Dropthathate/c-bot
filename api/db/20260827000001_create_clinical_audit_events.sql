BEGIN;

CREATE TABLE IF NOT EXISTS clinical_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinician_id text NOT NULL,
  event_type text NOT NULL CHECK (event_type ~ '^[a-z0-9_.-]{3,80}$'),
  session_reference text NULL CHECK (char_length(session_reference) <= 64),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT clinical_audit_events_metadata_object CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX IF NOT EXISTS clinical_audit_events_clinician_time_idx
  ON clinical_audit_events (clinician_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS clinical_audit_events_session_time_idx
  ON clinical_audit_events (session_reference, occurred_at DESC)
  WHERE session_reference IS NOT NULL;

REVOKE ALL ON clinical_audit_events FROM PUBLIC;

COMMENT ON TABLE clinical_audit_events IS
  'Append-only operational audit events. Never store raw audio, transcript text, SOAP content, authorization values, cookies, or patient identifiers in metadata.';

COMMIT;
