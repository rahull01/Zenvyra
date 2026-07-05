package com.zenvyra.security;

import com.zenvyra.config.RateLimitProperties;
import com.zenvyra.model.User;
import com.zenvyra.util.LogSanitizer;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private final RedisRateLimiter redisRateLimiter;
    private final RateLimitProperties rateLimitProperties;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        if (requestURI != null && requestURI.contains("/health")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Apply rate limiting based on route
        if (requestURI != null) {
            if (isPublicWriteEndpoint(request) && exceedsPublicWriteLimit(request)) {
                response.setStatus(HttpStatus.PAYLOAD_TOO_LARGE.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"status\":413,\"error\":\"Payload Too Large\",\"message\":\"Request body is too large.\"}");
                return;
            }

            if (requestURI.contains("/scan/free") || requestURI.contains("/scan/leads")) {
                // Limit public scanner actions by Client IP: max 3 requests per hour, 5 per day
                String clientIP = getClientIP(request);
                String hourKey = "rate_limit:public_scanner:ip:" + clientIP + ":hour";
                String dayKey = "rate_limit:public_scanner:ip:" + clientIP + ":day";

                RedisRateLimiter.RateLimitResult hourResult = redisRateLimiter.isAllowed(
                        hourKey,
                        rateLimitProperties.getPublicScannerHourly(),
                        rateLimitProperties.getPublicScannerHourlyWindowSeconds());
                if (!hourResult.isAllowed()) {
                    log.warn("Rate limit exceeded for {} on public scanner (hourly)", LogSanitizer.ip(clientIP));
                    sendRateLimitExceededResponse(response, rateLimitProperties.getPublicScannerHourlyWindowSeconds());
                    return;
                }

                RedisRateLimiter.RateLimitResult dayResult = redisRateLimiter.isAllowed(
                        dayKey,
                        rateLimitProperties.getPublicScannerDaily(),
                        rateLimitProperties.getPublicScannerDailyWindowSeconds());
                if (!dayResult.isAllowed()) {
                    log.warn("Rate limit exceeded for {} on public scanner (daily)", LogSanitizer.ip(clientIP));
                    sendRateLimitExceededResponse(response, rateLimitProperties.getPublicScannerDailyWindowSeconds());
                    return;
                }

                response.setHeader("X-Rate-Limit-Remaining-Hour", String.valueOf(hourResult.getRemainingTokens()));
                response.setHeader("X-Rate-Limit-Remaining-Day", String.valueOf(dayResult.getRemainingTokens()));

            } else if (requestURI.contains("/badge/")) {
                String clientIP = getClientIP(request);
                String redisKey = "rate_limit:badge:ip:" + clientIP;

                RedisRateLimiter.RateLimitResult result = redisRateLimiter.isAllowed(
                        redisKey,
                        rateLimitProperties.getBadgePerMinute(),
                        rateLimitProperties.getBadgeWindowSeconds());
                if (!result.isAllowed()) {
                    log.warn("Rate limit exceeded for {} on badge", LogSanitizer.ip(clientIP));
                    sendRateLimitExceededResponse(response, rateLimitProperties.getBadgeWindowSeconds());
                    return;
                }
                response.setHeader("X-Rate-Limit-Remaining", String.valueOf(result.getRemainingTokens()));

            } else if (requestURI.contains("/verify/") || requestURI.contains("/policies/public/")
                    || requestURI.contains("/banners/public/") || requestURI.contains("/consent/sync")) {
                String clientIP = getClientIP(request);
                String redisKey = "rate_limit:public_read:ip:" + clientIP;

                RedisRateLimiter.RateLimitResult result = redisRateLimiter.isAllowed(
                        redisKey,
                        rateLimitProperties.getPublicReadPerMinute(),
                        rateLimitProperties.getPublicReadWindowSeconds());
                if (!result.isAllowed()) {
                    log.warn("Rate limit exceeded for {} on public read endpoint", LogSanitizer.ip(clientIP));
                    sendRateLimitExceededResponse(response, rateLimitProperties.getPublicReadWindowSeconds());
                    return;
                }
                response.setHeader("X-Rate-Limit-Remaining", String.valueOf(result.getRemainingTokens()));

            } else if (requestURI.contains("/auth/login") || requestURI.contains("/auth/signup")
                    || requestURI.contains("/auth/forgot-password") || requestURI.contains("/auth/send-verification")
                    || requestURI.contains("/auth/verify-email")) {
                String clientIP = getClientIP(request);
                String redisKey = "rate_limit:auth:ip:" + clientIP;

                RedisRateLimiter.RateLimitResult result = redisRateLimiter.isAllowed(
                        redisKey,
                        rateLimitProperties.getAuthPerWindow(),
                        rateLimitProperties.getAuthWindowSeconds());
                if (!result.isAllowed()) {
                    log.warn("Rate limit exceeded for {} on auth endpoint", LogSanitizer.ip(clientIP));
                    sendRateLimitExceededResponse(response, rateLimitProperties.getAuthWindowSeconds());
                    return;
                }
                response.setHeader("X-Rate-Limit-Remaining", String.valueOf(result.getRemainingTokens()));

            } else if (requestURI.contains("/consent/log") || requestURI.contains("/consent/audit-log")
                    || requestURI.contains("/dsar/submit")) {
                String clientIP = getClientIP(request);
                String redisKey = "rate_limit:public_write:ip:" + clientIP;

                RedisRateLimiter.RateLimitResult result = redisRateLimiter.isAllowed(
                        redisKey,
                        rateLimitProperties.getPublicWritePerMinute(),
                        rateLimitProperties.getPublicWriteWindowSeconds());
                if (!result.isAllowed()) {
                    log.warn("Rate limit exceeded for {} on public write endpoint", LogSanitizer.ip(clientIP));
                    sendRateLimitExceededResponse(response, rateLimitProperties.getPublicWriteWindowSeconds());
                    return;
                }
                response.setHeader("X-Rate-Limit-Remaining", String.valueOf(result.getRemainingTokens()));

            } else if (requestURI.contains("/dodo/webhooks") || requestURI.contains("/webhooks/payment")
                    || requestURI.contains("/payments/dodo-webhook")) {
                String clientIP = getClientIP(request);
                String redisKey = "rate_limit:payment_webhook:ip:" + clientIP;

                RedisRateLimiter.RateLimitResult result = redisRateLimiter.isAllowed(
                        redisKey,
                        rateLimitProperties.getPaymentWebhookPerMinute(),
                        rateLimitProperties.getPaymentWebhookWindowSeconds());
                if (!result.isAllowed()) {
                    log.warn("Rate limit exceeded for {} on payment webhook endpoint", LogSanitizer.ip(clientIP));
                    sendRateLimitExceededResponse(response, rateLimitProperties.getPaymentWebhookWindowSeconds());
                    return;
                }
                response.setHeader("X-Rate-Limit-Remaining", String.valueOf(result.getRemainingTokens()));

            } else if (requestURI.contains("/scan/full")) {
                // Limit full scan by plan tier + organization
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof User) {
                    User user = (User) auth.getPrincipal();
                    String userId = user.getId();
                    int userLimit = resolveScanLimitForPlan(user.getPlan());
                    String userKey = "rate_limit:full_scan:user:" + userId;

                    RedisRateLimiter.RateLimitResult userResult = redisRateLimiter.isAllowed(
                            userKey,
                            userLimit,
                            rateLimitProperties.getFullScanWindowSeconds());
                    if (!userResult.isAllowed()) {
                        log.warn("Rate limit exceeded for {} on full scan (user)", LogSanitizer.id("user", userId));
                        sendRateLimitExceededResponse(response, rateLimitProperties.getFullScanWindowSeconds());
                        return;
                    }

                    String orgId = resolveOrgId(user);
                    if (orgId != null && !orgId.isBlank()) {
                        String orgKey = "rate_limit:full_scan:org:" + orgId;
                        int orgLimit = Math.max(
                                userLimit * rateLimitProperties.getFullScanOrgMultiplier(),
                                rateLimitProperties.getFullScanOrgMin());
                        RedisRateLimiter.RateLimitResult orgResult = redisRateLimiter.isAllowed(
                                orgKey,
                                orgLimit,
                                rateLimitProperties.getFullScanWindowSeconds());
                        if (!orgResult.isAllowed()) {
                            log.warn("Rate limit exceeded for org {} on full scan", LogSanitizer.id("org", orgId));
                            sendRateLimitExceededResponse(response, rateLimitProperties.getFullScanWindowSeconds());
                            return;
                        }
                        response.setHeader("X-Rate-Limit-Remaining-Org", String.valueOf(orgResult.getRemainingTokens()));
                    }

                    response.setHeader("X-Rate-Limit-Remaining-User", String.valueOf(userResult.getRemainingTokens()));
                }
                // If not authenticated, let it pass so Spring Security's authorization handles it
            }
        }

        filterChain.doFilter(request, response);
    }

    private void sendRateLimitExceededResponse(HttpServletResponse response, long retryAfterSeconds) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType("application/json");
        response.setHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(retryAfterSeconds));
        response.getWriter().write("{\"status\":429,\"error\":\"Too Many Requests\",\"message\":\"Rate limit exceeded. Please try again later.\"}");
    }

    private String getClientIP(HttpServletRequest request) {
        // ForwardedHeaderFilter resolves the real client IP from X-Forwarded-For / Forwarded headers.
        return request.getRemoteAddr();
    }

    private boolean isPublicWriteEndpoint(HttpServletRequest request) {
        String method = request.getMethod();
        if (!"POST".equalsIgnoreCase(method) && !"PUT".equalsIgnoreCase(method) && !"PATCH".equalsIgnoreCase(method)) {
            return false;
        }
        String path = request.getRequestURI();
        return path != null && (
                path.contains("/scan/free")
                        || path.contains("/scan/leads")
                        || path.contains("/consent/log")
                        || path.contains("/consent/audit-log")
                        || path.contains("/consent/sync")
                        || path.contains("/dsar/submit")
        );
    }

    private boolean exceedsPublicWriteLimit(HttpServletRequest request) {
        long contentLength = request.getContentLengthLong();
        return contentLength > rateLimitProperties.getPublicWriteMaxBytes();
    }

    private int resolveScanLimitForPlan(String plan) {
        if (plan == null) {
            return rateLimitProperties.getFullScanFree();
        }
        return switch (plan.toLowerCase()) {
            case "starter" -> rateLimitProperties.getFullScanStarter();
            case "pro" -> rateLimitProperties.getFullScanPro();
            case "enterprise" -> rateLimitProperties.getFullScanEnterprise();
            case "free", "freemium" -> rateLimitProperties.getFullScanFree();
            default -> rateLimitProperties.getFullScanFree();
        };
    }

    private String resolveOrgId(User user) {
        // Prefer an explicit organizationId when the User model exposes one; otherwise fall back to the user id.
        // Both are UUID/Mongo ids and therefore safe to embed in a Redis key.
        try {
            String organizationId = (String) User.class.getMethod("getOrganizationId").invoke(user);
            if (organizationId != null && !organizationId.isBlank()) {
                return organizationId;
            }
        } catch (ReflectiveOperationException ignored) {
            // User does not expose getOrganizationId(); fall through to user id.
        }
        return user.getId();
    }
}
