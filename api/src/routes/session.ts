import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { assertTrustedBrowserRequest, establishCookieSessionFromToken } from "../auth.js";
import { config } from "../config.js";

const credentialsSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(8).max(256)
}).strict();

type SupabasePasswordResponse = { access_token?: string };

export const sessionRouter = Router();

// This limit is intentionally narrower than API-wide traffic limits. Request bodies are redacted
// by the HTTP logger and neither password nor access token is returned to the browser.
sessionRouter.post("/password", assertTrustedBrowserRequest, rateLimit({ windowMs: 15 * 60_000, max: 10, standardHeaders: "draft-8", legacyHeaders: false }), async (request, response, next) => {
  try {
    const credentials = credentialsSchema.parse(request.body);
    const upstream = await fetch(`${config.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      cache: "no-store",
      headers: { apikey: config.SUPABASE_ANON_KEY, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(credentials)
    });
    if (!upstream.ok) return response.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "The sign-in details could not be verified." } });
    const identity = await upstream.json() as SupabasePasswordResponse;
    if (!identity.access_token) return response.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "The sign-in details could not be verified." } });
    await establishCookieSessionFromToken(identity.access_token, response);
    return response.status(204).end();
  } catch (error) { return next(error); }
});
