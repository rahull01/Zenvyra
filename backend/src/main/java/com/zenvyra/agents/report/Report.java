package com.zenvyra.agents.report;

import com.zenvyra.agents.model.AgentResponse;
import com.zenvyra.agents.model.Issue;
import com.zenvyra.service.OpenAiService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Report Agent
 * 
 * Responsibility: Compiles audit data and risk assessment results into a comprehensive compliance audit report.
 * Uses OpenAI GPT-4 to analyze optimized Jsoup website metadata and generate a structured JSON report.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class Report {

    private final OpenAiService openAiService;
    private final ObjectMapper objectMapper;

    public AgentResponse execute(AgentResponse response) {
        System.out.println("[Report Agent] Generating final compliance report...");

        if (response == null || response.getRawData() == null) {
            return response;
        }

        try {
            // Call OpenAI to analyze the optimized metadata payload
            String aiResponseRaw = openAiService.analyzeWebsiteMetadata(response.getRawData());
            
            // Clean up code block ticks if OpenAI returned them despite our prompt
            String cleanJson = aiResponseRaw.trim();
            if (cleanJson.startsWith("```")) {
                cleanJson = cleanJson.replaceAll("^```json\\s*", "").replaceAll("```$", "").trim();
            }

            JsonNode root = objectMapper.readTree(cleanJson);

            // Populate the AgentResponse with the parsed JSON data
            String summary = root.path("executiveSummary").asText("Compliance audit complete.");
            int riskScore = root.path("riskScore").asInt(response.getRiskScore());
            
            List<String> laws = new ArrayList<>();
            if (root.has("laws")) {
                for (JsonNode lawNode : root.get("laws")) {
                    laws.add(lawNode.asText());
                }
            }
            if (laws.isEmpty()) {
                laws = response.getLaws();
            }

            List<Issue> issues = new ArrayList<>();
            if (root.has("issues")) {
                for (JsonNode issueNode : root.get("issues")) {
                    issues.add(Issue.builder()
                            .type(issueNode.path("type").asText())
                            .severity(issueNode.path("severity").asText("medium"))
                            .description(issueNode.path("description").asText())
                            .fix(issueNode.path("fix").asText())
                            .build());
                }
            }
            if (issues.isEmpty()) {
                issues = response.getIssues();
            }

            List<String> fixes = new ArrayList<>();
            if (root.has("fixes")) {
                for (JsonNode fixNode : root.get("fixes")) {
                    fixes.add(fixNode.asText());
                }
            }
            if (fixes.isEmpty()) {
                fixes = response.getFixes();
            }

            // Create a formatted human-readable report text from the AI data
            StringBuilder sb = new StringBuilder();
            sb.append("========================================================================\n");
            sb.append("                       COMPLIANCE AUDIT REPORT                          \n");
            sb.append("========================================================================\n");
            sb.append("Generated At: ").append(LocalDateTime.now()).append("\n\n");
            sb.append("1. EXECUTIVE SUMMARY\n");
            sb.append("--------------------\n");
            sb.append(summary).append("\n\n");
            sb.append("Detected Region: ").append(response.getRegion()).append("\n");
            sb.append("Applicable Laws: ").append(laws).append("\n");
            sb.append("Risk Score: ").append(riskScore).append("/100\n\n");
            sb.append("2. COMPLIANCE AUDIT DETAIL\n");
            sb.append("--------------------------\n");
            if (issues.isEmpty()) {
                sb.append("No compliance issues detected.\n");
            } else {
                sb.append("Total Issues Detected: ").append(issues.size()).append("\n");
                for (int i = 0; i < issues.size(); i++) {
                    Issue issue = issues.get(i);
                    sb.append(i + 1).append(". [").append(issue.getType()).append("] ")
                      .append(issue.getDescription()).append(" (Severity: ").append(issue.getSeverity()).append(")\n");
                }
            }
            sb.append("========================================================================\n");

            response.setReport(sb.toString());
            response.setRiskScore(riskScore);
            response.setLaws(laws);
            response.setIssues(issues);
            response.setFixes(fixes);

            System.out.println("[Report Agent] AI compliance report generated successfully.");

        } catch (Exception e) {
            log.error("AI report generation failed, falling back to rule-based generation", e);
            // Fallback: compile the basic report from the other agents' findings
            buildFallbackReport(response);
        }

        return response;
    }

    private void buildFallbackReport(AgentResponse response) {
        StringBuilder sb = new StringBuilder();
        sb.append("========================================================================\n");
        sb.append("                       COMPLIANCE AUDIT REPORT (FALLBACK)               \n");
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
    }
}
