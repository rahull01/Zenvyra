package com.zenvyra.dto.request;

import com.zenvyra.model.CounselReviewStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEvidenceItemRequest {

    private String title;
    private String description;
    private String owner;
    private String fileUrl;
    private String fileName;
    private String reviewerNotes;
    private CounselReviewStatus counselReviewStatus;
    private LocalDate dueDate;
}
