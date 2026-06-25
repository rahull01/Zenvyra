package com.zenvyra.service;

import com.zenvyra.exception.ApiException;
import com.zenvyra.model.WebsiteScanResult;
import com.zenvyra.model.WebsiteScanResult.ClassifiedTracker;
import com.zenvyra.repository.WebsiteScanResultRepository;
import com.zenvyra.util.LogSanitizer;
import com.zenvyra.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class TrackerScanService {

    private final WebsiteScraperService scraperService;
    private final TrackerClassificationService classificationService;
    private final WebsiteScanResultRepository repository;

    public String normalizeAndValidateUrl(String rawUrl) {
        String normalizedUrl = ValidationUtil.normalizeUrlForFetch(rawUrl);
        ValidationUtil.ValidationResult safety = ValidationUtil.isSafeUrlForScanning(normalizedUrl);
        if (!safety.isValid()) {
            throw ApiException.badRequest(safety.getErrorMessage());
        }

        try {
            String host = new URL(normalizedUrl).getHost();
            ValidationUtil.ValidationResult dns = ValidationUtil.validateHostResolvesToPublicAddresses(host);
            if (!dns.isValid()) {
                throw ApiException.badRequest(dns.getErrorMessage());
            }
            return normalizedUrl;
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            throw ApiException.badRequest("Invalid URL format");
        }
    }

    @Async
    public void runTrackerScanAsync(String scanId, String url) {
        log.info("Starting background tracker scan for {}, {}", LogSanitizer.id("scan", scanId), LogSanitizer.url(url));
        try {
            String safeUrl = normalizeAndValidateUrl(url);

            // 1. Scraping & Domain Extraction
            Set<String> domains = scraperService.scrapeTrackingDomains(safeUrl);
            
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
            log.info("Completed background tracker scan for {}", LogSanitizer.id("scan", scanId));

        } catch (Exception e) {
            log.error("Failed background tracker scan for {}: {}", LogSanitizer.id("scan", scanId), LogSanitizer.exception(e));
            repository.findById(scanId).ifPresent(result -> {
                result.setStatus(WebsiteScanResult.ScanStatus.FAILED);
                repository.save(result);
            });
        }
    }
}
