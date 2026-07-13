package com.zenvyra.service;

import com.zenvyra.domain.organization.OrganizationRole;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.Organization;
import com.zenvyra.model.OrganizationMember;
import com.zenvyra.model.Team;
import com.zenvyra.model.TeamInvite;
import com.zenvyra.model.User;
import com.zenvyra.repository.ActivityLogRepository;
import com.zenvyra.repository.OrganizationMemberRepository;
import com.zenvyra.repository.OrganizationRepository;
import com.zenvyra.repository.TeamInviteRepository;
import com.zenvyra.repository.TeamRepository;
import com.zenvyra.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeamServiceTest {

    @Mock private TeamInviteRepository inviteRepository;
    @Mock private UserRepository userRepository;
    @Mock private TeamRepository teamRepository;
    @Mock private OrganizationRepository organizationRepository;
    @Mock private OrganizationMemberRepository memberRepository;
    @Mock private ActivityLogRepository activityLogRepository;
    @Mock private EmailService emailService;

    private TeamService teamService;

    @BeforeEach
    void setUp() {
        teamService = new TeamService(inviteRepository, userRepository, teamRepository,
                organizationRepository, memberRepository, activityLogRepository, emailService);
    }

    @Test
    void createInvite_storesInviteAndSendsEmail() {
        when(organizationRepository.findById("org-1")).thenReturn(Optional.of(
                Organization.builder().id("org-1").name("Acme").build()));
        when(inviteRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        TeamInvite invite = teamService.createInvite("org-1", "new@example.com", "MEMBER", "admin@example.com");

        assertNotNull(invite.getToken());
        assertEquals("pending", invite.getStatus());
        assertEquals("org-1", invite.getOrganizationId());
        verify(emailService).sendTeamInviteEmail(eq("new@example.com"), any(),
                eq("Acme"), eq("MEMBER"));
        verify(activityLogRepository).save(any());
    }

    @Test
    void createInvite_rejectsDuplicateForExistingMember() {
        when(organizationRepository.findById("org-1")).thenReturn(Optional.of(
                Organization.builder().id("org-1").name("Acme").build()));
        when(memberRepository.existsByOrganizationIdAndEmail("org-1", "x@example.com")).thenReturn(true);

        assertThrows(ApiException.class,
                () -> teamService.createInvite("org-1", "x@example.com", "MEMBER", "admin@example.com"));
    }

    @Test
    void createInvite_rejectsDuplicatePendingInvite() {
        when(organizationRepository.findById("org-1")).thenReturn(Optional.of(
                Organization.builder().id("org-1").name("Acme").build()));
        when(inviteRepository.findByOrganizationIdAndEmailAndStatus(
                "org-1", "x@example.com", "pending"))
                .thenReturn(Optional.of(new TeamInvite()));

        assertThrows(ApiException.class,
                () -> teamService.createInvite("org-1", "x@example.com", "MEMBER", "admin@example.com"));
    }

    @Test
    void acceptInvite_createsMembershipAndMarksAccepted() {
        TeamInvite invite = TeamInvite.builder()
                .id("inv-1").organizationId("org-1").email("new@example.com")
                .role("MEMBER").status("pending")
                .expiresAt(LocalDateTime.now().plusDays(1))
                .createdAt(LocalDateTime.now()).token("tok-1").build();
        User user = User.builder().id("u-1").email("new@example.com").build();

        when(inviteRepository.findByToken("tok-1")).thenReturn(Optional.of(invite));
        when(userRepository.findByEmail("new@example.com")).thenReturn(Optional.of(user));
        when(organizationRepository.findById("org-1")).thenReturn(Optional.of(
                Organization.builder().id("org-1").name("Acme").build()));
        when(inviteRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Organization org = teamService.acceptInvite("tok-1", "new@example.com");

        assertEquals("org-1", org.getId());
        ArgumentCaptor<OrganizationMember> captor = ArgumentCaptor.forClass(OrganizationMember.class);
        verify(memberRepository).save(captor.capture());
        assertEquals("u-1", captor.getValue().getUserId());
        assertEquals(OrganizationRole.MEMBER, captor.getValue().getRole());
        assertEquals("accepted", invite.getStatus());
        verify(activityLogRepository).save(any());
    }

    @Test
    void acceptInvite_rejectsWhenEmailMismatch() {
        TeamInvite invite = TeamInvite.builder()
                .id("inv-1").organizationId("org-1").email("new@example.com")
                .role("MEMBER").status("pending")
                .expiresAt(LocalDateTime.now().plusDays(1))
                .token("tok-1").build();
        when(inviteRepository.findByToken("tok-1")).thenReturn(Optional.of(invite));

        assertThrows(ApiException.class,
                () -> teamService.acceptInvite("tok-1", "OTHER@example.com"));
    }

    @Test
    void acceptInvite_rejectsExpired() {
        TeamInvite invite = TeamInvite.builder()
                .id("inv-1").organizationId("org-1").email("x@example.com")
                .role("MEMBER").status("pending")
                .expiresAt(LocalDateTime.now().minusDays(1))
                .token("tok-1").build();
        when(inviteRepository.findByToken("tok-1")).thenReturn(Optional.of(invite));

        assertThrows(ApiException.class,
                () -> teamService.acceptInvite("tok-1", "x@example.com"));
    }

    @Test
    void acceptInvite_rejectsAlreadyAccepted() {
        TeamInvite invite = TeamInvite.builder()
                .id("inv-1").organizationId("org-1").email("x@example.com")
                .role("MEMBER").status("accepted")
                .expiresAt(LocalDateTime.now().plusDays(1))
                .token("tok-1").build();
        when(inviteRepository.findByToken("tok-1")).thenReturn(Optional.of(invite));

        assertThrows(ApiException.class,
                () -> teamService.acceptInvite("tok-1", "x@example.com"));
    }

    @Test
    void acceptInvite_rejectsUserThatDoesNotExist() {
        TeamInvite invite = TeamInvite.builder()
                .id("inv-1").organizationId("org-1").email("ghost@example.com")
                .role("MEMBER").status("pending")
                .expiresAt(LocalDateTime.now().plusDays(1))
                .token("tok-1").build();
        when(inviteRepository.findByToken("tok-1")).thenReturn(Optional.of(invite));
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        assertThrows(ApiException.class,
                () -> teamService.acceptInvite("tok-1", "ghost@example.com"));
    }

    @Test
    void addMember_writesAuditLog() {
        Team team = Team.builder()
                .id("t-1").ownerId("admin@example.com").organizationId("org-1")
                .members(new ArrayList<>()).build();
        User user = User.builder().id("u-1").email("new@example.com").build();

        when(teamRepository.findById("t-1")).thenReturn(Optional.of(team));
        when(userRepository.findByEmail("new@example.com")).thenReturn(Optional.of(user));
        when(teamRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        teamService.addMember("admin@example.com", "t-1", "new@example.com", "MEMBER");

        verify(activityLogRepository).save(any());
    }

    @Test
    void addMember_rejectsDuplicateMember() {
        Team team = Team.builder()
                .id("t-1").ownerId("admin@example.com").organizationId("org-1")
                .members(new ArrayList<>(List.of(
                        Team.Member.builder().userId("u-1").email("new@example.com")
                                .role(OrganizationRole.MEMBER).build())))
                .build();
        when(teamRepository.findById("t-1")).thenReturn(Optional.of(team));

        assertThrows(ApiException.class,
                () -> teamService.addMember("admin@example.com", "t-1", "new@example.com", "MEMBER"));
    }

    @Test
    void removeMember_writesAuditLog() {
        Team team = Team.builder()
                .id("t-1").ownerId("admin@example.com").organizationId("org-1")
                .members(new ArrayList<>(List.of(
                        Team.Member.builder().userId("u-1").email("member@example.com")
                                .role(OrganizationRole.MEMBER).build())))
                .build();
        when(teamRepository.findById("t-1")).thenReturn(Optional.of(team));

        teamService.removeMember("admin@example.com", "t-1", "u-1");

        verify(activityLogRepository).save(any());
    }

    @Test
    void createTeam_writesAuditLogAndStampsOrg() {
        when(memberRepository.findFirstByEmailOrderByCreatedAtAsc("owner@example.com"))
                .thenReturn(Optional.of(OrganizationMember.builder()
                        .organizationId("org-1").email("owner@example.com").build()));
        when(teamRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Team team = Team.builder().name("Marketing").members(new ArrayList<>()).build();
        Team saved = teamService.createTeam("owner@example.com", team);

        assertEquals("org-1", saved.getOrganizationId());
        verify(activityLogRepository).save(any());
    }
}
