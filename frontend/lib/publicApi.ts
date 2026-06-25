import { backendApiBaseUrl, publicSiteUrl } from "./env";

export function publicBackendBaseUrl() {
  return backendApiBaseUrl().replace(/\/api\/v1\/?$/, "/api").replace(/\/$/, "");
}

export function publicAppBaseUrl() {
  return publicSiteUrl();
}
