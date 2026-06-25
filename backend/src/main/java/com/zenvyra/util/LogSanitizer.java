package com.zenvyra.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.regex.Pattern;

public final class LogSanitizer {

    private static final Pattern EMAIL = Pattern.compile(
            "[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern BEARER_TOKEN = Pattern.compile(
            "(?i)bearer\\s+[A-Za-z0-9._~+/=-]{12,}");
    private static final Pattern JWT = Pattern.compile(
            "\\beyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\b");
    private static final Pattern KEY_VALUE_SECRET = Pattern.compile(
            "(?i)\\b(token|secret|password|api[_-]?key|authorization|signature)\\s*[:=]\\s*[^\\s,;]+");
    private static final Pattern IPV4 = Pattern.compile(
            "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b");

    private LogSanitizer() {
    }

    public static String email(String value) {
        return fingerprint("email", value);
    }

    public static String url(String value) {
        return fingerprint("url", value);
    }

    public static String ip(String value) {
        return fingerprint("ip", value);
    }

    public static String id(String label, String value) {
        return fingerprint(label, value);
    }

    public static String message(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }
        String sanitized = EMAIL.matcher(value).replaceAll("[redacted-email]");
        sanitized = BEARER_TOKEN.matcher(sanitized).replaceAll("Bearer [redacted-token]");
        sanitized = JWT.matcher(sanitized).replaceAll("[redacted-jwt]");
        sanitized = KEY_VALUE_SECRET.matcher(sanitized).replaceAll("$1=[redacted]");
        sanitized = IPV4.matcher(sanitized).replaceAll("[redacted-ip]");
        return sanitized.length() > 240 ? sanitized.substring(0, 240) + "..." : sanitized;
    }

    public static String exception(Throwable throwable) {
        if (throwable == null) {
            return "unknown";
        }
        String type = throwable.getClass().getSimpleName();
        String detail = message(throwable.getMessage());
        return detail.isBlank() ? type : type + ": " + detail;
    }

    private static String fingerprint(String label, String value) {
        String normalizedLabel = label == null || label.isBlank() ? "value" : label.trim().toLowerCase();
        if (value == null || value.isBlank()) {
            return normalizedLabel + "#blank";
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(value.trim().toLowerCase().getBytes(StandardCharsets.UTF_8));
            return normalizedLabel + "#" + HexFormat.of().formatHex(hash).substring(0, 12);
        } catch (Exception ignored) {
            return normalizedLabel + "#redacted";
        }
    }
}
