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
@Document(collection = "scan_audit_logs")
public class ScanAuditLog {
    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String websiteId;

    private String websiteUrl;
    private String action;
    private Double score;
    private Integer issueCount;
    private String status;
    private String message;
    private LocalDateTime createdAt;
}
