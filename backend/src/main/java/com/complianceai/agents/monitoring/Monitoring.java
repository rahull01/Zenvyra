package com.complianceai.agents.monitoring;

import com.complianceai.agents.model.AgentResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Monitoring Agent
 * 
 * Responsibility: Observes the system execution flow, records execution path, logs warnings/errors,
 * and maintains audit logging for agent operations.
 */
@Service
public class Monitoring {

    public AgentResponse execute(AgentResponse response) {
        System.out.println("[Monitoring Agent] Monitoring status check request received.");
        return response;
    }

    public void logError(String error) {
        System.err.println("[" + LocalDateTime.now() + "] [ERROR] [Monitoring] - " + error);
    }

    public void logFlow(String message) {
        System.out.println("[" + LocalDateTime.now() + "] [FLOW] [Monitoring] - " + message);
    }

    public void logDebug(String message) {
        System.out.println("[" + LocalDateTime.now() + "] [DEBUG] [Monitoring] - " + message);
    }
}
