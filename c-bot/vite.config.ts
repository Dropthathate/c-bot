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
    const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;
    const required = [
      ["VITE_CLINICAL_API_URL", env.VITE_CLINICAL_API_URL],
      ["VITE_SUPABASE_URL", env.VITE_SUPABASE_URL],
      ["VITE_SUPABASE_PUBLISHABLE_KEY", supabaseKey],
    ].filter(([, value]) => !value?.trim()).map(([name]) => name);

    if (required.length > 0) {
      throw new Error(`Production build blocked: set ${required.join(", ")} in the deployment environment.`);
    }

    if (isLocalUrl(env.VITE_CLINICAL_API_URL)) {
      throw new Error("Production build blocked: VITE_CLINICAL_API_URL must be a deployed HTTPS API endpoint, not localhost.");
    }

    if (isLocalUrl(env.VITE_SUPABASE_URL)) {
      throw new Error("Production build blocked: VITE_SUPABASE_URL must be a deployed HTTPS Supabase project URL.");
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
