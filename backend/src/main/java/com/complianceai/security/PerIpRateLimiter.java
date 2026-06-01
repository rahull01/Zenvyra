package com.complianceai.security;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * Per-IP token buckets for rate limiting (replaces a single global bucket shared by all clients).
 */
@Component
public class PerIpRateLimiter {

    private final LoadingCache<String, Bucket> freeScanPerIp = Caffeine.newBuilder()
            .maximumSize(50_000)
            .expireAfterAccess(Duration.ofHours(2))
            .build(ip -> Bucket.builder()
                    .addLimit(Bandwidth.classic(10, Refill.intervally(10, Duration.ofMinutes(1))))
                    .build());

    private final LoadingCache<String, Bucket> authPerIp = Caffeine.newBuilder()
            .maximumSize(50_000)
            .expireAfterAccess(Duration.ofHours(2))
            .build(ip -> Bucket.builder()
                    .addLimit(Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(15))))
                    .build());

    private final LoadingCache<String, Bucket> apiPerIp = Caffeine.newBuilder()
            .maximumSize(50_000)
            .expireAfterAccess(Duration.ofHours(2))
            .build(ip -> Bucket.builder()
                    .addLimit(Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1))))
                    .build());

    public Bucket freeScanBucket(String ip) {
        return freeScanPerIp.get(safeKey(ip));
    }

    public Bucket authBucket(String ip) {
        return authPerIp.get(safeKey(ip));
    }

    public Bucket apiBucket(String ip) {
        return apiPerIp.get(safeKey(ip));
    }

    private static String safeKey(String ip) {
        if (ip == null || ip.isBlank()) {
            return "unknown";
        }
        return ip.trim();
    }
}
