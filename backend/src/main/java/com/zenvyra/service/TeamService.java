package com.zenvyra.service;

import com.zenvyra.domain.organization.OrganizationRole;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.ActivityLog;
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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamInviteRepository inviteRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final OrganizationRepository organizationRepository;
    private final OrganizationMemberRepository organizationMemberRepository;
    private final ActivityLogRepository activityLogRepository;
    private final EmailService emailService;

    public TeamInvite createInvite(String organizationId, String email, String role, String invitedBy) {
        Organization org = organizationRepository.findById(organizationId)
                .orElseThrow(() -> ApiException.notFound("Organization"));

        // Disallow inviting an existing member.
        if (organizationMemberRepository.existsByOrganizationIdAndEmail(organizationId, email)) {
            throw ApiException.conflict("User is already a member of this organization");
        }
        // Disallow duplicate pending invites.
        inviteRepository.findByOrganizationIdAndEmailAndStatus(organizationId, email, "pending")
                .ifPresent(existing -> {
                    throw ApiException.conflict("A pending invite already exists for this email");
                });

        TeamInvite invite = TeamInvite.builder()
                .organizationId(organizationId)
                .email(email)
                .role(role == null ? OrganizationRole.MEMBER.name() : role)
                .invitedBy(invitedBy)
                .token(UUID.randomUUID().toString())
                .status("pending")
                .expiresAt(LocalDateTime.now().plusDays(7))
                .createdAt(LocalDateTime.now())
                .build();
        TeamInvite saved = inviteRepository.save(invite);

        try {
            emailService.sendTeamInviteEmail(
                    email, saved.getToken(), org.getName(), saved.getRole());
        } catch (Exception e) {
            log.warn("Failed to send invite email to {}: {}", email, e.getMessage());
        }

        logActivity(invitedBy, organizationId, "TEAM_INVITE_CREATED", saved.getId(),
                Map.of("email", email, "role", saved.getRole()));
        return saved;
    }

    public Optional<TeamInvite> getInviteByToken(String token) {
        return inviteRepository.findByToken(token);
    }

    public Optional<TeamInvite> getInviteById(String inviteId) {
        return inviteRepository.findById(inviteId);
    }

    public List<TeamInvite> getInvites(String organizationId) {
        return inviteRepository.findByOrganizationId(organizationId);
    }

    public void revokeInvite(String inviteId) {
        inviteRepository.deleteById(inviteId);
    }

    /**
     * Accept a pending invite. The supplied email must match the invite
     * email; the corresponding user must already exist (i.e. must have
     * signed up). The user is added to the org as an OrganizationMember
     * with the role from the invite, and the invite is marked accepted.
     */
    public Organization acceptInvite(String token, String acceptingEmail) {
        TeamInvite invite = inviteRepository.findByToken(token)
                .orElseThrow(() -> ApiException.notFound("Invite"));

        if (!"pending".equalsIgnoreCase(invite.getStatus())) {
            throw ApiException.badRequest("Invite is no longer pending");
        }
        if (invite.getExpiresAt() != null && invite.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw ApiException.badRequest("Invite has expired");
        }
        if (invite.getEmail() == null
                || !invite.getEmail().equalsIgnoreCase(acceptingEmail)) {
            // Do not reveal whether the invite exists for a different email.
            throw ApiException.forbidden("This invite is for a different email address");
        }

        User user = userRepository.findByEmail(acceptingEmail.trim().toLowerCase())
                .orElseThrow(() -> ApiException.badRequest(
                        "You need to sign up before accepting this invite"));

        OrganizationRole role;
        try {
            role = OrganizationRole.valueOf(invite.getRole() == null
                    ? "MEMBER" : invite.getRole().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException ex) {
            role = OrganizationRole.MEMBER;
        }

        OrganizationMember membership = OrganizationMember.builder()
                .organizationId(invite.getOrganizationId())
                .userId(user.getId())
                .email(user.getEmail())
                .role(role)
                .status("active")
                .invitedBy(invite.getInvitedBy())
                .invitedAt(invite.getCreatedAt())
                .joinedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        organizationMemberRepository.save(membership);

        invite.setStatus("accepted");
        inviteRepository.save(invite);

        if (user.getOrganizationId() == null) {
            user.setOrganizationId(invite.getOrganizationId());
            userRepository.save(user);
        }

        logActivity(user.getId(), invite.getOrganizationId(), "TEAM_INVITE_ACCEPTED",
                invite.getId(), Map.of("email", acceptingEmail, "role", role.name()));

        return organizationRepository.findById(invite.getOrganizationId())
                .orElseThrow(() -> ApiException.notFound("Organization"));
    }

    public List<User> getTeamMembers(String organizationId) {
        return organizationMemberRepository.findByOrganizationId(organizationId).stream()
                .map(m -> userRepository.findByEmail(m.getEmail()))
                .flatMap(Optional::stream)
                .distinct()
                .toList();
    }

    public Team createTeam(String ownerId, Team team) {
        team.setOwnerId(ownerId);
        if (team.getOrganizationId() == null) {
            team.setOrganizationId(organizationMemberRepository
                    .findFirstByEmailOrderByCreatedAtAsc(ownerId)
                    .map(OrganizationMember::getOrganizationId)
                    .orElse(null));
        }
        team.setCreatedAt(LocalDateTime.now());
        team.setUpdatedAt(LocalDateTime.now());
        if (team.getMembers() == null) {
            team.setMembers(new ArrayList<>());
        }
        // Add owner as a default admin member.
        team.getMembers().add(Team.Member.builder()
                .userId(ownerId)
                .email(ownerId)
                .role(OrganizationRole.ADMIN)
                .joinedAt(LocalDateTime.now())
                .permissions(List.of("ALL"))
                .build());
        Team saved = teamRepository.save(team);

        logActivity(ownerId, team.getOrganizationId(), "TEAM_CREATED", saved.getId(),
                Map.of("name", saved.getName()));
        return saved;
    }

    public List<Team> getUserTeams(String ownerId) {
        return teamRepository.findByOwnerIdOrMembersUserId(ownerId, ownerId);
    }

    public Team addMember(String requesterId, String teamId, String email, String role) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> ApiException.notFound("Team"));

        if (team.getMembers() == null) {
            team.setMembers(new ArrayList<>());
        }

        boolean exists = team.getMembers().stream()
                .anyMatch(m -> m.getEmail() != null && m.getEmail().equalsIgnoreCase(email));
        if (exists) {
            throw ApiException.conflict("User is already a member of this team");
        }

        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> ApiException.badRequest("Team member must register before being added"));

        OrganizationRole memberRole;
        try {
            memberRole = OrganizationRole.valueOf(role == null ? "MEMBER" : role.toUpperCase());
        } catch (IllegalArgumentException ex) {
            memberRole = OrganizationRole.MEMBER;
        }

        team.getMembers().add(Team.Member.builder()
                .userId(user.getEmail())
                .email(user.getEmail())
                .role(memberRole)
                .joinedAt(LocalDateTime.now())
                .permissions(List.of("READ", "WRITE"))
                .build());

        team.setUpdatedAt(LocalDateTime.now());
        Team saved = teamRepository.save(team);

        logActivity(requesterId, team.getOrganizationId(), "TEAM_MEMBER_ADDED",
                saved.getId(), Map.of("email", email, "role", memberRole.name()));
        return saved;
    }

    public void removeMember(String requesterId, String teamId, String memberId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> ApiException.notFound("Team"));

        Team.Member removed = team.getMembers() == null ? null
                : team.getMembers().stream()
                    .filter(m -> m.getUserId().equals(memberId)
                            || (m.getEmail() != null && m.getEmail().equals(memberId)))
                    .findFirst().orElse(null);

        if (team.getMembers() != null) {
            team.getMembers().removeIf(m -> m.getUserId().equals(memberId));
            team.setUpdatedAt(LocalDateTime.now());
            teamRepository.save(team);
        }

        logActivity(requesterId, team.getOrganizationId(), "TEAM_MEMBER_REMOVED",
                teamId, Map.of(
                        "memberId", memberId,
                        "email", removed != null && removed.getEmail() != null ? removed.getEmail() : ""));
    }

    private void logActivity(String actorUserId, String organizationId, String action,
                              String targetId, Map<String, ?> details) {
        try {
            activityLogRepository.save(ActivityLog.builder()
                    .userId(actorUserId)
                    .organizationId(organizationId)
                    .action(action)
                    .target(targetId)
                    .details(details == null ? Map.of() : Map.copyOf(details))
                    .timestamp(LocalDateTime.now())
                    .build());
        } catch (Exception e) {
            log.warn("Failed to write activity log entry {}: {}", action, e.getMessage());
        }
    }
}
