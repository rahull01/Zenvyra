package com.zenvyra.model.notification;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Builder
@Document(collection = "notification_queue")
public class QueuedNotification {
    @Id
    private String id;
    private String userId;
    private String title;
    private String message;
    private String actionUrl;
    private NotificationPreference.NotificationPriority priority;
    private LocalDateTime createdAt;
    private boolean processed;
}
