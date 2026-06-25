package com.zenvyra.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class DodoPaymentsClient {

    @Value("${dodo.api-key}")
    private String apiKey;

    @Value("${dodo.base-url}")
    private String baseUrl;

    private WebClient getWebClient() {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public String createCustomer(String email, String name) {
        try {
            Map<String, Object> request = Map.of(
                    "email", email,
                    "name", name,
                    "external_id", email);

            Map response = getWebClient().post()
                    .uri("/customers")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            return (String) response.get("id");
        } catch (Exception e) {
            log.error("Failed to create Dodo customer", e);
            throw new RuntimeException("Payment customer creation failed");
        }
    }

    public String createCheckoutSession(String customerId, String productId, String successUrl, String cancelUrl) {
        try {
            Map<String, Object> request = Map.of(
                    "customer_id", customerId,
                    "product_id", productId,
                    "success_url", successUrl,
                    "cancel_url", cancelUrl,
                    "billing_type", "subscription");

            Map response = getWebClient().post()
                    .uri("/checkouts")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            return (String) response.get("checkout_url");
        } catch (Exception e) {
            log.error("Failed to create checkout session", e);
            throw new RuntimeException("Checkout creation failed");
        }
    }

    public String createOneTimeCheckoutSession(String customerId, String productId, String successUrl, String cancelUrl, String orderId) {
        try {
            Map<String, Object> request = Map.of(
                    "customer_id", customerId,
                    "product_id", productId,
                    "success_url", successUrl,
                    "cancel_url", cancelUrl,
                    "billing_type", "one_time",
                    "metadata", Map.of("setupPackageOrderId", orderId));

            Map response = getWebClient().post()
                    .uri("/checkouts")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            return (String) response.get("checkout_url");
        } catch (Exception e) {
            log.error("Failed to create one-time checkout session", e);
            throw new RuntimeException("Setup package checkout creation failed");
        }
    }

    public void cancelSubscription(String subscriptionId) {
        try {
            getWebClient().post()
                    .uri("/subscriptions/" + subscriptionId + "/cancel")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            log.error("Failed to cancel subscription", e);
            throw new RuntimeException("Subscription cancellation failed");
        }
    }

    public Map<String, Object> getSubscription(String subscriptionId) {
        try {
            return getWebClient().get()
                    .uri("/subscriptions/" + subscriptionId)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            log.error("Failed to get subscription", e);
            throw new RuntimeException("Failed to retrieve subscription");
        }
    }

    public Map<String, Object> getCustomer(String customerId) {
        try {
            return getWebClient().get()
                    .uri("/customers/" + customerId)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            log.error("Failed to get customer", e);
            throw new RuntimeException("Failed to retrieve customer");
        }
    }
}
