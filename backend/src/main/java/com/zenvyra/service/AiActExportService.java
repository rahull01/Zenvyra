package com.zenvyra.service;

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
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiActExportService {

    private final UserRepository userRepository;
    private final AiSystemInventoryRepository systemRepository;
    private final AiActAssessmentRepository assessmentRepository;

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
            sb.append("This system may make automated decisions that produce legal or similarly significant effects. ")
                    .append("You have the right to request human review, express your point of view, and contest the decision.\n\n");
        }
        sb.append("## Your rights\n\n");
        sb.append("Depending on your location, you may have rights to access, correct, restrict, or object to the processing of your personal data by AI systems.\n\n");
        sb.append("## Contact\n\n");
        sb.append("For questions about this AI system, contact the human oversight owner: ")
                .append(Optional.ofNullable(system.getHumanOversightOwner()).orElse("[not assigned]"))
                .append(".\n\n");
        sb.append("---\n\n");
        sb.append("*This notice is generated for operational transparency. It does not constitute legal advice.*");
        return sb.toString();
    }

    public String exportSystemCard(UserDetails userDetails, String systemId) {
        AiSystemInventory system = loadOwnedSystem(userDetails, systemId);
        StringBuilder sb = new StringBuilder();
        sb.append("# AI System Card: ").append(system.getSystemName()).append("\n\n");
        sb.append("| Field | Value |\n");
        sb.append("| --- | --- |\n");
        sb.append("| **System name** | ").append(system.getSystemName()).append(" |\n");
        sb.append("| **Purpose** | ").append(value(system.getPurpose())).append(" |\n");
        sb.append("| **Use case** | ").append(value(system.getUseCase())).append(" |\n");
        sb.append("| **Provider** | ").append(value(system.getProvider())).append(" |\n");
        sb.append("| **Model** | ").append(value(system.getModelName())).append(" |\n");
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
        sb.append("| **High-risk domain flags** | ").append(highRiskFlags(system)).append(" |\n");
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
        sb.append("**Risk category:** ").append(assessment.getRiskCategory()).append("\n\n");
        sb.append("**Readiness score:** ").append(assessment.getReadinessScore()).append("/100\n\n");
        sb.append("**Assessed at:** ").append(assessment.getAssessedAt() != null
                ? DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(assessment.getAssessedAt())
                : "Not recorded").append("\n\n");

        sb.append("## Risk signals\n\n");
        appendList(sb, assessment.getRiskSignals(), "No risk signals recorded.");

        sb.append("## Required transparency notices\n\n");
        appendList(sb, assessment.getRequiredTransparencyNotices(), "None identified.");

        sb.append("## Evidence items\n\n");
        appendList(sb, assessment.getEvidenceItems(), "No evidence items recorded.");

        sb.append("## Gaps\n\n");
        appendList(sb, assessment.getDocumentationGaps(), null);
        appendList(sb, assessment.getHumanOversightGaps(), null);
        appendList(sb, assessment.getDataHandlingGaps(), null);
        appendList(sb, assessment.getUserDisclosureGaps(), null);
        appendList(sb, assessment.getMonitoringGaps(), null);
        if (sb.toString().endsWith("Gaps\n\n")) {
            sb.append("No gaps identified.\n\n");
        }

        sb.append("## Next actions\n\n");
        appendList(sb, assessment.getNextActions(), "Maintain monitoring and periodic reassessment.");

        sb.append("---\n\n");
        sb.append("*").append(assessment.getCounselReviewWarning()).append("*");
        return sb.toString();
    }

    public String exportEvidenceChecklist(UserDetails userDetails, String systemId) {
        AiSystemInventory system = loadOwnedSystem(userDetails, systemId);
        StringBuilder sb = new StringBuilder();
        sb.append("# AI Act Evidence Checklist: ").append(system.getSystemName()).append("\n\n");
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

        sb.append("\n");
        sb.append("---\n\n");
        sb.append("*Generated for operational use. This checklist is an operational aid, not a legal conformity declaration.*");
        return sb.toString();
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

    private String value(String s) {
        return Optional.ofNullable(s).filter(v -> !v.isBlank()).orElse("Not specified");
    }

    private String bool(Boolean b) {
        return Boolean.TRUE.equals(b) ? "Yes" : "No";
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

    private String checklistRow(int number, String requirement, boolean passed, String evidence) {
        return "| " + number + " | " + requirement + " | " + (passed ? "✅ Complete" : "⬜ Incomplete") + " | " + evidence + " |\n";
    }
}
