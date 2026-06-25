package com.zenvyra.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LogSanitizerTest {

    @Test
    void email_returnsStableFingerprintWithoutRawAddress() {
        String masked = LogSanitizer.email("alice@example.com");

        assertTrue(masked.startsWith("email#"));
        assertFalse(masked.contains("alice"));
        assertFalse(masked.contains("example.com"));
    }

    @Test
    void message_redactsCommonSensitiveValues() {
        String masked = LogSanitizer.message(
                "Failed for bob@example.com token=abc123456789 secret:topsecret Authorization=Bearer eyJabc.def.ghi ip 203.0.113.10");

        assertFalse(masked.contains("bob@example.com"));
        assertFalse(masked.contains("abc123456789"));
        assertFalse(masked.contains("topsecret"));
        assertFalse(masked.contains("203.0.113.10"));
        assertTrue(masked.contains("[redacted-email]"));
        assertTrue(masked.contains("[redacted-ip]"));
    }

    @Test
    void url_doesNotExposeHostPathOrQuery() {
        String masked = LogSanitizer.url("https://customer.example.com/private?token=secret");

        assertTrue(masked.startsWith("url#"));
        assertFalse(masked.contains("customer.example.com"));
        assertFalse(masked.contains("private"));
        assertFalse(masked.contains("secret"));
    }

    @Test
    void exception_redactsSensitiveExceptionMessage() {
        String masked = LogSanitizer.exception(
                new IllegalArgumentException("Failed token=secret123 for jane@example.com from 203.0.113.44"));

        assertTrue(masked.startsWith("IllegalArgumentException:"));
        assertFalse(masked.contains("secret123"));
        assertFalse(masked.contains("jane@example.com"));
        assertFalse(masked.contains("203.0.113.44"));
    }
}
