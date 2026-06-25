package com.zenvyra.service;

import com.zenvyra.dto.response.PublicVerificationResponse;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.ScanResult;
import com.zenvyra.model.Website;
import com.zenvyra.repository.CertificateRepository;
import com.zenvyra.repository.ScanResultRepository;
import com.zenvyra.repository.WebsiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class PublicVerificationService {

    private final WebsiteRepository websiteRepository;
    private final ScanResultRepository scanResultRepository;
    // Used for premium/free badge proxy (no sensitive info exposed)
    private final CertificateRepository certificateRepository;

    // Safe, strict-ish validation to reduce abuse and ensure indexing.
    private static final Pattern SITE_ID = Pattern.compile("^[A-Za-z0-9_-]{3,64}$");
    private static final Pattern EMAIL = Pattern.compile("[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}", Pattern.CASE_INSENSITIVE);

    public PublicVerificationResponse getPublicVerification(String siteId) {
        validateSiteId(siteId);

        Website website = websiteRepository.findById(siteId)
                .orElseThrow(() -> ApiException.notFound("Website"));

        Double score = website.getComplianceScore();
        Integer issuesCount = website.getIssues() == null ? 0 : website.getIssues().size();
        LocalDateTime lastScanAt = website.getLastScanAt();

        // Prefer latest scan_results if present (keeps data always fresh)
        List<ScanResult> latestList = scanResultRepository.findByWebsiteIdOrderByScannedAtDesc(siteId);
        if (latestList != null && !latestList.isEmpty()) {
            ScanResult latest = latestList.get(0);
            if (latest.getScore() != null) score = latest.getScore();
            if (latest.getIssuesCount() != null) issuesCount = latest.getIssuesCount();
            if (latest.getScannedAt() != null) lastScanAt = latest.getScannedAt();
        }

        score = normalizeScore(score);
        if (issuesCount == null) {
            issuesCount = 0;
        }

        LocalDateTime effectiveLastScanAt = lastScanAt != null ? lastScanAt : LocalDateTime.now();
        long minutesAgo = Math.max(0, Duration.between(effectiveLastScanAt, LocalDateTime.now()).toMinutes());

        String state = scoreState(score);

        return PublicVerificationResponse.builder()
                .websiteId(siteId)
                .websiteName(publicText(website.getName(), 80))
                .siteDomain(domain(website.getUrl()))
                .complianceScore(score)
                .ukUsReadinessScore(score)
                .issuesFound(issuesCount)
                .lastScanAt(effectiveLastScanAt)
                .lastVerifiedMinutesAgo(minutesAgo)
                .scoreState(state)
                .privacyProofStatus(state.equals("GREEN") ? "ready_for_review" : state.equals("YELLOW") ? "review_recommended" : "action_required")
                .activeMonitoringStatus(website.getMonitoringEnabled() ? "active" : "not_active")
                .policyVersionStatus("review_required")
                .consentEvidenceStatus(website.getMonitoringEnabled() ? "evidence_collection_ready" : "setup_required")
                .dsarWorkflowStatus("workflow_review_required")
                .issueSummary(publicIssueSummary(website))
                .disclaimer("This public certificate is operational readiness evidence, not legal certification or legal advice.")
                .build();
    }

    public boolean isPremiumProxy(String siteId) {
        validateSiteId(siteId);
        return certificateRepository.findByWebsiteIdAndActiveTrue(siteId).isPresent();
    }

    public static boolean isValidSiteId(String siteId) {
        return siteId != null && SITE_ID.matcher(siteId).matches();
    }

    private static void validateSiteId(String siteId) {
        if (!isValidSiteId(siteId)) {
            throw ApiException.badRequest("Invalid siteId");
        }
    }

    private String scoreState(Double score) {
        if (score >= 90) return "GREEN";
        if (score >= 75) return "YELLOW";
        return "RED";
    }

    private double normalizeScore(Double score) {
        if (score == null) {
            return 0.0;
        }
        return Math.max(0.0, Math.min(100.0, score));
    }

    private String domain(String url) {
        if (url == null || url.isBlank()) return "unknown";
        return url.replaceFirst("^https?://", "").replaceFirst("/.*$", "");
    }

    private List<Map<String, Object>> publicIssueSummary(Website website) {
        if (website.getIssues() == null) return List.of();
        return website.getIssues().stream()
                .filter(issue -> !issue.getFixed())
                .limit(5)
                .map(issue -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("category", publicText(issue.getCategory(), 40));
                    item.put("severity", publicText(issue.getSeverity(), 20));
                    item.put("title", publicText(issue.getTitle(), 120));
                    return item;
                })
                .toList();
    }

    private String publicText(String value, int maxLength) {
        if (value == null) {
            return null;
        }
        String scrubbed = EMAIL.matcher(value).replaceAll("[redacted-email]")
                .replaceAll("[\\r\\n\\t]+", " ")
                .trim();
        if (scrubbed.length() <= maxLength) {
            return scrubbed;
        }
        return scrubbed.substring(0, maxLength).trim();
    }
}

