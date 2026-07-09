package com.zenvyra.domain.aiact;

import com.zenvyra.model.AiSystemInventory;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AiActRuleCatalogV2026_07Test {

    private final AiActRuleCatalogV2026_07 catalog = new AiActRuleCatalogV2026_07();

    @Test
    void exposesStableRulesetVersion() {
        assertEquals("EU_AI_ACT_READINESS_2026_07", catalog.version());
        assertEquals(AiActRuleCatalogV2026_07.VERSION, catalog.version());
    }

    @Test
    void classifiesRiskAcrossAllTiers() {
        AiSystemInventory prohibited = AiSystemInventory.builder().prohibitedUse(true).build();
        AiSystemInventory highRiskDomain = AiSystemInventory.builder().hiringUse(true).build();
        AiSystemInventory automatedDecision = AiSystemInventory.builder().automatedDecisionMaking(true).build();
        AiSystemInventory limited = AiSystemInventory.builder().userFacingAiInteraction(true).build();
        AiSystemInventory minimal = AiSystemInventory.builder().systemName("Internal").build();

        assertEquals(RiskLevel.PROHIBITED, catalog.classifyRisk(prohibited));
        assertEquals("prohibited risk indicator", catalog.classifyRisk(prohibited).getLabel());

        assertEquals(RiskLevel.HIGH_RISK, catalog.classifyRisk(highRiskDomain));
        assertEquals(RiskLevel.HIGH_RISK, catalog.classifyRisk(automatedDecision));
        assertEquals("high-risk indicator", catalog.classifyRisk(highRiskDomain).getLabel());

        assertEquals(RiskLevel.LIMITED_RISK, catalog.classifyRisk(limited));
        assertEquals("limited-risk transparency", catalog.classifyRisk(limited).getLabel());

        assertEquals(RiskLevel.MINIMAL_RISK, catalog.classifyRisk(minimal));
        assertEquals("minimal risk", catalog.classifyRisk(minimal).getLabel());
    }

    @Test
    void prohibitedIndicatorTakesPriorityOverOtherSignals() {
        AiSystemInventory inventory = AiSystemInventory.builder()
                .prohibitedUse(true)
                .hiringUse(true)
                .automatedDecisionMaking(true)
                .build();

        assertEquals(RiskLevel.PROHIBITED, catalog.classifyRisk(inventory));
        assertTrue(catalog.riskSignals(inventory, RiskLevel.PROHIBITED)
                .contains("Prohibited-use indicator requires immediate legal review"));
    }

    @Test
    void annexIIIUseCasesCoverEveryHighRiskDomain() {
        AiSystemInventory inventory = AiSystemInventory.builder()
                .biometricUse(true)
                .criticalInfrastructureUse(true)
                .educationUse(true)
                .hiringUse(true)
                .financeUse(true)
                .governmentUse(true)
                .healthcareUse(true)
                .childrenUse(true)
                .build();

        List<String> cases = catalog.annexIIIUseCases(inventory);
        assertTrue(cases.contains("Annex III: biometric identification or categorisation indicator"));
        assertTrue(cases.contains("Annex III: critical infrastructure safety indicator"));
        assertTrue(cases.contains("Annex III: education or vocational training indicator"));
        assertTrue(cases.contains("Annex III: employment, worker management or recruitment indicator"));
        assertTrue(cases.contains("Annex III: access to essential private services or creditworthiness indicator"));
        assertTrue(cases.contains("Annex III: public services, law enforcement, migration or justice-administration indicator"));
        assertTrue(cases.contains("High-risk medical or healthcare workflow indicator"));
        assertTrue(cases.contains("Children or minors affected; elevated fundamental-rights review indicator"));
        assertEquals(8, cases.size());
    }

    @Test
    void annexIIIUseCasesEmptyWhenNoHighRiskDomain() {
        AiSystemInventory inventory = AiSystemInventory.builder()
                .systemName("Internal helper")
                .userFacingAiInteraction(true)
                .build();
        assertTrue(catalog.annexIIIUseCases(inventory).isEmpty());
    }

    @Test
    void applicableObligationsAlwaysIncludeArticle4AndScaleWithRisk() {
        AiSystemInventory minimal = AiSystemInventory.builder().systemName("Internal").build();
        AiSystemInventory limited = AiSystemInventory.builder().userFacingAiInteraction(true).build();
        AiSystemInventory highRisk = AiSystemInventory.builder()
                .hiringUse(true)
                .automatedDecisionMaking(true)
                .build();
        AiSystemInventory prohibited = AiSystemInventory.builder()
                .prohibitedUse(true)
                .hiringUse(true)
                .build();

        assertTrue(catalog.applicableObligations(minimal, RiskLevel.MINIMAL_RISK)
                .contains("Article 4: AI literacy for staff and operators involved with this AI system"));

        List<String> limitedObligations = catalog.applicableObligations(limited, RiskLevel.LIMITED_RISK);
        assertTrue(limitedObligations.contains("Article 50: disclose that users are interacting with an AI system"));
        assertFalse(limitedObligations.contains("High-risk AI: risk management system"));

        List<String> highRiskObligations = catalog.applicableObligations(highRisk, RiskLevel.HIGH_RISK);
        assertTrue(highRiskObligations.contains("High-risk AI: risk management system"));
        assertTrue(highRiskObligations.contains("High-risk AI: data governance and quality controls"));
        assertTrue(highRiskObligations.contains("High-risk AI: technical documentation and record keeping"));
        assertTrue(highRiskObligations.contains("High-risk AI: instructions for use, human oversight, accuracy, robustness and cybersecurity"));
        assertTrue(highRiskObligations.contains("High-risk AI: conformity assessment readiness before market or production release"));

        assertTrue(catalog.applicableObligations(prohibited, RiskLevel.PROHIBITED)
                .contains("Immediate legal review: prohibited-practice indicator should not proceed without counsel"));
    }

    @Test
    void thirdPartyProviderTriggersProviderObligationAndGaps() {
        AiSystemInventory inventory = AiSystemInventory.builder()
                .systemName("Provider-backed system")
                .modelProviderType("third-party provider")
                .provider("OpenAI")
                .modelName("gpt-x")
                .technicalDocumentationReady(true)
                .build();

        assertTrue(catalog.applicableObligations(inventory, RiskLevel.MINIMAL_RISK)
                .contains("GPAI/provider dependency file: provider documentation, model/system card, usage limits, update notices"));
        assertTrue(catalog.riskSignals(inventory, RiskLevel.MINIMAL_RISK)
                .contains("Provider documentation needed for third-party or general-purpose AI dependency"));
        assertTrue(catalog.gpaiProviderDocumentationGaps(inventory)
                .isEmpty(),
                "All GPAI fields supplied: there should be no GPAI documentation gaps.");
    }

    @Test
    void thirdPartyProviderMissingModelNameAddsDocumentationGap() {
        AiSystemInventory inventory = AiSystemInventory.builder()
                .systemName("Provider-backed system")
                .modelProviderType("general-purpose AI")
                .provider("OpenAI")
                .technicalDocumentationReady(false)
                .build();

        List<String> gaps = catalog.gpaiProviderDocumentationGaps(inventory);
        assertTrue(gaps.contains("Record the model name/version and provider release channel"));
        assertTrue(gaps.contains("Collect provider documentation: model/system card, acceptable-use limits, safety notes, data-processing terms, and update notices"));
    }

    @Test
    void highRiskConformityGapsAreSuppressedForNonHighRiskSystems() {
        AiSystemInventory inventory = AiSystemInventory.builder()
                .systemName("Chatbot")
                .userFacingAiInteraction(true)
                .monitoringEnabled(false)
                .humanOversight(false)
                .build();

        assertTrue(catalog.conformityAssessmentGaps(inventory, RiskLevel.LIMITED_RISK).isEmpty());
        assertTrue(catalog.conformityAssessmentGaps(inventory, RiskLevel.MINIMAL_RISK).isEmpty());
    }

    @Test
    void highRiskConformityGapsAggregateAllMissingControls() {
        AiSystemInventory inventory = AiSystemInventory.builder()
                .systemName("Hiring system")
                .hiringUse(true)
                .riskAssessmentCompleted(false)
                .technicalDocumentationReady(false)
                .humanOversight(false)
                .logsEvidenceRetained(false)
                .monitoringEnabled(false)
                .build();

        List<String> gaps = catalog.conformityAssessmentGaps(inventory, RiskLevel.HIGH_RISK);
        assertEquals(5, gaps.size());
        assertTrue(gaps.contains("Prepare a conformity-assessment workpaper covering intended purpose, foreseeable misuse, severity, likelihood, and residual risk"));
        assertTrue(gaps.contains("Assemble technical documentation before high-risk deployment or enterprise customer review"));
        assertTrue(gaps.contains("Define human oversight, override, escalation, and stop-use controls"));
        assertTrue(gaps.contains("Retain logs needed to reconstruct system operation and support incident investigation"));
        assertTrue(gaps.contains("Create a post-market monitoring and change-review plan"));
    }

    @Test
    void readinessBreakdownIsCompleteForMinimalInternalSystem() {
        AiSystemInventory inventory = AiSystemInventory.builder()
                .systemName("Internal helper")
                .purpose("Support")
                .humanOversight(true)
                .humanOversightOwner("Ops lead")
                .technicalDocumentationReady(true)
                .riskAssessmentCompleted(true)
                .logsEvidenceRetained(true)
                .monitoringEnabled(true)
                .dataCategoriesSentToAi(List.of("ops metrics"))
                .build();

        Map<String, Boolean> breakdown = catalog.readinessBreakdown(inventory);
        assertEquals(9, breakdown.size());
        assertTrue(breakdown.get("inventoryComplete"));
        assertTrue(breakdown.get("documentationReady"));
        assertTrue(breakdown.get("humanOversightDefined"));
        assertTrue(breakdown.get("transparencyNoticePublished"));
        assertTrue(breakdown.get("monitoringEnabled"));
        assertTrue(breakdown.get("evidenceRetained"));
        assertTrue(breakdown.get("aiLiteracyDocumented"));
        assertTrue(breakdown.get("gpaiProviderFileReady"));
        assertTrue(breakdown.get("conformityAssessmentReady"));
    }

    @Test
    void readinessBreakdownIsFullyFalseForNonCompliantHighRiskSystem() {
        AiSystemInventory inventory = AiSystemInventory.builder()
                .systemName("High risk system")
                .hiringUse(true)
                .automatedDecisionMaking(true)
                .userFacingAiInteraction(true)
                .euUsersAffected(true)
                .modelProviderType("third-party")
                .build();

        Map<String, Boolean> breakdown = catalog.readinessBreakdown(inventory);
        assertFalse(breakdown.get("documentationReady"));
        assertFalse(breakdown.get("humanOversightDefined"));
        assertFalse(breakdown.get("transparencyNoticePublished"));
        assertFalse(breakdown.get("monitoringEnabled"));
        assertFalse(breakdown.get("evidenceRetained"));
        assertFalse(breakdown.get("aiLiteracyDocumented"));
        assertFalse(breakdown.get("gpaiProviderFileReady"));
        assertFalse(breakdown.get("conformityAssessmentReady"));
    }

    @Test
    void evidenceChecklistMarksReadyWhenInventoryIsComplete() {
        AiSystemInventory inventory = AiSystemInventory.builder()
                .systemName("Internal helper")
                .purpose("Operations")
                .humanOversight(true)
                .humanOversightOwner("Ops lead")
                .technicalDocumentationReady(true)
                .riskAssessmentCompleted(true)
                .logsEvidenceRetained(true)
                .monitoringEnabled(true)
                .dataCategoriesSentToAi(List.of("ops"))
                .build();

        Map<String, String> checklist = catalog.evidenceChecklist(inventory, RiskLevel.MINIMAL_RISK);
        assertEquals("READY", checklist.get("System inventory record"));
        assertEquals("READY", checklist.get("Risk classification rationale"));
        assertEquals("READY", checklist.get("Technical documentation"));
        assertEquals("READY", checklist.get("Risk assessment"));
        assertEquals("READY", checklist.get("Data categories documented"));
        assertEquals("READY", checklist.get("Human oversight workflow"));
        assertEquals("READY", checklist.get("Evidence retention logs"));
        assertEquals("READY", checklist.get("Post-deployment monitoring"));
    }

    @Test
    void evidenceChecklistFlagsAiLiteracyGapForEuSystem() {
        AiSystemInventory inventory = AiSystemInventory.builder()
                .systemName("Internal helper")
                .purpose("Operations")
                .euUsersAffected(true)
                .humanOversight(true)
                .humanOversightOwner("Ops lead")
                .technicalDocumentationReady(true)
                .riskAssessmentCompleted(true)
                .logsEvidenceRetained(true)
                .monitoringEnabled(true)
                .dataCategoriesSentToAi(List.of("ops"))
                .build();

        Map<String, String> checklist = catalog.evidenceChecklist(inventory, RiskLevel.MINIMAL_RISK);
        assertEquals("GAP", checklist.get("AI literacy training evidence"));
    }

    @Test
    void evidenceItemsOnlyIncludeProvidedEvidence() {
        AiSystemInventory inventory = AiSystemInventory.builder()
                .systemName("Internal helper")
                .humanOversight(true)
                .logsEvidenceRetained(true)
                .build();

        List<String> items = catalog.evidenceItems(inventory);
        assertTrue(items.contains("System inventory record: Internal helper"));
        assertTrue(items.contains("Human oversight policy"));
        assertTrue(items.contains("Evidence retention logs"));
        assertFalse(items.contains("Technical documentation"));
        assertFalse(items.contains("Risk assessment"));
    }

    @Test
    void riskSignalsFallBackToNoSignalsMessageWhenEmpty() {
        AiSystemInventory inventory = AiSystemInventory.builder()
                .systemName("Quiet system")
                .build();

        List<String> signals = catalog.riskSignals(inventory, RiskLevel.MINIMAL_RISK);
        assertEquals(List.of("No strong risk signals detected"), signals);
    }

    @Test
    void transparencyNoticesReflectInventory() {
        AiSystemInventory chatbot = AiSystemInventory.builder()
                .userFacingAiInteraction(true)
                .automatedDecisionMaking(true)
                .build();
        AiSystemInventory adOnly = AiSystemInventory.builder()
                .automatedDecisionMaking(true)
                .build();
        AiSystemInventory invisible = AiSystemInventory.builder().build();

        assertEquals(List.of("User-facing AI interaction notice", "Automated decision-making notice"),
                catalog.transparencyNotices(chatbot));
        assertEquals(List.of("Automated decision-making notice"), catalog.transparencyNotices(adOnly));
        assertTrue(catalog.transparencyNotices(invisible).isEmpty());
    }

    @Test
    void humanOversightGapsCoverMissingWorkflowAndOwner() {
        AiSystemInventory noWorkflow = AiSystemInventory.builder().humanOversight(false).build();
        AiSystemInventory unownedWorkflow = AiSystemInventory.builder().humanOversight(true).build();
        AiSystemInventory ownedWorkflow = AiSystemInventory.builder()
                .humanOversight(true)
                .humanOversightOwner("Lead")
                .build();

        assertEquals(List.of("Document human review and escalation workflow"),
                catalog.humanOversightGaps(noWorkflow));
        assertEquals(List.of("Assign a named human oversight owner"),
                catalog.humanOversightGaps(unownedWorkflow));
        assertTrue(catalog.humanOversightGaps(ownedWorkflow).isEmpty());
    }

    @Test
    void aiLiteracyGapOnlyAppearsWhenEUOrHighRiskTriggersApply() {
        AiSystemInventory safe = AiSystemInventory.builder().systemName("Internal").build();
        AiSystemInventory eu = AiSystemInventory.builder().systemName("EU").euUsersAffected(true).build();
        AiSystemInventory gpai = AiSystemInventory.builder()
                .systemName("Provider")
                .modelProviderType("gpa")
                .build();

        assertTrue(catalog.aiLiteracyGaps(safe).isEmpty());
        assertTrue(catalog.aiLiteracyGaps(eu)
                .contains("Document AI literacy training for staff who deploy, monitor, or escalate this AI system"));
        assertTrue(catalog.aiLiteracyGaps(gpai)
                .contains("Document AI literacy training for staff who deploy, monitor, or escalate this AI system"));
    }

    @Test
    void userDisclosureGapRequiresBothUserFacingAndMissingNotice() {
        AiSystemInventory needsNotice = AiSystemInventory.builder()
                .userFacingAiInteraction(true)
                .transparencyNoticePublished(false)
                .build();
        AiSystemInventory alreadyPublished = AiSystemInventory.builder()
                .userFacingAiInteraction(true)
                .transparencyNoticePublished(true)
                .build();
        AiSystemInventory notUserFacing = AiSystemInventory.builder()
                .transparencyNoticePublished(false)
                .build();

        assertFalse(catalog.userDisclosureGaps(needsNotice).isEmpty());
        assertTrue(catalog.userDisclosureGaps(alreadyPublished).isEmpty());
        assertTrue(catalog.userDisclosureGaps(notUserFacing).isEmpty());
    }

    @Test
    void documentationGapsIncludeProviderGapWhenThirdPartyLacksDocs() {
        AiSystemInventory inventory = AiSystemInventory.builder()
                .modelProviderType("third-party")
                .technicalDocumentationReady(false)
                .riskAssessmentCompleted(false)
                .build();

        List<String> gaps = catalog.documentationGaps(inventory);
        assertTrue(gaps.contains("Prepare technical documentation"));
        assertTrue(gaps.contains("Complete risk assessment"));
        assertTrue(gaps.contains("Collect provider documentation for third-party or general-purpose AI dependency"));
    }

    @Test
    void dataHandlingGapsCoverMissingCategoriesAndLogs() {
        AiSystemInventory inventory = AiSystemInventory.builder()
                .dataCategoriesSentToAi(List.of())
                .logsEvidenceRetained(false)
                .build();
        List<String> gaps = catalog.dataHandlingGaps(inventory);
        assertEquals(2, gaps.size());
        assertTrue(gaps.contains("Document data categories sent to AI"));
        assertTrue(gaps.contains("Enable evidence retention for inputs/outputs"));
    }

    @Test
    void monitoringGapAppearsWhenMonitoringIsDisabled() {
        AiSystemInventory off = AiSystemInventory.builder().monitoringEnabled(false).build();
        AiSystemInventory on = AiSystemInventory.builder().monitoringEnabled(true).build();
        assertEquals(List.of("Enable post-deployment monitoring and incident review cadence"),
                catalog.monitoringGaps(off));
        assertTrue(catalog.monitoringGaps(on).isEmpty());
    }

    @Test
    void factoryCurrentReturnsTheCatalogAndRejectsUnknownVersions() {
        AiActRuleCatalogV2026_07 catalog = new AiActRuleCatalogV2026_07();
        AiActRuleCatalogFactory factory = new AiActRuleCatalogFactory(catalog);

        assertSame(catalog, factory.current());

        AiActRuleCatalog resolved = factory.get(AiActRuleCatalogV2026_07.VERSION);
        assertSame(catalog, resolved);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> factory.get("UNKNOWN_VERSION"));
        assertTrue(ex.getMessage().contains("UNKNOWN_VERSION"));
    }

    @Test
    void riskClassificationRationaleExplainsEachRiskLevel() {
        AiSystemInventory prohibited = AiSystemInventory.builder().systemName("Bad").prohibitedUse(true).build();
        AiSystemInventory highRisk = AiSystemInventory.builder().systemName("HR").automatedDecisionMaking(true).build();
        AiSystemInventory limited = AiSystemInventory.builder().systemName("Chat").userFacingAiInteraction(true).build();
        AiSystemInventory minimal = AiSystemInventory.builder().systemName("Internal").build();

        assertTrue(catalog.riskClassificationRationale(prohibited, RiskLevel.PROHIBITED).contains("prohibited practice"));
        assertTrue(catalog.riskClassificationRationale(highRisk, RiskLevel.HIGH_RISK).contains("automated decision-making"));
        assertTrue(catalog.riskClassificationRationale(limited, RiskLevel.LIMITED_RISK).contains("Transparency obligations apply"));
        assertTrue(catalog.riskClassificationRationale(minimal, RiskLevel.MINIMAL_RISK).contains("no prohibited practice, high-risk domain"));
    }

    @Test
    void confidenceExplanationMentionsSelfReportedAnswersAndCounsel() {
        AiSystemInventory inventory = AiSystemInventory.builder().systemName("Any").build();
        String explanation = catalog.confidenceExplanation(inventory, RiskLevel.MINIMAL_RISK);
        assertTrue(explanation.contains("self-reported inventory answers"));
        assertTrue(explanation.contains("Counsel"));
    }

    @Test
    void riskLevelExplanationMatchesEachRiskLevel() {
        AiSystemInventory inventory = AiSystemInventory.builder().systemName("Any").build();
        assertTrue(catalog.riskLevelExplanation(inventory, RiskLevel.PROHIBITED).contains("Stop development"));
        assertTrue(catalog.riskLevelExplanation(inventory, RiskLevel.HIGH_RISK).contains("high-risk AI system"));
        assertTrue(catalog.riskLevelExplanation(inventory, RiskLevel.LIMITED_RISK).contains("transparency"));
        assertTrue(catalog.riskLevelExplanation(inventory, RiskLevel.MINIMAL_RISK).contains("No major EU AI Act trigger"));
    }
}
