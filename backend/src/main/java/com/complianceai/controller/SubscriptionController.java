package com.complianceai.controller;

import com.complianceai.dto.request.CreateSubscriptionRequest;
import com.complianceai.dto.response.SubscriptionResponse;
import com.complianceai.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createCheckout(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CreateSubscriptionRequest request) {

        String checkoutUrl = subscriptionService.createCheckoutSession(
                userDetails.getUsername(),
                request.getPlan());

        return ResponseEntity.ok(Map.of("checkoutUrl", checkoutUrl));
    }

    @GetMapping("/current")
    public ResponseEntity<SubscriptionResponse> getCurrentSubscription(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                subscriptionService.getCurrentSubscription(userDetails.getUsername()));
    }

    @PostMapping("/cancel")
    public ResponseEntity<String> cancelSubscription(
            @AuthenticationPrincipal UserDetails userDetails) {
        subscriptionService.cancelSubscription(userDetails.getUsername());
        return ResponseEntity.ok("Subscription cancelled");
    }

    @PostMapping("/upgrade")
    public ResponseEntity<Map<String, String>> upgradePlan(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CreateSubscriptionRequest request) {

        String checkoutUrl = subscriptionService.upgradePlan(
                userDetails.getUsername(),
                request.getPlan());

        return ResponseEntity.ok(Map.of("checkoutUrl", checkoutUrl));
    }
}
