package com.complianceai.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceIssue {

    private String type; // missing_cookie_banner, ssl_expired, etc.
    private String severity; // low, medium, high, critical
    private String title;
    private String description;
    private String fixSuggestion;
    private Boolean autoFixable;
    private boolean fixed;
    private LocalDateTime detectedAt;
    private LocalDateTime fixedAt;

    public boolean getFixed() {
        return fixed;
    }
}
