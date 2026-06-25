package com.zenvyra.security;

import com.zenvyra.util.LogSanitizer;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.HexFormat;

@Slf4j
@Component
public class RequestCorrelationFilter extends OncePerRequestFilter {
    public static final String REQUEST_ID_HEADER = "X-Request-Id";
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int MAX_REQUEST_ID_LENGTH = 80;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        long started = System.currentTimeMillis();
        String requestId = resolveRequestId(request);
        MDC.put("requestId", requestId);
        response.setHeader(REQUEST_ID_HEADER, requestId);
        try {
            filterChain.doFilter(request, response);
        } finally {
            long durationMs = System.currentTimeMillis() - started;
            log.info("request_id={} method={} path={} status={} duration_ms={} remote_ip={}",
                    requestId,
                    request.getMethod(),
                    LogSanitizer.url(request.getRequestURI()),
                    response.getStatus(),
                    durationMs,
                    LogSanitizer.ip(clientIp(request)));
            MDC.remove("requestId");
        }
    }

    private String resolveRequestId(HttpServletRequest request) {
        String header = request.getHeader(REQUEST_ID_HEADER);
        if (header != null) {
            String cleaned = header.replaceAll("[^A-Za-z0-9._:-]", "").trim();
            if (!cleaned.isBlank()) {
                return cleaned.length() <= MAX_REQUEST_ID_LENGTH ? cleaned : cleaned.substring(0, MAX_REQUEST_ID_LENGTH);
            }
        }
        byte[] bytes = new byte[16];
        RANDOM.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }

    private String clientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
