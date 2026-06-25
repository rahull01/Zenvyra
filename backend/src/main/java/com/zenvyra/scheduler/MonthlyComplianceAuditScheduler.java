package com.zenvyra.scheduler;

import com.zenvyra.model.Policy;
import com.zenvyra.model.PolicyVersion;
import com.zenvyra.model.Subscription;
import com.zenvyra.model.User;
import com.zenvyra.model.Website;
import com.zenvyra.model.WebsiteScanResult;
import com.zenvyra.repository.PolicyRepository;
import com.zenvyra.repository.PolicyVersionRepository;
import com.zenvyra.repository.SubscriptionRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteRepository;
import com.zenvyra.repository.WebsiteScanResultRepository;
import com.zenvyra.service.EmailService;
import com.zenvyra.service.OpenAiService;
import com.zenvyra.service.PolicyService;
import com.zenvyra.service.TrackerClassificationService;
import com.zenvyra.service.WebsiteScraperService;
import com.zenvyra.service.WebhookDispatchService;
import com.zenvyra.util.LogSanitizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class MonthlyComplianceAuditScheduler {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final WebsiteRepository websiteRepository;
    private final WebsiteScanResultRepository scanResultRepository;
    private final PolicyRepository policyRepository;
    private final PolicyVersionRepository policyVersionRepository;
    private final WebsiteScraperService websiteScraperService;
    private final TrackerClassificationService trackerClassificationService;
    private final OpenAiService openAiService;
    private final EmailService emailService;
    private final PolicyService policyService;
    private final WebhookDispatchService webhookDispatchService;

    @Value("${app.url:http://localhost:3000}")
    private String appUrl;

    // Midnight on the first day of every month.
    @Scheduled(cron = "0 0 0 1 * ?")
    public void runMonthlyComplianceAudit() {
        LocalDateTime startedAt = LocalDateTime.now();
        log.info("Starting monthly compliance audit at {}", startedAt);

        List<Subscription> paidSubscriptions = subscriptionRepository.findByStatusIgnoreCase("active").stream()
                .filter(this::isPaidSubscription)
                .toList();

        for (Subscription subscription : paidSubscriptions) {
            auditSubscription(subscription);
        }

        log.info("Monthly compliance audit finished at {}", LocalDateTime.now());
    }

    private boolean isPaidSubscription(Subscription subscription) {
        if (subscription == null) {
            return false;
        }
        if (subscription.getAmount() != null && subscription.getAmount() > 0) {
            return true;
        }
        String plan = subscription.getPlan();
        return plan != null
                && !plan.equalsIgnoreCase("free")
                && !plan.equalsIgnoreCase("trial")
                && !plan.equalsIgnoreCase("starter-free");
    }

    private void auditSubscription(Subscription subscription) {
        User user = userRepository.findById(subscription.getUserId()).orElse(null);
        if (user == null) {
            log.warn("Skipping subscription {} because user {} was not found", subscription.getId(), subscription.getUserId());
            return;
        }

        List<Website> websites = websiteRepository.findByUserId(user.getId());
        for (Website website : websites) {
            try {
                auditWebsite(user, website);
            } catch (Exception e) {
                log.error("Monthly audit failed for {} owned by {}: {}", LogSanitizer.url(website.getUrl()), LogSanitizer.email(user.getEmail()), LogSanitizer.exception(e));
            }
        }
    }

    private void auditWebsite(User user, Website website) throws Exception {
        WebsiteScanResult previousScan = scanResultRepository
                .findTopByUserIdAndTargetUrlOrderByScannedAtDesc(user.getId(), website.getUrl())
                .orElse(null);

        Set<String> detectedDomains = websiteScraperService.scrapeTrackingDomains(website.getUrl());
        List<WebsiteScanResult.ClassifiedTracker> classifiedTrackers =
                trackerClassificationService.classifyDomains(detectedDomains);

        WebsiteScanResult currentScan = WebsiteScanResult.builder()
                .id(UUID.randomUUID().toString())
                .userId(user.getId())
                .targetUrl(website.getUrl())
                .status(WebsiteScanResult.ScanStatus.COMPLETED)
                .classifiedTrackers(classifiedTrackers)
                .scannedAt(LocalDateTime.now())
                .build();
        scanResultRepository.save(currentScan);

        website.setLastScanAt(currentScan.getScannedAt());
        website.setNextScanAt(currentScan.getScannedAt().plusMonths(1));
        website.setUpdatedAt(currentScan.getScannedAt());
        websiteRepository.save(website);

        Set<String> previousDomains = domainsFrom(previousScan);
        List<String> newDomains = detectedDomains.stream()
                .map(String::toLowerCase)
                .filter(domain -> !previousDomains.contains(domain))
                .sorted()
                .toList();

        if (newDomains.isEmpty()) {
            log.info("No new tracker domains found for {}", LogSanitizer.url(website.getUrl()));
            return;
        }

        log.info("Detected {} new tracker domains for {}", newDomains.size(), LogSanitizer.url(website.getUrl()));
        regenerateAffectedPolicies(user, website, classifiedTrackers, newDomains);
    }

    private Set<String> domainsFrom(WebsiteScanResult scanResult) {
        if (scanResult == null || scanResult.getClassifiedTrackers() == null) {
            return new HashSet<>();
        }
        return scanResult.getClassifiedTrackers().stream()
                .map(WebsiteScanResult.ClassifiedTracker::getDomain)
                .filter(domain -> domain != null && !domain.isBlank())
                .map(domain -> domain.toLowerCase().trim())
                .collect(Collectors.toSet());
    }

    private void regenerateAffectedPolicies(
            User user,
            Website website,
            List<WebsiteScanResult.ClassifiedTracker> classifiedTrackers,
            List<String> newDomains) {
        List<Policy> affectedPolicies = policyRepository.findByWebsiteId(website.getId()).stream()
                .filter(this::shouldAutoUpdateForTrackers)
                .toList();

        if (affectedPolicies.isEmpty()) {
            log.info("No tracker-sensitive policies are attached to website {}", website.getId());
            return;
        }

        for (Policy policy : affectedPolicies) {
            try {
                String markdown = openAiService.regeneratePolicyMarkdown(policy, website, classifiedTrackers, newDomains);
                int nextVersion = policyVersionRepository.findTopByPolicyIdOrderByVersionDesc(policy.getId())
                        .map(PolicyVersion::getVersion)
                        .orElse(policy.getVersion() != null ? policy.getVersion() : 0) + 1;

                String changes = "Monthly tracker audit detected new domains: " + String.join(", ", newDomains);
                PolicyVersion version = PolicyVersion.builder()
                        .id(UUID.randomUUID().toString())
                        .policyId(policy.getId())
                        .version(nextVersion)
                        .content(markdown)
                        .changes(changes)
                        .authorId("system:monthly-compliance-audit")
                        .createdAt(LocalDateTime.now())
                        .build();
                policyVersionRepository.save(version);

                policy.setContent(markdown);
                policy.setPlainText(markdown);
                policy.setVersion(nextVersion);
                policy.setStatus("published");
                policy.setNeedsReview(true);
                policy.setCompanySlug(policyService.slugForUser(user));
                policy.setUpdatedAt(version.getCreatedAt());
                if (policy.getPublishedAt() == null) {
                    policy.setPublishedAt(version.getCreatedAt());
                }
                policyRepository.save(policy);

                String publicPolicyUrl = appUrl + "/p/" + policy.getCompanySlug() + "/" + publicPathFor(policy.getType());
                emailService.sendPolicyAutoUpdatedEmail(
                        user.getEmail(),
                        website.getUrl(),
                        policy.getTitle() != null ? policy.getTitle() : policy.getName(),
                        newDomains,
                        publicPolicyUrl);
                emailService.sendNewTrackerDetectedEmail(user.getEmail(), website.getUrl(), newDomains);
                webhookDispatchService.dispatch(user.getId(), "scan.monthly.completed", java.util.Map.of(
                        "websiteId", website.getId(),
                        "websiteUrl", website.getUrl(),
                        "policyId", policy.getId(),
                        "policyTitle", policy.getTitle() != null ? policy.getTitle() : policy.getName(),
                        "newTrackerCount", newDomains.size(),
                        "newTrackerDomains", newDomains,
                        "publicPolicyUrl", publicPolicyUrl));
            } catch (Exception e) {
                log.error("Failed to regenerate policy {} after monthly tracker audit: {}", policy.getId(), LogSanitizer.exception(e));
            }
        }
    }

    private boolean shouldAutoUpdateForTrackers(Policy policy) {
        String type = policyService.normalizePolicyType(policy.getType());
        return "privacy".equals(type) || "cookie".equals(type);
    }

    private String publicPathFor(String policyType) {
        String normalizedType = policyService.normalizePolicyType(policyType);
        return switch (normalizedType) {
            case "cookie" -> "cookie-policy";
            case "terms" -> "terms-conditions";
            default -> normalizedType + "-policy";
        };
    }
}
