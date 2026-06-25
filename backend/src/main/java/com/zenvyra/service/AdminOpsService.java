package com.zenvyra.service;

import com.zenvyra.dto.response.admin.AdminOpsOverviewResponse;
import com.zenvyra.dto.response.admin.AdminOpsTableResponse;
import com.zenvyra.model.*;
import com.zenvyra.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminOpsService {

    private final UserRepository userRepository;
    private final WebsiteRepository websiteRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final WebhookRepository webhookRepository;
    private final WebhookDeliveryRepository webhookDeliveryRepository;
    private final NotificationRepository notificationRepository;
    private final DSARSubmissionRepository dsarSubmissionRepository;
    private final ScanResultRepository scanResultRepository;
    private final SetupPackageOrderRepository setupPackageOrderRepository;
    private final Environment environment;

    public AdminOpsOverviewResponse overview() {
        List<User> users = userRepository.findAll();
        List<Website> websites = websiteRepository.findAll();
        List<Subscription> subscriptions = subscriptionRepository.findAll();
        List<WebhookDelivery> deliveries = webhookDeliveryRepository.findAll();
        List<DSARSubmission> dsars = dsarSubmissionRepository.findAll();
        List<ScanResult> scans = scanResultRepository.findAll();

        long activeUsers = users.stream().filter(User::isEnabled).count();
        long agencies = users.stream().filter(user -> "AGENCY".equalsIgnoreCase(user.getAccountType())).count();
        long monitored = websites.stream().filter(Website::getMonitoringEnabled).count();
        long openIssues = websites.stream()
                .mapToLong(site -> site.getIssues() == null ? 0 : site.getIssues().stream().filter(issue -> !issue.getFixed()).count())
                .sum();
        double averageScore = websites.stream()
                .map(Website::getComplianceScore)
                .filter(score -> score != null)
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);
        long pendingDsars = dsars.stream()
                .filter(dsar -> dsar.getStatus() == null || !List.of("completed", "rejected").contains(dsar.getStatus().toLowerCase()))
                .count();
        long activeSubscriptions = subscriptions.stream()
                .filter(subscription -> "active".equalsIgnoreCase(subscription.getStatus()))
                .count();
        long mrr = subscriptions.stream()
                .filter(subscription -> "active".equalsIgnoreCase(subscription.getStatus()))
                .map(Subscription::getAmount)
                .filter(amount -> amount != null)
                .mapToLong(Integer::longValue)
                .sum();
        long failedWebhooks = deliveries.stream()
                .filter(delivery -> "failed".equalsIgnoreCase(delivery.getStatus()))
                .count();
        LocalDateTime since = LocalDateTime.now().minusDays(7);
        long recentScans = scans.stream()
                .filter(scan -> scan.getScannedAt() != null && scan.getScannedAt().isAfter(since))
                .count();

        return AdminOpsOverviewResponse.builder()
                .totalUsers(users.size())
                .activeUsers(activeUsers)
                .agencyAccounts(agencies)
                .totalWebsites(websites.size())
                .monitoredWebsites(monitored)
                .averageScore(Math.round(averageScore * 10.0) / 10.0)
                .openIssues(openIssues)
                .pendingDsars(pendingDsars)
                .activeSubscriptions(activeSubscriptions)
                .monthlyRecurringRevenueEstimate(mrr)
                .failedWebhookCount(failedWebhooks)
                .recentScanCount(recentScans)
                .systemHealthStates(systemHealth(failedWebhooks, pendingDsars, monitored))
                .highRiskAccounts(highRiskAccounts(websites))
                .launchChecklist(launchChecklist())
                .build();
    }

    public AdminOpsTableResponse users() {
        List<Map<String, Object>> items = userRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(100)
                .map(user -> mapOf(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "companyName", user.getCompanyName(),
                        "accountType", user.getAccountType(),
                        "role", user.getRole(),
                        "status", user.getStatus(),
                        "plan", user.getPlan(),
                        "lastLoginAt", user.getLastLoginAt(),
                        "createdAt", user.getCreatedAt()
                ))
                .toList();
        return table("users", userRepository.count(), items);
    }

    public AdminOpsTableResponse websites() {
        List<Map<String, Object>> items = websiteRepository.findAll().stream()
                .sorted(Comparator.comparing(Website::getUpdatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(100)
                .map(site -> mapOf(
                        "id", site.getId(),
                        "name", site.getName(),
                        "url", site.getUrl(),
                        "score", site.getComplianceScore(),
                        "monitoringEnabled", site.getMonitoringEnabled(),
                        "openIssues", site.getIssues() == null ? 0 : site.getIssues().stream().filter(issue -> !issue.getFixed()).count(),
                        "lastScanAt", site.getLastScanAt()
                ))
                .toList();
        return table("websites", websiteRepository.count(), items);
    }

    public AdminOpsTableResponse subscriptions() {
        List<Map<String, Object>> items = subscriptionRepository.findAll().stream()
                .limit(100)
                .map(subscription -> mapOf(
                        "id", subscription.getId(),
                        "userId", subscription.getUserId(),
                        "plan", subscription.getPlan(),
                        "status", subscription.getStatus(),
                        "amount", subscription.getAmount(),
                        "currency", subscription.getCurrency(),
                        "periodEnd", subscription.getCurrentPeriodEnd()
                ))
                .toList();
        return table("subscriptions", subscriptionRepository.count(), items);
    }

    public AdminOpsTableResponse webhooks() {
        List<Webhook> webhooks = webhookRepository.findAll();
        List<WebhookDelivery> deliveries = webhookDeliveryRepository.findAll();
        List<Map<String, Object>> items = deliveries.stream()
                .sorted(Comparator.comparing(WebhookDelivery::getTimestamp, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(100)
                .map(delivery -> mapOf(
                        "id", delivery.getId(),
                        "event", delivery.getEvent(),
                        "provider", "platform",
                        "status", delivery.getStatus(),
                        "retryCount", delivery.getRetryCount(),
                        "lastError", delivery.getResponseBody(),
                        "receivedAt", delivery.getTimestamp(),
                        "nextRetryAt", delivery.getNextRetryAt(),
                        "responseCode", delivery.getResponseCode()
                ))
                .toList();
        return table("webhooks", webhooks.size() + deliveries.size(), items);
    }

    public AdminOpsTableResponse emails() {
        List<Map<String, Object>> items = notificationRepository.findAll().stream()
                .sorted(Comparator.comparing(Notification::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(100)
                .map(notification -> mapOf(
                        "id", notification.getId(),
                        "title", notification.getTitle(),
                        "type", notification.getType(),
                        "priority", notification.getPriority(),
                        "read", notification.isRead(),
                        "createdAt", notification.getCreatedAt()
                ))
                .toList();
        return table("emails", notificationRepository.count(), items);
    }

    public AdminOpsTableResponse monitoring() {
        List<Map<String, Object>> items = websiteRepository.findAll().stream()
                .filter(site -> site.getMonitoringEnabled() || (site.getIssues() != null && !site.getIssues().isEmpty()))
                .limit(100)
                .flatMap(site -> {
                    List<Website.ComplianceIssue> issues = site.getIssues() == null ? List.of() : site.getIssues();
                    if (issues.isEmpty()) {
                        return List.of(mapOf(
                                "websiteId", site.getId(),
                                "url", site.getUrl(),
                                "severity", "info",
                                "owner", "ops",
                                "title", "Monitoring active",
                                "status", "ok"
                        )).stream();
                    }
                    return issues.stream().filter(issue -> !issue.getFixed()).map(issue -> mapOf(
                            "websiteId", site.getId(),
                            "url", site.getUrl(),
                            "severity", issue.getSeverity(),
                            "owner", "customer-success",
                            "title", issue.getTitle(),
                            "status", "open"
                    ));
                })
                .toList();
        return table("monitoring", items.size(), items);
    }

    public AdminOpsTableResponse scans() {
        List<Map<String, Object>> items = scanResultRepository.findAll().stream()
                .sorted(Comparator.comparing(ScanResult::getScannedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(100)
                .map(scan -> mapOf(
                        "id", scan.getId(),
                        "websiteId", scan.getWebsiteId(),
                        "url", scan.getUrl(),
                        "status", scan.getStatus(),
                        "score", scan.getScore(),
                        "previousScore", scan.getPreviousScore(),
                        "issuesCount", scan.getIssuesCount(),
                        "scannedAt", scan.getScannedAt(),
                        "errorMessage", scan.getErrorMessage()
                ))
                .toList();
        return table("scans", scanResultRepository.count(), items);
    }

    public AdminOpsTableResponse backups() {
        List<Map<String, Object>> items = List.of(
                readinessRow("MongoDB backup", isPresent("app.backup.provider") || isTrue("app.backup.enabled"),
                        "Configured backup provider/status flag present.", "Configure managed MongoDB backup before public launch."),
                readinessRow("Restore drill", isPresent("app.backup.last-restore-drill-at"),
                        "Restore drill timestamp recorded.", "Run and record a restore drill timestamp."),
                readinessRow("Ops alert email", isPresent("app.ops-alert-email"),
                        "Ops alert recipient configured.", "Set APP_OPS_ALERT_EMAIL for webhook and backup failure alerts."),
                readinessRow("Dodo product ids", isPresent("dodo.products.growth") && isPresent("dodo.products.pro") && isPresent("dodo.products.agency") && isPresent("dodo.products.setup-package"),
                        "All paid plan and setup package product ids are configured.", "Configure Dodo growth, pro, agency, and setup package product ids."),
                readinessRow("Production data services", isProductionDataConfigured(),
                        "MongoDB and Redis connection strings are not local defaults.", "Use managed production MongoDB and Redis services."),
                mapOf("name", "Webhook idempotency", "status", "ready", "detail", "Processed webhook repository and retry visibility are implemented; sandbox replay still required.")
        );
        return table("backups", items.size(), items);
    }

    public AdminOpsTableResponse setupTasks() {
        List<Map<String, Object>> items = setupPackageOrderRepository.findAll().stream()
                .sorted(Comparator.comparing(SetupPackageOrder::getUpdatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(100)
                .map(order -> mapOf(
                        "id", order.getId(),
                        "websiteId", order.getWebsiteId(),
                        "websiteUrl", order.getWebsiteUrl(),
                        "platform", order.getPlatform(),
                        "paymentStatus", order.getPaymentStatus(),
                        "setupStatus", order.getSetupStatus(),
                        "currency", order.getCurrency(),
                        "amountCents", order.getAmountCents(),
                        "accessWillingness", order.getAccessWillingness(),
                        "revisionCount", order.getRevisionCount(),
                        "requestedAt", order.getRequestedAt(),
                        "updatedAt", order.getUpdatedAt()
                ))
                .toList();
        return table("setup-tasks", setupPackageOrderRepository.count(), items);
    }

    private List<Map<String, Object>> highRiskAccounts(List<Website> websites) {
        return websites.stream()
                .filter(site -> site.getComplianceScore() == null || site.getComplianceScore() < 65)
                .sorted(Comparator.comparing(Website::getComplianceScore, Comparator.nullsFirst(Double::compareTo)))
                .limit(10)
                .map(site -> mapOf("websiteId", site.getId(), "url", site.getUrl(), "score", site.getComplianceScore(), "openIssues", site.getIssues() == null ? 0 : site.getIssues().size()))
                .toList();
    }

    private List<Map<String, Object>> systemHealth(long failedWebhooks, long pendingDsars, long monitored) {
        return List.of(
                mapOf("label", "Payment webhooks", "status", failedWebhooks > 0 ? "warn" : "ok", "detail", failedWebhooks + " failed deliveries"),
                mapOf("label", "DSAR workflow", "status", pendingDsars > 0 ? "warn" : "ok", "detail", pendingDsars + " pending requests"),
                mapOf("label", "Monitoring", "status", monitored > 0 ? "ok" : "warn", "detail", monitored + " sites monitored"),
                mapOf("label", "Backups", backupHealthStatus(), "detail", backupHealthDetail())
        );
    }

    private List<Map<String, Object>> launchChecklist() {
        return List.of(
                mapOf("label", "Backend compile", "status", "required"),
                mapOf("label", "Frontend build", "status", "required"),
                mapOf("label", "Payment sandbox webhook", "status", "required"),
                mapOf("label", "Email provider flow", "status", "required"),
                mapOf("label", "Legal review", "status", "required")
        );
    }

    private AdminOpsTableResponse table(String name, long total, List<Map<String, Object>> items) {
        return AdminOpsTableResponse.builder().name(name).total(total).items(items).build();
    }

    private Map<String, Object> mapOf(Object... values) {
        Map<String, Object> map = new LinkedHashMap<>();
        for (int i = 0; i + 1 < values.length; i += 2) {
            map.put(String.valueOf(values[i]), values[i + 1]);
        }
        return map;
    }

    private Map<String, Object> readinessRow(String name, boolean ready, String readyDetail, String missingDetail) {
        return mapOf("name", name, "status", ready ? "ready" : "needs_configuration", "detail", ready ? readyDetail : missingDetail);
    }

    private boolean isPresent(String property) {
        String value = environment.getProperty(property);
        return value != null && !value.isBlank() && !value.startsWith("${");
    }

    private boolean isTrue(String property) {
        return Boolean.parseBoolean(environment.getProperty(property, "false"));
    }

    private boolean isProductionDataConfigured() {
        String mongo = environment.getProperty("spring.data.mongodb.uri", "");
        String redis = environment.getProperty("spring.data.redis.url", "");
        return !mongo.isBlank()
                && !redis.isBlank()
                && !mongo.contains("localhost")
                && !mongo.contains("127.0.0.1")
                && !redis.contains("localhost")
                && !redis.contains("127.0.0.1");
    }

    private String backupHealthStatus() {
        return isPresent("app.backup.provider") || isTrue("app.backup.enabled") ? "ok" : "warn";
    }

    private String backupHealthDetail() {
        boolean backupConfigured = isPresent("app.backup.provider") || isTrue("app.backup.enabled");
        boolean restoreDrillRecorded = isPresent("app.backup.last-restore-drill-at");
        if (backupConfigured && restoreDrillRecorded) {
            return "Backup configuration and restore drill timestamp are recorded";
        }
        if (backupConfigured) {
            return "Backup configured; restore drill timestamp is not recorded";
        }
        return "Backup provider/status is not configured";
    }
}
