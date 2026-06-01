package com.complianceai.service;

import com.complianceai.dto.response.PublicVerificationResponse;
import com.complianceai.model.ScanResult;
import com.complianceai.model.Website;
import com.complianceai.repository.CertificateRepository;
import com.complianceai.repository.ScanResultRepository;
import com.complianceai.repository.WebsiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
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

    public PublicVerificationResponse getPublicVerification(String siteId) {
        validateSiteId(siteId);

        Website website = websiteRepository.findById(siteId)
                .orElseThrow(() -> new RuntimeException("Website not found"));

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

        if (score == null) {
            score = 0.0;
        }
        if (issuesCount == null) {
            issuesCount = 0;
        }

        LocalDateTime effectiveLastScanAt = lastScanAt != null ? lastScanAt : LocalDateTime.now();
        long minutesAgo = Math.max(0, Duration.between(effectiveLastScanAt, LocalDateTime.now()).toMinutes());

        String state = scoreState(score);

        return PublicVerificationResponse.builder()
                .websiteId(siteId)
                .websiteName(website.getName())
                .complianceScore(score)
                .issuesFound(issuesCount)
                .lastScanAt(effectiveLastScanAt)
                .lastVerifiedMinutesAgo(minutesAgo)
                .scoreState(state)
                .build();
    }

    public boolean isPremiumProxy(String siteId) {
        validateSiteId(siteId);
        return certificateRepository.findByWebsiteIdAndActiveTrue(siteId).isPresent();
    }

    private void validateSiteId(String siteId) {
        if (siteId == null || !SITE_ID.matcher(siteId).matches()) {
            throw new IllegalArgumentException("Invalid siteId");
        }
    }

    private String scoreState(Double score) {
        if (score >= 90) return "GREEN";
        if (score >= 75) return "YELLOW";
        return "RED";
    }
}

