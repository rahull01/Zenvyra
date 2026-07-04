package com.zenvyra.service;

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

    private final UserRepository userRepository;
    private final AiSystemInventoryRepository systemRepository;
    private final AiActAssessmentRepository assessmentRepository;

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

        String riskCategory = classifyRisk(inventory);
        List<String> riskSignals = buildRiskSignals(inventory, riskCategory);
        List<String> transparencyNotices = buildTransparencyNotices(inventory);
        List<String> humanOversightGaps = buildHumanOversightGaps(inventory);
        List<String> documentationGaps = buildDocumentationGaps(inventory);
        List<String> dataHandlingGaps = buildDataHandlingGaps(inventory);
        List<String> userDisclosureGaps = buildUserDisclosureGaps(inventory);
        List<String> monitoringGaps = buildMonitoringGaps(inventory);
        List<String> evidenceItems = buildEvidenceItems(inventory);
        List<String> nextActions = buildNextActions(inventory, riskCategory, documentationGaps, humanOversightGaps);

        Map<String, Boolean> readinessBreakdown = buildReadinessBreakdown(inventory, documentationGaps, humanOversightGaps, monitoringGaps);
        int readinessScore = calculateReadinessScore(readinessBreakdown);

        AiActAssessment assessment = AiActAssessment.builder()
                .userId(user.getId())
                .systemId(inventory.getId())
                .riskCategory(riskCategory)
                .confidence(0.75)
                .readinessScore(readinessScore)
                .readinessBreakdown(readinessBreakdown)
                .riskSignals(riskSignals)
                .requiredTransparencyNotices(transparencyNotices)
                .humanOversightGaps(humanOversightGaps)
                .documentationGaps(documentationGaps)
                .dataHandlingGaps(dataHandlingGaps)
                .userDisclosureGaps(userDisclosureGaps)
                .monitoringGaps(monitoringGaps)
                .evidenceItems(evidenceItems)
                .nextActions(nextActions)
                .counselReviewWarning("This assessment is an operational indicator, not legal advice. Consult qualified counsel before filing conformity declarations.")
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

        long highRiskFlags = systems.stream()
                .filter(s -> classifyRisk(s).toLowerCase().contains("high-risk"))
                .count();

        int overallReadinessScore = calculateOverallReadinessScore(systems);

        Map<String, Object> draftOutputs = new LinkedHashMap<>();
        draftOutputs.put("systemCount", systems.size());
        draftOutputs.put("systemNames", systems.stream().map(AiSystemInventory::getSystemName).collect(Collectors.toList()));
        draftOutputs.put("assessmentCount", assessments.size());

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

    private String classifyRisk(AiSystemInventory s) {
        if (Boolean.TRUE.equals(s.getProhibitedUse())) {
            return "prohibited indicator";
        }
        if (hasHighRiskDomain(s) || Boolean.TRUE.equals(s.getAutomatedDecisionMaking())) {
            return "high-risk indicator";
        }
        if (Boolean.TRUE.equals(s.getUserFacingAiInteraction()) || Boolean.TRUE.equals(s.getEuUsersAffected())) {
            return "limited-risk transparency";
        }
        return "minimal risk";
    }

    private boolean hasHighRiskDomain(AiSystemInventory s) {
        return Boolean.TRUE.equals(s.getHealthcareUse())
                || Boolean.TRUE.equals(s.getHiringUse())
                || Boolean.TRUE.equals(s.getFinanceUse())
                || Boolean.TRUE.equals(s.getEducationUse())
                || Boolean.TRUE.equals(s.getBiometricUse())
                || Boolean.TRUE.equals(s.getGovernmentUse())
                || Boolean.TRUE.equals(s.getCriticalInfrastructureUse())
                || Boolean.TRUE.equals(s.getChildrenUse());
    }

    private List<String> buildRiskSignals(AiSystemInventory s, String riskCategory) {
        List<String> signals = new ArrayList<>();
        if (riskCategory.contains("high-risk")) {
            signals.add("High-risk domain or automated decision-making detected");
        }
        if (Boolean.TRUE.equals(s.getEuUsersAffected())) {
            signals.add("EU users affected");
        }
        if (Boolean.TRUE.equals(s.getUserFacingAiInteraction())) {
            signals.add("User-facing AI interaction");
        }
        if (Boolean.TRUE.equals(s.getAutomatedDecisionMaking())) {
            signals.add("Automated decision-making");
        }
        if (Boolean.TRUE.equals(s.getProhibitedUse())) {
            signals.add("Prohibited use flag raised");
        }
        if (signals.isEmpty()) {
            signals.add("No strong risk signals detected");
        }
        return signals;
    }

    private List<String> buildTransparencyNotices(AiSystemInventory s) {
        List<String> notices = new ArrayList<>();
        if (Boolean.TRUE.equals(s.getUserFacingAiInteraction())) {
            notices.add("User-facing AI interaction notice");
        }
        if (Boolean.TRUE.equals(s.getAutomatedDecisionMaking())) {
            notices.add("Automated decision-making notice");
        }
        if (Boolean.TRUE.equals(s.getEuUsersAffected())) {
            notices.add("EU AI Act transparency notice");
        }
        return notices;
    }

    private List<String> buildHumanOversightGaps(AiSystemInventory s) {
        List<String> gaps = new ArrayList<>();
        if (!Boolean.TRUE.equals(s.getHumanOversight())) {
            gaps.add("Document human review and escalation workflow");
        }
        if (Boolean.TRUE.equals(s.getHumanOversight()) && (s.getHumanOversightOwner() == null || s.getHumanOversightOwner().isBlank())) {
            gaps.add("Assign a named human oversight owner");
        }
        return gaps;
    }

    private List<String> buildDocumentationGaps(AiSystemInventory s) {
        List<String> gaps = new ArrayList<>();
        if (!Boolean.TRUE.equals(s.getTechnicalDocumentationReady())) {
            gaps.add("Prepare technical documentation");
        }
        if (!Boolean.TRUE.equals(s.getRiskAssessmentCompleted())) {
            gaps.add("Complete risk assessment");
        }
        return gaps;
    }

    private List<String> buildDataHandlingGaps(AiSystemInventory s) {
        List<String> gaps = new ArrayList<>();
        if (s.getDataCategoriesSentToAi() == null || s.getDataCategoriesSentToAi().isEmpty()) {
            gaps.add("Document data categories sent to AI");
        }
        if (!Boolean.TRUE.equals(s.getLogsEvidenceRetained())) {
            gaps.add("Enable evidence retention for inputs/outputs");
        }
        return gaps;
    }

    private List<String> buildUserDisclosureGaps(AiSystemInventory s) {
        List<String> gaps = new ArrayList<>();
        if (Boolean.TRUE.equals(s.getUserFacingAiInteraction()) && !Boolean.TRUE.equals(s.getTransparencyNoticePublished())) {
            gaps.add("Publish user-facing AI transparency notice");
        }
        return gaps;
    }

    private List<String> buildMonitoringGaps(AiSystemInventory s) {
        List<String> gaps = new ArrayList<>();
        if (!Boolean.TRUE.equals(s.getMonitoringEnabled())) {
            gaps.add("Enable post-deployment monitoring");
        }
        return gaps;
    }

    private List<String> buildEvidenceItems(AiSystemInventory s) {
        List<String> items = new ArrayList<>();
        items.add("System inventory record: " + s.getSystemName());
        if (Boolean.TRUE.equals(s.getTechnicalDocumentationReady())) {
            items.add("Technical documentation");
        }
        if (Boolean.TRUE.equals(s.getRiskAssessmentCompleted())) {
            items.add("Risk assessment");
        }
        if (Boolean.TRUE.equals(s.getHumanOversight())) {
            items.add("Human oversight policy");
        }
        if (Boolean.TRUE.equals(s.getLogsEvidenceRetained())) {
            items.add("Evidence retention logs");
        }
        return items;
    }

    private List<String> buildNextActions(AiSystemInventory s, String riskCategory, List<String> docGaps, List<String> oversightGaps) {
        List<String> actions = new ArrayList<>();
        if (riskCategory.contains("prohibited")) {
            actions.add("Urgent: review prohibited use classification with counsel");
        }
        if (riskCategory.contains("high-risk")) {
            actions.add("Initiate conformity assessment for high-risk AI system");
        }
        actions.addAll(docGaps.stream().map(g -> "Complete: " + g).collect(Collectors.toList()));
        actions.addAll(oversightGaps.stream().map(g -> "Complete: " + g).collect(Collectors.toList()));
        if (!Boolean.TRUE.equals(s.getTransparencyNoticePublished())) {
            actions.add("Publish transparency notice");
        }
        if (actions.isEmpty()) {
            actions.add("Maintain monitoring and periodic reassessment");
        }
        return actions;
    }

    private Map<String, Boolean> buildReadinessBreakdown(AiSystemInventory s, List<String> docGaps, List<String> oversightGaps, List<String> monitoringGaps) {
        Map<String, Boolean> map = new LinkedHashMap<>();
        map.put("inventoryComplete", s.getSystemName() != null && !s.getSystemName().isBlank() && s.getPurpose() != null && !s.getPurpose().isBlank());
        map.put("documentationReady", docGaps.isEmpty());
        map.put("humanOversightDefined", oversightGaps.isEmpty());
        map.put("transparencyNoticePublished", Boolean.TRUE.equals(s.getTransparencyNoticePublished()));
        map.put("monitoringEnabled", monitoringGaps.isEmpty());
        map.put("evidenceRetained", Boolean.TRUE.equals(s.getLogsEvidenceRetained()));
        return map;
    }

    private int calculateReadinessScore(Map<String, Boolean> breakdown) {
        if (breakdown.isEmpty()) {
            return 0;
        }
        long passed = breakdown.values().stream().filter(Boolean::booleanValue).count();
        return (int) Math.round((passed * 100.0) / breakdown.size());
    }

    private int calculateOverallReadinessScore(List<AiSystemInventory> systems) {
        if (systems.isEmpty()) {
            return 0;
        }
        int total = 0;
        for (AiSystemInventory s : systems) {
            Map<String, Boolean> breakdown = buildReadinessBreakdown(s,
                    buildDocumentationGaps(s), buildHumanOversightGaps(s), buildMonitoringGaps(s));
            total += calculateReadinessScore(breakdown);
        }
        return (int) Math.round(total / (double) systems.size());
    }

    private AiSystemInventoryResponse toResponse(AiSystemInventory s) {
        String riskCategory = classifyRisk(s);
        Map<String, Boolean> breakdown = buildReadinessBreakdown(s,
                buildDocumentationGaps(s), buildHumanOversightGaps(s), buildMonitoringGaps(s));
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
                .riskCategory(riskCategory)
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
                .riskSignals(a.getRiskSignals())
                .requiredTransparencyNotices(a.getRequiredTransparencyNotices())
                .humanOversightGaps(a.getHumanOversightGaps())
                .documentationGaps(a.getDocumentationGaps())
                .dataHandlingGaps(a.getDataHandlingGaps())
                .userDisclosureGaps(a.getUserDisclosureGaps())
                .monitoringGaps(a.getMonitoringGaps())
                .evidenceItems(a.getEvidenceItems())
                .nextActions(a.getNextActions())
                .counselReviewWarning(a.getCounselReviewWarning())
                .assessedAt(a.getAssessedAt())
                .build();
    }
}
