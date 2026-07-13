package com.zenvyra.controller;

import com.zenvyra.exception.ApiException;
import com.zenvyra.model.Team;
import com.zenvyra.repository.OrganizationMemberRepository;
import com.zenvyra.repository.TeamRepository;
import com.zenvyra.security.OrgSecurityService;
import com.zenvyra.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/team")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;
    private final TeamRepository teamRepository;
    private final OrganizationMemberRepository organizationMemberRepository;
    private final OrgSecurityService orgSecurityService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Team> createTeam(
            Authentication authentication,
            @RequestBody Team team) {
        return ResponseEntity.ok(teamService.createTeam(authentication.getName(), team));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Team>> getUserTeams(Authentication authentication) {
        return ResponseEntity.ok(teamService.getUserTeams(authentication.getName()));
    }

    @PostMapping("/{teamId}/members")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Team> addMember(
            Authentication authentication,
            @PathVariable String teamId,
            @RequestParam String email,
            @RequestParam String role) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> ApiException.notFound("Team"));
        if (team.getOrganizationId() == null) {
            throw ApiException.badRequest("Team has no organization binding");
        }
        orgSecurityService.requireMember(authentication, team.getOrganizationId());
        if (!orgSecurityService.canManageMembers(authentication, team.getOrganizationId())) {
            throw ApiException.forbidden("Only owners and admins can invite members");
        }
        return ResponseEntity.ok(teamService.addMember(authentication.getName(), teamId, email, role));
    }

    @DeleteMapping("/{teamId}/members/{memberId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> removeMember(
            Authentication authentication,
            @PathVariable String teamId,
            @PathVariable String memberId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> ApiException.notFound("Team"));
        if (team.getOrganizationId() == null) {
            throw ApiException.badRequest("Team has no organization binding");
        }
        orgSecurityService.requireMember(authentication, team.getOrganizationId());
        if (!orgSecurityService.canManageMembers(authentication, team.getOrganizationId())) {
            throw ApiException.forbidden("Only owners and admins can remove members");
        }
        teamService.removeMember(authentication.getName(), teamId, memberId);
        return ResponseEntity.ok("Member removed");
    }
}
