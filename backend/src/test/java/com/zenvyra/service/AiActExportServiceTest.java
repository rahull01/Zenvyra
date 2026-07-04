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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiActExportServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private AiSystemInventoryRepository systemRepository;
    @Mock
    private AiActAssessmentRepository assessmentRepository;

    private AiActExportService exportService;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        exportService = new AiActExportService(userRepository, systemRepository, assessmentRepository);
        userDetails = org.springframework.security.core.userdetails.User
                .withUsername("owner@example.com")
                .password("password")
                .roles("USER")
                .build();
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
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));

        String result = exportService.exportTransparencyNotice(userDetails, "system-1");

        assertTrue(result.contains("Support Assistant"));
        assertTrue(result.contains("AI Transparency Notice"));
        assertTrue(result.contains("You may interact directly with AI-generated content"));
    }

    @Test
    void exportsEvidenceChecklistWithStatuses() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .systemName("Support Assistant")
                .technicalDocumentationReady(true)
                .logsEvidenceRetained(false)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));

        String result = exportService.exportEvidenceChecklist(userDetails, "system-1");

        assertTrue(result.contains("AI Act Evidence Checklist"));
        assertTrue(result.contains("✅ Complete"));
        assertTrue(result.contains("⬜ Incomplete"));
    }

    @Test
    void exportsAssessmentSummaryWithRiskCategory() {
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
                .riskSignals(List.of("EU users affected"))
                .evidenceItems(List.of("Technical documentation"))
                .nextActions(List.of("Complete risk assessment"))
                .counselReviewWarning("not legal advice")
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(assessmentRepository.findById("assessment-1")).thenReturn(Optional.of(assessment));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));

        String result = exportService.exportAssessmentSummary(userDetails, "assessment-1");

        assertTrue(result.contains("high-risk indicator"));
        assertTrue(result.contains("65/100"));
        assertTrue(result.contains("not legal advice"));
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
}
