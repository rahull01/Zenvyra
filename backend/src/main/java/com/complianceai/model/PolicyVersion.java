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
@Document(collection = "policy_versions")
public class PolicyVersion {
    @Id
    private String id;
    
    @Indexed
    private String policyId;
    
    private Integer version;
    private String content; // HTML content
    private String changes; // Summary of changes
    private String authorId;
    private LocalDateTime createdAt;
}
