package com.zenvyra.util;

import java.util.List;
import java.util.Locale;
import java.util.Set;

import lombok.extern.slf4j.Slf4j;

import java.net.InetAddress;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.UnknownHostException;
import java.util.regex.Pattern;

@Slf4j
public class ValidationUtil {

    private static final Set<String> BLOCKED_HOSTS = Set.of(
            "localhost",
            "metadata.google.internal",
            "metadata.goog",
            "kubernetes.default",
            "kubernetes.default.svc");

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

    /**
     * Normalizes user-supplied URL for outbound HTTP fetch (scanning, monitoring).
     */
    public static String normalizeUrlForFetch(String url) {
        if (url == null || url.isBlank()) {
            return null;
        }
        String trimmed = url.trim();
        if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
            trimmed = "https://" + trimmed;
        }
        return trimmed;
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
            log.error("Failed to extract domain from {}", LogSanitizer.url(url));
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

    /**
     * Validates URL for SSRF protection before making HTTP requests.
     * Blocks localhost, private IPs, and internal networks.
     */
    public static ValidationResult isSafeUrlForScanning(String url) {
        if (url == null || url.isBlank()) {
            return ValidationResult.invalid("URL cannot be null or empty");
        }

        String normalizedUrl = url.trim().toLowerCase();

        // Add https if no protocol
        if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
            normalizedUrl = "https://" + normalizedUrl;
        }

        // Only allow HTTP/HTTPS
        if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
            return ValidationResult.invalid("Only HTTP and HTTPS protocols are allowed");
        }

        try {
            URL urlObj = new URL(normalizedUrl);
            String host = urlObj.getHost();
            if (host == null || host.isBlank()) {
                return ValidationResult.invalid("Invalid URL host");
            }
            host = host.toLowerCase(Locale.ROOT);

            // Domain length check (RFC 1035)
            if (host.length() > 253) {
                return ValidationResult.invalid("Domain name too long");
            }

            if (BLOCKED_HOSTS.contains(host) || host.endsWith(".internal")) {
                return ValidationResult.invalid("Host is not allowed for scanning");
            }

            // Block link-local / metadata-style hostnames without DNS
            if (host.startsWith("0x") || host.matches("^\\d+$")) {
                return ValidationResult.invalid("Invalid host format");
            }

            // Block cloud metadata endpoint (decimal / dotted encodings are rejected as non-matching URL_PATTERN often,
            // but explicit IP checks cover 169.254.169.254)
            if ("169.254.169.254".equals(host) || host.startsWith("169.254.")) {
                return ValidationResult.invalid("Link-local cloud metadata targets are not allowed");
            }

            // Block localhost variations
            if ("localhost".equals(host) || "127.0.0.1".equals(host) || "::1".equals(host)) {
                return ValidationResult.invalid("Localhost access not allowed");
            }

            // Block private IP ranges
            if (isPrivateIP(host)) {
                return ValidationResult.invalid("Private IP addresses not allowed");
            }

            // Block link-local addresses
            if (isLinkLocalIP(host)) {
                return ValidationResult.invalid("Link-local addresses not allowed");
            }

            // Additional security checks
            if (host.contains("..") || host.startsWith(".") || host.endsWith(".")) {
                return ValidationResult.invalid("Invalid domain format");
            }

            return ValidationResult.valid();

        } catch (Exception e) {
            return ValidationResult.invalid("Invalid URL format: " + e.getMessage());
        }
    }

    /**
     * Checks if the given host is a private IP address.
     */
    private static boolean isPrivateIP(String host) {
        try {
            // Parse as IPv4
            String[] parts = host.split("\\.");
            if (parts.length == 4) {
                int[] octets = new int[4];
                for (int i = 0; i < 4; i++) {
                    octets[i] = Integer.parseInt(parts[i]);
                    if (octets[i] < 0 || octets[i] > 255) {
                        return false; // Invalid octet
                    }
                }

                // Check private IP ranges
                // 10.0.0.0/8
                if (octets[0] == 10) {
                    return true;
                }
                // 172.16.0.0/12
                if (octets[0] == 172 && octets[1] >= 16 && octets[1] <= 31) {
                    return true;
                }
                // 192.168.0.0/16
                if (octets[0] == 192 && octets[1] == 168) {
                    return true;
                }
                // 127.0.0.0/8 (loopback, though we already checked 127.0.0.1)
                if (octets[0] == 127) {
                    return true;
                }
            }

            // For IPv6, block common private ranges (simplified)
            if (host.contains("::1") || host.startsWith("fc") || host.startsWith("fd")) {
                return true;
            }

        } catch (NumberFormatException e) {
            // Not an IP address, continue with domain validation
        }

        return false;
    }

    /**
     * Resolves {@code host} and rejects addresses that are not suitable for public HTTP fetches (SSRF / DNS rebinding).
     */
    public static ValidationResult validateHostResolvesToPublicAddresses(String host) {
        if (host == null || host.isBlank()) {
            return ValidationResult.invalid("Host is required");
        }
        try {
            InetAddress[] addresses = InetAddress.getAllByName(host);
            if (addresses.length == 0) {
                return ValidationResult.invalid("Host did not resolve");
            }
            for (InetAddress addr : addresses) {
                if (addr.isLoopbackAddress()
                        || addr.isLinkLocalAddress()
                        || addr.isSiteLocalAddress()
                        || addr.isAnyLocalAddress()
                        || addr.isMulticastAddress()) {
                    return ValidationResult.invalid("Host resolves to a non-public network address");
                }
                byte[] raw = addr.getAddress();
                if (raw != null && raw.length == 4) {
                    int b0 = raw[0] & 0xff;
                    int b1 = raw[1] & 0xff;
                    if (b0 == 100 && b1 >= 64 && b1 <= 127) {
                        return ValidationResult.invalid("Host resolves to a CGNAT address");
                    }
                }
                // Unique local IPv6 (fc00::/7)
                if (addr.getHostAddress() != null && addr.getHostAddress().toLowerCase(Locale.ROOT).startsWith("fc")) {
                    return ValidationResult.invalid("Host resolves to a non-public IPv6 address");
                }
                if (addr.getHostAddress() != null && addr.getHostAddress().toLowerCase(Locale.ROOT).startsWith("fd")) {
                    return ValidationResult.invalid("Host resolves to a non-public IPv6 address");
                }
            }
            return ValidationResult.valid();
        } catch (UnknownHostException e) {
            return ValidationResult.invalid("Unknown host: " + host);
        }
    }

    /**
     * Checks if the given host is a link-local IP address.
     */
    private static boolean isLinkLocalIP(String host) {
        try {
            String[] parts = host.split("\\.");
            if (parts.length == 4) {
                int[] octets = new int[4];
                for (int i = 0; i < 4; i++) {
                    octets[i] = Integer.parseInt(parts[i]);
                }
                // 169.254.0.0/16 (link-local)
                return octets[0] == 169 && octets[1] == 254;
            }
        } catch (NumberFormatException e) {
            // Not an IP address
        }
        return false;
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
