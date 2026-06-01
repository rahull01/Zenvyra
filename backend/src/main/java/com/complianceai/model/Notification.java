package com.complianceai.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Builder
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String userId;
    private String title;
    private String message;
    private NotificationType type;
    private Priority priority;
    private boolean read;
    private LocalDateTime createdAt;
    private String actionUrl;

    public enum NotificationType {
        STREAK_ALERT,
        COMPLIANCE_ISSUE,
        MILESTONE_ACHIEVED,
        SYSTEM_UPDATE
    }

    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }
}
