package com.zenvyra.dto.response;

import com.zenvyra.model.Webhook;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class WebhookResponse {
    private String id;
    private String organizationId;
    private String url;
    private List<String> events;
    private String secretPrefix;
    private boolean active;
    private LocalDateTime lastDelivery;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static WebhookResponse from(Webhook webhook) {
        return WebhookResponse.builder()
                .id(webhook.getId())
                .organizationId(webhook.getOrganizationId())
                .url(webhook.getUrl())
                .events(webhook.getEvents())
                .secretPrefix(prefix(webhook.getSecret()))
                .active(webhook.isActive())
                .lastDelivery(webhook.getLastDelivery())
                .createdAt(webhook.getCreatedAt())
                .updatedAt(webhook.getUpdatedAt())
                .build();
    }

    private static String prefix(String secret) {
        if (secret == null || secret.isBlank()) {
            return null;
        }
        return secret.substring(0, Math.min(secret.length(), 12)) + "...";
    }
}
