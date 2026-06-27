package com.zenvyra.service;

import com.zenvyra.exception.ApiException;
import com.zenvyra.dto.request.AiSystemInventoryRequest;
import com.zenvyra.model.AiActAssessment;
import com.zenvyra.model.AiSystemInventory;
import com.zenvyra.model.User;
import com.zenvyra.repository.AiActAssessmentRepository;
import com.zenvyra.repository.AiSystemInventoryRepository;
import com.zenvyra.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiActReadinessService {

    private static final String RISK_PROHIBITED = "prohibited risk indicator";
    private static final String RISK_HIGH = "high-risk indicator";
    private static final String RISK_LIMITED = "limited-risk transparency";
    private static final String RISK_MINIMAL = "minimal risk";
    private static final String LEGAL_DISCLAIMER =
            "AI Act readiness outputs support evidence collection and counsel review; they are not legal advice.";

    private final UserRepository userRepository;
    private final AiSystemInventoryRepository systemRepository;
    private final AiActAssessmentRepository assessmentRepository;

    public AiSystemInventory create(UserDetails userDetails, AiSystemInventoryRequest request) {
        User user = requireUser(userDetails);
        LocalDateTime now = LocalDateTime.now();
        AiSystemInventory system = toSystem(request);
        system.setUserId(user.getId());
        system.setOrganizationId(user.getEmail());
        system.setCreatedAt(now);
        system.setUpdatedAt(now);
        return systemRepository.save(system);
    }

    public List<AiSystemInventory> systems(UserDetails userDetails) {
        User user = requireUser(userDetails);
        return systemRepository.findByUserId(user.getId());
    }

    public AiSystemInventory system(UserDetails userDetails, String id) {
        User user = requireUser(userDetails);
        AiSystemInventory system = systemRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("AI system"));
        assertOwner(user, system);
        return system;
    }

    public AiSystemInventory update(UserDetails userDetails, String id, AiSystemInventoryRequest request) {
        AiSystemInventory existing = system(userDetails, id);
        AiSystemInventory updated = toSystem(request);
        updated.setId(existing.getId());
        updated.setUserId(existing.getUserId());
        updated.setOrganizationId(existing.getOrganizationId());
        updated.setCreatedAt(existing.getCreatedAt());
        updated.setUpdatedAt(LocalDateTime.now());
        return systemRepository.save(updated);
    }

    public AiActAssessment assess(UserDetails userDetails, String id) {
        AiSystemInventory system = system(userDetails, id);

        List<String> riskSignals = riskSignals(system);
        List<String> transparencyGaps = transparencyGaps(system);
        List<String> oversightGaps = oversightGaps(system);
        List<String> documentationGaps = documentationGaps(system);
        List<String> dataHandlingGaps = dataHandlingGaps(system);
        List<String> monitoringGaps = monitoringGaps(system);

        Map<String, Boolean> breakdown = new LinkedHashMap<>();
        breakdown.put("inventory", hasText(system.getSystemName()) && hasText(system.getUseCase()));
        breakdown.put("transparency", isTrue(system.getTransparencyNoticePublished()) || !isTrue(system.getUserFacingAiInteraction()));
        breakdown.put("humanOversight", isTrue(system.getHumanOversight()) || !isTrue(system.getAutomatedDecisionMaking()));
        breakdown.put("technicalDocumentation", isTrue(system.getTechnicalDocumentationReady()));
        breakdown.put("evidenceRetention", isTrue(system.getLogsEvidenceRetained()));
        breakdown.put("monitoring", isTrue(system.getMonitoringEnabled()));

        int ready = (int) breakdown.values().stream().filter(Boolean::booleanValue).count();
        int readinessScore = Math.round((ready * 100.0f) / breakdown.size());

        AiActAssessment assessment = AiActAssessment.builder()
                .userId(system.getUserId())
                .systemId(system.getId())
                .riskCategory(riskCategory(system))
                .confidence(0.82)
                .readinessScore(readinessScore)
                .readinessBreakdown(breakdown)
                .riskSignals(riskSignals)
                .requiredTransparencyNotices(transparencyGaps)
                .humanOversightGaps(oversightGaps)
                .documentationGaps(documentationGaps)
                .dataHandlingGaps(dataHandlingGaps)
                .userDisclosureGaps(transparencyGaps)
                .monitoringGaps(monitoringGaps)
                .evidenceItems(evidenceItems(system))
                .nextActions(nextActions(transparencyGaps, oversightGaps, documentationGaps, dataHandlingGaps, monitoringGaps))
                .counselReviewWarning(LEGAL_DISCLAIMER)
                .assessedAt(LocalDateTime.now())
                .build();

        return assessmentRepository.save(assessment);
    }

    public AiActAssessment assessment(UserDetails userDetails, String id) {
        User user = requireUser(userDetails);
        AiActAssessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("AI Act assessment"));
        if (!user.getId().equals(assessment.getUserId())) {
            throw ApiException.forbidden("You do not have access to this AI Act assessment");
        }
        return assessment;
    }

    public Map<String, Object> readiness(UserDetails userDetails) {
        User user = requireUser(userDetails);
        List<AiSystemInventory> systems = systemRepository.findByUserId(user.getId());
        List<AiActAssessment> assessments = assessmentRepository.findByUserId(user.getId()).stream()
                .sorted(Comparator.comparing(AiActAssessment::getAssessedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();

        long highRiskFlags = assessments.stream()
                .filter(assessment -> "high-risk indicator".equalsIgnoreCase(assessment.getRiskCategory())
                        || "prohibited risk indicator".equalsIgnoreCase(assessment.getRiskCategory()))
                .count();
        long missingTransparencyNotices = systems.stream()
                .filter(system -> isTrue(system.getUserFacingAiInteraction()) && !isTrue(system.getTransparencyNoticePublished()))
                .count();
        long humanOversightGaps = systems.stream()
                .filter(system -> isTrue(system.getAutomatedDecisionMaking()) && !isTrue(system.getHumanOversight()))
                .count();

        Map<String, Object> response = new HashMap<>();
        response.put("aiSystemsInventoried", systems.size());
        response.put("highRiskFlags", highRiskFlags);
        response.put("missingTransparencyNotices", missingTransparencyNotices);
        response.put("humanOversightGaps", humanOversightGaps);
        response.put("gpaiProviderDocumentationStatus", providerDocumentationStatus(systems));
        response.put("publicAiDisclosureReadiness", missingTransparencyNotices == 0 ? "ready" : "draft_needed");
        response.put("draftOutputs", disclosureDrafts(systems));
        response.put("latestAssessments", assessments.stream().limit(5).toList());
        response.put("disclaimer", LEGAL_DISCLAIMER);
        return response;
    }

    private User requireUser(UserDetails userDetails) {
        if (userDetails == null) {
            throw ApiException.unauthorized("Authentication required");
        }
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> ApiException.unauthorized("User not found"));
    }

    private void assertOwner(User user, AiSystemInventory system) {
        if (!user.getId().equals(system.getUserId())) {
            throw ApiException.forbidden("You do not have access to this AI system");
        }
    }

    private String riskCategory(AiSystemInventory system) {
        if (isTrue(system.getProhibitedUse())) {
            return RISK_PROHIBITED;
        }
        if (hasHighRiskDomain(system) || isTrue(system.getAutomatedDecisionMaking())) {
            return RISK_HIGH;
        }
        if (isTrue(system.getUserFacingAiInteraction())) {
            return RISK_LIMITED;
        }
        return RISK_MINIMAL;
    }

    private List<String> riskSignals(AiSystemInventory system) {
        return Arrays.asList(
                highRiskSignal(system.getHealthcareUse(), "Healthcare use"),
                highRiskSignal(system.getHiringUse(), "Hiring or employment use"),
                highRiskSignal(system.getFinanceUse(), "Credit, lending, or financial eligibility use"),
                highRiskSignal(system.getEducationUse(), "Education access or evaluation use"),
                highRiskSignal(system.getBiometricUse(), "Biometric identification or categorization use"),
                highRiskSignal(system.getGovernmentUse(), "Public services or government use"),
                highRiskSignal(system.getCriticalInfrastructureUse(), "Critical infrastructure use"),
                isTrue(system.getProhibitedUse()) ? "Prohibited-use indicator requires immediate legal review" : null,
                isTrue(system.getAutomatedDecisionMaking()) ? "Automated decision-making may create legal or similarly significant effects" : null,
                isTrue(system.getUserFacingAiInteraction()) ? "Transparency obligation indicator: users interact with AI output" : null,
                isTrue(system.getChildrenUse()) ? "Vulnerable group indicator: children may be affected" : null,
                hasProviderDocumentationSignal(system) ? "Provider documentation needed for third-party or general-purpose AI dependency" : null
        ).stream().filter(value -> value != null).toList();
    }

    private boolean hasHighRiskDomain(AiSystemInventory system) {
        return isTrue(system.getHealthcareUse())
                || isTrue(system.getHiringUse())
                || isTrue(system.getFinanceUse())
                || isTrue(system.getEducationUse())
                || isTrue(system.getBiometricUse())
                || isTrue(system.getGovernmentUse())
                || isTrue(system.getCriticalInfrastructureUse());
    }

    private boolean hasProviderDocumentationSignal(AiSystemInventory system) {
        String providerType = system.getModelProviderType();
        if (providerType == null) {
            return hasText(system.getProvider());
        }
        String normalized = providerType.toLowerCase();
        return normalized.contains("third-party")
                || normalized.contains("general-purpose")
                || normalized.contains("gpai")
                || normalized.contains("foundation");
    }

    private String highRiskSignal(Boolean value, String label) {
        return isTrue(value) ? "High-risk domain: " + label : null;
    }

    private List<String> transparencyGaps(AiSystemInventory system) {
        if (isTrue(system.getUserFacingAiInteraction()) && !isTrue(system.getTransparencyNoticePublished())) {
            return List.of("User-facing AI interaction notice");
        }
        return List.of();
    }

    private List<String> oversightGaps(AiSystemInventory system) {
        if (isTrue(system.getAutomatedDecisionMaking()) && !isTrue(system.getHumanOversight())) {
            return List.of("Document human review and escalation workflow");
        }
        return List.of();
    }

    private List<String> documentationGaps(AiSystemInventory system) {
        if (!isTrue(system.getTechnicalDocumentationReady())) {
            return Arrays.asList(
                    "Prepare AI system card, intended purpose, provider details, and risk controls",
                    hasProviderDocumentationSignal(system) ? "Collect provider documentation for third-party or general-purpose AI dependency" : null
            ).stream().filter(value -> value != null).toList();
        }
        return List.of();
    }

    private List<String> dataHandlingGaps(AiSystemInventory system) {
        if (system.getDataCategoriesSentToAi() == null || system.getDataCategoriesSentToAi().isEmpty()) {
            return List.of("Map personal data and business data categories sent to the AI system");
        }
        return List.of();
    }

    private List<String> monitoringGaps(AiSystemInventory system) {
        if (!isTrue(system.getLogsEvidenceRetained()) || !isTrue(system.getMonitoringEnabled())) {
            return List.of("Retain logs, incidents, model changes, and review evidence");
        }
        return List.of();
    }

    private List<String> evidenceItems(AiSystemInventory system) {
        return List.of(
                "AI system inventory record: " + valueOr(system.getSystemName(), "Unnamed system"),
                "Intended purpose and use case",
                "Provider documentation",
                "Transparency notice",
                "Human oversight workflow",
                "Monitoring and audit log evidence"
        );
    }

    private List<String> nextActions(List<String> transparency, List<String> oversight, List<String> documentation,
                                     List<String> dataHandling, List<String> monitoring) {
        return Arrays.asList(
                transparency.isEmpty() ? null : "Publish or update the AI interaction notice",
                oversight.isEmpty() ? null : "Assign an accountable human review owner",
                documentation.isEmpty() ? null : "Complete technical documentation packet",
                dataHandling.isEmpty() ? null : "Complete data category mapping",
                monitoring.isEmpty() ? null : "Enable monitoring and evidence retention"
        ).stream().filter(value -> value != null).toList();
    }

    private String providerDocumentationStatus(List<AiSystemInventory> systems) {
        if (systems.isEmpty()) {
            return "not_started";
        }
        boolean ready = systems.stream().allMatch(system -> isTrue(system.getTechnicalDocumentationReady()));
        return ready ? "ready" : "in_progress";
    }

    private Map<String, String> disclosureDrafts(List<AiSystemInventory> systems) {
        String systemNames = systems.isEmpty()
                ? "our AI-enabled features"
                : String.join(", ", systems.stream()
                        .map(system -> valueOr(system.getSystemName(), "Unnamed AI system"))
                        .toList());

        return Map.of(
                "aiUsageDisclosureDraft", "We use " + systemNames + " to support the services described in this product experience.",
                "chatbotDisclosureDraft", "When you interact with an AI assistant, you are interacting with an automated system and may request human support.",
                "automatedDecisionMakingDisclosureDraft", "Where AI supports decisions with legal or similarly significant effects, we provide human review and explanation options.",
                "humanReviewRequestLanguage", "To request human review of an AI-assisted outcome, contact our support or privacy team with the relevant account and decision details."
        );
    }

    private boolean isTrue(Boolean value) {
        return Boolean.TRUE.equals(value);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private String valueOr(String value, String replacement) {
        return hasText(value) ? value : replacement;
    }

    private AiSystemInventory toSystem(AiSystemInventoryRequest request) {
        return AiSystemInventory.builder()
                .systemName(request.getSystemName())
                .purpose(request.getPurpose())
                .provider(request.getProvider())
                .modelName(request.getModelName())
                .modelProviderType(request.getModelProviderType())
                .useCase(request.getUseCase())
                .userGroups(request.getUserGroups())
                .countries(request.getCountries())
                .euUsersAffected(request.getEuUsersAffected())
                .userFacingAiInteraction(request.getUserFacingAiInteraction())
                .automatedDecisionMaking(request.getAutomatedDecisionMaking())
                .humanOversight(request.getHumanOversight())
                .humanOversightOwner(request.getHumanOversightOwner())
                .transparencyNoticePublished(request.getTransparencyNoticePublished())
                .technicalDocumentationReady(request.getTechnicalDocumentationReady())
                .riskAssessmentCompleted(request.getRiskAssessmentCompleted())
                .dataCategoriesSentToAi(request.getDataCategoriesSentToAi())
                .logsEvidenceRetained(request.getLogsEvidenceRetained())
                .monitoringEnabled(request.getMonitoringEnabled())
                .healthcareUse(request.getHealthcareUse())
                .hiringUse(request.getHiringUse())
                .financeUse(request.getFinanceUse())
                .educationUse(request.getEducationUse())
                .childrenUse(request.getChildrenUse())
                .biometricUse(request.getBiometricUse())
                .governmentUse(request.getGovernmentUse())
                .criticalInfrastructureUse(request.getCriticalInfrastructureUse())
                .prohibitedUse(request.getProhibitedUse())
                .build();
    }
}
