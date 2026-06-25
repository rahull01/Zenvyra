package com.zenvyra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "certificates")
public class ComplianceCertificate {

    @Id
    private String id;

    private String userId;
    private String websiteId;
    private String websiteUrl;

    // Badge tier: BRONZE (≥60), SILVER (≥75), GOLD (≥90), PLATINUM (≥95)
    private String tier;
    private Double score;

    // Score breakdown per category
    private Map<String, Double> categoryScores;

    // Unique token for public badge verification
    private String verificationToken;
    private String badgeEmbedCode;

    private LocalDateTime issuedAt;
    private LocalDateTime expiresAt; // Certificates expire after 90 days - drives re-engagement
    private LocalDateTime revokedAt;

    private Boolean active;
    private String revokeReason;
}
