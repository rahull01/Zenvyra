package com.zenvyra.controller;

import com.zenvyra.dto.request.AiSystemInventoryRequest;
import com.zenvyra.dto.response.AiActAssessmentResponse;
import com.zenvyra.dto.response.AiActReadinessResponse;
import com.zenvyra.dto.response.AiSystemInventoryResponse;
import com.zenvyra.security.JwtAuthenticationFilter;
import com.zenvyra.security.RedisRateLimiter;
import com.zenvyra.service.AiActReadinessService;
import com.zenvyra.service.ApiKeyManagementService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AiActController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@MockBean(ApiKeyManagementService.class)
@MockBean(JwtAuthenticationFilter.class)
@MockBean(RedisRateLimiter.class)
class AiActControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AiActReadinessService service;

    @Test
    @WithMockUser(username = "owner@example.com", roles = "USER")
    void createSystemReturnsTypedResponse() throws Exception {
        when(service.create(any(), any(AiSystemInventoryRequest.class))).thenReturn(
                AiSystemInventoryResponse.builder()
                        .id("system-1")
                        .systemName("Support Assistant")
                        .purpose("Support")
                        .riskCategory("minimal risk")
                        .build()
        );

        mockMvc.perform(post("/ai-act/systems")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"systemName\":\"Support Assistant\",\"purpose\":\"Support\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("system-1"))
                .andExpect(jsonPath("$.systemName").value("Support Assistant"));
    }

    @Test
    @WithMockUser(username = "owner@example.com", roles = "USER")
    void createSystemRejectsMissingSystemName() throws Exception {
        mockMvc.perform(post("/ai-act/systems")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"purpose\":\"Support\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "owner@example.com", roles = "USER")
    void systemsReturnsTypedResponse() throws Exception {
        when(service.systems(any())).thenReturn(List.of(
                AiSystemInventoryResponse.builder().id("system-1").systemName("Support Assistant").build()
        ));

        mockMvc.perform(get("/ai-act/systems"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("system-1"));
    }

    @Test
    @WithMockUser(username = "owner@example.com", roles = "USER")
    void updateSystemReturnsTypedResponse() throws Exception {
        when(service.update(any(), eq("system-1"), any(AiSystemInventoryRequest.class))).thenReturn(
                AiSystemInventoryResponse.builder()
                        .id("system-1")
                        .systemName("Updated Assistant")
                        .purpose("Support")
                        .build()
        );

        mockMvc.perform(put("/ai-act/systems/system-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"systemName\":\"Updated Assistant\",\"purpose\":\"Support\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.systemName").value("Updated Assistant"));
    }

    @Test
    @WithMockUser(username = "owner@example.com", roles = "USER")
    void assessReturnsTypedResponse() throws Exception {
        when(service.assess(any(), eq("system-1"))).thenReturn(
                AiActAssessmentResponse.builder()
                        .id("assessment-1")
                        .systemId("system-1")
                        .systemName("Support Assistant")
                        .riskCategory("minimal risk")
                        .readinessScore(75)
                        .build()
        );

        mockMvc.perform(post("/ai-act/systems/system-1/assess"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("assessment-1"))
                .andExpect(jsonPath("$.readinessScore").value(75));
    }

    @Test
    @WithMockUser(username = "owner@example.com", roles = "USER")
    void readinessReturnsTypedResponse() throws Exception {
        when(service.readiness(any())).thenReturn(
                AiActReadinessResponse.builder()
                        .aiSystemsInventoried(2)
                        .assessmentsCompleted(1)
                        .highRiskFlags(0L)
                        .build()
        );

        mockMvc.perform(get("/ai-act/readiness"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.aiSystemsInventoried").value(2));
    }
}
