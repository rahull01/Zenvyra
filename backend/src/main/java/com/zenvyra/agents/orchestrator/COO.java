package com.zenvyra.agents.orchestrator;

import com.zenvyra.agents.autofix.AutoFix;
import com.zenvyra.agents.compliance.Compliance;
import com.zenvyra.agents.jurisdiction.Jurisdiction;
import com.zenvyra.agents.legal.Legal;
import com.zenvyra.agents.memory.Memory;
import com.zenvyra.agents.monitoring.Monitoring;
import com.zenvyra.agents.report.Report;
import com.zenvyra.agents.risk.Risk;
import com.zenvyra.agents.scanner.Scanner;
import com.zenvyra.agents.model.AgentResponse;
import com.zenvyra.util.LogSanitizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * COO (Chief Operating Officer) / Orchestrator Agent
 * 
 * Responsibility: Coordinates execution across specialized agents in a structured pipeline.
 * Manages flow, error handling, logging, and aggregation of findings in AgentResponse.
 */
@Service
public class COO {

    private final Scanner scanner;
    private final Jurisdiction jurisdiction;
    private final Legal legal;
    private final Compliance compliance;
    private final Risk risk;
    private final Report report;
    private final AutoFix autoFix;
    private final Memory memory;
    private final Monitoring monitoring;

    @Autowired
    public COO(Scanner scanner,
               Jurisdiction jurisdiction,
               Legal legal,
               Compliance compliance,
               Risk risk,
               Report report,
               AutoFix autoFix,
               Memory memory,
               Monitoring monitoring) {
        this.scanner = scanner;
        this.jurisdiction = jurisdiction;
        this.legal = legal;
        this.compliance = compliance;
        this.risk = risk;
        this.report = report;
        this.autoFix = autoFix;
        this.memory = memory;
        this.monitoring = monitoring;
    }

    public AgentResponse execute(AgentResponse input) {
        System.out.println("[COO Orchestrator] Executing run request directly.");
        return input;
    }

    /**
     * Executes the full compliance auditing pipeline using structured models.
     * 
     * Pipeline:
     * 1. Scanner.execute(url) -> AgentResponse
     * 2. Jurisdiction.execute(AgentResponse) -> AgentResponse (region + laws set)
     * 3. Legal.execute(AgentResponse) -> AgentResponse (laws updated with policies)
     * 4. Compliance.execute(AgentResponse) -> AgentResponse (issues updated)
     * 5. Risk.execute(AgentResponse) -> AgentResponse (riskScore updated)
     * 6. Report.execute(AgentResponse) -> AgentResponse (report text updated)
     * 7. AutoFix.execute(AgentResponse) -> AgentResponse (fixes list updated)
     * 8. Memory.save(AgentResponse)
     * 
     * @param url Website URL to scan.
     * @return Fully populated AgentResponse object.
     */
    public AgentResponse runFullScan(String url) {
        monitoring.logFlow("Initializing full compliance scan workflow for " + LogSanitizer.url(url));

        try {
            AgentResponse res = scanner.execute(url);
            monitoring.logDebug("Step 1 (Scanner) complete.");

            res = jurisdiction.execute(res);
            monitoring.logDebug("Step 2 (Jurisdiction) complete.");

            res = legal.execute(res);
            monitoring.logDebug("Step 3 (Legal) complete.");

            res = compliance.execute(res);
            monitoring.logDebug("Step 4 (Compliance) complete.");

            res = risk.execute(res);
            monitoring.logDebug("Step 5 (Risk) complete.");

            res = report.execute(res);
            monitoring.logDebug("Step 6 (Report) complete.");

            res = autoFix.execute(res);
            monitoring.logDebug("Step 7 (AutoFix) complete.");

            memory.save(res);
            monitoring.logDebug("Step 8 (Memory) complete.");

            monitoring.logFlow("Workflow completed successfully for " + LogSanitizer.url(url));
            return res;

        } catch (Exception e) {
            String errorMsg = "Workflow execution failed for " + LogSanitizer.url(url) + ": " + LogSanitizer.message(e.getMessage());
            monitoring.logError(errorMsg);
            
            AgentResponse errorResponse = new AgentResponse();
            errorResponse.setRawData("ERROR: " + errorMsg);
            errorResponse.setReport("Workflow execution failed. Please check monitoring logs.");
            errorResponse.setRiskScore(100);
            return errorResponse;
        }
    }
}
