import { clinicalApiBaseUrl, isClinicalApiConfigured } from "./runtimeConfig";

function csrfCookie() {
  const name = "somasync_csrf=";
  return document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(name))?.slice(name.length) || "";
}

function endpoint(path) {
  return `${clinicalApiBaseUrl}${path}`;
}

export async function establishClinicalSession(accessToken) {
  if (!isClinicalApiConfigured) return { ready: false, configured: false };
  const response = await fetch(endpoint("/auth/session/exchange"), {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return { ready: response.status === 204, configured: true };
}

export async function clearClinicalSession() {
  if (!isClinicalApiConfigured) return;
  const csrf = csrfCookie();
  if (!csrf) return;
  await fetch(endpoint("/auth/session"), {
    method: "DELETE",
    credentials: "include",
    cache: "no-store",
    headers: { "X-SomaSync-CSRF": csrf }
  });
}
