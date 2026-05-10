package com.complianceai.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "competitors")
public class Competitor {

    @Id
    private String id;

    private String userId;
    private String url;
    private String name;
    private String industry;

    private Double complianceScore;
    private LocalDateTime lastScan;

    private List<ScoreHistory> history;
    private List<CompetitorAlert> alerts;

    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScoreHistory {
        private LocalDateTime date;
        private Double score;
        private List<String> changes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompetitorAlert {
        private String type; // score_drop, new_policy, fine_news
        private String message;
        private LocalDateTime createdAt;
    }
}
