package com.zenvyra.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.zenvyra.util.LogSanitizer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisRateLimiter {

    private final StringRedisTemplate stringRedisTemplate;
    private final Map<String, LocalBucket> inMemoryBuckets = new ConcurrentHashMap<>();

    @Value("${rate-limit.in-memory-fallback-enabled:false}")
    private boolean inMemoryFallbackEnabled;

    private static final String LUA_SCRIPT =
            "local key = KEYS[1]\n" +
            "local capacity = tonumber(ARGV[1])\n" +
            "local refill_rate = tonumber(ARGV[2])\n" +
            "local refill_interval = tonumber(ARGV[3])\n" +
            "local now = tonumber(ARGV[4])\n" +
            "\n" +
            "local state = redis.call('hmget', key, 'tokens', 'last_refill')\n" +
            "local tokens = tonumber(state[1])\n" +
            "local last_refill = tonumber(state[2])\n" +
            "\n" +
            "if not tokens then\n" +
            "    tokens = capacity\n" +
            "    last_refill = now\n" +
            "else\n" +
            "    local elapsed = math.max(0, now - last_refill)\n" +
            "    local tokens_to_add = elapsed * refill_rate\n" +
            "    tokens = math.min(capacity, tokens + tokens_to_add)\n" +
            "end\n" +
            "\n" +
            "if tokens >= 1 then\n" +
            "    tokens = tokens - 1\n" +
            "    last_refill = now\n" +
            "    redis.call('hset', key, 'tokens', tokens, 'last_refill', last_refill)\n" +
            "    redis.call('expire', key, refill_interval)\n" +
            "    return {1, math.floor(tokens)}\n" +
            "else\n" +
            "    redis.call('hset', key, 'tokens', tokens, 'last_refill', last_refill)\n" +
            "    redis.call('expire', key, refill_interval)\n" +
            "    return {0, math.floor(tokens)}\n" +
            "end";

    private final RedisScript<List> rateLimitScript = new DefaultRedisScript<>(LUA_SCRIPT, List.class);

    public static class RateLimitResult {
        private final boolean allowed;
        private final long remainingTokens;

        public RateLimitResult(boolean allowed, long remainingTokens) {
            this.allowed = allowed;
            this.remainingTokens = remainingTokens;
        }

        public boolean isAllowed() {
            return allowed;
        }

        public long getRemainingTokens() {
            return remainingTokens;
        }
    }

    /**
     * Checks if a request is allowed under rate limiting.
     *
     * @param key Redis key for the bucket
     * @param capacity Maximum capacity of the token bucket
     * @param refillIntervalSeconds Total duration in seconds for a full refill
     * @return RateLimitResult indicating if allowed and remaining tokens
     */
    public RateLimitResult isAllowed(String key, int capacity, long refillIntervalSeconds) {
        try {
            // refillRate is tokens per millisecond
            double refillRate = (double) capacity / (refillIntervalSeconds * 1000.0);
            long nowMs = Instant.now().toEpochMilli();

            List<Long> result = stringRedisTemplate.execute(
                    rateLimitScript,
                    Collections.singletonList(key),
                    String.valueOf(capacity),
                    String.valueOf(refillRate),
                    String.valueOf(refillIntervalSeconds),
                    String.valueOf(nowMs)
            );

            if (result != null && result.size() >= 2) {
                boolean allowed = result.get(0) == 1L;
                long remaining = result.get(1);
                return new RateLimitResult(allowed, remaining);
            }
        } catch (Exception e) {
            log.error("Error executing rate limit Lua script for {}", LogSanitizer.id("rate-limit-key", key), e);
            if (inMemoryFallbackEnabled) {
                return isAllowedInMemory(key, capacity, refillIntervalSeconds);
            }
            // Production fallback: allow request in case of Redis failure to ensure high availability.
        }
        return new RateLimitResult(true, capacity - 1);
    }

    private RateLimitResult isAllowedInMemory(String key, int capacity, long refillIntervalSeconds) {
        long nowMs = Instant.now().toEpochMilli();
        LocalBucket bucket = inMemoryBuckets.computeIfAbsent(key, ignored -> new LocalBucket(capacity, nowMs));
        synchronized (bucket) {
            long elapsed = Math.max(0, nowMs - bucket.lastRefillMs);
            double refillRate = (double) capacity / (refillIntervalSeconds * 1000.0);
            bucket.tokens = Math.min(capacity, bucket.tokens + elapsed * refillRate);
            if (bucket.tokens >= 1) {
                bucket.tokens -= 1;
                bucket.lastRefillMs = nowMs;
                return new RateLimitResult(true, (long) Math.floor(bucket.tokens));
            }
            return new RateLimitResult(false, (long) Math.floor(bucket.tokens));
        }
    }

    private static class LocalBucket {
        private double tokens;
        private long lastRefillMs;

        private LocalBucket(double tokens, long lastRefillMs) {
            this.tokens = tokens;
            this.lastRefillMs = lastRefillMs;
        }
    }
}
