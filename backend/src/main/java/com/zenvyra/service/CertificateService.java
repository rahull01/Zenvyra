package com.zenvyra.service;

import com.zenvyra.model.ComplianceCertificate;
import com.zenvyra.model.User;
import com.zenvyra.model.Website;
import com.zenvyra.repository.CertificateRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final WebsiteRepository websiteRepository;

    public ComplianceCertificate issueCertificate(String userEmail, String websiteId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Website website = websiteRepository.findById(websiteId)
                .orElseThrow(() -> new RuntimeException("Website not found"));

        Double score = website.getComplianceScore();
        if (score == null || score < 60) {
            throw new RuntimeException("Score too low to issue certificate. Minimum score: 60");
        }

        // Revoke previous certificate if exists
        certificateRepository.findByWebsiteIdAndActiveTrue(websiteId)
                .ifPresent(existing -> {
                    existing.setActive(false);
                    existing.setRevokedAt(LocalDateTime.now());
                    existing.setRevokeReason("Superseded by new certificate");
                    certificateRepository.save(existing);
                });

        String tier = determineTier(score);
        String token = UUID.randomUUID().toString();

        Map<String, Double> categoryScores = buildCategoryScores(website);
        String embedCode = buildBadgeEmbedCode(token, tier, score, website.getUrl());

        ComplianceCertificate cert = ComplianceCertificate.builder()
                .userId(user.getId())
                .websiteId(websiteId)
                .websiteUrl(website.getUrl())
                .tier(tier)
                .score(score)
                .categoryScores(categoryScores)
                .verificationToken(token)
                .badgeEmbedCode(embedCode)
                .issuedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(90)) // 90-day expiry drives re-engagement
                .active(true)
                .build();

        return certificateRepository.save(cert);
    }

    public ComplianceCertificate verifyCertificate(String token) {
        return certificateRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid certificate token"));
    }

    public List<ComplianceCertificate> getUserCertificates(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return certificateRepository.findByUserId(user.getId());
    }

    private String determineTier(Double score) {
        if (score >= 95) return "PLATINUM";
        if (score >= 90) return "GOLD";
        if (score >= 75) return "SILVER";
        return "BRONZE";
    }

    private Map<String, Double> buildCategoryScores(Website website) {
        Map<String, Double> scores = new HashMap<>();
        if (website.getIssues() == null || website.getIssues().isEmpty()) {
            scores.put("privacy", 100.0);
            scores.put("cookies", 100.0);
            scores.put("ssl", 100.0);
            scores.put("accessibility", 100.0);
            scores.put("performance", 100.0);
            return scores;
        }

        // Calculate per-category scores based on issues
        double privacyDeductions = website.getIssues().stream()
                .filter(i -> i.getType() != null && i.getType().contains("privacy") && !i.getFixed())
                .mapToDouble(i -> getSeverityDeduction(i.getSeverity())).sum();
        double cookieDeductions = website.getIssues().stream()
                .filter(i -> i.getType() != null && i.getType().contains("cookie") && !i.getFixed())
                .mapToDouble(i -> getSeverityDeduction(i.getSeverity())).sum();
        double sslDeductions = website.getIssues().stream()
                .filter(i -> i.getType() != null && i.getType().contains("ssl") && !i.getFixed())
                .mapToDouble(i -> getSeverityDeduction(i.getSeverity())).sum();

        scores.put("privacy", Math.max(0, 100 - privacyDeductions));
        scores.put("cookies", Math.max(0, 100 - cookieDeductions));
        scores.put("ssl", Math.max(0, 100 - sslDeductions));
        scores.put("accessibility", 85.0); // Placeholder — extend with real checks
        scores.put("performance", 90.0);
        return scores;
    }

    private double getSeverityDeduction(String severity) {
        if (severity == null) return 5;
        return switch (severity.toLowerCase()) {
            case "critical" -> 25;
            case "high" -> 15;
            case "medium" -> 10;
            default -> 5;
        };
    }

    private String buildBadgeEmbedCode(String token, String tier, Double score, String siteUrl) {
        return """
                <!-- Zenvyra Badge -->
                <a href="https://zenvyra.com/verify/%s" target="_blank" rel="noopener noreferrer">
                  <img src="https://zenvyra.com/badges/%s/%s.svg"
                       alt="Zenvyra %s Certificate - Score %s"
                       style="height:64px;width:auto;" />
                </a>
                """.formatted(token, tier.toLowerCase(), score.intValue(), tier, score.intValue());
    }
}
