package com.zenvyra.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class ProductionStartupGuard implements ApplicationRunner {
    private static final List<String> REQUIRED_PRODUCTION_PROPERTIES = List.of(
            "app.jwt.secret",
            "dodo.webhook-secret",
            "spring.data.mongodb.uri",
            "spring.data.redis.url",
            "app.url",
            "frontend.url",
            "cors.allowed-origins"
    );

    private final Environment environment;

    public ProductionStartupGuard(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void run(ApplicationArguments args) {
        boolean prod = Arrays.asList(environment.getActiveProfiles()).contains("prod");
        if (!prod) {
            return;
        }

        List<String> missing = REQUIRED_PRODUCTION_PROPERTIES.stream()
                .filter(this::isMissing)
                .toList();
        if (!missing.isEmpty()) {
            throw new IllegalStateException("Missing required production configuration: " + String.join(", ", missing));
        }
    }

    private boolean isMissing(String property) {
        String value = environment.getProperty(property);
        return value == null || value.isBlank() || value.startsWith("${");
    }
}
