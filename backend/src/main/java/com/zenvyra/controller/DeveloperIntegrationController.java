package com.zenvyra.controller;

import com.zenvyra.dto.request.CreateApiKeyRequest;
import com.zenvyra.dto.request.CreateWebhookRequest;
import com.zenvyra.dto.response.CreateApiKeyResponse;
import com.zenvyra.dto.response.WebhookResponse;
import com.zenvyra.model.ApiKey;
import com.zenvyra.model.Webhook;
import com.zenvyra.repository.OrganizationRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebhookRepository;
import com.zenvyra.service.ApiKeyManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/developer")
@RequiredArgsConstructor
public class DeveloperIntegrationController {
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final ApiKeyManagementService apiKeyManagementService;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final WebhookRepository webhookRepository;

    @GetMapping("/api-keys")
    public ResponseEntity<List<ApiKey>> listApiKeys(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(apiKeyManagementService.listKeys(userDetails.getUsername()));
    }

    @PostMapping("/api-keys")
    public ResponseEntity<CreateApiKeyResponse> createApiKey(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateApiKeyRequest request) {
        return ResponseEntity.ok(apiKeyManagementService.createKey(userDetails.getUsername(), request));
    }

    @PostMapping("/api-keys/{id}/roll")
    public ResponseEntity<CreateApiKeyResponse> rollApiKey(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {
        return ResponseEntity.ok(apiKeyManagementService.rollKey(userDetails.getUsername(), id));
    }

    @DeleteMapping("/api-keys/{id}")
    public ResponseEntity<Void> revokeApiKey(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String id) {
        apiKeyManagementService.revokeKey(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/webhooks")
    public ResponseEntity<Map<String, Object>> createWebhook(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateWebhookRequest request) {
        String userId = userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
        String organizationId = organizationRepository.findByOwnerId(userId)
                .map(org -> org.getId())
                .orElse(userId);
        String secret = generateWebhookSecret();
        LocalDateTime now = LocalDateTime.now();
        Webhook webhook = webhookRepository.save(Webhook.builder()
                .organizationId(organizationId)
                .url(request.getUrl())
                .events(request.getEvents() == null || request.getEvents().isEmpty()
                        ? List.of("scan.monthly.completed", "dsar.critical.created")
                        : request.getEvents())
                .secret(secret)
                .active(true)
                .createdAt(now)
                .updatedAt(now)
                .build());
        return ResponseEntity.ok(Map.of("webhook", WebhookResponse.from(webhook), "signingSecret", secret));
    }

    @GetMapping("/webhooks")
    public ResponseEntity<List<WebhookResponse>> listWebhooks(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
        String organizationId = organizationRepository.findByOwnerId(userId).map(org -> org.getId()).orElse(userId);
        return ResponseEntity.ok(webhookRepository.findByOrganizationIdAndActiveTrue(organizationId).stream()
                .map(WebhookResponse::from)
                .toList());
    }

    private String generateWebhookSecret() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return "whsec_" + HexFormat.of().formatHex(bytes);
    }
}
