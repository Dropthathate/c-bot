import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import pino from "pino";
import { pinoHttp } from "pino-http";
import { ZodError } from "zod";
import { assertAllowedOrigin, assertCsrf, clearCookieSession, establishCookieSession, requireAuthenticatedUser, sessionSummary, type AuthenticatedRequest } from "./auth.js";
import { calendarRouter } from "./routes/calendar.js";
import { publicLeadRouter } from "./routes/leads.js";
import { config } from "./config.js";

export const app = express();
const logger = pino({
  level: config.NODE_ENV === "production" ? "info" : "debug",
  redact: ["req.headers.authorization", `req.cookies.${config.SESSION_COOKIE_NAME}`, "req.body", "res.headers"]
});

app.set("trust proxy", 1);
app.use(pinoHttp({ logger }));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "same-site" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  contentSecurityPolicy: false
}));
app.use(cors({
  origin(origin, callback) {
    if (!origin || config.corsOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS."));
  },
  credentials: true,
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type", "X-SomaSync-CSRF"],
  maxAge: 600
}));
app.use(cookieParser());
app.use(express.json({ limit: "256kb", type: ["application/json", "application/*+json"] }));
app.use(rateLimit({ windowMs: 60_000, max: 90, standardHeaders: "draft-8", legacyHeaders: false }));

// TLS terminates at the production edge and must forward X-Forwarded-Proto.
app.use((request, response, next) => {
  if (config.REQUIRE_HTTPS && request.header("x-forwarded-proto") !== "https" && !request.secure) {
    return response.status(400).json({ error: { code: "HTTPS_REQUIRED", message: "HTTPS is required." } });
  }
  return next();
});

app.get("/healthz", (_request, response) => response.status(200).json({ status: "ok" }));
app.post("/api/v1/auth/session/exchange", assertAllowedOrigin, establishCookieSession);
app.get("/api/v1/auth/session", requireAuthenticatedUser, (request: AuthenticatedRequest, response) => response.status(200).json(sessionSummary(request)));
app.delete("/api/v1/auth/session", assertAllowedOrigin, assertCsrf, clearCookieSession);
app.use("/api/v1/public", publicLeadRouter);
app.use("/api/v1/calendar", assertAllowedOrigin, assertCsrf, calendarRouter);

app.use((error: unknown, request: express.Request, response: express.Response, _next: express.NextFunction) => {
  request.log.error({ err: error instanceof Error ? error.message : "unknown_error" }, "request_failed");
  if (error instanceof ZodError) return response.status(400).json({ error: { code: "INVALID_INPUT", message: "The request payload is not valid." } });
  if (error instanceof Error && error.message === "Origin is not allowed by CORS.") return response.status(403).json({ error: { code: "ORIGIN_NOT_ALLOWED", message: "This origin is not permitted." } });
  return response.status(500).json({ error: { code: "PROCESSING_FAILED", message: "The request could not be processed." } });
});
