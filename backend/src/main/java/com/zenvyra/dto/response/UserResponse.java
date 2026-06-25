package com.zenvyra.dto.response;

import com.zenvyra.model.PlanStatus;
import com.zenvyra.model.PlanType;
import com.zenvyra.model.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class UserResponse {
    private String id;
    private String email;
    private String fullName;
    private String role;
    private String accountType;
    private String status;
    private String companyName;
    private String industry;
    private String employeeCount;
    private String websiteUrl;
    private String primaryRegion;
    private String platform;
    private List<String> aiUsage;
    private Boolean onboardingCompleted;
    private Boolean emailVerified;
    private LocalDateTime emailVerifiedAt;
    private String plan;
    private PlanType planType;
    private PlanStatus planStatus;
    private Integer maxWebsitesAllowed;
    private List<String> featuresEnabled;
    private Boolean crossDomainConsentSharingEnabled;
    private LocalDateTime billingPeriodEnd;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;

    public static UserResponse from(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .accountType(user.getAccountType())
                .status(user.getStatus())
                .companyName(user.getCompanyName())
                .industry(user.getIndustry())
                .employeeCount(user.getEmployeeCount())
                .websiteUrl(user.getWebsiteUrl())
                .primaryRegion(user.getPrimaryRegion())
                .platform(user.getPlatform())
                .aiUsage(user.getAiUsage())
                .onboardingCompleted(user.getOnboardingCompleted())
                .emailVerified(user.getEmailVerified())
                .emailVerifiedAt(user.getEmailVerifiedAt())
                .plan(user.getPlan())
                .planType(user.getPlanType())
                .planStatus(user.getPlanStatus())
                .maxWebsitesAllowed(user.getMaxWebsitesAllowed())
                .featuresEnabled(user.getFeaturesEnabled())
                .crossDomainConsentSharingEnabled(user.getCrossDomainConsentSharingEnabled())
                .billingPeriodEnd(user.getBillingPeriodEnd())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }
}
