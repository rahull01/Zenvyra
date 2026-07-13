package com.zenvyra.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zenvyra.config.DynamicCrawlerProperties;
import com.zenvyra.util.LogSanitizer;
import com.zenvyra.util.ValidationUtil;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class DynamicCrawlerService {

    private final DynamicCrawlerProperties properties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @org.springframework.beans.factory.annotation.Autowired
    public DynamicCrawlerService(DynamicCrawlerProperties properties, ObjectMapper objectMapper) {
        this(properties, objectMapper, HttpClient.newBuilder()
                .followRedirects(HttpClient.Redirect.NEVER)
                .connectTimeout(Duration.ofMillis(Math.max(1, properties.getTimeoutMs())))
                .build());
    }

    DynamicCrawlerService(DynamicCrawlerProperties properties, ObjectMapper objectMapper, HttpClient httpClient) {
        this.properties = properties;
        this.objectMapper = objectMapper;
        this.httpClient = httpClient;
    }

    public Optional<Document> fetchRenderedDocument(String rawUrl) throws IOException {
        if (!properties.isEnabled()) {
            return Optional.empty();
        }
        if (properties.getRenderEndpoint() == null || properties.getRenderEndpoint().isBlank()) {
            log.warn("Dynamic crawler enabled without scanner.dynamic.render-endpoint; falling back to static fetch");
            return Optional.empty();
        }

        String normalizedUrl = validateTargetUrl(rawUrl);
        HttpRequest request = buildRequest(normalizedUrl);
        try {
            HttpResponse<String> response = httpClient.send(request,
                    HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.warn("Dynamic crawler renderer returned status {} for {}; falling back to static fetch",
                        response.statusCode(), LogSanitizer.url(normalizedUrl));
                return Optional.empty();
            }
            String html = extractHtml(response.body(), response.headers().firstValue("content-type").orElse(""));
            if (html == null || html.isBlank()) {
                log.warn("Dynamic crawler renderer returned no HTML for {}; falling back to static fetch",
                        LogSanitizer.url(normalizedUrl));
                return Optional.empty();
            }
            if (html.getBytes(StandardCharsets.UTF_8).length > properties.getMaxHtmlBytes()) {
                log.warn("Dynamic crawler renderer response exceeded max HTML size for {}; falling back to static fetch",
                        LogSanitizer.url(normalizedUrl));
                return Optional.empty();
            }
            return Optional.of(Jsoup.parse(html, normalizedUrl));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Dynamic crawler interrupted", e);
        } catch (IllegalArgumentException e) {
            log.warn("Dynamic crawler render endpoint is invalid; falling back to static fetch");
            return Optional.empty();
        }
    }

    private String validateTargetUrl(String rawUrl) {
        String normalized = ValidationUtil.normalizeUrlForFetch(rawUrl);
        ValidationUtil.ValidationResult shape = ValidationUtil.isSafeUrlForScanning(normalized);
        if (!shape.isValid()) {
            throw new IllegalArgumentException(shape.getErrorMessage());
        }
        String host = URI.create(normalized).getHost();
        ValidationUtil.ValidationResult dns = ValidationUtil.validateHostResolvesToPublicAddresses(host);
        if (!dns.isValid()) {
            throw new IllegalArgumentException(dns.getErrorMessage());
        }
        return normalized;
    }

    private HttpRequest buildRequest(String normalizedUrl) throws IOException {
        String payload = objectMapper.writeValueAsString(Map.of("url", normalizedUrl));
        HttpRequest.Builder builder = HttpRequest.newBuilder(URI.create(properties.getRenderEndpoint()))
                .timeout(Duration.ofMillis(Math.max(1, properties.getTimeoutMs())))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payload, StandardCharsets.UTF_8));
        if (properties.getApiKey() != null && !properties.getApiKey().isBlank()) {
            builder.header("Authorization", "Bearer " + properties.getApiKey());
        }
        return builder.build();
    }

    private String extractHtml(String body, String contentType) throws IOException {
        if (body == null || body.isBlank()) {
            return null;
        }
        if (contentType != null && contentType.toLowerCase().contains("application/json")) {
            JsonNode node = objectMapper.readTree(body);
            JsonNode html = node.get("html");
            return html != null && !html.isNull() ? html.asText() : null;
        }
        return body;
    }
}
