package com.complianceai.controller;

import com.complianceai.model.Alert;
import com.complianceai.service.MonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/monitoring")
@RequiredArgsConstructor
public class MonitoringController {

    private final MonitoringService monitoringService;

    @GetMapping("/alerts")
    public ResponseEntity<List<Alert>> getUserAlerts(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "false") boolean unreadOnly) {
        return ResponseEntity.ok(monitoringService.getUserAlerts(userDetails.getUsername(), unreadOnly));
    }

    @PutMapping("/alerts/{id}/read")
    public ResponseEntity<String> markAlertAsRead(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {
        monitoringService.markAlertAsRead(userDetails.getUsername(), id);
        return ResponseEntity.ok("Alert marked as read");
    }

    @GetMapping("/status")
    public ResponseEntity<?> getMonitoringStatus(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(monitoringService.getMonitoringStatus(userDetails.getUsername()));
    }

    @PostMapping("/toggle/{websiteId}")
    public ResponseEntity<String> toggleMonitoring(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String websiteId) {
        boolean enabled = monitoringService.toggleMonitoring(userDetails.getUsername(), websiteId);
        return ResponseEntity.ok("Monitoring " + (enabled ? "enabled" : "disabled"));
    }
}
