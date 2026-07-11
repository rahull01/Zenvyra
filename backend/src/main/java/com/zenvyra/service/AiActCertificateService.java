package com.zenvyra.service;

import com.zenvyra.dto.response.AiActPublicVerificationResponse;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.AiActAssessment;
import com.zenvyra.model.AiActCertificate;
import com.zenvyra.model.AiSystemInventory;
import com.zenvyra.model.EvidenceItem;
import com.zenvyra.model.User;
import com.zenvyra.repository.AiActAssessmentRepository;
import com.zenvyra.repository.AiActCertificateRepository;
import com.zenvyra.repository.AiSystemInventoryRepository;
import com.zenvyra.repository.EvidenceItemRepository;
import com.zenvyra.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiActCertificateService {

    private static final String DISCLAIMER =
            "This public certificate is an AI Act readiness indicator, not a legal certification or legal advice.";

    private final AiActCertificateRepository certificateRepository;
    private final AiSystemInventoryRepository systemRepository;
    private final AiActAssessmentRepository assessmentRepository;
    private final EvidenceItemRepository evidenceItemRepository;
    private final UserRepository userRepository;
    private final AiActAuditService aiActAuditService;

    public AiActCertificate issueCertificate(UserDetails userDetails, String systemId) {
        User user = resolveUser(userDetails);
        AiSystemInventory system = loadOwnedSystem(user, systemId);

        AiActAssessment latest = latestAssessmentFor(systemId)
                .orElseThrow(() -> ApiException.badRequest(
                        "No assessment available for this system. Run an assessment first."));

        LocalDateTime now = LocalDateTime.now();

        certificateRepository.findBySystemIdAndActiveTrue(systemId)
                .ifPresent(existing -> {
                    existing.setActive(false);
                    existing.setRevokedAt(now);
                    existing.setRevokeReason("Superseded by new certificate");
                    certificateRepository.save(existing);
                });

        String token = UUID.randomUUID().toString();
        String embedCode = buildBadgeEmbedCode(token, system.getSystemName());

        AiActCertificate certificate = AiActCertificate.builder()
                .userId(user.getId())
                .organizationId(system.getOrganizationId())
                .systemId(system.getId())
                .systemName(system.getSystemName())
                .active(true)
                .issuedAt(now)
                .expiresAt(now.plusDays(90))
                .verificationToken(token)
                .readinessScore(latest.getReadinessScore())
                .riskCategory(latest.getRiskCategory())
                .rulesetVersion(latest.getRulesetVersion())
                .assessedAt(latest.getAssessedAt())
                .badgeEmbedCode(embedCode)
                .build();

        AiActCertificate saved = certificateRepository.save(certificate);
        aiActAuditService.logCertificateIssued(userDetails, saved);
        log.info("Issued AI Act certificate {} for system {} (user {})",
                saved.getId(), systemId, user.getId());
        return saved;
    }

    public AiActCertificate revokeCertificate(UserDetails userDetails, String systemId, String reason) {
        User user = resolveUser(userDetails);
        loadOwnedSystem(user, systemId);

        AiActCertificate certificate = certificateRepository.findBySystemIdAndActiveTrue(systemId)
                .orElseThrow(() -> ApiException.notFound("Active AI Act certificate"));

        LocalDateTime now = LocalDateTime.now();
        certificate.setActive(false);
        certificate.setRevokedAt(now);
        certificate.setRevokeReason(reason != null && !reason.isBlank()
                ? reason
                : "Revoked by owner");

        AiActCertificate saved = certificateRepository.save(certificate);
        aiActAuditService.logCertificateRevoked(userDetails, saved, certificate.getRevokeReason());
        log.info("Revoked AI Act certificate {} for system {}", saved.getId(), systemId);
        return saved;
    }

    public AiActPublicVerificationResponse getPublicVerification(String token) {
        AiActCertificate certificate = certificateRepository.findByVerificationToken(token)
                .orElseThrow(() -> ApiException.notFound("AI Act certificate"));

        if (!certificate.isActive() || certificate.getRevokedAt() != null) {
            throw ApiException.notFound("AI Act certificate");
        }
        LocalDateTime now = LocalDateTime.now();
        if (certificate.getExpiresAt() == null || !certificate.getExpiresAt().isAfter(now)) {
            throw ApiException.notFound("AI Act certificate");
        }

        List<String> evidenceCategories = collectEvidenceCategories(certificate);
        List<String> gapCategories = collectGapCategories(certificate.getSystemId());

        return AiActPublicVerificationResponse.builder()
                .systemName(certificate.getSystemName())
                .readinessScore(certificate.getReadinessScore())
                .riskCategory(certificate.getRiskCategory())
                .rulesetVersion(certificate.getRulesetVersion())
                .assessedAt(certificate.getAssessedAt())
                .issuedAt(certificate.getIssuedAt())
                .expiresAt(certificate.getExpiresAt())
                .active(certificate.isActive())
                .revokedAt(certificate.getRevokedAt())
                .evidenceCategories(evidenceCategories)
                .gapCategories(gapCategories)
                .disclaimer(DISCLAIMER)
                .build();
    }

    public AiActCertificate getSystemCertificate(UserDetails userDetails, String systemId) {
        User user = resolveUser(userDetails);
        loadOwnedSystem(user, systemId);
        List<AiActCertificate> certs = certificateRepository.findBySystemIdOrderByIssuedAtDesc(systemId);
        if (certs.isEmpty()) {
            throw ApiException.notFound("AI Act certificate");
        }
        return certs.get(0);
    }

    private List<String> collectEvidenceCategories(AiActCertificate certificate) {
        Set<String> categories = new LinkedHashSet<>();
        for (EvidenceItem item : evidenceItemRepository.findBySystemIdAndOrganizationId(
                certificate.getSystemId(),
                certificate.getOrganizationId())) {
            if (item.getType() != null) {
                categories.add(item.getType().name());
            }
        }
        return new ArrayList<>(categories);
    }

    private List<String> collectGapCategories(String systemId) {
        return latestAssessmentFor(systemId)
                .map(assessment -> {
                    List<String> gaps = new ArrayList<>();
                    addIfPresent(gaps, assessment.getHumanOversightGaps());
                    addIfPresent(gaps, assessment.getDocumentationGaps());
                    addIfPresent(gaps, assessment.getDataHandlingGaps());
                    addIfPresent(gaps, assessment.getUserDisclosureGaps());
                    addIfPresent(gaps, assessment.getMonitoringGaps());
                    addIfPresent(gaps, assessment.getAiLiteracyGaps());
                    addIfPresent(gaps, assessment.getGpaiProviderDocumentationGaps());
                    addIfPresent(gaps, assessment.getConformityAssessmentGaps());
                    return gaps;
                })
                .orElseGet(List::of);
    }

    private void addIfPresent(List<String> target, List<String> source) {
        if (source == null || source.isEmpty()) {
            return;
        }
        target.addAll(source);
    }

    private Optional<AiActAssessment> latestAssessmentFor(String systemId) {
        List<AiActAssessment> assessments = assessmentRepository.findBySystemId(systemId);
        if (assessments == null || assessments.isEmpty()) {
            return Optional.empty();
        }
        return assessments.stream()
                .max(Comparator.comparing(
                        AiActAssessment::getAssessedAt,
                        Comparator.nullsFirst(Comparator.naturalOrder())));
    }

    private String buildBadgeEmbedCode(String token, String systemName) {
        String safeName = systemName == null ? "AI system" : systemName;
        return """
                <!-- Zenvyra AI Act Readiness Badge -->
                <a href="https://zenvyra.com/verify/ai/%s" target="_blank" rel="noopener noreferrer">
                  <img src="https://zenvyra.com/badge/ai/%s"
                       alt="Zenvyra AI Act readiness certificate for %s"
                       style="height:64px;width:auto;" />
                </a>
                """.formatted(token, token, safeName);
    }

    private User resolveUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ApiException("User not found",
                        org.springframework.http.HttpStatus.UNAUTHORIZED, "UNAUTHORIZED"));
    }

    private AiSystemInventory loadOwnedSystem(User user, String systemId) {
        AiSystemInventory system = systemRepository.findById(systemId)
                .orElseThrow(() -> ApiException.notFound("AI system"));
        if (!user.getId().equals(system.getUserId())) {
            throw ApiException.forbidden("Access denied");
        }
        return system;
    }
}
