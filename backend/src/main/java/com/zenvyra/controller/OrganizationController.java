package com.zenvyra.controller;

import com.zenvyra.exception.ApiException;
import com.zenvyra.model.Organization;
import com.zenvyra.model.OrganizationMember;
import com.zenvyra.repository.OrganizationMemberRepository;
import com.zenvyra.security.OrgSecurityService;
import com.zenvyra.service.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/organization")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;
    private final OrganizationMemberRepository organizationMemberRepository;
    private final OrgSecurityService orgSecurityService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Organization> getOrganization(Authentication authentication) {
        OrganizationMember membership = primaryMembership(authentication);
        orgSecurityService.requireMember(authentication, membership.getOrganizationId());
        return ResponseEntity.ok(organizationService.getOrganizationByOwner(authentication.getName()));
    }

    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Organization> updateOrganization(
            Authentication authentication,
            @RequestBody Organization organization) {
        OrganizationMember membership = primaryMembership(authentication);
        if (!orgSecurityService.canManageOrganization(authentication, membership.getOrganizationId())) {
            throw ApiException.forbidden("Only owners and admins can edit the organization");
        }
        return ResponseEntity.ok(organizationService.updateOrganization(authentication.getName(), organization));
    }

    @GetMapping("/members")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OrganizationMember>> listMembers(Authentication authentication) {
        OrganizationMember membership = primaryMembership(authentication);
        orgSecurityService.requireMember(authentication, membership.getOrganizationId());
        return ResponseEntity.ok(organizationMemberRepository.findByOrganizationId(membership.getOrganizationId()));
    }

    /**
     * Resolves the authenticated user's primary {@link OrganizationMember}.
     * The user is identified by email (which matches the principal name in
     * our UserDetailsService). The first membership row by creation order
     * is treated as the user's primary organization.
     */
    private OrganizationMember primaryMembership(Authentication authentication) {
        return organizationMemberRepository
                .findFirstByEmailOrderByCreatedAtAsc(authentication.getName())
                .orElseThrow(() -> ApiException.notFound("Organization membership"));
    }
}
