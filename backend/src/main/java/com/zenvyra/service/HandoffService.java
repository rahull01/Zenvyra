package com.zenvyra.service;

import com.zenvyra.exception.ApiException;
import com.zenvyra.model.User;
import com.zenvyra.model.Website;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class HandoffService {

    private final WebsiteRepository websiteRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${app.url:http://localhost:3000}")
    private String appUrl;

    public Map<String, Object> handoff(String userEmail, String websiteId) {
        User user = requireUser(userEmail);
        Website website = requireOwnedWebsite(user, websiteId);
        String domain = website.getUrl() == null ? "website" : website.getUrl().replaceFirst("^https?://", "").replaceFirst("/.*$", "");
        String dashboardHandoffUrl = appUrl + "/dashboard/websites/" + website.getId() + "/handoff";
        return mapOf(
                "setupSummary", "Founder-led readiness setup pack for privacy, consent, certificate, and proof report.",
                "websiteId", website.getId(),
                "websiteUrl", website.getUrl(),
                "platform", user.getPlatform() == null || user.getPlatform().isBlank() ? "Custom or detected platform" : user.getPlatform(),
                "checkedRegions", List.of("UK", "USA", "EU-facing"),
                "readinessScore", website.getComplianceScore() == null ? 0 : website.getComplianceScore(),
                "outstandingIssues", website.getIssues() == null ? List.of() : website.getIssues().stream().filter(issue -> !issue.getFixed()).limit(8).toList(),
                "installInstructions", installInstructions(user.getPlatform()),
                "bannerScript", "<script src=\"" + appUrl + "/api/v1/banner/" + website.getId() + "/bundle.js\" async></script>",
                "policyLinks", List.of("/dashboard/policies"),
                "certificateLink", "/verify/" + website.getId(),
                "badgeCode", "<a href=\"" + appUrl + "/verify/" + website.getId() + "\"><img src=\"" + appUrl + "/badge/" + website.getId() + "\" alt=\"Zenvyra readiness badge for " + domain + "\" /></a>",
                "proofReportDownloadLink", "/reports/proof-pack/" + website.getId(),
                "supportContact", "support@zenvyra.com",
                "emailSubject", "Your Zenvyra setup pack is ready",
                "fileName", "Zenvyra-Pro-Setup-Pack-" + domain + ".pdf",
                "handoffUrl", dashboardHandoffUrl,
                "customerEmail", user.getEmail(),
                "disclaimer", "This setup pack is operational readiness evidence and implementation guidance, not legal advice."
        );
    }

    public Map<String, Object> sendHandoff(String userEmail, String websiteId) {
        User user = requireUser(userEmail);
        Map<String, Object> payload = handoff(userEmail, websiteId);
        String subject = String.valueOf(payload.get("emailSubject"));
        String text = """
                Hi %s,

                Your Zenvyra setup pack is ready.

                Website:
                %s

                Open setup handoff:
                %s

                Proof report:
                %s

                Public certificate:
                %s

                This setup pack is operational readiness evidence and implementation guidance, not legal advice.

                Support:
                %s
                """.formatted(
                user.getFullName() == null ? "there" : user.getFullName(),
                payload.get("websiteUrl"),
                payload.get("handoffUrl"),
                appUrl + payload.get("proofReportDownloadLink"),
                appUrl + payload.get("certificateLink"),
                payload.get("supportContact"));
        emailService.sendSetupPackReadyEmail(user.getEmail(), subject, text);
        payload.put("deliveryStatus", "sent_or_logged");
        return payload;
    }

    private User requireUser(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> ApiException.unauthorized("User not found"));
    }

    private Website requireOwnedWebsite(User user, String websiteId) {
        Website website = websiteRepository.findById(websiteId).orElseThrow(() -> ApiException.notFound("Website"));
        if (!user.getId().equals(website.getUserId()) && !"ROLE_ADMIN".equals(user.getRole())) {
            throw ApiException.forbidden("You do not have access to this website");
        }
        return website;
    }

    private List<String> installInstructions(String platform) {
        String value = platform == null ? "" : platform.toLowerCase();
        if (value.contains("shopify")) {
            return List.of("Open Shopify theme editor and add the banner script before the closing body tag.", "Publish reviewed policy links in footer navigation.", "Re-run install verification after publishing.");
        }
        if (value.contains("wordpress") || value.contains("woocommerce")) {
            return List.of("Add the banner script through the approved plugin or global footer injection.", "Publish reviewed policy links in the site footer.", "Clear cache and re-run install verification.");
        }
        if (value.contains("webflow")) {
            return List.of("Paste the banner script in Webflow site custom code before the closing body tag.", "Publish reviewed policy links.", "Publish the site and re-run install verification.");
        }
        if (value.contains("gtm")) {
            return List.of("Create a GTM custom HTML tag for the banner script.", "Trigger it on all pages before non-essential marketing tags.", "Publish the container and re-run install verification.");
        }
        return List.of("Install the banner snippet before the closing body tag.", "Publish reviewed policy links.", "Verify the public certificate and badge after installation.");
    }

    private Map<String, Object> mapOf(Object... values) {
        Map<String, Object> map = new LinkedHashMap<>();
        for (int i = 0; i + 1 < values.length; i += 2) {
            map.put(String.valueOf(values[i]), values[i + 1]);
        }
        return map;
    }
}
