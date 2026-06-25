package com.zenvyra.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

/**
 * Verifies Dodo Payments webhooks that follow the
 * <a href="https://www.standardwebhooks.com/">Standard Webhooks</a> specification.
 */
@Slf4j
@Component
public class StandardWebhookSignatureVerifier {

    private static final long MAX_CLOCK_SKEW_SECONDS = 300;

    public boolean verify(String webhookId, String webhookTimestamp, String webhookSignatureHeader,
            String rawPayload, String webhookSecret) {
        if (webhookSecret == null || webhookSecret.isBlank()) {
            log.warn("Webhook secret is not configured");
            return false;
        }
        if (webhookId == null || webhookId.isBlank()
                || webhookTimestamp == null || webhookTimestamp.isBlank()
                || webhookSignatureHeader == null || webhookSignatureHeader.isBlank()) {
            return false;
        }

        long ts;
        try {
            ts = Long.parseLong(webhookTimestamp.trim());
        } catch (NumberFormatException e) {
            return false;
        }

        long now = System.currentTimeMillis() / 1000;
        if (Math.abs(now - ts) > MAX_CLOCK_SKEW_SECONDS) {
            log.warn("Webhook timestamp outside allowed window");
            return false;
        }

        byte[] keyMaterial = decodeSigningKey(webhookSecret);
        String signedContent = webhookId + "." + webhookTimestamp + "." + rawPayload;

        List<byte[]> expectedSignatures = new ArrayList<>();
        for (String sigPart : webhookSignatureHeader.trim().split("\\s+")) {
            if (!sigPart.startsWith("v1,")) {
                continue;
            }
            String encoded = sigPart.substring(3);
            try {
                expectedSignatures.add(Base64.getDecoder().decode(encoded));
            } catch (IllegalArgumentException e) {
                log.debug("Skipping malformed webhook signature segment");
            }
        }

        if (expectedSignatures.isEmpty()) {
            return false;
        }

        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(keyMaterial, "HmacSHA256"));
            byte[] computed = mac.doFinal(signedContent.getBytes(StandardCharsets.UTF_8));
            for (byte[] expected : expectedSignatures) {
                if (MessageDigest.isEqual(computed, expected)) {
                    return true;
                }
            }
        } catch (Exception e) {
            log.error("Webhook HMAC verification error", e);
        }
        return false;
    }

    /**
     * Standard Webhooks symmetric keys are base64-encoded and prefixed with {@code whsec_}.
     * Plain UTF-8 secrets are still accepted for backwards compatibility.
     */
    private static byte[] decodeSigningKey(String secret) {
        String s = secret.trim();
        if (s.startsWith("whsec_")) {
            return Base64.getDecoder().decode(s.substring("whsec_".length()));
        }
        return s.getBytes(StandardCharsets.UTF_8);
    }
}
