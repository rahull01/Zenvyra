package com.complianceai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "organizations")
public class Organization {
    @Id
    private String id;
    private String name;
    private String logo;
    private String website;
    private String industry;
    private String size;
    private String ownerId;
    private String customDomain;
    private boolean domainVerified;
    private Branding branding;
    private String timezone;
    private String language;
    private String dateFormat;
    private String plan; // free, starter, pro, enterprise
    private String billingCycle; // monthly, annual
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Branding {
        private String primaryColor;
        private String secondaryColor;
        private String logoPlacement;
    }
}
