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

/**
 * Canonical pricing tiers. The `id` and `backendPlanType` values MUST
 * match the backend `PlanType` enum (`FREE`, `GROWTH`, `PRO`, `AGENCY`)
 * and the `dodo.products.<tier-lowercase>` env keys. The user-facing
 * `name` field can change without affecting backend storage.
 */
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    backendPlanType: "FREE",
    name: "Free",
    monthlyPrice: 0,
    annualMonthlyPrice: 0,
    features: [
      "1 website",
      "AI and privacy readiness scan",
      "Compliance score preview",
    ],
    entitlementFeatures: [],
    limits: { websites: 1, policies: 3, scans: 10 },
  },
  {
    id: "growth",
    backendPlanType: "GROWTH",
    name: "Growth",
    monthlyPrice: 49,
    annualMonthlyPrice: 39,
    features: [
      "Up to 3 websites",
      "AI system inventory",
      "Live embed",
      "Audit trail",
      "25 scans per month",
    ],
    entitlementFeatures: ["LIVE_EMBED", "AUDIT_TRAIL"],
    limits: { websites: 3, policies: 10, scans: 25 },
  },
  {
    id: "pro",
    backendPlanType: "PRO",
    name: "Pro",
    monthlyPrice: 199,
    annualMonthlyPrice: 159,
    features: [
      "Up to 10 websites",
      "AI readiness assessments",
      "Live embed",
      "DSAR portal",
      "Audit trail",
      "100 scans per month",
    ],
    entitlementFeatures: ["LIVE_EMBED", "DSAR_PORTAL", "AUDIT_TRAIL"],
    limits: { websites: 10, policies: 25, scans: 100 },
  },
  {
    id: "agency",
    backendPlanType: "AGENCY",
    name: "Agency",
    monthlyPrice: 999,
    annualMonthlyPrice: 799,
    features: [
      "Up to 50 websites (unlimited on request)",
      "AI readiness assessments",
      "Live embed",
      "DSAR portal",
      "Audit trail",
      "White-label proof packs",
      "SSO (roadmap)",
      "Dedicated support",
    ],
    entitlementFeatures: ["LIVE_EMBED", "DSAR_PORTAL", "AUDIT_TRAIL", "WHITE_LABEL"],
    limits: { websites: 50, policies: "unlimited", scans: "unlimited" },
  },
];

export function planName(planId?: string): string {
  return PRICING_PLANS.find((plan) => plan.id === planId)?.name || "Free";
}

export function planForBackendPlanType(backend: string): PricingPlan | undefined {
  return PRICING_PLANS.find((p) => p.backendPlanType === backend);
}
