package com.complianceai.agents.compliance;

import com.complianceai.agents.model.AgentResponse;
import com.complianceai.agents.model.Issue;
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

    public AgentResponse execute(AgentResponse response) {
        System.out.println("[Compliance Agent] Performing compliance audit...");

        if (response == null || response.getRawData() == null || response.getLaws() == null) {
            return response;
        }

        // TODO: Replace with AI prompt call to perform semantic comparison of content against regulations.

        String rawData = response.getRawData().toLowerCase();
        List<String> laws = response.getLaws();
        List<Issue> issues = new ArrayList<>();

        boolean hasPrivacyPolicy = rawData.contains("privacy policy") || rawData.contains("privacy-policy");
        boolean hasCookieConsentScript = rawData.contains("cookieconsent.js");

        if (laws.contains("Privacy Policy Required") && !hasPrivacyPolicy) {
            issues.add(Issue.builder()
                    .type("MISSING_POLICY")
                    .severity("critical")
                    .description("Missing Privacy Policy page links in HTML body.")
                    .fix("Create a /privacy-policy page and link it in the footer.")
                    .build());
        }

        if (laws.contains("Cookie Consent Banner Required") && !hasCookieConsentScript) {
            issues.add(Issue.builder()
                    .type("GDPR_NON_COMPLIANT")
                    .severity("critical")
                    .description("Missing Cookie Consent opt-in script. Third-party tracking scripts are active.")
                    .fix("Integrate a cookie consent manager to restrict script loading before user opt-in.")
                    .build());
        }

        if (laws.contains("Aadhaar Consent Required") && (rawData.contains("aadhaar") || rawData.contains("phone"))) {
            issues.add(Issue.builder()
                    .type("DPDP_RISK")
                    .severity("high")
                    .description("Collecting Aadhaar/Phone number without a prominent bilingual consent notice.")
                    .fix("Add an explicit bilingual notice in English and Hindi above consent collection forms.")
                    .build());
        }

        if (laws.contains("Do Not Sell Link Required") && !rawData.contains("do not sell")) {
            issues.add(Issue.builder()
                    .type("CCPA_NON_COMPLIANT")
                    .severity("critical")
                    .description("Missing 'Do Not Sell My Personal Information' opt-out link in footer/HTML.")
                    .fix("Include a 'Do Not Sell My Personal Information' link in the website footer.")
                    .build());
        }

        response.setIssues(issues);
        System.out.println("[Compliance Agent] Compliance audit complete. Found " + issues.size() + " issues.");
        return response;
    }
}
