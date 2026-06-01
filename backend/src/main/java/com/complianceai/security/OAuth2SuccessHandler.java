package com.complianceai.security;

import com.complianceai.dto.response.AuthResponse;
import com.complianceai.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AuthService authService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        if (!(authentication instanceof OAuth2AuthenticationToken oauth2Token)) {
            super.onAuthenticationSuccess(request, response, authentication);
            return;
        }

        OAuth2User oauthUser = oauth2Token.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String fullName = oauthUser.getAttribute("name");

        if (email == null || email.isBlank()) {
            throw new IllegalStateException("Google OAuth did not return an email address.");
        }

        AuthResponse authResponse = authService.loginWithOAuth(email, fullName);

        String userJson = objectMapper.writeValueAsString(authResponse.getUser());
        String encodedUserJson = java.net.URLEncoder.encode(userJson, java.nio.charset.StandardCharsets.UTF_8);

        String tokenEnc = java.net.URLEncoder.encode(authResponse.getToken(), java.nio.charset.StandardCharsets.UTF_8);
        String refreshEnc = java.net.URLEncoder.encode(authResponse.getRefreshToken(), java.nio.charset.StandardCharsets.UTF_8);

        String fragment = "token=" + tokenEnc + "&refreshToken=" + refreshEnc + "&user=" + encodedUserJson;

        String base = frontendUrl.endsWith("/") ? frontendUrl.substring(0, frontendUrl.length() - 1) : frontendUrl;
        String redirectUrl = base + "/oauth/callback#" + fragment;

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
