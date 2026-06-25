package com.zenvyra.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.mock.env.MockEnvironment;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ProductionStartupGuardTest {

    @Test
    void prodProfileRejectsMissingRequiredConfiguration() {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles("prod");
        environment.setProperty("app.jwt.secret", "prod-secret-prod-secret-prod-secret");

        ProductionStartupGuard guard = new ProductionStartupGuard(environment);

        assertThrows(IllegalStateException.class, () -> guard.run(new DefaultApplicationArguments()));
    }

    @Test
    void prodProfileStartsWhenRequiredConfigurationExists() {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles("prod");
        environment.setProperty("app.jwt.secret", "prod-secret-prod-secret-prod-secret");
        environment.setProperty("dodo.webhook-secret", "whsec_test_secret");
        environment.setProperty("spring.data.mongodb.uri", "mongodb+srv://example.invalid/Zenvyra");
        environment.setProperty("spring.data.redis.url", "redis://example.invalid:6379");
        environment.setProperty("app.url", "https://app.zenvyra.com");
        environment.setProperty("frontend.url", "https://app.zenvyra.com");
        environment.setProperty("cors.allowed-origins", "https://app.zenvyra.com");

        ProductionStartupGuard guard = new ProductionStartupGuard(environment);

        assertDoesNotThrow(() -> guard.run(new DefaultApplicationArguments()));
    }

    @Test
    void nonProdProfileDoesNotRequireProductionConfiguration() {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles("test");

        ProductionStartupGuard guard = new ProductionStartupGuard(environment);

        assertDoesNotThrow(() -> guard.run(new DefaultApplicationArguments()));
    }
}
