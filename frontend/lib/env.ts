const isProductionRuntime =
  process.env.VERCEL_ENV === "production" || process.env.Zenvyra_REQUIRE_PROD_ENV === "true";

function requiredEnv(name: string, fallback: string) {
  const value = process.env[name];
  if (value && value.trim()) {
    return value.trim();
  }
  if (isProductionRuntime) {
    throw new Error(`${name} must be configured for production.`);
  }
  return fallback;
}

export function backendApiBaseUrl() {
  return requiredEnv("API_BASE_URL", process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api")
    .replace(/\/$/, "");
}

export function publicApiBaseUrl() {
  return requiredEnv("NEXT_PUBLIC_API_URL", "http://localhost:8080/api").replace(/\/$/, "");
}

export function publicWebSocketUrl() {
  return requiredEnv("NEXT_PUBLIC_WS_URL", "ws://localhost:8080/api/ws");
}

export function publicSiteUrl() {
  return requiredEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000").replace(/\/$/, "");
}
