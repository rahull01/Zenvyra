package com.zenvyra.dto.response;

import com.zenvyra.model.Website;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceScoreResponse {
    private String url;
    private Double score;
    private List<Website.ComplianceIssue> issues;
    private LocalDateTime scanDate;
    private List<String> recommendations;
}