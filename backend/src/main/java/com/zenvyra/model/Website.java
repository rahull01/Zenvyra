package com.zenvyra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "websites")
public class Website {
    @Id
    private String id;
    private String userId;
    private String url;
    private String name;
    private Double complianceScore;
    private Double previousScore;
    private String scanFrequency;
    private boolean monitoringEnabled;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;

    public boolean getMonitoringEnabled() {
        return monitoringEnabled;
    }
    @Builder.Default
    private List<ComplianceIssue> issues = new ArrayList<>();
    private java.time.LocalDateTime lastScanAt;
    private java.time.LocalDateTime nextScanAt;
    @Builder.Default
    private List<ScanHistory> scanHistory = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComplianceIssue {
        private String id;
        private String type;
        private String category;
        private String severity;
        private String title;
        private String description;
        private String fixSuggestion;
        private boolean autoFixable;
        private boolean fixed;
        private LocalDateTime detectedAt;

        public boolean getFixed() {
            return fixed;
        }
    }

    @Data
    public static class ScanHistory {
        private Double score;
        private LocalDateTime scanDate;
    }
}
