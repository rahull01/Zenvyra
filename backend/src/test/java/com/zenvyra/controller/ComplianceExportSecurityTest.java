package com.zenvyra.controller;

import com.zenvyra.service.ComplianceExportService;
import com.zenvyra.service.ApiKeyManagementService;
import com.zenvyra.security.AuthCookieService;
import com.zenvyra.security.JwtTokenProvider;
import com.zenvyra.security.RedisRateLimiter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ComplianceExportController.class)
@ActiveProfiles("test")
class ComplianceExportSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ComplianceExportService complianceExportService;
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
    void unauthenticatedComplianceExportIsBlocked() throws Exception {
        mockMvc.perform(get("/admin/compliance/export/site-123"))
                .andExpect(status().is3xxRedirection());
    }
}
