package com.zenvyra.model;

import java.util.List;

/**
 * Plan tier enum. Display names are mapped from these by the frontend
 * `pricing-plans.ts`. The Dodo product IDs are read from
 * `dodo.products.<tier-lowercase>` in `application.yml`.
 *
 * <p>The set of valid plan tiers is intentionally narrow:
 * <ul>
 *   <li>{@link #FREE} — default for new accounts.</li>
 *   <li>{@link #GROWTH} — entry paid tier (was historically called "starter").</li>
 *   <li>{@link #PRO} — mid-tier.</li>
 *   <li>{@link #AGENCY} — top tier (was historically called "enterprise").</li>
 * </ul>
 *
 * <p>Legacy aliases are accepted in {@link #from(String)} for backward
 * compatibility with stored subscriptions:
 * <ul>
 *   <li>"starter" → GROWTH</li>
 *   <li>"enterprise" → AGENCY</li>
 * </ul>
 */
public enum PlanType {
    FREE(1, List.of(), 10, 3, 3),
    GROWTH(3, List.of("LIVE_EMBED", "AUDIT_TRAIL"), 25, 10, 10),
    PRO(10, List.of("LIVE_EMBED", "DSAR_PORTAL", "AUDIT_TRAIL"), 100, 25, 25),
    AGENCY(50, List.of("LIVE_EMBED", "DSAR_PORTAL", "AUDIT_TRAIL", "WHITE_LABEL"), Integer.MAX_VALUE, Integer.MAX_VALUE, Integer.MAX_VALUE);

    private final int maxWebsitesAllowed;
    private final List<String> featuresEnabled;
    private final int maxScansAllowed;
    private final int maxPoliciesAllowed;
    private final int maxAiSystemsAllowed;

    PlanType(int maxWebsitesAllowed, List<String> featuresEnabled, int maxScansAllowed, int maxPoliciesAllowed, int maxAiSystemsAllowed) {
        this.maxWebsitesAllowed = maxWebsitesAllowed;
        this.featuresEnabled = featuresEnabled;
        this.maxScansAllowed = maxScansAllowed;
        this.maxPoliciesAllowed = maxPoliciesAllowed;
        this.maxAiSystemsAllowed = maxAiSystemsAllowed;
    }

    public int getMaxWebsitesAllowed() {
        return maxWebsitesAllowed;
    }

    public List<String> getFeaturesEnabled() {
        return featuresEnabled;
    }

    public int getMaxScansAllowed() {
        return maxScansAllowed;
    }

    public int getMaxPoliciesAllowed() {
        return maxPoliciesAllowed;
    }

    public int getMaxAiSystemsAllowed() {
        return maxAiSystemsAllowed;
    }

    /**
     * Map a user-facing plan string (case-insensitive) to a {@link PlanType}.
     * Accepts legacy aliases "starter" and "enterprise" for backward
     * compatibility with stored subscriptions.
     *
     * @return the resolved plan, or {@link #FREE} if the input is null,
     *         blank, or unrecognized.
     */
    public static PlanType from(String value) {
        if (value == null || value.isBlank()) {
            return FREE;
        }
        String normalized = value.trim().toLowerCase();
        // Legacy aliases from older code/docs.
        if ("starter".equals(normalized)) {
            return GROWTH;
        }
        if ("enterprise".equals(normalized)) {
            return AGENCY;
        }
        try {
            return PlanType.valueOf(normalized.toUpperCase());
        } catch (IllegalArgumentException ignored) {
            return FREE;
        }
    }
}
