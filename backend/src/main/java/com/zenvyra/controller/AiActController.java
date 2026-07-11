package com.zenvyra.controller;

import com.zenvyra.dto.request.AiSystemInventoryRequest;
import com.zenvyra.dto.response.AiActAssessmentResponse;
import com.zenvyra.dto.response.AiActReadinessResponse;
import com.zenvyra.dto.response.AiSystemInventoryResponse;
import com.zenvyra.model.AiActCertificate;
import com.zenvyra.service.AiActCertificateService;
import com.zenvyra.service.AiActReadinessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ai-act")
@RequiredArgsConstructor
public class AiActController {

    private final AiActReadinessService service;
    private final AiActCertificateService certificateService;

    @PostMapping("/systems")
    public AiSystemInventoryResponse create(@AuthenticationPrincipal UserDetails userDetails,
                                            @Valid @RequestBody AiSystemInventoryRequest request) {
        return service.create(userDetails, request);
    }

    @GetMapping("/systems")
    public List<AiSystemInventoryResponse> systems(@AuthenticationPrincipal UserDetails userDetails) {
        return service.systems(userDetails);
    }

    @GetMapping("/systems/{id}")
    public AiSystemInventoryResponse system(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String id) {
        return service.system(userDetails, id);
    }

    @PutMapping("/systems/{id}")
    public AiSystemInventoryResponse update(@AuthenticationPrincipal UserDetails userDetails,
                                            @PathVariable String id,
                                            @Valid @RequestBody AiSystemInventoryRequest request) {
        return service.update(userDetails, id, request);
    }

    @PostMapping("/systems/{id}/assess")
    public AiActAssessmentResponse assess(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String id) {
        return service.assess(userDetails, id);
    }

    @GetMapping("/assessments/{id}")
    public AiActAssessmentResponse assessment(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String id) {
        return service.assessment(userDetails, id);
    }

    @GetMapping("/readiness")
    public AiActReadinessResponse readiness(@AuthenticationPrincipal UserDetails userDetails) {
        return service.readiness(userDetails);
    }

    @PostMapping("/systems/{systemId}/certificate")
    public AiActCertificate issueCertificate(@AuthenticationPrincipal UserDetails userDetails,
                                             @PathVariable String systemId) {
        return certificateService.issueCertificate(userDetails, systemId);
    }

    @DeleteMapping("/systems/{systemId}/certificate")
    public AiActCertificate revokeCertificate(@AuthenticationPrincipal UserDetails userDetails,
                                              @PathVariable String systemId,
                                              @RequestParam(value = "reason", required = false) String reason) {
        return certificateService.revokeCertificate(userDetails, systemId, reason);
    }

    @GetMapping("/systems/{systemId}/certificate")
    public AiActCertificate getCertificate(@AuthenticationPrincipal UserDetails userDetails,
                                           @PathVariable String systemId) {
        return certificateService.getSystemCertificate(userDetails, systemId);
    }
}
