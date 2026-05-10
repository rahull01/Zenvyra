package com.complianceai.util;

import java.util.List;

import lombok.extern.slf4j.Slf4j;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.regex.Pattern;

@Slf4j
public class ValidationUtil {

    // Email validation regex
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    // URL validation regex
    private static final Pattern URL_PATTERN = Pattern.compile(
            "^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$");

    // Password strength regex (min 8 chars, at least 1 uppercase, 1 lowercase, 1
    // digit, 1 special)
    private static final Pattern STRONG_PASSWORD_PATTERN = Pattern.compile(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");

    // Domain name regex
    private static final Pattern DOMAIN_PATTERN = Pattern.compile(
            "^([a-zA-Z0-9]([a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?\\.)*[a-zA-Z0-9]([a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?$");

    public static boolean isValidEmail(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email).matches();
    }

    public static boolean isValidUrl(String url) {
        if (url == null || url.isBlank()) {
            return false;
        }

        // Add protocol if missing for validation
        String urlToCheck = url;
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            urlToCheck = "https://" + url;
        }

        try {
            new URL(urlToCheck);
            return URL_PATTERN.matcher(urlToCheck).matches();
        } catch (MalformedURLException e) {
            return false;
        }
    }

    public static boolean isValidDomain(String domain) {
        if (domain == null || domain.isBlank()) {
            return false;
        }
        return DOMAIN_PATTERN.matcher(domain).matches();
    }

    public static boolean isStrongPassword(String password) {
        if (password == null || password.isBlank()) {
            return false;
        }
        return STRONG_PASSWORD_PATTERN.matcher(password).matches();
    }

    public static String normalizeUrl(String url) {
        if (url == null || url.isBlank()) {
            return null;
        }

        String normalized = url.trim().toLowerCase();

        // Add https if no protocol
        if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
            normalized = "https://" + normalized;
        }

        // Remove trailing slash
        if (normalized.endsWith("/")) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }

        return normalized;
    }

    public static String extractDomain(String url) {
        if (url == null || url.isBlank()) {
            return null;
        }

        try {
            String urlWithProtocol = normalizeUrl(url);
            if (urlWithProtocol == null)
                return null;

            URL urlObj = new URL(urlWithProtocol);
            return urlObj.getHost();
        } catch (MalformedURLException e) {
            log.error("Failed to extract domain from: {}", url);
            return null;
        }
    }

    public static boolean isValidPlan(String plan) {
        return plan != null && List.of("free", "starter", "pro", "enterprise").contains(plan.toLowerCase());
    }

    public static boolean isValidLanguage(String language) {
        return language != null && List.of("en", "de", "fr", "es", "it", "nl").contains(language.toLowerCase());
    }

    public static boolean isValidIndustry(String industry) {
        if (industry == null || industry.isBlank())
            return false;

        List<String> validIndustries = List.of(
                "technology", "healthcare", "finance", "education",
                "retail", "manufacturing", "services", "other");
        return validIndustries.contains(industry.toLowerCase());
    }

    public static String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }

        return input
                .trim()
                .replaceAll("<script>", "")
                .replaceAll("</script>", "")
                .replaceAll("javascript:", "")
                .replaceAll("on\\w+=", "");
    }

    public static class ValidationResult {
        private final boolean valid;
        private final String errorMessage;

        private ValidationResult(boolean valid, String errorMessage) {
            this.valid = valid;
            this.errorMessage = errorMessage;
        }

        public static ValidationResult valid() {
            return new ValidationResult(true, null);
        }

        public static ValidationResult invalid(String message) {
            return new ValidationResult(false, message);
        }

        public boolean isValid() {
            return valid;
        }

        public String getErrorMessage() {
            return errorMessage;
        }
    }

    public static ValidationResult validateSignup(String email, String password, String fullName) {
        if (!isValidEmail(email)) {
            return ValidationResult.invalid("Invalid email format");
        }

        if (!isStrongPassword(password)) {
            return ValidationResult.invalid(
                    "Password must be at least 8 characters with uppercase, lowercase, digit, and special character");
        }

        if (fullName == null || fullName.trim().length() < 2) {
            return ValidationResult.invalid("Full name must be at least 2 characters");
        }

        return ValidationResult.valid();
    }
}
