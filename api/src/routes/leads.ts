import { Router } from "express";
import { z } from "zod";
import { database } from "../db/pool.js";

const betaLead = z.object({ email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()) });
export const publicLeadRouter = Router();
publicLeadRouter.post("/beta-leads", async (request, response, next) => {
  try {
    const { email } = betaLead.parse(request.body);
    // Beta contact information is personal data, not an approved PHI intake channel. Do not collect clinical context here.
    await database.query("INSERT INTO beta_leads (email) VALUES ($1) ON CONFLICT (email) DO NOTHING", [email]);
    return response.status(202).json({ accepted: true });
  } catch (error) { return next(error); }
});
