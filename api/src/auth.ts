import crypto from "node:crypto";
import type { IncomingMessage } from "node:http";
import type { CookieOptions, NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { config } from "./config.js";

const jwks = createRemoteJWKSet(new URL(config.SUPABASE_JWKS_URL));
const csrfProtocolPrefix = "somasync-csrf.";

export interface AuthenticatedRequest extends Request {
  auth?: JWTPayload;
  sessionToken?: string;
}

const sharedCookieOptions: CookieOptions = {
  domain: config.COOKIE_DOMAIN,
  path: "/",
  secure: config.cookieSecure,
  sameSite: "lax",
  maxAge: config.SESSION_TTL_SECONDS * 1000
};

const sessionCookieOptions: CookieOptions = { ...sharedCookieOptions, httpOnly: true };
const csrfCookieOptions: CookieOptions = { ...sharedCookieOptions, httpOnly: false };

function constantTimeEqual(left: string, right: string) {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  return leftBytes.length === rightBytes.length && crypto.timingSafeEqual(leftBytes, rightBytes);
}

function sessionBinding(token: string) {
  return crypto.createHash("sha256").update(token).digest("base64url");
}

export function signedCsrfToken(sessionToken: string, nonce = crypto.randomBytes(32).toString("base64url")) {
  const signature = crypto
    .createHmac("sha256", config.CSRF_HMAC_SECRET)
    .update(`${sessionBinding(sessionToken)}.${nonce}`)
    .digest("base64url");
  return `${signature}.${nonce}`;
}

export function hasValidCsrfToken(token: string | undefined, sessionToken: string) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1] || !/^[A-Za-z0-9_-]{32,}$/.test(parts[1])) return false;
  return constantTimeEqual(token, signedCsrfToken(sessionToken, parts[1]));
}

function cookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return undefined;
  const prefix = `${name}=`;
  const pair = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(prefix));
  return pair ? decodeURIComponent(pair.slice(prefix.length)) : undefined;
}

function sessionTokenFromCookie(request: Request) {
  const token = request.cookies?.[config.SESSION_COOKIE_NAME];
  return typeof token === "string" && token.length > 0 ? token : undefined;
}

function tokenFromRequest(request: Request) {
  const cookieToken = sessionTokenFromCookie(request);
  if (cookieToken) return cookieToken;
  if (!config.ALLOW_BEARER_API_TOKENS) return undefined;
  const authorization = request.header("authorization");
  return authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : undefined;
}

export function isAllowedOrigin(origin: string | undefined) {
  return Boolean(origin && config.corsOrigins.includes(origin));
}

function isAllowedFetchSite(request: Request) {
  const site = request.header("sec-fetch-site");
  return !site || site === "same-origin" || site === "same-site" || site === "none";
}

export function assertTrustedBrowserRequest(request: Request, response: Response, next: NextFunction) {
  if (!isAllowedOrigin(request.header("origin")) || !isAllowedFetchSite(request)) {
    return response.status(403).json({ error: { code: "REQUEST_CONTEXT_INVALID", message: "This browser request could not be verified." } });
  }
  return next();
}

export function assertCsrf(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return next();
  const sessionToken = request.sessionToken || sessionTokenFromCookie(request);
  const cookie = request.cookies?.[config.CSRF_COOKIE_NAME];
  const header = request.header("x-somasync-csrf");
  const matches = typeof cookie === "string" && typeof header === "string" && constantTimeEqual(cookie, header);
  if (!sessionToken || !matches || !hasValidCsrfToken(cookie, sessionToken)) {
    return response.status(403).json({ error: { code: "CSRF_INVALID", message: "The request could not be verified." } });
  }
  return next();
}

export async function verifySessionToken(token: string) {
  return jwtVerify(token, jwks, {
    issuer: config.SUPABASE_JWT_ISSUER,
    audience: config.SUPABASE_JWT_AUDIENCE,
    clockTolerance: 5
  });
}

export async function requireAuthenticatedUser(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  const token = tokenFromRequest(request);
  if (!token) return response.status(401).json({ error: { code: "UNAUTHENTICATED", message: "A valid user session is required." } });
  try {
    const { payload } = await verifySessionToken(token);
    request.auth = payload;
    request.sessionToken = token;
    return next();
  } catch {
    response.clearCookie(config.SESSION_COOKIE_NAME, sessionCookieOptions);
    response.clearCookie(config.CSRF_COOKIE_NAME, csrfCookieOptions);
    return response.status(401).json({ error: { code: "INVALID_SESSION", message: "The user session could not be verified." } });
  }
}

export async function establishCookieSession(request: Request, response: Response) {
  const authorization = request.header("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return response.status(401).json({ error: { code: "TOKEN_REQUIRED", message: "A verified identity token is required to establish a session." } });
  }
  try {
    const token = authorization.slice("Bearer ".length);
    await verifySessionToken(token);
    response.cookie(config.SESSION_COOKIE_NAME, token, sessionCookieOptions);
    response.cookie(config.CSRF_COOKIE_NAME, signedCsrfToken(token), csrfCookieOptions);
    return response.status(204).end();
  } catch {
    return response.status(401).json({ error: { code: "INVALID_TOKEN", message: "The identity token could not be verified." } });
  }
}

export function clearCookieSession(_request: Request, response: Response) {
  response.clearCookie(config.SESSION_COOKIE_NAME, sessionCookieOptions);
  response.clearCookie(config.CSRF_COOKIE_NAME, csrfCookieOptions);
  return response.status(204).end();
}

export async function authenticateWebSocketRequest(request: IncomingMessage): Promise<{ payload: JWTPayload; sessionToken: string }> {
  if (!isAllowedOrigin(request.headers.origin)) throw new Error("ORIGIN_NOT_ALLOWED");
  const sessionToken = cookieValue(request.headers.cookie, config.SESSION_COOKIE_NAME);
  if (!sessionToken) throw new Error("UNAUTHENTICATED");
  const protocols = String(request.headers["sec-websocket-protocol"] || "").split(",").map((value) => value.trim());
  const csrfProtocol = protocols.find((value) => value.startsWith(csrfProtocolPrefix));
  if (!hasValidCsrfToken(csrfProtocol?.slice(csrfProtocolPrefix.length), sessionToken)) throw new Error("CSRF_INVALID");
  const { payload } = await verifySessionToken(sessionToken);
  return { payload, sessionToken };
}

export function sessionSummary(request: AuthenticatedRequest) {
  const metadata = request.auth?.["user_metadata"];
  const displayName = typeof metadata === "object" && metadata && "full_name" in metadata
    ? String((metadata as Record<string, unknown>).full_name || "")
    : "";
  return { user: { id: request.auth?.sub, displayName: displayName || undefined } };
}
