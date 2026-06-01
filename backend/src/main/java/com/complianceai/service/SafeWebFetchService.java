package com.complianceai.service;

import com.complianceai.util.ValidationUtil;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

/**
 * Fetches remote HTML only after SSRF checks (URL shape, blocklists, DNS resolution).
 * Redirects are followed manually with validation on each hop.
 */
@Slf4j
@Service
public class SafeWebFetchService {

    private static final int MAX_REDIRECTS = 5;
    private static final int TIMEOUT_MS = 10_000;
    private static final String USER_AGENT = "ComplianceAI-Bot/1.0";

    public Document fetchDocument(String rawUrl) throws IOException {
        String current = ValidationUtil.normalizeUrlForFetch(rawUrl);
        ValidationUtil.ValidationResult first = ValidationUtil.isSafeUrlForScanning(current);
        if (!first.isValid()) {
            throw new IllegalArgumentException(first.getErrorMessage());
        }

        for (int hop = 0; hop <= MAX_REDIRECTS; hop++) {
            ValidationUtil.ValidationResult safety = ValidationUtil.isSafeUrlForScanning(current);
            if (!safety.isValid()) {
                throw new IllegalArgumentException(safety.getErrorMessage());
            }

            String host = URI.create(current).getHost();
            ValidationUtil.ValidationResult dns = ValidationUtil.validateHostResolvesToPublicAddresses(host);
            if (!dns.isValid()) {
                throw new IllegalArgumentException(dns.getErrorMessage());
            }

            Connection.Response response = Jsoup.connect(current)
                    .timeout(TIMEOUT_MS)
                    .userAgent(USER_AGENT)
                    .followRedirects(false)
                    .ignoreHttpErrors(true)
                    .execute();

            int code = response.statusCode();
            if (code >= 300 && code < 400) {
                String location = response.header("Location");
                if (location == null || location.isBlank()) {
                    throw new IOException("Redirect response without Location header");
                }
                current = resolveLocation(current, location);
                continue;
            }

            if (code >= 400) {
                throw new IOException("HTTP error " + code + " fetching " + current);
            }

            return response.parse();
        }

        throw new IOException("Too many redirects");
    }

    private static String resolveLocation(String current, String location) {
        try {
            return URI.create(current).resolve(location).normalize().toString();
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid redirect URL", e);
        }
    }
}
