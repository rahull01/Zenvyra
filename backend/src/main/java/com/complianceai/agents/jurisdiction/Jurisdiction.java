package com.complianceai.agents.jurisdiction;

import com.complianceai.agents.model.AgentResponse;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

/**
 * Jurisdiction Agent
 * 
 * Responsibility: Analyzes target website scan data to detect its operating region/jurisdiction.
 * Map regions to applicable law frameworks: EU -> GDPR, US -> CCPA, India -> DPDP.
 */
@Service
public class Jurisdiction {

    public AgentResponse execute(AgentResponse response) {
        System.out.println("[Jurisdiction Agent] Analyzing jurisdiction for scanned data...");

        if (response == null || response.getRawData() == null) {
            return response;
        }

        // TODO: Replace with AI prompt call to classify target market, hosting servers, or footer addresses.

        String lowercaseInput = response.getRawData().toLowerCase();
        String detectedRegion;
        List<String> laws = new ArrayList<>();

        if (lowercaseInput.contains(".eu") || lowercaseInput.contains("eu portal") || lowercaseInput.contains("europe")) {
            detectedRegion = "EU";
            laws.add("GDPR");
        } else if (lowercaseInput.contains(".in") || lowercaseInput.contains("india shop") || lowercaseInput.contains("india")) {
            detectedRegion = "India";
            laws.add("DPDP");
        } else {
            detectedRegion = "US";
            laws.add("CCPA");
        }

        response.setRegion(detectedRegion);
        response.setLaws(laws);
        System.out.println("[Jurisdiction Agent] Analysis complete. Region: " + detectedRegion + ", Laws: " + laws);
        return response;
    }
}
