package com.zenvyra.domain.aiact;

import org.springframework.stereotype.Component;

/**
 * Resolves a {@link AiActRuleCatalog} by ruleset version.
 *
 * <p>The factory keeps orchestration code ({@code AiActReadinessService}) free of
 * version dispatch logic. The current production ruleset is
 * {@link AiActRuleCatalogV2026_07} and is injected by Spring. Older or newer
 * catalog versions can be added later and resolved via {@link #get(String)}.
 */
@Component
public class AiActRuleCatalogFactory {

    private final AiActRuleCatalogV2026_07 currentCatalog;

    public AiActRuleCatalogFactory(AiActRuleCatalogV2026_07 currentCatalog) {
        this.currentCatalog = currentCatalog;
    }

    /**
     * @return the catalog for the current production ruleset.
     */
    public AiActRuleCatalog current() {
        return currentCatalog;
    }

    /**
     * @param version ruleset version string (e.g. {@code "EU_AI_ACT_READINESS_2026_07"}).
     * @return the catalog matching {@code version}.
     * @throws IllegalArgumentException if no catalog is registered for the version.
     */
    public AiActRuleCatalog get(String version) {
        if (AiActRuleCatalogV2026_07.VERSION.equals(version)) {
            return currentCatalog;
        }
        throw new IllegalArgumentException("Unsupported ruleset version: " + version);
    }
}
