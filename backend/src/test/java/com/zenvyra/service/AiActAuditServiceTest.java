package com.zenvyra.service;

import com.zenvyra.dto.response.AiActAuditLogResponse;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.AiActAssessment;
import com.zenvyra.model.AiActAuditEventType;
import com.zenvyra.model.AiActAuditLog;
import com.zenvyra.model.AiSystemInventory;
import com.zenvyra.model.CounselReviewStatus;
import com.zenvyra.model.EvidenceItem;
import com.zenvyra.model.EvidenceItemStatus;
import com.zenvyra.model.EvidenceItemType;
import com.zenvyra.model.User;
import com.zenvyra.repository.AiActAuditLogRepository;
import com.zenvyra.repository.AiSystemInventoryRepository;
import com.zenvyra.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiActAuditServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private AiSystemInventoryRepository systemRepository;
    @Mock
    private AiActAuditLogRepository auditLogRepository;

    private AiActAuditService service;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        service = new AiActAuditService(userRepository, systemRepository, auditLogRepository);
        userDetails = org.springframework.security.core.userdetails.User
                .withUsername("owner@example.com")
                .password("password")
                .roles("USER")
                .build();
    }

    @Test
    void logSystemCreatedPersistsEventWithSystemMetadata() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .organizationId("org-1")
                .systemName("Support Assistant")
                .purpose("Customer support")
                .provider("OpenAI")
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(auditLogRepository.save(any(AiActAuditLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.logSystemCreated(userDetails, system);

        ArgumentCaptor<AiActAuditLog> captor = ArgumentCaptor.forClass(AiActAuditLog.class);
        verify(auditLogRepository, times(1)).save(captor.capture());
        AiActAuditLog saved = captor.getValue();
        assertEquals("user-1", saved.getUserId());
        assertEquals("org-1", saved.getOrganizationId());
        assertEquals("system-1", saved.getSystemId());
        assertEquals(AiActAuditEventType.SYSTEM_CREATED, saved.getEventType());
        assertEquals("owner@example.com", saved.getActor());
        assertNotNull(saved.getTimestamp());
        Map<String, Object> data = saved.getEventData();
        assertEquals("Support Assistant", data.get("systemName"));
        assertEquals("OpenAI", data.get("provider"));
    }

    @Test
    void logSystemUpdatedUsesSystemUpdatedEventType() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-1").organizationId("org-1").systemName("X").build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(auditLogRepository.save(any(AiActAuditLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.logSystemUpdated(userDetails, system);

        ArgumentCaptor<AiActAuditLog> captor = ArgumentCaptor.forClass(AiActAuditLog.class);
        verify(auditLogRepository).save(captor.capture());
        assertEquals(AiActAuditEventType.SYSTEM_UPDATED, captor.getValue().getEventType());
    }

    @Test
    void logSystemDeletedPersistsEvent() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-1").organizationId("org-1").systemName("X").build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(auditLogRepository.save(any(AiActAuditLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.logSystemDeleted(userDetails, system);

        ArgumentCaptor<AiActAuditLog> captor = ArgumentCaptor.forClass(AiActAuditLog.class);
        verify(auditLogRepository).save(captor.capture());
        AiActAuditLog saved = captor.getValue();
        assertEquals(AiActAuditEventType.SYSTEM_DELETED, saved.getEventType());
        assertEquals("X", saved.getEventData().get("systemName"));
    }

    @Test
    void logAssessmentCreatedVerifiesOwnershipAndStoresAssessmentId() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-1").organizationId("org-1").systemName("X").build();
        AiActAssessment assessment = AiActAssessment.builder()
                .id("assessment-1").userId("user-1").systemId("system-1")
                .riskCategory("HIGH").readinessScore(72).confidence(0.9).build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(auditLogRepository.save(any(AiActAuditLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.logAssessmentCreated(userDetails, assessment);

        ArgumentCaptor<AiActAuditLog> captor = ArgumentCaptor.forClass(AiActAuditLog.class);
        verify(auditLogRepository).save(captor.capture());
        AiActAuditLog saved = captor.getValue();
        assertEquals(AiActAuditEventType.ASSESSMENT_CREATED, saved.getEventType());
        assertEquals("assessment-1", saved.getAssessmentId());
        assertEquals("HIGH", saved.getEventData().get("riskCategory"));
        assertEquals(72, saved.getEventData().get("readinessScore"));
    }

    @Test
    void logAssessmentCreatedRejectsForeignSystem() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-2").systemName("X").build();
        AiActAssessment assessment = AiActAssessment.builder()
                .id("assessment-1").userId("user-2").systemId("system-1").build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));

        assertThrows(ApiException.class, () -> service.logAssessmentCreated(userDetails, assessment));
        verify(auditLogRepository, never()).save(any());
    }

    @Test
    void logEvidenceItemCreatedStoresRelevantFields() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-1").organizationId("org-1").systemName("X").build();
        EvidenceItem item = EvidenceItem.builder()
                .id("evidence-1").userId("user-1").systemId("system-1")
                .title("Privacy policy").type(EvidenceItemType.POLICY)
                .status(EvidenceItemStatus.MISSING)
                .obligationId("DOCUMENTATION")
                .counselReviewStatus(CounselReviewStatus.NOT_REQUIRED)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(auditLogRepository.save(any(AiActAuditLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.logEvidenceItemCreated(userDetails, item);

        ArgumentCaptor<AiActAuditLog> captor = ArgumentCaptor.forClass(AiActAuditLog.class);
        verify(auditLogRepository).save(captor.capture());
        AiActAuditLog saved = captor.getValue();
        assertEquals(AiActAuditEventType.EVIDENCE_ITEM_CREATED, saved.getEventType());
        assertEquals("evidence-1", saved.getEventData().get("evidenceId"));
        assertEquals("DOCUMENTATION", saved.getEventData().get("obligationId"));
        assertEquals(EvidenceItemType.POLICY, saved.getEventData().get("type"));
    }

    @Test
    void logEvidenceItemStatusChangedIncludesPreviousAndNewStatus() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-1").organizationId("org-1").systemName("X").build();
        EvidenceItem item = EvidenceItem.builder()
                .id("evidence-1").userId("user-1").systemId("system-1")
                .title("Privacy policy").type(EvidenceItemType.POLICY)
                .status(EvidenceItemStatus.APPROVED)
                .counselReviewStatus(CounselReviewStatus.APPROVED)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(auditLogRepository.save(any(AiActAuditLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.logEvidenceItemStatusChanged(userDetails, item, EvidenceItemStatus.UPLOADED);

        ArgumentCaptor<AiActAuditLog> captor = ArgumentCaptor.forClass(AiActAuditLog.class);
        verify(auditLogRepository).save(captor.capture());
        AiActAuditLog saved = captor.getValue();
        assertEquals(AiActAuditEventType.EVIDENCE_ITEM_STATUS_CHANGED, saved.getEventType());
        assertEquals(EvidenceItemStatus.UPLOADED, saved.getEventData().get("previousStatus"));
        assertEquals(EvidenceItemStatus.APPROVED, saved.getEventData().get("newStatus"));
        assertEquals(CounselReviewStatus.APPROVED, saved.getEventData().get("counselReviewStatus"));
    }

    @Test
    void findBySystemReturnsConvertedResponses() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-1").organizationId("org-1").systemName("X").build();
        AiActAuditLog log1 = AiActAuditLog.builder()
                .id("log-1").userId("user-1").organizationId("org-1").systemId("system-1")
                .eventType(AiActAuditEventType.SYSTEM_CREATED)
                .actor("owner@example.com")
                .eventData(Map.of("systemName", "X"))
                .timestamp(LocalDateTime.of(2026, 1, 1, 12, 0))
                .build();
        AiActAuditLog log2 = AiActAuditLog.builder()
                .id("log-2").userId("user-1").organizationId("org-1").systemId("system-1")
                .eventType(AiActAuditEventType.ASSESSMENT_CREATED)
                .actor("owner@example.com")
                .eventData(Map.of("riskCategory", "HIGH"))
                .timestamp(LocalDateTime.of(2026, 1, 2, 9, 30))
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(auditLogRepository.findBySystemIdAndOrganizationId("system-1", "org-1"))
                .thenReturn(List.of(log1, log2));

        List<AiActAuditLogResponse> responses = service.findBySystem(userDetails, "system-1");

        assertEquals(2, responses.size());
        assertEquals("log-1", responses.get(0).getId());
        assertEquals(AiActAuditEventType.SYSTEM_CREATED, responses.get(0).getEventType());
        assertEquals("HIGH", responses.get(1).getEventData().get("riskCategory"));
    }

    @Test
    void findBySystemRejectsOtherUsersSystem() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-2").systemName("Other").build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));

        assertThrows(ApiException.class, () -> service.findBySystem(userDetails, "system-1"));
        verify(auditLogRepository, never()).findBySystemIdAndOrganizationId(any(), any());
    }

    @Test
    void exportBySystemReturnsLogsSortedChronologically() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-1").organizationId("org-1").systemName("X").build();
        AiActAuditLog newer = AiActAuditLog.builder()
                .id("log-new").systemId("system-1").organizationId("org-1").userId("user-1")
                .eventType(AiActAuditEventType.ASSESSMENT_CREATED)
                .timestamp(LocalDateTime.of(2026, 5, 1, 10, 0))
                .build();
        AiActAuditLog older = AiActAuditLog.builder()
                .id("log-old").systemId("system-1").organizationId("org-1").userId("user-1")
                .eventType(AiActAuditEventType.SYSTEM_CREATED)
                .timestamp(LocalDateTime.of(2026, 1, 1, 9, 0))
                .build();
        AiActAuditLog nullTs = AiActAuditLog.builder()
                .id("log-null").systemId("system-1").organizationId("org-1").userId("user-1")
                .eventType(AiActAuditEventType.SYSTEM_UPDATED)
                .timestamp(null)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(auditLogRepository.findBySystemIdAndOrganizationId("system-1", "org-1"))
                .thenReturn(List.of(newer, nullTs, older));

        List<AiActAuditLogResponse> responses = service.exportBySystem(userDetails, "system-1");

        assertEquals(3, responses.size());
        assertEquals("log-old", responses.get(0).getId());
        assertEquals("log-new", responses.get(1).getId());
        assertEquals("log-null", responses.get(2).getId());
    }

    @Test
    void logRejectsNullSystem() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));

        assertThrows(ApiException.class, () -> service.logSystemCreated(userDetails, null));
        verify(auditLogRepository, never()).save(any());
    }

    @Test
    void logAssessmentCreatedRejectsMissingSystemId() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiActAssessment assessment = AiActAssessment.builder().id("assessment-1").build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));

        assertThrows(ApiException.class, () -> service.logAssessmentCreated(userDetails, assessment));
        verify(auditLogRepository, never()).save(any());
    }

    @Test
    void logEvidenceItemCreatedRejectsForeignSystem() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-2").systemName("Other").build();
        EvidenceItem item = EvidenceItem.builder()
                .id("evidence-1").userId("user-1").systemId("system-1")
                .title("X").type(EvidenceItemType.POLICY).status(EvidenceItemStatus.MISSING)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));

        assertThrows(ApiException.class, () -> service.logEvidenceItemCreated(userDetails, item));
        verify(auditLogRepository, never()).save(any());
    }

    @Test
    void findBySystemRequiresSystemId() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));

        assertThrows(ApiException.class, () -> service.findBySystem(userDetails, " "));
    }

    @Test
    void logEvidenceItemCreatedFallsBackToUserIdWhenOrganizationMissing() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-1").systemName("X").build();
        EvidenceItem item = EvidenceItem.builder()
                .id("evidence-1").userId("user-1").systemId("system-1")
                .title("X").type(EvidenceItemType.POLICY).status(EvidenceItemStatus.MISSING).build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(auditLogRepository.save(any(AiActAuditLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.logEvidenceItemCreated(userDetails, item);

        ArgumentCaptor<AiActAuditLog> captor = ArgumentCaptor.forClass(AiActAuditLog.class);
        verify(auditLogRepository).save(captor.capture());
        assertEquals("user-1", captor.getValue().getOrganizationId());
        assertTrue(captor.getValue().getTimestamp() != null);
    }
}
