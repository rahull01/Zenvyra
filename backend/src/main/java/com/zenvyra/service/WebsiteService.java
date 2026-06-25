package com.zenvyra.service;

import com.zenvyra.dto.response.ComplianceScoreResponse;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.ScanAuditLog;
import com.zenvyra.model.User;
import com.zenvyra.model.Website;
import com.zenvyra.repository.ScanAuditLogRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteRepository;
import com.zenvyra.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WebsiteService {

    private final WebsiteRepository websiteRepository;
    private final UserRepository userRepository;
    private final ScanService scanService;
    private final ScanAuditLogRepository scanAuditLogRepository;

    public Website addWebsite(String userEmail, Website website) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> ApiException.unauthorized("User not found"));

        if (website.getUrl() == null || website.getUrl().isBlank()) {
            throw ApiException.badRequest("Website URL is required");
        }

        String normalizedUrl = ValidationUtil.normalizeUrl(website.getUrl());
        if (!ValidationUtil.isValidUrl(normalizedUrl)) {
            throw ApiException.badRequest("Website URL is invalid");
        }

        long currentWebsites = websiteRepository.countByUserId(user.getId());
        int maxWebsites = getMaxWebsitesForPlan(user.getPlan());

        if (currentWebsites >= maxWebsites) {
            throw ApiException.forbidden("Website limit reached for your plan");
        }

        if (websiteRepository.findByUserIdAndUrl(user.getId(), normalizedUrl).isPresent()) {
            throw ApiException.conflict("Website already exists in this account");
        }

        website.setUserId(user.getId());
        website.setUrl(normalizedUrl);
        if (website.getName() == null || website.getName().isBlank()) {
            website.setName(ValidationUtil.extractDomain(normalizedUrl));
        }
        website.setMonitoringEnabled(true);
        website.setCreatedAt(LocalDateTime.now());
        website.setUpdatedAt(LocalDateTime.now());
        website.setNextScanAt(LocalDateTime.now().plusDays(1));

        Website saved = websiteRepository.save(website);
        return triggerScan(userEmail, saved.getId());
    }

    public List<Website> getUserWebsites(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> ApiException.unauthorized("User not found"));
        return websiteRepository.findByUserId(user.getId());
    }

    public Website getWebsiteById(String userEmail, String id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> ApiException.unauthorized("User not found"));

        Website website = websiteRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Website"));

        if (!website.getUserId().equals(user.getId())) {
            throw ApiException.forbidden("You do not have access to this website");
        }

        return website;
    }

    public Website updateWebsite(String userEmail, String id, Website updates) {
        Website website = getWebsiteById(userEmail, id);

        if (updates.getName() != null)
            website.setName(updates.getName());
        if (updates.getUrl() != null)
            website.setUrl(updates.getUrl());
        if (updates.getScanFrequency() != null)
            website.setScanFrequency(updates.getScanFrequency());

        website.setUpdatedAt(LocalDateTime.now());
        return websiteRepository.save(website);
    }

    public void deleteWebsite(String userEmail, String id) {
        Website website = getWebsiteById(userEmail, id);
        websiteRepository.delete(website);
    }

    public Website triggerScan(String userEmail, String id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> ApiException.unauthorized("User not found"));
        Website website = getWebsiteById(userEmail, id);

        createAuditLog(user.getId(), website, "SCAN_STARTED", "running", null, null,
                "Manual or registration scan started");

        try {
            ComplianceScoreResponse scan = scanService.performFreeScan(website.getUrl());

            website.setPreviousScore(website.getComplianceScore());
            website.setComplianceScore(scan.getScore());
            website.setIssues(scan.getIssues());
            website.setLastScanAt(scan.getScanDate());
            website.setUpdatedAt(LocalDateTime.now());
            website.setNextScanAt(nextScanAt(website.getScanFrequency()));

            Website.ScanHistory history = new Website.ScanHistory();
            history.setScore(scan.getScore());
            history.setScanDate(scan.getScanDate());
            website.getScanHistory().add(0, history);
            if (website.getScanHistory().size() > 20) {
                website.setScanHistory(website.getScanHistory().subList(0, 20));
            }

            Website saved = websiteRepository.save(website);
            createAuditLog(user.getId(), saved, "SCAN_COMPLETED", "completed", scan.getScore(),
                    scan.getIssues() != null ? scan.getIssues().size() : 0,
                    "Scan completed and website compliance state updated");
            return saved;
        } catch (RuntimeException e) {
            createAuditLog(user.getId(), website, "SCAN_FAILED", "failed", website.getComplianceScore(),
                    website.getIssues() != null ? website.getIssues().size() : 0,
                    e.getMessage());
            throw e;
        }
    }

    private int getMaxWebsitesForPlan(String plan) {
        String normalizedPlan = plan == null ? "free" : plan.toLowerCase();
        return switch (normalizedPlan) {
            case "free" -> 1;
            case "starter", "pro" -> 10;
            case "agency" -> 50;
            case "enterprise" -> Integer.MAX_VALUE;
            default -> 1;
        };
    }

    private LocalDateTime nextScanAt(String scanFrequency) {
        String frequency = scanFrequency == null ? "weekly" : scanFrequency.toLowerCase();
        return switch (frequency) {
            case "daily" -> LocalDateTime.now().plusDays(1);
            case "monthly" -> LocalDateTime.now().plusMonths(1);
            default -> LocalDateTime.now().plusWeeks(1);
        };
    }

    private void createAuditLog(String userId, Website website, String action, String status, Double score,
                                Integer issueCount, String message) {
        scanAuditLogRepository.save(ScanAuditLog.builder()
                .userId(userId)
                .websiteId(website.getId())
                .websiteUrl(website.getUrl())
                .action(action)
                .status(status)
                .score(score)
                .issueCount(issueCount)
                .message(message)
                .createdAt(LocalDateTime.now())
                .build());
    }
}
