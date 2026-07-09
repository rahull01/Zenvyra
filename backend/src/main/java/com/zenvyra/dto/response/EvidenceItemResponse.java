package com.zenvyra.dto.response;

import com.zenvyra.model.CounselReviewStatus;
import com.zenvyra.model.EvidenceItemStatus;
import com.zenvyra.model.EvidenceItemType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvidenceItemResponse {

    private String id;
    private String userId;
    private String organizationId;
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
