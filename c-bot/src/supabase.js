import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ucqprtpuuyflnxjmatwo.supabase.co";
const configuredSupabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SUPABASE_ANON_KEY =
  configuredSupabaseKey && configuredSupabaseKey !== "your_anon_key"
    ? configuredSupabaseKey
    : "sb_publishable_zzh8YRfrO7--WLmWOw-9Tg_vV878nJB";

if (!SUPABASE_ANON_KEY) {
  console.warn(
    "⚠️ Supabase keys not set in .env — Supabase calls will fail."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY ?? "");
