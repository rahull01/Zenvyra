package com.zenvyra.agents.memory;

import com.zenvyra.agents.model.AgentResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Memory Agent
 * 
 * Responsibility: Simulates memory persistence. Retains audit history logs and provides methods
 * to retrieve past scans and audit details.
 */
@Service
public class Memory {

    private final List<AgentResponse> scanHistory = new ArrayList<>();

    public AgentResponse execute(AgentResponse response) {
        System.out.println("[Memory Agent] Memory query execution...");
        return response;
    }

    public void save(AgentResponse response) {
        System.out.println("[Memory Agent] Saving AgentResponse to historical memory...");
        if (response != null) {
            scanHistory.add(response);
            System.out.println("[Memory Agent] Saved. Memory history log count: " + scanHistory.size());
        }
    }
}
