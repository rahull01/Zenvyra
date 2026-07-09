package com.zenvyra.dto.request;

import com.zenvyra.model.CounselReviewStatus;
import com.zenvyra.model.EvidenceItemStatus;
import com.zenvyra.model.EvidenceItemType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEvidenceItemRequest {

    @NotBlank(message = "System id is required")
    private String systemId;

    private String obligationId;

    @NotNull(message = "Type is required")
    private EvidenceItemType type;

    private EvidenceItemStatus status;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String fileUrl;
    private String fileName;
    private String owner;
    private String reviewerNotes;
    private CounselReviewStatus counselReviewStatus;
    private LocalDate dueDate;
}
