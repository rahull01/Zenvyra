package com.zenvyra.service;

import com.zenvyra.agents.model.AgentResponse;
import com.zenvyra.agents.model.Issue;
import com.zenvyra.agents.orchestrator.COO;
import com.zenvyra.dto.request.ScanRequest;
import com.zenvyra.dto.response.ComplianceScoreResponse;
import com.zenvyra.dto.response.ScanResponse;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.ScanResult;
import com.zenvyra.model.User;
import com.zenvyra.model.Website;
import com.zenvyra.repository.ScanResultRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteRepository;
import com.zenvyra.util.ValidationUtil;
import com.zenvyra.util.LogSanitizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.RedisTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

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
    private final ScanResultRepository scanResultRepository;
    private final UserRepository userRepository;
    private final OpenAiService openAiService;
    private final NotificationService notificationService;
    private final StreakService streakService;
    private final SafeWebFetchService safeWebFetchService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    private COO coo;

    private AgentResponse getCachedScan(String url) {
        try {
            String json = (String) redisTemplate.opsForValue().get("scan_cache:" + url);
            if (json != null) {
                log.info("Cache hit for {}", LogSanitizer.url(url));
                return objectMapper.readValue(json, AgentResponse.class);
            }
        } catch (Exception e) {
            log.error("Failed to read from Redis cache", e);
        }
        return null;
    }

    private void cacheScan(String url, AgentResponse response) {
        try {
            String json = objectMapper.writeValueAsString(response);
            redisTemplate.opsForValue().set("scan_cache:" + url, json, 24, java.util.concurrent.TimeUnit.HOURS);
            log.info("Cached scan results for {}", LogSanitizer.url(url));
        } catch (Exception e) {
            log.error("Failed to write to Redis cache", e);
        }
    }

    public ComplianceScoreResponse performFreeScan(String url) {
        log.info("Calling AI agent pipeline for free scan");
        log.info("Performing free scan for {}", LogSanitizer.url(url));

        try {
            String normalizedUrl = normalizeAndValidateScanUrl(url);
            
            AgentResponse agentResponse = getCachedScan(normalizedUrl);
            if (agentResponse == null) {
                agentResponse = coo.runFullScan(normalizedUrl);
                cacheScan(normalizedUrl, agentResponse);
            }
            ensureSuccessfulAgentRun(normalizedUrl, agentResponse);
            
            // Map agent response directly to DTO format
            return mapAgentResponseToDto(normalizedUrl, agentResponse);

        } catch (IllegalArgumentException e) {
            throw ApiException.badRequest(e.getMessage());
        } catch (IOException e) {
            log.error("Failed to scan website {}: {}", LogSanitizer.url(url), LogSanitizer.exception(e));
            throw ApiException.badRequest("Unable to fetch the target URL. Check the address and try again.");
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Scan pipeline execution failed for {}: {}", LogSanitizer.url(url), LogSanitizer.exception(e));
            throw ApiException.internalError("Scan failed. Please try again later.");
        }
    }

    public ScanResponse performFullScan(String userEmail, ScanRequest request) {
        log.info("Calling AI agent pipeline for full scan");
        log.info("Performing full scan for {}", LogSanitizer.url(request.getUrl()));

        try {
            String normalizedUrl = normalizeAndValidateScanUrl(request.getUrl());
            
            AgentResponse agentResponse = getCachedScan(normalizedUrl);
            if (agentResponse == null) {
                agentResponse = coo.runFullScan(normalizedUrl);
                cacheScan(normalizedUrl, agentResponse);
            }
            ensureSuccessfulAgentRun(normalizedUrl, agentResponse);
            
            ComplianceScoreResponse basicScan = mapAgentResponseToDto(normalizedUrl, agentResponse);

            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> ApiException.unauthorized("User not found"));

            Website website = websiteRepository.findByUserIdAndUrl(user.getId(), normalizedUrl)
                    .orElseGet(() -> Website.builder()
                            .userId(user.getId())
                            .url(normalizedUrl)
                            .name(request.getName() != null && !request.getName().isBlank()
                                    ? request.getName()
                                    : ValidationUtil.extractDomain(normalizedUrl))
                            .createdAt(LocalDateTime.now())
                            .monitoringEnabled(true)
                            .build());

            website.setPreviousScore(website.getComplianceScore());
            website.setComplianceScore(basicScan.getScore());
            website.setIssues(basicScan.getIssues());
            website.setLastScanAt(basicScan.getScanDate());
            website.setUpdatedAt(LocalDateTime.now());
            website.setNextScanAt(LocalDateTime.now().plusDays(1));
            if (website.getScanHistory() == null) {
                website.setScanHistory(new ArrayList<>());
            }
            Website.ScanHistory history = new Website.ScanHistory();
            history.setScore(basicScan.getScore());
            history.setScanDate(basicScan.getScanDate());
            website.getScanHistory().add(0, history);
            if (website.getScanHistory().size() > 20) {
                website.setScanHistory(new ArrayList<>(website.getScanHistory().subList(0, 20)));
            }

            website = websiteRepository.save(website);
            persistScanResult(user, website, basicScan, agentResponse);
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
            log.error("Failed to perform full scan website {}: {}", LogSanitizer.url(request.getUrl()), LogSanitizer.exception(e));
            throw ApiException.badRequest("Unable to fetch the target URL. Check the address and try again.");
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Full scan failed for {}: {}", LogSanitizer.url(request.getUrl()), LogSanitizer.exception(e));
            throw ApiException.internalError("Scan failed. Please try again later.");
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

    private void ensureSuccessfulAgentRun(String url, AgentResponse response) {
        if (response == null || response.getRawData() == null || response.getRawData().startsWith("ERROR:")) {
            throw ApiException.internalError("Scan pipeline failed for " + url);
        }
        if (response.getRawData().contains("\"error\"")) {
            throw ApiException.badRequest("Unable to fetch and analyze the target website.");
        }
    }

    private void persistScanResult(User user, Website website, ComplianceScoreResponse scan, AgentResponse agentResponse) {
        scanResultRepository.save(ScanResult.builder()
                .userId(user.getId())
                .websiteId(website.getId())
                .url(website.getUrl())
                .score(scan.getScore())
                .previousScore(website.getPreviousScore())
                .issuesCount(scan.getIssues() != null ? scan.getIssues().size() : 0)
                .issues(scan.getIssues())
                .aiAnalysis(agentResponse.getReport())
                .scannedAt(scan.getScanDate())
                .status("success")
                .build());
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
                
                // Prefer agent-generated remediation text when it references this issue type.
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
                        .id((issue.getType() != null ? issue.getType().toLowerCase() : "generic") + "-" + issues.size())
                        .type(issue.getType() != null ? issue.getType().toLowerCase() : "generic")
                        .category(categoryForIssue(issue.getType()))
                        .severity(severity)
                        .title(title)
                        .description(issue.getDescription())
                        .fixSuggestion(fixSuggestion)
                        .autoFixable(true)
                        .fixed(false)
                        .detectedAt(LocalDateTime.now())
                        .build());

                // Populate DTO recommendations list based on issue characteristics
                if ("MISSING_PRIVACY_NOTICE".equals(issue.getType())) {
                    recommendations.add("Generate and publish a privacy policy for this website.");
                } else if ("MISSING_COOKIE_CONSENT".equals(issue.getType())) {
                    recommendations.add("Deploy a consent banner and block analytics/marketing tags until consent is recorded.");
                } else if ("MISSING_CCPA_OPT_OUT".equals(issue.getType())) {
                    recommendations.add("Add a CCPA/CPRA opt-out link and connect it to a tracked privacy request workflow.");
                } else if ("MISSING_PRIVACY_CONTACT".equals(issue.getType())) {
                    recommendations.add("Add a visible privacy contact point or request portal link.");
                }
            }
        }

        if (recommendations.isEmpty()) {
            recommendations.add("No critical rule-based gaps detected. Review the generated report before publishing legal changes.");
        }

        return ComplianceScoreResponse.builder()
                .url(url)
                .score(score)
                .issues(issues)
                .scanDate(LocalDateTime.now())
                .recommendations(recommendations)
                .build();
    }

    private String categoryForIssue(String type) {
        if (type == null) {
            return "Compliance";
        }
        String normalized = type.toUpperCase();
        if (normalized.contains("COOKIE") || normalized.contains("CONSENT")) {
            return "Consent";
        }
        if (normalized.contains("PRIVACY") || normalized.contains("CCPA") || normalized.contains("DPDP")) {
            return "Privacy";
        }
        if (normalized.contains("TERMS")) {
            return "Legal";
        }
        return "Compliance";
    }
}
