package com.zenvyra.dto.response;

import com.zenvyra.model.AiActAuditEventType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiActAuditLogResponse {
    private String id;
    private String userId;
    private String organizationId;
    private String systemId;
    private String assessmentId;
    private AiActAuditEventType eventType;
    private String actor;
    private Map<String, Object> eventData;
    private LocalDateTime timestamp;
}
