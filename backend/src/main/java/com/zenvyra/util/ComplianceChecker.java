package com.zenvyra.util;

import com.zenvyra.model.Website;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.nodes.Document;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public class ComplianceChecker {

    // Cookie consent patterns
    private static final List<String> COOKIE_KEYWORDS = List.of(
            "cookie", "consent", "gdpr", "ccpa", "privacy", "tracking");

    // Privacy policy patterns
    private static final List<String> PRIVACY_KEYWORDS = List.of(
            "privacy", "privacy policy", "data protection", "personal data");

    // SSL/TLS patterns
    private static final List<String> SSL_PROTOCOLS = List.of(
            "TLSv1.2", "TLSv1.3");

    public static List<Website.ComplianceIssue> checkCookieConsent(Document doc) {
        List<Website.ComplianceIssue> issues = new ArrayList<>();

        String html = doc.html().toLowerCase();
        boolean hasCookieBanner = false;

        // Check for common cookie banner implementations
        if (html.contains("cookieconsent") ||
                html.contains("cookie-banner") ||
                html.contains("gdpr-banner") ||
                html.contains("ccpa-banner") ||
                doc.select("[class*=cookie], [id*=cookie], [class*=consent], [id*=consent]").size() > 0) {
            hasCookieBanner = true;
        }

        if (!hasCookieBanner) {
            issues.add(Website.ComplianceIssue.builder()
                    .type("missing_cookie_banner")
                    .severity("high")
                    .title("Missing Cookie Consent Banner")
                    .description(
                            "Your website does not display a cookie consent banner. This is required under GDPR (EU), CCPA (California), and similar privacy laws.")
                    .fixSuggestion("Implement a cookie consent solution like CookieYes, OneTrust, or Cookiebot.")
                    .autoFixable(false)
                    .fixed(false)
                    .build());
        }

        return issues;
    }

    public static List<Website.ComplianceIssue> checkPrivacyPolicy(Document doc, String baseUrl) {
        List<Website.ComplianceIssue> issues = new ArrayList<>();

        boolean hasPrivacyLink = doc.select("a[href]").stream()
                .anyMatch(a -> {
                    String href = a.attr("href").toLowerCase();
                    String text = a.text().toLowerCase();
                    return href.contains("privacy") ||
                            text.contains("privacy policy") ||
                            text.contains("privacy");
                });

        if (!hasPrivacyLink) {
            issues.add(Website.ComplianceIssue.builder()
                    .type("missing_privacy_policy")
                    .severity("critical")
                    .title("Privacy Policy Link Not Found")
                    .description(
                            "No privacy policy link found on your website. This is legally required in most jurisdictions.")
                    .fixSuggestion("Create a privacy policy page and link it in your website footer.")
                    .autoFixable(true)
                    .fixed(false)
                    .build());
        }

        return issues;
    }

    public static List<Website.ComplianceIssue> checkTermsOfService(Document doc) {
        List<Website.ComplianceIssue> issues = new ArrayList<>();

        boolean hasTermsLink = doc.select("a[href]").stream()
                .anyMatch(a -> {
                    String href = a.attr("href").toLowerCase();
                    String text = a.text().toLowerCase();
                    return href.contains("terms") ||
                            text.contains("terms of service") ||
                            text.contains("terms and conditions");
                });

        if (!hasTermsLink) {
            issues.add(Website.ComplianceIssue.builder()
                    .type("missing_terms")
                    .severity("medium")
                    .title("Terms of Service Not Found")
                    .description(
                            "No terms of service link found. Required for websites offering services or collecting user data.")
                    .fixSuggestion("Create a terms of service page and link it in your footer.")
                    .autoFixable(true)
                    .fixed(false)
                    .build());
        }

        return issues;
    }

    public static List<Website.ComplianceIssue> checkContactInformation(Document doc) {
        List<Website.ComplianceIssue> issues = new ArrayList<>();

        boolean hasContactInfo = doc.select("a[href^=mailto:], a[href^=tel:], [class*=contact], [id*=contact]")
                .size() > 0 ||
                doc.text().toLowerCase().contains("contact us");

        if (!hasContactInfo) {
            issues.add(Website.ComplianceIssue.builder()
                    .type("missing_contact")
                    .severity("medium")
                    .title("Contact Information Missing")
                    .description(
                            "No clear contact information found. GDPR requires a contact point for data protection inquiries.")
                    .fixSuggestion("Add contact information including email address in your footer or contact page.")
                    .autoFixable(false)
                    .fixed(false)
                    .build());
        }

        return issues;
    }

    public static List<Website.ComplianceIssue> checkAccessibility(Document doc) {
        List<Website.ComplianceIssue> issues = new ArrayList<>();

        // Check for alt text on images
        long imagesWithoutAlt = doc.select("img:not([alt])").size();
        if (imagesWithoutAlt > 0) {
            issues.add(Website.ComplianceIssue.builder()
                    .type("missing_alt_text")
                    .severity("medium")
                    .title("Images Missing Alt Text")
                    .description(imagesWithoutAlt + " images found without alt text. Required for WCAG compliance.")
                    .fixSuggestion("Add descriptive alt text to all images.")
                    .autoFixable(false)
                    .fixed(false)
                    .build());
        }

        // Check for form labels
        long inputsWithoutLabels = doc.select("input:not([id]), select:not([id]), textarea:not([id])").size();
        if (inputsWithoutLabels > 0) {
            issues.add(Website.ComplianceIssue.builder()
                    .type("missing_form_labels")
                    .severity("low")
                    .title("Form Inputs Missing Labels")
                    .description("Some form inputs are missing associated labels.")
                    .fixSuggestion("Add labels or aria-label attributes to all form inputs.")
                    .autoFixable(false)
                    .fixed(false)
                    .build());
        }

        return issues;
    }

    public static List<Website.ComplianceIssue> checkSecurityHeaders(String url) {
        List<Website.ComplianceIssue> issues = new ArrayList<>();

        // These would be checked via HTTP response headers in actual implementation
        // For now, adding placeholder checks

        if (!url.startsWith("https")) {
            issues.add(Website.ComplianceIssue.builder()
                    .type("no_https")
                    .severity("critical")
                    .title("HTTPS Not Enabled")
                    .description("Your website is not using HTTPS. This is a critical security issue.")
                    .fixSuggestion("Enable SSL/TLS certificate and redirect HTTP to HTTPS.")
                    .autoFixable(false)
                    .fixed(false)
                    .build());
        }

        return issues;
    }
}
