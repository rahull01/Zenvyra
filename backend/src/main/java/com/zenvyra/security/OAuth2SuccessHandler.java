package com.zenvyra.security;

import com.zenvyra.dto.response.AuthResponse;
import com.zenvyra.service.AuthService;
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
    private final AuthCookieService authCookieService;

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

        authCookieService.addAuthCookies(response, authResponse);

        String base = frontendUrl.endsWith("/") ? frontendUrl.substring(0, frontendUrl.length() - 1) : frontendUrl;
        String redirectUrl = base + "/dashboard";

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
