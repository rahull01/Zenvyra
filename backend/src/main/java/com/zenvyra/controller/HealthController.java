package com.zenvyra.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class HealthController {

    private final MongoTemplate mongoTemplate;
    private final RedisTemplate<String, Object> redisTemplate;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> liveness() {
        return ResponseEntity.ok(Map.of(
                "service", "zenvyra-api",
                "status", "UP",
                "timestamp", Instant.now().toString()));
    }

    @GetMapping("/health/ready")
    public ResponseEntity<Map<String, Object>> readiness() {
        Map<String, Object> health = new HashMap<>();
        health.put("service", "zenvyra-api");
        health.put("timestamp", Instant.now().toString());

        boolean mongodbUp = checkMongoDB();
        boolean redisUp = checkRedis();

        health.put("mongodb", mongodbUp ? "UP" : "DOWN");
        health.put("redis", redisUp ? "UP" : "DOWN");

        if (mongodbUp && redisUp) {
            health.put("status", "UP");
            return ResponseEntity.ok(health);
        } else {
            health.put("status", "DOWN");
            return ResponseEntity.status(503).body(health);
        }
    }

    private boolean checkMongoDB() {
        try {
            mongoTemplate.getDb().runCommand(new org.bson.Document("ping", 1));
            return true;
        } catch (Exception e) {
            log.error("MongoDB health check failed", e);
            return false;
        }
    }

    private boolean checkRedis() {
        try {
            redisTemplate.getConnectionFactory().getConnection().ping();
            return true;
        } catch (Exception e) {
            log.error("Redis health check failed", e);
            return false;
        }
    }
}
