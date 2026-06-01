package com.complianceai.security;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private final PerIpRateLimiter perIpRateLimiter;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        if (requestURI != null && requestURI.contains("/health")) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIP = getClientIP(request);

        Bucket bucket = getBucketForRequest(requestURI, clientIP);

        if (bucket != null) {
            ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

            if (probe.isConsumed()) {
                response.setHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
                filterChain.doFilter(request, response);
            } else {
                log.warn("Rate limit exceeded for IP: {} on endpoint: {}", clientIP, requestURI);
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setHeader("X-Rate-Limit-Retry-After-Seconds",
                        String.valueOf(probe.getNanosToWaitForRefill() / 1_000_000_000));
                response.getWriter().write("{\"error\":\"Too many requests\",\"retryAfter\":"
                        + (probe.getNanosToWaitForRefill() / 1_000_000_000) + "}");
                return;
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }

    private Bucket getBucketForRequest(String requestURI, String clientIP) {
        if (requestURI.contains("/scan/free")) {
            return perIpRateLimiter.freeScanBucket(clientIP);
        }
        if (requestURI.contains("/auth/")) {
            return perIpRateLimiter.authBucket(clientIP);
        }
        if (requestURI.startsWith("/api/") || requestURI.contains("/api/")) {
            return perIpRateLimiter.apiBucket(clientIP);
        }
        return null;
    }

    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
