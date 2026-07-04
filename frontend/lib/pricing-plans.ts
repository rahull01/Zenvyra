export type PricingPlanId = "free" | "growth" | "pro" | "enterprise";

export type PricingPlan = {
  id: PricingPlanId;
  backendPlanType: "FREE" | "GROWTH" | "PRO" | "ENTERPRISE";
  name: string;
  monthlyPrice: number;
  annualMonthlyPrice: number;
  features: string[];
  entitlementFeatures: ("LIVE_EMBED" | "DSAR_PORTAL" | "AUDIT_TRAIL" | "WHITE_LABEL")[];
  limits: {
    websites: number | "unlimited";
    policies: number | "unlimited";
    scans: number | "unlimited";
  };
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    backendPlanType: "FREE",
    name: "Free",
    monthlyPrice: 0,
    annualMonthlyPrice: 0,
    features: ["1 website", "AI and privacy readiness scan", "Compliance score preview"],
    entitlementFeatures: [],
    limits: { websites: 1, policies: 3, scans: 10 },
  },
  {
    id: "growth",
    backendPlanType: "GROWTH",
    name: "Starter",
    monthlyPrice: 49,
    annualMonthlyPrice: 39,
    features: ["1 website", "AI system inventory", "Live embed", "Audit trail", "25 scans per month"],
    entitlementFeatures: ["LIVE_EMBED", "AUDIT_TRAIL"],
    limits: { websites: 1, policies: 10, scans: 25 },
  },
  {
    id: "pro",
    backendPlanType: "PRO",
    name: "Pro",
    monthlyPrice: 199,
    annualMonthlyPrice: 159,
    features: ["10 websites", "AI readiness assessments", "Live embed", "DSAR portal", "Audit trail", "100 scans per month"],
    entitlementFeatures: ["LIVE_EMBED", "DSAR_PORTAL", "AUDIT_TRAIL"],
    limits: { websites: 10, policies: 25, scans: 100 },
  },
  {
    id: "enterprise",
    backendPlanType: "ENTERPRISE",
    name: "Enterprise",
    monthlyPrice: 999,
    annualMonthlyPrice: 799,
    features: ["Unlimited websites", "AI readiness assessments", "Live embed", "DSAR portal", "Audit trail", "White-label proof packs", "SSO", "Dedicated support"],
    entitlementFeatures: ["LIVE_EMBED", "DSAR_PORTAL", "AUDIT_TRAIL", "WHITE_LABEL"],
    limits: { websites: "unlimited", policies: "unlimited", scans: "unlimited" },
  },
];

export function planName(planId?: string) {
  return PRICING_PLANS.find((plan) => plan.id === planId)?.name || "Free";
}
