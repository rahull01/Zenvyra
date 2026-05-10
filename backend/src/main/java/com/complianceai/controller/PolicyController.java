package com.complianceai.controller;

import com.complianceai.dto.request.PolicyRequest;
import com.complianceai.model.Policy;
import com.complianceai.service.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    @PostMapping("/generate")
    public ResponseEntity<Policy> generatePolicy(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PolicyRequest request) {
        return ResponseEntity.ok(policyService.generatePolicy(userDetails.getUsername(), request));
    }

    @GetMapping
    public ResponseEntity<List<Policy>> getUserPolicies(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(policyService.getUserPolicies(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Policy> getPolicyById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {
        return ResponseEntity.ok(policyService.getPolicyById(userDetails.getUsername(), id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Policy> updatePolicy(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id,
            @RequestBody Policy policy) {
        return ResponseEntity.ok(policyService.updatePolicy(userDetails.getUsername(), id, policy));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePolicy(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {
        policyService.deletePolicy(userDetails.getUsername(), id);
        return ResponseEntity.ok("Policy deleted");
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<Policy> publishPolicy(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {
        return ResponseEntity.ok(policyService.publishPolicy(userDetails.getUsername(), id));
    }
}
