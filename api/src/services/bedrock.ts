import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { z } from "zod";
import { config } from "../config.js";

const SOAP_FIELDS = ["subjective", "objective", "assessment", "plan"] as const;
const soapSchema = z.object({
  subjective: z.string().trim().min(1).max(12_000),
  objective: z.string().trim().min(1).max(12_000),
  assessment: z.string().trim().min(1).max(12_000),
  plan: z.string().trim().min(1).max(12_000)
}).strict();
export type SoapNote = z.infer<typeof soapSchema>;

const SOAP_SYSTEM_PROMPT = [
  "You prepare a clinician-reviewable documentation draft for manual therapists and neuromuscular therapists.",
  "Use only the supplied session transcript. Do not diagnose, prescribe, infer unspoken facts, or include patient identifiers.",
  "The clinician must review and approve every field before clinical, insurance, or record use.",
  "Populate each SOAP field with concise, objective documentation language. Omit conversational filler.",
  "You must call the emit_soap_note tool exactly once. Do not return Markdown or prose outside that tool call."
].join(" ");

const soapTool = {
  name: "emit_soap_note",
  description: "Return the final SOAP documentation draft using exactly the required structured fields.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: [...SOAP_FIELDS],
    properties: {
      subjective: { type: "string", description: "Patient-reported symptoms, history, and response expressed in the transcript." },
      objective: { type: "string", description: "Observable findings and interventions explicitly documented in the transcript." },
      assessment: { type: "string", description: "Concise clinician-reviewable interpretation grounded only in the transcript." },
      plan: { type: "string", description: "Follow-up or continuation plan explicitly described in the transcript." }
    }
  }
};

const bedrock = new BedrockRuntimeClient({ region: config.AWS_REGION });

type BedrockToolBlock = { type?: string; name?: string; input?: unknown };
type BedrockResponse = { content?: BedrockToolBlock[] };

export async function generateSoapNote(transcript: string): Promise<SoapNote> {
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
  const decoded = JSON.parse(new TextDecoder().decode(response.body)) as BedrockResponse;
  const toolResult = decoded.content?.find((block) => block.type === "tool_use" && block.name === "emit_soap_note");
  if (!toolResult) throw new Error("SOAP model did not return the required strict structured response.");
  return soapSchema.parse(toolResult.input);
}
