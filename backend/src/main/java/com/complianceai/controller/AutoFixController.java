package com.complianceai.controller;

import com.complianceai.dto.response.FixSuggestionResponse;
import com.complianceai.service.AutoFixService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fixes")
@RequiredArgsConstructor
public class AutoFixController {

    private final AutoFixService autoFixService;

    @GetMapping("/{websiteId}/{issueType}")
    public ResponseEntity<FixSuggestionResponse> getFix(
            @PathVariable String websiteId,
            @PathVariable String issueType) {
        return ResponseEntity.ok(autoFixService.getFixForIssue(websiteId, issueType));
    }
}
