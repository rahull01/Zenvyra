package com.zenvyra.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "subscriptions")
public class Subscription {

    @Id
    private String id; // Dodo subscription ID

    private String userId;
    private String customerId; // Dodo customer ID
    private String role; // STANDARD, AGENCY
    private PlanType planType;
    private PlanStatus planStatus;
    private Integer maxWebsitesAllowed;
    private java.util.List<String> featuresEnabled;

    private String plan; // starter, pro, enterprise
    private String status; // active, cancelled, past_due, paused

    private String paymentMethod;
    private String currency;

    private Integer amount; // in cents (e.g., 29900 for $299)

    private LocalDateTime currentPeriodStart;
    private LocalDateTime currentPeriodEnd;
    private LocalDateTime billingPeriodEnd;

    private LocalDateTime cancelledAt;
    private String cancellationReason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder.Default
    private Boolean autoRenew = true;

    // Dodo specific fields
    private String dodoSubscriptionId;
    private String dodoProductId;
    private String dodoPaymentLink;
}
