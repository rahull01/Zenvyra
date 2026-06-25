package com.zenvyra.controller;

import com.zenvyra.model.Competitor;
import com.zenvyra.service.CompetitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/competitors")
@RequiredArgsConstructor
public class CompetitorController {

    private final CompetitorService competitorService;

    @PostMapping
    public ResponseEntity<Competitor> addCompetitor(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Competitor competitor) {
        return ResponseEntity.ok(competitorService.addCompetitor(userDetails.getUsername(), competitor));
    }

    @GetMapping
    public ResponseEntity<List<Competitor>> getUserCompetitors(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(competitorService.getUserCompetitors(userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeCompetitor(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {
        competitorService.removeCompetitor(userDetails.getUsername(), id);
        return ResponseEntity.ok("Competitor removed");
    }

    @GetMapping("/report")
    public ResponseEntity<?> getCompetitorReport(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(competitorService.generateReport(userDetails.getUsername()));
    }
}
