const configuredClinicalApiUrl = import.meta.env.VITE_CLINICAL_API_URL?.trim();
const developmentClinicalApiUrl = "http://localhost:4000/api/v1";
// Keep the frontend build in sync with public static route corrections.
const deployedClinicalApiUrl = "https://api.somasyncai.com/api/v1";
const trustedProductionHosts = new Set(["somasyncai.com", "www.somasyncai.com"]);

function removeTrailingSlashes(value) {
  return value.replace(/\/+$/, "");
}

function isTrustedProductionHost() {
  return typeof window !== "undefined" && trustedProductionHosts.has(window.location.hostname);
}

export const clinicalApiBaseUrl = configuredClinicalApiUrl
  ? removeTrailingSlashes(configuredClinicalApiUrl)
  : import.meta.env.DEV
    ? developmentClinicalApiUrl
    : isTrustedProductionHost()
      ? deployedClinicalApiUrl
      : undefined;

export const isClinicalApiConfigured = Boolean(clinicalApiBaseUrl);

export const clinicalApiConfigurationMessage =
  "The beta service is temporarily unavailable. Please try again later.";

export function getClinicalApiBaseUrl() {
  if (!clinicalApiBaseUrl) {
    throw new Error(clinicalApiConfigurationMessage);
  }

  return clinicalApiBaseUrl;
}
