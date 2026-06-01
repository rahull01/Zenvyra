package com.complianceai.service;

import com.complianceai.agents.model.AgentResponse;
import com.complianceai.agents.model.Issue;
import com.complianceai.agents.orchestrator.COO;
import com.complianceai.dto.request.ScanRequest;
import com.complianceai.dto.response.ComplianceScoreResponse;
import com.complianceai.dto.response.ScanResponse;
import com.complianceai.exception.ApiException;
import com.complianceai.model.User;
import com.complianceai.model.Website;
import com.complianceai.repository.UserRepository;
import com.complianceai.repository.WebsiteRepository;
import com.complianceai.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScanService {

    private final WebsiteRepository websiteRepository;
    private final UserRepository userRepository;
    private final OpenAiService openAiService;
    private final NotificationService notificationService;
    private final StreakService streakService;
    private final SafeWebFetchService safeWebFetchService;

    @Autowired
    private COO coo;

    public ComplianceScoreResponse performFreeScan(String url) {
        System.out.println("Calling AI Agent pipeline...");
        log.info("Performing free scan for: {}", url);

        try {
            String normalizedUrl = normalizeAndValidateScanUrl(url);
            
            // Invoke the new COO Agent pipeline
            AgentResponse agentResponse = coo.runFullScan(normalizedUrl);
            
            // Map agent response directly to DTO format
            return mapAgentResponseToDto(normalizedUrl, agentResponse);

        } catch (IllegalArgumentException e) {
            throw ApiException.badRequest(e.getMessage());
        } catch (IOException e) {
            log.error("Failed to scan website: {}", url, e);
            throw ApiException.badRequest("Unable to fetch the target URL. Check the address and try again.");
        } catch (Exception e) {
            log.error("AI Agent pipeline execution failed, applying fallback", e);
            return ComplianceScoreResponse.builder()
                    .url(url)
                    .score(0.0)
                    .issues(new ArrayList<>())
                    .scanDate(LocalDateTime.now())
                    .recommendations(List.of("Fallback response: system error running AI agents"))
                    .build();
        }
    }

    public ScanResponse performFullScan(String userEmail, ScanRequest request) {
        System.out.println("Calling AI Agent pipeline...");
        log.info("Performing full scan for: {}", request.getUrl());

        try {
            String normalizedUrl = normalizeAndValidateScanUrl(request.getUrl());
            
            // Invoke the new COO Agent pipeline
            AgentResponse agentResponse = coo.runFullScan(normalizedUrl);
            ComplianceScoreResponse basicScan = mapAgentResponseToDto(normalizedUrl, agentResponse);

            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Website website = Website.builder()
                    .userId(user.getId())
                    .url(normalizedUrl)
                    .name(request.getName())
                    .complianceScore(basicScan.getScore())
                    .issues(basicScan.getIssues())
                    .lastScanAt(LocalDateTime.now())
                    .nextScanAt(LocalDateTime.now().plusDays(1))
                    .build();

            websiteRepository.save(website);
            streakService.updateStreak(user.getId(), website.getId(), website.getComplianceScore());

            if (basicScan.getScore() < 80.0 && !basicScan.getIssues().isEmpty()) {
                notificationService.sendIssueDetected(user.getId(), normalizedUrl,
                        basicScan.getIssues().get(0).getTitle());
            }

            return ScanResponse.builder()
                    .websiteId(website.getId())
                    .basicScan(basicScan)
                    .aiAnalysis(agentResponse.getReport()) // AI analysis is the structured report
                    .nextScanAt(website.getNextScanAt())
                    .build();
        } catch (IllegalArgumentException e) {
            throw ApiException.badRequest(e.getMessage());
        } catch (IOException e) {
            log.error("Failed to perform full scan website: {}", request.getUrl(), e);
            throw ApiException.badRequest("Unable to fetch the target URL. Check the address and try again.");
        }
    }

    public List<Website.ScanHistory> getScanHistory(String userEmail, String websiteId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> ApiException.unauthorized("User not found"));
        Website website = websiteRepository.findById(websiteId)
                .orElseThrow(() -> ApiException.notFound("Website"));
        if (!website.getUserId().equals(user.getId())) {
            throw ApiException.forbidden("You do not have access to this website");
        }
        return website.getScanHistory();
    }

    private String normalizeAndValidateScanUrl(String rawUrl) throws IOException {
        String normalizedUrl = ValidationUtil.normalizeUrlForFetch(rawUrl);
        ValidationUtil.ValidationResult safety = ValidationUtil.isSafeUrlForScanning(normalizedUrl);
        if (!safety.isValid()) {
            throw new IllegalArgumentException(safety.getErrorMessage());
        }

        String host = new URL(normalizedUrl).getHost();
        ValidationUtil.ValidationResult dns = ValidationUtil.validateHostResolvesToPublicAddresses(host);
        if (!dns.isValid()) {
            throw new IllegalArgumentException(dns.getErrorMessage());
        }

        return normalizedUrl;
    }

    /**
     * Maps the structured AgentResponse back into the backward-compatible DTO format.
     */
    private ComplianceScoreResponse mapAgentResponseToDto(String url, AgentResponse response) {
        // Convert Risk Score (where higher is worse) to Compliance Score (where higher is better)
        Double score = Math.max(0.0, 100.0 - response.getRiskScore());
        List<Website.ComplianceIssue> issues = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        if (response.getIssues() != null) {
            for (Issue issue : response.getIssues()) {
                String severity = issue.getSeverity() != null ? issue.getSeverity().toLowerCase() : "medium";
                String title = issue.getType() != null ? issue.getType().replace("_", " ") : "Compliance Issue";
                
                // Find matching fix suggestion in responses fixes list, or fallback to the issue's own fix description
                String fixSuggestion = issue.getFix() != null ? issue.getFix() : "Refer to the remediation guide.";
                if (response.getFixes() != null && issue.getType() != null) {
                    for (String fix : response.getFixes()) {
                        if (fix.contains("FIX FOR [" + issue.getType() + "]:")) {
                            fixSuggestion = fix.replace("FIX FOR [" + issue.getType() + "]:", "").trim();
                            break;
                        }
                    }
                }

                issues.add(Website.ComplianceIssue.builder()
                        .type(issue.getType() != null ? issue.getType().toLowerCase() : "generic")
                        .severity(severity)
                        .title(title)
                        .description(issue.getDescription())
                        .fixSuggestion(fixSuggestion)
                        .autoFixable(true)
                        .fixed(false)
                        .detectedAt(LocalDateTime.now())
                        .build());

                // Populate DTO recommendations list based on issue characteristics
                if ("MISSING_POLICY".equals(issue.getType())) {
                    recommendations.add("Generate a privacy policy using our AI Policy Generator");
                } else if ("GDPR_NON_COMPLIANT".equals(issue.getType())) {
                    recommendations.add("Implement CookieYes or OneTrust for cookie consent");
                } else if ("CCPA_NON_COMPLIANT".equals(issue.getType())) {
                    recommendations.add("Add a 'Do Not Sell My Personal Information' link to your footer");
                }
            }
        }

        return ComplianceScoreResponse.builder()
                .url(url)
                .score(score)
                .issues(issues)
                .scanDate(LocalDateTime.now())
                .recommendations(recommendations)
                .build();
    }
}
