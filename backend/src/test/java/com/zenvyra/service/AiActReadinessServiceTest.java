package com.zenvyra.service;

import com.zenvyra.dto.response.AiActAssessmentResponse;
import com.zenvyra.dto.response.AiActReadinessResponse;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.AiActAssessment;
import com.zenvyra.model.AiSystemInventory;
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

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiActReadinessServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private AiSystemInventoryRepository systemRepository;
    @Mock
    private AiActAssessmentRepository assessmentRepository;

    private AiActReadinessService service;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        service = new AiActReadinessService(userRepository, systemRepository, assessmentRepository);
        userDetails = org.springframework.security.core.userdetails.User
                .withUsername("owner@example.com")
                .password("password")
                .roles("USER")
                .build();
    }

    @Test
    void createsAssessesAndSummarizesAiReadiness() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .systemName("Support Assistant")
                .provider("OpenAI")
                .euUsersAffected(true)
                .userFacingAiInteraction(true)
                .automatedDecisionMaking(true)
                .humanOversight(false)
                .logsEvidenceRetained(false)
                .build();

        AtomicReference<AiActAssessment> savedAssessment = new AtomicReference<>();
        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(assessmentRepository.save(any(AiActAssessment.class))).thenAnswer(invocation -> {
            AiActAssessment assessment = invocation.getArgument(0);
            assessment.setId("assessment-1");
            savedAssessment.set(assessment);
            return assessment;
        });

        AiActAssessmentResponse assessment = service.assess(userDetails, "system-1");

        assertEquals("high-risk indicator", assessment.getRiskCategory());
        assertTrue(assessment.getRequiredTransparencyNotices().contains("User-facing AI interaction notice"));
        assertTrue(assessment.getHumanOversightGaps().contains("Document human review and escalation workflow"));
        assertNotNull(assessment.getAssessedAt());

        when(systemRepository.findByUserId("user-1")).thenReturn(List.of(system));
        when(assessmentRepository.findByUserId("user-1")).thenReturn(List.of(savedAssessment.get()));

        AiActReadinessResponse readiness = service.readiness(userDetails);

        assertEquals(Integer.valueOf(1), readiness.getAiSystemsInventoried());
        assertEquals(Long.valueOf(1L), readiness.getHighRiskFlags());
        assertTrue(readiness.getDisclaimer().contains("not legal advice"));
        assertTrue(String.valueOf(readiness.getDraftOutputs().get("systemNames")).contains("Support Assistant"));
        assertTrue(String.valueOf(readiness.getLatestAssessments()).contains("assessment-1"));
    }

    @Test
    void blocksAccessToAnotherUsersSystem() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-2")
                .userId("user-2")
                .systemName("Other System")
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-2")).thenReturn(Optional.of(system));

        assertThrows(ApiException.class, () -> service.system(userDetails, "system-2"));
    }

    @Test
    void prohibitedUseIndicatorTakesPriority() {
        AiSystemInventory system = baseSystem("system-prohibited")
                .prohibitedUse(true)
                .healthcareUse(true)
                .build();

        AiActAssessmentResponse assessment = assess(system);

        assertEquals("prohibited risk indicator", assessment.getRiskCategory());
        assertTrue(assessment.getRiskSignals().contains("Prohibited-use indicator requires immediate legal review"));
    }

    @Test
    void highRiskDomainDoesNotRequireAutomatedDecisionMaking() {
        AiSystemInventory system = baseSystem("system-hiring")
                .hiringUse(true)
                .automatedDecisionMaking(false)
                .userFacingAiInteraction(false)
                .build();

        AiActAssessmentResponse assessment = assess(system);

        assertEquals("high-risk indicator", assessment.getRiskCategory());
        assertTrue(assessment.getRiskSignals().contains("High-risk domain: Hiring or employment use"));
    }

    @Test
    void userFacingAiWithoutHighRiskSignalsRequiresTransparencyOnly() {
        AiSystemInventory system = baseSystem("system-chatbot")
                .userFacingAiInteraction(true)
                .automatedDecisionMaking(false)
                .build();

        AiActAssessmentResponse assessment = assess(system);

        assertEquals("limited-risk transparency", assessment.getRiskCategory());
        assertTrue(assessment.getRequiredTransparencyNotices().contains("User-facing AI interaction notice"));
        assertTrue(assessment.getRiskSignals().contains("Transparency obligation indicator: users interact with AI output"));
    }

    @Test
    void internalReadySystemIsMinimalRiskWithFullReadinessScore() {
        AiSystemInventory system = baseSystem("system-internal")
                .userFacingAiInteraction(false)
                .automatedDecisionMaking(false)
                .humanOversightOwner("Operations lead")
                .technicalDocumentationReady(true)
                .riskAssessmentCompleted(true)
                .logsEvidenceRetained(true)
                .monitoringEnabled(true)
                .dataCategoriesSentToAi(List.of("operational metrics"))
                .build();

        AiActAssessmentResponse assessment = assess(system);

        assertEquals("minimal risk", assessment.getRiskCategory());
        assertEquals(100, assessment.getReadinessScore());
        assertTrue(assessment.getRequiredTransparencyNotices().isEmpty());
    }

    @Test
    void thirdPartyProviderAddsDocumentationGap() {
        AiSystemInventory system = baseSystem("system-provider")
                .provider("OpenAI")
                .modelProviderType("third-party provider")
                .technicalDocumentationReady(false)
                .build();

        AiActAssessmentResponse assessment = assess(system);

        assertTrue(assessment.getRiskSignals().contains("Provider documentation needed for third-party or general-purpose AI dependency"));
        assertTrue(assessment.getDocumentationGaps().contains("Collect provider documentation for third-party or general-purpose AI dependency"));
    }

    private AiSystemInventory.AiSystemInventoryBuilder baseSystem(String id) {
        return AiSystemInventory.builder()
                .id(id)
                .userId("user-1")
                .systemName("AI System " + id)
                .useCase("Support workflow")
                .euUsersAffected(true)
                .humanOversight(true)
                .transparencyNoticePublished(false)
                .technicalDocumentationReady(false)
                .logsEvidenceRetained(false)
                .monitoringEnabled(false)
                .dataCategoriesSentToAi(List.of("support context"));
    }

    private AiActAssessmentResponse assess(AiSystemInventory system) {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById(system.getId())).thenReturn(Optional.of(system));
        when(assessmentRepository.save(any(AiActAssessment.class))).thenAnswer(invocation -> invocation.getArgument(0));
        return service.assess(userDetails, system.getId());
    }
}
