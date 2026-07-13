package com.zenvyra.controller;

import com.zenvyra.exception.ApiException;
import com.zenvyra.model.Organization;
import com.zenvyra.model.OrganizationMember;
import com.zenvyra.model.TeamInvite;
import com.zenvyra.repository.OrganizationMemberRepository;
import com.zenvyra.repository.OrganizationRepository;
import com.zenvyra.security.OrgSecurityService;
import com.zenvyra.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Public + authenticated endpoints for accepting team invites. The GET
 * endpoint is unauthenticated so that the accept-invite page can render
 * invite details (org name, role, expiry) before the invitee signs in.
 * The accept/revoke endpoints require authentication and a matching email.
 */
@RestController
@RequestMapping("/team/invite")
@RequiredArgsConstructor
public class TeamInviteController {

    private final TeamService teamService;
    private final OrganizationRepository organizationRepository;
    private final OrganizationMemberRepository organizationMemberRepository;
    private final OrgSecurityService orgSecurityService;

    @GetMapping("/{token}")
    public ResponseEntity<Map<String, Object>> getInvite(@PathVariable String token) {
        TeamInvite invite = teamService.getInviteByToken(token)
                .orElseThrow(() -> ApiException.notFound("Invite"));
        if (!"pending".equalsIgnoreCase(invite.getStatus())) {
            throw ApiException.badRequest("Invite has already been used or revoked");
        }
        if (invite.getExpiresAt() != null && invite.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw ApiException.badRequest("Invite has expired");
        }

        String orgName = organizationRepository.findById(invite.getOrganizationId())
                .map(Organization::getName).orElse("Unknown organization");

        Map<String, Object> body = new HashMap<>();
        body.put("role", invite.getRole());
        body.put("organizationId", invite.getOrganizationId());
        body.put("organizationName", orgName);
        body.put("expiresAt", invite.getExpiresAt());
        // Email is intentionally NOT returned to avoid email-enumeration leaks.
        return ResponseEntity.ok(body);
    }

    @PostMapping("/{token}/accept")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> acceptInvite(
            Authentication authentication,
            @PathVariable String token) {
        Organization org = teamService.acceptInvite(token, authentication.getName());
        OrganizationMember membership = organizationMemberRepository
                .findByOrganizationIdAndEmail(org.getId(), authentication.getName())
                .orElseThrow(() -> ApiException.internalError("Membership was not created"));

        Map<String, Object> body = new HashMap<>();
        body.put("organizationId", org.getId());
        body.put("organizationName", org.getName());
        body.put("role", membership.getRole());
        return ResponseEntity.ok(body);
    }

    @DeleteMapping("/{inviteId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> revokeInvite(
            Authentication authentication,
            @PathVariable String inviteId) {
        TeamInvite invite = teamService.getInviteById(inviteId)
                .orElseThrow(() -> ApiException.notFound("Invite"));
        if (invite.getOrganizationId() == null) {
            throw ApiException.badRequest("Invite has no organization binding");
        }
        if (!orgSecurityService.canManageMembers(authentication, invite.getOrganizationId())) {
            throw ApiException.forbidden("Only owners and admins can revoke invites");
        }
        teamService.revokeInvite(inviteId);
        Map<String, String> body = new HashMap<>();
        body.put("status", "revoked");
        return ResponseEntity.ok(body);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TeamInvite> createInvite(
            Authentication authentication,
            @RequestParam String organizationId,
            @RequestParam String email,
            @RequestParam(required = false, defaultValue = "MEMBER") String role) {
        if (!orgSecurityService.canManageMembers(authentication, organizationId)) {
            throw ApiException.forbidden("Only owners and admins can create invites");
        }
        TeamInvite invite = teamService.createInvite(
                organizationId, email, role, authentication.getName());
        return ResponseEntity.ok(invite);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<java.util.List<TeamInvite>> listInvites(
            Authentication authentication,
            @RequestParam String organizationId) {
        if (!orgSecurityService.canViewOrganization(authentication, organizationId)) {
            throw ApiException.forbidden("User is not a member of this organization");
        }
        return ResponseEntity.ok(teamService.getInvites(organizationId));
    }
}
