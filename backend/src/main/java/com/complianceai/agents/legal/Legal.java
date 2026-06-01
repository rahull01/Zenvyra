package com.complianceai.agents.legal;

import com.complianceai.agents.model.AgentResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Legal Agent
 * 
 * Responsibility: Maps detected compliance frameworks to concrete legal requirements.
 */
@Service
public class Legal {

    public AgentResponse execute(AgentResponse response) {
        System.out.println("[Legal Agent] Determining legal requirements...");

        if (response == null || response.getLaws() == null) {
            return response;
        }

        // TODO: Replace with AI prompt call to look up statutory requirements and clause mappings.

        List<String> updatedLaws = new ArrayList<>(response.getLaws());

        for (String law : response.getLaws()) {
            if ("GDPR".equals(law)) {
                updatedLaws.add("Privacy Policy Required");
                updatedLaws.add("Cookie Consent Banner Required");
            } else if ("DPDP".equals(law)) {
                updatedLaws.add("Consent Notice Required");
                updatedLaws.add("Aadhaar Consent Required");
            } else if ("CCPA".equals(law)) {
                updatedLaws.add("Do Not Sell Link Required");
                updatedLaws.add("California Privacy Notice Required");
            }
        }

        response.setLaws(updatedLaws);
        System.out.println("[Legal Agent] Legal policies updated in laws: " + updatedLaws);
        return response;
    }
}
