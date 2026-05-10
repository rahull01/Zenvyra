package com.complianceai.controller;

import com.complianceai.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping({"/dodo/webhooks", "/webhooks/payment"})
@RequiredArgsConstructor
public class WebhookController {

    private final SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<String> handleWebhook(
            @RequestHeader(value = "X-Dodo-Signature", required = false) String dodoSignature,
            @RequestHeader(value = "Stripe-Signature", required = false) String stripeSignature,
            @RequestBody String payload) {
        String signature = dodoSignature != null ? dodoSignature : stripeSignature;

        log.info("Received Dodo webhook: {}", payload);

        try {
            if (signature == null || signature.isBlank()) {
                log.warn("Webhook signature missing");
                return ResponseEntity.badRequest().body("Missing signature");
            }

            subscriptionService.processWebhookEvent(signature, payload);
            return ResponseEntity.ok("Webhook processed");
        } catch (Exception e) {
            log.error("Webhook processing failed", e);
            return ResponseEntity.badRequest().body("Invalid webhook");
        }
    }
}
