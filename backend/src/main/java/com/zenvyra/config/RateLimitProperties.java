package com.zenvyra.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Centralised configuration for rate-limit thresholds and windows.
 *
 * <p>Defaults match the original hard-coded values in {@code RateLimitFilter}.
 * Override values per environment via {@code rate-limit.*} in the relevant
 * {@code application-*.yml} profile.
 */
@Data
@Component
@ConfigurationProperties(prefix = "rate-limit")
public class RateLimitProperties {

    /** Max public-scanner requests per hour per client IP. */
    private int publicScannerHourly = 3;

    /** Window (seconds) for the hourly public-scanner limit. */
    private int publicScannerHourlyWindowSeconds = 3600;

    /** Max public-scanner requests per day per client IP. */
    private int publicScannerDaily = 5;

    /** Window (seconds) for the daily public-scanner limit. */
    private int publicScannerDailyWindowSeconds = 86400;

    /** Max badge requests per window per client IP. */
    private int badgePerMinute = 120;

    /** Window (seconds) for the badge limit. */
    private int badgeWindowSeconds = 60;

    /** Max public read requests per window per client IP. */
    private int publicReadPerMinute = 300;

    /** Window (seconds) for the public-read limit. */
    private int publicReadWindowSeconds = 60;

    /** Max auth requests per window per client IP. */
    private int authPerWindow = 10;

    /** Window (seconds) for the auth limit. */
    private int authWindowSeconds = 300;

    /** Max public write requests per window per client IP. */
    private int publicWritePerMinute = 60;

    /** Window (seconds) for the public-write limit. */
    private int publicWriteWindowSeconds = 60;

    /** Max payment-webhook requests per window per client IP. */
    private int paymentWebhookPerMinute = 120;

    /** Window (seconds) for the payment-webhook limit. */
    private int paymentWebhookWindowSeconds = 60;

    /** Full-scan daily quota for the {@code free}/{@code freemium} plan. */
    private int fullScanFree = 5;

    /** Full-scan daily quota for the {@code starter} plan. */
    private int fullScanStarter = 20;

    /** Full-scan daily quota for the {@code pro} plan. */
    private int fullScanPro = 100;

    /** Full-scan daily quota for the {@code enterprise} plan. */
    private int fullScanEnterprise = 1000;

    /** Window (seconds) for the full-scan per-user / per-org limits. */
    private int fullScanWindowSeconds = 86400;

    /** Multiplier applied to a user's scan limit to derive their org-level quota. */
    private int fullScanOrgMultiplier = 5;

    /** Minimum org-level scan quota regardless of the user-multiplier. */
    private int fullScanOrgMin = 50;

    /** Maximum request body size (bytes) for any public write endpoint. */
    private long publicWriteMaxBytes = 64L * 1024L;
}
