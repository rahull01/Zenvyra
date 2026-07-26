import { describe, it, expect } from "vitest";
import { AUTH_ACCESS_COOKIE, AUTH_REFRESH_COOKIE } from "@/lib/auth";

describe("Auth constants", () => {
  it("backend cookie names match AuthCookieService constants", () => {
    expect(AUTH_ACCESS_COOKIE).toBe("zenvyra_access");
    expect(AUTH_REFRESH_COOKIE).toBe("zenvyra_refresh");
  });
});

describe("Pricing plans", () => {
  it("PRICING_PLANS has the expected 4 tiers", async () => {
    const { PRICING_PLANS } = await import("@/lib/pricing-plans");
    const ids = PRICING_PLANS.map((p: { id: string }) => p.id);
    expect(ids).toContain("free");
    expect(ids).toContain("growth");
    expect(ids).toContain("pro");
    expect(ids).toContain("agency");
    expect(ids).not.toContain("enterprise");
  });

  it("each plan has a monthlyPrice >= 0", async () => {
    const { PRICING_PLANS } = await import("@/lib/pricing-plans");
    for (const plan of PRICING_PLANS) {
      expect(plan.monthlyPrice).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("Utility functions", () => {
  it("cn combines class names", async () => {
    const { cn } = await import("@/lib/utils");
    const result = cn("foo", "bar");
    expect(result).toContain("foo");
    expect(result).toContain("bar");
  });
});
