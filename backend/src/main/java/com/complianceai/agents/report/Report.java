package com.complianceai.agents.report;

import com.complianceai.agents.model.AgentResponse;
import com.complianceai.agents.model.Issue;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Report Agent
 * 
 * Responsibility: Compiles audit data and risk assessment results into a comprehensive compliance audit report.
 */
@Service
public class Report {

    public AgentResponse execute(AgentResponse response) {
        System.out.println("[Report Agent] Generating final compliance report...");

        if (response == null) {
            return response;
        }

        // TODO: Replace with AI prompt call to write executive summaries and detailed action plans.

        StringBuilder sb = new StringBuilder();
        sb.append("========================================================================\n");
        sb.append("                       COMPLIANCE AUDIT REPORT                          \n");
        sb.append("========================================================================\n");
        sb.append("Generated At: ").append(LocalDateTime.now()).append("\n\n");
        
        sb.append("1. EXECUTIVE SUMMARY\n");
        sb.append("--------------------\n");
        sb.append("Detected Region: ").append(response.getRegion()).append("\n");
        sb.append("Applicable Laws: ").append(response.getLaws()).append("\n");
        sb.append("Risk Score: ").append(response.getRiskScore()).append("/100\n\n");

        sb.append("2. COMPLIANCE AUDIT DETAIL\n");
        sb.append("--------------------------\n");
        if (response.getIssues() == null || response.getIssues().isEmpty()) {
            sb.append("No compliance issues detected.\n");
        } else {
            sb.append("Total Issues Detected: ").append(response.getIssues().size()).append("\n");
            for (int i = 0; i < response.getIssues().size(); i++) {
                Issue issue = response.getIssues().get(i);
                sb.append(i + 1).append(". [").append(issue.getType()).append("] ")
                  .append(issue.getDescription()).append(" (Severity: ").append(issue.getSeverity()).append(")\n");
            }
        }
        sb.append("========================================================================\n");

        response.setReport(sb.toString());
        System.out.println("[Report Agent] Report generated successfully.");
        return response;
    }
}
