package com.zenvyra.agents.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentResponse {
    private String rawData;
    private String region;
    @Builder.Default
    private List<String> laws = new ArrayList<>();
    @Builder.Default
    private List<Issue> issues = new ArrayList<>();
    private int riskScore;
    private String report;
    @Builder.Default
    private List<String> fixes = new ArrayList<>();
}
