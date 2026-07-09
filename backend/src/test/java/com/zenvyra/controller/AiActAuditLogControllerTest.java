package com.zenvyra.controller;

import com.zenvyra.dto.response.AiActAuditLogResponse;
import com.zenvyra.model.AiActAuditEventType;
import com.zenvyra.security.JwtAuthenticationFilter;
import com.zenvyra.security.RedisRateLimiter;
import com.zenvyra.service.AiActAuditService;
import com.zenvyra.service.ApiKeyManagementService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AiActAuditLogController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@MockBean(ApiKeyManagementService.class)
@MockBean(JwtAuthenticationFilter.class)
@MockBean(RedisRateLimiter.class)
class AiActAuditLogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AiActAuditService service;

    @Test
    @WithMockUser(username = "owner@example.com", roles = "USER")
    void listBySystemReturnsAuditLogs() throws Exception {
        when(service.findBySystem(any(), eq("system-1"))).thenReturn(List.of(
                AiActAuditLogResponse.builder()
                        .id("log-1")
                        .systemId("system-1")
                        .userId("user-1")
                        .organizationId("org-1")
                        .eventType(AiActAuditEventType.SYSTEM_CREATED)
                        .actor("owner@example.com")
                        .eventData(Map.of("systemName", "Support Assistant"))
                        .timestamp(LocalDateTime.of(2026, 1, 1, 12, 0))
                        .build(),
                AiActAuditLogResponse.builder()
                        .id("log-2")
                        .systemId("system-1")
                        .userId("user-1")
                        .organizationId("org-1")
                        .eventType(AiActAuditEventType.ASSESSMENT_CREATED)
                        .actor("owner@example.com")
                        .eventData(Map.of("riskCategory", "HIGH"))
                        .timestamp(LocalDateTime.of(2026, 1, 2, 9, 30))
                        .build()
        ));

        mockMvc.perform(get("/api/ai-act/audit/system/system-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("log-1"))
                .andExpect(jsonPath("$[0].eventType").value("SYSTEM_CREATED"))
                .andExpect(jsonPath("$[0].actor").value("owner@example.com"))
                .andExpect(jsonPath("$[1].id").value("log-2"))
                .andExpect(jsonPath("$[1].eventType").value("ASSESSMENT_CREATED"));
    }

    @Test
    @WithMockUser(username = "owner@example.com", roles = "USER")
    void exportBySystemReturnsAuditLogs() throws Exception {
        when(service.exportBySystem(any(), eq("system-1"))).thenReturn(List.of(
                AiActAuditLogResponse.builder()
                        .id("log-1")
                        .systemId("system-1")
                        .eventType(AiActAuditEventType.EVIDENCE_ITEM_CREATED)
                        .actor("owner@example.com")
                        .timestamp(LocalDateTime.of(2026, 3, 1, 10, 0))
                        .build()
        ));

        mockMvc.perform(get("/api/ai-act/audit/system/system-1/export"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("log-1"))
                .andExpect(jsonPath("$[0].eventType").value("EVIDENCE_ITEM_CREATED"));

        verify(service, times(1)).exportBySystem(any(), eq("system-1"));
    }

    @Test
    @WithMockUser(username = "owner@example.com", roles = "USER")
    void listBySystemReturnsEmptyArrayWhenNoLogs() throws Exception {
        when(service.findBySystem(any(), eq("system-1"))).thenReturn(List.of());

        mockMvc.perform(get("/api/ai-act/audit/system/system-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }
}
