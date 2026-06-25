package com.zenvyra.controller;

import com.zenvyra.config.SecurityConfig;
import com.zenvyra.dto.response.admin.AdminOpsOverviewResponse;
import com.zenvyra.security.ApiKeyAuthenticationFilter;
import com.zenvyra.security.AuthCookieService;
import com.zenvyra.security.JwtAuthenticationFilter;
import com.zenvyra.security.JwtTokenProvider;
import com.zenvyra.security.OAuth2SuccessHandler;
import com.zenvyra.security.RateLimitFilter;
import com.zenvyra.security.RedisRateLimiter;
import com.zenvyra.service.AdminOpsService;
import com.zenvyra.service.ApiKeyManagementService;
import com.zenvyra.service.SetupPackageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminOpsController.class)
@Import(SecurityConfig.class)
@ActiveProfiles("test")
class AdminOpsSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminOpsService adminOpsService;
    @MockBean
    private SetupPackageService setupPackageService;
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
    @MockBean
    private OAuth2SuccessHandler oAuth2SuccessHandler;
    @MockBean
    private PasswordEncoder passwordEncoder;

    @Test
    void unauthenticatedAdminOpsRequestIsBlocked() throws Exception {
        mockMvc.perform(get("/admin/ops/overview"))
                .andExpect(status().is3xxRedirection());
    }

    @Test
    @WithMockUser(roles = "USER")
    void normalUserCannotAccessAdminOps() throws Exception {
        mockMvc.perform(get("/admin/ops/overview"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void adminCanAccessAdminOps() throws Exception {
        when(adminOpsService.overview()).thenReturn(AdminOpsOverviewResponse.builder()
                .systemHealthStates(List.of())
                .highRiskAccounts(List.of())
                .launchChecklist(List.of())
                .build());

        mockMvc.perform(get("/admin/ops/overview"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'"))
                .andExpect(header().string("X-Frame-Options", "DENY"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void adminSetupTaskMutationRequiresCsrfToken() throws Exception {
        mockMvc.perform(patch("/admin/ops/setup-tasks/order-1")
                        .contentType("application/json")
                        .content("{\"setupStatus\":\"VERIFIED\"}"))
                .andExpect(status().isForbidden());
    }
}
