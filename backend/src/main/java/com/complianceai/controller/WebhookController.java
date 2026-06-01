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
            @RequestHeader(value = "webhook-id", required = false) String webhookId,
            @RequestHeader(value = "webhook-timestamp", required = false) String webhookTimestamp,
            @RequestHeader(value = "webhook-signature", required = false) String webhookSignature,
            @RequestHeader(value = "X-Dodo-Signature", required = false) String dodoSignature,
            @RequestHeader(value = "Stripe-Signature", required = false) String stripeSignature,
            @RequestBody String payload) {

        String legacySignature = dodoSignature != null && !dodoSignature.isBlank()
                ? dodoSignature
                : stripeSignature;

        log.info("Received payment webhook (webhook-id={})", webhookId);

        try {
            subscriptionService.processWebhookEvent(
                    webhookId,
                    webhookTimestamp,
                    webhookSignature,
                    legacySignature,
                    payload);
            return ResponseEntity.ok("Webhook processed");
        } catch (SecurityException e) {
            log.warn("Webhook signature verification failed");
            return ResponseEntity.status(401).body("Invalid signature");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            log.error("Webhook misconfiguration: {}", e.getMessage());
            return ResponseEntity.status(503).body("Webhook endpoint not configured");
        } catch (Exception e) {
            log.error("Webhook processing failed", e);
            return ResponseEntity.badRequest().body("Invalid webhook");
        }
    }
}
