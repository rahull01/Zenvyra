package com.zenvyra.controller;

import com.zenvyra.dto.request.TelemetryHeartbeatRequest;
import com.zenvyra.service.UserEngagementTelemetryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/v1/telemetry")
@RequiredArgsConstructor
public class TelemetryController {
    private final UserEngagementTelemetryService telemetryService;

    @PostMapping("/heartbeat")
    public ResponseEntity<Map<String, String>> heartbeat(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TelemetryHeartbeatRequest request) {
        telemetryService.ingestHeartbeat(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(Map.of("status", "queued"));
    }
}
