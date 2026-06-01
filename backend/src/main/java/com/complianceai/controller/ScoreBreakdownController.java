package com.complianceai.controller;

import com.complianceai.dto.response.ScoreBreakdownResponse;
import com.complianceai.service.ScoreBreakdownService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/score")
@RequiredArgsConstructor
public class ScoreBreakdownController {

    private final ScoreBreakdownService scoreBreakdownService;

    @GetMapping("/breakdown/{websiteId}")
    public ResponseEntity<ScoreBreakdownResponse> getBreakdown(@PathVariable String websiteId) {
        return ResponseEntity.ok(scoreBreakdownService.getBreakdown(websiteId));
    }
}
