package com.zenvyra.security;

import com.zenvyra.dto.response.AuthResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;

@Component
public class AuthCookieService {
    public static final String ACCESS_COOKIE = "zenvyra_access";
    public static final String REFRESH_COOKIE = "zenvyra_refresh";

    @Value("${app.jwt.expiration:86400000}")
    private long accessExpirationMillis;

    @Value("${app.jwt.refresh-expiration:604800000}")
    private long refreshExpirationMillis;

    @Value("${app.auth.cookies.secure:true}")
    private boolean secureCookies;

    public void addAuthCookies(HttpServletResponse response, AuthResponse authResponse) {
        addCookie(response, ACCESS_COOKIE, authResponse.getToken(), Duration.ofMillis(accessExpirationMillis));
        addCookie(response, REFRESH_COOKIE, authResponse.getRefreshToken(), Duration.ofMillis(refreshExpirationMillis));
    }

    public void clearAuthCookies(HttpServletResponse response) {
        addCookie(response, ACCESS_COOKIE, "", Duration.ZERO);
        addCookie(response, REFRESH_COOKIE, "", Duration.ZERO);
    }

    public Optional<String> readAccessToken(HttpServletRequest request) {
        return readCookie(request, ACCESS_COOKIE);
    }

    public Optional<String> readRefreshToken(HttpServletRequest request) {
        return readCookie(request, REFRESH_COOKIE);
    }

    public AuthResponse redactTokens(AuthResponse authResponse) {
        authResponse.setToken(null);
        authResponse.setRefreshToken(null);
        return authResponse;
    }

    private void addCookie(HttpServletResponse response, String name, String value, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(secureCookies)
                .sameSite("Lax")
                .path("/")
                .maxAge(maxAge)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private Optional<String> readCookie(HttpServletRequest request, String name) {
        if (request.getCookies() == null) {
            return Optional.empty();
        }
        return Arrays.stream(request.getCookies())
                .filter(cookie -> name.equals(cookie.getName()))
                .map(Cookie::getValue)
                .filter(value -> value != null && !value.isBlank())
                .findFirst();
    }
}
