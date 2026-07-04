package com.zenvyra.dto.response;

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
    private Integer assessmentsCompleted;
    private Long highRiskFlags;
    private Integer overallReadinessScore;
    private String disclaimer;
    private Map<String, Object> draftOutputs;
    private List<Map<String, Object>> latestAssessments;
}
