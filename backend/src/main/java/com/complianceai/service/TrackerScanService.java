package com.complianceai.service;

import com.complianceai.model.WebsiteScanResult;
import com.complianceai.model.WebsiteScanResult.ClassifiedTracker;
import com.complianceai.repository.WebsiteScanResultRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class TrackerScanService {

    private final WebsiteScraperService scraperService;
    private final TrackerClassificationService classificationService;
    private final WebsiteScanResultRepository repository;

    @Async
    public void runTrackerScanAsync(String scanId, String url) {
        log.info("Starting background tracker scan for id: {}, url: {}", scanId, url);
        try {
            // 1. Scraping & Domain Extraction
            Set<String> domains = scraperService.scrapeTrackingDomains(url);
            
            List<ClassifiedTracker> classified = List.of();
            if (!domains.isEmpty()) {
                // 2. OpenAI Classification
                classified = classificationService.classifyDomains(domains);
            }

            // 3. Update database
            WebsiteScanResult result = repository.findById(scanId)
                    .orElseThrow(() -> new RuntimeException("Scan result not found: " + scanId));
            
            result.setClassifiedTrackers(classified);
            result.setStatus(WebsiteScanResult.ScanStatus.COMPLETED);
            repository.save(result);
            log.info("Completed background tracker scan for id: {}", scanId);

        } catch (Exception e) {
            log.error("Failed background tracker scan for id: {}", scanId, e);
            repository.findById(scanId).ifPresent(result -> {
                result.setStatus(WebsiteScanResult.ScanStatus.FAILED);
                repository.save(result);
            });
        }
    }
}
