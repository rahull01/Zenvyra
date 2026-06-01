package com.complianceai.service;

import com.complianceai.exception.ApiException;
import com.complianceai.dto.request.LoginRequest;
import com.complianceai.dto.request.RefreshTokenRequest;
import com.complianceai.dto.request.SignupRequest;
import com.complianceai.dto.response.AuthResponse;
import com.complianceai.model.RefreshToken;
import com.complianceai.model.User;
import com.complianceai.repository.RefreshTokenRepository;
import com.complianceai.repository.UserRepository;
import com.complianceai.security.JwtTokenProvider;
import com.complianceai.util.ValidationUtil;
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
                .plan("free")
                .status("active")
                .role("ROLE_USER")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = createRefreshToken(user);

        emailService.sendWelcomeEmail(user.getEmail(), user.getFullName());

        return buildAuthResponse(user, accessToken, refreshToken, "Account created successfully");
    }

    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> {
                    log.warn("Login failed: User not found for email: {}", request.getEmail());
                    return ApiException.unauthorized("Invalid email or password");
                });

        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed: Invalid password for email: {}", request.getEmail());
            throw ApiException.unauthorized("Invalid email or password");
        }

        log.info("Login successful for email: {}", request.getEmail());
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
            log.warn("Password reset flow error for email {}: {}", email, e.getMessage());
        }
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
                .user(user)
                .message(message)
                .build();
    }
}
