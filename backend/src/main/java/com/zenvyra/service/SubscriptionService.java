package com.zenvyra.service;

import com.zenvyra.client.DodoPaymentsClient;
import com.zenvyra.dto.response.SubscriptionResponse;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.ProcessedWebhook;
import com.zenvyra.model.PlanStatus;
import com.zenvyra.model.PlanType;
import com.zenvyra.model.SetupPackageOrder;
import com.zenvyra.model.Subscription;
import com.zenvyra.model.User;
import com.zenvyra.repository.ProcessedWebhookRepository;
import com.zenvyra.repository.SetupPackageOrderRepository;
import com.zenvyra.repository.SubscriptionRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.security.StandardWebhookSignatureVerifier;
import com.zenvyra.util.LogSanitizer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

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
    private final StringRedisTemplate stringRedisTemplate;
    private final SetupPackageOrderRepository setupPackageOrderRepository;
    private final EmailService emailService;

    @Value("${dodo.webhook-secret:}")
    private String webhookSecret;

    @Value("${dodo.products.pro}")
    private String proProductId;

    @Value("${dodo.products.growth:}")
    private String growthProductId;

    @Value("${dodo.products.agency:${dodo.products.enterprise:}}")
    private String agencyProductId;

    @Value("${app.url:http://localhost:3000}")
    private String appUrl;

    public String createCheckoutSession(String userEmail, String plan) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> ApiException.unauthorized("User not found"));

        String normalizedPlan = normalizePaidPlan(plan);
        String productId = getProductIdForPlan(normalizedPlan);

        String customerId = user.getCustomerId();
        if (customerId == null) {
            customerId = dodoClient.createCustomer(user.getEmail(), user.getFullName());
            user.setCustomerId(customerId);
            userRepository.save(user);
        }

        String successUrl = appUrl + "/dashboard/billing?success=true";
        String cancelUrl = appUrl + "/dashboard/billing?canceled=true";

        return dodoClient.createCheckoutSession(customerId, productId, successUrl, cancelUrl);
    }

    public SubscriptionResponse getCurrentSubscription(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> ApiException.unauthorized("User not found"));

        Subscription subscription = subscriptionRepository.findByUserId(user.getId()).orElse(null);

        if (subscription == null) {
            return SubscriptionResponse.builder()
                    .plan("free")
                    .planName("Free")
                    .status("active")
                    .build();
        }

        return SubscriptionResponse.builder()
                .plan(subscription.getPlan())
                .planName(displayPlanName(subscription.getPlan()))
                .status(subscription.getStatus())
                .featuresEnabled(subscription.getFeaturesEnabled())
                .maxWebsitesAllowed(subscription.getMaxWebsitesAllowed())
                .currentPeriodStart(subscription.getCurrentPeriodStart())
                .currentPeriodEnd(subscription.getCurrentPeriodEnd())
                .amount(subscription.getAmount())
                .currency(subscription.getCurrency())
                .build();
    }

    public void cancelSubscription(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> ApiException.unauthorized("User not found"));

        Subscription subscription = subscriptionRepository.findByUserId(user.getId()).orElse(null);
        if (subscription != null) {
            dodoClient.cancelSubscription(subscription.getDodoSubscriptionId());
            subscription.setStatus("cancelled");
            subscription.setPlanStatus(PlanStatus.CANCELED);
            subscription.setCancelledAt(LocalDateTime.now());
            subscriptionRepository.save(subscription);

            applyPlanToUser(user, PlanType.FREE, PlanStatus.ACTIVE, null, null);
        }
    }

    public String upgradePlan(String userEmail, String plan) {
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

        if (webhookId != null && !webhookId.isBlank() && !reserveWebhookId(webhookId)) {
            log.info("Skipping already-processed {}", LogSanitizer.id("webhook", webhookId));
            return;
        }

        try {
            JsonNode event = objectMapper.readTree(rawPayload);
            String eventType = event.get("type").asText();
            JsonNode data = event.get("data");

            switch (eventType) {
                case "subscription.created" -> handleSubscriptionCreated(data);
                case "subscription.activated" -> handleSubscriptionCreated(data);
                case "subscription.updated" -> handleSubscriptionUpdated(data);
                case "subscription.renewed" -> handleSubscriptionRenewed(data);
                case "subscription.cancelled" -> handleSubscriptionCancelled(data);
                case "subscription.canceled" -> handleSubscriptionCancelled(data);
                case "subscription.expired" -> handleSubscriptionCancelled(data);
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
                    log.debug("{} already recorded", LogSanitizer.id("webhook", webhookId));
                }
            }
        } catch (Exception e) {
            log.error("Failed to process webhook: {}", LogSanitizer.exception(e));
            throw new RuntimeException("Webhook processing failed");
        }
    }

    private void handleSubscriptionCreated(JsonNode data) {
        String customerId = data.get("customer").get("id").asText();
        String subscriptionId = data.get("subscription").get("id").asText();
        JsonNode subscriptionNode = subscriptionNode(data);
        String plan = extractPlan(subscriptionNode);
        PlanType planType = PlanType.from(plan);
        LocalDateTime periodEnd = extractPeriodEnd(subscriptionNode);

        User user = userRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Subscription subscription = Subscription.builder()
                .id(subscriptionId)
                .userId(user.getId())
                .customerId(customerId)
                .plan(planType.name().toLowerCase())
                .planType(planType)
                .planStatus(PlanStatus.ACTIVE)
                .maxWebsitesAllowed(planType.getMaxWebsitesAllowed())
                .featuresEnabled(planType.getFeaturesEnabled())
                .status("active")
                .dodoSubscriptionId(subscriptionId)
                .currentPeriodStart(LocalDateTime.now())
                .currentPeriodEnd(periodEnd)
                .billingPeriodEnd(periodEnd)
                .createdAt(LocalDateTime.now())
                .build();

        subscriptionRepository.save(subscription);

        applyPlanToUser(user, planType, PlanStatus.ACTIVE, subscriptionId, periodEnd);

        log.info("Subscription created for {}", LogSanitizer.email(user.getEmail()));
    }

    private void handleSubscriptionUpdated(JsonNode data) {
        JsonNode subscriptionNode = subscriptionNode(data);
        String subscriptionId = subscriptionNode.get("id").asText();
        String status = value(subscriptionNode, "status", "active");
        PlanStatus planStatus = normalizeStatus(status);
        
        Subscription subscription = subscriptionRepository.findByDodoSubscriptionId(subscriptionId).or(() -> subscriptionRepository.findById(subscriptionId))
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        
        subscription.setStatus(status);
        subscription.setPlanStatus(planStatus);
        subscription.setCurrentPeriodEnd(extractPeriodEnd(subscriptionNode));
        subscription.setUpdatedAt(LocalDateTime.now());
        subscriptionRepository.save(subscription);
        User user = userRepository.findById(subscription.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        applyPlanToUser(user, subscription.getPlanType() == null ? PlanType.from(subscription.getPlan()) : subscription.getPlanType(), planStatus, subscriptionId, subscription.getCurrentPeriodEnd());
        
        log.info("Subscription updated: {}", LogSanitizer.id("subscription", subscriptionId));
    }

    private void handleSubscriptionCancelled(JsonNode data) {
        String subscriptionId = subscriptionNode(data).get("id").asText();
        
        Subscription subscription = subscriptionRepository.findByDodoSubscriptionId(subscriptionId).or(() -> subscriptionRepository.findById(subscriptionId))
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        
        subscription.setStatus("cancelled");
        subscription.setPlanStatus(PlanStatus.CANCELED);
        subscription.setCancelledAt(LocalDateTime.now());
        subscriptionRepository.save(subscription);
        
        User user = userRepository.findById(subscription.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        applyPlanToUser(user, PlanType.FREE, PlanStatus.ACTIVE, null, null);
        emailService.sendSubscriptionCancelledEmail(user.getEmail());
        
        log.info("Subscription cancelled: {}", LogSanitizer.id("subscription", subscriptionId));
    }

    private void handlePaymentSucceeded(JsonNode data) {
        if (markSetupPackagePaidIfPresent(data)) {
            return;
        }

        String customerId = data.get("customer").get("id").asText();
        User user = userRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Subscription subscription = subscriptionRepository.findByUserId(user.getId()).orElse(null);
        if (subscription != null) {
            subscription.setStatus("active");
            subscription.setPlanStatus(PlanStatus.ACTIVE);
            subscription.setUpdatedAt(LocalDateTime.now());
            subscriptionRepository.save(subscription);
            applyPlanToUser(user, subscription.getPlanType() == null ? PlanType.from(subscription.getPlan()) : subscription.getPlanType(), PlanStatus.ACTIVE, subscription.getDodoSubscriptionId(), subscription.getCurrentPeriodEnd());
        }
        
        log.info("Payment succeeded for {}", LogSanitizer.email(user.getEmail()));
    }

    private void handlePaymentFailed(JsonNode data) {
        if (markSetupPackageFailedIfPresent(data)) {
            return;
        }

        String customerId = data.get("customer").get("id").asText();
        User user = userRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Subscription subscription = subscriptionRepository.findByUserId(user.getId()).orElse(null);
        if (subscription != null) {
            subscription.setStatus("past_due");
            subscription.setPlanStatus(PlanStatus.PAST_DUE);
            subscriptionRepository.save(subscription);
            user.setPlanStatus(PlanStatus.PAST_DUE);
            userRepository.save(user);
            emailService.sendPaymentFailedEmail(user.getEmail());
        }
    }

    private void handleSubscriptionRenewed(JsonNode data) {
        JsonNode subscriptionNode = subscriptionNode(data);
        String subscriptionId = subscriptionNode.get("id").asText();
        Subscription subscription = subscriptionRepository.findByDodoSubscriptionId(subscriptionId).or(() -> subscriptionRepository.findById(subscriptionId))
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        LocalDateTime periodEnd = extractPeriodEnd(subscriptionNode);
        subscription.setCurrentPeriodEnd(periodEnd);
        subscription.setBillingPeriodEnd(periodEnd);
        subscription.setPlanStatus(PlanStatus.ACTIVE);
        subscription.setStatus("active");
        subscription.setUpdatedAt(LocalDateTime.now());
        subscriptionRepository.save(subscription);
        User user = userRepository.findById(subscription.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        applyPlanToUser(user, subscription.getPlanType() == null ? PlanType.from(subscription.getPlan()) : subscription.getPlanType(), PlanStatus.ACTIVE, subscriptionId, periodEnd);
    }

    private boolean markSetupPackagePaidIfPresent(JsonNode data) {
        String orderId = metadataValue(data, "setupPackageOrderId");
        if (orderId == null) {
            return false;
        }

        SetupPackageOrder order = setupPackageOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Setup package order not found"));
        order.setPaymentStatus(SetupPackageOrder.PAYMENT_PAID);
        order.setDodoPaymentId(value(data, "id", order.getDodoPaymentId()));
        order.setPaidAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        if (SetupPackageOrder.STATUS_INTAKE_PENDING.equals(order.getSetupStatus())) {
            order.setSetupStatus(SetupPackageOrder.STATUS_READY_FOR_OPERATOR);
        }
        setupPackageOrderRepository.save(order);
        userRepository.findById(order.getUserId())
                .ifPresent(user -> emailService.sendSetupPaymentReceivedEmail(user.getEmail(), order.getWebsiteUrl()));
        log.info("Setup package payment confirmed for {}", LogSanitizer.id("order", orderId));
        return true;
    }

    private boolean markSetupPackageFailedIfPresent(JsonNode data) {
        String orderId = metadataValue(data, "setupPackageOrderId");
        if (orderId == null) {
            return false;
        }

        SetupPackageOrder order = setupPackageOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Setup package order not found"));
        order.setPaymentStatus(SetupPackageOrder.PAYMENT_FAILED);
        order.setDodoPaymentId(value(data, "id", order.getDodoPaymentId()));
        order.setUpdatedAt(LocalDateTime.now());
        setupPackageOrderRepository.save(order);
        log.info("Setup package payment failed for {}", LogSanitizer.id("order", orderId));
        return true;
    }

    private boolean verifyLegacyHexSignature(String signatureHeader, String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(decodeWebhookSecretMaterial(webhookSecret), "HmacSHA256"));
            byte[] expected = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            byte[] provided = decodeHex(signatureHeader.trim());
            return provided != null && MessageDigest.isEqual(expected, provided);
        } catch (Exception e) {
            log.error("Legacy webhook signature verification failed: {}", LogSanitizer.exception(e));
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
        String productId = switch (plan.toLowerCase()) {
            case "pro" -> proProductId;
            case "growth" -> growthProductId;
            case "agency" -> agencyProductId;
            default -> throw ApiException.badRequest("Invalid paid plan: " + plan);
        };
        if (productId == null || productId.isBlank()) {
            throw ApiException.badRequest("Payment product is not configured for plan: " + plan);
        }
        return productId;
    }

    private String normalizePaidPlan(String plan) {
        if (plan == null) {
            throw ApiException.badRequest("Plan is required");
        }
        String normalized = plan.trim().toLowerCase();
        return switch (normalized) {
            case "pro" -> "pro";
            case "growth" -> "growth";
            case "agency", "enterprise" -> "agency";
            case "free" -> throw ApiException.badRequest("Free plan does not require checkout");
            default -> throw ApiException.badRequest("Invalid plan: " + plan);
        };
    }

    private String displayPlanName(String plan) {
        if (plan == null || plan.isBlank()) {
            return "Free";
        }
        return switch (plan.toLowerCase()) {
            case "pro" -> "Pro";
            case "growth" -> "Growth";
            case "agency", "enterprise" -> "Agency";
            default -> "Free";
        };
    }

    private boolean reserveWebhookId(String webhookId) {
        if (webhookId == null || webhookId.isBlank()) {
            return true;
        }
        Boolean reserved = stringRedisTemplate.opsForValue()
                .setIfAbsent("dodo:webhook:" + webhookId, "1", 7, TimeUnit.DAYS);
        if (Boolean.FALSE.equals(reserved)) {
            return false;
        }
        return !processedWebhookRepository.existsById(webhookId);
    }

    private void applyPlanToUser(User user, PlanType planType, PlanStatus status, String dodoSubscriptionId, LocalDateTime billingPeriodEnd) {
        user.setPlan(planType.name().toLowerCase());
        user.setPlanType(planType);
        user.setPlanStatus(status);
        user.setMaxWebsitesAllowed(planType.getMaxWebsitesAllowed());
        user.setFeaturesEnabled(planType.getFeaturesEnabled());
        user.setDodoSubscriptionId(dodoSubscriptionId);
        user.setBillingPeriodEnd(billingPeriodEnd);
        if (planType == PlanType.AGENCY) {
            user.setAccountType("AGENCY");
        } else if (user.getAccountType() == null) {
            user.setAccountType("STANDARD");
        }
        user.setSubscriptionId(dodoSubscriptionId);
        userRepository.save(user);
    }

    private JsonNode subscriptionNode(JsonNode data) {
        return data.has("subscription") ? data.get("subscription") : data;
    }

    private String extractPlan(JsonNode subscriptionNode) {
        String plan = value(subscriptionNode, "plan", null);
        if (plan == null) plan = value(subscriptionNode, "product_id", null);
        if (plan == null) plan = value(subscriptionNode, "productId", null);
        if (growthProductId != null && growthProductId.equals(plan)) return "growth";
        if (proProductId != null && proProductId.equals(plan)) return "pro";
        if (agencyProductId != null && agencyProductId.equals(plan)) return "agency";
        return plan == null ? "free" : plan;
    }

    private LocalDateTime extractPeriodEnd(JsonNode node) {
        String raw = value(node, "current_period_end", null);
        if (raw == null) raw = value(node, "billing_period_end", null);
        if (raw == null) raw = value(node, "currentPeriodEnd", null);
        if (raw == null) return LocalDateTime.now().plusMonths(1);
        try {
            return Instant.parse(raw).atZone(java.time.ZoneOffset.UTC).toLocalDateTime();
        } catch (Exception ignored) {
            try {
                return LocalDateTime.parse(raw);
            } catch (Exception ignoredAgain) {
                return LocalDateTime.now().plusMonths(1);
            }
        }
    }

    private PlanStatus normalizeStatus(String status) {
        if (status == null) return PlanStatus.ACTIVE;
        return switch (status.toLowerCase()) {
            case "past_due", "past-due" -> PlanStatus.PAST_DUE;
            case "cancelled", "canceled", "expired" -> PlanStatus.CANCELED;
            case "trialing", "trial" -> PlanStatus.TRIALING;
            default -> PlanStatus.ACTIVE;
        };
    }

    private String value(JsonNode node, String field, String fallback) {
        return node != null && node.has(field) && !node.get(field).isNull() ? node.get(field).asText() : fallback;
    }

    private String metadataValue(JsonNode data, String field) {
        if (data == null || !data.has("metadata") || data.get("metadata").isNull()) {
            return null;
        }
        JsonNode metadata = data.get("metadata");
        return metadata.has(field) && !metadata.get(field).isNull() ? metadata.get(field).asText() : null;
    }
}
