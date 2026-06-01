package com.complianceai.controller;

import com.complianceai.dto.request.LoginRequest;
import com.complianceai.dto.request.RefreshTokenRequest;
import com.complianceai.dto.request.SignupRequest;
import com.complianceai.dto.response.AuthResponse;
import com.complianceai.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        authService.sendPasswordResetEmail(email);
        return ResponseEntity.ok("If an account exists for that email, password reset instructions have been sent.");
    }

    @GetMapping("/oauth/google")
    public ResponseEntity<String> oauthGoogle() {
        return ResponseEntity.ok("OAuth Google endpoint - redirect handled by Spring Security");
    }
}
