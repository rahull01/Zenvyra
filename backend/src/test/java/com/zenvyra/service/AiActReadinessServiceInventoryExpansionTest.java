package com.zenvyra.service;

import com.zenvyra.domain.aiact.AiActRuleCatalogFactory;
import com.zenvyra.domain.aiact.AiActRuleCatalogV2026_07;
import com.zenvyra.dto.request.AiSystemInventoryRequest;
import com.zenvyra.dto.response.AiSystemInventoryResponse;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.AiSystemInventory;
import com.zenvyra.model.ReleaseStatus;
import com.zenvyra.model.User;
import com.zenvyra.repository.AiActAssessmentRepository;
import com.zenvyra.repository.AiSystemInventoryRepository;
import com.zenvyra.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiActReadinessServiceInventoryExpansionTest {

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

    private AiActReadinessService service;
    private UserDetails userDetails;
    private User user;

    @BeforeEach
    void setUp() {
        AiActRuleCatalogFactory ruleCatalogFactory = new AiActRuleCatalogFactory(new AiActRuleCatalogV2026_07());
        service = new AiActReadinessService(userRepository, systemRepository, assessmentRepository,
                ruleCatalogFactory, evidenceItemService, aiActAuditService);
        userDetails = org.springframework.security.core.userdetails.User
                .withUsername("owner@example.com")
                .password("password")
                .roles("USER")
                .build();
        user = User.builder().id("user-1").email("owner@example.com").build();
        when(userRepository.findByEmail("owner@example.com")).thenReturn(java.util.Optional.of(user));
    }

    @Test
    void newFieldsRoundTripThroughCreateAndResponse() {
        LocalDateTime lastReviewed = LocalDateTime.of(2026, 1, 15, 9, 30);
        LocalDateTime nextReview = LocalDateTime.of(2026, 7, 15, 9, 30);
        AiSystemInventoryRequest request = AiSystemInventoryRequest.builder()
                .systemName("Support Assistant")
                .deploymentContext("Cloud")
                .modelProviderVersion("gpt-4o-2024-08")
                .trainingOrFineTuning(true)
                .customerFacing(false)
                .decisionImpactLevel("HIGH")
                .releaseStatus(ReleaseStatus.PILOT)
                .lastReviewedAt(lastReviewed)
                .nextReviewAt(nextReview)
                .build();

        when(systemRepository.save(any(AiSystemInventory.class))).thenAnswer(invocation -> {
            AiSystemInventory s = invocation.getArgument(0);
            s.setId("system-1");
            return s;
        });

        AiSystemInventoryResponse response = service.create(userDetails, request);

        assertEquals("system-1", response.getId());
        assertEquals("cloud", response.getDeploymentContext());
        assertEquals("gpt-4o-2024-08", response.getModelProviderVersion());
        assertEquals(Boolean.TRUE, response.getTrainingOrFineTuning());
        assertEquals(Boolean.FALSE, response.getCustomerFacing());
        assertEquals("high", response.getDecisionImpactLevel());
        assertEquals(ReleaseStatus.PILOT, response.getReleaseStatus());
        assertEquals(lastReviewed, response.getLastReviewedAt());
        assertEquals(nextReview, response.getNextReviewAt());
    }

    @Test
    void omittedReleaseStatusDefaultsToDraftOnCreate() {
        AiSystemInventoryRequest request = AiSystemInventoryRequest.builder()
                .systemName("Draft System")
                .build();

        ArgumentCaptor<AiSystemInventory> captor = ArgumentCaptor.forClass(AiSystemInventory.class);
        when(systemRepository.save(any(AiSystemInventory.class))).thenAnswer(invocation -> {
            AiSystemInventory s = invocation.getArgument(0);
            s.setId("system-draft");
            return s;
        });

        AiSystemInventoryResponse response = service.create(userDetails, request);

        verify(systemRepository).save(captor.capture());
        assertEquals(ReleaseStatus.DRAFT, captor.getValue().getReleaseStatus());
        assertEquals(ReleaseStatus.DRAFT, response.getReleaseStatus());
    }

    @Test
    void newFieldsAreCopiedOnUpdate() {
        AiSystemInventory existing = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .systemName("Existing System")
                .releaseStatus(ReleaseStatus.DRAFT)
                .build();
        when(systemRepository.findById("system-1")).thenReturn(java.util.Optional.of(existing));
        when(systemRepository.save(any(AiSystemInventory.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LocalDateTime lastReviewed = LocalDateTime.of(2026, 2, 1, 12, 0);
        LocalDateTime nextReview = LocalDateTime.of(2026, 8, 1, 12, 0);
        AiSystemInventoryRequest request = AiSystemInventoryRequest.builder()
                .systemName("Existing System")
                .deploymentContext("on-premise")
                .modelProviderVersion("claude-3-5-sonnet")
                .trainingOrFineTuning(false)
                .customerFacing(true)
                .decisionImpactLevel("critical")
                .releaseStatus(ReleaseStatus.PRODUCTION)
                .lastReviewedAt(lastReviewed)
                .nextReviewAt(nextReview)
                .build();

        AiSystemInventoryResponse response = service.update(userDetails, "system-1", request);

        assertEquals("on-premise", response.getDeploymentContext());
        assertEquals("claude-3-5-sonnet", response.getModelProviderVersion());
        assertEquals(Boolean.FALSE, response.getTrainingOrFineTuning());
        assertEquals(Boolean.TRUE, response.getCustomerFacing());
        assertEquals("critical", response.getDecisionImpactLevel());
        assertEquals(ReleaseStatus.PRODUCTION, response.getReleaseStatus());
        assertEquals(lastReviewed, response.getLastReviewedAt());
        assertEquals(nextReview, response.getNextReviewAt());
        assertNotNull(response.getUpdatedAt());
    }

    @Test
    void invalidDeploymentContextThrowsBadRequest() {
        AiSystemInventoryRequest request = AiSystemInventoryRequest.builder()
                .systemName("Bad System")
                .deploymentContext("underwater")
                .build();

        ApiException ex = assertThrows(ApiException.class, () -> service.create(userDetails, request));
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
        assertEquals("BAD_REQUEST", ex.getErrorCode());
        assertNotNull(ex.getMessage());
        assertEquals(true, ex.getMessage().toLowerCase().contains("deploymentcontext"));
    }

    @Test
    void invalidDecisionImpactLevelThrowsBadRequest() {
        AiSystemInventoryRequest request = AiSystemInventoryRequest.builder()
                .systemName("Bad System")
                .decisionImpactLevel("extreme")
                .build();

        ApiException ex = assertThrows(ApiException.class, () -> service.create(userDetails, request));
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
        assertEquals("BAD_REQUEST", ex.getErrorCode());
        assertNotNull(ex.getMessage());
        assertEquals(true, ex.getMessage().toLowerCase().contains("decisionimpactlevel"));
    }

    @Test
    void invalidDeploymentContextOnUpdateAlsoThrowsBadRequest() {
        AiSystemInventoryRequest request = AiSystemInventoryRequest.builder()
                .systemName("Existing System")
                .deploymentContext("satellite")
                .build();

        ApiException ex = assertThrows(ApiException.class, () -> service.update(userDetails, "system-1", request));
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
    }

    @Test
    void optionalFieldsAreAllowedToRemainNull() {
        AiSystemInventoryRequest request = AiSystemInventoryRequest.builder()
                .systemName("Bare System")
                .build();
        when(systemRepository.save(any(AiSystemInventory.class))).thenAnswer(invocation -> {
            AiSystemInventory s = invocation.getArgument(0);
            s.setId("system-bare");
            return s;
        });

        AiSystemInventoryResponse response = service.create(userDetails, request);

        assertNull(response.getDeploymentContext());
        assertNull(response.getModelProviderVersion());
        assertEquals(Boolean.FALSE, response.getTrainingOrFineTuning());
        assertEquals(Boolean.FALSE, response.getCustomerFacing());
        assertNull(response.getDecisionImpactLevel());
        assertEquals(ReleaseStatus.DRAFT, response.getReleaseStatus());
        assertNull(response.getLastReviewedAt());
        assertNull(response.getNextReviewAt());
    }
}
