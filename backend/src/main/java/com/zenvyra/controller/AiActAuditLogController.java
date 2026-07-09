package com.zenvyra.controller;

import com.zenvyra.dto.response.AiActAuditLogResponse;
import com.zenvyra.service.AiActAuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ai-act/audit")
@RequiredArgsConstructor
public class AiActAuditLogController {

    private final AiActAuditService service;

    @GetMapping("/system/{systemId}")
    public List<AiActAuditLogResponse> listBySystem(@AuthenticationPrincipal UserDetails userDetails,
                                                    @PathVariable String systemId) {
        return service.findBySystem(userDetails, systemId);
    }

    @GetMapping("/system/{systemId}/export")
    public List<AiActAuditLogResponse> exportBySystem(@AuthenticationPrincipal UserDetails userDetails,
                                                      @PathVariable String systemId) {
        return service.exportBySystem(userDetails, systemId);
    }
}
