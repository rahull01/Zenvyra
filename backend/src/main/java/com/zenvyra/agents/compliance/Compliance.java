package com.zenvyra.agents.compliance;

import com.zenvyra.agents.model.AgentResponse;
import com.zenvyra.agents.model.Issue;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Compliance Agent
 * 
 * Responsibility: Cross-checks actual scanned website structure/content against legal requirements.
 * Identifies missing policies, weak consent flows, or risky data collection.
 */
@Service
public class Compliance {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public AgentResponse execute(AgentResponse response) {
        System.out.println("[Compliance Agent] Performing compliance audit...");

        if (response == null || response.getRawData() == null || response.getLaws() == null) {
            return response;
        }

        List<String> laws = response.getLaws();
        List<Issue> issues = new ArrayList<>();

        ScanSignals signals = parseSignals(response.getRawData());

        if (laws.contains(ComplianceRuleCatalog.GDPR_PRIVACY_NOTICE)
                || laws.contains(ComplianceRuleCatalog.CCPA_PRIVACY_NOTICE)) {
            if (!signals.hasPrivacyNotice()) {
                issues.add(Issue.builder()
                        .type("MISSING_PRIVACY_NOTICE")
                        .severity("critical")
                        .description("No visible privacy notice or privacy policy link was found. Rule set "
                                + ComplianceRuleCatalog.RULESET_VERSION + " requires a clear privacy notice for personal data processing.")
                        .fix("Publish a privacy policy and link it from the website footer, checkout, and account creation surfaces.")
                        .build());
            }
        }

        if (laws.contains(ComplianceRuleCatalog.GDPR_COOKIE_CONSENT) && signals.hasTrackers() && !signals.hasConsentMechanism()) {
            issues.add(Issue.builder()
                    .type("MISSING_COOKIE_CONSENT")
                    .severity("critical")
                    .description("Third-party scripts or cookies were detected, but no consent banner or preference mechanism was visible.")
                    .fix("Install a consent banner that blocks analytics and marketing tags until consent is recorded.")
                    .build());
        }

        if (laws.contains(ComplianceRuleCatalog.CCPA_OPT_OUT) && !signals.hasDoNotSellLink()) {
            issues.add(Issue.builder()
                    .type("MISSING_CCPA_OPT_OUT")
                    .severity("high")
                    .description("No 'Do Not Sell or Share My Personal Information' link was found for CCPA/CPRA opt-out handling.")
                    .fix("Add a clear opt-out link and route requests into a tracked privacy-request workflow.")
                    .build());
        }

        if (laws.contains(ComplianceRuleCatalog.DPDP_CONSENT_NOTICE) && !signals.hasConsentMechanism()) {
            issues.add(Issue.builder()
                    .type("MISSING_CONSENT_NOTICE")
                    .severity("high")
                    .description("No visible consent notice was found for personal-data processing under the detected region.")
                    .fix("Add a consent notice explaining processing purpose, withdrawal method, and grievance contact.")
                    .build());
        }

        if (laws.contains(ComplianceRuleCatalog.GENERAL_TERMS_NOTICE) && !signals.hasTermsNotice()) {
            issues.add(Issue.builder()
                    .type("MISSING_TERMS")
                    .severity("medium")
                    .description("No terms of service or terms and conditions link was found.")
                    .fix("Publish terms of service and link them from transactional surfaces.")
                    .build());
        }

        if (laws.contains(ComplianceRuleCatalog.GENERAL_CONTACT_POINT) && !signals.hasContactPoint()) {
            issues.add(Issue.builder()
                    .type("MISSING_PRIVACY_CONTACT")
                    .severity("medium")
                    .description("No obvious contact point was found for privacy or compliance requests.")
                    .fix("Add a dedicated privacy contact email or request portal link in the footer and privacy policy.")
                    .build());
        }

        response.setIssues(issues);
        System.out.println("[Compliance Agent] Compliance audit complete. Found " + issues.size() + " issues.");
        return response;
    }

    private ScanSignals parseSignals(String rawData) {
        try {
            JsonNode root = objectMapper.readTree(rawData);
            String combined = root.toString().toLowerCase();
            String linkText = linksAsText(root).toLowerCase();
            int cookies = root.path("cookies").isArray() ? root.path("cookies").size() : 0;
            int scriptDomains = root.path("scriptDomains").isArray() ? root.path("scriptDomains").size() : 0;
            int storageKeys = root.path("storageKeys").isArray() ? root.path("storageKeys").size() : 0;
            return new ScanSignals(
                    linkText.contains("privacy"),
                    root.path("hasConsentMarkup").asBoolean(false)
                            || linkText.contains("cookie")
                            || linkText.contains("consent")
                            || linkText.contains("preference"),
                    linkText.contains("do not sell") || linkText.contains("opt-out") || linkText.contains("opt out"),
                    linkText.contains("terms"),
                    linkText.contains("contact") || linkText.contains("mailto:") || linkText.contains("privacy@"),
                    cookies > 0 || scriptDomains > 0 || storageKeys > 0
            );
        } catch (Exception e) {
            String value = rawData.toLowerCase();
            return new ScanSignals(
                    value.contains("privacy"),
                    value.contains("cookie") || value.contains("consent"),
                    value.contains("do not sell") || value.contains("opt-out") || value.contains("opt out"),
                    value.contains("terms"),
                    value.contains("contact") || value.contains("mailto:") || value.contains("privacy@"),
                    value.contains("cookies") || value.contains("scriptdomains")
            );
        }
    }

    private String linksAsText(JsonNode root) {
        StringBuilder sb = new StringBuilder();
        JsonNode links = root.path("complianceLinks");
        if (links.isArray()) {
            for (JsonNode link : links) {
                sb.append(' ').append(link.path("text").asText());
                sb.append(' ').append(link.path("url").asText());
                sb.append(' ').append(link.path("rel").asText());
            }
        }
        return sb.toString();
    }

    private record ScanSignals(
            boolean hasPrivacyNotice,
            boolean hasConsentMechanism,
            boolean hasDoNotSellLink,
            boolean hasTermsNotice,
            boolean hasContactPoint,
            boolean hasTrackers
    ) {
    }
}
