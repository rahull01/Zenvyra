package com.zenvyra.controller;

import com.zenvyra.dto.response.ScoreBreakdownResponse;
import com.zenvyra.service.ScoreBreakdownService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/score")
@RequiredArgsConstructor
public class ScoreBreakdownController {

    private final ScoreBreakdownService scoreBreakdownService;

    @GetMapping("/breakdown/{websiteId}")
    public ResponseEntity<ScoreBreakdownResponse> getBreakdown(@PathVariable String websiteId) {
        return ResponseEntity.ok(scoreBreakdownService.getBreakdown(websiteId));
    }
}
