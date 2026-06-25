import { publicApiBaseUrl, publicSiteUrl, publicWebSocketUrl } from "./env";

export const APP_NAME = "Zenvyra";
export const APP_VERSION = "1.0.0";

export const API_BASE_URL = publicApiBaseUrl();
export const PUBLIC_APP_URL = publicSiteUrl();

export const COMPLIANCE_CATEGORIES = [
    "GDPR",
    "CCPA",
    "LGPD",
    "PIPEDA",
    "Accessibility",
    "Cookie Law",
    "SSL/TLS",
] as const;

export const SEVERITY_LEVELS = {
    CRITICAL: "critical",
    HIGH: "high",
    MEDIUM: "medium",
    LOW: "low",
} as const;

export const PLANS = {
    STARTER: "starter",
    PRO: "pro",
    ENTERPRISE: "enterprise",
} as const;

export const SCAN_LIMITS = {
    [PLANS.STARTER]: 3,
    [PLANS.PRO]: 10,
    [PLANS.ENTERPRISE]: Infinity,
} as const;

export const WS_URL = publicWebSocketUrl();

export const POLICY_EMBED_CONFIG = {
    IFRAME_HEIGHT: 800,
    IFRAME_BORDER: "none",
    IFRAME_LOADING: "lazy",
} as const;
