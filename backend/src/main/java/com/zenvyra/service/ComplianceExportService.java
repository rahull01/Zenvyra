package com.zenvyra.service;

import com.zenvyra.exception.ApiException;
import com.zenvyra.model.Policy;
import com.zenvyra.model.ScanAuditLog;
import com.zenvyra.model.User;
import com.zenvyra.model.Website;
import com.zenvyra.model.WebsiteScanResult;
import com.zenvyra.repository.PolicyRepository;
import com.zenvyra.repository.ScanAuditLogRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteRepository;
import com.zenvyra.repository.WebsiteScanResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ComplianceExportService {

    private final UserRepository userRepository;
    private final WebsiteRepository websiteRepository;
    private final PolicyRepository policyRepository;
    private final ScanAuditLogRepository scanAuditLogRepository;
    private final WebsiteScanResultRepository websiteScanResultRepository;
    private final ConsentAuditLogService consentAuditLogService;

    public Map<String, Object> exportSiteReport(String requesterEmail, String siteId) {
        User user = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> ApiException.unauthorized("User not found"));
        Website website = websiteRepository.findById(siteId)
                .orElseThrow(() -> ApiException.notFound("Website"));
        if (!website.getUserId().equals(user.getId())) {
            throw ApiException.forbidden("You do not have access to this site");
        }

        List<Policy> policies = policyRepository.findByWebsiteId(siteId);
        Policy activePrivacyPolicy = policies.stream()
                .filter(policy -> "privacy".equalsIgnoreCase(policy.getType()))
                .filter(policy -> "published".equalsIgnoreCase(policy.getStatus()) || "active".equalsIgnoreCase(policy.getStatus()))
                .max(Comparator.comparing(policy -> policy.getUpdatedAt() == null ? LocalDateTime.MIN : policy.getUpdatedAt()))
                .orElse(null);
        List<ScanAuditLog> scanLogs = scanAuditLogRepository.findTop10ByWebsiteIdOrderByCreatedAtDesc(siteId);
        List<WebsiteScanResult.ClassifiedTracker> trackers = websiteScanResultRepository
                .findTopByUserIdAndTargetUrlOrderByScannedAtDesc(user.getId(), website.getUrl())
                .map(WebsiteScanResult::getClassifiedTrackers)
                .orElse(List.of());

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportTitle", "Compliance Readiness Report");
        report.put("generatedAt", LocalDateTime.now());
        report.put("whiteLabel", Map.of(
                "companyName", user.getCompanyName() == null ? user.getFullName() : user.getCompanyName(),
                "poweredByHidden", false
        ));
        report.put("site", Map.of(
                "siteId", website.getId(),
                "url", website.getUrl(),
                "name", website.getName(),
                "complianceScore", website.getComplianceScore() == null ? 0 : website.getComplianceScore(),
                "openIssues", website.getIssues() == null ? 0 : website.getIssues().stream().filter(issue -> !issue.getFixed()).count()
        ));
        report.put("activePrivacyPolicy", activePrivacyPolicy == null ? null : Map.of(
                "id", activePrivacyPolicy.getId(),
                "title", activePrivacyPolicy.getTitle(),
                "version", activePrivacyPolicy.getVersion(),
                "updatedAt", activePrivacyPolicy.getUpdatedAt(),
                "content", activePrivacyPolicy.getContent() == null ? "" : activePrivacyPolicy.getContent()
        ));
        report.put("cookieCategorizations", trackers);
        report.put("scannerLogs", scanLogs);
        report.put("consentAnalytics", Map.of(
                "totalConsentEvents", consentAuditLogService.countBySiteId(siteId),
                "marketingOptIns", consentAuditLogService.countMarketingOptIns(siteId)
        ));
        return report;
    }
}
