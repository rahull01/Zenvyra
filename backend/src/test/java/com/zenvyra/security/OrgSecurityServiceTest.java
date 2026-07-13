package com.zenvyra.security;

import com.zenvyra.domain.organization.OrganizationRole;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.OrganizationMember;
import com.zenvyra.repository.OrganizationMemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrgSecurityServiceTest {

    @Mock
    private OrganizationMemberRepository repository;

    private OrgSecurityService service;

    @BeforeEach
    void setUp() {
        service = new OrgSecurityService(repository);
    }

    private static Authentication authFor(String email) {
        return new UsernamePasswordAuthenticationToken(
                email, null, List.of(new SimpleGrantedAuthority("ROLE_USER")));
    }

    private static Authentication anonymous() {
        return new AnonymousAuthenticationToken(
                "key", "anonymous",
                List.of(new SimpleGrantedAuthority("ROLE_ANONYMOUS")));
    }

    @Test
    void isMember_returnsTrueForExistingMembership() {
        when(repository.existsByOrganizationIdAndEmail("org-1", "u@example.com")).thenReturn(true);
        assertTrue(service.isMember(authFor("u@example.com"), "org-1"));
    }

    @Test
    void isMember_returnsFalseForNonMember() {
        when(repository.existsByOrganizationIdAndEmail("org-1", "u@example.com")).thenReturn(false);
        assertFalse(service.isMember(authFor("u@example.com"), "org-1"));
    }

    @Test
    void isMember_returnsFalseForNullAuthentication() {
        assertFalse(service.isMember(null, "org-1"));
    }

    @Test
    void isMember_returnsFalseForAnonymousAuthentication() {
        assertFalse(service.isMember(anonymous(), "org-1"));
    }

    @Test
    void isMember_returnsFalseForBlankOrgId() {
        assertFalse(service.isMember(authFor("u@example.com"), ""));
        assertFalse(service.isMember(authFor("u@example.com"), null));
    }

    @Test
    void canManageOrganization_ownerAndAdminAllowed() {
        for (OrganizationRole role : List.of(OrganizationRole.OWNER, OrganizationRole.ADMIN)) {
            when(repository.findByOrganizationIdAndEmail("org-1", "u@example.com"))
                    .thenReturn(Optional.of(member("org-1", "u@example.com", role)));
            assertTrue(service.canManageOrganization(authFor("u@example.com"), "org-1"),
                    "Role " + role + " should be allowed to manage org");
        }
    }

    @Test
    void canManageOrganization_memberAndViewerDenied() {
        for (OrganizationRole role : List.of(OrganizationRole.MEMBER, OrganizationRole.VIEWER)) {
            when(repository.findByOrganizationIdAndEmail("org-1", "u@example.com"))
                    .thenReturn(Optional.of(member("org-1", "u@example.com", role)));
            assertFalse(service.canManageOrganization(authFor("u@example.com"), "org-1"),
                    "Role " + role + " should NOT be allowed to manage org");
        }
    }

    @Test
    void canManageMembers_matchesManageOrganization() {
        when(repository.findByOrganizationIdAndEmail("org-1", "u@example.com"))
                .thenReturn(Optional.of(member("org-1", "u@example.com", OrganizationRole.MEMBER)));
        assertFalse(service.canManageMembers(authFor("u@example.com"), "org-1"));
    }

    @Test
    void canViewOrganization_anyRoleAllowed() {
        for (OrganizationRole role : OrganizationRole.values()) {
            when(repository.findByOrganizationIdAndEmail("org-1", "u@example.com"))
                    .thenReturn(Optional.of(member("org-1", "u@example.com", role)));
            assertTrue(service.canViewOrganization(authFor("u@example.com"), "org-1"));
        }
    }

    @Test
    void canViewOrganization_returnsFalseWhenNotMember() {
        when(repository.findByOrganizationIdAndEmail("org-1", "u@example.com"))
                .thenReturn(Optional.empty());
        assertFalse(service.canViewOrganization(authFor("u@example.com"), "org-1"));
    }

    @Test
    void requireMember_throwsWhenNotMember() {
        when(repository.existsByOrganizationIdAndEmail("org-1", "u@example.com")).thenReturn(false);
        assertThrows(ApiException.class,
                () -> service.requireMember(authFor("u@example.com"), "org-1"));
    }

    @Test
    void requireMember_doesNotThrowWhenMember() {
        when(repository.existsByOrganizationIdAndEmail("org-1", "u@example.com")).thenReturn(true);
        assertDoesNotThrow(() -> service.requireMember(authFor("u@example.com"), "org-1"));
    }

    @Test
    void findMembership_returnsEmptyForNonMember() {
        when(repository.findByOrganizationIdAndEmail("org-1", "u@example.com"))
                .thenReturn(Optional.empty());
        assertTrue(service.findMembership(authFor("u@example.com"), "org-1").isEmpty());
    }

    @Test
    void findMembership_returnsRowForMember() {
        OrganizationMember row = member("org-1", "u@example.com", OrganizationRole.OWNER);
        when(repository.findByOrganizationIdAndEmail("org-1", "u@example.com"))
                .thenReturn(Optional.of(row));
        Optional<OrganizationMember> result = service.findMembership(authFor("u@example.com"), "org-1");
        assertTrue(result.isPresent());
        assertEquals(OrganizationRole.OWNER, result.get().getRole());
    }

    private static OrganizationMember member(String orgId, String email, OrganizationRole role) {
        return OrganizationMember.builder()
                .organizationId(orgId)
                .email(email)
                .role(role)
                .status("active")
                .build();
    }
}
