package com.zenvyra.controller;

import com.zenvyra.model.Organization;
import com.zenvyra.model.AiSystemInventory;
import com.zenvyra.model.User;
import com.zenvyra.model.Website;
import com.zenvyra.repository.AiSystemInventoryRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.service.EmailService;
import com.zenvyra.service.OrganizationService;
import com.zenvyra.service.WebsiteService;
import com.zenvyra.util.ValidationUtil;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/onboarding")
@RequiredArgsConstructor
public class OnboardingController {

    private final OrganizationService organizationService;
    private final WebsiteService websiteService;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final AiSystemInventoryRepository aiSystemInventoryRepository;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OnboardingRequest {
        private String orgName;
        private String businessLegalName;
        private String tradingName;
        private String supportEmail;
        private String businessAddress;
        private String countryState;
        private String siteUrl;
        private String platform;
        private List<String> targetRegions;
        private String privacyPolicyUrl;
        private String cookiePolicyUrl;
        private String termsUrl;
        private String cookieBannerProvider;
        private List<String> trackerTools;
        private String dsarEmail;
        private List<String> aiToolsUsed;
        private String platformAccessWillingness;
        private String industry;
        private List<String> selectedRegs;
        private List<String> inviteEmails;
    }

    @PostMapping
    public ResponseEntity<String> completeOnboarding(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody OnboardingRequest request) {

        String userEmail = userDetails.getUsername();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> com.zenvyra.exception.ApiException.unauthorized("User not found"));

        // 1. Provision / Update Organization
        Organization org = Organization.builder()
                .name(firstNonBlank(request.getBusinessLegalName(), request.getOrgName(), request.getTradingName(), user.getCompanyName()))
                .industry(request.getIndustry())
                .website(request.getSiteUrl())
                .build();
        organizationService.updateOrganization(user.getId(), org);

        // 2. Add properties
        if (request.getSiteUrl() != null && !request.getSiteUrl().isBlank()) {
            String normalizedUrl = ValidationUtil.normalizeUrl(request.getSiteUrl());
            boolean exists = websiteService.getUserWebsites(userEmail).stream()
                    .anyMatch(existing -> normalizedUrl.equalsIgnoreCase(existing.getUrl()));
            if (!exists) {
                Website website = Website.builder()
                        .name(firstNonBlank(request.getTradingName(), request.getBusinessLegalName(), request.getOrgName(), "Primary Website") + " Property")
                        .url(request.getSiteUrl())
                        .scanFrequency("weekly")
                        .build();
                websiteService.addWebsite(userEmail, website);
            }
            user.setWebsiteUrl(normalizedUrl);
        }

        user.setCompanyName(firstNonBlank(request.getBusinessLegalName(), request.getTradingName(), user.getCompanyName()));
        user.setIndustry(request.getIndustry());
        user.setPrimaryRegion(request.getTargetRegions() != null && !request.getTargetRegions().isEmpty()
                ? String.join(", ", request.getTargetRegions())
                : user.getPrimaryRegion());
        user.setPlatform(request.getPlatform());
        user.setAiUsage(request.getAiToolsUsed());
        user.setOnboardingCompleted(true);
        user.setUpdatedAt(java.time.LocalDateTime.now());
        userRepository.save(user);

        seedAiInventoryFromOnboarding(user, request);

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

    private void seedAiInventoryFromOnboarding(User user, OnboardingRequest request) {
        if (request.getAiToolsUsed() == null || request.getAiToolsUsed().isEmpty()) {
            return;
        }

        Set<String> existingNames = aiSystemInventoryRepository.findByUserId(user.getId()).stream()
                .map(AiSystemInventory::getSystemName)
                .filter(name -> name != null && !name.isBlank())
                .map(name -> name.trim().toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());

        for (String tool : request.getAiToolsUsed()) {
            if (tool == null || tool.isBlank() || "No AI".equalsIgnoreCase(tool.trim())) {
                continue;
            }

            String systemName = tool.trim();
            if (existingNames.contains(systemName.toLowerCase(Locale.ROOT))) {
                continue;
            }

            AiSystemInventory system = onboardingAiSystem(user, request, systemName);
            aiSystemInventoryRepository.save(system);
            existingNames.add(systemName.toLowerCase(Locale.ROOT));
        }
    }

    private AiSystemInventory onboardingAiSystem(User user, OnboardingRequest request, String systemName) {
        String normalized = systemName.toLowerCase(Locale.ROOT);
        boolean userFacing = normalized.contains("chatbot")
                || normalized.contains("support")
                || normalized.contains("recommendation")
                || normalized.contains("content");
        boolean automatedDecisioning = normalized.contains("scoring")
                || normalized.contains("decision");
        boolean euUsersAffected = hasRegion(request.getTargetRegions(), "EU")
                || hasRegion(request.getTargetRegions(), "UK")
                || hasRegion(request.getTargetRegions(), "Global");
        LocalDateTime now = LocalDateTime.now();

        return AiSystemInventory.builder()
                .userId(user.getId())
                .organizationId(user.getEmail())
                .systemName(systemName)
                .purpose("Captured during onboarding as reported AI usage")
                .useCase("Onboarding intake: " + systemName)
                .countries(request.getTargetRegions())
                .euUsersAffected(euUsersAffected)
                .userFacingAiInteraction(userFacing)
                .automatedDecisionMaking(automatedDecisioning)
                .humanOversight(false)
                .transparencyNoticePublished(false)
                .technicalDocumentationReady(false)
                .riskAssessmentCompleted(false)
                .logsEvidenceRetained(false)
                .monitoringEnabled(false)
                .financeUse(automatedDecisioning)
                .dataCategoriesSentToAi(List.of("onboarding intake pending data mapping"))
                .createdAt(now)
                .updatedAt(now)
                .build();
    }

    private boolean hasRegion(List<String> regions, String region) {
        return regions != null && regions.stream().anyMatch(value -> region.equalsIgnoreCase(value));
    }

    private String firstNonBlank(String... values) {
        if (values == null) {
            return null;
        }
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value.trim();
            }
        }
        return null;
    }
}
