package com.zenvyra.security;

import com.zenvyra.model.ApiKey;
import com.zenvyra.model.ApiKeyScope;
import com.zenvyra.service.ApiKeyManagementService;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ApiKeyAuthenticationFilterTest {

    @Mock
    private ApiKeyManagementService apiKeyManagementService;
    @Mock
    private FilterChain filterChain;

    private ApiKeyAuthenticationFilter filter;

    @BeforeEach
    void setUp() {
        filter = new ApiKeyAuthenticationFilter(apiKeyManagementService);
        SecurityContextHolder.clearContext();
    }

    @Test
    void rejectsRequestWithNoToken() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/v1/external/ai-act/systems");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(401, response.getStatus());
        verify(filterChain, never()).doFilter(any(), any());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void rejectsRequestWithInvalidApiKey() throws Exception {
        when(apiKeyManagementService.verifyToken(any())).thenReturn(Optional.empty());
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/v1/external/ai-act/systems");
        request.addHeader("X-API-Key", "sk_live_invalid");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(401, response.getStatus());
        verify(filterChain, never()).doFilter(any(), any());
    }

    @Test
    void allowsEvidencePostWhenApiKeyHasEvidenceWriteScope() throws Exception {
        ApiKey key = apiKey(List.of(ApiKeyScope.EVIDENCE_WRITE.name().toLowerCase()));
        when(apiKeyManagementService.verifyToken(eq("sk_live_good"))).thenReturn(Optional.of(key));
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/v1/external/ai-act/evidence");
        request.addHeader("X-API-Key", "sk_live_good");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(200, response.getStatus());
        verify(filterChain, times(1)).doFilter(any(), any());
        assertEquals("ROLE_API",
                SecurityContextHolder.getContext().getAuthentication().getAuthorities().iterator().next().getAuthority());
    }

    @Test
    void rejectsEvidencePostWhenApiKeyLacksEvidenceWriteScope() throws Exception {
        ApiKey key = apiKey(List.of("scan:read"));
        when(apiKeyManagementService.verifyToken(eq("sk_live_limited"))).thenReturn(Optional.of(key));
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/v1/external/ai-act/evidence");
        request.addHeader("X-API-Key", "sk_live_limited");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(403, response.getStatus());
        assertTrue(response.getErrorMessage() != null && response.getErrorMessage().contains("EVIDENCE_WRITE"));
        verify(filterChain, never()).doFilter(any(), any());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void allowsSystemsGetWhenApiKeyHasSystemsReadScope() throws Exception {
        ApiKey key = apiKey(List.of(ApiKeyScope.SYSTEMS_READ.name().toLowerCase()));
        when(apiKeyManagementService.verifyToken(eq("sk_live_reader"))).thenReturn(Optional.of(key));
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/v1/external/ai-act/systems");
        request.addHeader("X-API-Key", "sk_live_reader");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(200, response.getStatus());
        verify(filterChain, times(1)).doFilter(any(), any());
    }

    @Test
    void rejectsSystemsGetWhenApiKeyOnlyHasWriteScope() throws Exception {
        ApiKey key = apiKey(List.of(ApiKeyScope.SYSTEMS_WRITE.name().toLowerCase()));
        when(apiKeyManagementService.verifyToken(eq("sk_live_writer"))).thenReturn(Optional.of(key));
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/v1/external/ai-act/systems");
        request.addHeader("X-API-Key", "sk_live_writer");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(403, response.getStatus());
        assertTrue(response.getErrorMessage() != null && response.getErrorMessage().contains("SYSTEMS_READ"));
        verify(filterChain, never()).doFilter(any(), any());
    }

    @Test
    void allowsSystemsPostWhenApiKeyHasSystemsWriteScope() throws Exception {
        ApiKey key = apiKey(List.of(ApiKeyScope.SYSTEMS_WRITE.name().toLowerCase()));
        when(apiKeyManagementService.verifyToken(eq("sk_live_writer"))).thenReturn(Optional.of(key));
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/v1/external/ai-act/systems");
        request.addHeader("X-API-Key", "sk_live_writer");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(200, response.getStatus());
        verify(filterChain, times(1)).doFilter(any(), any());
    }

    @Test
    void rejectsSystemsPostWhenApiKeyOnlyHasReadScope() throws Exception {
        ApiKey key = apiKey(List.of(ApiKeyScope.SYSTEMS_READ.name().toLowerCase()));
        when(apiKeyManagementService.verifyToken(eq("sk_live_reader"))).thenReturn(Optional.of(key));
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/v1/external/ai-act/systems");
        request.addHeader("X-API-Key", "sk_live_reader");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(403, response.getStatus());
        assertTrue(response.getErrorMessage() != null && response.getErrorMessage().contains("SYSTEMS_WRITE"));
        verify(filterChain, never()).doFilter(any(), any());
    }

    @Test
    void externalNonAiActPathsDoNotRequireScope() throws Exception {
        ApiKey key = apiKey(List.of("scan:read"));
        when(apiKeyManagementService.verifyToken(eq("sk_live_other"))).thenReturn(Optional.of(key));
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/v1/external/other");
        request.addHeader("X-API-Key", "sk_live_other");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(200, response.getStatus());
        verify(filterChain, times(1)).doFilter(any(), any());
    }

    @Test
    void acceptsBearerStyleApiKey() throws Exception {
        ApiKey key = apiKey(List.of("scan:read"));
        when(apiKeyManagementService.verifyToken(eq("sk_live_bearer"))).thenReturn(Optional.of(key));
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/v1/external/other");
        request.addHeader("Authorization", "Bearer sk_live_bearer");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(200, response.getStatus());
        verify(filterChain, times(1)).doFilter(any(), any());
    }

    private static ApiKey apiKey(List<String> scopes) {
        return ApiKey.builder()
                .id("key-1")
                .userId("user-1")
                .keyHash("hash")
                .prefix("sk_live_xxxxx")
                .scopes(scopes)
                .build();
    }
}
