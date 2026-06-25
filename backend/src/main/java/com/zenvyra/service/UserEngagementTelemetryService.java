package com.zenvyra.service;

import com.zenvyra.dto.request.TelemetryHeartbeatRequest;
import com.zenvyra.model.UserEngagementSession;
import com.zenvyra.model.UserExperienceFlag;
import com.zenvyra.repository.UserEngagementSessionRepository;
import com.zenvyra.repository.UserExperienceFlagRepository;
import com.zenvyra.util.LogSanitizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserEngagementTelemetryService {
    private static final int MAX_HEARTBEATS_PER_SESSION = 480;
    private static final int QUICK_DROPOFF_SECONDS = 90;
    private static final int LOW_COMPLETION_SCORE = 25;
    private static final int LOW_INTERACTION_COUNT = 2;
    private static final Duration REDIS_TTL = Duration.ofHours(6);

    private final UserEngagementSessionRepository sessionRepository;
    private final UserExperienceFlagRepository flagRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    @Async("telemetryExecutor")
    public void ingestHeartbeat(String userId, TelemetryHeartbeatRequest request) {
        try {
            LocalDateTime now = LocalDateTime.now();
            UserEngagementSession session = sessionRepository.findByUserIdAndSessionId(userId, request.getSessionId())
                    .orElseGet(() -> newSession(userId, request, now));

            UserEngagementSession.HeartbeatEvent event = UserEngagementSession.HeartbeatEvent.builder()
                    .receivedAt(now)
                    .phase(clean(request.getPhase(), 80))
                    .sessionDurationSeconds(request.getSessionDurationSeconds())
                    .interactionCount(request.getInteractionCount())
                    .completionScore(request.getCompletionScore())
                    .activelyInteracting(request.isActivelyInteracting())
                    .context(sanitizeContext(request.getContext()))
                    .build();

            session.setPagePath(clean(request.getPagePath(), 160));
            session.setWorkflow(clean(request.getWorkflow(), 80));
            session.setCurrentPhase(event.getPhase());
            session.setSessionDurationSeconds(Math.max(session.getSessionDurationSeconds(), request.getSessionDurationSeconds()));
            session.setInteractionCount(Math.max(session.getInteractionCount(), request.getInteractionCount()));
            session.setCompletionScore(Math.max(session.getCompletionScore(), request.getCompletionScore()));
            session.setActivelyInteracting(request.isActivelyInteracting());
            session.setLastHeartbeatAt(now);
            session.setUpdatedAt(now);
            session.getHeartbeatEvents().add(event);
            trimHeartbeatEvents(session);
            upsertPhaseMetric(session, event);
            evaluateDropOff(session, event, now);

            UserEngagementSession saved = sessionRepository.save(session);
            cacheSnapshot(saved);
        } catch (Exception e) {
            log.warn("Telemetry heartbeat ingestion failed for {}: {}", LogSanitizer.id("session", request.getSessionId()), LogSanitizer.exception(e));
        }
    }

    private UserEngagementSession newSession(String userId, TelemetryHeartbeatRequest request, LocalDateTime now) {
        return UserEngagementSession.builder()
                .userId(userId)
                .sessionId(clean(request.getSessionId(), 96))
                .pagePath(clean(request.getPagePath(), 160))
                .workflow(clean(request.getWorkflow(), 80))
                .currentPhase(clean(request.getPhase(), 80))
                .startedAt(now)
                .createdAt(now)
                .updatedAt(now)
                .build();
    }

    private void trimHeartbeatEvents(UserEngagementSession session) {
        int overflow = session.getHeartbeatEvents().size() - MAX_HEARTBEATS_PER_SESSION;
        if (overflow > 0) {
            session.getHeartbeatEvents().subList(0, overflow).clear();
        }
    }

    private void upsertPhaseMetric(UserEngagementSession session, UserEngagementSession.HeartbeatEvent event) {
        UserEngagementSession.PhaseMetric metric = session.getPhaseMetrics().stream()
                .filter(item -> item.getPhase().equals(event.getPhase()))
                .findFirst()
                .orElseGet(() -> {
                    UserEngagementSession.PhaseMetric created = UserEngagementSession.PhaseMetric.builder()
                            .phase(event.getPhase())
                            .firstSeenAt(event.getReceivedAt())
                            .heartbeatCount(0)
                            .build();
                    session.getPhaseMetrics().add(created);
                    return created;
                });

        metric.setHeartbeatCount(metric.getHeartbeatCount() + 1);
        metric.setMaxDurationSeconds(Math.max(metric.getMaxDurationSeconds(), event.getSessionDurationSeconds()));
        metric.setMaxCompletionScore(Math.max(metric.getMaxCompletionScore(), event.getCompletionScore()));
        metric.setMaxInteractionCount(Math.max(metric.getMaxInteractionCount(), event.getInteractionCount()));
        metric.setLastSeenAt(event.getReceivedAt());
    }

    private void evaluateDropOff(
            UserEngagementSession session,
            UserEngagementSession.HeartbeatEvent event,
            LocalDateTime now) {
        if (session.isDropOffFlagged()) {
            return;
        }
        boolean quickDropOff = !event.isActivelyInteracting()
                && event.getSessionDurationSeconds() > 0
                && event.getSessionDurationSeconds() < QUICK_DROPOFF_SECONDS
                && event.getCompletionScore() < LOW_COMPLETION_SCORE
                && event.getInteractionCount() <= LOW_INTERACTION_COUNT;

        if (!quickDropOff) {
            return;
        }

        String reason = "Quick workflow drop-off before meaningful checklist completion";
        session.setDropOffFlagged(true);
        session.setDropOffReason(reason);
        flagRepository.save(UserExperienceFlag.builder()
                .pagePath(session.getPagePath())
                .workflow(session.getWorkflow())
                .phase(event.getPhase())
                .sessionId(session.getSessionId())
                .userId(session.getUserId())
                .reason(reason)
                .sessionDurationSeconds(event.getSessionDurationSeconds())
                .interactionCount(event.getInteractionCount())
                .completionScore(event.getCompletionScore())
                .createdAt(now)
                .build());
    }

    private void cacheSnapshot(UserEngagementSession session) {
        String key = "telemetry:session:" + session.getUserId() + ":" + session.getSessionId();
        Map<String, Object> snapshot = Map.of(
                "pagePath", session.getPagePath(),
                "workflow", session.getWorkflow(),
                "phase", session.getCurrentPhase(),
                "duration", session.getSessionDurationSeconds(),
                "interactions", session.getInteractionCount(),
                "completion", session.getCompletionScore(),
                "dropOffFlagged", session.isDropOffFlagged());
        redisTemplate.opsForValue().set(key, snapshot, REDIS_TTL);
        redisTemplate.opsForHash().increment("telemetry:phase:" + session.getWorkflow(), session.getCurrentPhase(), 1);
        redisTemplate.expire("telemetry:phase:" + session.getWorkflow(), REDIS_TTL);
    }

    private Map<String, String> sanitizeContext(Map<String, String> context) {
        Map<String, String> sanitized = new LinkedHashMap<>();
        if (context == null) {
            return sanitized;
        }

        context.entrySet().stream().limit(12).forEach(entry -> {
            String key = clean(entry.getKey(), 40);
            String value = clean(entry.getValue(), 120);
            if (!key.isBlank() && !value.isBlank()) {
                sanitized.put(key, value);
            }
        });
        return sanitized;
    }

    private String clean(String value, int maxLength) {
        if (value == null) {
            return "";
        }
        String cleaned = value.replaceAll("[\\p{Cntrl}&&[^\r\n\t]]", "").trim();
        return cleaned.length() <= maxLength ? cleaned : cleaned.substring(0, maxLength);
    }
}
