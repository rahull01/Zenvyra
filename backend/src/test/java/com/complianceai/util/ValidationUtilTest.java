package com.complianceai.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ValidationUtilTest {

    @Test
    void testIsValidEmail() {
        assertTrue(ValidationUtil.isValidEmail("test@example.com"));
        assertTrue(ValidationUtil.isValidEmail("user.name+tag@example.co.uk"));
        assertFalse(ValidationUtil.isValidEmail("invalid-email"));
        assertFalse(ValidationUtil.isValidEmail(""));
        assertFalse(ValidationUtil.isValidEmail(null));
    }

    @Test
    void testIsValidUrl() {
        assertTrue(ValidationUtil.isValidUrl("https://example.com"));
        assertTrue(ValidationUtil.isValidUrl("http://example.com"));
        assertTrue(ValidationUtil.isValidUrl("example.com"));
        assertFalse(ValidationUtil.isValidUrl("invalid-url"));
        assertFalse(ValidationUtil.isValidUrl(""));
        assertFalse(ValidationUtil.isValidUrl(null));
    }

    @Test
    void testIsStrongPassword() {
        assertTrue(ValidationUtil.isStrongPassword("StrongPass123!"));
        assertFalse(ValidationUtil.isStrongPassword("weak"));
        assertFalse(ValidationUtil.isStrongPassword("weakpass123"));
        assertFalse(ValidationUtil.isStrongPassword(""));
        assertFalse(ValidationUtil.isStrongPassword(null));
    }
}