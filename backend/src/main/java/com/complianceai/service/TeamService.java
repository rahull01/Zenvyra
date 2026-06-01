package com.complianceai.service;

import com.complianceai.model.Team;
import com.complianceai.model.TeamInvite;
import com.complianceai.model.User;
import com.complianceai.repository.TeamInviteRepository;
import com.complianceai.repository.TeamRepository;
import com.complianceai.repository.UserRepository;
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
        return List.of(); 
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
                    throw new RuntimeException("Unauthorized: Only owners or admins can invite members.");
                }
            }

            if (team.getMembers() == null) {
                team.setMembers(new ArrayList<>());
            }

            // Check if already exists
            boolean exists = team.getMembers().stream().anyMatch(m -> m.getEmail().equalsIgnoreCase(email));
            if (exists) {
                throw new RuntimeException("User is already a member of this team.");
            }

            // In a real app we would lookup user by email. Let's look up or use mock userId.
            String userId = userRepository.findByEmail(email)
                    .map(User::getId)
                    .orElse(UUID.randomUUID().toString()); // Placeholder ID if user not registered yet

            team.getMembers().add(Team.Member.builder()
                    .userId(userId)
                    .email(email)
                    .role(role)
                    .joinedAt(LocalDateTime.now())
                    .permissions(List.of("READ", "WRITE"))
                    .build());

            team.setUpdatedAt(LocalDateTime.now());
            return teamRepository.save(team);
        }
        throw new RuntimeException("Team not found: " + teamId);
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
                    throw new RuntimeException("Unauthorized: Only owners or admins can remove members.");
                }
            }

            if (team.getMembers() != null) {
                team.getMembers().removeIf(m -> m.getUserId().equals(memberId));
                team.setUpdatedAt(LocalDateTime.now());
                teamRepository.save(team);
            }
            return;
        }
        throw new RuntimeException("Team not found: " + teamId);
    }
}
