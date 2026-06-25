package com.zenvyra.controller;

import com.zenvyra.model.ComplianceCertificate;
import com.zenvyra.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @PostMapping("/issue/{websiteId}")
    public ResponseEntity<ComplianceCertificate> issueCertificate(
            Authentication auth, @PathVariable String websiteId) {
        return ResponseEntity.ok(certificateService.issueCertificate(auth.getName(), websiteId));
    }

    @GetMapping("/verify/{token}")
    public ResponseEntity<ComplianceCertificate> verifyCertificate(@PathVariable String token) {
        return ResponseEntity.ok(certificateService.verifyCertificate(token));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ComplianceCertificate>> getMyCertificates(Authentication auth) {
        return ResponseEntity.ok(certificateService.getUserCertificates(auth.getName()));
    }
}
