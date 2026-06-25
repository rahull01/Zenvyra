package com.zenvyra.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Map;

@Data
public class TelemetryHeartbeatRequest {
    @NotBlank
    @Size(max = 96)
    private String sessionId;

    @NotBlank
    @Size(max = 160)
    private String pagePath;

    @NotBlank
    @Size(max = 80)
    private String workflow;

    @NotBlank
    @Size(max = 80)
    private String phase;

    @Min(0)
    @Max(86_400)
    private long sessionDurationSeconds;

    @Min(0)
    @Max(10_000)
    private int interactionCount;

    @Min(0)
    @Max(100)
    private int completionScore;

    private boolean activelyInteracting;

    @Size(max = 12)
    private Map<@Size(max = 40) String, @Size(max = 120) String> context;
}
