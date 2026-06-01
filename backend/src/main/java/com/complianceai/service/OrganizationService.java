package com.complianceai.service;

import com.complianceai.model.Organization;
import com.complianceai.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;

    public Organization getOrganizationByOwner(String ownerId) {
        return organizationRepository.findByOwnerId(ownerId)
                .orElseGet(() -> createDefaultOrganization(ownerId));
    }

    public Organization updateOrganization(String ownerId, Organization organization) {
        Organization existing = getOrganizationByOwner(ownerId);
        existing.setName(organization.getName());
        existing.setIndustry(organization.getIndustry());
        existing.setSize(organization.getSize());
        existing.setWebsite(organization.getWebsite());
        existing.setTimezone(organization.getTimezone());
        existing.setBranding(organization.getBranding());
        existing.setUpdatedAt(LocalDateTime.now());
        return organizationRepository.save(existing);
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
}
