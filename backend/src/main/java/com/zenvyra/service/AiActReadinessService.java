package com.zenvyra.service;

import com.zenvyra.domain.aiact.AiActRuleCatalog;
import com.zenvyra.domain.aiact.AiActRuleCatalogFactory;
import com.zenvyra.domain.aiact.RiskLevel;
import com.zenvyra.dto.request.AiSystemInventoryRequest;
import com.zenvyra.dto.response.AiActAssessmentResponse;
import com.zenvyra.dto.response.AiActReadinessResponse;
import com.zenvyra.dto.response.AiSystemInventoryResponse;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.AiActAssessment;
import com.zenvyra.model.AiSystemInventory;
import com.zenvyra.model.User;
import com.zenvyra.repository.AiActAssessmentRepository;
import com.zenvyra.repository.AiSystemInventoryRepository;
import com.zenvyra.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiActReadinessService {
    private static final String COUNSEL_REVIEW_WARNING =
            "This assessment is an operational indicator, not legal advice. Consult qualified counsel before filing conformity declarations.";

    private final UserRepository userRepository;
    private final AiSystemInventoryRepository systemRepository;
    private final AiActAssessmentRepository assessmentRepository;
    private final AiActRuleCatalogFactory ruleCatalogFactory;

    public AiSystemInventoryResponse create(UserDetails userDetails, AiSystemInventoryRequest request) {
        User user = resolveUser(userDetails);
        LocalDateTime now = LocalDateTime.now();
        AiSystemInventory inventory = AiSystemInventory.builder()
                .userId(user.getId())
                .organizationId(request.getOrganizationId())
                .systemName(request.getSystemName())
                .purpose(request.getPurpose())
                .provider(request.getProvider())
                .modelName(request.getModelName())
                .modelProviderType(request.getModelProviderType())
                .useCase(request.getUseCase())
                .userGroups(Optional.ofNullable(request.getUserGroups()).orElse(new ArrayList<>()))
                .countries(Optional.ofNullable(request.getCountries()).orElse(new ArrayList<>()))
                .euUsersAffected(Boolean.TRUE.equals(request.getEuUsersAffected()))
                .userFacingAiInteraction(Boolean.TRUE.equals(request.getUserFacingAiInteraction()))
                .automatedDecisionMaking(Boolean.TRUE.equals(request.getAutomatedDecisionMaking()))
                .humanOversight(Boolean.TRUE.equals(request.getHumanOversight()))
                .humanOversightOwner(request.getHumanOversightOwner())
                .transparencyNoticePublished(Boolean.TRUE.equals(request.getTransparencyNoticePublished()))
                .technicalDocumentationReady(Boolean.TRUE.equals(request.getTechnicalDocumentationReady()))
                .riskAssessmentCompleted(Boolean.TRUE.equals(request.getRiskAssessmentCompleted()))
                .dataCategoriesSentToAi(Optional.ofNullable(request.getDataCategoriesSentToAi()).orElse(new ArrayList<>()))
                .logsEvidenceRetained(Boolean.TRUE.equals(request.getLogsEvidenceRetained()))
                .monitoringEnabled(Boolean.TRUE.equals(request.getMonitoringEnabled()))
                .healthcareUse(Boolean.TRUE.equals(request.getHealthcareUse()))
                .hiringUse(Boolean.TRUE.equals(request.getHiringUse()))
                .financeUse(Boolean.TRUE.equals(request.getFinanceUse()))
                .educationUse(Boolean.TRUE.equals(request.getEducationUse()))
                .childrenUse(Boolean.TRUE.equals(request.getChildrenUse()))
                .biometricUse(Boolean.TRUE.equals(request.getBiometricUse()))
                .governmentUse(Boolean.TRUE.equals(request.getGovernmentUse()))
                .criticalInfrastructureUse(Boolean.TRUE.equals(request.getCriticalInfrastructureUse()))
                .prohibitedUse(Boolean.TRUE.equals(request.getProhibitedUse()))
                .createdAt(now)
                .updatedAt(now)
                .build();
        return toResponse(systemRepository.save(inventory));
    }

    public List<AiSystemInventoryResponse> systems(UserDetails userDetails) {
        User user = resolveUser(userDetails);
        return systemRepository.findByUserId(user.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AiSystemInventoryResponse system(UserDetails userDetails, String id) {
        return toResponse(loadOwnedSystem(userDetails, id));
    }

    public AiSystemInventoryResponse update(UserDetails userDetails, String id, AiSystemInventoryRequest request) {
        User user = resolveUser(userDetails);
        AiSystemInventory existing = loadSystemForUser(user, id);
        existing.setOrganizationId(request.getOrganizationId());
        existing.setSystemName(request.getSystemName());
        existing.setPurpose(request.getPurpose());
        existing.setProvider(request.getProvider());
        existing.setModelName(request.getModelName());
        existing.setModelProviderType(request.getModelProviderType());
        existing.setUseCase(request.getUseCase());
        existing.setUserGroups(Optional.ofNullable(request.getUserGroups()).orElse(existing.getUserGroups()));
        existing.setCountries(Optional.ofNullable(request.getCountries()).orElse(existing.getCountries()));
        existing.setEuUsersAffected(Boolean.TRUE.equals(request.getEuUsersAffected()));
        existing.setUserFacingAiInteraction(Boolean.TRUE.equals(request.getUserFacingAiInteraction()));
        existing.setAutomatedDecisionMaking(Boolean.TRUE.equals(request.getAutomatedDecisionMaking()));
        existing.setHumanOversight(Boolean.TRUE.equals(request.getHumanOversight()));
        existing.setHumanOversightOwner(request.getHumanOversightOwner());
        existing.setTransparencyNoticePublished(Boolean.TRUE.equals(request.getTransparencyNoticePublished()));
        existing.setTechnicalDocumentationReady(Boolean.TRUE.equals(request.getTechnicalDocumentationReady()));
        existing.setRiskAssessmentCompleted(Boolean.TRUE.equals(request.getRiskAssessmentCompleted()));
        existing.setDataCategoriesSentToAi(Optional.ofNullable(request.getDataCategoriesSentToAi()).orElse(existing.getDataCategoriesSentToAi()));
        existing.setLogsEvidenceRetained(Boolean.TRUE.equals(request.getLogsEvidenceRetained()));
        existing.setMonitoringEnabled(Boolean.TRUE.equals(request.getMonitoringEnabled()));
        existing.setHealthcareUse(Boolean.TRUE.equals(request.getHealthcareUse()));
        existing.setHiringUse(Boolean.TRUE.equals(request.getHiringUse()));
        existing.setFinanceUse(Boolean.TRUE.equals(request.getFinanceUse()));
        existing.setEducationUse(Boolean.TRUE.equals(request.getEducationUse()));
        existing.setChildrenUse(Boolean.TRUE.equals(request.getChildrenUse()));
        existing.setBiometricUse(Boolean.TRUE.equals(request.getBiometricUse()));
        existing.setGovernmentUse(Boolean.TRUE.equals(request.getGovernmentUse()));
        existing.setCriticalInfrastructureUse(Boolean.TRUE.equals(request.getCriticalInfrastructureUse()));
        existing.setProhibitedUse(Boolean.TRUE.equals(request.getProhibitedUse()));
        existing.setUpdatedAt(LocalDateTime.now());
        return toResponse(systemRepository.save(existing));
    }

    public AiActAssessmentResponse assess(UserDetails userDetails, String id) {
        User user = resolveUser(userDetails);
        AiSystemInventory inventory = loadSystemForUser(user, id);
        AiActRuleCatalog catalog = ruleCatalogFactory.current();

        RiskLevel riskLevel = catalog.classifyRisk(inventory);
        String riskCategory = riskLevel.getLabel();
        List<String> riskSignals = catalog.riskSignals(inventory, riskLevel);
        String riskClassificationRationale = catalog.riskClassificationRationale(inventory, riskLevel);
        String confidenceExplanation = catalog.confidenceExplanation(inventory, riskLevel);
        String riskLevelExplanation = catalog.riskLevelExplanation(inventory, riskLevel);
        List<String> annexIIIUseCases = catalog.annexIIIUseCases(inventory);
        List<String> applicableObligations = catalog.applicableObligations(inventory, riskLevel);
        List<String> transparencyNotices = catalog.transparencyNotices(inventory);
        List<String> humanOversightGaps = catalog.humanOversightGaps(inventory);
        List<String> documentationGaps = catalog.documentationGaps(inventory);
        List<String> dataHandlingGaps = catalog.dataHandlingGaps(inventory);
        List<String> userDisclosureGaps = catalog.userDisclosureGaps(inventory);
        List<String> monitoringGaps = catalog.monitoringGaps(inventory);
        List<String> aiLiteracyGaps = catalog.aiLiteracyGaps(inventory);
        List<String> gpaiProviderDocumentationGaps = catalog.gpaiProviderDocumentationGaps(inventory);
        List<String> conformityAssessmentGaps = catalog.conformityAssessmentGaps(inventory, riskLevel);
        Map<String, String> evidenceChecklist = catalog.evidenceChecklist(inventory, riskLevel);
        List<String> evidenceItems = catalog.evidenceItems(inventory);
        List<String> nextActions = buildNextActions(
                riskLevel,
                documentationGaps,
                humanOversightGaps,
                userDisclosureGaps,
                monitoringGaps,
                aiLiteracyGaps,
                gpaiProviderDocumentationGaps,
                conformityAssessmentGaps);

        Map<String, Boolean> readinessBreakdown = catalog.readinessBreakdown(inventory);
        int readinessScore = calculateReadinessScore(readinessBreakdown);

        AiActAssessment assessment = AiActAssessment.builder()
                .userId(user.getId())
                .systemId(inventory.getId())
                .riskCategory(riskCategory)
                .confidence(0.75)
                .readinessScore(readinessScore)
                .readinessBreakdown(readinessBreakdown)
                .rulesetVersion(catalog.version())
                .riskSignals(riskSignals)
                .riskClassificationRationale(riskClassificationRationale)
                .confidenceExplanation(confidenceExplanation)
                .riskLevelExplanation(riskLevelExplanation)
                .applicableObligations(applicableObligations)
                .annexIIIUseCases(annexIIIUseCases)
                .requiredTransparencyNotices(transparencyNotices)
                .humanOversightGaps(humanOversightGaps)
                .documentationGaps(documentationGaps)
                .dataHandlingGaps(dataHandlingGaps)
                .userDisclosureGaps(userDisclosureGaps)
                .monitoringGaps(monitoringGaps)
                .aiLiteracyGaps(aiLiteracyGaps)
                .gpaiProviderDocumentationGaps(gpaiProviderDocumentationGaps)
                .conformityAssessmentGaps(conformityAssessmentGaps)
                .evidenceChecklist(evidenceChecklist)
                .evidenceItems(evidenceItems)
                .nextActions(nextActions)
                .counselReviewWarning(COUNSEL_REVIEW_WARNING)
                .assessedAt(LocalDateTime.now())
                .build();
        return toResponse(assessmentRepository.save(assessment), inventory);
    }

    public AiActAssessmentResponse assessment(UserDetails userDetails, String id) {
        User user = resolveUser(userDetails);
        AiActAssessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Assessment"));
        if (!user.getId().equals(assessment.getUserId())) {
            throw ApiException.forbidden("Access denied");
        }
        AiSystemInventory inventory = systemRepository.findById(assessment.getSystemId())
                .orElse(null);
        return toResponse(assessment, inventory);
    }

    public void delete(UserDetails userDetails, String id) {
        User user = resolveUser(userDetails);
        AiSystemInventory system = loadSystemForUser(user, id);
        systemRepository.delete(system);
    }

    public AiActReadinessResponse readiness(UserDetails userDetails) {
        User user = resolveUser(userDetails);
        List<AiSystemInventory> systems = systemRepository.findByUserId(user.getId());
        List<AiActAssessment> assessments = assessmentRepository.findByUserId(user.getId());
        AiActRuleCatalog catalog = ruleCatalogFactory.current();

        long highRiskFlags = systems.stream()
                .filter(s -> catalog.classifyRisk(s) == RiskLevel.HIGH_RISK)
                .count();

        int overallReadinessScore = calculateOverallReadinessScore(systems, catalog);

        Map<String, Object> draftOutputs = new LinkedHashMap<>();
        draftOutputs.put("rulesetVersion", catalog.version());
        draftOutputs.put("systemCount", systems.size());
        draftOutputs.put("systemNames", systems.stream().map(AiSystemInventory::getSystemName).collect(Collectors.toList()));
        draftOutputs.put("assessmentCount", assessments.size());
        draftOutputs.put("highRiskSystemNames", systems.stream()
                .filter(s -> catalog.classifyRisk(s) == RiskLevel.HIGH_RISK)
                .map(AiSystemInventory::getSystemName)
                .collect(Collectors.toList()));
        draftOutputs.put("gpaiDependencyCount", systems.stream().filter(s -> hasThirdPartyDependency(s)).count());
        draftOutputs.put("topEvidenceGaps", systems.stream()
                .flatMap(s -> catalog.evidenceChecklist(s, catalog.classifyRisk(s)).entrySet().stream()
                        .filter(entry -> entry.getValue().startsWith("GAP"))
                        .map(entry -> s.getSystemName() + ": " + entry.getKey()))
                .limit(8)
                .collect(Collectors.toList()));

        return AiActReadinessResponse.builder()
                .aiSystemsInventoried(systems.size())
                .assessmentsCompleted(assessments.size())
                .highRiskFlags(highRiskFlags)
                .overallReadinessScore(overallReadinessScore)
                .disclaimer("This readiness snapshot is an operational indicator, not legal advice.")
                .draftOutputs(draftOutputs)
                .latestAssessments(assessments.stream()
                        .sorted((a, b) -> b.getAssessedAt().compareTo(a.getAssessedAt()))
                        .limit(5)
                        .map(a -> {
                            Map<String, Object> m = new LinkedHashMap<>();
                            m.put("id", a.getId());
                            m.put("systemId", a.getSystemId());
                            m.put("riskCategory", a.getRiskCategory());
                            m.put("readinessScore", a.getReadinessScore());
                            m.put("rulesetVersion", a.getRulesetVersion());
                            m.put("applicableObligations", a.getApplicableObligations());
                            m.put("annexIIIUseCases", a.getAnnexIIIUseCases());
                            m.put("assessedAt", a.getAssessedAt());
                            return m;
                        })
                        .collect(Collectors.toList()))
                .build();
    }

    private User resolveUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.UNAUTHORIZED, "UNAUTHORIZED"));
    }

    private AiSystemInventory loadSystemForUser(User user, String id) {
        AiSystemInventory inventory = systemRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("AI system"));
        if (!user.getId().equals(inventory.getUserId())) {
            throw ApiException.forbidden("Access denied");
        }
        return inventory;
    }

    private AiSystemInventory loadOwnedSystem(UserDetails userDetails, String id) {
        User user = resolveUser(userDetails);
        return loadSystemForUser(user, id);
    }

    private List<String> buildNextActions(
            RiskLevel riskLevel,
            List<String> docGaps,
            List<String> oversightGaps,
            List<String> userDisclosureGaps,
            List<String> monitoringGaps,
            List<String> aiLiteracyGaps,
            List<String> gpaiProviderDocumentationGaps,
            List<String> conformityAssessmentGaps) {
        List<String> actions = new ArrayList<>();
        if (riskLevel == RiskLevel.PROHIBITED) {
            actions.add("Urgent: review prohibited use classification with counsel");
        }
        if (riskLevel == RiskLevel.HIGH_RISK) {
            actions.add("Open high-risk AI conformity assessment workstream");
        }
        actions.addAll(docGaps.stream().map(g -> "Complete: " + g).collect(Collectors.toList()));
        actions.addAll(oversightGaps.stream().map(g -> "Complete: " + g).collect(Collectors.toList()));
        actions.addAll(userDisclosureGaps.stream().map(g -> "Publish: " + g).collect(Collectors.toList()));
        actions.addAll(monitoringGaps.stream().map(g -> "Configure: " + g).collect(Collectors.toList()));
        actions.addAll(aiLiteracyGaps.stream().map(g -> "Train: " + g).collect(Collectors.toList()));
        actions.addAll(gpaiProviderDocumentationGaps.stream().map(g -> "Collect: " + g).collect(Collectors.toList()));
        actions.addAll(conformityAssessmentGaps.stream().map(g -> "Evidence: " + g).collect(Collectors.toList()));
        if (actions.isEmpty()) {
            actions.add("Maintain monitoring and periodic reassessment");
        }
        return actions;
    }

    private boolean hasThirdPartyDependency(AiSystemInventory s) {
        String providerType = Optional.ofNullable(s.getModelProviderType()).orElse("").toLowerCase();
        return providerType.contains("third-party")
                || providerType.contains("third party")
                || providerType.contains("general-purpose")
                || providerType.contains("general purpose")
                || providerType.contains("gpa");
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private int calculateReadinessScore(Map<String, Boolean> breakdown) {
        if (breakdown.isEmpty()) {
            return 0;
        }
        long passed = breakdown.values().stream().filter(Boolean::booleanValue).count();
        return (int) Math.round((passed * 100.0) / breakdown.size());
    }

    private int calculateOverallReadinessScore(List<AiSystemInventory> systems, AiActRuleCatalog catalog) {
        if (systems.isEmpty()) {
            return 0;
        }
        int total = 0;
        for (AiSystemInventory s : systems) {
            total += calculateReadinessScore(catalog.readinessBreakdown(s));
        }
        return (int) Math.round(total / (double) systems.size());
    }

    private AiSystemInventoryResponse toResponse(AiSystemInventory s) {
        AiActRuleCatalog catalog = ruleCatalogFactory.current();
        RiskLevel riskLevel = catalog.classifyRisk(s);
        Map<String, Boolean> breakdown = catalog.readinessBreakdown(s);
        return AiSystemInventoryResponse.builder()
                .id(s.getId())
                .userId(s.getUserId())
                .organizationId(s.getOrganizationId())
                .systemName(s.getSystemName())
                .purpose(s.getPurpose())
                .provider(s.getProvider())
                .modelName(s.getModelName())
                .modelProviderType(s.getModelProviderType())
                .useCase(s.getUseCase())
                .userGroups(s.getUserGroups())
                .countries(s.getCountries())
                .euUsersAffected(s.getEuUsersAffected())
                .userFacingAiInteraction(s.getUserFacingAiInteraction())
                .automatedDecisionMaking(s.getAutomatedDecisionMaking())
                .humanOversight(s.getHumanOversight())
                .humanOversightOwner(s.getHumanOversightOwner())
                .transparencyNoticePublished(s.getTransparencyNoticePublished())
                .technicalDocumentationReady(s.getTechnicalDocumentationReady())
                .riskAssessmentCompleted(s.getRiskAssessmentCompleted())
                .dataCategoriesSentToAi(s.getDataCategoriesSentToAi())
                .logsEvidenceRetained(s.getLogsEvidenceRetained())
                .monitoringEnabled(s.getMonitoringEnabled())
                .healthcareUse(s.getHealthcareUse())
                .hiringUse(s.getHiringUse())
                .financeUse(s.getFinanceUse())
                .educationUse(s.getEducationUse())
                .childrenUse(s.getChildrenUse())
                .biometricUse(s.getBiometricUse())
                .governmentUse(s.getGovernmentUse())
                .criticalInfrastructureUse(s.getCriticalInfrastructureUse())
                .prohibitedUse(s.getProhibitedUse())
                .riskCategory(riskLevel.getLabel())
                .readinessScore(calculateReadinessScore(breakdown))
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }

    private AiActAssessmentResponse toResponse(AiActAssessment a, AiSystemInventory inventory) {
        return AiActAssessmentResponse.builder()
                .id(a.getId())
                .userId(a.getUserId())
                .systemId(a.getSystemId())
                .systemName(inventory != null ? inventory.getSystemName() : null)
                .riskCategory(a.getRiskCategory())
                .confidence(a.getConfidence())
                .readinessScore(a.getReadinessScore())
                .readinessBreakdown(a.getReadinessBreakdown())
                .rulesetVersion(a.getRulesetVersion())
                .riskSignals(a.getRiskSignals())
                .riskClassificationRationale(a.getRiskClassificationRationale())
                .confidenceExplanation(a.getConfidenceExplanation())
                .riskLevelExplanation(a.getRiskLevelExplanation())
                .applicableObligations(a.getApplicableObligations())
                .annexIIIUseCases(a.getAnnexIIIUseCases())
                .requiredTransparencyNotices(a.getRequiredTransparencyNotices())
                .humanOversightGaps(a.getHumanOversightGaps())
                .documentationGaps(a.getDocumentationGaps())
                .dataHandlingGaps(a.getDataHandlingGaps())
                .userDisclosureGaps(a.getUserDisclosureGaps())
                .monitoringGaps(a.getMonitoringGaps())
                .aiLiteracyGaps(a.getAiLiteracyGaps())
                .gpaiProviderDocumentationGaps(a.getGpaiProviderDocumentationGaps())
                .conformityAssessmentGaps(a.getConformityAssessmentGaps())
                .evidenceChecklist(a.getEvidenceChecklist())
                .evidenceItems(a.getEvidenceItems())
                .nextActions(a.getNextActions())
                .counselReviewWarning(a.getCounselReviewWarning())
                .assessedAt(a.getAssessedAt())
                .build();
    }
}
