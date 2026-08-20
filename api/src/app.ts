import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import pino from "pino";
import { pinoHttp } from "pino-http";
import multer from "multer";
import { ZodError } from "zod";
import { config } from "./config.js";
import { publicLeadRouter } from "./routes/leads.js";
import { voiceRouter } from "./routes/voice.js";
export const app = express();
const logger = pino({ level: config.NODE_ENV === "production" ? "info" : "debug", redact: ["req.headers.authorization", "req.body", "res.headers"] });
app.set("trust proxy", 1); app.use(pinoHttp({ logger })); app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } })); app.use(cors({ origin: config.corsOrigins, methods: ["GET", "POST"], allowedHeaders: ["Authorization", "Content-Type"], maxAge: 600 })); app.use(express.json({ limit: "256kb" })); app.use(rateLimit({ windowMs: 60_000, max: 45, standardHeaders: "draft-8", legacyHeaders: false }));
// In AWS, terminate TLS at API Gateway/ALB and forward X-Forwarded-Proto. Refuse cleartext in production.
app.use((request, response, next) => { if (config.REQUIRE_HTTPS && request.header("x-forwarded-proto") !== "https" && !request.secure) return response.status(400).json({ error: { code: "HTTPS_REQUIRED", message: "HTTPS is required." } }); next(); });
app.get("/healthz", (_request, response) => response.status(200).json({ status: "ok" })); app.use("/api/v1/public", publicLeadRouter); app.use("/api/v1/voice", voiceRouter);
app.use((error: unknown, request: express.Request, response: express.Response, _next: express.NextFunction) => { request.log.error({ err: error instanceof Error ? error.message : "unknown_error" }, "request_failed"); if (error instanceof ZodError) return response.status(400).json({ error: { code: "INVALID_INPUT", message: "The request payload is not valid." } }); if (error instanceof multer.MulterError) return response.status(400).json({ error: { code: "INVALID_UPLOAD", message: error.message } }); return response.status(500).json({ error: { code: "PROCESSING_FAILED", message: "The request could not be processed." } }); });
