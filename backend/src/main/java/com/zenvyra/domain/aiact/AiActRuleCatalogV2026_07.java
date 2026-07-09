package com.zenvyra.domain.aiact;

import com.zenvyra.model.AiSystemInventory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Concrete {@link AiActRuleCatalog} implementation for the
 * {@code EU_AI_ACT_READINESS_2026_07} ruleset.
 *
 * <p>This catalog is the single source of truth for every assessment string
 * produced by the AI Act readiness flow. It preserves the exact output strings
 * that {@code AiActReadinessService} emitted before the catalog refactor so
 * existing assessments and tests remain compatible.
 */
@Component
public class AiActRuleCatalogV2026_07 implements AiActRuleCatalog {

    public static final String VERSION = "EU_AI_ACT_READINESS_2026_07";

    @Override
    public String version() {
        return VERSION;
    }

    @Override
    public RiskLevel classifyRisk(AiSystemInventory inventory) {
        if (Boolean.TRUE.equals(inventory.getProhibitedUse())) {
            return RiskLevel.PROHIBITED;
        }
        if (hasHighRiskDomain(inventory) || Boolean.TRUE.equals(inventory.getAutomatedDecisionMaking())) {
            return RiskLevel.HIGH_RISK;
        }
        if (Boolean.TRUE.equals(inventory.getUserFacingAiInteraction())) {
            return RiskLevel.LIMITED_RISK;
        }
        return RiskLevel.MINIMAL_RISK;
    }

    @Override
    public List<String> riskSignals(AiSystemInventory inventory, RiskLevel riskLevel) {
        List<String> signals = new ArrayList<>();
        if (riskLevel == RiskLevel.PROHIBITED) {
            signals.add("Prohibited-use indicator requires immediate legal review");
        }
        signals.addAll(highRiskDomainSignals(inventory));
        if (Boolean.TRUE.equals(inventory.getEuUsersAffected())) {
            signals.add("EU users affected");
        }
        if (Boolean.TRUE.equals(inventory.getUserFacingAiInteraction())) {
            signals.add("Transparency obligation indicator: users interact with AI output");
        }
        if (Boolean.TRUE.equals(inventory.getAutomatedDecisionMaking())) {
            signals.add("High-risk trigger: automated decision-making");
        }
        if (hasThirdPartyDependency(inventory)) {
            signals.add("Provider documentation needed for third-party or general-purpose AI dependency");
        }
        if (signals.isEmpty()) {
            signals.add("No strong risk signals detected");
        }
        return signals;
    }

    @Override
    public List<String> annexIIIUseCases(AiSystemInventory inventory) {
        List<String> useCases = new ArrayList<>();
        if (Boolean.TRUE.equals(inventory.getBiometricUse())) {
            useCases.add("Annex III: biometric identification or categorisation indicator");
        }
        if (Boolean.TRUE.equals(inventory.getCriticalInfrastructureUse())) {
            useCases.add("Annex III: critical infrastructure safety indicator");
        }
        if (Boolean.TRUE.equals(inventory.getEducationUse())) {
            useCases.add("Annex III: education or vocational training indicator");
        }
        if (Boolean.TRUE.equals(inventory.getHiringUse())) {
            useCases.add("Annex III: employment, worker management or recruitment indicator");
        }
        if (Boolean.TRUE.equals(inventory.getFinanceUse())) {
            useCases.add("Annex III: access to essential private services or creditworthiness indicator");
        }
        if (Boolean.TRUE.equals(inventory.getGovernmentUse())) {
            useCases.add("Annex III: public services, law enforcement, migration or justice-administration indicator");
        }
        if (Boolean.TRUE.equals(inventory.getHealthcareUse())) {
            useCases.add("High-risk medical or healthcare workflow indicator");
        }
        if (Boolean.TRUE.equals(inventory.getChildrenUse())) {
            useCases.add("Children or minors affected; elevated fundamental-rights review indicator");
        }
        return useCases;
    }

    @Override
    public List<String> applicableObligations(AiSystemInventory inventory, RiskLevel riskLevel) {
        List<String> obligations = new ArrayList<>();
        obligations.add("Article 4: AI literacy for staff and operators involved with this AI system");
        if (Boolean.TRUE.equals(inventory.getUserFacingAiInteraction())) {
            obligations.add("Article 50: disclose that users are interacting with an AI system");
        }
        if (Boolean.TRUE.equals(inventory.getAutomatedDecisionMaking())) {
            obligations.add("Transparency and human-review language for automated decisions with significant effects");
        }
        if (hasThirdPartyDependency(inventory)) {
            obligations.add("GPAI/provider dependency file: provider documentation, model/system card, usage limits, update notices");
        }
        if (riskLevel == RiskLevel.HIGH_RISK) {
            obligations.add("High-risk AI: risk management system");
            obligations.add("High-risk AI: data governance and quality controls");
            obligations.add("High-risk AI: technical documentation and record keeping");
            obligations.add("High-risk AI: instructions for use, human oversight, accuracy, robustness and cybersecurity");
            obligations.add("High-risk AI: conformity assessment readiness before market or production release");
        }
        if (riskLevel == RiskLevel.PROHIBITED) {
            obligations.add("Immediate legal review: prohibited-practice indicator should not proceed without counsel");
        }
        return obligations;
    }

    @Override
    public List<String> transparencyNotices(AiSystemInventory inventory) {
        List<String> notices = new ArrayList<>();
        if (Boolean.TRUE.equals(inventory.getUserFacingAiInteraction())) {
            notices.add("User-facing AI interaction notice");
        }
        if (Boolean.TRUE.equals(inventory.getAutomatedDecisionMaking())) {
            notices.add("Automated decision-making notice");
        }
        return notices;
    }

    @Override
    public List<String> humanOversightGaps(AiSystemInventory inventory) {
        List<String> gaps = new ArrayList<>();
        if (!Boolean.TRUE.equals(inventory.getHumanOversight())) {
            gaps.add("Document human review and escalation workflow");
        }
        if (Boolean.TRUE.equals(inventory.getHumanOversight())
                && (inventory.getHumanOversightOwner() == null || inventory.getHumanOversightOwner().isBlank())) {
            gaps.add("Assign a named human oversight owner");
        }
        return gaps;
    }

    @Override
    public List<String> documentationGaps(AiSystemInventory inventory) {
        List<String> gaps = new ArrayList<>();
        if (!Boolean.TRUE.equals(inventory.getTechnicalDocumentationReady())) {
            gaps.add("Prepare technical documentation");
        }
        if (!Boolean.TRUE.equals(inventory.getRiskAssessmentCompleted())) {
            gaps.add("Complete risk assessment");
        }
        if (hasThirdPartyDependency(inventory) && !Boolean.TRUE.equals(inventory.getTechnicalDocumentationReady())) {
            gaps.add("Collect provider documentation for third-party or general-purpose AI dependency");
        }
        return gaps;
    }

    @Override
    public List<String> dataHandlingGaps(AiSystemInventory inventory) {
        List<String> gaps = new ArrayList<>();
        if (inventory.getDataCategoriesSentToAi() == null || inventory.getDataCategoriesSentToAi().isEmpty()) {
            gaps.add("Document data categories sent to AI");
        }
        if (!Boolean.TRUE.equals(inventory.getLogsEvidenceRetained())) {
            gaps.add("Enable evidence retention for inputs/outputs");
        }
        return gaps;
    }

    @Override
    public List<String> userDisclosureGaps(AiSystemInventory inventory) {
        List<String> gaps = new ArrayList<>();
        if (Boolean.TRUE.equals(inventory.getUserFacingAiInteraction())
                && !Boolean.TRUE.equals(inventory.getTransparencyNoticePublished())) {
            gaps.add("Publish user-facing AI transparency notice");
        }
        return gaps;
    }

    @Override
    public List<String> monitoringGaps(AiSystemInventory inventory) {
        List<String> gaps = new ArrayList<>();
        if (!Boolean.TRUE.equals(inventory.getMonitoringEnabled())) {
            gaps.add("Enable post-deployment monitoring and incident review cadence");
        }
        return gaps;
    }

    @Override
    public List<String> aiLiteracyGaps(AiSystemInventory inventory) {
        List<String> gaps = new ArrayList<>();
        if (Boolean.TRUE.equals(inventory.getEuUsersAffected())
                || Boolean.TRUE.equals(inventory.getUserFacingAiInteraction())
                || hasHighRiskDomain(inventory)
                || hasThirdPartyDependency(inventory)) {
            gaps.add("Document AI literacy training for staff who deploy, monitor, or escalate this AI system");
        }
        return gaps;
    }

    @Override
    public List<String> gpaiProviderDocumentationGaps(AiSystemInventory inventory) {
        List<String> gaps = new ArrayList<>();
        if (!hasThirdPartyDependency(inventory)) {
            return gaps;
        }
        if (!hasText(inventory.getProvider())) {
            gaps.add("Record the upstream AI/GPAI provider name and owner contact");
        }
        if (!hasText(inventory.getModelName())) {
            gaps.add("Record the model name/version and provider release channel");
        }
        if (!Boolean.TRUE.equals(inventory.getTechnicalDocumentationReady())) {
            gaps.add("Collect provider documentation: model/system card, acceptable-use limits, safety notes, data-processing terms, and update notices");
        }
        return gaps;
    }

    @Override
    public List<String> conformityAssessmentGaps(AiSystemInventory inventory, RiskLevel riskLevel) {
        if (riskLevel != RiskLevel.HIGH_RISK) {
            return new ArrayList<>();
        }
        List<String> gaps = new ArrayList<>();
        if (!Boolean.TRUE.equals(inventory.getRiskAssessmentCompleted())) {
            gaps.add("Prepare a conformity-assessment workpaper covering intended purpose, foreseeable misuse, severity, likelihood, and residual risk");
        }
        if (!Boolean.TRUE.equals(inventory.getTechnicalDocumentationReady())) {
            gaps.add("Assemble technical documentation before high-risk deployment or enterprise customer review");
        }
        if (!Boolean.TRUE.equals(inventory.getHumanOversight())) {
            gaps.add("Define human oversight, override, escalation, and stop-use controls");
        }
        if (!Boolean.TRUE.equals(inventory.getLogsEvidenceRetained())) {
            gaps.add("Retain logs needed to reconstruct system operation and support incident investigation");
        }
        if (!Boolean.TRUE.equals(inventory.getMonitoringEnabled())) {
            gaps.add("Create a post-market monitoring and change-review plan");
        }
        return gaps;
    }

    @Override
    public Map<String, String> evidenceChecklist(AiSystemInventory inventory, RiskLevel riskLevel) {
        Map<String, String> checklist = new LinkedHashMap<>();
        checklist.put("System inventory record", ready(hasText(inventory.getSystemName())
                && (hasText(inventory.getPurpose()) || hasText(inventory.getUseCase()))));
        checklist.put("Risk classification rationale", ready(!riskSignals(inventory, riskLevel).isEmpty()));
        checklist.put("Annex III category review", ready(riskLevel != RiskLevel.HIGH_RISK
                || !annexIIIUseCases(inventory).isEmpty()));
        checklist.put("Technical documentation", ready(Boolean.TRUE.equals(inventory.getTechnicalDocumentationReady())));
        checklist.put("Risk assessment", ready(Boolean.TRUE.equals(inventory.getRiskAssessmentCompleted())));
        checklist.put("Data categories documented", ready(inventory.getDataCategoriesSentToAi() != null
                && !inventory.getDataCategoriesSentToAi().isEmpty()));
        checklist.put("Human oversight workflow", ready(Boolean.TRUE.equals(inventory.getHumanOversight())
                && hasText(inventory.getHumanOversightOwner())));
        checklist.put("Transparency notice", ready(transparencyNotices(inventory).isEmpty()
                || Boolean.TRUE.equals(inventory.getTransparencyNoticePublished())));
        checklist.put("Evidence retention logs", ready(Boolean.TRUE.equals(inventory.getLogsEvidenceRetained())));
        checklist.put("Post-deployment monitoring", ready(Boolean.TRUE.equals(inventory.getMonitoringEnabled())));
        checklist.put("AI literacy training evidence", ready(aiLiteracyGaps(inventory).isEmpty()));
        checklist.put("GPAI/provider documentation", ready(gpaiProviderDocumentationGaps(inventory).isEmpty()));
        checklist.put("Conformity assessment readiness", ready(conformityAssessmentGaps(inventory, riskLevel).isEmpty()));
        return checklist;
    }

    @Override
    public List<String> evidenceItems(AiSystemInventory inventory) {
        List<String> items = new ArrayList<>();
        items.add("System inventory record: " + inventory.getSystemName());
        if (Boolean.TRUE.equals(inventory.getTechnicalDocumentationReady())) {
            items.add("Technical documentation");
        }
        if (Boolean.TRUE.equals(inventory.getRiskAssessmentCompleted())) {
            items.add("Risk assessment");
        }
        if (Boolean.TRUE.equals(inventory.getHumanOversight())) {
            items.add("Human oversight policy");
        }
        if (Boolean.TRUE.equals(inventory.getLogsEvidenceRetained())) {
            items.add("Evidence retention logs");
        }
        return items;
    }

    @Override
    public Map<String, Boolean> readinessBreakdown(AiSystemInventory inventory) {
        RiskLevel riskLevel = classifyRisk(inventory);
        List<String> documentationGaps = documentationGaps(inventory);
        List<String> humanOversightGaps = humanOversightGaps(inventory);
        List<String> monitoringGaps = monitoringGaps(inventory);
        List<String> aiLiteracyGaps = aiLiteracyGaps(inventory);
        List<String> gpaiProviderDocumentationGaps = gpaiProviderDocumentationGaps(inventory);
        List<String> conformityAssessmentGaps = conformityAssessmentGaps(inventory, riskLevel);

        Map<String, Boolean> map = new LinkedHashMap<>();
        map.put("inventoryComplete", hasText(inventory.getSystemName())
                && (hasText(inventory.getPurpose()) || hasText(inventory.getUseCase())));
        map.put("documentationReady", documentationGaps.isEmpty());
        map.put("humanOversightDefined", humanOversightGaps.isEmpty());
        map.put("transparencyNoticePublished", transparencyNotices(inventory).isEmpty()
                || Boolean.TRUE.equals(inventory.getTransparencyNoticePublished()));
        map.put("monitoringEnabled", monitoringGaps.isEmpty());
        map.put("evidenceRetained", Boolean.TRUE.equals(inventory.getLogsEvidenceRetained()));
        map.put("aiLiteracyDocumented", aiLiteracyGaps.isEmpty());
        map.put("gpaiProviderFileReady", gpaiProviderDocumentationGaps.isEmpty());
        map.put("conformityAssessmentReady", conformityAssessmentGaps.isEmpty());
        return map;
    }

    // ---- helpers -----------------------------------------------------------

    private boolean hasHighRiskDomain(AiSystemInventory inventory) {
        return Boolean.TRUE.equals(inventory.getHealthcareUse())
                || Boolean.TRUE.equals(inventory.getHiringUse())
                || Boolean.TRUE.equals(inventory.getFinanceUse())
                || Boolean.TRUE.equals(inventory.getEducationUse())
                || Boolean.TRUE.equals(inventory.getBiometricUse())
                || Boolean.TRUE.equals(inventory.getGovernmentUse())
                || Boolean.TRUE.equals(inventory.getCriticalInfrastructureUse())
                || Boolean.TRUE.equals(inventory.getChildrenUse());
    }

    private List<String> highRiskDomainSignals(AiSystemInventory inventory) {
        List<String> signals = new ArrayList<>();
        if (Boolean.TRUE.equals(inventory.getHealthcareUse())) {
            signals.add("High-risk domain: Healthcare or medical use");
        }
        if (Boolean.TRUE.equals(inventory.getHiringUse())) {
            signals.add("High-risk domain: Hiring or employment use");
        }
        if (Boolean.TRUE.equals(inventory.getFinanceUse())) {
            signals.add("High-risk domain: Finance or credit access use");
        }
        if (Boolean.TRUE.equals(inventory.getEducationUse())) {
            signals.add("High-risk domain: Education or vocational training use");
        }
        if (Boolean.TRUE.equals(inventory.getBiometricUse())) {
            signals.add("High-risk domain: Biometric identification or categorization use");
        }
        if (Boolean.TRUE.equals(inventory.getGovernmentUse())) {
            signals.add("High-risk domain: Public services or government use");
        }
        if (Boolean.TRUE.equals(inventory.getCriticalInfrastructureUse())) {
            signals.add("High-risk domain: Critical infrastructure use");
        }
        if (Boolean.TRUE.equals(inventory.getChildrenUse())) {
            signals.add("High-risk domain: Children or minors affected");
        }
        return signals;
    }

    private boolean hasThirdPartyDependency(AiSystemInventory inventory) {
        String providerType = Optional.ofNullable(inventory.getModelProviderType()).orElse("").toLowerCase();
        return providerType.contains("third-party")
                || providerType.contains("third party")
                || providerType.contains("general-purpose")
                || providerType.contains("general purpose")
                || providerType.contains("gpa");
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private String ready(boolean passed) {
        return passed ? "READY" : "GAP";
    }
}
