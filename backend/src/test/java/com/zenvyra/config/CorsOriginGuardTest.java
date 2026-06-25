package com.zenvyra.config;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class CorsOriginGuardTest {

    @Test
    void rejectsWildcardCorsOriginsOutsideDevOrTestProfiles() {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles("prod");

        assertThrows(IllegalStateException.class,
                () -> CorsOriginGuard.parseAndValidate("https://app.example.com,*", environment));
    }

    @Test
    void allowsExplicitProductionOrigins() {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles("prod");

        List<String> origins = CorsOriginGuard.parseAndValidate(
                "https://app.example.com, https://www.example.com",
                environment);

        assertEquals(List.of("https://app.example.com", "https://www.example.com"), origins);
    }

    @Test
    void allowsWildcardCorsOriginsInDevProfile() {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles("dev");

        assertEquals(List.of("*"), CorsOriginGuard.parseAndValidate("*", environment));
    }
}
