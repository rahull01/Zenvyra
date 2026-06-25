package com.zenvyra.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Slf4j
@Controller
public class WebSocketController {

    @MessageMapping("/scan/{scanId}")
    @SendTo("/topic/scan-progress/{scanId}")
    public Map<String, Object> streamScanProgress(@DestinationVariable String scanId, Map<String, Object> message) {
        log.info("Received scan progress subscription for ID: {}", scanId);
        return Map.of(
            "scanId", scanId,
            "status", "processing",
            "progress", 45,
            "message", "Analyzing cookie consent headers..."
        );
    }

    @MessageMapping("/ai-chat/{sessionId}")
    @SendTo("/topic/ai-chat/{sessionId}")
    public Map<String, Object> streamAiChat(@DestinationVariable String sessionId, Map<String, Object> message) {
        log.info("AI chat streaming on session: {}", sessionId);
        return Map.of(
            "sessionId", sessionId,
            "sender", "AI",
            "content", "I am analyzing your privacy policy requirements..."
        );
    }
}
