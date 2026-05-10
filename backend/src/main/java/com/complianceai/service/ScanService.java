package com.complianceai.service;

import com.complianceai.dto.request.ScanRequest;
import com.complianceai.dto.response.ComplianceScoreResponse;
import com.complianceai.dto.response.ScanResponse;
import com.complianceai.model.User;
import com.complianceai.model.Website;
import com.complianceai.repository.UserRepository;
import com.complianceai.repository.WebsiteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

import javax.net.ssl.HttpsURLConnection;
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

    public ComplianceScoreResponse performFreeScan(String url) {
        log.info("Performing free scan for: {}", url);

        try {
            if (!url.startsWith("http")) {
                url = "https://" + url;
            }

            Document doc = Jsoup.connect(url)
                    .timeout(10000)
                    .userAgent("ComplianceAI-Bot/1.0")
                    .get();

            List<Website.ComplianceIssue> issues = new ArrayList<>();

            // Check 1: Cookie banner
            if (!checkCookieBanner(doc)) {
                issues.add(createIssue("missing_cookie_banner", "high",
                        "Missing Cookie Consent Banner",
                        "Your website does not display a cookie consent banner, which is required under GDPR and ePrivacy Directive.",
                        "Implement a cookie consent banner that allows users to accept or reject non-essential cookies."));
            }

            // Check 2: Privacy policy
            if (!checkPrivacyPolicyLink(doc, url)) {
                issues.add(createIssue("missing_privacy_policy", "critical",
                        "Privacy Policy Not Found",
                        "No privacy policy link found in the footer or main navigation.",
                        "Add a privacy policy page and link it in your website footer."));
            }

            // Check 3: SSL
            if (!checkSSLCertificate(url)) {
                issues.add(createIssue("ssl_invalid", "critical",
                        "SSL Certificate Invalid or Expired",
                        "Your website's SSL certificate is invalid or expired.",
                        "Renew your SSL certificate immediately."));
            }

            // Check 4: HTTPS redirect
            if (!checkHttpsRedirect(url)) {
                issues.add(createIssue("no_https_redirect", "medium",
                        "HTTP to HTTPS Redirect Missing",
                        "Your website does not automatically redirect HTTP traffic to HTTPS.",
                        "Configure your server to redirect all HTTP requests to HTTPS."));
            }

            Double score = calculateScore(issues);

            return ComplianceScoreResponse.builder()
                    .url(url)
                    .score(score)
                    .issues(issues)
                    .scanDate(LocalDateTime.now())
                    .recommendations(generateRecommendations(issues))
                    .build();

        } catch (IOException e) {
            log.error("Failed to scan website: {}", url, e);
            throw new RuntimeException("Failed to scan website: " + e.getMessage());
        }
    }

    public ScanResponse performFullScan(String userEmail, ScanRequest request) {
        ComplianceScoreResponse basicScan = performFreeScan(request.getUrl());

        String aiAnalysis = openAiService.analyzeCompliance(request.getUrl(), basicScan);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Website website = Website.builder()
                .userId(user.getId())
                .url(request.getUrl())
                .name(request.getName())
                .complianceScore(basicScan.getScore())
                .issues(basicScan.getIssues())
                .lastScanAt(LocalDateTime.now())
                .nextScanAt(LocalDateTime.now().plusDays(1))
                .build();

        websiteRepository.save(website);

        if (basicScan.getScore() < 80.0) {
            notificationService.sendLowScoreAlert(userEmail, request.getUrl(), basicScan.getScore());
        }

        return ScanResponse.builder()
                .websiteId(website.getId())
                .basicScan(basicScan)
                .aiAnalysis(aiAnalysis)
                .nextScanAt(website.getNextScanAt())
                .build();
    }

    public List<Website.ScanHistory> getScanHistory(String userEmail, String websiteId) {
        Website website = websiteRepository.findById(websiteId)
                .orElseThrow(() -> new RuntimeException("Website not found"));
        return website.getScanHistory();
    }

    private Website.ComplianceIssue createIssue(String type, String severity, String title,
            String description, String fixSuggestion) {
        return Website.ComplianceIssue.builder()
                .type(type)
                .severity(severity)
                .title(title)
                .description(description)
                .fixSuggestion(fixSuggestion)
                .autoFixable(true)
                .fixed(false)
                .detectedAt(LocalDateTime.now())
                .build();
    }

    private Double calculateScore(List<Website.ComplianceIssue> issues) {
        Double baseScore = 100.0;
        for (Website.ComplianceIssue issue : issues) {
            switch (issue.getSeverity()) {
                case "critical" -> baseScore -= 25.0;
                case "high" -> baseScore -= 15.0;
                case "medium" -> baseScore -= 10.0;
                case "low" -> baseScore -= 5.0;
            }
        }
        return Math.max(0.0, baseScore);
    }

    private boolean checkCookieBanner(Document doc) {
        String html = doc.html().toLowerCase();
        return html.contains("cookie") &&
                (html.contains("consent") || html.contains("gdpr") || html.contains("ccpa"));
    }

    private boolean checkPrivacyPolicyLink(Document doc, String baseUrl) {
        return doc.select("a[href]").stream()
                .anyMatch(a -> {
                    String href = a.attr("href").toLowerCase();
                    String text = a.text().toLowerCase();
                    return href.contains("privacy") || text.contains("privacy policy");
                });
    }

    private boolean checkSSLCertificate(String url) {
        try {
            if (!url.startsWith("https"))
                return false;
            URL siteUrl = new URL(url);
            HttpsURLConnection conn = (HttpsURLConnection) siteUrl.openConnection();
            conn.connect();
            return conn.getServerCertificates().length > 0;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean checkHttpsRedirect(String url) {
        try {
            if (url.startsWith("https")) return true;
            
            String httpUrl = url.replace("https://", "http://");
            URL siteUrl = new URL(httpUrl);
            HttpsURLConnection.setFollowRedirects(false);
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) siteUrl.openConnection();
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "ComplianceAI-Bot/1.0");
            
            int responseCode = conn.getResponseCode();
            String location = conn.getHeaderField("Location");
            
            return (responseCode == 301 || responseCode == 302 || responseCode == 307 || responseCode == 308) 
                   && location != null && location.startsWith("https");
        } catch (Exception e) {
            log.warn("Failed to check HTTPS redirect for {}: {}", url, e.getMessage());
            return false;
        }
    }

    private List<String> generateRecommendations(List<Website.ComplianceIssue> issues) {
        List<String> recommendations = new ArrayList<>();
        if (issues.stream().anyMatch(i -> i.getType().equals("missing_cookie_banner"))) {
            recommendations.add("Implement CookieYes or OneTrust for cookie consent");
        }
        if (issues.stream().anyMatch(i -> i.getType().equals("missing_privacy_policy"))) {
            recommendations.add("Generate a privacy policy using our AI Policy Generator");
        }
        return recommendations;
    }
}
