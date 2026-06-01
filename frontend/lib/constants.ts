export const APP_NAME = "ComplianceAI Pro";
export const APP_VERSION = "1.0.0";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

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

export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws";