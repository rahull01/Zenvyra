package com.complianceai.controller;

import com.complianceai.model.Policy;
import com.complianceai.model.PolicyVersion;
import com.complianceai.service.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    @PostMapping
    public ResponseEntity<Policy> createPolicy(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(policyService.createPolicy(
                userDetails.getUsername(),
                request.get("type"),
                request.get("name"),
                request.getOrDefault("language", "en"),
                request.get("websiteId")
        ));
    }

    @GetMapping
    public ResponseEntity<List<Policy>> getPolicies(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(policyService.getPolicies(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Policy> getPolicyById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {
        return ResponseEntity.ok(policyService.getPolicy(userDetails.getUsername(), id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Policy> updatePolicy(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id,
            @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(policyService.updatePolicy(userDetails.getUsername(), id, updates));
    }

    @PostMapping("/{id}/draft-ai")
    public ResponseEntity<PolicyVersion> draftWithAI(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(policyService.draftWithAI(id, request.get("prompt")));
    }
}
