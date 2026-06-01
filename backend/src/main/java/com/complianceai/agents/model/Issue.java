package com.complianceai.agents.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Issue {
    private String type;
    private String severity;
    private String description;
    private String fix;
}
