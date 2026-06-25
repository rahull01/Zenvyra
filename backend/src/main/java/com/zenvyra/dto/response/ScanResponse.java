package com.zenvyra.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScanResponse {
    private String websiteId;
    private ComplianceScoreResponse basicScan;
    private String aiAnalysis;
    private LocalDateTime nextScanAt;
}