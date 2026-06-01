package com.complianceai.controller;

import com.complianceai.model.Organization;
import com.complianceai.model.Website;
import com.complianceai.service.EmailService;
import com.complianceai.service.OrganizationService;
import com.complianceai.service.WebsiteService;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/onboarding")
@RequiredArgsConstructor
public class OnboardingController {

    private final OrganizationService organizationService;
    private final WebsiteService websiteService;
    private final EmailService emailService;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OnboardingRequest {
        private String orgName;
        private String siteUrl;
        private String industry;
        private List<String> selectedRegs;
        private List<String> inviteEmails;
    }

    @PostMapping
    public ResponseEntity<String> completeOnboarding(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody OnboardingRequest request) {

        String userEmail = userDetails.getUsername();

        // 1. Provision / Update Organization
        Organization org = Organization.builder()
                .name(request.getOrgName())
                .industry(request.getIndustry())
                .website(request.getSiteUrl())
                .build();
        organizationService.updateOrganization(userEmail, org);

        // 2. Add properties
        Website website = Website.builder()
                .name(request.getOrgName() + " Property")
                .url(request.getSiteUrl())
                .scanFrequency("weekly")
                .build();
        websiteService.addWebsite(userEmail, website);

        // 3. Fire Team Invites
        if (request.getInviteEmails() != null) {
            for (String invitee : request.getInviteEmails()) {
                if (invitee != null && !invitee.trim().isEmpty()) {
                    emailService.sendTeamInvitation(invitee.trim(), request.getOrgName(), userEmail);
                }
            }
        }

        return ResponseEntity.ok("Onboarding setup processed successfully.");
    }
}
