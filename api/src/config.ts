import "dotenv/config";
import { z } from "zod";

const httpsUrl = z.string().url().refine((value) => value.startsWith("https://"), "must use HTTPS");
const environment = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  REQUIRE_HTTPS: z.enum(["true", "false"]).default("true").transform((value) => value === "true"),
  CORS_ORIGINS: z.string().min(1),
  APP_ORIGIN: httpsUrl.default("https://www.somasyncai.com"),
  CALENDAR_ORIGIN: httpsUrl.default("https://calendar.somasyncai.com"),
  COOKIE_DOMAIN: z.string().regex(/^\.[a-z0-9.-]+$/i).default(".somasyncai.com"),
  SESSION_COOKIE_NAME: z.string().regex(/^[A-Za-z0-9_-]+$/).default("somasync_session"),
  CSRF_COOKIE_NAME: z.string().regex(/^[A-Za-z0-9_-]+$/).default("somasync_csrf"),
  CSRF_HMAC_SECRET: z.string().min(32),
  SESSION_TTL_SECONDS: z.coerce.number().int().min(300).max(86_400).default(28_800),
  ALLOW_BEARER_API_TOKENS: z.enum(["true", "false"]).default("false").transform((value) => value === "true"),
  WS_MAX_PAYLOAD_BYTES: z.coerce.number().int().min(1024).max(65_536).default(65_536),
  WS_MAX_CONNECTIONS_PER_USER: z.coerce.number().int().min(1).max(10).default(2),
  WS_MAX_MESSAGES_PER_MINUTE: z.coerce.number().int().min(10).max(2_000).default(600),
  WS_MAX_AUDIO_BYTES_PER_SECOND: z.coerce.number().int().min(16_000).max(1_000_000).default(256_000),
  WS_MAX_BUFFERED_BYTES: z.coerce.number().int().min(65_536).max(4_194_304).default(524_288),
  WS_MAX_SESSION_SECONDS: z.coerce.number().int().min(60).max(28_800).default(7_200),
  WS_SESSION_REVALIDATE_SECONDS: z.coerce.number().int().min(60).max(3_600).default(1_800),
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
if (!parsed.success) throw new Error(`Invalid API environment configuration: ${parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")}`);

const corsOrigins = [...new Set([
  ...parsed.data.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean),
  parsed.data.APP_ORIGIN,
  parsed.data.CALENDAR_ORIGIN
])];

export const config = {
  ...parsed.data,
  corsOrigins,
  dbCa: parsed.data.DB_CA_CERT_BASE64 ? Buffer.from(parsed.data.DB_CA_CERT_BASE64, "base64").toString("utf8") : undefined,
  cookieSecure: parsed.data.NODE_ENV === "production"
};
