package com.zenvyra.domain.aiact;

import com.zenvyra.model.AiSystemInventory;

import java.util.List;
import java.util.Map;

/**
 * Versioned rule catalog that owns the AI Act classification, obligation, gap,
 * evidence, and readiness logic previously embedded in {@code AiActReadinessService}.
 *
 * <p>Implementations are resolved by {@link AiActRuleCatalogFactory}. The catalog
 * is purely a stateless evaluator: orchestration, persistence, and response
 * mapping remain in the service layer.
 */
public interface AiActRuleCatalog {

    /**
     * @return the ruleset version string stamped on every {@code AiActAssessment}.
     */
    String version();

    /**
     * @return the highest applicable risk level for the supplied inventory.
     */
    RiskLevel classifyRisk(AiSystemInventory inventory);

    /**
     * @return short bullet-point signals explaining why the inventory was classified
     *         into the supplied {@code riskLevel}.
     */
    List<String> riskSignals(AiSystemInventory inventory, RiskLevel riskLevel);

    /**
     * @return Annex III categories that apply to the inventory.
     */
    List<String> annexIIIUseCases(AiSystemInventory inventory);

    /**
     * @return obligations triggered by the inventory and its risk level.
     */
    List<String> applicableObligations(AiSystemInventory inventory, RiskLevel riskLevel);

    /**
     * @return transparency notice keys the inventory must publish.
     */
    List<String> transparencyNotices(AiSystemInventory inventory);

    /**
     * @return outstanding human-oversight gaps.
     */
    List<String> humanOversightGaps(AiSystemInventory inventory);

    /**
     * @return outstanding documentation gaps.
     */
    List<String> documentationGaps(AiSystemInventory inventory);

    /**
     * @return outstanding data-handling gaps.
     */
    List<String> dataHandlingGaps(AiSystemInventory inventory);

    /**
     * @return outstanding user-disclosure gaps.
     */
    List<String> userDisclosureGaps(AiSystemInventory inventory);

    /**
     * @return outstanding post-deployment monitoring gaps.
     */
    List<String> monitoringGaps(AiSystemInventory inventory);

    /**
     * @return outstanding AI-literacy gaps.
     */
    List<String> aiLiteracyGaps(AiSystemInventory inventory);

    /**
     * @return outstanding GPAI / third-party provider documentation gaps.
     */
    List<String> gpaiProviderDocumentationGaps(AiSystemInventory inventory);

    /**
     * @return outstanding high-risk conformity assessment gaps.
     */
    List<String> conformityAssessmentGaps(AiSystemInventory inventory, RiskLevel riskLevel);

    /**
     * @return a checklist of evidence items mapped to a {@code "READY"} / {@code "GAP"} status.
     */
    Map<String, String> evidenceChecklist(AiSystemInventory inventory, RiskLevel riskLevel);

    /**
     * @return short labels describing evidence that has already been provided.
     */
    List<String> evidenceItems(AiSystemInventory inventory);

    /**
     * @return per-dimension readiness booleans used to compute the readiness score.
     */
    Map<String, Boolean> readinessBreakdown(AiSystemInventory inventory);
}
