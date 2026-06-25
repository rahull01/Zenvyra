package com.zenvyra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_engagement_sessions")
@CompoundIndex(name = "user_session_idx", def = "{'userId': 1, 'sessionId': 1}", unique = true)
public class UserEngagementSession {
    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String sessionId;

    @Indexed
    private String pagePath;

    @Indexed
    private String workflow;

    private String currentPhase;
    private long sessionDurationSeconds;
    private int interactionCount;
    private int completionScore;
    private boolean activelyInteracting;
    private boolean dropOffFlagged;
    private String dropOffReason;

    @Builder.Default
    private List<HeartbeatEvent> heartbeatEvents = new ArrayList<>();

    @Builder.Default
    private List<PhaseMetric> phaseMetrics = new ArrayList<>();

    private LocalDateTime startedAt;
    private LocalDateTime lastHeartbeatAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HeartbeatEvent {
        private LocalDateTime receivedAt;
        private String phase;
        private long sessionDurationSeconds;
        private int interactionCount;
        private int completionScore;
        private boolean activelyInteracting;
        private Map<String, String> context;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PhaseMetric {
        private String phase;
        private int heartbeatCount;
        private long maxDurationSeconds;
        private int maxCompletionScore;
        private int maxInteractionCount;
        private LocalDateTime firstSeenAt;
        private LocalDateTime lastSeenAt;
    }
}
