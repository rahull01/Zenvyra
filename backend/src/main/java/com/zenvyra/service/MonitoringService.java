package com.zenvyra.service;

import com.zenvyra.model.Alert;
import com.zenvyra.model.User;
import com.zenvyra.model.Website;
import com.zenvyra.repository.AlertRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MonitoringService {

    private final AlertRepository alertRepository;
    private final UserRepository userRepository;
    private final WebsiteRepository websiteRepository;

    public List<Alert> getUserAlerts(String userEmail, boolean unreadOnly) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (unreadOnly) {
            return alertRepository.findByUserIdAndReadFalse(user.getId());
        }
        return alertRepository.findByUserId(user.getId());
    }

    public void markAlertAsRead(String userEmail, String alertId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        if (!alert.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        alert.setRead(true);
        alert.setReadAt(LocalDateTime.now());
        alertRepository.save(alert);
    }

    public Map<String, Object> getMonitoringStatus(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Website> websites = websiteRepository.findByUserId(user.getId());
        long activeMonitors = websites.stream().filter(Website::getMonitoringEnabled).count();
        long totalIssues = websites.stream().mapToLong(w -> w.getIssues().size()).sum();

        return Map.of(
                "totalWebsites", websites.size(),
                "activeMonitors", activeMonitors,
                "totalIssues", totalIssues,
                "lastCheck", LocalDateTime.now());
    }

    public boolean toggleMonitoring(String userEmail, String websiteId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Website website = websiteRepository.findById(websiteId)
                .orElseThrow(() -> new RuntimeException("Website not found"));

        if (!website.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        website.setMonitoringEnabled(!website.getMonitoringEnabled());
        websiteRepository.save(website);

        return website.getMonitoringEnabled();
    }
}
