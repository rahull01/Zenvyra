package com.complianceai.model;

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
@Document(collection = "regulation_changes")
public class RegulationChange {
    @Id
    private String id;
    
    @Indexed
    private String regulationId;
    
    private String title;
    private String summary; // AI-generated
    private String description;
    private LocalDateTime effectiveDate;
    private String impact; // low, medium, high
    private LocalDateTime createdAt;
}
