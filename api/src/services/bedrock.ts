import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { z } from "zod";
import { config } from "../config.js";

const SOAP_FIELDS = ["subjective", "objective", "assessment", "plan"] as const;
const transcriptSchema = z.string().trim().min(1).max(50_000);
const soapSchema = z.object({
  subjective: z.string().trim().max(6_000),
  objective: z.string().trim().max(6_000),
  assessment: z.string().trim().max(6_000),
  plan: z.string().trim().max(6_000)
}).strict();
export type SoapNote = z.infer<typeof soapSchema>;

const SOAP_SYSTEM_PROMPT = [
  "You prepare a clinician-reviewable documentation draft for manual therapists and neuromuscular therapists.",
  "Use only facts explicitly present in the supplied session transcript.",
  "Do not diagnose, prescribe, infer unspoken facts, make treatment decisions, or add patient identifiers.",
  "The clinician reviews, edits, and approves every field before any clinical, insurance, or record use.",
  "Return concise objective documentation language only. Do not include markdown, salutations, explanations, caveats, or conversational filler.",
  "Each required field must be present. Use an empty string when the transcript does not support a field.",
  "Call emit_soap_note exactly once and do not emit text outside that tool call."
].join(" ");

const soapTool = {
  name: "emit_soap_note",
  description: "Return the final clinician-reviewable SOAP documentation draft using exactly the required structured fields.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: [...SOAP_FIELDS],
    properties: {
      subjective: { type: "string", maxLength: 6000, description: "Patient-reported symptoms, history, and response expressly stated in the transcript." },
      objective: { type: "string", maxLength: 6000, description: "Observable findings and interventions expressly stated in the transcript." },
      assessment: { type: "string", maxLength: 6000, description: "Clinician-reviewable interpretation only when expressly present in the transcript." },
      plan: { type: "string", maxLength: 6000, description: "Follow-up or continuation plan only when expressly described in the transcript." }
    }
  }
};

const bedrock = new BedrockRuntimeClient({ region: config.AWS_REGION });

type BedrockContentBlock = { type?: string; name?: string; input?: unknown; text?: string };
type BedrockResponse = { content?: BedrockContentBlock[]; stop_reason?: string };

function normalizeField(value: string) {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, " ").replace(/\s+/g, " ").trim();
}

function validateStrictToolResponse(decoded: BedrockResponse) {
  const content = decoded.content || [];
  const toolUses = content.filter((block) => block.type === "tool_use" && block.name === "emit_soap_note");
  const textBlocks = content.filter((block) => typeof block.text === "string" && block.text.trim());
  if (decoded.stop_reason !== "tool_use" || toolUses.length !== 1 || content.length !== 1 || textBlocks.length > 0) {
    throw new Error("SOAP model did not return exactly one strict structured tool response.");
  }

  const parsed = soapSchema.parse(toolUses[0].input);
  return soapSchema.parse({
    subjective: normalizeField(parsed.subjective),
    objective: normalizeField(parsed.objective),
    assessment: normalizeField(parsed.assessment),
    plan: normalizeField(parsed.plan)
  });
}

export async function generateSoapNote(transcriptInput: string): Promise<SoapNote> {
  const transcript = transcriptSchema.parse(transcriptInput);
  const body = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 1200,
    temperature: 0,
    system: SOAP_SYSTEM_PROMPT,
    tools: [soapTool],
    tool_choice: { type: "tool", name: "emit_soap_note" },
    messages: [{ role: "user", content: [{ type: "text", text: transcript }] }]
  };

  const response = await bedrock.send(new InvokeModelCommand({
    modelId: config.BEDROCK_MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(body)
  }));
  return validateStrictToolResponse(JSON.parse(new TextDecoder().decode(response.body)) as BedrockResponse);
}
