package com.complianceai.scheduler;

import com.complianceai.model.User;
import com.complianceai.model.Website;
import com.complianceai.repository.UserRepository;
import com.complianceai.repository.WebsiteRepository;
import com.complianceai.service.NotificationService;
import com.complianceai.service.ScanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DailyScanScheduler {

    private final WebsiteRepository websiteRepository;
    private final UserRepository userRepository;
    private final ScanService scanService;
    private final NotificationService notificationService;

    // Run every day at 2 AM
    @Scheduled(cron = "0 0 2 * * ?")
    public void runDailyScans() {
        log.info("Starting daily compliance scans at {}", LocalDateTime.now());

        List<Website> websitesToScan = websiteRepository.findByMonitoringEnabledTrue();

        for (Website website : websitesToScan) {
            try {
                // Check if it's time to scan
                if (website.getNextScanAt() == null ||
                        website.getNextScanAt().isBefore(LocalDateTime.now())) {

                    User user = userRepository.findById(website.getUserId()).orElse(null);
                    if (user == null)
                        continue;

                    log.info("Scanning website: {} for user: {}", website.getUrl(), user.getEmail());

                    // Perform scan
                    var result = scanService.performFreeScan(website.getUrl());

                    // Update website
                    website.setComplianceScore(result.getScore());
                    website.setPreviousScore(website.getComplianceScore());
                    website.setIssues(result.getIssues());
                    website.setLastScanAt(LocalDateTime.now());

                    // Set next scan time based on frequency
                    if ("daily".equals(website.getScanFrequency())) {
                        website.setNextScanAt(LocalDateTime.now().plusDays(1));
                    } else if ("weekly".equals(website.getScanFrequency())) {
                        website.setNextScanAt(LocalDateTime.now().plusWeeks(1));
                    }

                    websiteRepository.save(website);

                    // Send alert if score dropped significantly
                    if (result.getScore() < 70) {
                        notificationService.sendLowScoreAlert(
                                user.getId(),
                                website.getUrl(),
                                result.getScore());
                    }

                    log.info("Scan completed for {} with score {}", website.getUrl(), result.getScore());
                }
            } catch (Exception e) {
                log.error("Failed to scan website: {}", website.getUrl(), e);
            }
        }

        log.info("Daily scans completed at {}", LocalDateTime.now());
    }

    // Run every hour to check for urgent scans
    @Scheduled(cron = "0 0 * * * ?")
    public void runHourlyChecks() {
        log.info("Running hourly compliance checks");

        List<Website> websites = websiteRepository.findByMonitoringEnabledTrue();
        LocalDateTime now = LocalDateTime.now();

        for (Website website : websites) {
            // Check for SSL expiry (alert 7, 3, 1 days before)
            checkSslExpiry(website);
        }
    }

    private void checkSslExpiry(Website website) {
        // Implementation for SSL expiry check
        // This would integrate with SSL checking service
    }
}
