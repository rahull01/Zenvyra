package com.zenvyra.controller;

import com.zenvyra.config.SecurityConfig;
import com.zenvyra.dto.response.ComplianceScoreResponse;
import com.zenvyra.security.ApiKeyAuthenticationFilter;
import com.zenvyra.security.AuthCookieService;
import com.zenvyra.security.JwtAuthenticationFilter;
import com.zenvyra.security.JwtTokenProvider;
import com.zenvyra.security.RateLimitFilter;
import com.zenvyra.security.RedisRateLimiter;
import com.zenvyra.service.ScanService;
import com.zenvyra.service.TrackerScanService;
import com.zenvyra.service.ApiKeyManagementService;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteScanResultRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ScanController.class)
@Import({RateLimitFilter.class, RedisRateLimiter.class})
@ActiveProfiles("test")
@TestPropertySource(properties = "rate-limit.in-memory-fallback-enabled=true")
class RateLimitFilterTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ScanService scanService;
    @MockBean
    private TrackerScanService trackerScanService;
    @MockBean
    private ApiKeyManagementService apiKeyManagementService;
    @MockBean
    private JwtTokenProvider jwtTokenProvider;
    @MockBean
    private AuthCookieService authCookieService;
    @MockBean
    private UserDetailsService userDetailsService;
    @MockBean
    private WebsiteScanResultRepository websiteScanResultRepository;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    private StringRedisTemplate stringRedisTemplate;

    @Test
    @WithMockUser
    void fourthFreeScanRequestFromSameClientReturns429() throws Exception {
        when(stringRedisTemplate.execute(any(), anyList(), any(), any(), any(), any()))
                .thenThrow(new RuntimeException("Redis unavailable in slice test"));
        when(scanService.performFreeScan(anyString())).thenReturn(ComplianceScoreResponse.builder()
                .url("https://example.test")
                .score(92.0)
                .scanDate(LocalDateTime.now())
                .build());

        for (int i = 0; i < 3; i++) {
            mockMvc.perform(get("/scan/free")
                            .param("url", "https://example.test")
                            .with(request -> {
                                request.setRemoteAddr("203.0.113.10");
                                return request;
                            }))
                    .andExpect(status().isOk());
        }

        mockMvc.perform(get("/scan/free")
                        .param("url", "https://example.test")
                        .with(request -> {
                            request.setRemoteAddr("203.0.113.10");
                            return request;
                        }))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    void oversizedPublicWriteRequestReturns413() throws Exception {
        RateLimitFilter filter = new RateLimitFilter(
                mock(RedisRateLimiter.class),
                new com.zenvyra.config.RateLimitProperties());
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/scan/free");
        request.setContentType(org.springframework.http.MediaType.APPLICATION_JSON_VALUE);
        request.setContent(new byte[(65 * 1024)]);
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, new MockFilterChain());

        assertEquals(413, response.getStatus());
    }
}
