package com.complianceai.service;

import com.complianceai.model.WebsiteScanResult.ClassifiedTracker;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class TrackerClassificationService {

    private final OpenAiService openAiService;
    private final ObjectMapper objectMapper;

    /**
     * Classifies a set of domains using OpenAI GPT-4.
     */
    public List<ClassifiedTracker> classifyDomains(Set<String> domains) {
        if (domains == null || domains.isEmpty()) {
            return new ArrayList<>();
        }

        try {
            // Serialize domains list to JSON for the prompt
            String domainsJson = objectMapper.writeValueAsString(domains);
            
            // Invoke OpenAI
            String responseRaw = openAiService.classifyTrackingDomains(domainsJson);
            
            // Clean markdown code blocks if present
            String cleanJson = responseRaw.trim();
            if (cleanJson.startsWith("```")) {
                cleanJson = cleanJson.replaceAll("^```json\\s*", "").replaceAll("```$", "").trim();
            }

            // Parse response
            List<ClassifiedTracker> classified = objectMapper.readValue(
                    cleanJson,
                    new TypeReference<List<ClassifiedTracker>>() {}
            );

            log.info("Successfully classified {} tracking domains with OpenAI", classified.size());
            return classified;

        } catch (Exception e) {
            log.error("Failed to classify tracking domains with OpenAI, falling back to empty list", e);
            // Fallback: Return domains mapped to unclassified
            List<ClassifiedTracker> fallback = new ArrayList<>();
            for (String domain : domains) {
                fallback.add(ClassifiedTracker.builder()
                        .domain(domain)
                        .serviceName(domain)
                        .category("Functional")
                        .purposeDescription("Unknown third-party tracking script or iframe.")
                        .build());
            }
            return fallback;
        }
    }
}
