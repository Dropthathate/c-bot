CREATE TABLE IF NOT EXISTS calendar_time_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinician_id uuid NOT NULL,
  label text NOT NULL CHECK (char_length(label) BETWEEN 1 AND 80),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT calendar_time_blocks_valid_range CHECK (ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS calendar_time_blocks_clinician_starts_at_idx
  ON calendar_time_blocks (clinician_id, starts_at);
