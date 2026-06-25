package com.zenvyra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ai_act_assessments")
public class AiActAssessment {
    @Id
    private String id;
    private String userId;
    private String systemId;
    private String riskCategory;
    private Double confidence;
    private List<String> requiredTransparencyNotices;
    private List<String> humanOversightGaps;
    private List<String> documentationGaps;
    private List<String> dataHandlingGaps;
    private List<String> userDisclosureGaps;
    private List<String> nextActions;
    private String counselReviewWarning;
    private LocalDateTime assessedAt;
}
