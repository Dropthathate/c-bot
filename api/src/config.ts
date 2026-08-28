import "dotenv/config";
import { z } from "zod";

const environment = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  REQUIRE_HTTPS: z.enum(["true", "false"]).default("true").transform((value) => value === "true"),
  CORS_ORIGINS: z.string().min(1),
  COOKIE_DOMAIN: z.string().min(1),
  SESSION_COOKIE_NAME: z.string().min(1).default("somasync_session"),
  CSRF_COOKIE_NAME: z.string().min(1).default("somasync_csrf"),
  CSRF_HMAC_SECRET: z.string().min(32),
  SESSION_TTL_SECONDS: z.coerce.number().int().min(300).max(43_200).default(28_800),
  ALLOW_BEARER_API_TOKENS: z.enum(["true", "false"]).default("false").transform((value) => value === "true"),
  WS_MAX_PAYLOAD_BYTES: z.coerce.number().int().min(1024).max(262_144).default(65_536),
  WS_MAX_CONNECTIONS_PER_USER: z.coerce.number().int().min(1).max(5).default(2),
  WS_MAX_MESSAGES_PER_MINUTE: z.coerce.number().int().min(60).max(3_600).default(600),
  WS_MAX_SESSION_SECONDS: z.coerce.number().int().min(300).max(43_200).default(10_800),
  SUPABASE_URL: z.string().url(),
  SUPABASE_JWKS_URL: z.string().url(),
  SUPABASE_JWT_ISSUER: z.string().url(),
  SUPABASE_JWT_AUDIENCE: z.string().min(1),
  DEEPGRAM_API_KEY: z.string().min(1),
  DEEPGRAM_MODEL: z.string().min(1).default("nova-3"),
  AWS_REGION: z.string().min(1),
  BEDROCK_MODEL_ID: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  DB_SSL: z.enum(["true", "false"]).default("true").transform((value) => value === "true"),
  DB_CA_CERT_BASE64: z.string().optional()
});

const parsed = environment.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Invalid API environment configuration: ${parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")}`);
}

const corsOrigins = parsed.data.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean);
if (!corsOrigins.every((origin) => origin.startsWith("https://") || (parsed.data.NODE_ENV !== "production" && origin.startsWith("http://localhost:")))) {
  throw new Error("CORS_ORIGINS must contain only HTTPS origins outside local development.");
}

export const config = {
  ...parsed.data,
  corsOrigins,
  cookieSecure: parsed.data.NODE_ENV === "production" || parsed.data.REQUIRE_HTTPS,
  dbCa: parsed.data.DB_CA_CERT_BASE64 ? Buffer.from(parsed.data.DB_CA_CERT_BASE64, "base64").toString("utf8") : undefined
};
