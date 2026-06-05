package com.complianceai.agents.scanner;

import com.complianceai.agents.model.AgentResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Scanner Agent
 * 
 * Responsibility: Performs REAL website scraping using JSoup.
 * Fetches HTML from the target URL and extracts ONLY specific compliance metadata
 * in a clean, compact JSON format to save OpenAI token costs.
 */
@Service
public class Scanner {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public AgentResponse execute(String url) {
        System.out.println("[Scanner Agent] Starting optimized scan for URL: " + url);

        AgentResponse response = new AgentResponse();
        if (url == null || url.trim().isEmpty()) {
            response.setRawData("{\"error\": \"Invalid URL provided for scanning.\"}");
            return response;
        }

        try {
            // Fetch HTML using Jsoup
            Connection.Response connResponse = Jsoup.connect(url)
                    .userAgent("ComplianceAI-Bot/1.0")
                    .timeout(10000)
                    .followRedirects(true)
                    .execute();

            Document doc = connResponse.parse();
            
            // 1. Extract cookie names from response headers
            List<String> cookieNames = new ArrayList<>(connResponse.cookies().keySet());

            // 2. Extract cookie names from inline scripts
            Elements scripts = doc.select("script");
            Pattern jsCookiePattern = Pattern.compile("document\\.cookie\\s*=\\s*['\"`]([^'\"`;=]+)");
            for (Element script : scripts) {
                String js = script.data();
                if (js != null && !js.isEmpty()) {
                    Matcher mc = jsCookiePattern.matcher(js);
                    while (mc.find()) {
                        String cookieName = mc.group(1).trim();
                        if (!cookieName.isEmpty() && !cookieNames.contains(cookieName)) {
                            cookieNames.add(cookieName);
                        }
                    }
                }
            }

            // 3. Extract script source domains
            List<String> scriptDomains = new ArrayList<>();
            Elements scriptSrcs = doc.select("script[src]");
            for (Element script : scriptSrcs) {
                String src = script.attr("abs:src");
                if (!src.isEmpty()) {
                    try {
                        String host = new URL(src).getHost();
                        if (host != null && !host.isEmpty()) {
                            if (!scriptDomains.contains(host)) {
                                scriptDomains.add(host);
                            }
                        }
                    } catch (Exception e) {
                        // ignore malformed script URLs
                    }
                }
            }

            // 4. Extract local/session storage keys from inline scripts
            List<String> storageKeys = new ArrayList<>();
            Pattern storagePattern = Pattern.compile("(?:localStorage|sessionStorage)\\.(?:setItem|getItem|removeItem)\\s*\\(\\s*['\"`]([^'\"`]+)['\"`]");
            Pattern indexPattern = Pattern.compile("(?:localStorage|sessionStorage)\\s*\\[\\s*['\"`]([^'\"`]+)['\"`]\\s*\\]");

            for (Element script : scripts) {
                String js = script.data();
                if (js != null && !js.isEmpty()) {
                    Matcher m1 = storagePattern.matcher(js);
                    while (m1.find()) {
                        String key = m1.group(1).trim();
                        if (!storageKeys.contains(key)) {
                            storageKeys.add(key);
                        }
                    }
                    Matcher m2 = indexPattern.matcher(js);
                    while (m2.find()) {
                        String key = m2.group(1).trim();
                        if (!storageKeys.contains(key)) {
                            storageKeys.add(key);
                        }
                    }
                }
            }

            // 5. Extract visible compliance, privacy, policy, and terms links
            List<Map<String, String>> complianceLinks = new ArrayList<>();
            Elements links = doc.select("a[href]");
            for (Element link : links) {
                String href = link.attr("abs:href");
                String text = link.text().trim();
                String textLower = text.toLowerCase();
                String hrefLower = href.toLowerCase();

                if (textLower.contains("privacy") || textLower.contains("cookie") || textLower.contains("terms") ||
                    textLower.contains("legal") || textLower.contains("gdpr") || textLower.contains("ccpa") ||
                    textLower.contains("consent") || textLower.contains("do not sell") ||
                    hrefLower.contains("privacy") || hrefLower.contains("cookie") || hrefLower.contains("terms") ||
                    hrefLower.contains("legal") || hrefLower.contains("gdpr") || hrefLower.contains("ccpa") ||
                    hrefLower.contains("consent")) {

                    Map<String, String> linkMap = new HashMap<>();
                    linkMap.put("text", text.isEmpty() ? "[Icon/Link]" : text);
                    linkMap.put("url", href);

                    if (!complianceLinks.contains(linkMap)) {
                        complianceLinks.add(linkMap);
                    }
                }
            }

            // Compile into optimized JSON metadata payload
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("url", url);
            metadata.put("title", doc.title());
            metadata.put("cookies", cookieNames);
            metadata.put("scriptDomains", scriptDomains);
            metadata.put("storageKeys", storageKeys);
            metadata.put("complianceLinks", complianceLinks);

            String jsonPayload = objectMapper.writeValueAsString(metadata);
            response.setRawData(jsonPayload);
            
            System.out.println("[Scanner Agent] Scraping completed. Optimized metadata payload size: " + jsonPayload.length() + " chars.");

        } catch (IOException e) {
            String errorMsg = "Scraping failed for URL " + url + ": " + e.getMessage();
            System.err.println("[Scanner Agent] [ERROR] " + errorMsg);
            response.setRawData("{\"error\": \"" + errorMsg.replace("\"", "\\\"") + "\"}");
        }

        return response;
    }
}
