import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { z } from "zod";
import { config } from "../config.js";

const SOAP_SYSTEM_PROMPT = "You are an expert clinical documentation assistant. Analyze the provided transcript and generate an insurance-compliant SOAP note. Format strictly as Subjective, Objective, Assessment, and Plan. Exclude conversational filler. Maintain clinical, objective language.";
const soapSchema = z.object({ subjective: z.string().min(1), objective: z.string().min(1), assessment: z.string().min(1), plan: z.string().min(1) });
export type SoapNote = z.infer<typeof soapSchema>;
const bedrock = new BedrockRuntimeClient({ region: config.AWS_REGION });
function parseJsonFromModel(text: string): unknown { const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]; return JSON.parse((fenced ?? text).trim()); }
export async function generateSoapNote(transcript: string): Promise<SoapNote> {
  const body = { anthropic_version: "bedrock-2023-05-31", max_tokens: 1200, temperature: 0.1, system: `${SOAP_SYSTEM_PROMPT}\nReturn only a JSON object with string keys: subjective, objective, assessment, plan.`, messages: [{ role: "user", content: [{ type: "text", text: transcript }] }] };
  const response = await bedrock.send(new InvokeModelCommand({ modelId: config.BEDROCK_MODEL_ID, contentType: "application/json", accept: "application/json", body: JSON.stringify(body) }));
  const decoded = JSON.parse(new TextDecoder().decode(response.body)) as { content?: Array<{ type?: string; text?: string }> };
  const text = decoded.content?.find((block) => block.type === "text")?.text;
  if (!text) throw new Error("Bedrock returned no note content.");
  return soapSchema.parse(parseJsonFromModel(text));
}
