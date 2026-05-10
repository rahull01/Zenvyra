package com.complianceai.service;

import com.complianceai.model.User;
import com.complianceai.model.Website;
import com.complianceai.repository.UserRepository;
import com.complianceai.repository.WebsiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WebsiteService {

    private final WebsiteRepository websiteRepository;
    private final UserRepository userRepository;
    private final ScanService scanService;

    public Website addWebsite(String userEmail, Website website) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check plan limits
        long currentWebsites = websiteRepository.countByUserId(user.getId());
        int maxWebsites = getMaxWebsitesForPlan(user.getPlan());

        if (currentWebsites >= maxWebsites) {
            throw new RuntimeException("Website limit reached for your plan");
        }

        website.setUserId(user.getId());
        website.setCreatedAt(LocalDateTime.now());
        website.setUpdatedAt(LocalDateTime.now());
        website.setLastScanAt(LocalDateTime.now());
        website.setNextScanAt(LocalDateTime.now().plusDays(1));

        // Initial scan
        Website saved = websiteRepository.save(website);
        triggerScan(userEmail, saved.getId());

        return saved;
    }

    public List<Website> getUserWebsites(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return websiteRepository.findByUserId(user.getId());
    }

    public Website getWebsiteById(String userEmail, String id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Website website = websiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Website not found"));

        if (!website.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        return website;
    }

    public Website updateWebsite(String userEmail, String id, Website updates) {
        Website website = getWebsiteById(userEmail, id);

        if (updates.getName() != null)
            website.setName(updates.getName());
        if (updates.getUrl() != null)
            website.setUrl(updates.getUrl());
        if (updates.getScanFrequency() != null)
            website.setScanFrequency(updates.getScanFrequency());

        website.setUpdatedAt(LocalDateTime.now());
        return websiteRepository.save(website);
    }

    public void deleteWebsite(String userEmail, String id) {
        Website website = getWebsiteById(userEmail, id);
        websiteRepository.delete(website);
    }

    public Website triggerScan(String userEmail, String id) {
        Website website = getWebsiteById(userEmail, id);
        // Trigger async scan
        return website;
    }

    private int getMaxWebsitesForPlan(String plan) {
        return switch (plan.toLowerCase()) {
            case "free" -> 1;
            case "starter" -> 3;
            case "pro" -> 10;
            case "enterprise" -> Integer.MAX_VALUE;
            default -> 1;
        };
    }
}
