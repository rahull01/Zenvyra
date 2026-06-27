package com.zenvyra.dto.response;

import com.zenvyra.model.AiActAssessment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiActReadinessResponse {
    private Integer aiSystemsInventoried;
    private Long highRiskFlags;
    private Long missingTransparencyNotices;
    private Long humanOversightGaps;
    private String gpaiProviderDocumentationStatus;
    private String publicAiDisclosureReadiness;
    private Map<String, String> draftOutputs;
    private List<AiActAssessmentResponse> latestAssessments;
    private String disclaimer;

    @SuppressWarnings("unchecked")
    public static AiActReadinessResponse from(Map<String, Object> readiness) {
        List<AiActAssessmentResponse> latestAssessments = ((List<AiActAssessment>) readiness
                .getOrDefault("latestAssessments", List.of()))
                .stream()
                .map(AiActAssessmentResponse::from)
                .toList();

        return AiActReadinessResponse.builder()
                .aiSystemsInventoried(asInteger(readiness.get("aiSystemsInventoried")))
                .highRiskFlags(asLong(readiness.get("highRiskFlags")))
                .missingTransparencyNotices(asLong(readiness.get("missingTransparencyNotices")))
                .humanOversightGaps(asLong(readiness.get("humanOversightGaps")))
                .gpaiProviderDocumentationStatus(String.valueOf(readiness.getOrDefault("gpaiProviderDocumentationStatus", "not_started")))
                .publicAiDisclosureReadiness(String.valueOf(readiness.getOrDefault("publicAiDisclosureReadiness", "draft_needed")))
                .draftOutputs((Map<String, String>) readiness.getOrDefault("draftOutputs", Map.of()))
                .latestAssessments(latestAssessments)
                .disclaimer(String.valueOf(readiness.getOrDefault("disclaimer", "")))
                .build();
    }

    private static Integer asInteger(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }
        return 0;
    }

    private static Long asLong(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        return 0L;
    }
}
