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
@Document(collection = "scanner_leads")
public class ScannerLead {
    @Id
    private String id;

    private String fullName;

    @Indexed
    private String email;

    private String websiteUrl;
    private Double readinessScore;
    private Integer issueCount;
    private String source;
    private String desiredPath;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
