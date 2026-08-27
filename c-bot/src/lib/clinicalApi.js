/**
 * Browser boundary for clinical processing. The frontend can carry a user session token,
 * but it must never contain Deepgram, AWS, Bedrock, database, or encryption credentials.
 */
import { isSupabaseConfigured, supabase, supabaseConfigurationMessage } from "../integrations/supabase/client";
import { clinicalApiConfigurationMessage, getClinicalApiBaseUrl, isClinicalApiConfigured } from "./runtimeConfig";

function apiUrl(path) {
  return `${getClinicalApiBaseUrl()}${path}`;
}

async function authorizationHeader() {
  if (!isClinicalApiConfigured) {
    throw new Error(clinicalApiConfigurationMessage);
  }
  if (!isSupabaseConfigured) {
    throw new Error(`${supabaseConfigurationMessage} Clinical voice and documentation processing remains disabled in this public beta.`);
  }
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
  const response = await fetch(apiUrl("/voice/transcribe"), { method: "POST", headers: await authorizationHeader(), body: form });
  return unwrap(response);
}

export async function createSoapDraft(transcript) {
  const response = await fetch(apiUrl("/voice/generate-soap"), { method: "POST", headers: { "Content-Type": "application/json", ...(await authorizationHeader()) }, body: JSON.stringify({ transcript }) });
  return unwrap(response);
}

export async function registerBetaLead(email) {
  const response = await fetch(apiUrl("/public/beta-leads"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
  return unwrap(response);
}
