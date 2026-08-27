import "dotenv/config";
import { z } from "zod";

const environment = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"), PORT: z.coerce.number().int().min(1).max(65535).default(4000), REQUIRE_HTTPS: z.enum(["true", "false"]).default("true").transform((value) => value === "true"), CORS_ORIGINS: z.string().min(1), SUPABASE_URL: z.string().url(), SUPABASE_JWKS_URL: z.string().url(), SUPABASE_JWT_ISSUER: z.string().url(), SUPABASE_JWT_AUDIENCE: z.string().min(1), DEEPGRAM_API_KEY: z.string().min(1), DEEPGRAM_MODEL: z.string().min(1).default("nova-3"), AWS_REGION: z.string().min(1), BEDROCK_MODEL_ID: z.string().min(1), DATABASE_URL: z.string().min(1), DB_SSL: z.enum(["true", "false"]).default("true").transform((value) => value === "true"), DB_CA_CERT_BASE64: z.string().optional()
});
const parsed = environment.safeParse(process.env);
if (!parsed.success) throw new Error(`Invalid API environment configuration: ${parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")}`);
export const config = { ...parsed.data, corsOrigins: parsed.data.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean), dbCa: parsed.data.DB_CA_CERT_BASE64 ? Buffer.from(parsed.data.DB_CA_CERT_BASE64, "base64").toString("utf8") : undefined };
