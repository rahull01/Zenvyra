package com.complianceai.service;

import com.complianceai.dto.request.PolicyRequest;
import com.complianceai.model.Policy;
import com.complianceai.model.User;
import com.complianceai.repository.PolicyRepository;
import com.complianceai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final UserRepository userRepository;
    private final OpenAiService openAiService;

    public Policy generatePolicy(String userEmail, PolicyRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate policy using AI
        String generatedContent = openAiService.generatePolicy(
                request.getType(),
                user.getCompanyName(),
                user.getIndustry(),
                request.getLanguage());

        Policy policy = Policy.builder()
                .userId(user.getId())
                .websiteId(request.getWebsiteId())
                .type(request.getType())
                .title(request.getType() + " Policy")
                .content(generatedContent)
                .language(request.getLanguage())
                .version(1)
                .status("draft")
                .generatedBy("ai")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return policyRepository.save(policy);
    }

    public List<Policy> getUserPolicies(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return policyRepository.findByUserId(user.getId());
    }

    public Policy getPolicyById(String userEmail, String id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        if (!policy.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        return policy;
    }

    public Policy updatePolicy(String userEmail, String id, Policy updates) {
        Policy policy = getPolicyById(userEmail, id);

        if (updates.getContent() != null)
            policy.setContent(updates.getContent());
        if (updates.getTitle() != null)
            policy.setTitle(updates.getTitle());

        policy.setUpdatedAt(LocalDateTime.now());
        return policyRepository.save(policy);
    }

    public void deletePolicy(String userEmail, String id) {
        Policy policy = getPolicyById(userEmail, id);
        policyRepository.delete(policy);
    }

    public Policy publishPolicy(String userEmail, String id) {
        Policy policy = getPolicyById(userEmail, id);
        policy.setStatus("published");
        policy.setPublishedAt(LocalDateTime.now());
        return policyRepository.save(policy);
    }
}
