package com.complianceai.security;

import com.complianceai.model.User;
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
            if (requestURI.contains("/scan/free")) {
                // Limit free scan by Client IP: max 3 requests per hour
                String clientIP = getClientIP(request);
                String redisKey = "rate_limit:free_scan:ip:" + clientIP;
                
                RedisRateLimiter.RateLimitResult result = redisRateLimiter.isAllowed(redisKey, 3, 3600);
                if (!result.isAllowed()) {
                    log.warn("Rate limit exceeded for IP: {} on free scan", clientIP);
                    sendRateLimitExceededResponse(response, 3600);
                    return;
                }
                response.setHeader("X-Rate-Limit-Remaining", String.valueOf(result.getRemainingTokens()));

            } else if (requestURI.contains("/scan/full")) {
                // Limit full scan by JWT User ID: max 20 requests per day
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof User) {
                    User user = (User) auth.getPrincipal();
                    String userId = user.getId();
                    String redisKey = "rate_limit:full_scan:user:" + userId;
                    
                    RedisRateLimiter.RateLimitResult result = redisRateLimiter.isAllowed(redisKey, 20, 86400);
                    if (!result.isAllowed()) {
                        log.warn("Rate limit exceeded for User ID: {} on full scan", userId);
                        sendRateLimitExceededResponse(response, 86400);
                        return;
                    }
                    response.setHeader("X-Rate-Limit-Remaining", String.valueOf(result.getRemainingTokens()));
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
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
