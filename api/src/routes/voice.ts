import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import type { AuthenticatedRequest } from "../auth.js";
import { requireAuthenticatedUser } from "../auth.js";
import { generateSoapNote } from "../services/bedrock.js";
import { transcribeWithNoStore } from "../services/deepgram.js";
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024, files: 1 }, fileFilter: (_request, file, callback) => callback(null, file.mimetype.startsWith("audio/")) });
const transcriptBody = z.object({ transcript: z.string().min(1).max(100_000) });
export const voiceRouter = Router();
voiceRouter.post("/transcribe", requireAuthenticatedUser, upload.single("audio"), async (request: AuthenticatedRequest, response, next) => {
  try { if (!request.file?.buffer) return response.status(400).json({ error: { code: "AUDIO_REQUIRED", message: "An audio upload is required." } }); const transcript = await transcribeWithNoStore(request.file.buffer, request.file.mimetype || "audio/webm"); return response.status(200).json({ transcript }); } catch (error) { return next(error); }
});
voiceRouter.post("/generate-soap", requireAuthenticatedUser, async (request: AuthenticatedRequest, response, next) => {
  try { const { transcript } = transcriptBody.parse(request.body); const note = await generateSoapNote(transcript); return response.status(200).json({ note }); } catch (error) { return next(error); }
});
