package com.zenvyra.service;

import com.zenvyra.dto.response.AiActPublicVerificationResponse;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.AiActAssessment;
import com.zenvyra.model.AiActCertificate;
import com.zenvyra.model.AiSystemInventory;
import com.zenvyra.model.EvidenceItem;
import com.zenvyra.model.EvidenceItemStatus;
import com.zenvyra.model.EvidenceItemType;
import com.zenvyra.model.User;
import com.zenvyra.repository.AiActAssessmentRepository;
import com.zenvyra.repository.AiActCertificateRepository;
import com.zenvyra.repository.AiSystemInventoryRepository;
import com.zenvyra.repository.EvidenceItemRepository;
import com.zenvyra.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiActCertificateServiceTest {

    @Mock
    private AiActCertificateRepository certificateRepository;
    @Mock
    private AiSystemInventoryRepository systemRepository;
    @Mock
    private AiActAssessmentRepository assessmentRepository;
    @Mock
    private EvidenceItemRepository evidenceItemRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private AiActAuditService aiActAuditService;

    private AiActCertificateService service;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        service = new AiActCertificateService(
                certificateRepository,
                systemRepository,
                assessmentRepository,
                evidenceItemRepository,
                userRepository,
                aiActAuditService
        );
        userDetails = org.springframework.security.core.userdetails.User
                .withUsername("owner@example.com")
                .password("password")
                .roles("USER")
                .build();
    }

    @Test
    void issueCertificateCreatesActiveCertWithTokenAndEmbedCode() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .organizationId("org-1")
                .systemName("Support Assistant")
                .build();
        AiActAssessment assessment = AiActAssessment.builder()
                .id("assessment-1")
                .systemId("system-1")
                .riskCategory("HIGH_RISK")
                .readinessScore(82)
                .rulesetVersion("v1.2.0")
                .assessedAt(LocalDateTime.of(2026, 7, 1, 9, 0))
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(assessmentRepository.findBySystemId("system-1")).thenReturn(List.of(assessment));
        when(certificateRepository.findBySystemIdAndActiveTrue("system-1")).thenReturn(Optional.empty());
        when(certificateRepository.save(any(AiActCertificate.class))).thenAnswer(invocation -> {
            AiActCertificate cert = invocation.getArgument(0);
            cert.setId("cert-1");
            return cert;
        });

        AiActCertificate certificate = service.issueCertificate(userDetails, "system-1");

        assertNotNull(certificate.getId());
        assertTrue(certificate.isActive());
        assertNotNull(certificate.getVerificationToken());
        assertEquals(36, certificate.getVerificationToken().length()); // UUID
        assertEquals("Support Assistant", certificate.getSystemName());
        assertEquals(82, certificate.getReadinessScore());
        assertEquals("HIGH_RISK", certificate.getRiskCategory());
        assertEquals("v1.2.0", certificate.getRulesetVersion());
        assertNotNull(certificate.getBadgeEmbedCode());
        assertTrue(certificate.getBadgeEmbedCode().contains(certificate.getVerificationToken()));
        assertTrue(certificate.getBadgeEmbedCode().contains("verify/ai/"));
        assertNotNull(certificate.getIssuedAt());
        assertNotNull(certificate.getExpiresAt());
        assertTrue(certificate.getExpiresAt().isAfter(certificate.getIssuedAt()));
        verify(aiActAuditService, times(1)).logCertificateIssued(eq(userDetails), any(AiActCertificate.class));
    }

    @Test
    void issueCertificateRevokesPreviousActiveCertificate() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-1").organizationId("org-1").systemName("X").build();
        AiActAssessment assessment = AiActAssessment.builder()
                .systemId("system-1").riskCategory("LIMITED").readinessScore(60)
                .rulesetVersion("v1").assessedAt(LocalDateTime.now())
                .build();
        AiActCertificate existing = AiActCertificate.builder()
                .id("cert-old")
                .systemId("system-1")
                .active(true)
                .verificationToken("old-token")
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(assessmentRepository.findBySystemId("system-1")).thenReturn(List.of(assessment));
        when(certificateRepository.findBySystemIdAndActiveTrue("system-1"))
                .thenReturn(Optional.of(existing));
        when(certificateRepository.save(any(AiActCertificate.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.issueCertificate(userDetails, "system-1");

        ArgumentCaptor<AiActCertificate> captor = ArgumentCaptor.forClass(AiActCertificate.class);
        verify(certificateRepository, times(2)).save(captor.capture());
        List<AiActCertificate> saved = captor.getAllValues();
        AiActCertificate revoked = saved.get(0);
        assertFalse(revoked.isActive());
        assertNotNull(revoked.getRevokedAt());
        assertEquals("Superseded by new certificate", revoked.getRevokeReason());
        AiActCertificate issued = saved.get(1);
        assertTrue(issued.isActive());
        assertNotNull(issued.getVerificationToken());
    }

    @Test
    void issueCertificateFailsWithoutAssessment() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-1").organizationId("org-1").systemName("X").build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(assessmentRepository.findBySystemId("system-1")).thenReturn(List.of());

        ApiException ex = assertThrows(ApiException.class,
                () -> service.issueCertificate(userDetails, "system-1"));
        assertTrue(ex.getMessage().toLowerCase().contains("assessment"));
        verify(certificateRepository, never()).save(any(AiActCertificate.class));
    }

    @Test
    void revokeMarksCertInactiveAndPublicVerifyThrowsNotFound() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-1").organizationId("org-1").systemName("X").build();
        AiActCertificate active = AiActCertificate.builder()
                .id("cert-1")
                .systemId("system-1")
                .active(true)
                .verificationToken("token-abc")
                .issuedAt(LocalDateTime.now().minusDays(10))
                .expiresAt(LocalDateTime.now().plusDays(80))
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(certificateRepository.findBySystemIdAndActiveTrue("system-1")).thenReturn(Optional.of(active));
        when(certificateRepository.save(any(AiActCertificate.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AiActCertificate revoked = service.revokeCertificate(userDetails, "system-1", "By operator request");

        assertFalse(revoked.isActive());
        assertNotNull(revoked.getRevokedAt());
        assertEquals("By operator request", revoked.getRevokeReason());
        verify(aiActAuditService, times(1)).logCertificateRevoked(eq(userDetails), any(AiActCertificate.class), eq("By operator request"));

        when(certificateRepository.findByVerificationToken("token-abc")).thenReturn(Optional.of(revoked));
        assertThrows(ApiException.class, () -> service.getPublicVerification("token-abc"));
    }

    @Test
    void revokeThrowsWhenNoActiveCert() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-1").organizationId("org-1").systemName("X").build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(certificateRepository.findBySystemIdAndActiveTrue("system-1")).thenReturn(Optional.empty());

        assertThrows(ApiException.class,
                () -> service.revokeCertificate(userDetails, "system-1", "reason"));
        verify(certificateRepository, never()).save(any(AiActCertificate.class));
    }

    @Test
    void publicVerificationHidesPrivateEvidenceTitlesAndFiles() {
        AiActCertificate certificate = AiActCertificate.builder()
                .id("cert-1")
                .systemId("system-1")
                .organizationId("org-1")
                .systemName("Support Assistant")
                .active(true)
                .verificationToken("public-token")
                .issuedAt(LocalDateTime.now().minusDays(1))
                .expiresAt(LocalDateTime.now().plusDays(89))
                .readinessScore(78)
                .riskCategory("HIGH_RISK")
                .rulesetVersion("v1.2.0")
                .assessedAt(LocalDateTime.now().minusDays(2))
                .build();
        EvidenceItem item1 = EvidenceItem.builder()
                .id("evidence-1")
                .systemId("system-1")
                .organizationId("org-1")
                .title("Internal privacy policy v1 — confidential title")
                .fileName("policy.pdf")
                .fileUrl("https://internal.example.com/files/policy.pdf")
                .type(EvidenceItemType.POLICY)
                .status(EvidenceItemStatus.APPROVED)
                .build();
        EvidenceItem item2 = EvidenceItem.builder()
                .id("evidence-2")
                .systemId("system-1")
                .organizationId("org-1")
                .title("Operator screenshot — production dashboard")
                .fileName("screenshot.png")
                .fileUrl("https://internal.example.com/files/screenshot.png")
                .type(EvidenceItemType.SCREENSHOT)
                .status(EvidenceItemStatus.UPLOADED)
                .build();

        when(certificateRepository.findByVerificationToken("public-token"))
                .thenReturn(Optional.of(certificate));
        when(evidenceItemRepository.findBySystemIdAndOrganizationId("system-1", "org-1"))
                .thenReturn(List.of(item1, item2));

        AiActPublicVerificationResponse response = service.getPublicVerification("public-token");

        assertEquals("Support Assistant", response.getSystemName());
        assertEquals(78, response.getReadinessScore());
        assertEquals("HIGH_RISK", response.getRiskCategory());
        assertTrue(response.isActive());
        assertNotNull(response.getDisclaimer());

        // Only types exposed; titles/files never reach the public payload
        assertEquals(List.of("POLICY", "SCREENSHOT"), response.getEvidenceCategories());
        assertFalse(response.getEvidenceCategories().contains("Internal privacy policy v1"));
        assertFalse(response.getEvidenceCategories().contains("Operator screenshot"));
        assertNull(response.getRevokedAt());

        // No evidence repository call for sensitive details; only category lookup happens
        verify(evidenceItemRepository, times(1)).findBySystemIdAndOrganizationId("system-1", "org-1");
    }

    @Test
    void publicVerificationIncludesGapCategoriesFromLatestAssessment() {
        AiActCertificate certificate = AiActCertificate.builder()
                .systemId("system-1")
                .organizationId("org-1")
                .systemName("Support Assistant")
                .active(true)
                .verificationToken("public-token")
                .issuedAt(LocalDateTime.now().minusDays(1))
                .expiresAt(LocalDateTime.now().plusDays(89))
                .readinessScore(70)
                .riskCategory("HIGH_RISK")
                .rulesetVersion("v1")
                .assessedAt(LocalDateTime.now().minusDays(2))
                .build();
        AiActAssessment assessment = AiActAssessment.builder()
                .systemId("system-1")
                .riskCategory("HIGH_RISK")
                .readinessScore(70)
                .rulesetVersion("v1")
                .assessedAt(LocalDateTime.now().minusDays(2))
                .humanOversightGaps(List.of("Document human review and escalation workflow"))
                .documentationGaps(List.of("Collect provider documentation"))
                .userDisclosureGaps(List.of("Publish transparency notice"))
                .monitoringGaps(List.of())
                .build();

        when(certificateRepository.findByVerificationToken("public-token"))
                .thenReturn(Optional.of(certificate));
        when(evidenceItemRepository.findBySystemIdAndOrganizationId("system-1", "org-1"))
                .thenReturn(List.of());
        when(assessmentRepository.findBySystemId("system-1")).thenReturn(List.of(assessment));

        AiActPublicVerificationResponse response = service.getPublicVerification("public-token");

        assertEquals(3, response.getGapCategories().size());
        assertTrue(response.getGapCategories().contains("Document human review and escalation workflow"));
        assertTrue(response.getGapCategories().contains("Collect provider documentation"));
        assertTrue(response.getGapCategories().contains("Publish transparency notice"));
    }

    @Test
    void publicVerificationReturnsNotFoundForExpiredCertificate() {
        AiActCertificate certificate = AiActCertificate.builder()
                .systemId("system-1")
                .organizationId("org-1")
                .systemName("Support Assistant")
                .active(true)
                .verificationToken("expired-token")
                .issuedAt(LocalDateTime.now().minusDays(120))
                .expiresAt(LocalDateTime.now().minusDays(30))
                .readinessScore(70)
                .riskCategory("HIGH_RISK")
                .rulesetVersion("v1")
                .assessedAt(LocalDateTime.now().minusDays(130))
                .build();

        when(certificateRepository.findByVerificationToken("expired-token"))
                .thenReturn(Optional.of(certificate));

        assertThrows(ApiException.class, () -> service.getPublicVerification("expired-token"));
    }

    @Test
    void publicVerificationReturnsNotFoundForRevokedCertificate() {
        AiActCertificate certificate = AiActCertificate.builder()
                .systemId("system-1")
                .organizationId("org-1")
                .systemName("Support Assistant")
                .active(false)
                .revokedAt(LocalDateTime.now().minusDays(2))
                .revokeReason("Owner revoked")
                .verificationToken("revoked-token")
                .issuedAt(LocalDateTime.now().minusDays(5))
                .expiresAt(LocalDateTime.now().plusDays(85))
                .build();

        when(certificateRepository.findByVerificationToken("revoked-token"))
                .thenReturn(Optional.of(certificate));

        assertThrows(ApiException.class, () -> service.getPublicVerification("revoked-token"));
    }

    @Test
    void publicVerificationReturnsNotFoundForUnknownToken() {
        when(certificateRepository.findByVerificationToken("missing")).thenReturn(Optional.empty());
        assertThrows(ApiException.class, () -> service.getPublicVerification("missing"));
    }

    @Test
    void getSystemCertificateReturnsLatest() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-1").organizationId("org-1").systemName("X").build();
        AiActCertificate older = AiActCertificate.builder()
                .id("cert-old").systemId("system-1").issuedAt(LocalDateTime.now().minusDays(100)).build();
        AiActCertificate newer = AiActCertificate.builder()
                .id("cert-new").systemId("system-1").issuedAt(LocalDateTime.now()).build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(certificateRepository.findBySystemIdOrderByIssuedAtDesc("system-1"))
                .thenReturn(List.of(newer, older));

        AiActCertificate latest = service.getSystemCertificate(userDetails, "system-1");
        assertEquals("cert-new", latest.getId());
    }

    @Test
    void getSystemCertificateReturnsNotFoundWhenEmpty() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-1").organizationId("org-1").systemName("X").build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(certificateRepository.findBySystemIdOrderByIssuedAtDesc("system-1")).thenReturn(List.of());

        assertThrows(ApiException.class, () -> service.getSystemCertificate(userDetails, "system-1"));
    }

    @Test
    void issueCertificateRejectsOtherUsersSystem() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-2").organizationId("org-2").systemName("Other").build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));

        assertThrows(ApiException.class, () -> service.issueCertificate(userDetails, "system-1"));
        verify(certificateRepository, never()).save(any(AiActCertificate.class));
    }

    private static org.mockito.ArgumentMatcher<UserDetails> eqUserDetails() {
        return u -> u != null && "owner@example.com".equals(u.getUsername());
    }
}
