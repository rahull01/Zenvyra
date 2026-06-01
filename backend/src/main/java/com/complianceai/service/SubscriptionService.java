package com.complianceai.service;

import com.complianceai.client.DodoPaymentsClient;
import com.complianceai.dto.response.SubscriptionResponse;
import com.complianceai.model.ProcessedWebhook;
import com.complianceai.model.Subscription;
import com.complianceai.model.User;
import com.complianceai.repository.ProcessedWebhookRepository;
import com.complianceai.repository.SubscriptionRepository;
import com.complianceai.repository.UserRepository;
import com.complianceai.security.StandardWebhookSignatureVerifier;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final DodoPaymentsClient dodoClient;
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final StandardWebhookSignatureVerifier standardWebhookSignatureVerifier;
    private final ProcessedWebhookRepository processedWebhookRepository;

    @Value("${dodo.webhook-secret:}")
    private String webhookSecret;

    @Value("${dodo.products.starter}")
    private String starterProductId;

    @Value("${dodo.products.pro}")
    private String proProductId;

    @Value("${dodo.products.enterprise}")
    private String enterpriseProductId;

    @Value("${app.url:http://localhost:3000}")
    private String appUrl;

    public String createCheckoutSession(String userEmail, String plan) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String productId = getProductIdForPlan(plan);

        String customerId = user.getCustomerId();
        if (customerId == null) {
            customerId = dodoClient.createCustomer(user.getEmail(), user.getFullName());
            user.setCustomerId(customerId);
            userRepository.save(user);
        }

        String successUrl = appUrl + "/dashboard?success=true";
        String cancelUrl = appUrl + "/pricing?canceled=true";

        return dodoClient.createCheckoutSession(customerId, productId, successUrl, cancelUrl);
    }

    public SubscriptionResponse getCurrentSubscription(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Subscription subscription = subscriptionRepository.findByUserId(user.getId()).orElse(null);

        if (subscription == null) {
            return SubscriptionResponse.builder()
                    .plan("free")
                    .status("active")
                    .build();
        }

        return SubscriptionResponse.builder()
                .plan(subscription.getPlan())
                .status(subscription.getStatus())
                .currentPeriodStart(subscription.getCurrentPeriodStart())
                .currentPeriodEnd(subscription.getCurrentPeriodEnd())
                .amount(subscription.getAmount())
                .currency(subscription.getCurrency())
                .build();
    }

    public void cancelSubscription(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Subscription subscription = subscriptionRepository.findByUserId(user.getId()).orElse(null);
        if (subscription != null) {
            dodoClient.cancelSubscription(subscription.getDodoSubscriptionId());
            subscription.setStatus("cancelled");
            subscription.setCancelledAt(LocalDateTime.now());
            subscriptionRepository.save(subscription);

            user.setPlan("free");
            userRepository.save(user);
        }
    }

    public String upgradePlan(String userEmail, String plan) {
        cancelSubscription(userEmail);
        return createCheckoutSession(userEmail, plan);
    }

    public void processWebhookEvent(String webhookId, String webhookTimestamp, String webhookSignatureHeader,
            String legacySignatureHeader, String rawPayload) {
        if (webhookSecret == null || webhookSecret.isBlank()) {
            throw new IllegalStateException("Webhook signing secret is not configured (dodo.webhook-secret)");
        }

        boolean standardVerified = false;
        if (webhookSignatureHeader != null && !webhookSignatureHeader.isBlank()) {
            if (webhookId == null || webhookId.isBlank() || webhookTimestamp == null || webhookTimestamp.isBlank()) {
                throw new IllegalArgumentException("Standard webhooks require webhook-id and webhook-timestamp headers");
            }
            standardVerified = standardWebhookSignatureVerifier.verify(
                    webhookId, webhookTimestamp, webhookSignatureHeader, rawPayload, webhookSecret);
        }

        boolean legacyVerified = legacySignatureHeader != null
                && !legacySignatureHeader.isBlank()
                && verifyLegacyHexSignature(legacySignatureHeader, rawPayload);

        if (!standardVerified && !legacyVerified) {
            throw new SecurityException("Invalid webhook signature");
        }

        if (webhookId != null && !webhookId.isBlank() && processedWebhookRepository.existsById(webhookId)) {
            log.info("Skipping already-processed webhook {}", webhookId);
            return;
        }

        try {
            JsonNode event = objectMapper.readTree(rawPayload);
            String eventType = event.get("type").asText();
            JsonNode data = event.get("data");

            switch (eventType) {
                case "subscription.created" -> handleSubscriptionCreated(data);
                case "subscription.updated" -> handleSubscriptionUpdated(data);
                case "subscription.cancelled" -> handleSubscriptionCancelled(data);
                case "payment.succeeded" -> handlePaymentSucceeded(data);
                case "payment.failed" -> handlePaymentFailed(data);
                default -> log.info("Unhandled event type: {}", eventType);
            }

            if (webhookId != null && !webhookId.isBlank()) {
                try {
                    processedWebhookRepository.save(ProcessedWebhook.builder()
                            .id(webhookId)
                            .processedAt(Instant.now())
                            .build());
                } catch (DuplicateKeyException e) {
                    log.debug("Webhook {} already recorded", webhookId);
                }
            }
        } catch (Exception e) {
            log.error("Failed to process webhook", e);
            throw new RuntimeException("Webhook processing failed");
        }
    }

    private void handleSubscriptionCreated(JsonNode data) {
        String customerId = data.get("customer").get("id").asText();
        String subscriptionId = data.get("subscription").get("id").asText();
        String plan = data.get("subscription").get("plan").asText();

        User user = userRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Subscription subscription = Subscription.builder()
                .id(subscriptionId)
                .userId(user.getId())
                .customerId(customerId)
                .plan(plan)
                .status("active")
                .dodoSubscriptionId(subscriptionId)
                .createdAt(LocalDateTime.now())
                .build();

        subscriptionRepository.save(subscription);

        user.setPlan(plan);
        user.setSubscriptionId(subscriptionId);
        userRepository.save(user);

        log.info("Subscription created for user: {}", user.getEmail());
    }

    private void handleSubscriptionUpdated(JsonNode data) {
        String subscriptionId = data.get("subscription").get("id").asText();
        String status = data.get("subscription").get("status").asText();
        
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        
        subscription.setStatus(status);
        subscription.setUpdatedAt(LocalDateTime.now());
        subscriptionRepository.save(subscription);
        
        log.info("Subscription updated: {}", subscriptionId);
    }

    private void handleSubscriptionCancelled(JsonNode data) {
        String subscriptionId = data.get("subscription").get("id").asText();
        
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        
        subscription.setStatus("cancelled");
        subscription.setCancelledAt(LocalDateTime.now());
        subscriptionRepository.save(subscription);
        
        User user = userRepository.findById(subscription.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPlan("free");
        userRepository.save(user);
        
        log.info("Subscription cancelled: {}", subscriptionId);
    }

    private void handlePaymentSucceeded(JsonNode data) {
        String customerId = data.get("customer").get("id").asText();
        User user = userRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Subscription subscription = subscriptionRepository.findByUserId(user.getId()).orElse(null);
        if (subscription != null) {
            subscription.setStatus("active");
            subscription.setUpdatedAt(LocalDateTime.now());
            subscriptionRepository.save(subscription);
        }
        
        log.info("Payment succeeded for user: {}", user.getEmail());
    }

    private void handlePaymentFailed(JsonNode data) {
        String customerId = data.get("customer").get("id").asText();
        User user = userRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Subscription subscription = subscriptionRepository.findByUserId(user.getId()).orElse(null);
        if (subscription != null) {
            subscription.setStatus("past_due");
            subscriptionRepository.save(subscription);
        }
    }

    private boolean verifyLegacyHexSignature(String signatureHeader, String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(decodeWebhookSecretMaterial(webhookSecret), "HmacSHA256"));
            byte[] expected = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            byte[] provided = decodeHex(signatureHeader.trim());
            return provided != null && MessageDigest.isEqual(expected, provided);
        } catch (Exception e) {
            log.error("Legacy webhook signature verification failed", e);
            return false;
        }
    }

    private static byte[] decodeWebhookSecretMaterial(String secret) {
        String s = secret.trim();
        if (s.startsWith("whsec_")) {
            return Base64.getDecoder().decode(s.substring("whsec_".length()));
        }
        return s.getBytes(StandardCharsets.UTF_8);
    }

    private static byte[] decodeHex(String hex) {
        if (hex.length() % 2 != 0) {
            return null;
        }
        int len = hex.length() / 2;
        byte[] data = new byte[len];
        for (int i = 0; i < len; i++) {
            int digit1 = Character.digit(hex.charAt(i * 2), 16);
            int digit2 = Character.digit(hex.charAt(i * 2 + 1), 16);
            if (digit1 < 0 || digit2 < 0) {
                return null;
            }
            data[i] = (byte) ((digit1 << 4) + digit2);
        }
        return data;
    }

    private String getProductIdForPlan(String plan) {
        return switch (plan.toLowerCase()) {
            case "starter" -> starterProductId;
            case "pro" -> proProductId;
            case "enterprise" -> enterpriseProductId;
            default -> throw new RuntimeException("Invalid plan: " + plan);
        };
    }
}
