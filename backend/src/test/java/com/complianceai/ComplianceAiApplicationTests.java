package com.complianceai;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(properties = "spring.profiles.active=test")
@ActiveProfiles("test")
class ComplianceAiApplicationTests {

    @Test
    void contextLoads() {
        // Test that the Spring context loads successfully
    }
}