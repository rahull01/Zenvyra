package com.zenvyra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ai_act_evidence_items")
public class EvidenceItem {
    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String organizationId;

    @Indexed
    private String systemId;

    private String obligationId;
    private EvidenceItemType type;
    private EvidenceItemStatus status;
    private String title;
    private String description;
    private String fileUrl;
    private String fileName;
    private String owner;
    private String reviewerNotes;
    private CounselReviewStatus counselReviewStatus;
    private LocalDate dueDate;
    private LocalDateTime uploadedAt;
    private LocalDateTime reviewedAt;
    private LocalDateTime approvedAt;
    private LocalDateTime staleAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
