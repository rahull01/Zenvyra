package com.zenvyra.controller;

import com.zenvyra.model.Website;
import com.zenvyra.model.PlanType;
import com.zenvyra.security.RequiresCompliancePlan;
import com.zenvyra.service.WebsiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/websites")
@RequiredArgsConstructor
public class WebsiteController {

    private final WebsiteService websiteService;

    @PostMapping
    @RequiresCompliancePlan(value = PlanType.FREE, enforceWebsiteQuota = true)
    public ResponseEntity<Website> addWebsite(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Website website) {
        return ResponseEntity.ok(websiteService.addWebsite(userDetails.getUsername(), website));
    }

    @GetMapping
    public ResponseEntity<List<Website>> getUserWebsites(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(websiteService.getUserWebsites(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Website> getWebsiteById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {
        return ResponseEntity.ok(websiteService.getWebsiteById(userDetails.getUsername(), id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Website> updateWebsite(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id,
            @RequestBody Website website) {
        return ResponseEntity.ok(websiteService.updateWebsite(userDetails.getUsername(), id, website));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWebsite(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {
        websiteService.deleteWebsite(userDetails.getUsername(), id);
        return ResponseEntity.ok("Website deleted");
    }

    @PostMapping("/{id}/scan")
    public ResponseEntity<Website> triggerManualScan(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {
        return ResponseEntity.ok(websiteService.triggerScan(userDetails.getUsername(), id));
    }
}
