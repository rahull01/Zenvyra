package com.zenvyra.controller;

import com.zenvyra.dto.request.AiSystemInventoryRequest;
import com.zenvyra.dto.response.AiActAssessmentResponse;
import com.zenvyra.dto.response.AiActReadinessResponse;
import com.zenvyra.dto.response.AiSystemInventoryResponse;
import com.zenvyra.service.AiActReadinessService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AiActControllerTest {

    private final AiActReadinessService service = mock(AiActReadinessService.class);
    private final AiActController controller = new AiActController(service);
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        userDetails = User.withUsername("owner@example.com")
                .password("password")
                .roles("USER")
                .build();
    }

    @Test
    void createSystemReturnsTypedResponse() {
        AiSystemInventoryRequest request = AiSystemInventoryRequest.builder()
                .systemName("Support Assistant")
                .purpose("Support")
                .build();

        when(service.create(any(UserDetails.class), any(AiSystemInventoryRequest.class)))
                .thenReturn(AiSystemInventoryResponse.builder()
                        .id("system-1")
                        .systemName("Support Assistant")
                        .purpose("Support")
                        .riskCategory("minimal risk")
                        .build());

        AiSystemInventoryResponse response = controller.create(userDetails, request);

        assertEquals("system-1", response.getId());
        assertEquals("Support Assistant", response.getSystemName());
        assertEquals("minimal risk", response.getRiskCategory());
    }

    @Test
    void assessSystemReturnsTypedResponse() {
        when(service.assess(any(UserDetails.class), eq("system-1")))
                .thenReturn(AiActAssessmentResponse.builder()
                        .id("assessment-1")
                        .systemId("system-1")
                        .systemName("Support Assistant")
                        .riskCategory("high-risk indicator")
                        .readinessScore(50)
                        .assessedAt(LocalDateTime.now())
                        .build());

        AiActAssessmentResponse response = controller.assess(userDetails, "system-1");

        assertEquals("assessment-1", response.getId());
        assertEquals("high-risk indicator", response.getRiskCategory());
        assertEquals(50, response.getReadinessScore());
    }

    @Test
    void readinessReturnsTypedResponse() {
        when(service.readiness(any(UserDetails.class)))
                .thenReturn(AiActReadinessResponse.builder()
                        .aiSystemsInventoried(2)
                        .assessmentsCompleted(1)
                        .highRiskFlags(1L)
                        .disclaimer("not legal advice")
                        .draftOutputs(Map.of("systemCount", 2))
                        .latestAssessments(List.of(Map.of("id", "assessment-1")))
                        .build());

        AiActReadinessResponse response = controller.readiness(userDetails);

        assertEquals(2, response.getAiSystemsInventoried());
        assertEquals(1L, response.getHighRiskFlags());
        assertNotNull(response.getLatestAssessments());
    }
}
