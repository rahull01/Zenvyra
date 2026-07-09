package com.zenvyra.domain.aiact;

/**
 * Categorical risk levels recognised by the Zenvyra AI Act readiness ruleset.
 *
 * <p>The {@link #label} preserves the human-readable strings that were historically
 * stored on {@code AiActAssessment.riskCategory} so older assessments and tests
 * remain compatible with the catalog refactor.
 */
public enum RiskLevel {
    PROHIBITED("prohibited risk indicator"),
    HIGH_RISK("high-risk indicator"),
    LIMITED_RISK("limited-risk transparency"),
    MINIMAL_RISK("minimal risk");

    private final String label;

    RiskLevel(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
