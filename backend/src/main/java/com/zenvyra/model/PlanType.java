package com.zenvyra.model;

import java.util.List;

public enum PlanType {
    FREE(1, List.of()),
    GROWTH(3, List.of("LIVE_EMBED", "AUDIT_TRAIL")),
    PRO(10, List.of("LIVE_EMBED", "DSAR_PORTAL", "AUDIT_TRAIL")),
    AGENCY(50, List.of("LIVE_EMBED", "DSAR_PORTAL", "AUDIT_TRAIL", "WHITE_LABEL"));

    private final int maxWebsitesAllowed;
    private final List<String> featuresEnabled;

    PlanType(int maxWebsitesAllowed, List<String> featuresEnabled) {
        this.maxWebsitesAllowed = maxWebsitesAllowed;
        this.featuresEnabled = featuresEnabled;
    }

    public int getMaxWebsitesAllowed() {
        return maxWebsitesAllowed;
    }

    public List<String> getFeaturesEnabled() {
        return featuresEnabled;
    }

    public static PlanType from(String value) {
        if (value == null || value.isBlank()) {
            return FREE;
        }
        try {
            return PlanType.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ignored) {
            if ("enterprise".equalsIgnoreCase(value)) return AGENCY;
            return FREE;
        }
    }
}
