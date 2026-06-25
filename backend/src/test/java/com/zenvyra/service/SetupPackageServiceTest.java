package com.zenvyra.service;

import com.zenvyra.client.DodoPaymentsClient;
import com.zenvyra.dto.request.CreateSetupPackageRequest;
import com.zenvyra.model.SetupPackageOrder;
import com.zenvyra.model.User;
import com.zenvyra.model.Website;
import com.zenvyra.repository.SetupPackageOrderRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SetupPackageServiceTest {

    @Mock
    private SetupPackageOrderRepository setupPackageOrderRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private WebsiteRepository websiteRepository;
    @Mock
    private DodoPaymentsClient dodoPaymentsClient;

    private SetupPackageService service;

    @BeforeEach
    void setUp() {
        service = new SetupPackageService(
                setupPackageOrderRepository,
                userRepository,
                websiteRepository,
                dodoPaymentsClient);
        ReflectionTestUtils.setField(service, "setupPackageProductId", "");
        ReflectionTestUtils.setField(service, "appUrl", "http://localhost:3000");
    }

    @Test
    void requestSetupCreatesPendingOrderWithoutFakePayment() {
        User user = User.builder()
                .id("user-1")
                .email("owner@example.com")
                .fullName("Owner")
                .customerId("cus_123")
                .platform("Shopify")
                .onboardingCompleted(true)
                .build();
        Website website = Website.builder()
                .id("site-1")
                .userId("user-1")
                .url("https://example.com")
                .build();
        CreateSetupPackageRequest request = new CreateSetupPackageRequest();
        request.setWebsiteId("site-1");
        request.setCurrency("GBP");
        request.setTargetRegions(List.of("UK", "USA"));
        request.setAccessWillingness("I need guided setup");

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(websiteRepository.findById("site-1")).thenReturn(Optional.of(website));
        when(setupPackageOrderRepository.save(any(SetupPackageOrder.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = service.requestSetup("owner@example.com", request);

        ArgumentCaptor<SetupPackageOrder> captor = ArgumentCaptor.forClass(SetupPackageOrder.class);
        verify(setupPackageOrderRepository).save(captor.capture());
        SetupPackageOrder saved = captor.getValue();
        assertEquals("user-1", saved.getUserId());
        assertEquals("site-1", saved.getWebsiteId());
        assertEquals("GBP", saved.getCurrency());
        assertEquals(15900, saved.getAmountCents());
        assertEquals(SetupPackageOrder.PAYMENT_PENDING, saved.getPaymentStatus());
        assertEquals(SetupPackageOrder.STATUS_READY_FOR_OPERATOR, saved.getSetupStatus());
        assertNull(response.getCheckoutUrl());
        verify(dodoPaymentsClient, never()).createOneTimeCheckoutSession(any(), any(), any(), any(), any());
    }
}
