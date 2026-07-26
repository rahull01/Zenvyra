package com.zenvyra.service;

import com.zenvyra.dto.response.AiActAuditLogResponse;
import com.zenvyra.dto.response.EvidenceItemResponse;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.AiActAssessment;
import com.zenvyra.model.AiSystemInventory;
import com.zenvyra.model.CounselReviewStatus;
import com.zenvyra.model.EvidenceItemStatus;
import com.zenvyra.model.ReleaseStatus;
import com.zenvyra.model.User;
import com.zenvyra.repository.AiActAssessmentRepository;
import com.zenvyra.repository.AiSystemInventoryRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.util.LogSanitizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiActExportService {

    private static final float PDF_MARGIN = 54f;
    private static final float PDF_FONT_SIZE = 10f;
    private static final float PDF_HEADING_FONT_SIZE = 12f;
    private static final float PDF_LINE_HEIGHT = 14f;

    private final UserRepository userRepository;
    private final AiSystemInventoryRepository systemRepository;
    private final AiActAssessmentRepository assessmentRepository;
    private final EvidenceItemService evidenceItemService;
    private final AiActAuditService auditService;
    private final EmailService emailService;

    @Value("${app.url:http://localhost:3000}")
    private String appUrl;

    public String exportTransparencyNotice(UserDetails userDetails, String systemId) {
        AiSystemInventory system = loadOwnedSystem(userDetails, systemId);
        StringBuilder sb = new StringBuilder();
        sb.append("# AI Transparency Notice\n\n");
        sb.append("**System:** ").append(system.getSystemName()).append("\n\n");
        sb.append("**Purpose:** ").append(Optional.ofNullable(system.getPurpose()).orElse("Not specified")).append("\n\n");
        sb.append("**Provider:** ").append(Optional.ofNullable(system.getProvider()).orElse("Not specified")).append("\n\n");
        sb.append("**Last updated:** ").append(DateTimeFormatter.ISO_LOCAL_DATE.format(LocalDateTime.now())).append("\n\n");

        sb.append("## How we use AI\n\n");
        sb.append("This system uses artificial intelligence to support the following use case: ")
                .append(Optional.ofNullable(system.getUseCase()).orElse("general business operations"))
                .append(".\n\n");
        if (Boolean.TRUE.equals(system.getUserFacingAiInteraction())) {
            sb.append("You may interact directly with AI-generated content or outputs through this system.\n\n");
        }
        if (Boolean.TRUE.equals(system.getAutomatedDecisionMaking())) {
            sb.append("This system may make automated decisions that produce legal or similarly significant effects. ");
        }
        sb.append("You have the right to request human review, express your point of view, and contest any decision made or supported by this system. ")
                .append("To request a human review, contact the human oversight owner listed below.\n\n");

        sb.append("## Data categories processed by AI\n\n");
        if (system.getDataCategoriesSentToAi() != null && !system.getDataCategoriesSentToAi().isEmpty()) {
            for (String category : system.getDataCategoriesSentToAi()) {
                sb.append("- ").append(category).append("\n");
            }
        } else {
            sb.append("- No data categories have been recorded for this system.\n");
        }
        sb.append("\n");

        sb.append("## EU exposure\n\n");
        sb.append("**EU users affected:** ").append(bool(system.getEuUsersAffected())).append("\n\n");
        if (system.getCountries() != null && !system.getCountries().isEmpty()) {
            sb.append("**Countries where this system operates:** ")
                    .append(String.join(", ", system.getCountries())).append("\n\n");
        }

        sb.append("## Your rights\n\n");
        sb.append("Depending on your location, you may have rights to access, correct, restrict, or object to the processing of your personal data by AI systems.\n\n");

        sb.append("## Contact / human oversight owner\n\n");
        sb.append("For questions about this AI system, to request human review of an automated decision, or to exercise your rights, contact: ")
                .append(Optional.ofNullable(system.getHumanOversightOwner()).orElse("[not assigned]"))
                .append(".\n\n");

        sb.append("---\n\n");
        sb.append("*Disclaimer: This notice is generated for operational transparency. It is not legal advice and is not a substitute for obtaining counsel on EU AI Act, GDPR, or other regulatory obligations.*");
        return sb.toString();
    }

    public String exportSystemCard(UserDetails userDetails, String systemId) {
        AiSystemInventory system = loadOwnedSystem(userDetails, systemId);
        AiActAssessment latestAssessment = latestAssessmentForSystem(systemId).orElse(null);
        StringBuilder sb = new StringBuilder();
        sb.append("# AI System Card: ").append(system.getSystemName()).append("\n\n");
        sb.append("| Field | Value |\n");
        sb.append("| --- | --- |\n");
        sb.append("| **System name** | ").append(system.getSystemName()).append(" |\n");
        sb.append("| **Purpose** | ").append(value(system.getPurpose())).append(" |\n");
        sb.append("| **Use case** | ").append(value(system.getUseCase())).append(" |\n");
        sb.append("| **Provider** | ").append(value(system.getProvider())).append(" |\n");
        sb.append("| **Model** | ").append(value(system.getModelName())).append(" |\n");
        sb.append("| **Model provider type** | ").append(value(system.getModelProviderType())).append(" |\n");
        sb.append("| **Model provider version** | ").append(value(system.getModelProviderVersion())).append(" |\n");
        sb.append("| **Deployment context** | ").append(value(system.getDeploymentContext())).append(" |\n");
        sb.append("| **Customer-facing** | ").append(bool(system.getCustomerFacing())).append(" |\n");
        sb.append("| **Decision impact level** | ").append(value(system.getDecisionImpactLevel())).append(" |\n");
        sb.append("| **Release status** | ").append(value(system.getReleaseStatus() != null ? system.getReleaseStatus().name() : null)).append(" |\n");
        sb.append("| **Training / fine-tuning** | ").append(bool(system.getTrainingOrFineTuning())).append(" |\n");
        sb.append("| **EU users affected** | ").append(bool(system.getEuUsersAffected())).append(" |\n");
        sb.append("| **User-facing AI** | ").append(bool(system.getUserFacingAiInteraction())).append(" |\n");
        sb.append("| **Automated decision-making** | ").append(bool(system.getAutomatedDecisionMaking())).append(" |\n");
        sb.append("| **Human oversight** | ").append(bool(system.getHumanOversight())).append(" |\n");
        sb.append("| **Oversight owner** | ").append(value(system.getHumanOversightOwner())).append(" |\n");
        sb.append("| **Transparency notice published** | ").append(bool(system.getTransparencyNoticePublished())).append(" |\n");
        sb.append("| **Technical documentation ready** | ").append(bool(system.getTechnicalDocumentationReady())).append(" |\n");
        sb.append("| **Risk assessment completed** | ").append(bool(system.getRiskAssessmentCompleted())).append(" |\n");
        sb.append("| **Evidence retained** | ").append(bool(system.getLogsEvidenceRetained())).append(" |\n");
        sb.append("| **Monitoring enabled** | ").append(bool(system.getMonitoringEnabled())).append(" |\n");
        sb.append("| **Last reviewed at** | ").append(formatDateTime(system.getLastReviewedAt())).append(" |\n");
        sb.append("| **Next review at** | ").append(formatDateTime(system.getNextReviewAt())).append(" |\n");
        sb.append("| **High-risk domain flags** | ").append(highRiskFlags(system)).append(" |\n");
        if (system.getCountries() != null && !system.getCountries().isEmpty()) {
            sb.append("| **Countries** | ").append(String.join(", ", system.getCountries())).append(" |\n");
        }
        if (system.getDataCategoriesSentToAi() != null && !system.getDataCategoriesSentToAi().isEmpty()) {
            sb.append("| **Data categories sent to AI** | ")
                    .append(String.join(", ", system.getDataCategoriesSentToAi())).append(" |\n");
        }
        sb.append("| **Created at** | ").append(formatDateTime(system.getCreatedAt())).append(" |\n");
        sb.append("| **Updated at** | ").append(formatDateTime(system.getUpdatedAt())).append(" |\n");
        if (latestAssessment != null) {
            sb.append("| **Latest AI Act risk category** | ").append(value(latestAssessment.getRiskCategory())).append(" |\n");
            sb.append("| **Latest readiness score** | ")
                    .append(latestAssessment.getReadinessScore() != null ? latestAssessment.getReadinessScore() + "/100" : "Not scored")
                    .append(" |\n");
            sb.append("| **Ruleset version** | ").append(value(latestAssessment.getRulesetVersion())).append(" |\n");
        }
        sb.append("| **Generated at** | ").append(DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(LocalDateTime.now())).append(" |\n\n");
        sb.append("---\n\n");
        sb.append("*Generated for operational use. This system card is an operational record, not a legal conformity declaration.*");
        return sb.toString();
    }

    public String exportAssessmentSummary(UserDetails userDetails, String assessmentId) {
        User user = resolveUser(userDetails);
        AiActAssessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> ApiException.notFound("Assessment"));
        if (!user.getId().equals(assessment.getUserId())) {
            throw ApiException.forbidden("Access denied");
        }
        AiSystemInventory system = systemRepository.findById(assessment.getSystemId()).orElse(null);

        StringBuilder sb = new StringBuilder();
        sb.append("# EU AI Act Assessment Summary\n\n");
        sb.append("**System:** ").append(system != null ? system.getSystemName() : assessment.getSystemId()).append("\n\n");
        sb.append("**Risk category:** ").append(value(assessment.getRiskCategory())).append("\n\n");
        sb.append("**Readiness score:** ").append(assessment.getReadinessScore() != null ? assessment.getReadinessScore() + "/100" : "Not scored").append("\n\n");
        sb.append("**Ruleset version:** ").append(value(assessment.getRulesetVersion())).append("\n\n");
        sb.append("**Confidence:** ").append(assessment.getConfidence() != null ? assessment.getConfidence() : "Not recorded").append("\n\n");
        sb.append("**Assessed at:** ").append(assessment.getAssessedAt() != null
                ? DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(assessment.getAssessedAt())
                : "Not recorded").append("\n\n");

        sb.append("## Risk classification rationale\n\n");
        sb.append(Optional.ofNullable(assessment.getRiskClassificationRationale())
                .filter(r -> !r.isBlank())
                .orElse("No rationale recorded for this assessment."))
                .append("\n\n");

        sb.append("## Risk level explanation\n\n");
        sb.append(Optional.ofNullable(assessment.getRiskLevelExplanation())
                .filter(r -> !r.isBlank())
                .orElse("No risk level explanation recorded for this assessment."))
                .append("\n\n");

        sb.append("## Confidence explanation\n\n");
        sb.append(Optional.ofNullable(assessment.getConfidenceExplanation())
                .filter(r -> !r.isBlank())
                .orElse("No confidence explanation recorded for this assessment."))
                .append("\n\n");

        sb.append("## Version / ruleset / date\n\n");
        sb.append("- **Ruleset version:** ").append(value(assessment.getRulesetVersion())).append("\n");
        sb.append("- **Assessed at:** ").append(assessment.getAssessedAt() != null
                ? DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(assessment.getAssessedAt())
                : "Not recorded").append("\n\n");

        sb.append("## Risk signals\n\n");
        appendList(sb, assessment.getRiskSignals(), "No risk signals recorded.");

        sb.append("## Annex III / elevated-risk mapping\n\n");
        appendList(sb, assessment.getAnnexIIIUseCases(), "No Annex III indicator recorded.");

        sb.append("## Applicable obligations\n\n");
        appendList(sb, assessment.getApplicableObligations(), "No specific obligations recorded.");

        sb.append("## Required transparency notices\n\n");
        appendList(sb, assessment.getRequiredTransparencyNotices(), "None identified.");

        sb.append("## Evidence checklist\n\n");
        appendEvidenceChecklist(sb, assessment.getEvidenceChecklist());

        sb.append("## Gaps\n\n");
        boolean hasGaps = false;
        hasGaps |= appendGapList(sb, "Documentation", assessment.getDocumentationGaps());
        hasGaps |= appendGapList(sb, "Human oversight", assessment.getHumanOversightGaps());
        hasGaps |= appendGapList(sb, "Data handling", assessment.getDataHandlingGaps());
        hasGaps |= appendGapList(sb, "User disclosure", assessment.getUserDisclosureGaps());
        hasGaps |= appendGapList(sb, "Monitoring", assessment.getMonitoringGaps());
        hasGaps |= appendGapList(sb, "AI literacy", assessment.getAiLiteracyGaps());
        hasGaps |= appendGapList(sb, "GPAI/provider documentation", assessment.getGpaiProviderDocumentationGaps());
        hasGaps |= appendGapList(sb, "Conformity assessment", assessment.getConformityAssessmentGaps());
        if (!hasGaps) {
            sb.append("No gaps identified.\n\n");
        }

        sb.append("## Evidence items\n\n");
        appendList(sb, assessment.getEvidenceItems(), "No evidence items recorded.");

        sb.append("## Next actions\n\n");
        appendList(sb, assessment.getNextActions(), "Maintain monitoring and periodic reassessment.");

        sb.append("---\n\n");
        sb.append("*").append(Optional.ofNullable(assessment.getCounselReviewWarning())
                .filter(w -> !w.isBlank())
                .orElse("This assessment is an operational indicator, not legal advice.")
        ).append("*");
        return sb.toString();
    }

    public String exportEvidenceChecklist(UserDetails userDetails, String systemId) {
        AiSystemInventory system = loadOwnedSystem(userDetails, systemId);
        Optional<AiActAssessment> latestAssessment = latestAssessmentForSystem(systemId);
        List<EvidenceItemResponse> evidenceItems = safeFindEvidence(userDetails, systemId);
        boolean hasAssessmentChecklist = latestAssessment.isPresent()
                && latestAssessment.get().getEvidenceChecklist() != null
                && !latestAssessment.get().getEvidenceChecklist().isEmpty();

        StringBuilder sb = new StringBuilder();
        sb.append("# AI Act Evidence Checklist: ").append(system.getSystemName()).append("\n\n");
        latestAssessment.ifPresent(assessment -> {
            sb.append("**Risk category:** ").append(value(assessment.getRiskCategory())).append("\n\n");
            sb.append("**Ruleset version:** ").append(value(assessment.getRulesetVersion())).append("\n\n");
        });

        if (hasAssessmentChecklist || !evidenceItems.isEmpty()) {
            sb.append("| # | Requirement / Title | Type | Status | Owner | Due date | File URL | Counsel review |\n");
            sb.append("| --- | --- | --- | --- | --- | --- | --- | --- |\n");
            int rowNumber = 1;
            if (hasAssessmentChecklist) {
                Map<String, String> checklist = new LinkedHashMap<>(latestAssessment.get().getEvidenceChecklist());
                for (Map.Entry<String, String> entry : checklist.entrySet()) {
                    sb.append(checklistRow(rowNumber++,
                            entry.getKey(),
                            "Assessment",
                            entry.getValue(),
                            null,
                            null,
                            null,
                            null));
                }
            }
            for (EvidenceItemResponse item : evidenceItems) {
                sb.append(checklistRow(rowNumber++,
                        item.getTitle(),
                        item.getType() != null ? item.getType().name() : "EVIDENCE",
                        item.getStatus() != null ? item.getStatus().name() : "MISSING",
                        item.getOwner(),
                        item.getDueDate(),
                        item.getFileUrl(),
                        item.getCounselReviewStatus()));
            }
        } else {
            sb.append("| # | Requirement | Status | Evidence |\n");
            sb.append("| --- | --- | --- | --- |\n");
            sb.append(checklistRow(1, "System inventory record", true, "Inventory entry"));
            sb.append(checklistRow(2, "Technical documentation", Boolean.TRUE.equals(system.getTechnicalDocumentationReady()), "Technical docs / system design"));
            sb.append(checklistRow(3, "Risk assessment", Boolean.TRUE.equals(system.getRiskAssessmentCompleted()), "Risk assessment report"));
            sb.append(checklistRow(4, "Human oversight assigned", Boolean.TRUE.equals(system.getHumanOversight()), "Oversight policy / owner"));
            sb.append(checklistRow(5, "Human oversight owner named", Boolean.TRUE.equals(system.getHumanOversight()) && system.getHumanOversightOwner() != null && !system.getHumanOversightOwner().isBlank(), "Named owner"));
            sb.append(checklistRow(6, "Transparency notice published", Boolean.TRUE.equals(system.getTransparencyNoticePublished()), "Published notice URL"));
            sb.append(checklistRow(7, "Evidence retention enabled", Boolean.TRUE.equals(system.getLogsEvidenceRetained()), "Input/output logs"));
            sb.append(checklistRow(8, "Post-deployment monitoring", Boolean.TRUE.equals(system.getMonitoringEnabled()), "Monitoring plan / logs"));
            sb.append(checklistRow(9, "Data categories documented", system.getDataCategoriesSentToAi() != null && !system.getDataCategoriesSentToAi().isEmpty(), "Data inventory"));
            sb.append(checklistRow(10, "EU exposure documented", Boolean.TRUE.equals(system.getEuUsersAffected()), "Target region analysis"));
        }

        sb.append("\n");
        sb.append("---\n\n");
        sb.append("*Generated for operational use. This checklist is an operational aid, not a legal conformity declaration.*");
        return sb.toString();
    }

    public String exportFullProofPack(UserDetails userDetails, String systemId) {
        AiSystemInventory system = loadOwnedSystem(userDetails, systemId);
        Optional<AiActAssessment> latestAssessment = latestAssessmentForSystem(systemId);
        List<EvidenceItemResponse> evidenceItems = safeFindEvidence(userDetails, systemId);
        List<AiActAuditLogResponse> auditLogs = safeFindAudit(userDetails, systemId);
        LocalDateTime generatedAt = LocalDateTime.now();
        String rulesetVersion = latestAssessment.map(AiActAssessment::getRulesetVersion).orElse("n/a");
        String versionHashPlaceholder = "v-" + generatedAt.format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));

        StringBuilder sb = new StringBuilder();
        sb.append("# EU AI Act Readiness Proof Pack — ").append(system.getSystemName()).append("\n\n");

        sb.append("## Document control\n\n");
        sb.append("| Field | Value |\n");
        sb.append("| --- | --- |\n");
        sb.append("| **System name** | ").append(system.getSystemName()).append(" |\n");
        sb.append("| **System id** | ").append(system.getId()).append(" |\n");
        sb.append("| **Ruleset version** | ").append(value(rulesetVersion)).append(" |\n");
        sb.append("| **Generated at** | ").append(DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(generatedAt)).append(" |\n");
        sb.append("| **Version hash** | ").append(versionHashPlaceholder).append(" |\n\n");

        sb.append("## Legal disclaimer\n\n");
        sb.append("*This document is generated for operational readiness tracking under the EU AI Act. ")
                .append("It is not a conformity assessment, not a certificate of compliance, and not legal advice. ")
                .append("Obtain qualified legal counsel before relying on this material for any regulatory submission, contract, or audit.*\n\n");

        sb.append("## 1. System inventory\n\n");
        sb.append("| Field | Value |\n");
        sb.append("| --- | --- |\n");
        sb.append("| **System name** | ").append(system.getSystemName()).append(" |\n");
        sb.append("| **Purpose** | ").append(value(system.getPurpose())).append(" |\n");
        sb.append("| **Use case** | ").append(value(system.getUseCase())).append(" |\n");
        sb.append("| **Provider** | ").append(value(system.getProvider())).append(" |\n");
        sb.append("| **Model** | ").append(value(system.getModelName())).append(" |\n");
        sb.append("| **Model provider type** | ").append(value(system.getModelProviderType())).append(" |\n");
        sb.append("| **Model provider version** | ").append(value(system.getModelProviderVersion())).append(" |\n");
        sb.append("| **Deployment context** | ").append(value(system.getDeploymentContext())).append(" |\n");
        sb.append("| **Decision impact level** | ").append(value(system.getDecisionImpactLevel())).append(" |\n");
        sb.append("| **Release status** | ").append(value(system.getReleaseStatus() != null ? system.getReleaseStatus().name() : null)).append(" |\n");
        sb.append("| **Customer-facing** | ").append(bool(system.getCustomerFacing())).append(" |\n");
        sb.append("| **Training or fine-tuning** | ").append(bool(system.getTrainingOrFineTuning())).append(" |\n");
        sb.append("| **EU users affected** | ").append(bool(system.getEuUsersAffected())).append(" |\n");
        sb.append("| **User-facing AI** | ").append(bool(system.getUserFacingAiInteraction())).append(" |\n");
        sb.append("| **Automated decision-making** | ").append(bool(system.getAutomatedDecisionMaking())).append(" |\n");
        sb.append("| **Human oversight** | ").append(bool(system.getHumanOversight())).append(" |\n");
        sb.append("| **Oversight owner** | ").append(value(system.getHumanOversightOwner())).append(" |\n");
        sb.append("| **Last reviewed at** | ").append(formatDateTime(system.getLastReviewedAt())).append(" |\n");
        sb.append("| **Next review at** | ").append(formatDateTime(system.getNextReviewAt())).append(" |\n");
        sb.append("| **High-risk domain flags** | ").append(highRiskFlags(system)).append(" |\n");
        if (system.getCountries() != null && !system.getCountries().isEmpty()) {
            sb.append("| **Countries** | ").append(String.join(", ", system.getCountries())).append(" |\n");
        }
        if (system.getDataCategoriesSentToAi() != null && !system.getDataCategoriesSentToAi().isEmpty()) {
            sb.append("| **Data categories sent to AI** | ")
                    .append(String.join(", ", system.getDataCategoriesSentToAi())).append(" |\n");
        }
        sb.append("| **Created at** | ").append(formatDateTime(system.getCreatedAt())).append(" |\n");
        sb.append("| **Updated at** | ").append(formatDateTime(system.getUpdatedAt())).append(" |\n\n");

        sb.append("## 2. Risk classification summary\n\n");
        if (latestAssessment.isPresent()) {
            AiActAssessment assessment = latestAssessment.get();
            sb.append("| Field | Value |\n");
            sb.append("| --- | --- |\n");
            sb.append("| **Risk category** | ").append(value(assessment.getRiskCategory())).append(" |\n");
            sb.append("| **Readiness score** | ").append(assessment.getReadinessScore() != null ? assessment.getReadinessScore() + "/100" : "Not scored").append(" |\n");
            sb.append("| **Confidence** | ").append(assessment.getConfidence() != null ? assessment.getConfidence() : "Not recorded").append(" |\n");
            sb.append("| **Ruleset version** | ").append(value(assessment.getRulesetVersion())).append(" |\n");
            sb.append("| **Assessed at** | ").append(assessment.getAssessedAt() != null
                    ? DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(assessment.getAssessedAt())
                    : "Not recorded").append(" |\n\n");
            sb.append("**Rationale:** ").append(Optional.ofNullable(assessment.getRiskClassificationRationale())
                    .filter(r -> !r.isBlank()).orElse("No rationale recorded.")).append("\n\n");
            sb.append("**Risk level explanation:** ").append(Optional.ofNullable(assessment.getRiskLevelExplanation())
                    .filter(r -> !r.isBlank()).orElse("No risk level explanation recorded.")).append("\n\n");
            sb.append("**Confidence explanation:** ").append(Optional.ofNullable(assessment.getConfidenceExplanation())
                    .filter(r -> !r.isBlank()).orElse("No confidence explanation recorded.")).append("\n\n");
        } else {
            sb.append("No AI Act assessment has been recorded for this system yet.\n\n");
        }

        sb.append("## 3. Applicable obligations\n\n");
        if (latestAssessment.isPresent()) {
            appendList(sb, latestAssessment.get().getApplicableObligations(), "No specific obligations recorded.");
        } else {
            sb.append("- No assessment on file.\n\n");
        }

        sb.append("## 4. Gap register\n\n");
        if (latestAssessment.isPresent()) {
            AiActAssessment assessment = latestAssessment.get();
            boolean anyGap = false;
            anyGap |= appendGapList(sb, "Documentation", assessment.getDocumentationGaps());
            anyGap |= appendGapList(sb, "Human oversight", assessment.getHumanOversightGaps());
            anyGap |= appendGapList(sb, "Data handling", assessment.getDataHandlingGaps());
            anyGap |= appendGapList(sb, "User disclosure", assessment.getUserDisclosureGaps());
            anyGap |= appendGapList(sb, "Monitoring", assessment.getMonitoringGaps());
            anyGap |= appendGapList(sb, "AI literacy", assessment.getAiLiteracyGaps());
            anyGap |= appendGapList(sb, "GPAI/provider documentation", assessment.getGpaiProviderDocumentationGaps());
            anyGap |= appendGapList(sb, "Conformity assessment", assessment.getConformityAssessmentGaps());
            if (!anyGap) {
                sb.append("No gaps recorded in the latest assessment.\n\n");
            }
        } else {
            sb.append("- No gap register available (no assessment on file).\n\n");
        }

        sb.append("## 5. Evidence register\n\n");
        if (evidenceItems.isEmpty()
                && (latestAssessment.isEmpty()
                    || latestAssessment.get().getEvidenceChecklist() == null
                    || latestAssessment.get().getEvidenceChecklist().isEmpty())) {
            sb.append("No evidence items recorded.\n\n");
        } else {
            sb.append("| # | Title | Type | Status | Owner | Due date | File URL | Counsel review |\n");
            sb.append("| --- | --- | --- | --- | --- | --- | --- | --- |\n");
            int rowNumber = 1;
            if (latestAssessment.isPresent()
                    && latestAssessment.get().getEvidenceChecklist() != null
                    && !latestAssessment.get().getEvidenceChecklist().isEmpty()) {
                for (Map.Entry<String, String> entry : latestAssessment.get().getEvidenceChecklist().entrySet()) {
                    sb.append(checklistRow(rowNumber++,
                            entry.getKey(),
                            "Assessment",
                            entry.getValue(),
                            null,
                            null,
                            null,
                            null));
                }
            }
            for (EvidenceItemResponse item : evidenceItems) {
                sb.append(checklistRow(rowNumber++,
                        item.getTitle(),
                        item.getType() != null ? item.getType().name() : "EVIDENCE",
                        item.getStatus() != null ? item.getStatus().name() : "MISSING",
                        item.getOwner(),
                        item.getDueDate(),
                        item.getFileUrl(),
                        item.getCounselReviewStatus()));
            }
            sb.append("\n");
        }

        sb.append("## 6. Next actions\n\n");
        if (latestAssessment.isPresent() && latestAssessment.get().getNextActions() != null
                && !latestAssessment.get().getNextActions().isEmpty()) {
            for (String action : latestAssessment.get().getNextActions()) {
                sb.append("- ").append(action).append("\n");
            }
            sb.append("\n");
        } else if (!evidenceItems.isEmpty()) {
            List<EvidenceItemResponse> outstanding = evidenceItems.stream()
                    .filter(e -> e.getStatus() == null
                            || e.getStatus() == EvidenceItemStatus.MISSING
                            || e.getStatus() == EvidenceItemStatus.REQUESTED)
                    .collect(Collectors.toList());
            if (outstanding.isEmpty()) {
                sb.append("- Maintain monitoring and periodic reassessment.\n\n");
            } else {
                for (EvidenceItemResponse item : outstanding) {
                    sb.append("- Complete evidence item: ").append(item.getTitle()).append("\n");
                }
                sb.append("\n");
            }
        } else {
            sb.append("- Maintain monitoring and periodic reassessment.\n\n");
        }

        sb.append("## 7. Audit log\n\n");
        if (auditLogs.isEmpty()) {
            sb.append("No audit log entries recorded.\n\n");
        } else {
            sb.append("| Timestamp | Actor | Event type | Details |\n");
            sb.append("| --- | --- | --- | --- |\n");
            for (AiActAuditLogResponse log : auditLogs) {
                String details = log.getEventData() != null && !log.getEventData().isEmpty()
                        ? log.getEventData().entrySet().stream()
                            .map(e -> e.getKey() + "=" + e.getValue())
                            .collect(Collectors.joining(", "))
                        : "";
                sb.append("| ")
                        .append(log.getTimestamp() != null ? DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(log.getTimestamp()) : "")
                        .append(" | ")
                        .append(value(log.getActor()))
                        .append(" | ")
                        .append(log.getEventType() != null ? log.getEventType().name() : "")
                        .append(" | ")
                        .append(details)
                        .append(" |\n");
            }
            sb.append("\n");
        }

        sb.append("## 8. Sign-off\n\n");
        sb.append("| Role | Name | Signature | Date |\n");
        sb.append("| --- | --- | --- | --- |\n");
        sb.append("| System owner | ").append(value(system.getHumanOversightOwner())).append(" |  |  |\n");
        sb.append("| Counsel reviewer |  |  |  |\n");
        sb.append("| Approver |  |  |  |\n\n");

        sb.append("---\n\n");
        sb.append("*This proof pack is a snapshot of operational state at the generated-at timestamp. ")
                .append("It is not legal advice and does not constitute a conformity declaration under the EU AI Act.*");

        // Onboarding nudge: first-time proof-pack email. We only fire this
        // when the user has exactly one AI system (i.e. this is the first
        // proof pack they will have exported) so we don't spam on every
        // re-export of additional systems.
        try {
            User owner = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
            if (owner != null && systemRepository.countByUserId(owner.getId()) == 1L) {
                String downloadUrl = appUrl + "/ai-act?systemId=" + systemId;
                emailService.sendFirstProofPackReadyEmail(
                        owner.getEmail(),
                        owner.getFullName(),
                        system.getSystemName(),
                        downloadUrl);
            }
        } catch (Exception ex) {
            log.warn("Failed to send first-proof-pack email for system {}: {}",
                    LogSanitizer.id("system", systemId),
                    LogSanitizer.exception(ex));
        }
        return sb.toString();
    }

    public byte[] exportFullProofPackPdf(UserDetails userDetails, String systemId) {
        return renderMarkdownAsPdf(exportFullProofPack(userDetails, systemId));
    }

    private AiSystemInventory loadOwnedSystem(UserDetails userDetails, String systemId) {
        User user = resolveUser(userDetails);
        AiSystemInventory system = systemRepository.findById(systemId)
                .orElseThrow(() -> ApiException.notFound("AI system"));
        if (!user.getId().equals(system.getUserId())) {
            throw ApiException.forbidden("Access denied");
        }
        return system;
    }

    private User resolveUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.UNAUTHORIZED, "UNAUTHORIZED"));
    }

    private Optional<AiActAssessment> latestAssessmentForSystem(String systemId) {
        return Optional.ofNullable(assessmentRepository.findBySystemId(systemId)).orElse(List.of()).stream()
                .max(Comparator.comparing(
                        AiActAssessment::getAssessedAt,
                        Comparator.nullsFirst(Comparator.naturalOrder())));
    }

    private List<EvidenceItemResponse> safeFindEvidence(UserDetails userDetails, String systemId) {
        try {
            return evidenceItemService.findBySystem(userDetails, systemId);
        } catch (RuntimeException ex) {
            return List.of();
        }
    }

    private List<AiActAuditLogResponse> safeFindAudit(UserDetails userDetails, String systemId) {
        try {
            return auditService.exportBySystem(userDetails, systemId);
        } catch (RuntimeException ex) {
            return List.of();
        }
    }

    private String value(String s) {
        return Optional.ofNullable(s).filter(v -> !v.isBlank()).orElse("Not specified");
    }

    private String bool(Boolean b) {
        return Boolean.TRUE.equals(b) ? "Yes" : "No";
    }

    private String formatDateTime(LocalDateTime dt) {
        return dt != null ? DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(dt) : "Not specified";
    }

    private String formatDate(LocalDate d) {
        return d != null ? DateTimeFormatter.ISO_LOCAL_DATE.format(d) : "Not specified";
    }

    private String highRiskFlags(AiSystemInventory s) {
        List<String> flags = List.of(
                flag(s.getHealthcareUse(), "Healthcare"),
                flag(s.getHiringUse(), "Hiring"),
                flag(s.getFinanceUse(), "Finance"),
                flag(s.getEducationUse(), "Education"),
                flag(s.getChildrenUse(), "Children"),
                flag(s.getBiometricUse(), "Biometric"),
                flag(s.getGovernmentUse(), "Government"),
                flag(s.getCriticalInfrastructureUse(), "Critical infrastructure"),
                flag(s.getProhibitedUse(), "Prohibited use"),
                flag(s.getAutomatedDecisionMaking(), "Automated decision-making")
        ).stream().filter(v -> !v.isEmpty()).collect(Collectors.toList());
        return flags.isEmpty() ? "None" : String.join(", ", flags);
    }

    private String flag(Boolean active, String label) {
        return Boolean.TRUE.equals(active) ? label : "";
    }

    private void appendList(StringBuilder sb, List<String> items, String emptyText) {
        if (items == null || items.isEmpty()) {
            if (emptyText != null) {
                sb.append("- ").append(emptyText).append("\n\n");
            }
            return;
        }
        for (String item : items) {
            sb.append("- ").append(item).append("\n");
        }
        sb.append("\n");
    }

    private boolean appendGapList(StringBuilder sb, String label, List<String> items) {
        if (items == null || items.isEmpty()) {
            return false;
        }
        for (String item : items) {
            sb.append("- **").append(label).append(":** ").append(item).append("\n");
        }
        sb.append("\n");
        return true;
    }

    private void appendEvidenceChecklist(StringBuilder sb, Map<String, String> checklist) {
        if (checklist == null || checklist.isEmpty()) {
            sb.append("- No evidence checklist recorded.\n\n");
            return;
        }
        sb.append("| Requirement | Status |\n");
        sb.append("| --- | --- |\n");
        checklist.forEach((requirement, status) ->
                sb.append("| ").append(requirement).append(" | ").append("READY".equalsIgnoreCase(status) ? "Complete" : "Gap").append(" |\n"));
        sb.append("\n");
    }

    private String checklistRow(int number, String requirement, boolean passed, String evidence) {
        return "| " + number + " | " + requirement + " | " + (passed ? "Complete" : "Incomplete") + " | " + evidence + " |\n";
    }

    private String checklistRow(int number,
                                String title,
                                String type,
                                String status,
                                String owner,
                                LocalDate dueDate,
                                String fileUrl,
                                CounselReviewStatus counselReviewStatus) {
        return "| " + number
                + " | " + value(title)
                + " | " + value(type)
                + " | " + value(status)
                + " | " + value(owner)
                + " | " + formatDate(dueDate)
                + " | " + value(fileUrl)
                + " | " + (counselReviewStatus != null ? counselReviewStatus.name() : "Not specified")
                + " |\n";
    }

    private String evidenceLabel(String requirement) {
        String normalized = requirement == null ? "" : requirement.toLowerCase();
        if (normalized.contains("annex")) {
            return "Risk classification notes";
        }
        if (normalized.contains("provider") || normalized.contains("gpai")) {
            return "Provider file / model card";
        }
        if (normalized.contains("technical")) {
            return "Technical docs / system design";
        }
        if (normalized.contains("risk assessment") || normalized.contains("conformity")) {
            return "Risk or conformity workpaper";
        }
        if (normalized.contains("human")) {
            return "Oversight workflow / owner";
        }
        if (normalized.contains("transparency")) {
            return "Published notice";
        }
        if (normalized.contains("retention") || normalized.contains("logs")) {
            return "Input/output logs";
        }
        if (normalized.contains("monitoring")) {
            return "Monitoring plan / incidents";
        }
        if (normalized.contains("literacy")) {
            return "Training record";
        }
        return "Operational evidence";
    }

    private byte[] renderMarkdownAsPdf(String markdown) {
        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            PdfRenderState state = new PdfRenderState(document);
            state.openNewPage();

            for (String sourceLine : normalizeForPdf(markdown).split("\\R", -1)) {
                String line = sourceLine.stripTrailing();
                boolean heading = line.startsWith("#");
                String text = plainTextLine(line);
                if (text.isBlank()) {
                    state.blankLine();
                    continue;
                }

                PDType1Font font = heading ? PDType1Font.HELVETICA_BOLD : PDType1Font.HELVETICA;
                float fontSize = heading ? PDF_HEADING_FONT_SIZE : PDF_FONT_SIZE;
                for (String wrappedLine : wrapText(text, font, fontSize, state.contentWidth())) {
                    state.writeLine(wrappedLine, font, fontSize);
                }
                if (heading) {
                    state.blankLine();
                }
            }

            state.close();
            document.save(output);
            return output.toByteArray();
        } catch (IOException ex) {
            throw new ApiException("Unable to render AI Act proof pack PDF", HttpStatus.INTERNAL_SERVER_ERROR, "PDF_EXPORT_FAILED");
        }
    }

    private String normalizeForPdf(String text) {
        String normalized = Optional.ofNullable(text).orElse("")
                .replace("\u2014", "-")
                .replace("\u2013", "-")
                .replace("\u2018", "'")
                .replace("\u2019", "'")
                .replace("\u201c", "\"")
                .replace("\u201d", "\"")
                .replace("\u2022", "-")
                .replace("\u00a0", " ")
                .replace("\u20ac", "EUR");
        StringBuilder safe = new StringBuilder(normalized.length());
        for (int i = 0; i < normalized.length(); i++) {
            char c = normalized.charAt(i);
            if (c == '\n' || c == '\r' || c == '\t' || (c >= 32 && c <= 126)) {
                safe.append(c);
            } else {
                safe.append("?");
            }
        }
        return safe.toString();
    }

    private String plainTextLine(String line) {
        String text = line.strip();
        if (text.startsWith("#")) {
            text = text.replaceFirst("^#+\\s*", "");
        }
        if (text.matches("^\\|[\\s\\-:|]+\\|$")) {
            return "";
        }
        return text.replace("**", "").replace("*", "");
    }

    private List<String> wrapText(String text, PDType1Font font, float fontSize, float maxWidth) throws IOException {
        if (text.isBlank()) {
            return List.of("");
        }
        List<String> lines = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        for (String word : text.split("\\s+")) {
            String candidate = current.isEmpty() ? word : current + " " + word;
            if (textWidth(candidate, font, fontSize) <= maxWidth) {
                current.setLength(0);
                current.append(candidate);
                continue;
            }

            if (!current.isEmpty()) {
                lines.add(current.toString());
                current.setLength(0);
            }

            if (textWidth(word, font, fontSize) <= maxWidth) {
                current.append(word);
            } else {
                List<String> fragments = splitLongWord(word, font, fontSize, maxWidth);
                lines.addAll(fragments.subList(0, Math.max(0, fragments.size() - 1)));
                if (!fragments.isEmpty()) {
                    current.append(fragments.get(fragments.size() - 1));
                }
            }
        }
        if (!current.isEmpty()) {
            lines.add(current.toString());
        }
        return lines;
    }

    private List<String> splitLongWord(String word, PDType1Font font, float fontSize, float maxWidth) throws IOException {
        List<String> fragments = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        for (int i = 0; i < word.length(); i++) {
            String candidate = current.toString() + word.charAt(i);
            if (!current.isEmpty() && textWidth(candidate, font, fontSize) > maxWidth) {
                fragments.add(current.toString());
                current.setLength(0);
            }
            current.append(word.charAt(i));
        }
        if (!current.isEmpty()) {
            fragments.add(current.toString());
        }
        return fragments;
    }

    private float textWidth(String text, PDType1Font font, float fontSize) throws IOException {
        return font.getStringWidth(text) / 1000f * fontSize;
    }

    private static class PdfRenderState {
        private final PDDocument document;
        private PDPageContentStream contentStream;
        private float y;

        private PdfRenderState(PDDocument document) {
            this.document = document;
        }

        private void openNewPage() throws IOException {
            close();
            PDPage page = new PDPage(PDRectangle.LETTER);
            document.addPage(page);
            contentStream = new PDPageContentStream(document, page);
            y = page.getMediaBox().getHeight() - PDF_MARGIN;
        }

        private float contentWidth() {
            return PDRectangle.LETTER.getWidth() - (PDF_MARGIN * 2);
        }

        private void writeLine(String text, PDType1Font font, float fontSize) throws IOException {
            ensureSpace();
            contentStream.beginText();
            contentStream.setFont(font, fontSize);
            contentStream.newLineAtOffset(PDF_MARGIN, y);
            contentStream.showText(text);
            contentStream.endText();
            y -= PDF_LINE_HEIGHT;
        }

        private void blankLine() throws IOException {
            ensureSpace();
            y -= PDF_LINE_HEIGHT;
        }

        private void ensureSpace() throws IOException {
            if (y <= PDF_MARGIN) {
                openNewPage();
            }
        }

        private void close() throws IOException {
            if (contentStream != null) {
                contentStream.close();
                contentStream = null;
            }
        }
    }
}
