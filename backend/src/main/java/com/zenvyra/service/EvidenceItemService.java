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
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class EvidenceItemService {

    private final UserRepository userRepository;
    private final AiSystemInventoryRepository systemRepository;
    private final EvidenceItemRepository evidenceItemRepository;

    private static final Map<EvidenceItemStatus, Set<EvidenceItemStatus>> TRANSITIONS = buildTransitionMatrix();

    private static Map<EvidenceItemStatus, Set<EvidenceItemStatus>> buildTransitionMatrix() {
        Map<EvidenceItemStatus, Set<EvidenceItemStatus>> matrix = new EnumMap<>(EvidenceItemStatus.class);
        matrix.put(EvidenceItemStatus.MISSING, EnumSet.of(EvidenceItemStatus.REQUESTED, EvidenceItemStatus.UPLOADED));
        matrix.put(EvidenceItemStatus.REQUESTED, EnumSet.of(EvidenceItemStatus.UPLOADED));
        matrix.put(EvidenceItemStatus.UPLOADED, EnumSet.of(EvidenceItemStatus.REVIEWED));
        matrix.put(EvidenceItemStatus.REVIEWED, EnumSet.of(EvidenceItemStatus.APPROVED, EvidenceItemStatus.UPLOADED));
        matrix.put(EvidenceItemStatus.APPROVED, EnumSet.of(EvidenceItemStatus.STALE));
        matrix.put(EvidenceItemStatus.STALE, EnumSet.of(EvidenceItemStatus.UPLOADED, EvidenceItemStatus.REQUESTED));
        return matrix;
    }

    public EvidenceItemResponse create(UserDetails userDetails, CreateEvidenceItemRequest request) {
        User user = resolveUser(userDetails);
        AiSystemInventory system = loadOwnedSystem(user, request.getSystemId());

        EvidenceItemStatus initialStatus = Optional.ofNullable(request.getStatus())
                .orElse(EvidenceItemStatus.MISSING);
        if (initialStatus != EvidenceItemStatus.MISSING && initialStatus != EvidenceItemStatus.REQUESTED) {
            throw ApiException.badRequest("Initial status must be MISSING or REQUESTED");
        }

        LocalDateTime now = LocalDateTime.now();
        EvidenceItem item = EvidenceItem.builder()
                .userId(user.getId())
                .organizationId(system.getOrganizationId())
                .systemId(system.getId())
                .obligationId(request.getObligationId())
                .type(request.getType())
                .status(initialStatus)
                .title(request.getTitle())
                .description(request.getDescription())
                .fileUrl(request.getFileUrl())
                .fileName(request.getFileName())
                .owner(request.getOwner())
                .reviewerNotes(request.getReviewerNotes())
                .counselReviewStatus(Optional.ofNullable(request.getCounselReviewStatus())
                        .orElse(CounselReviewStatus.NOT_REQUIRED))
                .dueDate(request.getDueDate())
                .createdAt(now)
                .updatedAt(now)
                .build();
        if (initialStatus == EvidenceItemStatus.UPLOADED) {
            item.setUploadedAt(now);
        }
        return toResponse(evidenceItemRepository.save(item));
    }

    public List<EvidenceItemResponse> findBySystem(UserDetails userDetails, String systemId) {
        User user = resolveUser(userDetails);
        loadOwnedSystem(user, systemId);
        List<EvidenceItem> items = evidenceItemRepository.findBySystemIdAndUserId(systemId, user.getId());
        List<EvidenceItemResponse> responses = new ArrayList<>();
        for (EvidenceItem item : items) {
            responses.add(toResponse(item));
        }
        return responses;
    }

    public EvidenceItemResponse findById(UserDetails userDetails, String id) {
        User user = resolveUser(userDetails);
        EvidenceItem item = loadOwnedEvidence(user, id);
        return toResponse(item);
    }

    public EvidenceItemResponse update(UserDetails userDetails, String id, UpdateEvidenceItemRequest request) {
        User user = resolveUser(userDetails);
        EvidenceItem item = loadOwnedEvidence(user, id);

        if (request.getTitle() != null) {
            item.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            item.setDescription(request.getDescription());
        }
        if (request.getOwner() != null) {
            item.setOwner(request.getOwner());
        }
        if (request.getFileUrl() != null) {
            item.setFileUrl(request.getFileUrl());
            if (item.getUploadedAt() == null) {
                item.setUploadedAt(LocalDateTime.now());
            }
        }
        if (request.getFileName() != null) {
            item.setFileName(request.getFileName());
        }
        if (request.getReviewerNotes() != null) {
            item.setReviewerNotes(request.getReviewerNotes());
        }
        if (request.getCounselReviewStatus() != null) {
            item.setCounselReviewStatus(request.getCounselReviewStatus());
        }
        if (request.getDueDate() != null) {
            item.setDueDate(request.getDueDate());
        }
        item.setUpdatedAt(LocalDateTime.now());
        return toResponse(evidenceItemRepository.save(item));
    }

    public EvidenceItemResponse updateStatus(UserDetails userDetails, String id, UpdateEvidenceStatusRequest request) {
        User user = resolveUser(userDetails);
        EvidenceItem item = loadOwnedEvidence(user, id);

        EvidenceItemStatus current = item.getStatus();
        EvidenceItemStatus target = request.getStatus();
        Set<EvidenceItemStatus> allowed = TRANSITIONS.getOrDefault(current, EnumSet.noneOf(EvidenceItemStatus.class));
        if (!allowed.contains(target)) {
            throw new ApiException(
                    "Invalid status transition from " + current + " to " + target,
                    HttpStatus.CONFLICT,
                    "INVALID_STATUS_TRANSITION");
        }

        LocalDateTime now = LocalDateTime.now();
        item.setStatus(target);
        if (request.getReviewerNotes() != null) {
            item.setReviewerNotes(request.getReviewerNotes());
        }

        // Counsel rejection: keep status as UPLOADED but mark counsel review as REJECTED.
        if (target == EvidenceItemStatus.UPLOADED && current == EvidenceItemStatus.REVIEWED) {
            item.setCounselReviewStatus(CounselReviewStatus.REJECTED);
        } else if (target == EvidenceItemStatus.APPROVED) {
            item.setCounselReviewStatus(CounselReviewStatus.APPROVED);
        }

        switch (target) {
            case UPLOADED -> item.setUploadedAt(now);
            case REVIEWED -> item.setReviewedAt(now);
            case APPROVED -> item.setApprovedAt(now);
            case STALE -> item.setStaleAt(now);
            default -> { /* no timestamp */ }
        }
        item.setUpdatedAt(now);
        return toResponse(evidenceItemRepository.save(item));
    }

    public void delete(UserDetails userDetails, String id) {
        User user = resolveUser(userDetails);
        EvidenceItem item = loadOwnedEvidence(user, id);
        evidenceItemRepository.delete(item);
    }

    public List<EvidenceItemResponse> createFromGaps(UserDetails userDetails, AiActAssessment assessment) {
        User user = resolveUser(userDetails);
        AiSystemInventory system = loadOwnedSystem(user, assessment.getSystemId());
        LocalDateTime now = LocalDateTime.now();
        List<EvidenceItemResponse> created = new ArrayList<>();
        for (GapCategory category : GapCategory.values()) {
            List<String> gaps = category.extract(assessment);
            if (gaps == null || gaps.isEmpty()) {
                continue;
            }
            EvidenceItem item = EvidenceItem.builder()
                    .userId(user.getId())
                    .organizationId(system.getOrganizationId())
                    .systemId(system.getId())
                    .obligationId(category.obligationId)
                    .type(category.evidenceType)
                    .status(EvidenceItemStatus.MISSING)
                    .title(category.title)
                    .description(gaps.get(0))
                    .counselReviewStatus(CounselReviewStatus.NOT_REQUIRED)
                    .createdAt(now)
                    .updatedAt(now)
                    .build();
            created.add(toResponse(evidenceItemRepository.save(item)));
        }
        return created;
    }

    private User resolveUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.UNAUTHORIZED, "UNAUTHORIZED"));
    }

    private AiSystemInventory loadOwnedSystem(User user, String id) {
        AiSystemInventory inventory = systemRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("AI system"));
        if (!user.getId().equals(inventory.getUserId())) {
            throw ApiException.forbidden("Access denied");
        }
        return inventory;
    }

    private EvidenceItem loadOwnedEvidence(User user, String id) {
        EvidenceItem item = evidenceItemRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Evidence item"));
        if (!user.getId().equals(item.getUserId())) {
            throw ApiException.forbidden("Access denied");
        }
        return item;
    }

    private EvidenceItemResponse toResponse(EvidenceItem item) {
        return EvidenceItemResponse.builder()
                .id(item.getId())
                .userId(item.getUserId())
                .organizationId(item.getOrganizationId())
                .systemId(item.getSystemId())
                .obligationId(item.getObligationId())
                .type(item.getType())
                .status(item.getStatus())
                .title(item.getTitle())
                .description(item.getDescription())
                .fileUrl(item.getFileUrl())
                .fileName(item.getFileName())
                .owner(item.getOwner())
                .reviewerNotes(item.getReviewerNotes())
                .counselReviewStatus(item.getCounselReviewStatus())
                .dueDate(item.getDueDate())
                .uploadedAt(item.getUploadedAt())
                .reviewedAt(item.getReviewedAt())
                .approvedAt(item.getApprovedAt())
                .staleAt(item.getStaleAt())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }

    private enum GapCategory {
        HUMAN_OVERSIGHT("Human oversight evidence", EvidenceItemType.PROCESS_DOCUMENT,
                AiActAssessment::getHumanOversightGaps),
        DOCUMENTATION("Documentation evidence", EvidenceItemType.POLICY,
                AiActAssessment::getDocumentationGaps),
        DATA_HANDLING("Data handling evidence", EvidenceItemType.LOG_SAMPLE,
                AiActAssessment::getDataHandlingGaps),
        USER_DISCLOSURE("User disclosure evidence", EvidenceItemType.POLICY,
                AiActAssessment::getUserDisclosureGaps),
        MONITORING("Monitoring evidence", EvidenceItemType.LOG_SAMPLE,
                AiActAssessment::getMonitoringGaps),
        AI_LITERACY("AI literacy evidence", EvidenceItemType.PROCESS_DOCUMENT,
                AiActAssessment::getAiLiteracyGaps),
        GPAI_PROVIDER_DOCUMENTATION("GPAI provider documentation evidence", EvidenceItemType.MODEL_CARD,
                AiActAssessment::getGpaiProviderDocumentationGaps),
        CONFORMITY_ASSESSMENT("Conformity assessment evidence", EvidenceItemType.RISK_ASSESSMENT,
                AiActAssessment::getConformityAssessmentGaps);

        private final String title;
        private final EvidenceItemType evidenceType;
        private final String obligationId;
        private final java.util.function.Function<AiActAssessment, List<String>> extractor;

        GapCategory(String title, EvidenceItemType evidenceType,
                    java.util.function.Function<AiActAssessment, List<String>> extractor) {
            this.title = title;
            this.evidenceType = evidenceType;
            this.obligationId = name();
            this.extractor = extractor;
        }

        List<String> extract(AiActAssessment assessment) {
            return extractor.apply(assessment);
        }
    }
}
