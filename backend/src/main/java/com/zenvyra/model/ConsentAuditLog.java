package com.zenvyra.model;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ConsentAuditLog")
public class ConsentAuditLog {

    @Id
    private String id;

    @Indexed
    private String siteId;

    private String anonymousUserId;
    private String countryCode;
    private String consentState;

    @Indexed
    private LocalDateTime timestamp;

    private String integrityHash;

    public void seal(String systemSalt) {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
        integrityHash = calculateIntegrityHash(siteId, anonymousUserId, consentState, timestamp, systemSalt);
    }

    public boolean verify(String systemSalt) {
        return integrityHash != null
                && integrityHash.equals(calculateIntegrityHash(siteId, anonymousUserId, consentState, timestamp, systemSalt));
    }

    public static String calculateIntegrityHash(
            String siteId,
            String anonymousUserId,
            String consentState,
            LocalDateTime timestamp,
            String systemSalt) {
        try {
            String canonical = String.join("|",
                    nullToEmpty(siteId),
                    nullToEmpty(anonymousUserId),
                    nullToEmpty(consentState),
                    timestamp == null ? "" : timestamp.toString(),
                    nullToEmpty(systemSalt));
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(canonical.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException("Unable to calculate consent audit integrity hash", e);
        }
    }

    public static String canonicalConsentState(ObjectMapper objectMapper, Object consentState) {
        try {
            if (consentState == null) {
                return "{}";
            }
            if (consentState instanceof String value) {
                return value;
            }
            return objectMapper.writeValueAsString(consentState);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid consent state payload", e);
        }
    }

    private static String nullToEmpty(String value) {
        return value == null ? "" : value;
    }
}
