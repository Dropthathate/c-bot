import { Router } from "express";
import { z } from "zod";
import { database } from "../db/pool.js";
import { assertTrustedBrowserRequest } from "../auth.js";
import { createIntakeToken, intakePayloadSchema, saveIntakeSubmission } from "../services/intake-store.js";

const submissionBody = z.object({
  payload: intakePayloadSchema
}).strict();

export const publicIntakeRouter = Router();

publicIntakeRouter.post("/intakes", assertTrustedBrowserRequest, async (request, response, next) => {
  try {
    const { payload } = submissionBody.parse(request.body);
    const token = createIntakeToken();
    await saveIntakeSubmission(token, payload);
    return response.status(201).json({ accepted: true, token });
  } catch (error) {
    return next(error);
  }
});

// Lightweight operational check used by deployment smoke tests; it never returns intake data.
publicIntakeRouter.get("/intakes/ready", async (_request, response, next) => {
  try {
    await database.query("SELECT 1 FROM intake_submissions LIMIT 1");
    return response.status(200).json({ ready: true });
  } catch (error) {
    return next(error);
  }
});
