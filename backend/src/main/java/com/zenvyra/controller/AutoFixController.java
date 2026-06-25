package com.zenvyra.controller;

import com.zenvyra.dto.response.FixSuggestionResponse;
import com.zenvyra.service.AutoFixService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fixes")
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
