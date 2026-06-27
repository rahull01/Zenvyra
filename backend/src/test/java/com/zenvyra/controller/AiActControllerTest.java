package com.zenvyra.controller;

import com.zenvyra.dto.request.AiSystemInventoryRequest;
import com.zenvyra.dto.response.AiActAssessmentResponse;
import com.zenvyra.dto.response.AiActReadinessResponse;
import com.zenvyra.dto.response.AiSystemInventoryResponse;
import com.zenvyra.model.AiActAssessment;
import com.zenvyra.model.AiSystemInventory;
import com.zenvyra.service.AiActReadinessService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiActControllerTest {

    @Mock
    private AiActReadinessService service;

    private AiActController controller;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        controller = new AiActController(service);
        userDetails = org.springframework.security.core.userdetails.User
                .withUsername("owner@example.com")
                .password("password")
                .roles("USER")
                .build();
    }

    @Test
    void createsSystemThroughTypedRequestAndResponse() {
        AiSystemInventoryRequest request = new AiSystemInventoryRequest();
        request.setSystemName("Support Assistant");
        request.setProvider("OpenAI");
        request.setUserFacingAiInteraction(true);

        AiSystemInventory saved = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .organizationId("owner@example.com")
                .systemName("Support Assistant")
                .provider("OpenAI")
                .userFacingAiInteraction(true)
                .createdAt(LocalDateTime.now())
                .build();

        when(service.create(userDetails, request)).thenReturn(saved);

        AiSystemInventoryResponse response = controller.create(userDetails, request);

        assertEquals("system-1", response.getId());
        assertEquals("Support Assistant", response.getSystemName());
        assertEquals("OpenAI", response.getProvider());
        assertEquals(true, response.getUserFacingAiInteraction());
    }

    @Test
    void readinessMapsLatestAssessmentsToTypedResponse() {
        AiActAssessment assessment = AiActAssessment.builder()
                .id("assessment-1")
                .systemId("system-1")
                .riskCategory("high-risk indicator")
                .readinessScore(50)
                .requiredTransparencyNotices(List.of("User-facing AI interaction notice"))
                .assessedAt(LocalDateTime.now())
                .build();

        when(service.readiness(userDetails)).thenReturn(Map.of(
                "aiSystemsInventoried", 1,
                "highRiskFlags", 1L,
                "missingTransparencyNotices", 1L,
                "humanOversightGaps", 0L,
                "gpaiProviderDocumentationStatus", "in_progress",
                "publicAiDisclosureReadiness", "draft_needed",
                "draftOutputs", Map.of("aiUsageDisclosureDraft", "We use Support Assistant."),
                "latestAssessments", List.of(assessment),
                "disclaimer", "not legal advice"
        ));

        AiActReadinessResponse response = controller.readiness(userDetails);

        assertEquals(1, response.getAiSystemsInventoried());
        assertEquals(1L, response.getHighRiskFlags());
        assertEquals("draft_needed", response.getPublicAiDisclosureReadiness());
        assertFalse(response.getLatestAssessments().isEmpty());
        assertEquals("assessment-1", response.getLatestAssessments().get(0).getId());
        assertEquals("We use Support Assistant.", response.getDraftOutputs().get("aiUsageDisclosureDraft"));
    }

    @Test
    void assessMapsDomainAssessmentToTypedResponse() {
        AiActAssessment assessment = AiActAssessment.builder()
                .id("assessment-1")
                .systemId("system-1")
                .riskCategory("limited-risk transparency")
                .confidence(0.82)
                .readinessScore(67)
                .riskSignals(List.of("Automated decision-making affects users"))
                .nextActions(List.of("Publish or update the AI interaction notice"))
                .build();

        when(service.assess(userDetails, "system-1")).thenReturn(assessment);

        AiActAssessmentResponse response = controller.assess(userDetails, "system-1");

        assertEquals("assessment-1", response.getId());
        assertEquals("system-1", response.getSystemId());
        assertEquals("limited-risk transparency", response.getRiskCategory());
        assertEquals(67, response.getReadinessScore());
    }
}
