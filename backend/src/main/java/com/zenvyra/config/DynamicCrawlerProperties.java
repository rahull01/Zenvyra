package com.zenvyra.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Optional dynamic crawler configuration. The default remains the existing
 * static JSoup fetch path; enabling this delegates rendering to a separately
 * managed headless-browser service.
 */
@Data
@Component
@ConfigurationProperties(prefix = "scanner.dynamic")
public class DynamicCrawlerProperties {

    /** Enables the dynamic render path before falling back to static fetch. */
    private boolean enabled = false;

    /** HTTP endpoint for the headless renderer. It receives {"url": "..."} and returns HTML or {"html": "..."}. */
    private String renderEndpoint = "";

    /** Optional bearer token sent to the renderer. */
    private String apiKey = "";

    /** Timeout for the renderer request. */
    private int timeoutMs = 10_000;

    /** Maximum rendered HTML body accepted from the renderer. */
    private int maxHtmlBytes = 1_000_000;
}
