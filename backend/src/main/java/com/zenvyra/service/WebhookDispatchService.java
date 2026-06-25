package com.zenvyra.service;

import com.zenvyra.model.Webhook;
import com.zenvyra.model.WebhookDelivery;
import com.zenvyra.repository.WebhookDeliveryRepository;
import com.zenvyra.repository.WebhookRepository;
import com.zenvyra.util.LogSanitizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebhookDispatchService {
    private final WebhookRepository webhookRepository;
    private final WebhookDeliveryRepository deliveryRepository;
    private final EmailService emailService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.ops-alert-email:}")
    private String opsAlertEmail;

    @Async("telemetryExecutor")
    public void dispatch(String organizationId, String event, Map<String, Object> payload) {
        webhookRepository.findByOrganizationIdAndActiveTrue(organizationId).stream()
                .filter(webhook -> webhook.getEvents() == null || webhook.getEvents().contains(event))
                .forEach(webhook -> deliver(webhook, event, payload));
    }

    private void deliver(Webhook webhook, String event, Map<String, Object> payload) {
        LocalDateTime now = LocalDateTime.now();
        WebhookDelivery delivery = deliveryRepository.save(WebhookDelivery.builder()
                .webhookId(webhook.getId())
                .event(event)
                .payload(payload)
                .status("pending")
                .retryCount(0)
                .timestamp(now)
                .build());

        try {
            String body = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(Map.of(
                    "id", delivery.getId(),
                    "event", event,
                    "createdAt", now.toString(),
                    "data", payload));
            String timestamp = String.valueOf(System.currentTimeMillis() / 1000);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Zenvyra-Event", event);
            headers.set("Zenvyra-Timestamp", timestamp);
            headers.set("Zenvyra-Signature", sign(webhook.getSecret(), timestamp + "." + body));

            var response = restTemplate.postForEntity(webhook.getUrl(), new HttpEntity<>(body, headers), String.class);
            delivery.setStatus("success");
            delivery.setResponseCode(response.getStatusCode().value());
            delivery.setResponseBody(truncate(response.getBody()));
            webhook.setLastDelivery(LocalDateTime.now());
            webhookRepository.save(webhook);
        } catch (Exception e) {
            delivery.setStatus("failed");
            delivery.setResponseBody(truncate(e.getMessage()));
            delivery.setRetryCount(1);
            delivery.setNextRetryAt(LocalDateTime.now().plusMinutes(5));
            log.warn("Webhook delivery {} failed for {}: {}", LogSanitizer.id("delivery", delivery.getId()), LogSanitizer.url(webhook.getUrl()), LogSanitizer.exception(e));
            sendFailureAlert(event, delivery.getId());
        }
        deliveryRepository.save(delivery);
    }

    private void sendFailureAlert(String event, String deliveryId) {
        if (opsAlertEmail == null || opsAlertEmail.isBlank()) {
            log.warn("Webhook failure alert skipped because app.ops-alert-email is not configured");
            return;
        }
        emailService.sendAdminWebhookFailureAlertEmail(opsAlertEmail, event, deliveryId);
    }

    private String sign(String secret, String payload) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return "sha256=" + HexFormat.of().formatHex(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
    }

    private String truncate(String value) {
        if (value == null) {
            return null;
        }
        return value.length() <= 2000 ? value : value.substring(0, 2000);
    }
}
