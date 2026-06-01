package com.complianceai.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PublicVerificationResponse {

    private String websiteId;
    private String websiteName;

    private Double complianceScore;
    private Integer issuesFound;

    private LocalDateTime lastScanAt;

    /**
     * Human-friendly for UI.
     */
    private Long lastVerifiedMinutesAgo;

    /**
     * Convenience for UI.
     * GREEN / YELLOW / RED
     */
    private String scoreState;
}

