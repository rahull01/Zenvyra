package com.zenvyra.controller;

import com.zenvyra.model.Banner;
import com.zenvyra.model.ConsentLog;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteScanResultRepository;
import com.zenvyra.security.AuthCookieService;
import com.zenvyra.security.JwtTokenProvider;
import com.zenvyra.security.RedisRateLimiter;
import com.zenvyra.service.ApiKeyManagementService;
import com.zenvyra.service.BannerService;
import com.zenvyra.service.ConsentAuditLogService;
import com.zenvyra.service.ConsentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest({BannerController.class, ConsentController.class, ConsentAuditController.class})
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class PublicInstallFlowTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BannerService bannerService;
    @MockBean
    private WebsiteScanResultRepository websiteScanResultRepository;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    private ConsentService consentService;
    @MockBean
    private ConsentAuditLogService consentAuditLogService;
    @MockBean
    private ApiKeyManagementService apiKeyManagementService;
    @MockBean
    private JwtTokenProvider jwtTokenProvider;
    @MockBean
    private AuthCookieService authCookieService;
    @MockBean
    private UserDetailsService userDetailsService;
    @MockBean
    private RedisRateLimiter redisRateLimiter;

    @Test
    void activePublicBannerScriptRendersConsentJavascript() throws Exception {
        when(bannerService.getBannerById("banner-1")).thenReturn(Banner.builder()
                .id("banner-1")
                .status("active")
                .colors(Map.of("background", "#111827", "primary", "#f59e0b", "text", "#ffffff"))
                .content(Map.of(
                        "headline", "Privacy choices",
                        "description", "Review cookies before analytics loads.",
                        "acceptText", "Accept",
                        "rejectText", "Reject"
                ))
                .build());

        mockMvc.perform(get("/banners/public/banner-1/banner.js"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith("application/javascript"))
                .andExpect(content().string(containsString("Zenvyra")))
                .andExpect(content().string(containsString("ZenvyraConsent")))
                .andExpect(content().string(containsString("/api/v1/consent/log")));
    }

    @Test
    void inactivePublicBannerScriptReturnsNotFoundWarning() throws Exception {
        when(bannerService.getBannerById("banner-2")).thenReturn(Banner.builder()
                .id("banner-2")
                .status("draft")
                .build());

        mockMvc.perform(get("/banners/public/banner-2/banner.js"))
                .andExpect(status().isNotFound())
                .andExpect(content().string(containsString("banner is not active")));
    }

    @Test
    void publicConsentLogStoresRequestMetadataAndQueuesAuditLog() throws Exception {
        mockMvc.perform(post("/consent/log")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Forwarded-For", "203.0.113.12, 10.0.0.1")
                        .header("CF-IPCountry", "gb")
                        .header("User-Agent", "JUnit Browser")
                        .content("""
                                {
                                  "bannerId": "banner-1",
                                  "choices": { "analytics": true, "marketing": false, "functional": true }
                                }
                                """))
                .andExpect(status().isOk());

        verify(consentService).logConsent(any(ConsentLog.class));
        verify(consentAuditLogService).ingestAsync(any(), eq("GB"));
    }

    @Test
    void publicConsentAuditEndpointAcceptsAuditPayload() throws Exception {
        mockMvc.perform(post("/consent/audit-log")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Country-Code", "US")
                        .content("""
                                {
                                  "siteId": "site-1",
                                  "bannerId": "banner-1",
                                  "anonymousUserId": "anon-1",
                                  "choices": { "analytics": true, "marketing": false }
                                }
                                """))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.status").value("accepted"));

        verify(consentAuditLogService).ingestAsync(any(), eq("US"));
    }
}
