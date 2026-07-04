package com.zenvyra.controller;

import com.zenvyra.dto.request.AiSystemInventoryRequest;
import com.zenvyra.service.AiActReadinessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/ai-act")
@RequiredArgsConstructor
public class AiActController {

    private final AiActReadinessService service;

    @PostMapping("/systems")
    public Object create(@AuthenticationPrincipal UserDetails userDetails,
                         @Valid @RequestBody AiSystemInventoryRequest request) {
        return service.create(userDetails, request);
    }

    @GetMapping("/systems")
    public Object systems(@AuthenticationPrincipal UserDetails userDetails) {
        return service.systems(userDetails);
    }

    @GetMapping("/systems/{id}")
    public Object system(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String id) {
        return service.system(userDetails, id);
    }

    @PutMapping("/systems/{id}")
    public Object update(@AuthenticationPrincipal UserDetails userDetails,
                         @PathVariable String id,
                         @Valid @RequestBody AiSystemInventoryRequest request) {
        return service.update(userDetails, id, request);
    }

    @PostMapping("/systems/{id}/assess")
    public Object assess(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String id) {
        return service.assess(userDetails, id);
    }

    @GetMapping("/assessments/{id}")
    public Object assessment(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String id) {
        return service.assessment(userDetails, id);
    }

    @GetMapping("/readiness")
    public Object readiness(@AuthenticationPrincipal UserDetails userDetails) {
        return service.readiness(userDetails);
    }
}
