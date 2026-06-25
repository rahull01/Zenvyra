package com.zenvyra.service;

import com.zenvyra.exception.ApiException;
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
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiActReadinessService {

    private final UserRepository userRepository;
    private final AiSystemInventoryRepository systemRepository;
    private final AiActAssessmentRepository assessmentRepository;

    public AiSystemInventory create(UserDetails userDetails, AiSystemInventory request) {
        User user = currentUser(userDetails);
        request.setId(null);
        request.setUserId(user.getId());
        request.setCreatedAt(LocalDateTime.now());
        request.setUpdatedAt(LocalDateTime.now());
        return systemRepository.save(request);
    }

    public List<AiSystemInventory> systems(UserDetails userDetails) {
        return systemRepository.findByUserId(currentUser(userDetails).getId());
    }

    public AiSystemInventory system(UserDetails userDetails, String id) {
        User user = currentUser(userDetails);
        AiSystemInventory system = systemRepository.findById(id).orElseThrow(() -> ApiException.notFound("AI system"));
        if (!user.getId().equals(system.getUserId())) throw ApiException.forbidden("AI system belongs to another workspace");
        return system;
    }

    public AiSystemInventory update(UserDetails userDetails, String id, AiSystemInventory request) {
        AiSystemInventory system = system(userDetails, id);
        if (request.getSystemName() != null) system.setSystemName(request.getSystemName());
        if (request.getProvider() != null) system.setProvider(request.getProvider());
        if (request.getModelProviderType() != null) system.setModelProviderType(request.getModelProviderType());
        if (request.getUseCase() != null) system.setUseCase(request.getUseCase());
        if (request.getEuUsersAffected() != null) system.setEuUsersAffected(request.getEuUsersAffected());
        if (request.getUserFacingAiInteraction() != null) system.setUserFacingAiInteraction(request.getUserFacingAiInteraction());
        if (request.getAutomatedDecisionMaking() != null) system.setAutomatedDecisionMaking(request.getAutomatedDecisionMaking());
        if (request.getHumanOversight() != null) system.setHumanOversight(request.getHumanOversight());
        if (request.getDataCategoriesSentToAi() != null) system.setDataCategoriesSentToAi(request.getDataCategoriesSentToAi());
        if (request.getLogsEvidenceRetained() != null) system.setLogsEvidenceRetained(request.getLogsEvidenceRetained());
        system.setUpdatedAt(LocalDateTime.now());
        return systemRepository.save(system);
    }

    public AiActAssessment assess(UserDetails userDetails, String systemId) {
        AiSystemInventory system = system(userDetails, systemId);
        boolean eu = Boolean.TRUE.equals(system.getEuUsersAffected());
        boolean automated = Boolean.TRUE.equals(system.getAutomatedDecisionMaking());
        boolean userFacing = Boolean.TRUE.equals(system.getUserFacingAiInteraction());
        boolean oversight = Boolean.TRUE.equals(system.getHumanOversight());

        String risk = !eu ? "minimal-risk indicator" : automated ? "high-risk indicator" : userFacing ? "limited-risk indicator" : "GPAI dependency indicator";
        AiActAssessment assessment = AiActAssessment.builder()
                .userId(system.getUserId())
                .systemId(system.getId())
                .riskCategory(risk)
                .confidence(eu ? 0.74 : 0.62)
                .requiredTransparencyNotices(userFacing ? List.of("User-facing AI interaction notice", "Provider/model disclosure where appropriate") : List.of("Internal AI usage disclosure"))
                .humanOversightGaps(oversight ? List.of() : List.of("Document human review and escalation workflow"))
                .documentationGaps(List.of("Purpose and use-case record", "Provider documentation", "Change log and evaluation notes"))
                .dataHandlingGaps(Boolean.TRUE.equals(system.getLogsEvidenceRetained()) ? List.of() : List.of("Evidence retention and log review process missing"))
                .userDisclosureGaps(userFacing ? List.of("Publish plain-language AI disclosure near interaction") : List.of())
                .nextActions(List.of("Confirm EU user exposure", "Review data categories sent to AI", "Send high-risk indicators to qualified counsel"))
                .counselReviewWarning("AI Act readiness output is support for risk classification and evidence preparation, not legal advice.")
                .assessedAt(LocalDateTime.now())
                .build();
        return assessmentRepository.save(assessment);
    }

    public AiActAssessment assessment(UserDetails userDetails, String assessmentId) {
        User user = currentUser(userDetails);
        AiActAssessment assessment = assessmentRepository.findById(assessmentId).orElseThrow(() -> ApiException.notFound("AI Act assessment"));
        if (!user.getId().equals(assessment.getUserId())) throw ApiException.forbidden("Assessment belongs to another workspace");
        return assessment;
    }

    public Map<String, Object> readiness(UserDetails userDetails) {
        User user = currentUser(userDetails);
        List<AiSystemInventory> systems = systemRepository.findByUserId(user.getId());
        List<AiActAssessment> assessments = assessmentRepository.findByUserId(user.getId());
        long highRisk = assessments.stream().filter(item -> item.getRiskCategory() != null && item.getRiskCategory().contains("high")).count();
        long missingNotices = systems.stream().filter(system -> Boolean.TRUE.equals(system.getUserFacingAiInteraction())).count();
        long oversightGaps = systems.stream().filter(system -> !Boolean.TRUE.equals(system.getHumanOversight())).count();

        return mapOf(
                "aiSystemsInventoried", systems.size(),
                "highRiskFlags", highRisk,
                "missingTransparencyNotices", missingNotices,
                "humanOversightGaps", oversightGaps,
                "gpaiProviderDocumentationStatus", systems.isEmpty() ? "not_started" : "needs_review",
                "publicAiDisclosureReadiness", missingNotices == 0 && !systems.isEmpty() ? "ready_for_review" : "draft_needed",
                "latestAssessments", assessments.stream()
                        .sorted((left, right) -> {
                            if (left.getAssessedAt() == null && right.getAssessedAt() == null) return 0;
                            if (left.getAssessedAt() == null) return 1;
                            if (right.getAssessedAt() == null) return -1;
                            return right.getAssessedAt().compareTo(left.getAssessedAt());
                        })
                        .limit(5)
                        .map(this::assessmentSummary)
                        .toList(),
                "draftOutputs", draftOutputs(systems),
                "disclaimer", "AI Act readiness is evidence support, not legal advice, and must be reviewed by qualified counsel before public claims."
        );
    }

    private Map<String, Object> assessmentSummary(AiActAssessment assessment) {
        return mapOf(
                "id", assessment.getId(),
                "systemId", assessment.getSystemId(),
                "riskCategory", assessment.getRiskCategory(),
                "confidence", assessment.getConfidence(),
                "requiredTransparencyNotices", safeList(assessment.getRequiredTransparencyNotices()),
                "humanOversightGaps", safeList(assessment.getHumanOversightGaps()),
                "documentationGaps", safeList(assessment.getDocumentationGaps()),
                "dataHandlingGaps", safeList(assessment.getDataHandlingGaps()),
                "userDisclosureGaps", safeList(assessment.getUserDisclosureGaps()),
                "nextActions", safeList(assessment.getNextActions()),
                "counselReviewWarning", assessment.getCounselReviewWarning(),
                "assessedAt", assessment.getAssessedAt()
        );
    }

    private Map<String, Object> draftOutputs(List<AiSystemInventory> systems) {
        String systemNames = systems.isEmpty()
                ? "AI-enabled tools"
                : systems.stream()
                        .map(AiSystemInventory::getSystemName)
                        .filter(name -> name != null && !name.isBlank())
                        .limit(5)
                        .reduce((left, right) -> left + ", " + right)
                        .orElse("AI-enabled tools");
        boolean hasUserFacing = systems.stream().anyMatch(system -> Boolean.TRUE.equals(system.getUserFacingAiInteraction()));
        boolean hasAutomatedDecisioning = systems.stream().anyMatch(system -> Boolean.TRUE.equals(system.getAutomatedDecisionMaking()));

        return mapOf(
                "aiUsageDisclosureDraft", "We use " + systemNames + " to support operational workflows. Outputs are reviewed according to our internal evidence and oversight process.",
                "chatbotDisclosureDraft", hasUserFacing
                        ? "You may interact with an AI-assisted feature. Do not submit sensitive information unless requested, and contact support if you need human assistance."
                        : "No user-facing chatbot or AI assistant has been inventoried yet.",
                "automatedDecisionMakingDisclosureDraft", hasAutomatedDecisioning
                        ? "Some AI-assisted workflows may support decisions that affect users. A human review route should be available before relying on the output."
                        : "No automated decision-making system has been inventoried yet.",
                "humanReviewRequestLanguage", "To request human review of an AI-assisted outcome, contact support with the relevant account, request, or transaction details."
        );
    }

    private List<String> safeList(List<String> values) {
        return values == null ? List.of() : values;
    }

    private User currentUser(UserDetails userDetails) {
        if (userDetails == null) throw ApiException.unauthorized("Authentication required");
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> ApiException.unauthorized("User not found"));
    }

    private Map<String, Object> mapOf(Object... values) {
        Map<String, Object> map = new LinkedHashMap<>();
        for (int i = 0; i + 1 < values.length; i += 2) {
            map.put(String.valueOf(values[i]), values[i + 1]);
        }
        return map;
    }
}
