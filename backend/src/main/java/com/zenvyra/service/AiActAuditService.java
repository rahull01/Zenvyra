package com.zenvyra.service;

import com.zenvyra.dto.response.AiActAuditLogResponse;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.AiActAssessment;
import com.zenvyra.model.AiActAuditEventType;
import com.zenvyra.model.AiActAuditLog;
import com.zenvyra.model.AiSystemInventory;
import com.zenvyra.model.EvidenceItem;
import com.zenvyra.model.EvidenceItemStatus;
import com.zenvyra.model.User;
import com.zenvyra.repository.AiActAuditLogRepository;
import com.zenvyra.repository.AiSystemInventoryRepository;
import com.zenvyra.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiActAuditService {

    private final UserRepository userRepository;
    private final AiSystemInventoryRepository systemRepository;
    private final AiActAuditLogRepository auditLogRepository;

    public void logSystemCreated(UserDetails userDetails, AiSystemInventory system) {
        User user = resolveUser(userDetails);
        if (system == null || system.getId() == null) {
            throw ApiException.badRequest("AI system must be provided");
        }
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("systemName", system.getSystemName());
        data.put("purpose", system.getPurpose());
        data.put("provider", system.getProvider());
        saveEvent(user, system, null, AiActAuditEventType.SYSTEM_CREATED, data);
    }

    public void logSystemUpdated(UserDetails userDetails, AiSystemInventory system) {
        User user = resolveUser(userDetails);
        if (system == null || system.getId() == null) {
            throw ApiException.badRequest("AI system must be provided");
        }
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("systemName", system.getSystemName());
        data.put("purpose", system.getPurpose());
        data.put("provider", system.getProvider());
        saveEvent(user, system, null, AiActAuditEventType.SYSTEM_UPDATED, data);
    }

    public void logSystemDeleted(UserDetails userDetails, AiSystemInventory system) {
        User user = resolveUser(userDetails);
        if (system == null || system.getId() == null) {
            throw ApiException.badRequest("AI system must be provided");
        }
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("systemName", system.getSystemName());
        saveEvent(user, system, null, AiActAuditEventType.SYSTEM_DELETED, data);
    }

    public void logAssessmentCreated(UserDetails userDetails, AiActAssessment assessment) {
        User user = resolveUser(userDetails);
        if (assessment == null || assessment.getSystemId() == null) {
            throw ApiException.badRequest("Assessment must reference a system");
        }
        AiSystemInventory system = loadOwnedSystem(user, assessment.getSystemId());
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("riskCategory", assessment.getRiskCategory());
        data.put("readinessScore", assessment.getReadinessScore());
        data.put("confidence", assessment.getConfidence());
        saveEvent(user, system, assessment.getId(), AiActAuditEventType.ASSESSMENT_CREATED, data);
    }

    public void logEvidenceItemCreated(UserDetails userDetails, EvidenceItem item) {
        User user = resolveUser(userDetails);
        if (item == null || item.getSystemId() == null) {
            throw ApiException.badRequest("Evidence item must reference a system");
        }
        AiSystemInventory system = loadOwnedSystem(user, item.getSystemId());
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("evidenceId", item.getId());
        data.put("title", item.getTitle());
        data.put("type", item.getType());
        data.put("status", item.getStatus());
        data.put("obligationId", item.getObligationId());
        saveEvent(user, system, null, AiActAuditEventType.EVIDENCE_ITEM_CREATED, data);
    }

    public void logEvidenceItemStatusChanged(UserDetails userDetails,
                                             EvidenceItem item,
                                             EvidenceItemStatus previousStatus) {
        User user = resolveUser(userDetails);
        if (item == null || item.getSystemId() == null) {
            throw ApiException.badRequest("Evidence item must reference a system");
        }
        AiSystemInventory system = loadOwnedSystem(user, item.getSystemId());
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("evidenceId", item.getId());
        data.put("title", item.getTitle());
        data.put("previousStatus", previousStatus);
        data.put("newStatus", item.getStatus());
        data.put("counselReviewStatus", item.getCounselReviewStatus());
        saveEvent(user, system, null, AiActAuditEventType.EVIDENCE_ITEM_STATUS_CHANGED, data);
    }

    public List<AiActAuditLogResponse> findBySystem(UserDetails userDetails, String systemId) {
        return loadAndConvert(userDetails, systemId, false);
    }

    public List<AiActAuditLogResponse> exportBySystem(UserDetails userDetails, String systemId) {
        return loadAndConvert(userDetails, systemId, true);
    }

    private List<AiActAuditLogResponse> loadAndConvert(UserDetails userDetails, String systemId, boolean chronological) {
        User user = resolveUser(userDetails);
        if (systemId == null || systemId.isBlank()) {
            throw ApiException.badRequest("System id is required");
        }
        AiSystemInventory system = loadOwnedSystem(user, systemId);
        List<AiActAuditLog> logs = new ArrayList<>(
                auditLogRepository.findBySystemIdAndOrganizationId(systemId, system.getOrganizationId()));
        if (chronological) {
            logs.sort(Comparator.comparing(AiActAuditLog::getTimestamp,
                    Comparator.nullsLast(Comparator.naturalOrder())));
        }
        List<AiActAuditLogResponse> responses = new ArrayList<>();
        for (AiActAuditLog log : logs) {
            responses.add(toResponse(log));
        }
        return responses;
    }

    private void saveEvent(User user,
                           AiSystemInventory system,
                           String assessmentId,
                           AiActAuditEventType eventType,
                           Map<String, Object> eventData) {
        AiActAuditLog log = AiActAuditLog.builder()
                .userId(user.getId())
                .organizationId(system.getOrganizationId() != null ? system.getOrganizationId() : user.getId())
                .systemId(system.getId())
                .assessmentId(assessmentId)
                .eventType(eventType)
                .actor(user.getEmail())
                .eventData(eventData)
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(log);
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

    private AiActAuditLogResponse toResponse(AiActAuditLog log) {
        return AiActAuditLogResponse.builder()
                .id(log.getId())
                .userId(log.getUserId())
                .organizationId(log.getOrganizationId())
                .systemId(log.getSystemId())
                .assessmentId(log.getAssessmentId())
                .eventType(log.getEventType())
                .actor(log.getActor())
                .eventData(log.getEventData())
                .timestamp(log.getTimestamp())
                .build();
    }
}
