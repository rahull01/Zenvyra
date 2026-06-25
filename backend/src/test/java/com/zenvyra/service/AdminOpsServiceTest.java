package com.zenvyra.service;

import com.zenvyra.dto.response.admin.AdminOpsTableResponse;
import com.zenvyra.model.Webhook;
import com.zenvyra.model.WebhookDelivery;
import com.zenvyra.repository.DSARSubmissionRepository;
import com.zenvyra.repository.NotificationRepository;
import com.zenvyra.repository.ScanResultRepository;
import com.zenvyra.repository.SetupPackageOrderRepository;
import com.zenvyra.repository.SubscriptionRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebhookDeliveryRepository;
import com.zenvyra.repository.WebhookRepository;
import com.zenvyra.repository.WebsiteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.core.env.Environment;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminOpsServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private WebsiteRepository websiteRepository;
    @Mock
    private SubscriptionRepository subscriptionRepository;
    @Mock
    private WebhookRepository webhookRepository;
    @Mock
    private WebhookDeliveryRepository webhookDeliveryRepository;
    @Mock
    private NotificationRepository notificationRepository;
    @Mock
    private DSARSubmissionRepository dsarSubmissionRepository;
    @Mock
    private ScanResultRepository scanResultRepository;
    @Mock
    private SetupPackageOrderRepository setupPackageOrderRepository;
    @Mock
    private Environment environment;

    @Test
    void webhooksExposeRetryQueueFieldsForOperators() {
        LocalDateTime receivedAt = LocalDateTime.now().minusMinutes(4);
        LocalDateTime nextRetryAt = LocalDateTime.now().plusMinutes(1);
        WebhookDelivery failedDelivery = WebhookDelivery.builder()
                .id("delivery-1")
                .event("proof.report.ready")
                .status("failed")
                .retryCount(2)
                .responseCode(500)
                .responseBody("HTTP 500 from customer endpoint")
                .timestamp(receivedAt)
                .nextRetryAt(nextRetryAt)
                .build();

        when(webhookRepository.findAll()).thenReturn(List.of(Webhook.builder().id("webhook-1").build()));
        when(webhookDeliveryRepository.findAll()).thenReturn(List.of(failedDelivery));

        AdminOpsService service = new AdminOpsService(
                userRepository,
                websiteRepository,
                subscriptionRepository,
                webhookRepository,
                webhookDeliveryRepository,
                notificationRepository,
                dsarSubmissionRepository,
                scanResultRepository,
                setupPackageOrderRepository,
                environment
        );

        AdminOpsTableResponse response = service.webhooks();

        assertThat(response.getName()).isEqualTo("webhooks");
        assertThat(response.getItems()).hasSize(1);
        Map<String, Object> item = response.getItems().get(0);
        assertThat(item)
                .containsEntry("event", "proof.report.ready")
                .containsEntry("status", "failed")
                .containsEntry("retryCount", 2)
                .containsEntry("nextRetryAt", nextRetryAt)
                .containsEntry("lastError", "HTTP 500 from customer endpoint")
                .containsEntry("responseCode", 500);
    }

    @Test
    void backupsReflectDeploymentConfigurationWithoutExposingSecrets() {
        when(environment.getProperty("app.backup.provider")).thenReturn("atlas");
        when(environment.getProperty("app.backup.last-restore-drill-at")).thenReturn("2026-06-12T10:00:00Z");
        when(environment.getProperty("app.ops-alert-email")).thenReturn("ops@example.com");
        when(environment.getProperty("dodo.products.growth")).thenReturn("prod_growth");
        when(environment.getProperty("dodo.products.pro")).thenReturn("prod_pro");
        when(environment.getProperty("dodo.products.agency")).thenReturn("prod_agency");
        when(environment.getProperty("dodo.products.setup-package")).thenReturn("prod_setup");
        when(environment.getProperty("spring.data.mongodb.uri", "")).thenReturn("mongodb+srv://redacted.example/Zenvyra");
        when(environment.getProperty("spring.data.redis.url", "")).thenReturn("rediss://redacted.example:6379");

        AdminOpsService service = service();

        AdminOpsTableResponse response = service.backups();

        assertThat(response.getItems())
                .anySatisfy(item -> assertThat(item)
                        .containsEntry("name", "MongoDB backup")
                        .containsEntry("status", "ready"))
                .anySatisfy(item -> assertThat(item)
                        .containsEntry("name", "Restore drill")
                        .containsEntry("status", "ready"))
                .anySatisfy(item -> assertThat(item)
                        .containsEntry("name", "Dodo product ids")
                        .containsEntry("status", "ready"))
                .allSatisfy(item -> assertThat(String.valueOf(item.get("detail"))).doesNotContain("prod_", "redacted.example"));
    }

    @Test
    void backupsShowMissingProductionConfigAsNeedsConfiguration() {
        when(environment.getProperty("app.backup.provider")).thenReturn("");
        when(environment.getProperty("app.backup.last-restore-drill-at")).thenReturn("");
        when(environment.getProperty("app.ops-alert-email")).thenReturn("");
        when(environment.getProperty("dodo.products.growth")).thenReturn("");
        when(environment.getProperty("app.backup.enabled", "false")).thenReturn("false");
        when(environment.getProperty("spring.data.mongodb.uri", "")).thenReturn("mongodb://localhost:27017/Zenvyra");
        when(environment.getProperty("spring.data.redis.url", "")).thenReturn("redis://localhost:6379");

        AdminOpsService service = service();

        AdminOpsTableResponse response = service.backups();

        assertThat(response.getItems())
                .anySatisfy(item -> assertThat(item)
                        .containsEntry("name", "MongoDB backup")
                        .containsEntry("status", "needs_configuration"))
                .anySatisfy(item -> assertThat(item)
                        .containsEntry("name", "Production data services")
                        .containsEntry("status", "needs_configuration"));
    }

    private AdminOpsService service() {
        return new AdminOpsService(
                userRepository,
                websiteRepository,
                subscriptionRepository,
                webhookRepository,
                webhookDeliveryRepository,
                notificationRepository,
                dsarSubmissionRepository,
                scanResultRepository,
                setupPackageOrderRepository,
                environment
        );
    }
}
