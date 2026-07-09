package com.zenvyra.controller;

import com.zenvyra.dto.request.CreateEvidenceItemRequest;
import com.zenvyra.dto.request.UpdateEvidenceItemRequest;
import com.zenvyra.dto.request.UpdateEvidenceStatusRequest;
import com.zenvyra.dto.response.EvidenceItemResponse;
import com.zenvyra.model.CounselReviewStatus;
import com.zenvyra.model.EvidenceItemStatus;
import com.zenvyra.model.EvidenceItemType;
import com.zenvyra.security.JwtAuthenticationFilter;
import com.zenvyra.security.RedisRateLimiter;
import com.zenvyra.service.ApiKeyManagementService;
import com.zenvyra.service.EvidenceItemService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AiActEvidenceController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@MockBean(ApiKeyManagementService.class)
@MockBean(JwtAuthenticationFilter.class)
@MockBean(RedisRateLimiter.class)
class AiActEvidenceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EvidenceItemService service;

    @Test
    @WithMockUser(username = "owner@example.com", roles = "USER")
    void createEvidenceReturns201() throws Exception {
        when(service.create(any(), any(CreateEvidenceItemRequest.class))).thenReturn(
                EvidenceItemResponse.builder()
                        .id("evidence-1")
                        .systemId("system-1")
                        .title("Privacy policy")
                        .type(EvidenceItemType.POLICY)
                        .status(EvidenceItemStatus.MISSING)
                        .counselReviewStatus(CounselReviewStatus.NOT_REQUIRED)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build()
        );

        mockMvc.perform(post("/api/ai-act/evidence")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"systemId\":\"system-1\",\"type\":\"POLICY\",\"title\":\"Privacy policy\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("evidence-1"))
                .andExpect(jsonPath("$.title").value("Privacy policy"))
                .andExpect(jsonPath("$.type").value("POLICY"))
                .andExpect(jsonPath("$.status").value("MISSING"));
    }

    @Test
    @WithMockUser(username = "owner@example.com", roles = "USER")
    void createEvidenceRejectsMissingRequiredFields() throws Exception {
        mockMvc.perform(post("/api/ai-act/evidence")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"systemId\":\"system-1\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "owner@example.com", roles = "USER")
    void listBySystemReturnsTypedResponse() throws Exception {
        when(service.findBySystem(any(), eq("system-1"))).thenReturn(List.of(
                EvidenceItemResponse.builder()
                        .id("evidence-1")
                        .systemId("system-1")
                        .title("Privacy policy")
                        .status(EvidenceItemStatus.MISSING)
                        .type(EvidenceItemType.POLICY)
                        .build(),
                EvidenceItemResponse.builder()
                        .id("evidence-2")
                        .systemId("system-1")
                        .title("Model card")
                        .status(EvidenceItemStatus.UPLOADED)
                        .type(EvidenceItemType.MODEL_CARD)
                        .build()
        ));

        mockMvc.perform(get("/api/ai-act/evidence/system/system-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("evidence-1"))
                .andExpect(jsonPath("$[1].id").value("evidence-2"))
                .andExpect(jsonPath("$[1].status").value("UPLOADED"));
    }

    @Test
    @WithMockUser(username = "owner@example.com", roles = "USER")
    void getEvidenceReturnsTypedResponse() throws Exception {
        when(service.findById(any(), eq("evidence-1"))).thenReturn(
                EvidenceItemResponse.builder()
                        .id("evidence-1")
                        .systemId("system-1")
                        .title("Privacy policy")
                        .status(EvidenceItemStatus.REVIEWED)
                        .type(EvidenceItemType.POLICY)
                        .counselReviewStatus(CounselReviewStatus.PENDING)
                        .build()
        );

        mockMvc.perform(get("/api/ai-act/evidence/evidence-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("evidence-1"))
                .andExpect(jsonPath("$.status").value("REVIEWED"));
    }

    @Test
    @WithMockUser(username = "owner@example.com", roles = "USER")
    void updateEvidenceReturnsTypedResponse() throws Exception {
        when(service.update(any(), eq("evidence-1"), any(UpdateEvidenceItemRequest.class))).thenReturn(
                EvidenceItemResponse.builder()
                        .id("evidence-1")
                        .title("Updated")
                        .status(EvidenceItemStatus.MISSING)
                        .type(EvidenceItemType.POLICY)
                        .owner("Compliance lead")
                        .counselReviewStatus(CounselReviewStatus.PENDING)
                        .build()
        );

        mockMvc.perform(put("/api/ai-act/evidence/evidence-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Updated\",\"owner\":\"Compliance lead\",\"counselReviewStatus\":\"PENDING\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated"))
                .andExpect(jsonPath("$.owner").value("Compliance lead"));
    }

    @Test
    @WithMockUser(username = "owner@example.com", roles = "USER")
    void updateStatusReturnsTypedResponse() throws Exception {
        when(service.updateStatus(any(), eq("evidence-1"), any(UpdateEvidenceStatusRequest.class))).thenReturn(
                EvidenceItemResponse.builder()
                        .id("evidence-1")
                        .status(EvidenceItemStatus.APPROVED)
                        .counselReviewStatus(CounselReviewStatus.APPROVED)
                        .approvedAt(LocalDateTime.now())
                        .build()
        );

        mockMvc.perform(put("/api/ai-act/evidence/evidence-1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"APPROVED\",\"reviewerNotes\":\"OK\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"))
                .andExpect(jsonPath("$.counselReviewStatus").value("APPROVED"));
    }

    @Test
    @WithMockUser(username = "owner@example.com", roles = "USER")
    void updateStatusRejectsMissingStatus() throws Exception {
        mockMvc.perform(put("/api/ai-act/evidence/evidence-1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"reviewerNotes\":\"OK\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "owner@example.com", roles = "USER")
    void deleteEvidenceReturns204() throws Exception {
        mockMvc.perform(delete("/api/ai-act/evidence/evidence-1"))
                .andExpect(status().isNoContent());
        verify(service, times(1)).delete(any(), eq("evidence-1"));
    }
}
