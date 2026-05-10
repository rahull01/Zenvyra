package com.complianceai.controller;

import com.complianceai.dto.request.ScanRequest;
import com.complianceai.dto.response.ComplianceScoreResponse;
import com.complianceai.dto.response.ScanResponse;
import com.complianceai.service.ScanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/scan")
@RequiredArgsConstructor
public class ScanController {

    private final ScanService scanService;

    // FREE: No auth required - lead generation
    @PostMapping("/free")
    public ResponseEntity<ComplianceScoreResponse> freeScan(@RequestBody ScanRequest request) {
        return ResponseEntity.ok(scanService.performFreeScan(request.getUrl()));
    }

    // AUTHENTICATED: Full scan with details
    @PostMapping("/full")
    public ResponseEntity<ScanResponse> fullScan(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ScanRequest request) {
        return ResponseEntity.ok(
                scanService.performFullScan(userDetails.getUsername(), request));
    }

    @GetMapping("/history/{websiteId}")
    public ResponseEntity<?> getScanHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String websiteId) {
        return ResponseEntity.ok(
                scanService.getScanHistory(userDetails.getUsername(), websiteId));
    }
}
