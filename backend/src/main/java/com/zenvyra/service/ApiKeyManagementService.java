package com.zenvyra.service;

import com.zenvyra.dto.request.CreateApiKeyRequest;
import com.zenvyra.dto.response.CreateApiKeyResponse;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.ApiKey;
import com.zenvyra.model.PlanType;
import com.zenvyra.model.User;
import com.zenvyra.repository.ApiKeyRepository;
import com.zenvyra.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ApiKeyManagementService {
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final Duration VERIFICATION_CACHE_TTL = Duration.ofMinutes(10);

    private final ApiKeyRepository apiKeyRepository;
    private final UserRepository userRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    public CreateApiKeyResponse createKey(String userEmail, CreateApiKeyRequest request) {
        User user = requireProOrAgency(userEmail);
        String token = generateToken();
        String hash = sha256(token);
        LocalDateTime now = LocalDateTime.now();

        ApiKey apiKey = ApiKey.builder()
                .userId(user.getId())
                .name(request.getName().trim())
                .keyHash(hash)
                .prefix(token.substring(0, 15))
                .scopes(normalizeScopes(request.getScopes()))
                .expiresAt(request.getExpiresAt())
                .createdAt(now)
                .updatedAt(now)
                .build();

        return CreateApiKeyResponse.builder()
                .apiKey(apiKeyRepository.save(apiKey))
                .token(token)
                .build();
    }

    public List<ApiKey> listKeys(String userEmail) {
        User user = requireProOrAgency(userEmail);
        return apiKeyRepository.findByUserIdAndRevokedAtIsNullOrderByCreatedAtDesc(user.getId());
    }

    public CreateApiKeyResponse rollKey(String userEmail, String apiKeyId) {
        User user = requireProOrAgency(userEmail);
        ApiKey existing = apiKeyRepository.findById(apiKeyId)
                .filter(key -> key.getUserId().equals(user.getId()))
                .orElseThrow(() -> ApiException.notFound("API key not found"));
        existing.setRevokedAt(LocalDateTime.now());
        existing.setUpdatedAt(existing.getRevokedAt());
        apiKeyRepository.save(existing);

        CreateApiKeyRequest request = new CreateApiKeyRequest();
        request.setName(existing.getName());
        request.setScopes(existing.getScopes());
        request.setExpiresAt(existing.getExpiresAt());
        return createKey(userEmail, request);
    }

    public void revokeKey(String userEmail, String apiKeyId) {
        User user = requireProOrAgency(userEmail);
        ApiKey apiKey = apiKeyRepository.findById(apiKeyId)
                .filter(key -> key.getUserId().equals(user.getId()))
                .orElseThrow(() -> ApiException.notFound("API key not found"));
        apiKey.setRevokedAt(LocalDateTime.now());
        apiKey.setUpdatedAt(apiKey.getRevokedAt());
        apiKeyRepository.save(apiKey);
        redisTemplate.delete("api-key:verify:" + apiKey.getKeyHash());
    }

    public Optional<ApiKey> verifyToken(String token) {
        if (token == null || !token.startsWith("sk_live_")) {
            return Optional.empty();
        }
        String hash = sha256(token);
        String cacheKey = "api-key:verify:" + hash;
        Object cachedId = redisTemplate.opsForValue().get(cacheKey);
        if (cachedId instanceof String id) {
            return apiKeyRepository.findById(id).filter(this::isUsable);
        }

        Optional<ApiKey> apiKey = apiKeyRepository.findByKeyHashAndRevokedAtIsNull(hash).filter(this::isUsable);
        apiKey.ifPresent(key -> {
            redisTemplate.opsForValue().set(cacheKey, key.getId(), VERIFICATION_CACHE_TTL);
            key.setLastUsed(LocalDateTime.now());
            apiKeyRepository.save(key);
        });
        return apiKey;
    }

    private User requireProOrAgency(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> ApiException.unauthorized("Authentication required"));
        PlanType planType = user.getPlanType() != null ? user.getPlanType() : PlanType.from(user.getPlan());
        if (planType != PlanType.PRO && planType != PlanType.AGENCY) {
            throw ApiException.forbidden("API integrations require a Pro or Agency plan");
        }
        return user;
    }

    private boolean isUsable(ApiKey apiKey) {
        return apiKey.getRevokedAt() == null
                && (apiKey.getExpiresAt() == null || apiKey.getExpiresAt().isAfter(LocalDateTime.now()));
    }

    private List<String> normalizeScopes(List<String> scopes) {
        if (scopes == null || scopes.isEmpty()) {
            return List.of("scan:read", "webhook:write");
        }
        return scopes.stream()
                .filter(scope -> scope != null && !scope.isBlank())
                .map(scope -> scope.trim().toLowerCase())
                .distinct()
                .limit(16)
                .toList();
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return "sk_live_" + HexFormat.of().formatHex(bytes);
    }

    public static String sha256(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException("SHA-256 hashing is unavailable", e);
        }
    }
}
