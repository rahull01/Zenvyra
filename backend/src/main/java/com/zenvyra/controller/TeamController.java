package com.zenvyra.controller;

import com.zenvyra.model.Team;
import com.zenvyra.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/team")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    public ResponseEntity<Team> createTeam(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Team team) {
        return ResponseEntity.ok(teamService.createTeam(userDetails.getUsername(), team));
    }

    @GetMapping
    public ResponseEntity<List<Team>> getUserTeams(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(teamService.getUserTeams(userDetails.getUsername()));
    }

    @PostMapping("/{teamId}/members")
    public ResponseEntity<Team> addMember(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String teamId,
            @RequestParam String email,
            @RequestParam String role) {
        return ResponseEntity.ok(teamService.addMember(userDetails.getUsername(), teamId, email, role));
    }

    @DeleteMapping("/{teamId}/members/{memberId}")
    public ResponseEntity<String> removeMember(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String teamId,
            @PathVariable String memberId) {
        teamService.removeMember(userDetails.getUsername(), teamId, memberId);
        return ResponseEntity.ok("Member removed");
    }
}
