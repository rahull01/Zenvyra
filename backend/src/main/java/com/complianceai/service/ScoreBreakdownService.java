package com.complianceai.service;

import com.complianceai.dto.response.ScoreBreakdownResponse;
import com.complianceai.model.Website;
import com.complianceai.repository.UserRepository;
import com.complianceai.repository.WebsiteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScoreBreakdownService {

    private final WebsiteRepository websiteRepository;
    private final UserRepository userRepository;

    // Category config: name, type-prefix, weight, icon
    private static final List<CategoryConfig> CATEGORIES = List.of(
        new CategoryConfig("Privacy Policy", "privacy", 20.0, "shield"),
        new CategoryConfig("Cookie Consent", "cookie", 20.0, "cookie"),
        new CategoryConfig("SSL / HTTPS",   "ssl",     20.0, "lock"),
        new CategoryConfig("Accessibility", "access",  15.0, "eye"),
        new CategoryConfig("Terms of Service","terms", 10.0, "file-text"),
        new CategoryConfig("Contact & DSAR", "contact",10.0, "mail"),
        new CategoryConfig("Performance",   "perf",     5.0, "zap")
    );

    public ScoreBreakdownResponse getBreakdown(String websiteId) {
        Website website = websiteRepository.findById(websiteId)
                .orElseThrow(() -> new RuntimeException("Website not found"));

        List<Website.ComplianceIssue> issues = website.getIssues() == null ? List.of() : website.getIssues();
        Double overall = website.getComplianceScore() != null ? website.getComplianceScore() : 100.0;
        Double previous = website.getPreviousScore();
        Double trend = (previous != null) ? overall - previous : 0.0;

        // Per-category breakdown
        List<ScoreBreakdownResponse.CategoryBreakdown> categories = CATEGORIES.stream().map(cfg -> {
            long catIssues = issues.stream()
                    .filter(i -> i.getType() != null && i.getType().startsWith(cfg.typePrefix()) && !i.getFixed())
                    .count();
            double deductions = issues.stream()
                    .filter(i -> i.getType() != null && i.getType().startsWith(cfg.typePrefix()) && !i.getFixed())
                    .mapToDouble(i -> severityDeduction(i.getSeverity())).sum();
            double catScore = Math.max(0, 100.0 - deductions);

            return ScoreBreakdownResponse.CategoryBreakdown.builder()
                    .name(cfg.name())
                    .score(catScore)
                    .grade(grade(catScore))
                    .weight(cfg.weight())
                    .issueCount((int) catIssues)
                    .status(status(catScore))
                    .icon(cfg.icon())
                    .build();
        }).collect(Collectors.toList());

        // Issue count by severity
        Map<String, Integer> bySeverity = Map.of(
            "critical", (int) issues.stream().filter(i -> "critical".equals(i.getSeverity()) && !i.getFixed()).count(),
            "high",     (int) issues.stream().filter(i -> "high".equals(i.getSeverity()) && !i.getFixed()).count(),
            "medium",   (int) issues.stream().filter(i -> "medium".equals(i.getSeverity()) && !i.getFixed()).count(),
            "low",      (int) issues.stream().filter(i -> "low".equals(i.getSeverity()) && !i.getFixed()).count()
        );

        long totalIssues  = issues.stream().filter(i -> !i.getFixed()).count();
        long fixedIssues  = issues.stream().filter(Website.ComplianceIssue::getFixed).count();

        // Projected score: what score would be if all auto-fixable issues fixed
        double autoFixDeductions = issues.stream()
                .filter(i -> i.isAutoFixable() && !i.getFixed())
                .mapToDouble(i -> severityDeduction(i.getSeverity())).sum();
        double projectedScore = Math.min(100.0, overall + autoFixDeductions);

        return ScoreBreakdownResponse.builder()
                .overallScore(overall)
                .grade(grade(overall))
                .status(status(overall))
                .trend(trend)
                .trendDirection(trend > 0 ? "improving" : trend < 0 ? "declining" : "stable")
                .categories(categories)
                .issueCountBySeverity(bySeverity)
                .totalIssues((int) totalIssues)
                .fixedIssues((int) fixedIssues)
                .projectedScore(projectedScore)
                .build();
    }

    private String grade(double score) {
        if (score >= 90) return "A";
        if (score >= 80) return "B";
        if (score >= 70) return "C";
        if (score >= 60) return "D";
        return "F";
    }

    private String status(double score) {
        if (score >= 80) return "Compliant";
        if (score >= 60) return "Needs Improvement";
        if (score >= 40) return "At Risk";
        return "Non-Compliant";
    }

    private double severityDeduction(String sev) {
        if (sev == null) return 5;
        return switch (sev.toLowerCase()) {
            case "critical" -> 25;
            case "high"     -> 15;
            case "medium"   -> 10;
            default         -> 5;
        };
    }

    private record CategoryConfig(String name, String typePrefix, Double weight, String icon) {}
}
