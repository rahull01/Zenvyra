package com.complianceai.model.notification;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Builder
@Document(collection = "notification_preferences")
public class NotificationPreference {
    @Id
    private String userId;
    private boolean pushEnabled;
    private NotificationPriority pushThreshold; // e.g., HIGH
    private String timezone; // For smart timing
    
    public enum NotificationPriority {
        LOW, MEDIUM, HIGH, CRITICAL
    }
}
