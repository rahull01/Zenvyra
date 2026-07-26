package com.zenvyra.service;

import com.zenvyra.domain.aiact.AiActRuleCatalogFactory;
import com.zenvyra.domain.aiact.AiActRuleCatalogV2026_07;
import com.zenvyra.dto.request.AiSystemInventoryRequest;
import com.zenvyra.model.AiActAssessment;
import com.zenvyra.model.AiSystemInventory;
import com.zenvyra.model.User;
import com.zenvyra.repository.AiActAssessmentRepository;
import com.zenvyra.repository.AiSystemInventoryRepository;
import com.zenvyra.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiActReadinessServiceEvidenceAuditTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private AiSystemInventoryRepository systemRepository;
    @Mock
    private AiActAssessmentRepository assessmentRepository;
    @Mock
    private EvidenceItemService evidenceItemService;
    @Mock
    private AiActAuditService aiActAuditService;
    @Mock
    private EmailService emailService;

    private AiActReadinessService service;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        AiActRuleCatalogFactory ruleCatalogFactory = new AiActRuleCatalogFactory(new AiActRuleCatalogV2026_07());
        service = new AiActReadinessService(userRepository, systemRepository, assessmentRepository,
                ruleCatalogFactory, evidenceItemService, aiActAuditService, emailService);
        userDetails = org.springframework.security.core.userdetails.User
                .withUsername("owner@example.com")
                .password("password")
                .roles("USER")
                .build();
    }

    @Test
    void assessTriggersEvidenceFromGapsAndAssessmentAudit() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-assess")
                .userId("user-1")
                .systemName("Support Assistant")
                .euUsersAffected(true)
                .userFacingAiInteraction(true)
                .automatedDecisionMaking(true)
                .humanOversight(false)
                .logsEvidenceRetained(false)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-assess")).thenReturn(Optional.of(system));
        when(assessmentRepository.save(any(AiActAssessment.class))).thenAnswer(invocation -> {
            AiActAssessment saved = invocation.getArgument(0);
            saved.setId("assessment-saved");
            return saved;
        });

        service.assess(userDetails, "system-assess");

        ArgumentCaptor<AiActAssessment> assessmentCaptor = ArgumentCaptor.forClass(AiActAssessment.class);
        verify(evidenceItemService).createFromGaps(eq(userDetails), assessmentCaptor.capture());
        verify(aiActAuditService).logAssessmentCreated(eq(userDetails), assessmentCaptor.capture());

        AiActAssessment captured = assessmentCaptor.getValue();
        assertNotNull(captured.getId(), "Saved assessment should be passed to evidence/audit services");
    }

    @Test
    void assessInvokesEvidenceBeforeAudit() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-order")
                .userId("user-1")
                .systemName("Order Check")
                .euUsersAffected(true)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-order")).thenReturn(Optional.of(system));
        when(assessmentRepository.save(any(AiActAssessment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.assess(userDetails, "system-order");

        InOrder ordered = inOrder(assessmentRepository, evidenceItemService, aiActAuditService);
        ordered.verify(assessmentRepository).save(any(AiActAssessment.class));
        ordered.verify(evidenceItemService).createFromGaps(eq(userDetails), any(AiActAssessment.class));
        ordered.verify(aiActAuditService).logAssessmentCreated(eq(userDetails), any(AiActAssessment.class));
    }

    @Test
    void createLogsSystemCreatedAudit() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory savedSystem = AiSystemInventory.builder()
                .id("system-created")
                .userId("user-1")
                .systemName("Created System")
                .build();
        AiSystemInventoryRequest request = AiSystemInventoryRequest.builder()
                .systemName("Created System")
                .euUsersAffected(true)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.save(any(AiSystemInventory.class))).thenReturn(savedSystem);

        service.create(userDetails, request);

        InOrder ordered = inOrder(systemRepository, aiActAuditService);
        ordered.verify(systemRepository).save(any(AiSystemInventory.class));
        ordered.verify(aiActAuditService).logSystemCreated(eq(userDetails), any(AiSystemInventory.class));
    }

    @Test
    void updateLogsSystemUpdatedAudit() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory existing = AiSystemInventory.builder()
                .id("system-update")
                .userId("user-1")
                .systemName("Old Name")
                .euUsersAffected(true)
                .build();
        AiSystemInventoryRequest request = AiSystemInventoryRequest.builder()
                .systemName("New Name")
                .euUsersAffected(true)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-update")).thenReturn(Optional.of(existing));
        when(systemRepository.save(any(AiSystemInventory.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.update(userDetails, "system-update", request);

        InOrder ordered = inOrder(systemRepository, aiActAuditService);
        ordered.verify(systemRepository).save(any(AiSystemInventory.class));
        ordered.verify(aiActAuditService).logSystemUpdated(eq(userDetails), any(AiSystemInventory.class));
    }

    @Test
    void deleteLogsSystemDeletedAuditBeforeRepositoryDelete() {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-delete")
                .userId("user-1")
                .systemName("Deleted System")
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-delete")).thenReturn(Optional.of(system));

        service.delete(userDetails, "system-delete");

        InOrder ordered = inOrder(aiActAuditService, systemRepository);
        ordered.verify(aiActAuditService).logSystemDeleted(eq(userDetails), any(AiSystemInventory.class));
        ordered.verify(systemRepository).delete(any(AiSystemInventory.class));
    }
}
