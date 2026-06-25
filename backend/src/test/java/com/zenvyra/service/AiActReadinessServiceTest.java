package com.zenvyra.service;

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

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(assessmentRepository.save(any(AiActAssessment.class))).thenAnswer(invocation -> {
            AiActAssessment assessment = invocation.getArgument(0);
            assessment.setId("assessment-1");
            return assessment;
        });

        AiActAssessment assessment = service.assess(userDetails, "system-1");

        assertEquals("high-risk indicator", assessment.getRiskCategory());
        assertTrue(assessment.getRequiredTransparencyNotices().contains("User-facing AI interaction notice"));
        assertTrue(assessment.getHumanOversightGaps().contains("Document human review and escalation workflow"));
        assertNotNull(assessment.getAssessedAt());

        when(systemRepository.findByUserId("user-1")).thenReturn(List.of(system));
        when(assessmentRepository.findByUserId("user-1")).thenReturn(List.of(assessment));

        Map<String, Object> readiness = service.readiness(userDetails);

        assertEquals(1, readiness.get("aiSystemsInventoried"));
        assertEquals(1L, readiness.get("highRiskFlags"));
        assertTrue(String.valueOf(readiness.get("disclaimer")).contains("not legal advice"));
        assertTrue(String.valueOf(readiness.get("draftOutputs")).contains("Support Assistant"));
        assertTrue(String.valueOf(readiness.get("latestAssessments")).contains("assessment-1"));
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
}
