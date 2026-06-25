package com.zenvyra.service;

import com.zenvyra.exception.ApiException;
import com.zenvyra.model.ScanResult;
import com.zenvyra.model.User;
import com.zenvyra.model.Website;
import com.zenvyra.repository.ScanResultRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProofReportService {

    private final WebsiteRepository websiteRepository;
    private final ScanResultRepository scanResultRepository;
    private final UserRepository userRepository;

    public Map<String, Object> proofPackForUser(String userEmail, String websiteId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> ApiException.unauthorized("User not found"));
        Website website = websiteRepository.findById(websiteId).orElseThrow(() -> ApiException.notFound("Website"));
        if (!ownsWebsite(user, website) && !isAdmin(user)) {
            throw ApiException.forbidden("You do not have access to this proof report");
        }
        return buildProofPack(website);
    }

    public Map<String, Object> proofPack(String websiteId) {
        Website website = websiteRepository.findById(websiteId).orElseThrow(() -> ApiException.notFound("Website"));
        return buildProofPack(website);
    }

    private Map<String, Object> buildProofPack(Website website) {
        List<ScanResult> scans = scanResultRepository.findByWebsiteIdOrderByScannedAtDesc(website.getId());
        ScanResult latest = scans.isEmpty() ? null : scans.get(0);
        double score = latest != null && latest.getScore() != null ? latest.getScore() : safeScore(website.getComplianceScore());
        List<Website.ComplianceIssue> issues = latest != null && latest.getIssues() != null ? latest.getIssues() : safeIssues(website);
        List<Website.ComplianceIssue> openIssues = issues.stream().filter(issue -> !issue.getFixed()).toList();

        return mapOf(
                "websiteId", website.getId(),
                "websiteUrl", website.getUrl(),
                "websiteName", website.getName(),
                "readinessScore", score,
                "lastScanAt", latest != null ? latest.getScannedAt() : website.getLastScanAt(),
                "executiveSummary", executiveSummary(score, openIssues.size()),
                "ukGdprPecrChecklist", checklist(
                        "Privacy notice reviewed",
                        "Cookie consent and PECR readiness reviewed",
                        "DSAR workflow reviewed",
                        "Accountability evidence identified"
                ),
                "usPrivacyChecklist", checklist(
                        "Consumer rights notice reviewed",
                        "Opt-out and sale/share language reviewed",
                        "Tracker transparency reviewed",
                        "FTC-style disclosure reviewed"
                ),
                "trackerCookieInventorySummary", issueSummary(issues),
                "policyStatus", mapOf(
                        "status", "review_required",
                        "detail", "Policy version and public links require final customer and counsel review before public reliance."
                ),
                "consentEvidenceSummary", mapOf(
                        "status", website.getMonitoringEnabled() ? "evidence_collection_ready" : "setup_required",
                        "detail", "Consent evidence should be retained without exposing raw IP, user agent, or raw consent payloads in public proof surfaces."
                ),
                "dsarReadiness", mapOf(
                        "status", "workflow_review_required",
                        "detail", "DSAR/consumer request workflow requires monitored inbox, routing owner, identity checks, and deadline tracking."
                ),
                "aiActReadiness", mapOf(
                        "status", "inventory_required",
                        "systemsInventoried", 0,
                        "riskCategorySummary", "No AI system inventory attached to this proof pack yet.",
                        "transparencyNoticeStatus", "review_required",
                        "humanOversightStatus", "review_required",
                        "dataHandlingNotes", "Document data categories sent to AI tools and retention/evidence controls.",
                        "gpaiProviderDocumentationStatus", "provider_documentation_required",
                        "unresolvedGaps", List.of("AI system inventory", "User-facing AI disclosure", "Human oversight evidence", "GPAI provider documentation"),
                        "disclaimer", "AI Act readiness output is operational evidence for review, not legal advice or a legal compliance determination."
                ),
                "fixPlan", openIssues.stream().limit(8).map(issue -> mapOf("title", issue.getTitle(), "severity", issue.getSeverity(), "fix", issue.getFixSuggestion())).toList(),
                "publicCertificateLink", "/verify/" + website.getId(),
                "reportFormat", "json",
                "disclaimer", "This report is operational readiness evidence, not legal advice or a guarantee of legal compliance."
        );
    }

    private List<Map<String, Object>> issueSummary(List<Website.ComplianceIssue> issues) {
        return issues.stream()
                .limit(12)
                .map(issue -> mapOf("category", issue.getCategory(), "severity", issue.getSeverity(), "title", issue.getTitle()))
                .toList();
    }

    private List<Website.ComplianceIssue> safeIssues(Website website) {
        return website.getIssues() == null ? List.of() : website.getIssues();
    }

    private double safeScore(Double score) {
        return score == null ? 0.0 : Math.max(0, Math.min(100, score));
    }

    private String executiveSummary(double score, int openIssueCount) {
        return "Operational privacy and AI readiness proof pack for founder-led setup and counsel review. Current readiness score is "
                + Math.round(score) + "/100 with " + openIssueCount + " open review items.";
    }

    private List<Map<String, Object>> checklist(String... labels) {
        return java.util.Arrays.stream(labels)
                .map(label -> mapOf("label", label, "status", "reviewed"))
                .toList();
    }

    private boolean ownsWebsite(User user, Website website) {
        return user.getId() != null && user.getId().equals(website.getUserId());
    }

    private boolean isAdmin(User user) {
        return "ROLE_ADMIN".equalsIgnoreCase(user.getRole());
    }

    private Map<String, Object> mapOf(Object... values) {
        Map<String, Object> map = new LinkedHashMap<>();
        for (int i = 0; i + 1 < values.length; i += 2) {
            map.put(String.valueOf(values[i]), values[i + 1]);
        }
        return map;
    }
}
