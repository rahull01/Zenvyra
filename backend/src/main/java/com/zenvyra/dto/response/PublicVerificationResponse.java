package com.zenvyra.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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
    private String siteDomain;
    private String privacyProofStatus;
    private Double ukUsReadinessScore;
    private String activeMonitoringStatus;
    private String policyVersionStatus;
    private String consentEvidenceStatus;
    private String dsarWorkflowStatus;
    private List<Map<String, Object>> issueSummary;
    private String disclaimer;
}

