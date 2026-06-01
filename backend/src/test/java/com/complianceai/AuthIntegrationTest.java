package com.complianceai;

import com.complianceai.model.RefreshToken;
import com.complianceai.model.User;
import com.complianceai.repository.RefreshTokenRepository;
import com.complianceai.repository.UserRepository;
import com.complianceai.security.JwtTokenProvider;
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
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
    private com.complianceai.service.EmailService emailService;

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
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value("test.user@example.com"));
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
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value("refresh.user@example.com"));
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
}
