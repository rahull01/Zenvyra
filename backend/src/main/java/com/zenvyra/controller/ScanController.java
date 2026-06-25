package com.zenvyra.controller;

import com.zenvyra.dto.request.ScanRequest;
import com.zenvyra.dto.response.ComplianceScoreResponse;
import com.zenvyra.dto.response.ScanResponse;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.User;
import com.zenvyra.model.WebsiteScanResult;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteScanResultRepository;
import com.zenvyra.service.ScanService;
import com.zenvyra.service.TrackerScanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/scan")
@RequiredArgsConstructor
public class ScanController {

    private final ScanService scanService;
    private final TrackerScanService trackerScanService;
    private final WebsiteScanResultRepository websiteScanResultRepository;
    private final UserRepository userRepository;

    // FREE: No auth required - lead generation
    @PostMapping("/free")
    public ResponseEntity<ComplianceScoreResponse> freeScan(@RequestBody ScanRequest request) {
        return ResponseEntity.ok(scanService.performFreeScan(request.getUrl()));
    }

    @GetMapping("/free")
    public ResponseEntity<ComplianceScoreResponse> freeScanGet(@RequestParam("url") String url) {
        return ResponseEntity.ok(scanService.performFreeScan(url));
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

    // AUTHENTICATED: Trigger tracker background scan
    @PostMapping("/trackers")
    public ResponseEntity<WebsiteScanResult> scanTrackers(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ScanRequest request) {
        
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> ApiException.unauthorized("User not found"));

        String normalizedUrl = trackerScanService.normalizeAndValidateUrl(request.getUrl());

        WebsiteScanResult scanResult = WebsiteScanResult.builder()
                .userId(user.getId())
                .targetUrl(normalizedUrl)
                .status(WebsiteScanResult.ScanStatus.PENDING)
                .scannedAt(LocalDateTime.now())
                .build();

        scanResult = websiteScanResultRepository.save(scanResult);

        // Trigger background async scanning
        trackerScanService.runTrackerScanAsync(scanResult.getId(), normalizedUrl);

        return ResponseEntity.ok(scanResult);
    }

    // AUTHENTICATED: Get tracker scan result by ID
    @GetMapping("/trackers/{id}")
    public ResponseEntity<WebsiteScanResult> getTrackerScanResult(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {
        
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> ApiException.unauthorized("User not found"));

        WebsiteScanResult scanResult = websiteScanResultRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Scan result not found"));

        if (!scanResult.getUserId().equals(user.getId())) {
            throw ApiException.forbidden("You do not have access to this scan result");
        }

        return ResponseEntity.ok(scanResult);
    }

    // AUTHENTICATED: List tracker scan history for this user
    @GetMapping("/trackers")
    public ResponseEntity<List<WebsiteScanResult>> getTrackerScans(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> ApiException.unauthorized("User not found"));

        List<WebsiteScanResult> results = websiteScanResultRepository.findByUserId(user.getId());
        return ResponseEntity.ok(results);
    }
}
