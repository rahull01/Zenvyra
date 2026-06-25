package com.zenvyra.service;

import com.zenvyra.client.DodoPaymentsClient;
import com.zenvyra.dto.request.CreateSetupPackageRequest;
import com.zenvyra.dto.request.UpdateSetupPackageTaskRequest;
import com.zenvyra.dto.response.SetupPackageResponse;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.SetupPackageOrder;
import com.zenvyra.model.User;
import com.zenvyra.model.Website;
import com.zenvyra.repository.SetupPackageOrderRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteRepository;
import com.zenvyra.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SetupPackageService {

    private static final int USD_SETUP_AMOUNT_CENTS = 19900;
    private static final int GBP_SETUP_AMOUNT_CENTS = 15900;

    private final SetupPackageOrderRepository setupPackageOrderRepository;
    private final UserRepository userRepository;
    private final WebsiteRepository websiteRepository;
    private final DodoPaymentsClient dodoPaymentsClient;

    @Value("${dodo.products.setup-package:}")
    private String setupPackageProductId;

    @Value("${app.url:http://localhost:3000}")
    private String appUrl;

    public List<SetupPackageOrder> getOrdersForUser(String userEmail) {
        User user = requireUser(userEmail);
        return setupPackageOrderRepository.findByUserIdOrderByRequestedAtDesc(user.getId());
    }

    public SetupPackageResponse requestSetup(String userEmail, CreateSetupPackageRequest request) {
        User user = requireUser(userEmail);
        Website website = resolveWebsite(user, request);
        LocalDateTime now = LocalDateTime.now();
        String currency = normalizeCurrency(request.getCurrency());

        SetupPackageOrder order = SetupPackageOrder.builder()
                .userId(user.getId())
                .websiteId(website.getId())
                .websiteUrl(website.getUrl())
                .platform(firstNonBlank(request.getPlatform(), user.getPlatform(), "Custom"))
                .targetRegions(request.getTargetRegions())
                .accessWillingness(firstNonBlank(request.getAccessWillingness(), "I need guided setup"))
                .amountCents("GBP".equals(currency) ? GBP_SETUP_AMOUNT_CENTS : USD_SETUP_AMOUNT_CENTS)
                .currency(currency)
                .gbpAmountCents(GBP_SETUP_AMOUNT_CENTS)
                .paymentStatus(SetupPackageOrder.PAYMENT_PENDING)
                .setupStatus(Boolean.TRUE.equals(user.getOnboardingCompleted())
                        ? SetupPackageOrder.STATUS_READY_FOR_OPERATOR
                        : SetupPackageOrder.STATUS_INTAKE_PENDING)
                .revisionCount(0)
                .requestedAt(now)
                .updatedAt(now)
                .build();

        if (user.getCustomerId() == null || user.getCustomerId().isBlank()) {
            String customerId = dodoPaymentsClient.createCustomer(user.getEmail(), user.getFullName());
            user.setCustomerId(customerId);
            userRepository.save(user);
        }
        order.setCustomerId(user.getCustomerId());
        setupPackageOrderRepository.save(order);

        String checkoutUrl = null;
        String message = "Setup package request created. Payment remains pending until checkout/webhook confirmation.";
        if (setupPackageProductId != null && !setupPackageProductId.isBlank()) {
            String successUrl = appUrl + "/dashboard/billing?setup=success&orderId=" + order.getId();
            String cancelUrl = appUrl + "/dashboard/billing?setup=canceled&orderId=" + order.getId();
            checkoutUrl = dodoPaymentsClient.createOneTimeCheckoutSession(
                    user.getCustomerId(),
                    setupPackageProductId,
                    successUrl,
                    cancelUrl,
                    order.getId());
            order.setCheckoutUrl(checkoutUrl);
            setupPackageOrderRepository.save(order);
        } else {
            message = "Setup package request created. Configure DODO_SETUP_PACKAGE_PRODUCT_ID to enable checkout.";
        }

        return SetupPackageResponse.builder()
                .order(order)
                .checkoutUrl(checkoutUrl)
                .message(message)
                .build();
    }

    public SetupPackageOrder updateAdminTask(String orderId, UpdateSetupPackageTaskRequest request) {
        SetupPackageOrder order = setupPackageOrderRepository.findById(orderId)
                .orElseThrow(() -> ApiException.notFound("Setup package order"));

        if (request.getSetupStatus() != null && !request.getSetupStatus().isBlank()) {
            order.setSetupStatus(normalizeSetupStatus(request.getSetupStatus()));
            if (SetupPackageOrder.STATUS_VERIFIED.equals(order.getSetupStatus())) {
                order.setVerifiedAt(LocalDateTime.now());
            }
        }
        if (request.getAdminNotes() != null) {
            order.setAdminNotes(request.getAdminNotes().trim());
        }
        order.setUpdatedAt(LocalDateTime.now());
        return setupPackageOrderRepository.save(order);
    }

    private Website resolveWebsite(User user, CreateSetupPackageRequest request) {
        if (request.getWebsiteId() != null && !request.getWebsiteId().isBlank()) {
            return websiteRepository.findById(request.getWebsiteId())
                    .filter(site -> user.getId().equals(site.getUserId()))
                    .orElseThrow(() -> ApiException.notFound("Website"));
        }

        String rawUrl = firstNonBlank(request.getWebsiteUrl(), user.getWebsiteUrl());
        if (rawUrl == null) {
            List<Website> websites = websiteRepository.findByUserId(user.getId());
            if (!websites.isEmpty()) {
                return websites.get(0);
            }
            throw ApiException.badRequest("Website URL is required for setup package");
        }
        String normalizedUrl = ValidationUtil.normalizeUrl(rawUrl);
        if (!ValidationUtil.isValidUrl(normalizedUrl)) {
            throw ApiException.badRequest("Website URL is invalid");
        }
        return websiteRepository.findByUserIdAndUrl(user.getId(), normalizedUrl)
                .orElseGet(() -> websiteRepository.save(Website.builder()
                        .userId(user.getId())
                        .url(normalizedUrl)
                        .name(ValidationUtil.extractDomain(normalizedUrl))
                        .scanFrequency("weekly")
                        .monitoringEnabled(true)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .nextScanAt(LocalDateTime.now().plusDays(1))
                        .build()));
    }

    private User requireUser(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> ApiException.unauthorized("User not found"));
    }

    private String normalizeCurrency(String currency) {
        if (currency == null || currency.isBlank()) {
            return "USD";
        }
        return "GBP".equalsIgnoreCase(currency.trim()) ? "GBP" : "USD";
    }

    private String normalizeSetupStatus(String value) {
        String normalized = value.trim().toUpperCase();
        return switch (normalized) {
            case SetupPackageOrder.STATUS_INTAKE_PENDING,
                    SetupPackageOrder.STATUS_READY_FOR_OPERATOR,
                    SetupPackageOrder.STATUS_SCAN_RUNNING,
                    SetupPackageOrder.STATUS_REPORT_BUILDING,
                    SetupPackageOrder.STATUS_HANDOFF_READY,
                    SetupPackageOrder.STATUS_INSTALL_PENDING,
                    SetupPackageOrder.STATUS_VERIFIED -> normalized;
            default -> throw ApiException.badRequest("Invalid setup status: " + value);
        };
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value.trim();
            }
        }
        return null;
    }
}
