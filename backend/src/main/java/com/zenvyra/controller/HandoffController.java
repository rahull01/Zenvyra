package com.zenvyra.controller;

import com.zenvyra.service.HandoffService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class HandoffController {

    private final HandoffService handoffService;

    @GetMapping("/websites/{id}/handoff")
    public Map<String, Object> getHandoff(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String id) {
        return handoffService.handoff(userDetails.getUsername(), id);
    }

    @PostMapping("/websites/{id}/handoff/send")
    public Map<String, Object> sendHandoff(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String id) {
        return handoffService.sendHandoff(userDetails.getUsername(), id);
    }
}
