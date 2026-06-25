package com.zenvyra.controller;

import com.zenvyra.service.ComplianceExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/admin/compliance/export")
@RequiredArgsConstructor
public class ComplianceExportController {

    private final ComplianceExportService complianceExportService;

    @GetMapping("/{siteId}")
    public ResponseEntity<Map<String, Object>> exportSiteReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String siteId) {
        Map<String, Object> report = complianceExportService.exportSiteReport(userDetails.getUsername(), siteId);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                        .filename("compliance-readiness-" + siteId + ".json")
                        .build()
                        .toString())
                .body(report);
    }
}
