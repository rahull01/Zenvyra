package com.complianceai.service;

import lombok.extern.slf4j.Slf4j;
import com.complianceai.exception.ApiException;
import com.complianceai.dto.request.LoginRequest;
import com.complianceai.dto.request.SignupRequest;
import com.complianceai.dto.response.AuthResponse;
import com.complianceai.model.User;
import com.complianceai.repository.UserRepository;
import com.complianceai.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw ApiException.conflict("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .companyName(request.getCompanyName())
                .industry(request.getIndustry())
                .employeeCount(request.getEmployeeCount())
                .plan("free")
                .status("active")
                .role("ROLE_USER")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getEmail());

        emailService.sendWelcomeEmail(user.getEmail(), user.getFullName());

        return AuthResponse.builder()
                .token(token)
                .user(user)
                .message("Account created successfully")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed: User not found for email: {}", request.getEmail());
                    return ApiException.unauthorized("Invalid email or password");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed: Invalid password for email: {}", request.getEmail());
            throw ApiException.unauthorized("Invalid email or password");
        }

        log.info("Login successful for email: {}", request.getEmail());

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .user(user)
                .message("Login successful")
                .build();
    }

    public AuthResponse refreshToken(String token) {
        String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        String newToken = jwtTokenProvider.generateToken(email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return AuthResponse.builder()
                .token(newToken)
                .user(user)
                .message("Token refreshed")
                .build();
    }

    public void sendPasswordResetEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String resetToken = jwtTokenProvider.generateToken(email);
        emailService.sendPasswordResetEmail(email, resetToken);
    }
}
