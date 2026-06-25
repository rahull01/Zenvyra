package com.zenvyra.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CreateSetupPackageRequest {
    private String websiteId;
    private String websiteUrl;
    private String platform;
    private List<String> targetRegions;
    private String accessWillingness;
    private String currency;
}
