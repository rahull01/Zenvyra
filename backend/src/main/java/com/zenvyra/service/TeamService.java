package com.zenvyra.service;

import com.zenvyra.exception.ApiException;
import com.zenvyra.model.Team;
import com.zenvyra.model.TeamInvite;
import com.zenvyra.model.User;
import com.zenvyra.repository.TeamInviteRepository;
import com.zenvyra.repository.TeamRepository;
import com.zenvyra.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamInviteRepository inviteRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    public TeamInvite createInvite(String organizationId, String email, String role, String invitedBy) {
        TeamInvite invite = TeamInvite.builder()
                .organizationId(organizationId)
                .email(email)
                .role(role)
                .invitedBy(invitedBy)
                .token(UUID.randomUUID().toString())
                .status("pending")
                .expiresAt(LocalDateTime.now().plusDays(7))
                .createdAt(LocalDateTime.now())
                .build();
        return inviteRepository.save(invite);
    }

    public List<TeamInvite> getInvites(String organizationId) {
        return inviteRepository.findByOrganizationId(organizationId);
    }

    public void revokeInvite(String inviteId) {
        inviteRepository.deleteById(inviteId);
    }

    public List<User> getTeamMembers(String organizationId) {
        List<Team> teams = teamRepository.findByOwnerId(organizationId);
        List<String> emails = teams.stream()
                .flatMap(team -> team.getMembers() == null ? java.util.stream.Stream.<Team.Member>empty() : team.getMembers().stream())
                .map(Team.Member::getEmail)
                .filter(email -> email != null && !email.isBlank())
                .distinct()
                .toList();
        return emails.stream()
                .map(userRepository::findByEmail)
                .flatMap(Optional::stream)
                .toList();
    }

    public Team createTeam(String ownerId, Team team) {
        team.setOwnerId(ownerId);
        team.setCreatedAt(LocalDateTime.now());
        team.setUpdatedAt(LocalDateTime.now());
        if (team.getMembers() == null) {
            team.setMembers(new ArrayList<>());
        }
        // Add owner as a default admin member
        team.getMembers().add(Team.Member.builder()
                .userId(ownerId)
                .email(ownerId) // or resolve actual email
                .role("admin")
                .joinedAt(LocalDateTime.now())
                .permissions(List.of("ALL"))
                .build());
        return teamRepository.save(team);
    }

    public List<Team> getUserTeams(String ownerId) {
        return teamRepository.findByOwnerIdOrMembersUserId(ownerId, ownerId);
    }

    public Team addMember(String requesterId, String teamId, String email, String role) {
        Optional<Team> optTeam = teamRepository.findById(teamId);
        if (optTeam.isPresent()) {
            Team team = optTeam.get();
            // Verify permission (only owner/admin can add member)
            if (!team.getOwnerId().equals(requesterId)) {
                boolean isAdmin = team.getMembers().stream()
                        .anyMatch(m -> m.getUserId().equals(requesterId) && "admin".equalsIgnoreCase(m.getRole()));
                if (!isAdmin) {
                    throw ApiException.forbidden("Only owners or admins can invite members");
                }
            }

            if (team.getMembers() == null) {
                team.setMembers(new ArrayList<>());
            }

            // Check if already exists
            boolean exists = team.getMembers().stream().anyMatch(m -> m.getEmail().equalsIgnoreCase(email));
            if (exists) {
                throw ApiException.conflict("User is already a member of this team");
            }

            User user = userRepository.findByEmail(email.trim().toLowerCase())
                    .orElseThrow(() -> ApiException.badRequest("Team member must register before being added"));

            team.getMembers().add(Team.Member.builder()
                    .userId(user.getEmail())
                    .email(user.getEmail())
                    .role(role)
                    .joinedAt(LocalDateTime.now())
                    .permissions(List.of("READ", "WRITE"))
                    .build());

            team.setUpdatedAt(LocalDateTime.now());
            return teamRepository.save(team);
        }
        throw ApiException.notFound("Team");
    }

    public void removeMember(String requesterId, String teamId, String memberId) {
        Optional<Team> optTeam = teamRepository.findById(teamId);
        if (optTeam.isPresent()) {
            Team team = optTeam.get();
            // Verify permission
            if (!team.getOwnerId().equals(requesterId)) {
                boolean isAdmin = team.getMembers().stream()
                        .anyMatch(m -> m.getUserId().equals(requesterId) && "admin".equalsIgnoreCase(m.getRole()));
                if (!isAdmin) {
                    throw ApiException.forbidden("Only owners or admins can remove members");
                }
            }

            if (team.getMembers() != null) {
                team.getMembers().removeIf(m -> m.getUserId().equals(memberId));
                team.setUpdatedAt(LocalDateTime.now());
                teamRepository.save(team);
            }
            return;
        }
        throw ApiException.notFound("Team");
    }
}
