package com.complianceai.model;

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
@Document(collection = "website_scan_results")
public class WebsiteScanResult {

    @Id
    private String id;

    private String userId;
    private String targetUrl;
    private ScanStatus status;
    
    @Builder.Default
    private List<ClassifiedTracker> classifiedTrackers = new ArrayList<>();
    
    private LocalDateTime scannedAt;

    public enum ScanStatus {
        PENDING, COMPLETED, FAILED
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClassifiedTracker {
        private String domain;
        private String serviceName;
        private String category; // Essential, Analytics, Marketing, Functional
        private String purposeDescription;
    }
}
