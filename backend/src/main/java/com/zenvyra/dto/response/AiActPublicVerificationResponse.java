package com.zenvyra.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AiActPublicVerificationResponse {

    private String systemName;
    private Integer readinessScore;
    private String riskCategory;
    private String rulesetVersion;
    private LocalDateTime assessedAt;
    private LocalDateTime issuedAt;
    private LocalDateTime expiresAt;
    private boolean active;
    private LocalDateTime revokedAt;
    private List<String> evidenceCategories;
    private List<String> gapCategories;
    private String disclaimer;
}
