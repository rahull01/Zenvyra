package com.zenvyra.agents.autofix;

import com.zenvyra.agents.model.AgentResponse;
import com.zenvyra.agents.model.Issue;
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
        if (issue == null || issue.isBlank()) {
            return "No issue description provided.";
        }
        String normalized = issue.toLowerCase();
        if (normalized.contains("cookie")) {
            return "Add a consent banner, block non-essential trackers before consent, and persist consent receipts.";
        }
        if (normalized.contains("privacy")) {
            return "Publish a current privacy policy covering data categories, legal bases, retention, subprocessors, and rights requests.";
        }
        if (normalized.contains("tracker") || normalized.contains("analytics")) {
            return "Classify trackers by purpose, disclose each provider, and gate analytics or marketing tags behind consent.";
        }
        return "Review the issue, document the applicable legal basis, implement the remediation, and re-run the scanner.";
    }
}
