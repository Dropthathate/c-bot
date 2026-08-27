import crypto from "node:crypto";
import type { IncomingMessage } from "node:http";
import type { CookieOptions, NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { config } from "./config.js";

const jwks = createRemoteJWKSet(new URL(config.SUPABASE_JWKS_URL));
export interface AuthenticatedRequest extends Request { auth?: JWTPayload; }

const sharedCookieOptions: CookieOptions = {
  domain: config.COOKIE_DOMAIN,
  path: "/",
  secure: config.cookieSecure,
  sameSite: "lax",
  maxAge: config.SESSION_TTL_SECONDS * 1000
};

function allowedOrigin(origin: string | undefined) {
  return !origin || config.corsOrigins.includes(origin);
}

export function assertAllowedOrigin(request: Request, response: Response, next: NextFunction) {
  const origin = request.header("origin");
  if (!allowedOrigin(origin)) return response.status(403).json({ error: { code: "ORIGIN_NOT_ALLOWED", message: "This origin is not permitted." } });
  return next();
}

export function assertCsrf(request: Request, response: Response, next: NextFunction) {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return next();
  const cookie = request.cookies?.[config.CSRF_COOKIE_NAME];
  const header = request.header("x-somasync-csrf");
  if (typeof cookie !== "string" || typeof header !== "string" || cookie.length !== header.length) {
    return response.status(403).json({ error: { code: "CSRF_INVALID", message: "The request could not be verified." } });
  }
  if (!crypto.timingSafeEqual(Buffer.from(cookie), Buffer.from(header))) {
    return response.status(403).json({ error: { code: "CSRF_INVALID", message: "The request could not be verified." } });
  }
  return next();
}

export async function verifySessionToken(token: string) {
  return jwtVerify(token, jwks, { issuer: config.SUPABASE_JWT_ISSUER, audience: config.SUPABASE_JWT_AUDIENCE });
}

function cookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return undefined;
  const prefix = `${name}=`;
  const pair = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(prefix));
  return pair ? decodeURIComponent(pair.slice(prefix.length)) : undefined;
}

function tokenFromRequest(request: Request) {
  const cookieToken = request.cookies?.[config.SESSION_COOKIE_NAME];
  if (typeof cookieToken === "string" && cookieToken.length) return cookieToken;
  const authorization = request.header("authorization");
  return authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : undefined;
}

export async function authenticateWebSocketRequest(request: IncomingMessage): Promise<JWTPayload> {
  const origin = request.headers.origin;
  if (!allowedOrigin(origin)) throw new Error("ORIGIN_NOT_ALLOWED");
  const token = cookieValue(request.headers.cookie, config.SESSION_COOKIE_NAME);
  if (!token) throw new Error("UNAUTHENTICATED");
  const { payload } = await verifySessionToken(token);
  return payload;
}

export async function requireAuthenticatedUser(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  const token = tokenFromRequest(request);
  if (!token) return response.status(401).json({ error: { code: "UNAUTHENTICATED", message: "A valid user session is required." } });
  try {
    const { payload } = await verifySessionToken(token);
    request.auth = payload;
    return next();
  } catch {
    response.clearCookie(config.SESSION_COOKIE_NAME, sharedCookieOptions);
    return response.status(401).json({ error: { code: "INVALID_SESSION", message: "The user session could not be verified." } });
  }
}

export async function establishCookieSession(request: Request, response: Response) {
  const authorization = request.header("authorization");
  if (!authorization?.startsWith("Bearer ")) return response.status(401).json({ error: { code: "TOKEN_REQUIRED", message: "A verified identity token is required to establish a session." } });
  try {
    const token = authorization.slice("Bearer ".length);
    await verifySessionToken(token);
    const csrfToken = crypto.randomBytes(32).toString("base64url");
    response.cookie(config.SESSION_COOKIE_NAME, token, { ...sharedCookieOptions, httpOnly: true });
    response.cookie(config.CSRF_COOKIE_NAME, csrfToken, { ...sharedCookieOptions, httpOnly: false });
    return response.status(204).end();
  } catch {
    return response.status(401).json({ error: { code: "INVALID_TOKEN", message: "The identity token could not be verified." } });
  }
}

export function clearCookieSession(_request: Request, response: Response) {
  response.clearCookie(config.SESSION_COOKIE_NAME, sharedCookieOptions);
  response.clearCookie(config.CSRF_COOKIE_NAME, sharedCookieOptions);
  return response.status(204).end();
}

export function sessionSummary(request: AuthenticatedRequest) {
  const metadata = request.auth?.["user_metadata"];
  const name = typeof metadata === "object" && metadata && "full_name" in metadata
    ? String((metadata as Record<string, unknown>).full_name || "")
    : "";
  return { user: { id: request.auth?.sub, displayName: name || undefined } };
}
