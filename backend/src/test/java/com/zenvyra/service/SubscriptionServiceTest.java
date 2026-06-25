package com.zenvyra.service;

import com.zenvyra.client.DodoPaymentsClient;
import com.zenvyra.model.PlanStatus;
import com.zenvyra.model.SetupPackageOrder;
import com.zenvyra.model.Subscription;
import com.zenvyra.model.User;
import com.zenvyra.repository.ProcessedWebhookRepository;
import com.zenvyra.repository.SetupPackageOrderRepository;
import com.zenvyra.repository.SubscriptionRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.security.StandardWebhookSignatureVerifier;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubscriptionServiceTest {

    @Mock
    private DodoPaymentsClient dodoClient;
    @Mock
    private SubscriptionRepository subscriptionRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ProcessedWebhookRepository processedWebhookRepository;
    @Mock
    private StringRedisTemplate stringRedisTemplate;
    @Mock
    private ValueOperations<String, String> valueOperations;
    @Mock
    private SetupPackageOrderRepository setupPackageOrderRepository;
    @Mock
    private EmailService emailService;

    private SubscriptionService service;

    @BeforeEach
    void setUp() {
        service = new SubscriptionService(
                dodoClient,
                subscriptionRepository,
                userRepository,
                new ObjectMapper(),
                new StandardWebhookSignatureVerifier(),
                processedWebhookRepository,
                stringRedisTemplate,
                setupPackageOrderRepository,
                emailService);
        ReflectionTestUtils.setField(service, "webhookSecret", "test-secret");
        ReflectionTestUtils.setField(service, "proProductId", "prod_pro");
        ReflectionTestUtils.setField(service, "growthProductId", "prod_growth");
        ReflectionTestUtils.setField(service, "agencyProductId", "prod_agency");
        ReflectionTestUtils.setField(service, "appUrl", "http://localhost:3000");
    }

    @Test
    void verifiedPaymentSucceededMarksSetupPackagePaid() throws Exception {
        String payload = """
                {
                  "type": "payment.succeeded",
                  "data": {
                    "id": "pay_123",
                    "metadata": { "setupPackageOrderId": "order-1" }
                  }
                }
                """;
        SetupPackageOrder order = SetupPackageOrder.builder()
                .id("order-1")
                .userId("user-1")
                .websiteUrl("https://example.com")
                .paymentStatus(SetupPackageOrder.PAYMENT_PENDING)
                .setupStatus(SetupPackageOrder.STATUS_INTAKE_PENDING)
                .build();
        User user = User.builder().id("user-1").email("owner@example.com").build();

        when(setupPackageOrderRepository.findById("order-1")).thenReturn(Optional.of(order));
        when(userRepository.findById("user-1")).thenReturn(Optional.of(user));
        when(setupPackageOrderRepository.save(any(SetupPackageOrder.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.processWebhookEvent(null, null, null, legacySignature(payload), payload);

        assertEquals(SetupPackageOrder.PAYMENT_PAID, order.getPaymentStatus());
        assertEquals(SetupPackageOrder.STATUS_READY_FOR_OPERATOR, order.getSetupStatus());
        assertEquals("pay_123", order.getDodoPaymentId());
        assertNotNull(order.getPaidAt());
        verify(emailService).sendSetupPaymentReceivedEmail("owner@example.com", "https://example.com");
    }

    @Test
    void verifiedPaymentFailedMarksSubscriptionPastDueAndSendsEmail() throws Exception {
        String payload = """
                {
                  "type": "payment.failed",
                  "data": {
                    "id": "pay_failed",
                    "customer": { "id": "cus_123" }
                  }
                }
                """;
        User user = User.builder().id("user-1").email("owner@example.com").customerId("cus_123").build();
        Subscription subscription = Subscription.builder()
                .id("sub-1")
                .userId("user-1")
                .status("active")
                .build();

        when(userRepository.findByCustomerId("cus_123")).thenReturn(Optional.of(user));
        when(subscriptionRepository.findByUserId("user-1")).thenReturn(Optional.of(subscription));

        service.processWebhookEvent(null, null, null, legacySignature(payload), payload);

        assertEquals("past_due", subscription.getStatus());
        assertEquals(PlanStatus.PAST_DUE, subscription.getPlanStatus());
        assertEquals(PlanStatus.PAST_DUE, user.getPlanStatus());
        verify(subscriptionRepository).save(subscription);
        verify(userRepository).save(user);
        verify(emailService).sendPaymentFailedEmail("owner@example.com");
    }

    @Test
    void invalidWebhookSignatureIsRejected() {
        String payload = """
                { "type": "payment.succeeded", "data": {} }
                """;

        assertThrows(SecurityException.class,
                () -> service.processWebhookEvent(null, null, null, "bad-signature", payload));
    }

    @Test
    void duplicateWebhookIdSkipsProcessing() throws Exception {
        String payload = """
                {
                  "type": "payment.failed",
                  "data": {
                    "id": "pay_failed",
                    "customer": { "id": "cus_123" }
                  }
                }
                """;

        when(stringRedisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.setIfAbsent("dodo:webhook:evt_123", "1", 7, java.util.concurrent.TimeUnit.DAYS))
                .thenReturn(false);

        service.processWebhookEvent("evt_123", null, null, legacySignature(payload), payload);

        verify(userRepository, never()).findByCustomerId("cus_123");
        verify(processedWebhookRepository, never()).save(any());
    }

    private String legacySignature(String payload) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec("test-secret".getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return HexFormat.of().formatHex(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
    }
}
