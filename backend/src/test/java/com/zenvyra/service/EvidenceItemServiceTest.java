package com.zenvyra.service;

import com.zenvyra.dto.request.CreateEvidenceItemRequest;
import com.zenvyra.dto.request.UpdateEvidenceItemRequest;
import com.zenvyra.dto.request.UpdateEvidenceStatusRequest;
import com.zenvyra.dto.response.EvidenceItemResponse;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.AiActAssessment;
import com.zenvyra.model.AiSystemInventory;
import com.zenvyra.model.CounselReviewStatus;
import com.zenvyra.model.EvidenceItem;
import com.zenvyra.model.EvidenceItemStatus;
import com.zenvyra.model.EvidenceItemType;
import com.zenvyra.model.User;
import com.zenvyra.repository.AiSystemInventoryRepository;
import com.zenvyra.repository.EvidenceItemRepository;
import com.zenvyra.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EvidenceItemServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private AiSystemInventoryRepository systemRepository;
    @Mock
    private EvidenceItemRepository evidenceItemRepository;

    private EvidenceItemService service;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        service = new EvidenceItemService(userRepository, systemRepository, evidenceItemRepository);
        userDetails = org.springframework.security.core.userdetails.User
                .withUsername("owner@example.com")
                .password("password")
                .roles("USER")
                .build();
    }

    @Test
    void createsEvidenceItemWithMissingStatusByDefault() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-1").systemName("Support Assistant").build();
        CreateEvidenceItemRequest request = CreateEvidenceItemRequest.builder()
                .systemId("system-1")
                .type(EvidenceItemType.POLICY)
                .title("Privacy policy")
                .description("Internal privacy policy v1")
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(evidenceItemRepository.save(any(EvidenceItem.class))).thenAnswer(invocation -> {
            EvidenceItem item = invocation.getArgument(0);
            item.setId("evidence-1");
            return item;
        });

        EvidenceItemResponse response = service.create(userDetails, request);

        assertEquals("evidence-1", response.getId());
        assertEquals("user-1", response.getUserId());
        assertEquals(EvidenceItemStatus.MISSING, response.getStatus());
        assertEquals(EvidenceItemType.POLICY, response.getType());
        assertEquals("Privacy policy", response.getTitle());
        assertNotNull(response.getCreatedAt());
        assertNotNull(response.getUpdatedAt());
    }

    @Test
    void rejectsInitialStatusOutsideOfAllowedValues() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-1").systemName("Support Assistant").build();
        CreateEvidenceItemRequest request = CreateEvidenceItemRequest.builder()
                .systemId("system-1")
                .type(EvidenceItemType.POLICY)
                .title("Privacy policy")
                .status(EvidenceItemStatus.APPROVED)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));

        ApiException ex = assertThrows(ApiException.class, () -> service.create(userDetails, request));
        assertTrue(ex.getMessage().contains("Initial status"));
        verify(evidenceItemRepository, never()).save(any());
    }

    @Test
    void blocksAccessToOtherUsersEvidence() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        EvidenceItem item = EvidenceItem.builder()
                .id("evidence-1").userId("user-2").systemId("system-1")
                .title("Other").status(EvidenceItemStatus.MISSING).type(EvidenceItemType.POLICY).build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(evidenceItemRepository.findById("evidence-1")).thenReturn(Optional.of(item));

        assertThrows(ApiException.class, () -> service.findById(userDetails, "evidence-1"));
    }

    @Test
    void transitionsStatusAlongAllowedPath() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        EvidenceItem item = EvidenceItem.builder()
                .id("evidence-1").userId("user-1").systemId("system-1")
                .title("Privacy").type(EvidenceItemType.POLICY)
                .status(EvidenceItemStatus.REVIEWED)
                .counselReviewStatus(CounselReviewStatus.PENDING)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(evidenceItemRepository.findById("evidence-1")).thenReturn(Optional.of(item));
        when(evidenceItemRepository.save(any(EvidenceItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateEvidenceStatusRequest request = UpdateEvidenceStatusRequest.builder()
                .status(EvidenceItemStatus.APPROVED)
                .reviewerNotes("Looks good")
                .build();
        EvidenceItemResponse response = service.updateStatus(userDetails, "evidence-1", request);

        assertEquals(EvidenceItemStatus.APPROVED, response.getStatus());
        assertEquals(CounselReviewStatus.APPROVED, response.getCounselReviewStatus());
        assertEquals("Looks good", response.getReviewerNotes());
        assertNotNull(response.getApprovedAt());
    }

    @Test
    void rejectsInvalidStatusTransition() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        EvidenceItem item = EvidenceItem.builder()
                .id("evidence-1").userId("user-1").systemId("system-1")
                .title("Privacy").type(EvidenceItemType.POLICY)
                .status(EvidenceItemStatus.MISSING)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(evidenceItemRepository.findById("evidence-1")).thenReturn(Optional.of(item));

        UpdateEvidenceStatusRequest request = UpdateEvidenceStatusRequest.builder()
                .status(EvidenceItemStatus.APPROVED)
                .build();
        ApiException ex = assertThrows(ApiException.class,
                () -> service.updateStatus(userDetails, "evidence-1", request));
        assertTrue(ex.getMessage().contains("Invalid status transition"));
        verify(evidenceItemRepository, never()).save(any());
    }

    @Test
    void rejectionAfterReviewKeepsCounselStatusRejectedAndItemUploaded() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        EvidenceItem item = EvidenceItem.builder()
                .id("evidence-1").userId("user-1").systemId("system-1")
                .title("Policy").type(EvidenceItemType.POLICY)
                .status(EvidenceItemStatus.REVIEWED)
                .counselReviewStatus(CounselReviewStatus.PENDING)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(evidenceItemRepository.findById("evidence-1")).thenReturn(Optional.of(item));
        when(evidenceItemRepository.save(any(EvidenceItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateEvidenceStatusRequest request = UpdateEvidenceStatusRequest.builder()
                .status(EvidenceItemStatus.UPLOADED)
                .reviewerNotes("Needs more detail")
                .build();
        EvidenceItemResponse response = service.updateStatus(userDetails, "evidence-1", request);

        assertEquals(EvidenceItemStatus.UPLOADED, response.getStatus());
        assertEquals(CounselReviewStatus.REJECTED, response.getCounselReviewStatus());
        assertNotNull(response.getUploadedAt());
    }

    @Test
    void staleTransitionsToUploadedOrRequested() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        EvidenceItem item = EvidenceItem.builder()
                .id("evidence-1").userId("user-1").systemId("system-1")
                .title("Policy").type(EvidenceItemType.POLICY)
                .status(EvidenceItemStatus.STALE)
                .counselReviewStatus(CounselReviewStatus.NOT_REQUIRED)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(evidenceItemRepository.findById("evidence-1")).thenReturn(Optional.of(item));
        when(evidenceItemRepository.save(any(EvidenceItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateEvidenceStatusRequest request = UpdateEvidenceStatusRequest.builder()
                .status(EvidenceItemStatus.REQUESTED)
                .build();
        EvidenceItemResponse response = service.updateStatus(userDetails, "evidence-1", request);

        assertEquals(EvidenceItemStatus.REQUESTED, response.getStatus());
    }

    @Test
    void updateAppliesProvidedFields() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        EvidenceItem item = EvidenceItem.builder()
                .id("evidence-1").userId("user-1").systemId("system-1")
                .title("Original").type(EvidenceItemType.POLICY)
                .status(EvidenceItemStatus.MISSING)
                .counselReviewStatus(CounselReviewStatus.NOT_REQUIRED)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(evidenceItemRepository.findById("evidence-1")).thenReturn(Optional.of(item));
        when(evidenceItemRepository.save(any(EvidenceItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateEvidenceItemRequest request = UpdateEvidenceItemRequest.builder()
                .title("Updated")
                .owner("Compliance lead")
                .dueDate(LocalDate.of(2026, 12, 31))
                .counselReviewStatus(CounselReviewStatus.PENDING)
                .build();
        EvidenceItemResponse response = service.update(userDetails, "evidence-1", request);

        assertEquals("Updated", response.getTitle());
        assertEquals("Compliance lead", response.getOwner());
        assertEquals(LocalDate.of(2026, 12, 31), response.getDueDate());
        assertEquals(CounselReviewStatus.PENDING, response.getCounselReviewStatus());
    }

    @Test
    void updateFileUrlSetsUploadedAtWhenPreviouslyNull() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        EvidenceItem item = EvidenceItem.builder()
                .id("evidence-1").userId("user-1").systemId("system-1")
                .title("Policy").type(EvidenceItemType.POLICY)
                .status(EvidenceItemStatus.REQUESTED)
                .counselReviewStatus(CounselReviewStatus.NOT_REQUIRED)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(evidenceItemRepository.findById("evidence-1")).thenReturn(Optional.of(item));
        when(evidenceItemRepository.save(any(EvidenceItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateEvidenceItemRequest request = UpdateEvidenceItemRequest.builder()
                .fileUrl("https://example.com/policy.pdf")
                .build();
        EvidenceItemResponse response = service.update(userDetails, "evidence-1", request);

        assertEquals("https://example.com/policy.pdf", response.getFileUrl());
        assertNotNull(response.getUploadedAt());
    }

    @Test
    void findBySystemReturnsOnlyOwnedItems() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-1").systemName("Support Assistant").build();
        EvidenceItem item1 = EvidenceItem.builder().id("evidence-1").userId("user-1").systemId("system-1")
                .title("A").type(EvidenceItemType.POLICY).status(EvidenceItemStatus.MISSING).build();
        EvidenceItem item2 = EvidenceItem.builder().id("evidence-2").userId("user-1").systemId("system-1")
                .title("B").type(EvidenceItemType.POLICY).status(EvidenceItemStatus.UPLOADED).build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(evidenceItemRepository.findBySystemIdAndUserId("system-1", "user-1"))
                .thenReturn(List.of(item1, item2));

        List<EvidenceItemResponse> responses = service.findBySystem(userDetails, "system-1");

        assertEquals(2, responses.size());
        assertEquals("evidence-1", responses.get(0).getId());
        assertEquals("evidence-2", responses.get(1).getId());
    }

    @Test
    void findBySystemRejectsAccessToOtherUsersSystem() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-2").userId("user-2").systemName("Other").build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-2")).thenReturn(Optional.of(system));

        assertThrows(ApiException.class, () -> service.findBySystem(userDetails, "system-2"));
        verify(evidenceItemRepository, never()).findBySystemIdAndUserId(any(), any());
    }

    @Test
    void deleteRemovesOwnedEvidence() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        EvidenceItem item = EvidenceItem.builder().id("evidence-1").userId("user-1").systemId("system-1")
                .title("A").type(EvidenceItemType.POLICY).status(EvidenceItemStatus.MISSING).build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(evidenceItemRepository.findById("evidence-1")).thenReturn(Optional.of(item));

        service.delete(userDetails, "evidence-1");

        verify(evidenceItemRepository, times(1)).delete(item);
    }

    @Test
    void createFromGapsGeneratesMissingItemPerNonEmptyCategory() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-1").systemName("Support Assistant").build();
        AiActAssessment assessment = AiActAssessment.builder()
                .userId("user-1").systemId("system-1")
                .humanOversightGaps(List.of("Document human review and escalation workflow"))
                .documentationGaps(List.of("Collect provider documentation"))
                .dataHandlingGaps(List.of("Audit data lineage"))
                .userDisclosureGaps(null)
                .monitoringGaps(List.of())
                .aiLiteracyGaps(List.of("Train operations team"))
                .gpaiProviderDocumentationGaps(null)
                .conformityAssessmentGaps(List.of("Run conformity self-check"))
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(evidenceItemRepository.save(any(EvidenceItem.class))).thenAnswer(invocation -> {
            EvidenceItem item = invocation.getArgument(0);
            item.setId("evidence-" + System.nanoTime());
            return item;
        });

        List<EvidenceItemResponse> created = service.createFromGaps(userDetails, assessment);

        // 5 non-empty categories: humanOversight, documentation, dataHandling, aiLiteracy, conformityAssessment
        assertEquals(5, created.size());

        ArgumentCaptor<EvidenceItem> captor = ArgumentCaptor.forClass(EvidenceItem.class);
        verify(evidenceItemRepository, times(5)).save(captor.capture());
        List<EvidenceItem> saved = captor.getAllValues();
        for (EvidenceItem item : saved) {
            assertEquals(EvidenceItemStatus.MISSING, item.getStatus());
            assertEquals(CounselReviewStatus.NOT_REQUIRED, item.getCounselReviewStatus());
            assertEquals("user-1", item.getUserId());
            assertEquals("system-1", item.getSystemId());
        }
        assertTrue(saved.stream().anyMatch(i -> i.getType() == EvidenceItemType.PROCESS_DOCUMENT
                && "HUMAN_OVERSIGHT".equals(i.getObligationId())
                && "Document human review and escalation workflow".equals(i.getDescription())));
        assertTrue(saved.stream().anyMatch(i -> i.getType() == EvidenceItemType.POLICY
                && "DOCUMENTATION".equals(i.getObligationId())));
        assertTrue(saved.stream().anyMatch(i -> i.getType() == EvidenceItemType.LOG_SAMPLE
                && "DATA_HANDLING".equals(i.getObligationId())));
        assertTrue(saved.stream().anyMatch(i -> i.getType() == EvidenceItemType.PROCESS_DOCUMENT
                && "AI_LITERACY".equals(i.getObligationId())));
        assertTrue(saved.stream().anyMatch(i -> i.getType() == EvidenceItemType.RISK_ASSESSMENT
                && "CONFORMITY_ASSESSMENT".equals(i.getObligationId())));
        assertTrue(saved.stream().noneMatch(i -> "USER_DISCLOSURE".equals(i.getObligationId())));
        assertTrue(saved.stream().noneMatch(i -> "MONITORING".equals(i.getObligationId())));
        assertTrue(saved.stream().noneMatch(i -> "GPAI_PROVIDER_DOCUMENTATION".equals(i.getObligationId())));
    }

    @Test
    void createFromGapsReturnsEmptyWhenAllGapsEmpty() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1").userId("user-1").systemName("Support Assistant").build();
        AiActAssessment assessment = AiActAssessment.builder()
                .userId("user-1").systemId("system-1")
                .humanOversightGaps(List.of())
                .documentationGaps(List.of())
                .dataHandlingGaps(null)
                .userDisclosureGaps(null)
                .monitoringGaps(null)
                .aiLiteracyGaps(null)
                .gpaiProviderDocumentationGaps(null)
                .conformityAssessmentGaps(null)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));

        List<EvidenceItemResponse> created = service.createFromGaps(userDetails, assessment);

        assertEquals(0, created.size());
        verify(evidenceItemRepository, never()).save(any());
    }

    @Test
    void updateStatusStaleTransitionStampsStaleAt() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        EvidenceItem item = EvidenceItem.builder()
                .id("evidence-1").userId("user-1").systemId("system-1")
                .title("Policy").type(EvidenceItemType.POLICY)
                .status(EvidenceItemStatus.APPROVED)
                .counselReviewStatus(CounselReviewStatus.APPROVED)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(evidenceItemRepository.findById("evidence-1")).thenReturn(Optional.of(item));
        when(evidenceItemRepository.save(any(EvidenceItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateEvidenceStatusRequest request = UpdateEvidenceStatusRequest.builder()
                .status(EvidenceItemStatus.STALE)
                .build();
        EvidenceItemResponse response = service.updateStatus(userDetails, "evidence-1", request);

        assertEquals(EvidenceItemStatus.STALE, response.getStatus());
        assertNotNull(response.getStaleAt());
    }

    @Test
    void updateStatusSetsReviewedAt() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        EvidenceItem item = EvidenceItem.builder()
                .id("evidence-1").userId("user-1").systemId("system-1")
                .title("Policy").type(EvidenceItemType.POLICY)
                .status(EvidenceItemStatus.UPLOADED)
                .counselReviewStatus(CounselReviewStatus.NOT_REQUIRED)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(evidenceItemRepository.findById("evidence-1")).thenReturn(Optional.of(item));
        when(evidenceItemRepository.save(any(EvidenceItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateEvidenceStatusRequest request = UpdateEvidenceStatusRequest.builder()
                .status(EvidenceItemStatus.REVIEWED)
                .build();
        EvidenceItemResponse response = service.updateStatus(userDetails, "evidence-1", request);

        assertEquals(EvidenceItemStatus.REVIEWED, response.getStatus());
        assertNotNull(response.getReviewedAt());
        assertNull(response.getApprovedAt());
    }

    @Test
    void unauthorizedUserResolutionFails() {
        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.empty());

        assertThrows(ApiException.class, () -> service.findById(userDetails, "evidence-1"));
    }
}
