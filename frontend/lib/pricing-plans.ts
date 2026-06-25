export type PricingPlanId = "free" | "growth" | "pro" | "agency";

export type PricingPlan = {
  id: PricingPlanId;
  backendPlanType: "FREE" | "GROWTH" | "PRO" | "AGENCY";
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
    features: ["1 website", "UK/US readiness scan", "Compliance score preview"],
    entitlementFeatures: [],
    limits: { websites: 1, policies: 3, scans: 10 },
  },
  {
    id: "growth",
    backendPlanType: "GROWTH",
    name: "Growth",
    monthlyPrice: 29,
    annualMonthlyPrice: 23,
    features: ["3 websites", "Live embed", "Audit trail", "25 scans per month"],
    entitlementFeatures: ["LIVE_EMBED", "AUDIT_TRAIL"],
    limits: { websites: 3, policies: 10, scans: 25 },
  },
  {
    id: "pro",
    backendPlanType: "PRO",
    name: "Pro",
    monthlyPrice: 79,
    annualMonthlyPrice: 63,
    features: ["10 websites", "Live embed", "DSAR portal", "Audit trail", "100 scans per month"],
    entitlementFeatures: ["LIVE_EMBED", "DSAR_PORTAL", "AUDIT_TRAIL"],
    limits: { websites: 10, policies: 25, scans: 100 },
  },
  {
    id: "agency",
    backendPlanType: "AGENCY",
    name: "Agency",
    monthlyPrice: 199,
    annualMonthlyPrice: 159,
    features: ["50 websites", "Live embed", "DSAR portal", "Audit trail", "White-label proof packs"],
    entitlementFeatures: ["LIVE_EMBED", "DSAR_PORTAL", "AUDIT_TRAIL", "WHITE_LABEL"],
    limits: { websites: 50, policies: 100, scans: 500 },
  },
];

export function planName(planId?: string) {
  return PRICING_PLANS.find((plan) => plan.id === planId)?.name || "Free";
}
