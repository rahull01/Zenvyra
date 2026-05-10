package com.complianceai.util;

import com.complianceai.model.Website;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
public class ScoreCalculator {

    private static final Double MAX_SCORE = 100.0;

    // Severity weights
    private static final int CRITICAL_WEIGHT = 25;
    private static final int HIGH_WEIGHT = 15;
    private static final int MEDIUM_WEIGHT = 10;
    private static final int LOW_WEIGHT = 5;

    // Category weights (total = 100)
    private static final int COOKIE_CONSENT_WEIGHT = 20;
    private static final int PRIVACY_POLICY_WEIGHT = 20;
    private static final int SSL_SECURITY_WEIGHT = 20;
    private static final int ACCESSIBILITY_WEIGHT = 15;
    private static final int TERMS_WEIGHT = 10;
    private static final int CONTACT_WEIGHT = 10;
    private static final int PERFORMANCE_WEIGHT = 5;

    public static Double calculateOverallScore(List<Website.ComplianceIssue> issues) {
        if (issues == null || issues.isEmpty()) {
            return MAX_SCORE;
        }

        Double totalDeduction = issues.stream()
                .filter(issue -> !Boolean.TRUE.equals(issue.getFixed()))
                .mapToDouble(ScoreCalculator::getDeductionForSeverity)
                .sum();

        return Math.max(0.0, MAX_SCORE - totalDeduction);
    }

    public static Double calculateCategoryScore(String category, List<Website.ComplianceIssue> issues) {
        List<Website.ComplianceIssue> categoryIssues = issues.stream()
                .filter(issue -> issue.getType().startsWith(category))
                .toList();
    
        if (categoryIssues.isEmpty()) {
            return MAX_SCORE;
        }

        Double deductions = categoryIssues.stream()
                .filter(issue -> !Boolean.TRUE.equals(issue.getFixed()))
                .mapToDouble(ScoreCalculator::getDeductionForSeverity)
                .sum();

        return Math.max(0.0, MAX_SCORE - deductions);
    }

    public static String getGrade(Double score) {
        if (score >= 90)
            return "A";
        if (score >= 80)
            return "B";
        if (score >= 70)
            return "C";
        if (score >= 60)
            return "D";
        if (score >= 50)
            return "E";
        return "F";
    }

    public static String getStatus(Double score) {
        if (score >= 80)
            return "Compliant";
        if (score >= 60)
            return "Needs Improvement";
        if (score >= 40)
            return "At Risk";
        return "Non-Compliant";
    }

    public static String getColorCode(Double score) {
        if (score >= 80)
            return "#28a745"; // Green
        if (score >= 60)
            return "#ffc107"; // Yellow
        if (score >= 40)
            return "#fd7e14"; // Orange
        return "#dc3545"; // Red
    }

    public static Double calculateTrend(Double currentScore, Double previousScore) {
        if (previousScore == null || previousScore == 0.0)
            return 0.0;
        return currentScore - previousScore;
    }

    public static String getTrendDirection(Double trend) {
        if (trend > 0)
            return "improving";
        if (trend < 0)
            return "declining";
        return "stable";
    }

    private static Double getDeductionForSeverity(Website.ComplianceIssue issue) {
        return switch (issue.getSeverity().toLowerCase()) {
            case "critical" -> (double) CRITICAL_WEIGHT;
            case "high" -> (double) HIGH_WEIGHT;
            case "medium" -> (double) MEDIUM_WEIGHT;
            case "low" -> (double) LOW_WEIGHT;
            default -> (double) LOW_WEIGHT;
        };
    }

    public static Double calculateWeightedScore(List<CategoryScore> categoryScores) {
        Double totalWeight = categoryScores.stream()
                .mapToDouble(CategoryScore::weight)
                .sum();

        Double weightedSum = categoryScores.stream()
                .mapToDouble(cs -> cs.score() * cs.weight())
                .sum();

        return totalWeight > 0 ? weightedSum / totalWeight : 0.0;
    }

    public record CategoryScore(String category, Double score, Double weight) {
    }
}
