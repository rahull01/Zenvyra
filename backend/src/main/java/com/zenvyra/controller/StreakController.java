package com.zenvyra.controller;

import com.zenvyra.model.ComplianceStreak;
import com.zenvyra.service.StreakService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/streaks")
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
