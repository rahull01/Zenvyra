package com.zenvyra.agents.legal;

import com.zenvyra.agents.compliance.ComplianceRuleCatalog;
import com.zenvyra.agents.model.AgentResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

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

        Set<String> updatedLaws = new LinkedHashSet<>(response.getLaws());

        for (String law : response.getLaws()) {
            updatedLaws.addAll(ComplianceRuleCatalog.rulesForFramework(law));
        }

        updatedLaws.add("RULESET_VERSION:" + ComplianceRuleCatalog.RULESET_VERSION);
        response.setLaws(new ArrayList<>(updatedLaws));
        System.out.println("[Legal Agent] Legal rule set applied: " + updatedLaws);
        return response;
    }
}
