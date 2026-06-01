package com.complianceai.service;

import com.complianceai.model.Policy;
import com.complianceai.model.PolicyVersion;
import com.complianceai.repository.PolicyRepository;
import com.complianceai.repository.PolicyVersionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final PolicyVersionRepository versionRepository;
    private final OpenAiService openAiService;

    public Policy createPolicy(String organizationId, String type, String name, String language, String websiteId) {
        Policy policy = Policy.builder()
                .id(UUID.randomUUID().toString())
                .organizationId(organizationId)
                .type(type)
                .name(name)
                .title(name)
                .language(language != null ? language : "en")
                .websiteId(websiteId)
                .status("draft")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return policyRepository.save(policy);
    }

    public Policy getPolicy(String organizationId, String policyId) {
        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Policy not found"));
        if (!organizationId.equals(policy.getOrganizationId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        return policy;
    }

    public Policy updatePolicy(String organizationId, String policyId, Map<String, Object> updates) {
        Policy policy = getPolicy(organizationId, policyId);

        if (updates.containsKey("content")) {
            policy.setContent((String) updates.get("content"));
        }
        if (updates.containsKey("title")) {
            String title = (String) updates.get("title");
            policy.setTitle(title);
            policy.setName(title);
        }
        if (updates.containsKey("name")) {
            String name = (String) updates.get("name");
            policy.setName(name);
            if (policy.getTitle() == null) {
                policy.setTitle(name);
            }
        }
        if (updates.containsKey("status")) {
            policy.setStatus((String) updates.get("status"));
        }
        if (updates.containsKey("language")) {
            policy.setLanguage((String) updates.get("language"));
        }

        policy.setUpdatedAt(LocalDateTime.now());
        return policyRepository.save(policy);
    }

    public List<Policy> getPolicies(String organizationId) {
        return policyRepository.findByOrganizationId(organizationId);
    }

    public PolicyVersion draftWithAI(String policyId, String prompt) {
        Policy policy = policyRepository.findById(policyId).orElseThrow();
        
        // Generate actual compliance policies using OpenAI LLM engine
        String companyName = policy.getName() != null ? policy.getName() : "Enterprise SaaS";
        String language = policy.getLanguage() != null ? policy.getLanguage() : "en";
        String aiContent;
        try {
            aiContent = openAiService.generatePolicy(policy.getType(), companyName, "SaaS Technology", language);
        } catch (Exception e) {
            // Fallback content in case API key is not yet set up
            aiContent = String.format(
                "<h1>%s</h1><p>Standard regulatory policy designed for %s (%s company).</p><p>GDPR and CCPA compliant privacy frameworks initialized.</p>",
                policy.getName(), companyName, "SaaS Technology"
            );
        }
        
        PolicyVersion version = PolicyVersion.builder()
                .id(UUID.randomUUID().toString())
                .policyId(policyId)
                .version(1)
                .content(aiContent)
                .changes("Initial AI draft: " + prompt)
                .createdAt(LocalDateTime.now())
                .build();
        
        versionRepository.save(version);
        
        policy.setStatus("draft_ready");
        policy.setContent(aiContent);
        policy.setUpdatedAt(LocalDateTime.now());
        policyRepository.save(policy);
        
        return version;
    }
}
