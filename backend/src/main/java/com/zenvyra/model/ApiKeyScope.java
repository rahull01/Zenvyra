package com.zenvyra.model;

import java.util.Optional;

/**
 * Scopes available on an API key. Scopes gate which external endpoints a
 * caller can invoke when authenticating with an API key (sk_live_...).
 *
 * Stored as the lowercase enum name on {@link ApiKey#getScopes()}; comparisons
 * in {@link com.zenvyra.security.ApiKeyAuthenticationFilter} are also performed
 * case-insensitively to match the lowercasing applied by
 * {@link com.zenvyra.service.ApiKeyManagementService}.
 */
public enum ApiKeyScope {
    /** Allows creating evidence items via POST /v1/external/ai-act/evidence. */
    EVIDENCE_WRITE,
    /** Allows listing AI systems via GET /v1/external/ai-act/systems. */
    SYSTEMS_READ,
    /** Allows creating AI systems via POST /v1/external/ai-act/systems. */
    SYSTEMS_WRITE;

    /**
     * Parse a stored scope value (case-insensitive) into an {@link ApiKeyScope}.
     * Returns empty for null, blank, or unrecognized values so callers can
     * cleanly ignore unknown scopes instead of failing closed.
     */
    public static Optional<ApiKeyScope> fromString(String value) {
        if (value == null || value.isBlank()) {
            return Optional.empty();
        }
        try {
            return Optional.of(ApiKeyScope.valueOf(value.trim().toUpperCase()));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
