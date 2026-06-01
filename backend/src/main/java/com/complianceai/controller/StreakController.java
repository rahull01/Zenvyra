package com.complianceai.controller;

import com.complianceai.model.ComplianceStreak;
import com.complianceai.service.StreakService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/streaks")
@RequiredArgsConstructor
public class StreakController {

    private final StreakService streakService;

    @GetMapping("/{websiteId}")
    public ResponseEntity<ComplianceStreak> getStreak(@PathVariable String websiteId) {
        ComplianceStreak streak = streakService.getStreak(websiteId);
        if (streak == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(streak);
    }
}
