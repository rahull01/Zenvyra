package com.zenvyra.service;

import com.zenvyra.model.Policy;
import com.zenvyra.model.PolicyVersion;
import com.zenvyra.model.User;
import com.zenvyra.repository.PolicyRepository;
import com.zenvyra.repository.PolicyVersionRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.exception.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final PolicyVersionRepository versionRepository;
    private final OpenAiService openAiService;
    private final UserRepository userRepository;

    public Policy createPolicy(String organizationId, String type, String name, String language, String websiteId) {
        String normalizedType = normalizePolicyType(type);
        Optional<User> userOpt = userRepository.findByEmail(organizationId);
        String companySlug = userOpt.map(this::slugForUser).orElseGet(() -> slugify(organizationId));
        String safeLanguage = language != null ? language : "en";
        String safeName = name != null && !name.isBlank() ? name : titleForPolicy(normalizedType);
        String companyName = userOpt
                .map(user -> user.getCompanyName() != null && !user.getCompanyName().isBlank()
                        ? user.getCompanyName()
                        : user.getFullName())
                .orElse(safeName);
        String policyContent = generatePolicyContent(normalizedType, companyName, safeLanguage);

        Policy policy = Policy.builder()
                .id(UUID.randomUUID().toString())
                .organizationId(organizationId)
                .userId(userOpt.map(User::getId).orElse(null))
                .type(normalizedType)
                .name(safeName)
                .title(safeName)
                .language(safeLanguage)
                .websiteId(websiteId)
                .companySlug(companySlug)
                .content(policyContent)
                .plainText(policyContent.replaceAll("<[^>]+>", " ").replaceAll("\\s+", " ").trim())
                .version(1)
                .status("draft")
                .generatedBy("ai")
                .aiPrompt("initial-policy:" + normalizedType)
                .complianceFrameworks(frameworksForPolicy(normalizedType))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .nextReviewAt(LocalDateTime.now().plusMonths(3))
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
            throw ApiException.internalError("AI policy generation failed. Configure OpenAI and retry.");
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

    public Map<String, Object> getPublicPolicy(String companySlug, String policyType) {
        String normalizedSlug = slugify(companySlug);
        String normalizedType = normalizePolicyType(policyType);

        Policy policy = policyRepository
                .findTopByCompanySlugAndTypeAndStatusIgnoreCaseOrderByUpdatedAtDesc(
                        normalizedSlug,
                        normalizedType,
                        "published")
                .orElseGet(() -> findPublishedPolicyByComputedSlug(normalizedSlug, normalizedType)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Published policy not found")));

        PolicyVersion latestVersion = versionRepository.findTopByPolicyIdOrderByVersionDesc(policy.getId()).orElse(null);

        Map<String, Object> payload = new HashMap<>();
        payload.put("id", policy.getId());
        payload.put("companySlug", policy.getCompanySlug() != null ? policy.getCompanySlug() : normalizedSlug);
        payload.put("policyType", policy.getType());
        payload.put("title", policy.getTitle() != null ? policy.getTitle() : policy.getName());
        payload.put("markdown", latestVersion != null ? latestVersion.getContent() : policy.getContent());
        payload.put("version", latestVersion != null ? latestVersion.getVersion() : policy.getVersion());
        payload.put("lastUpdated", latestVersion != null ? latestVersion.getCreatedAt() : policy.getUpdatedAt());
        payload.put("changes", latestVersion != null ? latestVersion.getChanges() : null);
        return payload;
    }

    public String normalizePolicyType(String policyType) {
        if (policyType == null || policyType.isBlank()) {
            return "privacy";
        }

        String value = policyType.trim().toLowerCase()
                .replace("_", "-")
                .replace("policy", "")
                .replace("--", "-")
                .replaceAll("(^-|-$)", "");

        if (value.equals("privacy")) return "privacy";
        if (value.equals("cookie")) return "cookie";
        if (value.equals("terms") || value.equals("terms-conditions") || value.equals("terms-and-conditions")) return "terms";
        if (value.equals("ccpa")) return "ccpa";
        if (value.equals("gdpr")) return "gdpr";
        return value;
    }

    public String slugForUser(User user) {
        if (user == null) {
            return "company";
        }
        if (user.getCompanyName() != null && !user.getCompanyName().isBlank()) {
            return slugify(user.getCompanyName());
        }
        if (user.getFullName() != null && !user.getFullName().isBlank()) {
            return slugify(user.getFullName());
        }
        return slugify(user.getEmail());
    }

    private Optional<Policy> findPublishedPolicyByComputedSlug(String companySlug, String type) {
        return policyRepository.findByTypeAndStatusIgnoreCase(type, "published").stream()
                .filter(policy -> {
                    if (companySlug.equals(policy.getCompanySlug())) {
                        return true;
                    }
                    return userRepository.findByEmail(policy.getOrganizationId())
                            .map(user -> companySlug.equals(slugForUser(user)))
                            .orElse(false);
                })
                .max(Comparator.comparing(Policy::getUpdatedAt, Comparator.nullsLast(Comparator.naturalOrder())));
    }

    private String generatePolicyContent(String type, String companyName, String language) {
        try {
            return openAiService.generatePolicy(type, companyName, "Digital business", language);
        } catch (Exception e) {
            throw ApiException.internalError("AI policy generation failed. Configure OpenAI and retry.");
        }
    }

    private String titleForPolicy(String type) {
        return switch (normalizePolicyType(type)) {
            case "cookie" -> "Cookie Policy";
            case "terms" -> "Terms of Service";
            case "ccpa" -> "CCPA Privacy Notice";
            case "gdpr" -> "GDPR Privacy Notice";
            default -> "Privacy Policy";
        };
    }

    private List<String> frameworksForPolicy(String type) {
        return switch (normalizePolicyType(type)) {
            case "ccpa" -> List.of("CCPA", "CPRA");
            case "gdpr" -> List.of("GDPR");
            case "cookie" -> List.of("GDPR", "ePrivacy", "CCPA");
            default -> List.of("GDPR", "CCPA");
        };
    }

    private String slugify(String value) {
        if (value == null || value.isBlank()) {
            return "company";
        }
        String slug = value.trim().toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        return slug.isBlank() ? "company" : slug;
    }
}
