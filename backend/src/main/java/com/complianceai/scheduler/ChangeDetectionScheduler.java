package com.complianceai.scheduler;

import com.complianceai.model.User;
import com.complianceai.model.Website;
import com.complianceai.repository.UserRepository;
import com.complianceai.repository.WebsiteRepository;
import com.complianceai.service.NotificationService;
import com.complianceai.service.SafeWebFetchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.nodes.Document;
import org.springframework.data.redis.core.StringRedisTemplate;
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
    private final StringRedisTemplate stringRedisTemplate;
    private final SafeWebFetchService safeWebFetchService;

    private static final String WEBSITE_HASH_KEY = "website:hash:";

    @Scheduled(cron = "0 0 */6 * * ?")
    public void detectChanges() {
        log.info("Starting change detection at {}", LocalDateTime.now());

        List<Website> websites = websiteRepository.findByMonitoringEnabledTrue();

        for (Website website : websites) {
            try {
                String currentHash = getWebsiteHash(website.getUrl());
                String previousHash = stringRedisTemplate.opsForValue().get(WEBSITE_HASH_KEY + website.getId());

                if (previousHash != null && !previousHash.equals(currentHash)) {
                    log.info("Change detected on website: {}", website.getUrl());

                    User user = userRepository.findById(website.getUserId()).orElse(null);
                    if (user != null) {
                        notificationService.sendChangeDetectedAlert(
                                user.getId(),
                                website.getUrl(),
                                "Website content changed");
                    }
                }

                stringRedisTemplate.opsForValue().set(WEBSITE_HASH_KEY + website.getId(), currentHash);

            } catch (Exception e) {
                log.error("Failed to detect changes for: {}", website.getUrl(), e);
            }
        }

        log.info("Change detection completed");
    }

    private String getWebsiteHash(String url) throws Exception {
        Document doc = safeWebFetchService.fetchDocument(url);

        StringBuilder content = new StringBuilder();

        content.append(doc.select("[class*=cookie], [id*=cookie], [class*=consent]").text());

        content.append(doc.select("a[href*=privacy], a[href*=gdpr]").text());

        content.append(doc.select("script[src]").toString());

        return String.valueOf(content.toString().hashCode());
    }
}
