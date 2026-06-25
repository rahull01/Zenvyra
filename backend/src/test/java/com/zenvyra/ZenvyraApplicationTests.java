package com.zenvyra;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(properties = "spring.profiles.active=test")
@ActiveProfiles("test")
class ZenvyraApplicationTests {

    @Test
    void contextLoads() {
        // Test that the Spring context loads successfully
    }
}