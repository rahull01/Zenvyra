package com.zenvyra.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;

@Slf4j
@Component
public class JwtTokenProvider {

    public static final String CLAIM_TOKEN_USE = "token_use";

    public static final String TOKEN_USE_ACCESS = "access";
    public static final String TOKEN_USE_REFRESH = "refresh";
    public static final String TOKEN_USE_PASSWORD_RESET = "password_reset";
    public static final String TOKEN_USE_EMAIL_VERIFY = "email_verify";

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration:86400000}")
    private long jwtExpiration;

    @Value("${app.jwt.refresh-expiration:604800000}")
    private long refreshTokenExpiration;

    @Value("${app.jwt.password-reset-expiration:3600000}")
    private long passwordResetExpiration;

    @Value("${app.jwt.email-verification-expiration:86400000}")
    private long emailVerificationExpiration;

    private SecretKey key;

    @PostConstruct
    void initKey() {
        if (jwtSecret == null || jwtSecret.isBlank()) {
            throw new IllegalStateException(
                    "JWT secret is missing. Set app.jwt.secret (e.g. JWT_SECRET env var) to a random value of at least 32 characters.");
        }
        if (jwtSecret.length() < 32) {
            throw new IllegalStateException("JWT secret must be at least 32 characters for HS256.");
        }
        String weak = "your-256-bit-secret-key-here-change-in-production-min-32-chars";
        if (weak.equals(jwtSecret.trim())) {
            throw new IllegalStateException("Refusing to start with the example JWT secret; configure a unique secret.");
        }
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(String email) {
        return buildToken(email, jwtExpiration, TOKEN_USE_ACCESS);
    }

    public String generateRefreshToken(String email) {
        return buildToken(email, refreshTokenExpiration, TOKEN_USE_REFRESH);
    }

    public String generatePasswordResetToken(String email) {
        return buildToken(email, passwordResetExpiration, TOKEN_USE_PASSWORD_RESET);
    }

    public String generateEmailVerificationToken(String email) {
        return buildToken(email, emailVerificationExpiration, TOKEN_USE_EMAIL_VERIFY);
    }

    private String buildToken(String subject, long expirationMillis, String tokenUse) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMillis);
        return Jwts.builder()
                .subject(subject)
                .issuedAt(now)
                .expiration(expiryDate)
                .claim(CLAIM_TOKEN_USE, tokenUse)
                .signWith(key)
                .compact();
    }

    public Optional<String> getEmailIfAccessTokenValid(String token) {
        return parseAndValidate(token, TOKEN_USE_ACCESS).map(Claims::getSubject);
    }

    public boolean validateRefreshToken(String token) {
        return parseAndValidate(token, TOKEN_USE_REFRESH).isPresent();
    }

    public Optional<String> getEmailIfPasswordResetTokenValid(String token) {
        return parseAndValidate(token, TOKEN_USE_PASSWORD_RESET).map(Claims::getSubject);
    }

    public Optional<String> getEmailIfEmailVerificationTokenValid(String token) {
        return parseAndValidate(token, TOKEN_USE_EMAIL_VERIFY).map(Claims::getSubject);
    }

    public String getEmailFromToken(String token) {
        return parseAndValidate(token, null)
                .map(Claims::getSubject)
                .orElse(null);
    }

    /**
     * @param expectedUse pass {@code null} to accept any {@code token_use} (legacy tokens are rejected — only known uses allowed).
     */
    private Optional<Claims> parseAndValidate(String token, String expectedUse) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String use = claims.get(CLAIM_TOKEN_USE, String.class);
            if (use == null || use.isBlank()) {
                return Optional.empty();
            }
            if (!TOKEN_USE_ACCESS.equals(use)
                    && !TOKEN_USE_REFRESH.equals(use)
                    && !TOKEN_USE_PASSWORD_RESET.equals(use)
                    && !TOKEN_USE_EMAIL_VERIFY.equals(use)) {
                return Optional.empty();
            }
            if (expectedUse != null && !expectedUse.equals(use)) {
                return Optional.empty();
            }
            return Optional.of(claims);
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    public boolean validateAccessToken(String token) {
        return parseAndValidate(token, TOKEN_USE_ACCESS).isPresent();
    }

    public long getRefreshExpirationMillis() {
        return refreshTokenExpiration;
    }
}

