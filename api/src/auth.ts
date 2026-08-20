import type { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { config } from "./config.js";

const jwks = createRemoteJWKSet(new URL(config.SUPABASE_JWKS_URL));
export interface AuthenticatedRequest extends Request { auth?: JWTPayload; }
export async function requireAuthenticatedUser(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) return response.status(401).json({ error: { code: "UNAUTHENTICATED", message: "A valid user session is required." } });
  try {
    const { payload } = await jwtVerify(authorization.slice("Bearer ".length), jwks, { issuer: config.SUPABASE_JWT_ISSUER, audience: config.SUPABASE_JWT_AUDIENCE });
    request.auth = payload;
    next();
  } catch { return response.status(401).json({ error: { code: "INVALID_SESSION", message: "The user session could not be verified." } }); }
}
