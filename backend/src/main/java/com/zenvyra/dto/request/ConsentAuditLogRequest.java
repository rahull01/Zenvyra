package com.zenvyra.dto.request;

import lombok.Data;

import java.util.Map;

@Data
public class ConsentAuditLogRequest {
    private String siteId;
    private String bannerId;
    private String anonymousUserId;
    private String countryCode;
    private String country;
    private Map<String, Boolean> choices;
    private Object consentState;
}
