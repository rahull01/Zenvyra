package com.zenvyra.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.ArrayList;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User implements UserDetails {
    @Id
    private String id;
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String fullName;
    private String role;
    private String accountType; // STANDARD, AGENCY
    private String status;
    private String companyName;
    private String industry;
    private String employeeCount;
    private String websiteUrl;
    private String primaryRegion;
    private String platform;
    private List<String> aiUsage;
    private Boolean onboardingCompleted;
    private java.time.LocalDateTime onboardingReminderSentAt;
    private Integer onboardingReminderCount;
    private Boolean emailVerified;
    private java.time.LocalDateTime emailVerifiedAt;
    private String plan;
    private PlanType planType;
    private PlanStatus planStatus;
    private Integer maxWebsitesAllowed;
    private List<String> featuresEnabled;
    @JsonIgnore
    private String dodoSubscriptionId;
    private java.time.LocalDateTime billingPeriodEnd;
    @JsonIgnore
    private String customerId;
    @JsonIgnore
    private String subscriptionId;
    private Boolean crossDomainConsentSharingEnabled;
    @Builder.Default
    private List<AgencyClientSite> agencyClientSites = new ArrayList<>();
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
    private java.time.LocalDateTime lastLoginAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AgencyClientSite {
        private String id;
        private String domainName;
        private String bundleTokenId;
        private String clientCompanyName;
        private String websiteId;
        private String bannerId;
        private WhiteLabelBranding branding;
        private java.time.LocalDateTime createdAt;
        private java.time.LocalDateTime updatedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhiteLabelBranding {
        private Boolean hidePoweredByBadge;
        private String primaryBrandColor;
        private String customPrivacyPolicyUrl;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(role != null ? role : "ROLE_USER"));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status != null && "active".equalsIgnoreCase(status.trim());
    }
}
