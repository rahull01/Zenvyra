package com.zenvyra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ai_act_audit_logs")
public class AiActAuditLog {
    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String organizationId;

    @Indexed
    private String systemId;

    @Indexed
    private String assessmentId;

    private AiActAuditEventType eventType;
    private String actor;
    private Map<String, Object> eventData;
    private LocalDateTime timestamp;
}
