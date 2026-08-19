CREATE SCHEMA IF NOT EXISTS api;

CREATE TABLE IF NOT EXISTS api.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE api.leads ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA api TO anon, authenticated;
GRANT INSERT ON TABLE api.leads TO anon, authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'api'
      AND tablename = 'leads'
      AND policyname = 'Allow anonymous lead inserts'
  ) THEN
    CREATE POLICY "Allow anonymous lead inserts"
      ON api.leads
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END
$$;

NOTIFY pgrst, 'reload schema';
