package com.zenvyra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "webhook_deliveries")
public class WebhookDelivery {
    @Id
    private String id;
    
    @Indexed
    private String webhookId;
    
    private String event;
    private Object payload;
    private String status; // success, failed, pending
    private Integer responseCode;
    private String responseBody;
    private Integer retryCount;
    private LocalDateTime nextRetryAt;
    private LocalDateTime timestamp;
}
