package com.zenvyra.controller;

import com.zenvyra.model.AiActAssessment;
import com.zenvyra.model.AiSystemInventory;
import com.zenvyra.service.AiActReadinessService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai-act")
@RequiredArgsConstructor
public class AiActController {

    private final AiActReadinessService service;

    @PostMapping("/systems")
    public AiSystemInventory create(@AuthenticationPrincipal UserDetails userDetails, @RequestBody AiSystemInventory request) {
        return service.create(userDetails, request);
    }

    @GetMapping("/systems")
    public List<AiSystemInventory> systems(@AuthenticationPrincipal UserDetails userDetails) {
        return service.systems(userDetails);
    }

    @GetMapping("/systems/{id}")
    public AiSystemInventory system(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String id) {
        return service.system(userDetails, id);
    }

    @PutMapping("/systems/{id}")
    public AiSystemInventory update(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String id, @RequestBody AiSystemInventory request) {
        return service.update(userDetails, id, request);
    }

    @PostMapping("/systems/{id}/assess")
    public AiActAssessment assess(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String id) {
        return service.assess(userDetails, id);
    }

    @GetMapping("/assessments/{id}")
    public AiActAssessment assessment(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String id) {
        return service.assessment(userDetails, id);
    }

    @GetMapping("/readiness")
    public Map<String, Object> readiness(@AuthenticationPrincipal UserDetails userDetails) {
        return service.readiness(userDetails);
    }
}
