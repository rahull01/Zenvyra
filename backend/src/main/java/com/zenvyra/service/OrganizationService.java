package com.zenvyra.service;

import com.zenvyra.model.Organization;
import com.zenvyra.model.User;
import com.zenvyra.repository.OrganizationRepository;
import com.zenvyra.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;

    public Organization getOrganizationByOwner(String ownerId) {
        String resolvedOwnerId = resolveOwnerId(ownerId);
        return organizationRepository.findByOwnerId(resolvedOwnerId)
                .orElseGet(() -> createDefaultOrganization(resolvedOwnerId));
    }

    public Organization updateOrganization(String ownerId, Organization organization) {
        String resolvedOwnerId = resolveOwnerId(ownerId);
        Organization existing = getOrganizationByOwner(resolvedOwnerId);
        existing.setName(organization.getName());
        existing.setIndustry(organization.getIndustry());
        existing.setSize(organization.getSize());
        existing.setWebsite(organization.getWebsite());
        existing.setTimezone(organization.getTimezone());
        existing.setBranding(organization.getBranding());
        existing.setUpdatedAt(LocalDateTime.now());
        return organizationRepository.save(existing);
    }

    public Organization createOrUpdateDefaultOrganization(User user, String websiteUrl) {
        Organization organization = getOrganizationByOwner(user.getId());
        organization.setName(user.getCompanyName() != null && !user.getCompanyName().isBlank()
                ? user.getCompanyName()
                : user.getFullName() + " Workspace");
        organization.setIndustry(user.getIndustry());
        organization.setSize(user.getEmployeeCount());
        organization.setWebsite(websiteUrl);
        organization.setPlan(user.getPlan());
        organization.setUpdatedAt(LocalDateTime.now());
        return organizationRepository.save(organization);
    }

    private Organization createDefaultOrganization(String ownerId) {
        Organization organization = Organization.builder()
                .ownerId(ownerId)
                .name("Default Organization")
                .plan("free")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return organizationRepository.save(organization);
    }

    private String resolveOwnerId(String ownerIdOrEmail) {
        if (ownerIdOrEmail == null || ownerIdOrEmail.isBlank()) {
            return ownerIdOrEmail;
        }
        return userRepository.findByEmail(ownerIdOrEmail.trim().toLowerCase())
                .map(User::getId)
                .orElse(ownerIdOrEmail);
    }
}
