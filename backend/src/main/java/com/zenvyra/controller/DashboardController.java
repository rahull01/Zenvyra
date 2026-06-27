package com.zenvyra.controller;

import com.zenvyra.exception.ApiException;
import com.zenvyra.model.AiSystemInventory;
import com.zenvyra.model.Policy;
import com.zenvyra.model.ScanAuditLog;
import com.zenvyra.model.User;
import com.zenvyra.model.Website;
import com.zenvyra.repository.AiSystemInventoryRepository;
import com.zenvyra.repository.PolicyRepository;
import com.zenvyra.repository.ScanAuditLogRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository userRepository;
    private final WebsiteRepository websiteRepository;
    private final PolicyRepository policyRepository;
    private final ScanAuditLogRepository scanAuditLogRepository;
    private final AiSystemInventoryRepository aiSystemInventoryRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@AuthenticationPrincipal UserDetails userDetails) {
        User user = requireUser(userDetails);
        List<Website> websites = websiteRepository.findByUserId(user.getId());
        List<Policy> policies = policyRepository.findByOrganizationId(user.getEmail());
        List<AiSystemInventory> aiSystems = aiSystemInventoryRepository.findByUserId(user.getId());

        double averageScore = websites.stream()
                .map(Website::getComplianceScore)
                .filter(score -> score != null)
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);

        long activeAlerts = websites.stream()
                .flatMap(website -> website.getIssues().stream())
                .filter(issue -> !issue.getFixed())
                .count();

        LocalDateTime nextScan = websites.stream()
                .map(Website::getNextScanAt)
                .filter(value -> value != null)
                .min(Comparator.naturalOrder())
                .orElse(null);

        Map<String, Integer> scoreBreakdown = new HashMap<>();
        scoreBreakdown.put("privacy", categoryScore(websites, "Privacy"));
        scoreBreakdown.put("consent", categoryScore(websites, "Consent"));
        scoreBreakdown.put("legal", categoryScore(websites, "Legal"));
        scoreBreakdown.put("security", websites.isEmpty() ? 0 : 90);

        Map<String, Object> response = new HashMap<>();
        response.put("complianceScore", Math.round(averageScore));
        response.put("totalWebsites", websites.size());
        response.put("totalPolicies", policies.size());
        response.put("activeAlerts", activeAlerts);
        response.put("pendingDSARs", 0);
        response.put("nextScan", nextScan);
        response.put("aiSystemsCount", aiSystems.size());
        response.put("scoreBreakdown", scoreBreakdown);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/compliance-score")
    public ResponseEntity<Map<String, Object>> getComplianceScore(@AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> stats = getDashboardStats(userDetails).getBody();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of(
                        "overallScore", stats != null ? stats.get("complianceScore") : 0,
                        "breakdown", stats != null ? stats.get("scoreBreakdown") : Map.of(),
                        "trend", "live",
                        "lastUpdated", LocalDateTime.now().toString()
                )
        ));
    }

    @GetMapping("/websites")
    public ResponseEntity<Map<String, Object>> getWebsites(@AuthenticationPrincipal UserDetails userDetails) {
        User user = requireUser(userDetails);
        List<Map<String, Object>> websites = websiteRepository.findByUserId(user.getId()).stream()
                .map(website -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", website.getId());
                    item.put("name", valueOr(website.getName(), website.getUrl()));
                    item.put("url", website.getUrl());
                    item.put("score", website.getComplianceScore() != null ? website.getComplianceScore() : 0);
                    item.put("issues", website.getIssues() != null ? website.getIssues().size() : 0);
                    item.put("lastScan", website.getLastScanAt());
                    item.put("monitoring", website.getMonitoringEnabled());
                    return item;
                })
                .toList();

        return ResponseEntity.ok(Map.of("success", true, "data", Map.of("websites", websites)));
    }

    @GetMapping("/recent-scans")
    public ResponseEntity<Map<String, Object>> getRecentScans(@AuthenticationPrincipal UserDetails userDetails) {
        User user = requireUser(userDetails);
        List<Map<String, Object>> scans = scanAuditLogRepository.findTop10ByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(log -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", log.getId());
                    item.put("url", log.getWebsiteUrl());
                    item.put("status", log.getStatus());
                    item.put("date", log.getCreatedAt());
                    item.put("issuesFound", log.getIssueCount() != null ? log.getIssueCount() : 0);
                    item.put("score", log.getScore() != null ? log.getScore() : 0);
                    return item;
                })
                .toList();

        return ResponseEntity.ok(Map.of("success", true, "data", Map.of("scans", scans)));
    }

    @GetMapping("/ai-insights")
    public ResponseEntity<Map<String, Object>> getAiInsights(@AuthenticationPrincipal UserDetails userDetails) {
        User user = requireUser(userDetails);
        List<Map<String, Object>> insights = websiteRepository.findByUserId(user.getId()).stream()
                .flatMap(website -> website.getIssues().stream()
                        .filter(issue -> !issue.getFixed())
                        .map(issue -> {
                            Map<String, Object> item = new HashMap<>();
                            item.put("id", website.getId() + ":" + valueOr(issue.getId(), issue.getType()));
                            item.put("title", valueOr(issue.getTitle(), "Compliance issue"));
                            item.put("description", valueOr(issue.getDescription(), "Review this issue."));
                            item.put("priority", valueOr(issue.getSeverity(), "medium"));
                            item.put("category", valueOr(issue.getCategory(), "Compliance"));
                            item.put("website", website.getUrl());
                            item.put("actions", List.of(valueOr(issue.getFixSuggestion(), "Review and remediate.")));
                            return item;
                        }))
                .limit(10)
                .toList();

        return ResponseEntity.ok(Map.of("success", true, "data", Map.of("insights", insights)));
    }

    @GetMapping("/tasks")
    public ResponseEntity<Map<String, Object>> getTasks(@AuthenticationPrincipal UserDetails userDetails) {
        User user = requireUser(userDetails);
        List<Map<String, Object>> tasks = websiteRepository.findByUserId(user.getId()).stream()
                .flatMap(website -> website.getIssues().stream()
                        .filter(issue -> !issue.getFixed())
                        .map(issue -> {
                            Map<String, Object> item = new HashMap<>();
                            item.put("id", website.getId() + ":" + valueOr(issue.getId(), issue.getType()));
                            item.put("title", "Resolve " + valueOr(issue.getTitle(), "compliance issue"));
                            item.put("priority", valueOr(issue.getSeverity(), "medium"));
                            item.put("type", valueOr(issue.getCategory(), "Compliance"));
                            item.put("website", website.getUrl());
                            item.put("dueDate", LocalDateTime.now().plusDays(priorityDays(issue.getSeverity())).toLocalDate().toString());
                            return item;
                        }))
                .limit(10)
                .toList();

        return ResponseEntity.ok(Map.of("success", true, "data", Map.of("tasks", tasks)));
    }

    @GetMapping("/usage")
    public ResponseEntity<Map<String, Object>> getUsage(@AuthenticationPrincipal UserDetails userDetails) {
        User user = requireUser(userDetails);
        long websiteCount = websiteRepository.countByUserId(user.getId());
        long policyCount = policyRepository.findByOrganizationId(user.getEmail()).size();
        Map<String, Integer> limits = limitsForPlan(user.getPlan());
        Map<String, Long> currentUsage = Map.of(
                "websites", websiteCount,
                "policies", policyCount,
                "scans", (long) scanAuditLogRepository.findTop10ByUserIdOrderByCreatedAtDesc(user.getId()).size()
        );

        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of(
                        "plan", valueOr(user.getPlan(), "free"),
                        "limits", limits,
                        "currentUsage", currentUsage
                )
        ));
    }

    @GetMapping("/activity")
    public ResponseEntity<Map<String, Object>> getRecentActivity(@AuthenticationPrincipal UserDetails userDetails) {
        User user = requireUser(userDetails);
        List<Map<String, Object>> activities = scanAuditLogRepository.findTop10ByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(log -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", log.getId());
                    item.put("action", log.getAction());
                    item.put("time", log.getCreatedAt());
                    item.put("website", log.getWebsiteUrl());
                    item.put("status", log.getStatus());
                    return item;
                })
                .toList();

        return ResponseEntity.ok(Map.of("success", true, "data", Map.of("activities", activities)));
    }

    private User requireUser(UserDetails userDetails) {
        if (userDetails == null) {
            throw ApiException.unauthorized("Authentication required");
        }
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> ApiException.unauthorized("User not found"));
    }

    private int categoryScore(List<Website> websites, String category) {
        long issueCount = websites.stream()
                .flatMap(website -> website.getIssues().stream())
                .filter(issue -> category.equalsIgnoreCase(issue.getCategory()))
                .filter(issue -> !issue.getFixed())
                .count();
        int score = (int) Math.max(0, 100 - (issueCount * 15));
        return websites.isEmpty() ? 0 : score;
    }

    private int priorityDays(String severity) {
        if ("critical".equalsIgnoreCase(severity)) return 3;
        if ("high".equalsIgnoreCase(severity)) return 7;
        if ("medium".equalsIgnoreCase(severity)) return 14;
        return 30;
    }

    private Map<String, Integer> limitsForPlan(String plan) {
        String normalized = plan == null ? "free" : plan.toLowerCase();
        return switch (normalized) {
            case "agency" -> Map.of("websites", 50, "policies", 100, "scans", 500);
            case "pro" -> Map.of("websites", 10, "policies", 25, "scans", 100);
            default -> Map.of("websites", 1, "policies", 3, "scans", 10);
        };
    }

    private String valueOr(String value, String replacement) {
        return value == null || value.isBlank() ? replacement : value;
    }
}
