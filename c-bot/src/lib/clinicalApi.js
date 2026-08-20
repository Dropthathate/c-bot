/**
 * Browser boundary for clinical processing. The frontend can carry a user session token,
 * but it must never contain Deepgram, AWS, Bedrock, database, or encryption credentials.
 */
import { supabase } from "../integrations/supabase/client";

const apiBaseUrl = import.meta.env.VITE_CLINICAL_API_URL ?? "http://localhost:4000/api/v1";

async function authorizationHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Your session has expired. Sign in again to continue.");
  return { Authorization: `Bearer ${session.access_token}` };
}

async function unwrap(response) {
  if (response.ok) return response.json();
  const payload = await response.json().catch(() => ({}));
  throw new Error(payload.error?.message ?? `The secure API request failed (${response.status}).`);
}

export async function transcribeAudio(audio) {
  const form = new FormData();
  form.append("audio", audio, `somasync-${Date.now()}.webm`);
  const response = await fetch(`${apiBaseUrl}/voice/transcribe`, { method: "POST", headers: await authorizationHeader(), body: form });
  return unwrap(response);
}

export async function createSoapDraft(transcript) {
  const response = await fetch(`${apiBaseUrl}/voice/generate-soap`, { method: "POST", headers: { "Content-Type": "application/json", ...(await authorizationHeader()) }, body: JSON.stringify({ transcript }) });
  return unwrap(response);
}

export async function registerBetaLead(email) {
  const response = await fetch(`${apiBaseUrl}/public/beta-leads`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
  return unwrap(response);
}
