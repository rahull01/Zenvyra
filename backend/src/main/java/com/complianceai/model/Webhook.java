package com.complianceai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "webhooks")
public class Webhook {
    @Id
    private String id;
    
    @Indexed
    private String organizationId;
    
    private String url;
    private List<String> events;
    private String secret; // hashed
    private boolean active;
    private LocalDateTime lastDelivery;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
