package com.zenvyra.config;

import com.zenvyra.security.CompliancePlanInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Profile("!test")
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final CompliancePlanInterceptor compliancePlanInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(compliancePlanInterceptor);
    }
}
