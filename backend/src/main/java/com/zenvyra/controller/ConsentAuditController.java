package com.zenvyra.controller;

import com.zenvyra.dto.request.ConsentAuditLogRequest;
import com.zenvyra.service.ConsentAuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/consent")
@RequiredArgsConstructor
public class ConsentAuditController {

    private final ConsentAuditLogService consentAuditLogService;

    @PostMapping("/audit-log")
    public ResponseEntity<Map<String, String>> ingestConsentAudit(
            @RequestBody ConsentAuditLogRequest request,
            HttpServletRequest servletRequest) {
        consentAuditLogService.ingestAsync(request, resolveCountry(servletRequest));
        return ResponseEntity.accepted().body(Map.of("status", "accepted"));
    }

    private String resolveCountry(HttpServletRequest request) {
        String country = firstNonBlank(
                request.getHeader("CF-IPCountry"),
                request.getHeader("X-Country-Code"),
                request.getHeader("X-Vercel-IP-Country"),
                request.getHeader("CloudFront-Viewer-Country"));
        return country == null ? "XX" : country.toUpperCase();
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank() && !"unknown".equalsIgnoreCase(value)) {
                return value;
            }
        }
        return null;
    }
}
