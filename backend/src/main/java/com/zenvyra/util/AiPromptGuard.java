package com.zenvyra.util;

import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Reduces prompt-injection risk for untrusted strings interpolated into LLM prompts.
 */
public final class AiPromptGuard {

    private static final int MAX_SINGLE_FIELD = 4_000;
    private static final Pattern CONTROL_CHARS = Pattern.compile("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F]");

    private AiPromptGuard() {
    }

    public static String sanitizeUntrustedText(String input, int maxLen) {
        if (input == null) {
            return "";
        }
        String trimmed = input.trim();
        if (trimmed.length() > maxLen) {
            trimmed = trimmed.substring(0, maxLen);
        }
        trimmed = CONTROL_CHARS.matcher(trimmed).replaceAll(" ");
        String lower = trimmed.toLowerCase(Locale.ROOT);
        if (lower.contains("ignore previous") || lower.contains("ignore all previous")
                || lower.contains("disregard previous") || lower.contains("system prompt")
                || lower.contains("you are now") || lower.contains("new instructions:")) {
            return "[redacted: disallowed instruction pattern]";
        }
        return trimmed;
    }

    public static String forUserProvidedUrl(String url) {
        return sanitizeUntrustedText(url, 2_048);
    }

    public static String forPolicyField(String value) {
        return sanitizeUntrustedText(value, MAX_SINGLE_FIELD);
    }
}
