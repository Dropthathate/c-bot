import { config } from "../config.js";
interface DeepgramResponse { results?: { channels?: Array<{ alternatives?: Array<{ transcript?: string }> }> }; }
export async function transcribeWithNoStore(audio: Buffer, mimeType: string): Promise<string> {
  // no_store=true requests documented no-store behavior. Confirm the account contract and vendor controls before PHI use.
  const endpoint = new URL("https://api.deepgram.com/v1/listen");
  endpoint.searchParams.set("model", config.DEEPGRAM_MODEL); endpoint.searchParams.set("smart_format", "true"); endpoint.searchParams.set("punctuate", "true"); endpoint.searchParams.set("no_store", "true");
  const result = await fetch(endpoint, { method: "POST", headers: { Authorization: `Token ${config.DEEPGRAM_API_KEY}`, "Content-Type": mimeType }, body: new Uint8Array(audio) });
  if (!result.ok) throw new Error(`Deepgram rejected the transcription request (${result.status}).`);
  const payload = (await result.json()) as DeepgramResponse;
  return payload.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim() ?? "";
}
