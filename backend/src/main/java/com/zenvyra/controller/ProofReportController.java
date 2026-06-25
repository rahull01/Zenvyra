package com.zenvyra.controller;

import com.zenvyra.service.ProofReportService;
import lombok.RequiredArgsConstructor;
import com.zenvyra.exception.ApiException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ProofReportController {

    private final ProofReportService proofReportService;

    @GetMapping("/proof-pack/{websiteId}")
    public Map<String, Object> proofPack(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String websiteId) {
        if (userDetails == null) {
            throw ApiException.unauthorized("Authentication required");
        }
        return proofReportService.proofPackForUser(userDetails.getUsername(), websiteId);
    }
}
