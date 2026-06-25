package com.zenvyra.model;

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
@Document(collection = "scan_results")
public class ScanResult {

    @Id
    private String id;

    private String userId;
    private String websiteId;
    private String url;

    private Double score;
    private Double previousScore;
    private Integer issuesCount;

    private List<Website.ComplianceIssue> issues;
    private String aiAnalysis;

    private LocalDateTime scannedAt;
    private String status; // success, error, partial
    private String errorMessage;
}
