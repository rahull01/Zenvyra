package com.zenvyra.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PlanTypeTest {

    @Test
    void from_nullOrBlankReturnsFree() {
        assertEquals(PlanType.FREE, PlanType.from(null));
        assertEquals(PlanType.FREE, PlanType.from(""));
        assertEquals(PlanType.FREE, PlanType.from("   "));
    }

    @Test
    void from_canonicalNames() {
        assertEquals(PlanType.FREE, PlanType.from("FREE"));
        assertEquals(PlanType.GROWTH, PlanType.from("growth"));
        assertEquals(PlanType.PRO, PlanType.from("Pro"));
        assertEquals(PlanType.AGENCY, PlanType.from("AGENCY"));
    }

    @Test
    void from_legacyAliases() {
        // legacy "starter" maps to GROWTH
        assertEquals(PlanType.GROWTH, PlanType.from("starter"));
        assertEquals(PlanType.GROWTH, PlanType.from("STARTER"));
        // legacy "enterprise" maps to AGENCY
        assertEquals(PlanType.AGENCY, PlanType.from("enterprise"));
        assertEquals(PlanType.AGENCY, PlanType.from("Enterprise"));
    }

    @Test
    void from_unknownReturnsFree() {
        assertEquals(PlanType.FREE, PlanType.from("unknown"));
        assertEquals(PlanType.FREE, PlanType.from("premium"));
    }

    @Test
    void entitlementsAreConsistent() {
        // Every paid tier must include LIVE_EMBED and AUDIT_TRAIL.
        for (PlanType plan : PlanType.values()) {
            if (plan == PlanType.FREE) {
                continue;
            }
            assertEquals(true, plan.getFeaturesEnabled().contains("LIVE_EMBED"),
                    "Plan " + plan + " should include LIVE_EMBED");
            assertEquals(true, plan.getFeaturesEnabled().contains("AUDIT_TRAIL"),
                    "Plan " + plan + " should include AUDIT_TRAIL");
        }
        // Only AGENCY has WHITE_LABEL.
        assertEquals(true, PlanType.AGENCY.getFeaturesEnabled().contains("WHITE_LABEL"));
        assertEquals(false, PlanType.PRO.getFeaturesEnabled().contains("WHITE_LABEL"));
        assertEquals(false, PlanType.GROWTH.getFeaturesEnabled().contains("WHITE_LABEL"));
    }

    @Test
    void websiteQuotasIncreaseByTier() {
        assertEquals(1, PlanType.FREE.getMaxWebsitesAllowed());
        assertEquals(3, PlanType.GROWTH.getMaxWebsitesAllowed());
        assertEquals(10, PlanType.PRO.getMaxWebsitesAllowed());
        assertEquals(50, PlanType.AGENCY.getMaxWebsitesAllowed());
    }
}
