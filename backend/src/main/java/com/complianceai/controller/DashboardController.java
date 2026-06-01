package com.complianceai.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping({"/dashboard", "/api/v1/dashboard"})
@RequiredArgsConstructor
public class DashboardController {

    @GetMapping("/compliance-score")
    public ResponseEntity<Map<String, Object>> getComplianceScore(@AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        
        data.put("overallScore", 85);
        
        Map<String, Integer> breakdown = new HashMap<>();
        breakdown.put("privacy", 90);
        breakdown.put("cookies", 75);
        breakdown.put("terms", 88);
        breakdown.put("accessibility", 82);
        breakdown.put("thirdParty", 92);
        breakdown.put("dataCollection", 85);
        
        data.put("breakdown", breakdown);
        data.put("trend", "improving");
        data.put("lastUpdated", new Date().toString());
        
        response.put("success", true);
        response.put("data", data);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("complianceScore", 85);
        stats.put("totalWebsites", 4);
        stats.put("activeAlerts", 3);
        stats.put("pendingDSARs", 1);
        stats.put("nextScan", "2026-05-20T10:00:00Z");
        
        Map<String, Integer> scoreBreakdown = new HashMap<>();
        scoreBreakdown.put("privacy", 90);
        scoreBreakdown.put("cookies", 75);
        scoreBreakdown.put("accessibility", 82);
        scoreBreakdown.put("security", 95);
        stats.put("scoreBreakdown", scoreBreakdown);
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/websites")
    public ResponseEntity<Map<String, Object>> getWebsites(@AuthenticationPrincipal UserDetails userDetails) {
        List<Map<String, Object>> websites = Arrays.asList(
            Map.of("id", "1", "url", "https://example.com", "status", "active", "score", 88, "issues", 3, "lastScan", "2 hours ago"),
            Map.of("id", "2", "url", "https://shop.example.com", "status", "active", "score", 92, "issues", 1, "lastScan", "5 hours ago")
        );
        
        return ResponseEntity.ok(Map.of("success", true, "data", Map.of("websites", websites)));
    }

    @GetMapping("/recent-scans")
    public ResponseEntity<Map<String, Object>> getRecentScans(@AuthenticationPrincipal UserDetails userDetails) {
        List<Map<String, Object>> scans = Arrays.asList(
            Map.of("id", "1", "url", "example.com", "status", "completed", "date", "2 hours ago", "issuesFound", 3),
            Map.of("id", "2", "url", "shop.example.com", "status", "completed", "date", "5 hours ago", "issuesFound", 1),
            Map.of("id", "3", "url", "blog.example.com", "status", "completed", "date", "1 day ago", "issuesFound", 2)
        );
        
        return ResponseEntity.ok(Map.of("success", true, "data", Map.of("scans", scans)));
    }

    @GetMapping("/ai-insights")
    public ResponseEntity<Map<String, Object>> getAiInsights(@AuthenticationPrincipal UserDetails userDetails) {
        List<Map<String, Object>> insights = Arrays.asList(
            Map.of("id", "1", "title", "Update cookie policy", "description", "New cookies detected since last scan", "priority", "high", "impact", 75, "effort", 15, "category", "policy", "actions", Arrays.asList("Review cookies", "Update policy")),
            Map.of("id", "2", "title", "Add CCPA disclosure", "description", "CCPA compliance gap detected", "priority", "medium", "impact", 60, "effort", 30, "category", "privacy", "actions", Arrays.asList("Generate CCPA text", "Deploy"))
        );
        
        return ResponseEntity.ok(Map.of("success", true, "data", Map.of("insights", insights)));
    }

    @GetMapping("/tasks")
    public ResponseEntity<Map<String, Object>> getTasks(@AuthenticationPrincipal UserDetails userDetails) {
        List<Map<String, Object>> tasks = Arrays.asList(
            Map.of("id", "1", "title", "Review cookie consent banner", "dueDate", "2026-05-20", "priority", "high", "type", "cookie"),
            Map.of("id", "2", "title", "Update privacy policy for CCPA", "dueDate", "2026-05-25", "priority", "medium", "type", "policy"),
            Map.of("id", "3", "title", "Respond to DSAR request", "dueDate", "2026-05-22", "priority", "high", "type", "dsar")
        );
        
        return ResponseEntity.ok(Map.of("success", true, "data", Map.of("tasks", tasks)));
    }

    @GetMapping("/usage")
    public ResponseEntity<Map<String, Object>> getUsage(@AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> usage = new HashMap<>();
        usage.put("plan", "Pro+");
        
        Map<String, Integer> limits = new HashMap<>();
        limits.put("policies", 50);
        limits.put("edits", 1000);
        limits.put("bannerViews", 100000);
        limits.put("scans", 50);
        limits.put("teamSeats", 10);
        
        Map<String, Integer> currentUsage = new HashMap<>();
        currentUsage.put("policies", 12);
        currentUsage.put("edits", 245);
        currentUsage.put("bannerViews", 12500);
        currentUsage.put("scans", 28);
        currentUsage.put("teamSeats", 3);
        
        return ResponseEntity.ok(Map.of("success", true, "data", Map.of("plan", "Pro+", "limits", limits, "currentUsage", currentUsage)));
    }

    @GetMapping("/activity")
    public ResponseEntity<Map<String, Object>> getRecentActivity(@AuthenticationPrincipal UserDetails userDetails) {
        List<Map<String, Object>> activities = Arrays.asList(
            Map.of("action", "Policy Updated", "time", "2 hours ago", "user", "Rahul Singh"),
            Map.of("action", "Cookie Scan Completed", "time", "5 hours ago", "website", "acme.com"),
            Map.of("action", "New DSAR Received", "time", "1 day ago", "id", "DSAR-1234")
        );
        
        return ResponseEntity.ok(Map.of("success", true, "data", Map.of("activities", activities)));
    }
}
