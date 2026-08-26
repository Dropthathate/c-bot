CREATE TABLE IF NOT EXISTS public.beta_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT beta_leads_email_normalized CHECK (email = lower(btrim(email)))
);

ALTER TABLE public.beta_leads ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON TABLE public.beta_leads TO anon, authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'beta_leads'
      AND policyname = 'Anonymous beta lead insert'
  ) THEN
    CREATE POLICY "Anonymous beta lead insert"
      ON public.beta_leads
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END
$$;
