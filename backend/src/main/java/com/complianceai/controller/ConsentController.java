package com.complianceai.controller;

import com.complianceai.model.ConsentLog;
import com.complianceai.service.ConsentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consent")
@RequiredArgsConstructor
public class ConsentController {

    private final ConsentService consentService;

    @PostMapping("/log")
    public ResponseEntity<Void> logConsent(@RequestBody ConsentLog log, HttpServletRequest request) {
        // Resolve Real IP Address
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // Handle potential comma-separated list in X-Forwarded-For
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        log.setIp(ip);

        // Resolve Country Code from Cloudflare or header proxies
        String country = request.getHeader("CF-IPCountry");
        if (country == null || country.isEmpty() || "unknown".equalsIgnoreCase(country)) {
            country = request.getHeader("X-Country-Code");
        }
        if (country == null || country.isEmpty()) {
            country = "US"; // Default fallback region
        }
        log.setCountry(country.toUpperCase());
        
        log.setUserAgent(request.getHeader("User-Agent"));
        consentService.logConsent(log);
        return ResponseEntity.ok().build();
    }

    // Private endpoint for the dashboard to see logs
    @GetMapping("/logs/{bannerId}")
    public ResponseEntity<List<ConsentLog>> getLogs(@PathVariable String bannerId) {
        return ResponseEntity.ok(consentService.getLogsByBanner(bannerId));
    }
}
