package com.zenvyra.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "alerts")
public class Alert {

    @Id
    private String id;

    private String userId;
    private String websiteId;

    private String type; // low_score, change_detected, ssl_expiry
    private String severity; // info, warning, critical
    private String title;
    private String message;

    private Boolean read;
    private LocalDateTime readAt;

    private String actionUrl;
    private Boolean actionRequired;

    private LocalDateTime createdAt;
}
