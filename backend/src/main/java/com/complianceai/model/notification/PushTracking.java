package com.complianceai.model.notification;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "push_tracking")
public class PushTracking {
    @Id
    private String userId;
    private LocalDateTime lastSentAt;
    
    // List of timestamps for notifications sent in the last 24h
    private List<LocalDateTime> sentAtHistory = new ArrayList<>();

    public void addSentTimestamp(LocalDateTime timestamp) {
        this.sentAtHistory.add(timestamp);
        this.lastSentAt = timestamp;
        // Cleanup old timestamps elsewhere (rolling window check)
    }
}
