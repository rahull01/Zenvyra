package com.zenvyra.security;

import com.zenvyra.model.ApiKey;
import com.zenvyra.model.ApiKeyScope;
import com.zenvyra.service.ApiKeyManagementService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {
    // `/api` is the configured servlet context path; `/v1/external/**` is the servlet-relative path.
    private static final AntPathRequestMatcher EXTERNAL_API_MATCHER =
            new AntPathRequestMatcher("/v1/external/**");

    private static final String EVIDENCE_PATH_PREFIX = "/v1/external/ai-act/evidence";
    private static final String SYSTEMS_PATH = "/v1/external/ai-act/systems";

    private final ApiKeyManagementService apiKeyManagementService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !EXTERNAL_API_MATCHER.matches(request);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = request.getHeader("X-API-Key");
        if (token == null || token.isBlank()) {
            String auth = request.getHeader("Authorization");
            if (auth != null && auth.startsWith("Bearer sk_live_")) {
                token = auth.substring("Bearer ".length());
            }
        }

        ApiKey apiKey = apiKeyManagementService.verifyToken(token).orElse(null);
        if (apiKey == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid API key");
            return;
        }

        ApiKeyScope requiredScope = resolveRequiredScope(request);
        if (requiredScope != null && !hasScope(apiKey, requiredScope)) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN,
                    "API key missing required scope: " + requiredScope.name());
            return;
        }

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                apiKey.getUserId(),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_API")));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        filterChain.doFilter(request, response);
    }

    private static ApiKeyScope resolveRequiredScope(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();
        if (path != null && path.startsWith(EVIDENCE_PATH_PREFIX)) {
            return ApiKeyScope.EVIDENCE_WRITE;
        }
        if (path != null && path.equals(SYSTEMS_PATH)) {
            return HttpMethod.GET.matches(method) ? ApiKeyScope.SYSTEMS_READ : ApiKeyScope.SYSTEMS_WRITE;
        }
        return null;
    }

    private static boolean hasScope(ApiKey apiKey, ApiKeyScope required) {
        Set<ApiKeyScope> granted = apiKey.getScopes() == null
                ? Set.of()
                : apiKey.getScopes().stream()
                        .map(ApiKeyScope::fromString)
                        .filter(java.util.Optional::isPresent)
                        .map(java.util.Optional::get)
                        .collect(Collectors.toSet());
        return granted.contains(required);
    }
}
