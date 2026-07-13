package com.zenvyra.security;

import com.zenvyra.domain.organization.OrganizationRole;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.OrganizationMember;
import com.zenvyra.repository.OrganizationMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Server-side authorization checks for organization-scoped resources.
 *
 * <p>Used from {@code @PreAuthorize} SpEL expressions on controllers and
 * service methods to enforce tenant isolation and role-based access.
 *
 * <p>Roles and their capabilities:
 * <ul>
 *   <li>{@link OrganizationRole#OWNER} — full control of the org.</li>
 *   <li>{@link OrganizationRole#ADMIN} — manage members and edit org.</li>
 *   <li>{@link OrganizationRole#MEMBER} — read and use org resources.</li>
 *   <li>{@link OrganizationRole#VIEWER} — read-only.</li>
 * </ul>
 *
 * <p>This bean is registered under the name {@code orgSecurityService} so
 * it can be referenced from SpEL, e.g.:
 * <pre>
 *   &#64;PreAuthorize("&#64;orgSecurityService.canManageOrganization(authentication, #organizationId)")
 * </pre>
 */
@Component("orgSecurityService")
@RequiredArgsConstructor
public class OrgSecurityService {

    private final OrganizationMemberRepository organizationMemberRepository;

    /**
     * Returns true if the authenticated user is a member of the given org.
     */
    public boolean isMember(Authentication authentication, String organizationId) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        String email = principalEmail(authentication);
        if (email == null || organizationId == null || organizationId.isBlank()) {
            return false;
        }
        return organizationMemberRepository.existsByOrganizationIdAndEmail(organizationId, email);
    }

    /**
     * Returns true if the authenticated user can VIEW the given org.
     * Owners, admins, members, and viewers all qualify.
     */
    public boolean canViewOrganization(Authentication authentication, String organizationId) {
        return memberRole(authentication, organizationId).isPresent();
    }

    /**
     * Returns true if the authenticated user can EDIT the given org.
     * Only OWNER and ADMIN qualify.
     */
    public boolean canManageOrganization(Authentication authentication, String organizationId) {
        return memberRole(authentication, organizationId)
                .filter(r -> r == OrganizationRole.OWNER || r == OrganizationRole.ADMIN)
                .isPresent();
    }

    /**
     * Returns true if the authenticated user can manage team members.
     * Only OWNER and ADMIN qualify.
     */
    public boolean canManageMembers(Authentication authentication, String organizationId) {
        return canManageOrganization(authentication, organizationId);
    }

    /**
     * Throws 403 if the user is not a member of the org. Used as defense
     * in depth at service layer after @PreAuthorize.
     */
    public void requireMember(Authentication authentication, String organizationId) {
        if (!isMember(authentication, organizationId)) {
            throw ApiException.forbidden("User is not a member of organization " + organizationId);
        }
    }

    /**
     * Looks up the {@link OrganizationMember} for the authenticated user
     * inside the given organization. Returns empty if the user is not a
     * member. Used by controllers that need the org id of the caller.
     */
    public Optional<OrganizationMember> findMembership(Authentication authentication, String organizationId) {
        if (authentication == null || !authentication.isAuthenticated() || organizationId == null) {
            return Optional.empty();
        }
        String email = principalEmail(authentication);
        if (email == null) {
            return Optional.empty();
        }
        return organizationMemberRepository.findByOrganizationIdAndEmail(organizationId, email);
    }

    private Optional<OrganizationRole> memberRole(Authentication authentication, String organizationId) {
        if (authentication == null || !authentication.isAuthenticated()
                || organizationId == null || organizationId.isBlank()) {
            return Optional.empty();
        }
        String email = principalEmail(authentication);
        if (email == null) {
            return Optional.empty();
        }
        return organizationMemberRepository.findByOrganizationIdAndEmail(organizationId, email)
                .map(OrganizationMember::getRole);
    }

    private static String principalEmail(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails ud) {
            return ud.getUsername();
        }
        if (principal instanceof String s && !s.isBlank()) {
            return s;
        }
        return null;
    }
}
