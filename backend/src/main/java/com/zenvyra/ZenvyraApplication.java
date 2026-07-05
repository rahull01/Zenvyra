package com.zenvyra;

import com.zenvyra.config.RateLimitProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync
@EnableConfigurationProperties(RateLimitProperties.class)
public class ZenvyraApplication {

    public static void main(String[] args) {
        SpringApplication.run(ZenvyraApplication.class, args);
    }
}
