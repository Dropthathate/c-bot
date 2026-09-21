-- Persistent, synthetic/de-identified intake submissions for cross-device beta lookup.
-- Apply through the migration role on the private encrypted PostgreSQL instance.
CREATE TABLE IF NOT EXISTS intake_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash CHAR(64) UNIQUE NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'consumed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '7 days',
  accessed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS intake_submissions_active_lookup_idx
  ON intake_submissions (token_hash, expires_at)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS intake_submissions_expiry_idx
  ON intake_submissions (expires_at);

-- The runtime role needs only the operations used by the API routes.
-- Grant these explicitly through your deployment's migration process; do not grant browser access.
-- GRANT SELECT, INSERT, UPDATE ON intake_submissions TO somasync_app;
