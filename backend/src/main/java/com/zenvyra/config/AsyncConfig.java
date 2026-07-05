package com.zenvyra.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

@Configuration
public class AsyncConfig {

    /**
     * Executor used by {@code @Async("consentAuditExecutor")} to persist consent / DSAR
     * audit events off the request thread.
     *
     * <p>{@link ThreadPoolExecutor.CallerRunsPolicy} is used so that when the pool and
     * queue are saturated the caller (request thread) runs the task inline rather than
     * silently dropping it. Audit events must never be lost, even at the cost of slower
     * user-facing responses during a burst.
     */
    @Bean(name = "consentAuditExecutor")
    public Executor consentAuditExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(16);
        executor.setQueueCapacity(10000);
        executor.setThreadNamePrefix("consent-audit-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }

    /**
     * Executor used by {@code @Async("telemetryExecutor")} for non-critical telemetry
     * fan-out (engagement events, webhook dispatch).
     *
     * <p>{@link ThreadPoolExecutor.CallerRunsPolicy} ensures that telemetry is never
     * silently dropped: under saturation the caller runs the task inline, preserving
     * back-pressure semantics.
     */
    @Bean(name = "telemetryExecutor")
    public Executor telemetryExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(8);
        executor.setQueueCapacity(20000);
        executor.setThreadNamePrefix("telemetry-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }
}
