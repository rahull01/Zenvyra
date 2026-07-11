package com.zenvyra.service;

import com.zenvyra.dto.response.AiActAuditLogResponse;
import com.zenvyra.dto.response.EvidenceItemResponse;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.AiActAssessment;
import com.zenvyra.model.AiActAuditEventType;
import com.zenvyra.model.AiSystemInventory;
import com.zenvyra.model.CounselReviewStatus;
import com.zenvyra.model.EvidenceItemStatus;
import com.zenvyra.model.EvidenceItemType;
import com.zenvyra.model.ReleaseStatus;
import com.zenvyra.model.User;
import com.zenvyra.repository.AiActAssessmentRepository;
import com.zenvyra.repository.AiSystemInventoryRepository;
import com.zenvyra.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiActExportServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private AiSystemInventoryRepository systemRepository;
    @Mock
    private AiActAssessmentRepository assessmentRepository;
    @Mock
    private EvidenceItemService evidenceItemService;
    @Mock
    private AiActAuditService auditService;

    private AiActExportService exportService;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        exportService = new AiActExportService(
                userRepository,
                systemRepository,
                assessmentRepository,
                evidenceItemService,
                auditService);
        userDetails = org.springframework.security.core.userdetails.User
                .withUsername("owner@example.com")
                .password("password")
                .roles("USER")
                .build();
        lenient().when(evidenceItemService.findBySystem(any(), any())).thenReturn(List.of());
        lenient().when(auditService.exportBySystem(any(), any())).thenReturn(List.of());
    }

    @Test
    void exportsTransparencyNoticeForOwnedSystem() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .systemName("Support Assistant")
                .purpose("Support")
                .provider("OpenAI")
                .userFacingAiInteraction(true)
                .dataCategoriesSentToAi(List.of("Customer email", "Order history"))
                .euUsersAffected(true)
                .countries(List.of("DE", "FR"))
                .humanOversightOwner("owner@example.com")
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));

        String result = exportService.exportTransparencyNotice(userDetails, "system-1");

        assertTrue(result.contains("Support Assistant"));
        assertTrue(result.contains("AI Transparency Notice"));
        assertTrue(result.contains("You may interact directly with AI-generated content"));
        assertTrue(result.contains("Customer email"));
        assertTrue(result.contains("DE, FR"));
        assertTrue(result.contains("EU users affected"));
        assertTrue(result.contains("owner@example.com"));
        assertTrue(result.contains("not legal advice"));
        assertTrue(result.contains("request human review"));
    }

    @Test
    void exportsEvidenceChecklistWithLatestAssessmentStatuses() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .systemName("Support Assistant")
                .technicalDocumentationReady(true)
                .logsEvidenceRetained(false)
                .build();
        AiActAssessment assessment = AiActAssessment.builder()
                .id("assessment-1")
                .userId("user-1")
                .systemId("system-1")
                .riskCategory("limited-risk transparency")
                .rulesetVersion("EU_AI_ACT_READINESS_2026_07")
                .evidenceChecklist(Map.of(
                        "Technical documentation", "READY",
                        "Post-deployment monitoring", "GAP"))
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(assessmentRepository.findBySystemId("system-1")).thenReturn(List.of(assessment));

        String result = exportService.exportEvidenceChecklist(userDetails, "system-1");

        assertTrue(result.contains("AI Act Evidence Checklist"));
        assertTrue(result.contains("EU_AI_ACT_READINESS_2026_07"));
        assertTrue(result.contains("READY".equals("READY") ? "READY" : "Complete"));
    }

    @Test
    void exportsEvidenceChecklistMergesRealEvidence() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .systemName("Support Assistant")
                .build();
        EvidenceItemResponse item = EvidenceItemResponse.builder()
                .id("ev-1")
                .userId("user-1")
                .systemId("system-1")
                .title("Model card for GPT-4")
                .type(EvidenceItemType.MODEL_CARD)
                .status(EvidenceItemStatus.UPLOADED)
                .owner("ML team")
                .dueDate(LocalDate.of(2026, 8, 1))
                .fileUrl("https://files.example.com/model-card.pdf")
                .counselReviewStatus(CounselReviewStatus.PENDING)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(assessmentRepository.findBySystemId("system-1")).thenReturn(List.of());
        when(evidenceItemService.findBySystem(userDetails, "system-1")).thenReturn(List.of(item));

        String result = exportService.exportEvidenceChecklist(userDetails, "system-1");

        assertTrue(result.contains("Model card for GPT-4"));
        assertTrue(result.contains("UPLOADED"));
        assertTrue(result.contains("ML team"));
        assertTrue(result.contains("https://files.example.com/model-card.pdf"));
        assertTrue(result.contains("PENDING"));
        assertTrue(result.contains("| # | Requirement / Title | Type | Status | Owner | Due date | File URL | Counsel review |"));
    }

    @Test
    void exportsSystemCardIncludesNewInventoryFields() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .systemName("Support Assistant")
                .deploymentContext("EU-hosted production deployment")
                .modelProviderVersion("gpt-4-0613")
                .modelProviderType("commercial closed-source API")
                .decisionImpactLevel("high")
                .releaseStatus(ReleaseStatus.PRODUCTION)
                .customerFacing(true)
                .trainingOrFineTuning(false)
                .lastReviewedAt(LocalDateTime.of(2026, 6, 1, 10, 0))
                .nextReviewAt(LocalDateTime.of(2026, 9, 1, 10, 0))
                .purpose("Customer support automation")
                .countries(List.of("DE", "FR"))
                .dataCategoriesSentToAi(List.of("Customer email"))
                .createdAt(LocalDateTime.of(2026, 1, 1, 0, 0))
                .updatedAt(LocalDateTime.of(2026, 6, 1, 0, 0))
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));

        String result = exportService.exportSystemCard(userDetails, "system-1");

        assertTrue(result.contains("EU-hosted production deployment"));
        assertTrue(result.contains("gpt-4-0613"));
        assertTrue(result.contains("commercial closed-source API"));
        assertTrue(result.contains("high"));
        assertTrue(result.contains("PRODUCTION"));
        assertTrue(result.contains("Customer-facing"));
        assertTrue(result.contains("Training / fine-tuning"));
        assertTrue(result.contains("Last reviewed at"));
        assertTrue(result.contains("Next review at"));
        assertTrue(result.contains("Customer support automation"));
        assertTrue(result.contains("DE, FR"));
        assertTrue(result.contains("Customer email"));
        assertTrue(result.contains("Created at"));
        assertTrue(result.contains("Updated at"));
    }

    @Test
    void exportsAssessmentSummaryWithObligationsAndEvidenceChecklist() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .systemName("Support Assistant")
                .build();
        AiActAssessment assessment = AiActAssessment.builder()
                .id("assessment-1")
                .userId("user-1")
                .systemId("system-1")
                .riskCategory("high-risk indicator")
                .readinessScore(65)
                .confidence(0.75)
                .rulesetVersion("EU_AI_ACT_READINESS_2026_07")
                .riskClassificationRationale("Automated decision-making in employment context")
                .riskLevelExplanation("Triggers Annex III high-risk obligations")
                .confidenceExplanation("Confidence based on five risk signals")
                .assessedAt(LocalDateTime.of(2026, 7, 1, 12, 0))
                .riskSignals(List.of("EU users affected"))
                .annexIIIUseCases(List.of("Annex III: employment, worker management or recruitment indicator"))
                .applicableObligations(List.of("High-risk AI: risk management system"))
                .requiredTransparencyNotices(List.of("User-facing AI interaction notice"))
                .evidenceChecklist(Map.of("Risk assessment", "GAP", "System inventory record", "READY"))
                .evidenceItems(List.of("Technical documentation"))
                .aiLiteracyGaps(List.of("Document AI literacy training"))
                .conformityAssessmentGaps(List.of("Prepare conformity-assessment workpaper"))
                .nextActions(List.of("Complete risk assessment"))
                .counselReviewWarning("not legal advice")
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(assessmentRepository.findById("assessment-1")).thenReturn(Optional.of(assessment));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));

        String result = exportService.exportAssessmentSummary(userDetails, "assessment-1");

        assertTrue(result.contains("high-risk indicator"));
        assertTrue(result.contains("65/100"));
        assertTrue(result.contains("EU_AI_ACT_READINESS_2026_07"));
        assertTrue(result.contains("Annex III"));
        assertTrue(result.contains("High-risk AI: risk management system"));
        assertTrue(result.contains("Evidence checklist"));
        assertTrue(result.contains("AI literacy"));
        assertTrue(result.contains("Conformity assessment"));
        assertTrue(result.contains("not legal advice"));
        assertTrue(result.contains("Risk classification rationale"));
        assertTrue(result.contains("Automated decision-making in employment context"));
        assertTrue(result.contains("Risk level explanation"));
        assertTrue(result.contains("Confidence explanation"));
        assertTrue(result.contains("Version / ruleset / date"));
    }

    @Test
    void blocksExportForAnotherUsersSystem() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-2")
                .userId("user-2")
                .systemName("Other System")
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-2")).thenReturn(Optional.of(system));

        assertThrows(ApiException.class, () -> exportService.exportSystemCard(userDetails, "system-2"));
    }

    @Test
    void exportFullProofPackIncludesSystemFields() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .systemName("Support Assistant")
                .deploymentContext("EU-hosted production")
                .releaseStatus(ReleaseStatus.PRODUCTION)
                .decisionImpactLevel("high")
                .countries(List.of("DE"))
                .purpose("Customer support automation")
                .humanOversightOwner("owner@example.com")
                .build();
        AiActAssessment assessment = AiActAssessment.builder()
                .id("assessment-1")
                .userId("user-1")
                .systemId("system-1")
                .riskCategory("high-risk indicator")
                .readinessScore(72)
                .confidence(0.81)
                .rulesetVersion("EU_AI_ACT_READINESS_2026_07")
                .riskClassificationRationale("Annex III employment indicator")
                .riskLevelExplanation("Triggers high-risk obligations")
                .confidenceExplanation("Based on multiple risk signals")
                .applicableObligations(List.of("Risk management system"))
                .nextActions(List.of("Complete conformity workpaper"))
                .assessedAt(LocalDateTime.of(2026, 7, 1, 12, 0))
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(assessmentRepository.findBySystemId("system-1")).thenReturn(List.of(assessment));

        String result = exportService.exportFullProofPack(userDetails, "system-1");

        assertTrue(result.contains("EU AI Act Readiness Proof Pack"));
        assertTrue(result.contains("Support Assistant"));
        assertTrue(result.contains("Document control"));
        assertTrue(result.contains("EU-hosted production"));
        assertTrue(result.contains("PRODUCTION"));
        assertTrue(result.contains("decision impact level") || result.contains("Decision impact level"));
        assertTrue(result.contains("Customer support automation"));
    }

    @Test
    void exportFullProofPackIncludesAssessmentDetails() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .systemName("Support Assistant")
                .build();
        AiActAssessment assessment = AiActAssessment.builder()
                .id("assessment-1")
                .userId("user-1")
                .systemId("system-1")
                .riskCategory("high-risk indicator")
                .readinessScore(72)
                .confidence(0.81)
                .rulesetVersion("EU_AI_ACT_READINESS_2026_07")
                .riskClassificationRationale("Annex III employment indicator")
                .riskLevelExplanation("Triggers high-risk obligations")
                .confidenceExplanation("Based on multiple risk signals")
                .applicableObligations(List.of("Risk management system"))
                .nextActions(List.of("Complete conformity workpaper"))
                .assessedAt(LocalDateTime.of(2026, 7, 1, 12, 0))
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(assessmentRepository.findBySystemId("system-1")).thenReturn(List.of(assessment));

        String result = exportService.exportFullProofPack(userDetails, "system-1");

        assertTrue(result.contains("high-risk indicator"));
        assertTrue(result.contains("72/100"));
        assertTrue(result.contains("Risk classification summary"));
        assertTrue(result.contains("Annex III employment indicator"));
        assertTrue(result.contains("Applicable obligations"));
        assertTrue(result.contains("Risk management system"));
    }

    @Test
    void exportFullProofPackIncludesEvidenceItems() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .systemName("Support Assistant")
                .build();
        EvidenceItemResponse item = EvidenceItemResponse.builder()
                .id("ev-1")
                .userId("user-1")
                .systemId("system-1")
                .title("Conformity assessment workpaper")
                .type(EvidenceItemType.RISK_ASSESSMENT)
                .status(EvidenceItemStatus.REQUESTED)
                .owner("Compliance team")
                .dueDate(LocalDate.of(2026, 8, 15))
                .fileUrl("https://files.example.com/workpaper.pdf")
                .counselReviewStatus(CounselReviewStatus.NOT_REQUIRED)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(assessmentRepository.findBySystemId("system-1")).thenReturn(List.of());
        when(evidenceItemService.findBySystem(userDetails, "system-1")).thenReturn(List.of(item));

        String result = exportService.exportFullProofPack(userDetails, "system-1");

        assertTrue(result.contains("Evidence register"));
        assertTrue(result.contains("Conformity assessment workpaper"));
        assertTrue(result.contains("REQUESTED"));
    }

    @Test
    void exportFullProofPackIncludesAuditLog() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .systemName("Support Assistant")
                .build();
        AiActAuditLogResponse auditLog = AiActAuditLogResponse.builder()
                .id("log-1")
                .userId("user-1")
                .systemId("system-1")
                .actor("owner@example.com")
                .eventType(AiActAuditEventType.SYSTEM_CREATED)
                .timestamp(LocalDateTime.of(2026, 6, 1, 10, 0))
                .eventData(Map.of("systemName", "Support Assistant"))
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(assessmentRepository.findBySystemId("system-1")).thenReturn(List.of());
        when(auditService.exportBySystem(eq(userDetails), eq("system-1"))).thenReturn(List.of(auditLog));

        String result = exportService.exportFullProofPack(userDetails, "system-1");

        assertTrue(result.contains("Audit log"));
        assertTrue(result.contains("SYSTEM_CREATED"));
    }

    @Test
    void exportFullProofPackIncludesDisclaimer() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .systemName("Support Assistant")
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));

        String result = exportService.exportFullProofPack(userDetails, "system-1");

        assertTrue(result.contains("Legal disclaimer"));
        assertTrue(result.contains("not legal advice"));
    }

    @Test
    void exportFullProofPackPdfRendersPdfFromProofPack() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .systemName("Support Assistant")
                .purpose("Customer support automation")
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));

        byte[] result = exportService.exportFullProofPackPdf(userDetails, "system-1");

        assertTrue(result.length > 500);
        assertEquals("%PDF", new String(result, 0, 4, StandardCharsets.US_ASCII));
    }
}
