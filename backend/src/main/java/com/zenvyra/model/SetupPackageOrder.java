package com.zenvyra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "setup_package_orders")
public class SetupPackageOrder {
    public static final String PAYMENT_PENDING = "PENDING";
    public static final String PAYMENT_PAID = "PAID";
    public static final String PAYMENT_FAILED = "FAILED";
    public static final String PAYMENT_REFUNDED = "REFUNDED";

    public static final String STATUS_INTAKE_PENDING = "INTAKE_PENDING";
    public static final String STATUS_READY_FOR_OPERATOR = "READY_FOR_OPERATOR";
    public static final String STATUS_SCAN_RUNNING = "SCAN_RUNNING";
    public static final String STATUS_REPORT_BUILDING = "REPORT_BUILDING";
    public static final String STATUS_HANDOFF_READY = "HANDOFF_READY";
    public static final String STATUS_INSTALL_PENDING = "INSTALL_PENDING";
    public static final String STATUS_VERIFIED = "VERIFIED";

    @Id
    private String id;

    @Indexed
    private String userId;
    @Indexed
    private String websiteId;

    private String websiteUrl;
    private String platform;
    private List<String> targetRegions;
    private String accessWillingness;

    private Integer amountCents;
    private String currency;
    private Integer gbpAmountCents;
    private String paymentStatus;
    private String setupStatus;

    private String customerId;
    private String checkoutUrl;
    private String dodoCheckoutId;
    private String dodoPaymentId;
    private Integer revisionCount;
    private String adminNotes;
    private LocalDateTime requestedAt;
    private LocalDateTime paidAt;
    private LocalDateTime verifiedAt;
    private LocalDateTime updatedAt;
}
