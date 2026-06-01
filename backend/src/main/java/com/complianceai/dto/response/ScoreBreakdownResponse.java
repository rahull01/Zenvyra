package com.complianceai.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class ScoreBreakdownResponse {

    private Double overallScore;
    private String grade;          // A, B, C, D, F
    private String status;         // Compliant / Needs Improvement / At Risk / Non-Compliant
    private Double trend;          // +5.2 or -3.1
    private String trendDirection; // improving / declining / stable

    private List<CategoryBreakdown> categories;
    private Map<String, Integer> issueCountBySeverity;
    private Integer totalIssues;
    private Integer fixedIssues;
    private Double projectedScore; // Score if all auto-fixable issues resolved

    @Data
    @Builder
    public static class CategoryBreakdown {
        private String name;       // Privacy, Cookies, SSL, Accessibility, Performance
        private Double score;
        private String grade;
        private Double weight;     // % weight in overall score
        private Integer issueCount;
        private String status;
        private String icon;       // emoji or icon name for frontend
    }
}
