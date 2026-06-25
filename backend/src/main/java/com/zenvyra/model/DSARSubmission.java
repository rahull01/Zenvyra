package com.zenvyra.model;

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
@Document(collection = "dsar_submissions")
public class DSARSubmission {
    @Id
    private String id;
    
    @Indexed
    private String formId;
    
    private String name;
    private String email;
    private String requestType; // Access, Delete, Correct, etc.
    private Map<String, Object> customFields;
    private String status; // new, in-progress, completed, rejected
    private String notes;
    private LocalDateTime dueDate;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
}
