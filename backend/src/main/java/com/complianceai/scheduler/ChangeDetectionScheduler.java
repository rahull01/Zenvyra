package com.complianceai.scheduler;

import com.complianceai.model.User;
import com.complianceai.model.Website;
import com.complianceai.repository.UserRepository;
import com.complianceai.repository.WebsiteRepository;
import com.complianceai.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ChangeDetectionScheduler {

    private final WebsiteRepository websiteRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final RedisTemplate<String, String> redisTemplate;

    private static final String WEBSITE_HASH_KEY = "website:hash:";

    // Run every 6 hours
    @Scheduled(cron = "0 0 */6 * * ?")
    public void detectChanges() {
        log.info("Starting change detection at {}", LocalDateTime.now());

        List<Website> websites = websiteRepository.findByMonitoringEnabledTrue();

        for (Website website : websites) {
            try {
                String currentHash = getWebsiteHash(website.getUrl());
                String previousHash = redisTemplate.opsForValue().get(WEBSITE_HASH_KEY + website.getId());

                if (previousHash != null && !previousHash.equals(currentHash)) {
                    // Change detected!
                    log.info("Change detected on website: {}", website.getUrl());

                    User user = userRepository.findById(website.getUserId()).orElse(null);
                    if (user != null) {
                        notificationService.sendChangeDetectedAlert(
                                user.getEmail(),
                                website.getUrl(),
                                "Website content changed");
                    }
                }

                // Store current hash
                redisTemplate.opsForValue().set(WEBSITE_HASH_KEY + website.getId(), currentHash);

            } catch (Exception e) {
                log.error("Failed to detect changes for: {}", website.getUrl(), e);
            }
        }

        log.info("Change detection completed");
    }

    private String getWebsiteHash(String url) throws Exception {
        if (!url.startsWith("http")) {
            url = "https://" + url;
        }

        Document doc = Jsoup.connect(url)
                .timeout(10000)
                .userAgent("ComplianceAI-Bot/1.0")
                .get();

        // Get hash of critical compliance elements
        StringBuilder content = new StringBuilder();

        // Check for cookie banner
        content.append(doc.select("[class*=cookie], [id*=cookie], [class*=consent]").text());

        // Check for privacy policy link
        content.append(doc.select("a[href*=privacy], a[href*=gdpr]").text());

        // Check for scripts
        content.append(doc.select("script[src]").toString());

        return String.valueOf(content.toString().hashCode());
    }
}
