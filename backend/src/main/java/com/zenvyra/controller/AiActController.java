package com.zenvyra.controller;

import com.zenvyra.dto.request.AiSystemInventoryRequest;
import com.zenvyra.dto.response.AiActAssessmentResponse;
import com.zenvyra.dto.response.AiActReadinessResponse;
import com.zenvyra.dto.response.AiSystemInventoryResponse;
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

    @PostMapping("/systems")
    public AiSystemInventoryResponse create(@AuthenticationPrincipal UserDetails userDetails,
                                            @Valid @RequestBody AiSystemInventoryRequest request) {
        return AiSystemInventoryResponse.from(service.create(userDetails, request));
    }

    @GetMapping("/systems")
    public List<AiSystemInventoryResponse> systems(@AuthenticationPrincipal UserDetails userDetails) {
        return service.systems(userDetails).stream()
                .map(AiSystemInventoryResponse::from)
                .toList();
    }

    @GetMapping("/systems/{id}")
    public AiSystemInventoryResponse system(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String id) {
        return AiSystemInventoryResponse.from(service.system(userDetails, id));
    }

    @PutMapping("/systems/{id}")
    public AiSystemInventoryResponse update(@AuthenticationPrincipal UserDetails userDetails,
                                            @PathVariable String id,
                                            @Valid @RequestBody AiSystemInventoryRequest request) {
        return AiSystemInventoryResponse.from(service.update(userDetails, id, request));
    }

    @PostMapping("/systems/{id}/assess")
    public AiActAssessmentResponse assess(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String id) {
        return AiActAssessmentResponse.from(service.assess(userDetails, id));
    }

    @GetMapping("/assessments/{id}")
    public AiActAssessmentResponse assessment(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String id) {
        return AiActAssessmentResponse.from(service.assessment(userDetails, id));
    }

    @GetMapping("/readiness")
    public AiActReadinessResponse readiness(@AuthenticationPrincipal UserDetails userDetails) {
        return AiActReadinessResponse.from(service.readiness(userDetails));
    }
}
