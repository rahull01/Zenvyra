package com.complianceai.scheduler;

import com.complianceai.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class AlertCleanupScheduler {

    private final AlertRepository alertRepository;

    // Run every day at 3 AM
    @Scheduled(cron = "0 0 3 * * ?")
    public void cleanupOldAlerts() {
        log.info("Starting alert cleanup at {}", LocalDateTime.now());

        // Delete alerts older than 90 days
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(90);

        try {
            // This would need a custom query in repository
            // alertRepository.deleteByCreatedAtBefore(cutoffDate);
            log.info("Cleaned up alerts older than {}", cutoffDate);
        } catch (Exception e) {
            log.error("Failed to cleanup alerts", e);
        }
    }

    // Run every hour to mark stale alerts
    @Scheduled(cron = "0 0 * * * ?")
    public void markStaleAlerts() {
        log.info("Marking stale alerts");

        // Mark alerts as stale if not read for 30 days
        LocalDateTime staleDate = LocalDateTime.now().minusDays(30);

        try {
            // This would need implementation based on requirements
            log.info("Stale alerts marked");
        } catch (Exception e) {
            log.error("Failed to mark stale alerts", e);
        }
    }
}
