package com.complianceai.service;

import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@Service
public class WebsiteScraperService {

    /**
     * Extracts a clean, primary host domain name from a URL string using java.net.URI.
     * e.g., "https://google-analytics.com/analytics.js" -> "google-analytics.com"
     */
    public String extractHostDomain(String urlStr) {
        if (urlStr == null || urlStr.trim().isEmpty()) {
            return null;
        }
        try {
            String tempUrl = urlStr.trim();
            if (tempUrl.startsWith("//")) {
                tempUrl = "https:" + tempUrl;
            }
            if (!tempUrl.contains("://") && !tempUrl.startsWith("/")) {
                tempUrl = "https://" + tempUrl;
            }
            URI uri = new URI(tempUrl);
            String host = uri.getHost();
            if (host != null) {
                // remove leading www. if present
                return host.startsWith("www.") ? host.substring(4) : host;
            }
        } catch (Exception e) {
            log.warn("Failed to extract host domain from URL: {}", urlStr, e);
        }
        return null;
    }

    /**
     * Scrapes target URL and extracts external tracking script/iframe source domains.
     */
    public Set<String> scrapeTrackingDomains(String targetUrl) throws IOException {
        Set<String> externalDomains = new HashSet<>();
        String targetHost = extractHostDomain(targetUrl);
        if (targetHost == null) {
            return externalDomains;
        }

        log.info("Scraping third-party tracking scripts/iframes from: {}", targetUrl);
        Document doc = Jsoup.connect(targetUrl)
                .userAgent("ComplianceAI-Bot/1.0")
                .timeout(10000)
                .followRedirects(true)
                .get();

        // 1. Extract script sources
        Elements scripts = doc.select("script[src]");
        for (Element script : scripts) {
            String src = script.attr("src").trim();
            addExternalDomain(src, targetHost, externalDomains);
        }

        // 2. Extract iframe sources
        Elements iframes = doc.select("iframe[src]");
        for (Element iframe : iframes) {
            String src = iframe.attr("src").trim();
            addExternalDomain(src, targetHost, externalDomains);
        }

        log.info("Found {} unique external tracking domains for {}", externalDomains.size(), targetUrl);
        return externalDomains;
    }

    private void addExternalDomain(String src, String targetHost, Set<String> externalDomains) {
        if (src.isEmpty() || src.startsWith("/") || (!src.startsWith("http://") && !src.startsWith("https://") && !src.startsWith("//"))) {
            // Filter out internal/relative paths
            return;
        }
        String host = extractHostDomain(src);
        if (host != null) {
            String lowerHost = host.toLowerCase();
            String lowerTargetHost = targetHost.toLowerCase();
            if (!lowerHost.equals(lowerTargetHost) && !lowerHost.endsWith("." + lowerTargetHost)) {
                externalDomains.add(lowerHost);
            }
        }
    }
}
