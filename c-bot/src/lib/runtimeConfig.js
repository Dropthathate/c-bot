const configuredClinicalApiUrl = import.meta.env.VITE_CLINICAL_API_URL?.trim();
const developmentClinicalApiUrl = "http://localhost:4000/api/v1";

function removeTrailingSlashes(value) {
  return value.replace(/\/+$/, "");
}

export const clinicalApiBaseUrl = configuredClinicalApiUrl
  ? removeTrailingSlashes(configuredClinicalApiUrl)
  : import.meta.env.DEV
    ? developmentClinicalApiUrl
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
