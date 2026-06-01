package com.complianceai.model;

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
@Document(collection = "consent_logs")
public class ConsentLog {
    @Id
    private String id;
    
    @Indexed
    private String bannerId;
    
    private String ip;
    private String country;
    private String userAgent;
    private Map<String, Boolean> choices;
    private String policyVersion;
    private String bannerVariant;
    
    @Indexed
    private LocalDateTime timestamp;
}
