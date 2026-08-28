import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import {
  SOAP_TOOL_NAME,
  clinicalDocumentationSystemPrompt,
  clinicalTranscriptMessage,
  normalizeSoapNote,
  soapToolInputSchema,
  type SoapNote
} from "./clinical-prompt.js";
import { config } from "../config.js";

const bedrock = new BedrockRuntimeClient({ region: config.AWS_REGION });

type BedrockToolBlock = {
  type?: string;
  name?: string;
  input?: unknown;
};

type BedrockResponse = {
  stop_reason?: string;
  content?: BedrockToolBlock[];
};

export function strictSoapRequest(transcript: string) {
  return {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 1600,
    temperature: 0,
    system: clinicalDocumentationSystemPrompt,
    tools: [{
      name: SOAP_TOOL_NAME,
      description: "Emit exactly one clinician-reviewable SOAP draft that has the required four fields and no other content.",
      strict: true,
      input_schema: soapToolInputSchema
    }],
    tool_choice: { type: "tool", name: SOAP_TOOL_NAME },
    messages: [{
      role: "user",
      content: [{ type: "text", text: clinicalTranscriptMessage(transcript) }]
    }]
  };
}

export function parseStrictSoapResponse(value: unknown): SoapNote {
  const response = value as BedrockResponse;
  if (response.stop_reason !== "tool_use" || !Array.isArray(response.content) || response.content.length !== 1) {
    throw new Error("The clinical drafting response did not satisfy the strict SOAP contract.");
  }
  const [toolBlock] = response.content;
  if (toolBlock?.type !== "tool_use" || toolBlock.name !== SOAP_TOOL_NAME) {
    throw new Error("The clinical drafting response did not call the required SOAP tool.");
  }
  return normalizeSoapNote(toolBlock.input);
}

export async function generateSoapNote(transcript: string): Promise<SoapNote> {
  const request = strictSoapRequest(transcript);
  const response = await bedrock.send(new InvokeModelCommand({
    modelId: config.BEDROCK_MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(request)
  }));
  const decoded = JSON.parse(new TextDecoder().decode(response.body)) as unknown;
  return parseStrictSoapResponse(decoded);
}
