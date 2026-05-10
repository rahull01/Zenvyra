package com.complianceai.service;

import com.complianceai.model.Team;
import com.complianceai.model.User;
import com.complianceai.repository.TeamRepository;
import com.complianceai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public Team createTeam(String userEmail, Team team) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        team.setOwnerId(user.getId());
        team.setMembers(new ArrayList<>());
        team.getMembers().add(Team.Member.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .role("admin")
                .joinedAt(LocalDateTime.now())
                .build());
        team.setCreatedAt(LocalDateTime.now());

        return teamRepository.save(team);
    }

    public List<Team> getUserTeams(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return teamRepository.findByOwnerIdOrMembersUserId(user.getId(), user.getId());
    }

    public Team addMember(String userEmail, String teamId, String memberEmail, String role) {
        User owner = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (!team.getOwnerId().equals(owner.getId())) {
            throw new RuntimeException("Only team owner can add members");
        }

        User member = userRepository.findByEmail(memberEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        team.getMembers().add(Team.Member.builder()
                .userId(member.getId())
                .email(memberEmail)
                .role(role)
                .joinedAt(LocalDateTime.now())
                .build());

        emailService.sendTeamInvitation(memberEmail, team.getName(), owner.getFullName());

        return teamRepository.save(team);
    }

    public void removeMember(String userEmail, String teamId, String memberId) {
        User owner = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (!team.getOwnerId().equals(owner.getId())) {
            throw new RuntimeException("Only team owner can remove members");
        }

        team.getMembers().removeIf(m -> m.getUserId().equals(memberId));
        teamRepository.save(team);
    }
}
