package com.complianceai.agents.autofix;

import com.complianceai.agents.model.AgentResponse;
import com.complianceai.agents.model.Issue;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * AutoFix Agent
 * 
 * Responsibility: Analyzes compliance issues and provides actionable code/template fixes to remediate them.
 */
@Service
public class AutoFix {

    public AgentResponse execute(AgentResponse response) {
        System.out.println("[AutoFix Agent] Generating fix suggestions for issues...");

        if (response == null) {
            return response;
        }

        // TODO: Replace with AI prompt call to construct tailor-made banner scripts and policy drafts.

        List<String> fixes = new ArrayList<>();
        if (response.getIssues() != null) {
            for (Issue issue : response.getIssues()) {
                if (issue.getFix() != null) {
                    fixes.add("FIX FOR [" + issue.getType() + "]:\n" +
                              "   Action: " + issue.getFix() + "\n");
                }
            }
        }

        if (fixes.isEmpty()) {
            fixes.add("No fixes required. All systems compliant.");
        }

        response.setFixes(fixes);
        System.out.println("[AutoFix Agent] Generated " + fixes.size() + " fixes.");
        return response;
    }

    public String fixIssue(String issue) {
        return "Suggested fix for: " + issue;
    }
}
