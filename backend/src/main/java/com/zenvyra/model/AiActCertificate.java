package com.zenvyra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ai_act_certificates")
public class AiActCertificate {

    @Id
    private String id;

    private String userId;
    private String organizationId;

    @Indexed
    private String systemId;

    private String systemName;

    private boolean active;
    private String revokeReason;
    private LocalDateTime issuedAt;
    private LocalDateTime expiresAt;
    private LocalDateTime revokedAt;

    @Indexed(unique = true)
    private String verificationToken;

    private Integer readinessScore;
    private String riskCategory;
    private String rulesetVersion;
    private LocalDateTime assessedAt;
    private String badgeEmbedCode;
}
