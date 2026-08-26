import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

function isLocalUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol !== "https:" || ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  } catch {
    return true;
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  if (mode === "production") {
    const supabaseUrl = env.VITE_SUPABASE_PROJECT_URL || env.VITE_SUPABASE_URL;
    const supabaseKey = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const required = [
      ["VITE_SUPABASE_URL", supabaseUrl],
      ["VITE_SUPABASE_PUBLISHABLE_KEY", supabaseKey],
    ].filter(([, value]) => !value?.trim()).map(([name]) => name);

    if (required.length > 0) {
      throw new Error(`Production build blocked: set ${required.join(", ")} in the deployment environment.`);
    }

    if (env.VITE_CLINICAL_API_URL?.trim() && isLocalUrl(env.VITE_CLINICAL_API_URL)) {
      throw new Error("Production build blocked: VITE_CLINICAL_API_URL must be a deployed HTTPS API endpoint, not localhost.");
    }

    if (isLocalUrl(supabaseUrl)) {
      throw new Error("Production build blocked: the configured Supabase project URL must be a deployed HTTPS endpoint.");
    }
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      target: "esnext",
    },
  };
});
