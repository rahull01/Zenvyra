package com.zenvyra.controller;

import com.zenvyra.service.AiActExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai-act/export")
@RequiredArgsConstructor
public class AiActExportController {

    private final AiActExportService exportService;

    @GetMapping("/systems/{systemId}/transparency-notice")
    public ResponseEntity<String> transparencyNotice(@AuthenticationPrincipal UserDetails userDetails,
                                                     @PathVariable String systemId) {
        String body = exportService.exportTransparencyNotice(userDetails, systemId);
        return markdownResponse(body, "transparency-notice.md");
    }

    @GetMapping("/systems/{systemId}/system-card")
    public ResponseEntity<String> systemCard(@AuthenticationPrincipal UserDetails userDetails,
                                             @PathVariable String systemId) {
        String body = exportService.exportSystemCard(userDetails, systemId);
        return markdownResponse(body, "system-card.md");
    }

    @GetMapping("/systems/{systemId}/evidence-checklist")
    public ResponseEntity<String> evidenceChecklist(@AuthenticationPrincipal UserDetails userDetails,
                                                    @PathVariable String systemId) {
        String body = exportService.exportEvidenceChecklist(userDetails, systemId);
        return markdownResponse(body, "evidence-checklist.md");
    }

    @GetMapping("/assessments/{assessmentId}/summary")
    public ResponseEntity<String> assessmentSummary(@AuthenticationPrincipal UserDetails userDetails,
                                                    @PathVariable String assessmentId) {
        String body = exportService.exportAssessmentSummary(userDetails, assessmentId);
        return markdownResponse(body, "assessment-summary.md");
    }

    @GetMapping("/systems/{systemId}/proof-pack")
    public ResponseEntity<String> proofPack(@AuthenticationPrincipal UserDetails userDetails,
                                            @PathVariable String systemId) {
        String body = exportService.exportFullProofPack(userDetails, systemId);
        return markdownResponse(body, "ai-act-proof-pack.md");
    }

    private ResponseEntity<String> markdownResponse(String body, String filename) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_MARKDOWN);
        headers.setContentDispositionFormData("attachment", filename);
        return ResponseEntity.ok()
                .headers(headers)
                .body(body);
    }
}
