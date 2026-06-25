package com.zenvyra.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.core.io.ClassPathResource;

import java.util.Properties;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

class ProductionConfigTest {

    @Test
    void sharedApplicationConfigDoesNotForceDevProfile() {
        Properties properties = load("application.yml");

        assertFalse(properties.containsKey("spring.profiles.active"));
    }

    @Test
    void productionConfigEnablesHstsAndRequiresExplicitOrigins() {
        Properties properties = load("application-prod.yml");

        assertEquals("true", properties.getProperty("app.security.hsts-enabled"));
        assertEquals("true", properties.getProperty("app.auth.cookies.secure"));
        assertEquals("${CORS_ALLOWED_ORIGINS}", properties.getProperty("cors.allowed-origins"));
        assertEquals("${FRONTEND_URL}", properties.getProperty("frontend.url"));
    }

    private Properties load(String resource) {
        YamlPropertiesFactoryBean factory = new YamlPropertiesFactoryBean();
        factory.setResources(new ClassPathResource(resource));
        Properties properties = factory.getObject();
        return properties == null ? new Properties() : properties;
    }
}
