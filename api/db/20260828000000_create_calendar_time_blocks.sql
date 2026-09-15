-- Clinician-owned operational calendar entries only. Do not store patient names, identifiers,
-- audio, transcripts, SOAP notes, diagnoses, treatment details, cookies, headers, or tokens.
CREATE TABLE IF NOT EXISTS calendar_time_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinician_id uuid NOT NULL,
  label text NOT NULL CHECK (label IN ('Documentation review', 'Documentation follow-up', 'Case administration')),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS calendar_time_blocks_clinician_starts_at_idx
  ON calendar_time_blocks (clinician_id, starts_at);
