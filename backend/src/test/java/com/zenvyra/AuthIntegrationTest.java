package com.zenvyra;

import com.zenvyra.model.RefreshToken;
import com.zenvyra.model.User;
import com.zenvyra.repository.RefreshTokenRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasItems;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "spring.profiles.active=test")
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private com.zenvyra.service.EmailService emailService;

    @BeforeEach
    void setUp() {
        Mockito.doNothing().when(userRepository).deleteAll();
        Mockito.doNothing().when(refreshTokenRepository).deleteAll();
        Mockito.when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void login_shouldReturnTokens_whenCredentialsAreValid() throws Exception {
        User user = User.builder()
                .id("test-user-id")
                .email("test.user@example.com")
                .password(passwordEncoder.encode("StrongPass123!"))
                .fullName("Test User")
                .role("ROLE_USER")
                .status("active")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Mockito.when(userRepository.findByEmail("test.user@example.com"))
                .thenReturn(Optional.of(user));

        Map<String, String> request = Map.of(
                "email", "test.user@example.com",
                "password", "StrongPass123!"
        );

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(header().stringValues("Set-Cookie", hasItems(
                        containsString("zenvyra_access="),
                        containsString("zenvyra_refresh="))))
                .andExpect(jsonPath("$.token").doesNotExist())
                .andExpect(jsonPath("$.refreshToken").doesNotExist())
                .andExpect(jsonPath("$.user.email").value("test.user@example.com"))
                .andExpect(jsonPath("$.user.password").doesNotExist())
                .andExpect(jsonPath("$.user.customerId").doesNotExist())
                .andExpect(jsonPath("$.user.dodoSubscriptionId").doesNotExist());
    }

    @Test
    void refreshToken_shouldReturnNewTokens_whenRefreshTokenIsValid() throws Exception {
        User user = User.builder()
                .id("refresh-user-id")
                .email("refresh.user@example.com")
                .password(passwordEncoder.encode("RefreshPass123!"))
                .fullName("Refresh User")
                .role("ROLE_USER")
                .status("active")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        String refreshJwt = jwtTokenProvider.generateRefreshToken(user.getEmail());
        RefreshToken refreshToken = RefreshToken.builder()
                .userId(user.getId())
                .token(refreshJwt)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();

        Mockito.when(refreshTokenRepository.findByToken(refreshJwt))
                .thenReturn(Optional.of(refreshToken));
        Mockito.when(userRepository.findById(user.getId()))
                .thenReturn(Optional.of(user));

        Map<String, String> request = Map.of("refreshToken", refreshJwt);

        mockMvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(header().stringValues("Set-Cookie", hasItems(
                        containsString("zenvyra_access="),
                        containsString("zenvyra_refresh="))))
                .andExpect(jsonPath("$.token").doesNotExist())
                .andExpect(jsonPath("$.refreshToken").doesNotExist())
                .andExpect(jsonPath("$.user.email").value("refresh.user@example.com"))
                .andExpect(jsonPath("$.user.password").doesNotExist())
                .andExpect(jsonPath("$.user.customerId").doesNotExist())
                .andExpect(jsonPath("$.user.dodoSubscriptionId").doesNotExist());
    }

    @Test
    void refreshToken_shouldAcceptHttpOnlyCookie_whenRequestBodyIsEmpty() throws Exception {
        User user = User.builder()
                .id("cookie-refresh-user-id")
                .email("cookie.refresh@example.com")
                .password(passwordEncoder.encode("RefreshPass123!"))
                .fullName("Cookie Refresh User")
                .role("ROLE_USER")
                .status("active")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        String refreshJwt = jwtTokenProvider.generateRefreshToken(user.getEmail());
        RefreshToken refreshToken = RefreshToken.builder()
                .userId(user.getId())
                .token(refreshJwt)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();

        Mockito.when(refreshTokenRepository.findByToken(refreshJwt))
                .thenReturn(Optional.of(refreshToken));
        Mockito.when(userRepository.findById(user.getId()))
                .thenReturn(Optional.of(user));

        mockMvc.perform(post("/auth/refresh")
                        .cookie(new jakarta.servlet.http.Cookie("zenvyra_refresh", refreshJwt)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").doesNotExist())
                .andExpect(jsonPath("$.refreshToken").doesNotExist())
                .andExpect(jsonPath("$.user.email").value("cookie.refresh@example.com"));
    }

    @Test
    void refreshToken_shouldReturnUnauthorized_whenRefreshTokenIsInvalid() throws Exception {
        Mockito.when(refreshTokenRepository.findByToken("invalid-token"))
                .thenReturn(Optional.empty());

        Map<String, String> request = Map.of("refreshToken", "invalid-token");

        mockMvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Refresh token is invalid or expired"));
    }

    @Test
    void refreshToken_shouldReturnUnauthorized_whenRefreshTokenIsRevoked() throws Exception {
        User user = User.builder()
                .id("revoked-user-id")
                .email("revoked.user@example.com")
                .password(passwordEncoder.encode("RevokedPass123!"))
                .fullName("Revoked User")
                .role("ROLE_USER")
                .status("active")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        String refreshJwt = jwtTokenProvider.generateRefreshToken(user.getEmail());
        RefreshToken refreshToken = RefreshToken.builder()
                .userId(user.getId())
                .token(refreshJwt)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(7))
                .revoked(true)
                .build();

        Mockito.when(refreshTokenRepository.findByToken(refreshJwt))
                .thenReturn(Optional.of(refreshToken));

        Map<String, String> request = Map.of("refreshToken", refreshJwt);

        mockMvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Refresh token is invalid or expired"));
    }

    @Test
    void resetPassword_shouldUpdatePasswordAndRevokeRefreshTokens_whenTokenIsValid() throws Exception {
        User user = User.builder()
                .id("reset-user-id")
                .email("reset.user@example.com")
                .password(passwordEncoder.encode("OldPass123!"))
                .fullName("Reset User")
                .role("ROLE_USER")
                .status("active")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        RefreshToken existingRefreshToken = RefreshToken.builder()
                .userId(user.getId())
                .token("stored-refresh-token")
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();
        String resetToken = jwtTokenProvider.generatePasswordResetToken(user.getEmail());

        Mockito.when(userRepository.findByEmail("reset.user@example.com")).thenReturn(Optional.of(user));
        Mockito.when(refreshTokenRepository.findByUserId(user.getId())).thenReturn(List.of(existingRefreshToken));

        mockMvc.perform(post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "token", resetToken,
                                "password", "NewPass123!"
                        ))))
                .andExpect(status().isOk());

        verify(userRepository).save(Mockito.argThat(saved ->
                saved.getEmail().equals("reset.user@example.com")
                        && passwordEncoder.matches("NewPass123!", saved.getPassword())));
        verify(refreshTokenRepository).save(Mockito.argThat(RefreshToken::isRevoked));
    }

    @Test
    void resetPassword_shouldRejectWeakPassword() throws Exception {
        String resetToken = jwtTokenProvider.generatePasswordResetToken("reset.user@example.com");

        mockMvc.perform(post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "token", resetToken,
                                "password", "weak"
                        ))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Password must be at least 8 characters with uppercase, lowercase, digit, and special character"));
    }

    @Test
    void resetPassword_shouldRejectInvalidToken() throws Exception {
        mockMvc.perform(post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "token", "invalid-token",
                                "password", "NewPass123!"
                        ))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Reset token is invalid or expired"));
    }

    @Test
    void verifyEmail_shouldMarkUserVerified_whenTokenIsValid() throws Exception {
        User user = User.builder()
                .id("verify-user-id")
                .email("verify.user@example.com")
                .password(passwordEncoder.encode("VerifyPass123!"))
                .fullName("Verify User")
                .role("ROLE_USER")
                .status("active")
                .emailVerified(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        String token = jwtTokenProvider.generateEmailVerificationToken(user.getEmail());

        Mockito.when(userRepository.findByEmail("verify.user@example.com")).thenReturn(Optional.of(user));

        mockMvc.perform(post("/auth/verify-email")
                        .param("token", token))
                .andExpect(status().isOk());

        verify(userRepository).save(Mockito.argThat(saved ->
                saved.getEmail().equals("verify.user@example.com")
                        && Boolean.TRUE.equals(saved.getEmailVerified())
                        && saved.getEmailVerifiedAt() != null));
    }

    @Test
    void verifyEmail_shouldRejectInvalidToken() throws Exception {
        mockMvc.perform(post("/auth/verify-email")
                        .param("token", "invalid-token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Email verification token is invalid or expired"));
    }

    @Test
    void sendVerification_shouldRespondGenericallyAndSendWhenUnverifiedUserExists() throws Exception {
        User user = User.builder()
                .id("resend-user-id")
                .email("resend.user@example.com")
                .fullName("Resend User")
                .role("ROLE_USER")
                .status("active")
                .emailVerified(false)
                .build();
        Mockito.when(userRepository.findByEmail("resend.user@example.com")).thenReturn(Optional.of(user));

        mockMvc.perform(post("/auth/send-verification")
                        .param("email", "resend.user@example.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("If an unverified account exists for that email, verification instructions have been sent."));

        verify(emailService).sendVerifyEmail(Mockito.eq("resend.user@example.com"), Mockito.anyString());
    }
}
