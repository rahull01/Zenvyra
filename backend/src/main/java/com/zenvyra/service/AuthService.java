package com.zenvyra.service;

import com.zenvyra.exception.ApiException;
import com.zenvyra.dto.request.LoginRequest;
import com.zenvyra.dto.request.RefreshTokenRequest;
import com.zenvyra.dto.request.ResetPasswordRequest;
import com.zenvyra.dto.request.SignupRequest;
import com.zenvyra.dto.response.AuthResponse;
import com.zenvyra.dto.response.UserResponse;
import com.zenvyra.model.RefreshToken;
import com.zenvyra.model.User;
import com.zenvyra.model.Website;
import com.zenvyra.repository.RefreshTokenRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteRepository;
import com.zenvyra.security.JwtTokenProvider;
import com.zenvyra.util.LogSanitizer;
import com.zenvyra.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;
    private final OrganizationService organizationService;
    private final WebsiteRepository websiteRepository;

    /**
     * Minimum wall-clock duration (ms) for sensitive unauthenticated endpoints
     * (password reset / email verification resend) to mitigate timing-based
     * account enumeration. Realistic DB + bcrypt costs are well under this, so
     * the helper only ever sleeps the remaining slack.
     */
    private static final long TARGET_DELAY_MS = 200;

    public AuthResponse signup(SignupRequest request) {
        ValidationUtil.ValidationResult validation = ValidationUtil.validateSignup(
                request.getEmail(), request.getPassword(), request.getFullName());
        if (!validation.isValid()) {
            throw ApiException.badRequest(validation.getErrorMessage());
        }

        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw ApiException.conflict("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .companyName(request.getCompanyName() != null ? request.getCompanyName().trim() : null)
                .industry(request.getIndustry())
                .employeeCount(request.getEmployeeCount())
                .accountType(normalizeAccountType(request.getAccountType()))
                .websiteUrl(normalizeOptionalUrl(request.getWebsiteUrl()))
                .primaryRegion(request.getPrimaryRegion())
                .platform(request.getPlatform())
                .aiUsage(request.getAiUsage())
                .onboardingCompleted(false)
                .emailVerified(false)
                .plan("free")
                .status("active")
                .role("ROLE_USER")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
        organizationService.createOrUpdateDefaultOrganization(user, user.getWebsiteUrl());
        createFirstWebsiteIfProvided(user);
        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = createRefreshToken(user);

        emailService.sendWelcomeEmail(user.getEmail(), user.getFullName());
        emailService.sendVerifyEmail(user.getEmail(), jwtTokenProvider.generateEmailVerificationToken(user.getEmail()));

        return buildAuthResponse(user, accessToken, refreshToken, "Account created successfully");
    }

    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for {}", LogSanitizer.email(request.getEmail()));

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> {
                    log.warn("Login failed: user not found for {}", LogSanitizer.email(request.getEmail()));
                    return ApiException.unauthorized("Invalid email or password");
                });

        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed: invalid password for {}", LogSanitizer.email(request.getEmail()));
            throw ApiException.unauthorized("Invalid email or password");
        }

        log.info("Login successful for {}", LogSanitizer.email(request.getEmail()));
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = createRefreshToken(user);

        return buildAuthResponse(user, accessToken, refreshToken, "Login successful");
    }

    public AuthResponse loginWithOAuth(String email, String fullName) {
        LocalDateTime now = LocalDateTime.now();
        String normalizedEmail = email.trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .map(existing -> {
                    if (existing.getFullName() == null || existing.getFullName().isBlank()) {
                        existing.setFullName(fullName != null ? fullName : normalizedEmail);
                    }
                    existing.setLastLoginAt(now);
                    existing.setUpdatedAt(now);
                    return userRepository.save(existing);
                })
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(normalizedEmail)
                            .password(null)
                            .fullName(fullName != null ? fullName : normalizedEmail)
                            .plan("starter")
                            .status("active")
                            .role("ROLE_USER")
                            .accountType("BUSINESS")
                            .onboardingCompleted(false)
                            .emailVerified(true)
                            .emailVerifiedAt(now)
                            .createdAt(now)
                            .updatedAt(now)
                            .lastLoginAt(now)
                            .build();
                    return userRepository.save(newUser);
                });

        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = createRefreshToken(user);

        return buildAuthResponse(user, accessToken, refreshToken, "Login successful");
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        if (!jwtTokenProvider.validateRefreshToken(request.getRefreshToken())) {
            throw ApiException.unauthorized("Refresh token is invalid or expired");
        }

        RefreshToken stored = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> ApiException.unauthorized("Refresh token is invalid"));

        if (stored.isRevoked() || stored.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw ApiException.unauthorized("Refresh token is invalid or expired");
        }

        User user = userRepository.findById(stored.getUserId())
                .orElseThrow(() -> ApiException.unauthorized("Associated user not found"));

        stored.setRevoked(true);
        refreshTokenRepository.save(stored);

        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = createRefreshToken(user);

        return buildAuthResponse(user, accessToken, refreshToken, "Token refreshed");
    }

    /**
     * Always responds generically to avoid account enumeration.
     */
    public void sendPasswordResetEmail(String email) {
        long start = System.nanoTime();
        try {
            if (email == null || email.isBlank()) {
                return;
            }
            try {
                User user = userRepository.findByEmail(email.trim().toLowerCase()).orElse(null);
                if (user == null) {
                    return;
                }
                String resetToken = jwtTokenProvider.generatePasswordResetToken(user.getEmail());
                emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
            } catch (Exception e) {
                log.warn("Password reset flow error for {}: {}", LogSanitizer.email(email), LogSanitizer.message(e.getMessage()));
            }
        } finally {
            constantTimeDelay(start);
        }
    }

    public void resetPassword(ResetPasswordRequest request) {
        if (!ValidationUtil.isStrongPassword(request.getPassword())) {
            throw ApiException.badRequest("Password must be at least 8 characters with uppercase, lowercase, digit, and special character");
        }

        String email = jwtTokenProvider.getEmailIfPasswordResetTokenValid(request.getToken())
                .orElseThrow(() -> ApiException.unauthorized("Reset token is invalid or expired"));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> ApiException.unauthorized("Reset token is invalid or expired"));

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        refreshTokenRepository.findByUserId(user.getId()).forEach(token -> {
            if (!token.isRevoked()) {
                token.setRevoked(true);
                refreshTokenRepository.save(token);
            }
        });
    }

    /**
     * Always responds generically for resend to avoid account enumeration.
     */
    public void sendVerificationEmail(String email) {
        long start = System.nanoTime();
        try {
            if (email == null || email.isBlank()) {
                return;
            }
            try {
                User user = userRepository.findByEmail(email.trim().toLowerCase()).orElse(null);
                if (user == null || Boolean.TRUE.equals(user.getEmailVerified())) {
                    return;
                }
                emailService.sendVerifyEmail(user.getEmail(), jwtTokenProvider.generateEmailVerificationToken(user.getEmail()));
            } catch (Exception e) {
                log.warn("Email verification resend flow error for {}: {}", LogSanitizer.email(email), LogSanitizer.message(e.getMessage()));
            }
        } finally {
            constantTimeDelay(start);
        }
    }

    public void verifyEmail(String token) {
        String email = jwtTokenProvider.getEmailIfEmailVerificationTokenValid(token)
                .orElseThrow(() -> ApiException.unauthorized("Email verification token is invalid or expired"));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> ApiException.unauthorized("Email verification token is invalid or expired"));

        user.setEmailVerified(true);
        user.setEmailVerifiedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    private String createRefreshToken(User user) {
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());
        RefreshToken storedToken = RefreshToken.builder()
                .userId(user.getId())
                .token(refreshToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plus(jwtTokenProvider.getRefreshExpirationMillis(), ChronoUnit.MILLIS))
                .revoked(false)
                .build();
        refreshTokenRepository.save(storedToken);
        return refreshToken;
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken, String message) {
        return AuthResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .user(UserResponse.from(user))
                .message(message)
                .build();
    }

    private void createFirstWebsiteIfProvided(User user) {
        if (user.getWebsiteUrl() == null || user.getWebsiteUrl().isBlank()) {
            return;
        }
        if (websiteRepository.findByUserIdAndUrl(user.getId(), user.getWebsiteUrl()).isPresent()) {
            return;
        }
        Website website = Website.builder()
                .userId(user.getId())
                .url(user.getWebsiteUrl())
                .name(ValidationUtil.extractDomain(user.getWebsiteUrl()))
                .scanFrequency("weekly")
                .monitoringEnabled(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .nextScanAt(LocalDateTime.now().plusDays(1))
                .build();
        websiteRepository.save(website);
    }

    private String normalizeOptionalUrl(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String normalized = ValidationUtil.normalizeUrl(value);
        if (!ValidationUtil.isValidUrl(normalized)) {
            throw ApiException.badRequest("Website URL is invalid");
        }
        return normalized;
    }

    private String normalizeAccountType(String value) {
        if (value == null || value.isBlank()) {
            return "BUSINESS";
        }
        return switch (value.trim().toUpperCase()) {
            case "AGENCY" -> "AGENCY";
            case "ECOMMERCE" -> "ECOMMERCE";
            case "SAAS" -> "SAAS";
            default -> "BUSINESS";
        };
    }

    /**
     * Pads wall-clock elapsed time so callers cannot infer account existence or
     * verification state from response latency. Sleeps at most {@code TARGET_DELAY_MS}
     * worth of remaining time; restores interrupt status if interrupted.
     */
    private void constantTimeDelay(long startNs) {
        long elapsedMs = (System.nanoTime() - startNs) / 1_000_000L;
        long remaining = TARGET_DELAY_MS - elapsedMs;
        if (remaining > 0) {
            try {
                Thread.sleep(remaining);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
