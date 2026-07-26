package com.zenvyra.config;

import org.springframework.core.env.Environment;

import java.util.Arrays;
import java.util.List;

public final class CorsOriginGuard {

    private CorsOriginGuard() {
    }

    public static List<String> parseAndValidate(String rawOrigins, Environment environment) {
        List<String> origins = Arrays.stream((rawOrigins == null ? "" : rawOrigins).split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toList();

        if (origins.contains("*") && !isNonProduction(environment)) {
            throw new IllegalStateException("Wildcard CORS origins are not allowed outside dev/test profiles");
        }

        return origins;
    }

    private static boolean isNonProduction(Environment environment) {
        return Arrays.stream(environment.getActiveProfiles())
                .map(String::toLowerCase)
                .anyMatch(profile -> profile.equals("dev") || profile.equals("test") || profile.equals("local") || profile.equals("staging"));
    }
}
