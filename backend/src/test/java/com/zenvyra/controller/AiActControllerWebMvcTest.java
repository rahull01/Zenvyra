package com.zenvyra.controller;

import com.zenvyra.model.AiActAssessment;
import com.zenvyra.model.AiSystemInventory;
import com.zenvyra.security.AuthCookieService;
import com.zenvyra.security.JwtTokenProvider;
import com.zenvyra.security.RedisRateLimiter;
import com.zenvyra.service.AiActReadinessService;
import com.zenvyra.service.ApiKeyManagementService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AiActController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class AiActControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AiActReadinessService aiActReadinessService;
    @MockBean
    private ApiKeyManagementService apiKeyManagementService;
    @MockBean
    private JwtTokenProvider jwtTokenProvider;
    @MockBean
    private AuthCookieService authCookieService;
    @MockBean
    private UserDetailsService userDetailsService;
    @MockBean
    private RedisRateLimiter redisRateLimiter;

    @Test
    void createSystemRejectsMissingSystemName() throws Exception {
        mockMvc.perform(post("/ai-act/systems")
                        .with(user("owner@example.com"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "provider": "OpenAI",
                                  "userFacingAiInteraction": true
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.systemName").value("System name is required"));
    }

    @Test
    void createSystemReturnsTypedInventoryResponse() throws Exception {
        AiSystemInventory saved = AiSystemInventory.builder()
                .id("system-1")
                .systemName("Support Assistant")
                .provider("OpenAI")
                .userFacingAiInteraction(true)
                .build();

        when(aiActReadinessService.create(any(), any())).thenReturn(saved);

        mockMvc.perform(post("/ai-act/systems")
                        .with(user("owner@example.com"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "systemName": "Support Assistant",
                                  "provider": "OpenAI",
                                  "userFacingAiInteraction": true
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("system-1"))
                .andExpect(jsonPath("$.systemName").value("Support Assistant"))
                .andExpect(jsonPath("$.provider").value("OpenAI"))
                .andExpect(jsonPath("$.userFacingAiInteraction").value(true));

        verify(aiActReadinessService).create(any(), any());
    }

    @Test
    void readinessReturnsTypedSummaryResponse() throws Exception {
        AiActAssessment assessment = AiActAssessment.builder()
                .id("assessment-1")
                .systemId("system-1")
                .riskCategory("limited-risk transparency")
                .readinessScore(67)
                .build();

        when(aiActReadinessService.readiness(any())).thenReturn(Map.of(
                "aiSystemsInventoried", 1,
                "highRiskFlags", 0L,
                "missingTransparencyNotices", 1L,
                "humanOversightGaps", 0L,
                "gpaiProviderDocumentationStatus", "in_progress",
                "publicAiDisclosureReadiness", "draft_needed",
                "draftOutputs", Map.of("aiUsageDisclosureDraft", "We use Support Assistant."),
                "latestAssessments", List.of(assessment),
                "disclaimer", "not legal advice"
        ));

        mockMvc.perform(get("/ai-act/readiness")
                        .with(user("owner@example.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.aiSystemsInventoried").value(1))
                .andExpect(jsonPath("$.publicAiDisclosureReadiness").value("draft_needed"))
                .andExpect(jsonPath("$.latestAssessments[0].id").value("assessment-1"))
                .andExpect(jsonPath("$.draftOutputs.aiUsageDisclosureDraft").value("We use Support Assistant."));
    }

    @Test
    void assessReturnsTypedAssessmentResponse() throws Exception {
        AiActAssessment assessment = AiActAssessment.builder()
                .id("assessment-1")
                .systemId("system-1")
                .riskCategory("high-risk indicator")
                .readinessScore(50)
                .nextActions(List.of("Publish or update the AI interaction notice"))
                .build();

        when(aiActReadinessService.assess(any(), eq("system-1"))).thenReturn(assessment);

        mockMvc.perform(post("/ai-act/systems/system-1/assess")
                        .with(user("owner@example.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("assessment-1"))
                .andExpect(jsonPath("$.systemId").value("system-1"))
                .andExpect(jsonPath("$.riskCategory").value("high-risk indicator"))
                .andExpect(jsonPath("$.nextActions[0]").value("Publish or update the AI interaction notice"));
    }
}
