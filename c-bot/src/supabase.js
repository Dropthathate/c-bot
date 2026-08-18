import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ucqprtpuuyflnxjmatwo.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcXBydHB1dXlmbG54am1hdHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NjMzMjYsImV4cCI6MjA4ODEyMzMyNn0.rU855zMtb1ZFQgLx5aBUdWd5R8mjmLCwEmmx6KuJvwk";

if (!SUPABASE_ANON_KEY) {
  console.warn(
    "⚠️ Supabase keys not set in .env — Supabase calls will fail."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY ?? "");
