import { Router } from "express";
import {
  intakeBriefSystemPrompt,
  intakeBriefToolName,
  intakeBriefToolSchema,
  intakeBriefUserMessage
} from "../services/clinical-prompt.js";
import { requireAuthenticatedUser, assertCsrf } from "../auth.js";
import type { AuthenticatedRequest } from "../auth.js";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { config } from "../config.js";
import { z } from "zod";
import { buildIntakeSummary, findActiveIntake, intakeTokenSchema } from "../services/intake-store.js";

export const intakeRouter = Router();

const bedrock = new BedrockRuntimeClient({ region: config.AWS_REGION });

const intakeBriefSchema = z.object({
  postural_assessment_priorities: z.string().min(1),
  likely_involved_structures:     z.string().min(1),
  clinical_reasoning:             z.string().min(1),
  session_priorities:             z.string().min(1),
  therapist_prompts:              z.string().min(1),
  biopsychosocial_flags:          z.string().min(1)
});

const intakeBriefRequestSchema = z.union([
  z.object({ token: intakeTokenSchema }).strict(),
  // Temporary compatibility path for already-open same-device beta sessions.
  z.object({ summary: z.string().trim().min(1).max(20_000) }).strict()
]);

// POST /api/v1/intake/brief
intakeRouter.post(
  "/brief",
  requireAuthenticatedUser,
  assertCsrf,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const requestBody = intakeBriefRequestSchema.parse(req.body);
      let summary: string;
      if ("token" in requestBody) {
        const payload = await findActiveIntake(requestBody.token);
        if (!payload) return res.status(404).json({ error: { code: "INTAKE_NOT_FOUND", message: "That intake token is invalid or expired." } });
        summary = buildIntakeSummary(payload, requestBody.token);
      } else {
        summary = requestBody.summary;
      }

      const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 2048,
        system: intakeBriefSystemPrompt,
        tools: [
          {
            name: intakeBriefToolName,
            description: "Emit the structured pre-session clinical brief.",
            input_schema: intakeBriefToolSchema
          }
        ],
        tool_choice: { type: "tool", name: intakeBriefToolName },
        messages: [
          { role: "user", content: intakeBriefUserMessage(summary) }
        ]
      };

      const cmd = new InvokeModelCommand({
        modelId: config.BEDROCK_MODEL_ID,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(payload)
      });

      const raw = await bedrock.send(cmd);
      const parsed = JSON.parse(Buffer.from(raw.body).toString("utf8"));
      const toolUse = parsed.content?.find((b: { type: string }) => b.type === "tool_use");

      if (!toolUse) {
        return res.status(500).json({
          error: { code: "BRIEF_FAILED", message: "Brief generation did not return a valid result." }
        });
      }

      const result = intakeBriefSchema.safeParse(toolUse.input);
      if (!result.success) {
        return res.status(500).json({
          error: { code: "BRIEF_INVALID", message: "Brief output did not meet the clinical schema." }
        });
      }

      return res.status(200).json({ brief: result.data });
    } catch (err) {
      return next(err);
    }
  }
);
