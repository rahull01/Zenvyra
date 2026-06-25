package com.zenvyra.controller;

import com.zenvyra.dto.request.LoginRequest;
import com.zenvyra.dto.request.RefreshTokenRequest;
import com.zenvyra.dto.request.ResetPasswordRequest;
import com.zenvyra.dto.request.SignupRequest;
import com.zenvyra.dto.response.AuthResponse;
import com.zenvyra.security.AuthCookieService;
import com.zenvyra.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthCookieService authCookieService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.signup(request);
        authCookieService.addAuthCookies(response, authResponse);
        return ResponseEntity.ok(authCookieService.redactTokens(authResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.login(request);
        authCookieService.addAuthCookies(response, authResponse);
        return ResponseEntity.ok(authCookieService.redactTokens(authResponse));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @Valid @RequestBody(required = false) RefreshTokenRequest request,
            HttpServletRequest servletRequest,
            HttpServletResponse response) {
        String refreshToken = request != null && request.getRefreshToken() != null
                ? request.getRefreshToken()
                : authCookieService.readRefreshToken(servletRequest).orElse(null);
        AuthResponse authResponse = authService.refreshToken(new RefreshTokenRequest(refreshToken));
        authCookieService.addAuthCookies(response, authResponse);
        return ResponseEntity.ok(authCookieService.redactTokens(authResponse));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        authCookieService.clearAuthCookies(response);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        authService.sendPasswordResetEmail(email);
        return ResponseEntity.ok("If an account exists for that email, password reset instructions have been sent.");
    }

    @PostMapping("/send-verification")
    public ResponseEntity<String> sendVerification(@RequestParam String email) {
        authService.sendVerificationEmail(email);
        return ResponseEntity.ok("If an unverified account exists for that email, verification instructions have been sent.");
    }

    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok("Email verified successfully.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok("Password reset successfully.");
    }

    @GetMapping("/oauth/google")
    public ResponseEntity<String> oauthGoogle() {
        return ResponseEntity.ok("OAuth Google endpoint - redirect handled by Spring Security");
    }
}
