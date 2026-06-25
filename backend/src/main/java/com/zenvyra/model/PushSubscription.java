package com.zenvyra.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "push_subscriptions")
public class PushSubscription {
    @Id
    private String id;
    private String userId;
    
    // Web Push Standard Fields
    private String endpoint;
    private String p256dh;
    private String auth;
    
    private LocalDateTime createdAt;
}
