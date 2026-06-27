package com.zenvyra.dto.response;

import com.zenvyra.model.AiActAssessment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiActAssessmentResponse {
    private String id;
    private String systemId;
    private String riskCategory;
    private Double confidence;
    private Integer readinessScore;
    private Map<String, Boolean> readinessBreakdown;
    private List<String> riskSignals;
    private List<String> requiredTransparencyNotices;
    private List<String> humanOversightGaps;
    private List<String> documentationGaps;
    private List<String> dataHandlingGaps;
    private List<String> userDisclosureGaps;
    private List<String> monitoringGaps;
    private List<String> evidenceItems;
    private List<String> nextActions;
    private String counselReviewWarning;
    private LocalDateTime assessedAt;

    public static AiActAssessmentResponse from(AiActAssessment assessment) {
        return AiActAssessmentResponse.builder()
                .id(assessment.getId())
                .systemId(assessment.getSystemId())
                .riskCategory(assessment.getRiskCategory())
                .confidence(assessment.getConfidence())
                .readinessScore(assessment.getReadinessScore())
                .readinessBreakdown(assessment.getReadinessBreakdown())
                .riskSignals(assessment.getRiskSignals())
                .requiredTransparencyNotices(assessment.getRequiredTransparencyNotices())
                .humanOversightGaps(assessment.getHumanOversightGaps())
                .documentationGaps(assessment.getDocumentationGaps())
                .dataHandlingGaps(assessment.getDataHandlingGaps())
                .userDisclosureGaps(assessment.getUserDisclosureGaps())
                .monitoringGaps(assessment.getMonitoringGaps())
                .evidenceItems(assessment.getEvidenceItems())
                .nextActions(assessment.getNextActions())
                .counselReviewWarning(assessment.getCounselReviewWarning())
                .assessedAt(assessment.getAssessedAt())
                .build();
    }
}
