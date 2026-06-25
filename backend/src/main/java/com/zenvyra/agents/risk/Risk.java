package com.zenvyra.agents.risk;

import com.zenvyra.agents.model.AgentResponse;
import org.springframework.stereotype.Service;

/**
 * Risk Agent
 * 
 * Responsibility: Categorizes risk levels (HIGH, MEDIUM, LOW) based on compliance issues detected
 * and assigns severity based on statutory fines or enforcement actions.
 */
@Service
public class Risk {

    public AgentResponse execute(AgentResponse response) {
        System.out.println("[Risk Agent] Assessing compliance risk score...");

        if (response == null) {
            return response;
        }

        int issueCount = response.getIssues() != null ? response.getIssues().size() : 0;
        int score = 0;

        if (issueCount >= 3) {
            score = 85 + (issueCount * 3);
            if (score > 100) score = 100;
        } else if (issueCount > 0) {
            score = 45 + (issueCount * 10);
        } else {
            score = 15; // Baseline low risk score
        }

        response.setRiskScore(score);
        System.out.println("[Risk Agent] Risk score calculated: " + score);
        return response;
    }
}
