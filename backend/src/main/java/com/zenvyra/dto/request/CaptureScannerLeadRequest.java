package com.zenvyra.dto.request;

import lombok.Data;

@Data
public class CaptureScannerLeadRequest {
    private String fullName;
    private String email;
    private String websiteUrl;
    private Double readinessScore;
    private Integer issueCount;
    private String desiredPath;
}
