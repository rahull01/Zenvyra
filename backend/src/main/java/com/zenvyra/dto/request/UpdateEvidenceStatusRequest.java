package com.zenvyra.dto.request;

import com.zenvyra.model.EvidenceItemStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEvidenceStatusRequest {

    @NotNull(message = "Status is required")
    private EvidenceItemStatus status;

    private String reviewerNotes;
}
