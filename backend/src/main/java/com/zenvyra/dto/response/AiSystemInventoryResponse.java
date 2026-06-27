package com.zenvyra.dto.response;

import com.zenvyra.model.AiSystemInventory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiSystemInventoryResponse {
    private String id;
    private String systemName;
    private String purpose;
    private String provider;
    private String modelName;
    private String modelProviderType;
    private String useCase;
    private List<String> userGroups;
    private List<String> countries;
    private Boolean euUsersAffected;
    private Boolean userFacingAiInteraction;
    private Boolean automatedDecisionMaking;
    private Boolean humanOversight;
    private String humanOversightOwner;
    private Boolean transparencyNoticePublished;
    private Boolean technicalDocumentationReady;
    private Boolean riskAssessmentCompleted;
    private List<String> dataCategoriesSentToAi;
    private Boolean logsEvidenceRetained;
    private Boolean monitoringEnabled;
    private Boolean healthcareUse;
    private Boolean hiringUse;
    private Boolean financeUse;
    private Boolean educationUse;
    private Boolean childrenUse;
    private Boolean biometricUse;
    private Boolean governmentUse;
    private Boolean criticalInfrastructureUse;
    private Boolean prohibitedUse;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AiSystemInventoryResponse from(AiSystemInventory system) {
        return AiSystemInventoryResponse.builder()
                .id(system.getId())
                .systemName(system.getSystemName())
                .purpose(system.getPurpose())
                .provider(system.getProvider())
                .modelName(system.getModelName())
                .modelProviderType(system.getModelProviderType())
                .useCase(system.getUseCase())
                .userGroups(system.getUserGroups())
                .countries(system.getCountries())
                .euUsersAffected(system.getEuUsersAffected())
                .userFacingAiInteraction(system.getUserFacingAiInteraction())
                .automatedDecisionMaking(system.getAutomatedDecisionMaking())
                .humanOversight(system.getHumanOversight())
                .humanOversightOwner(system.getHumanOversightOwner())
                .transparencyNoticePublished(system.getTransparencyNoticePublished())
                .technicalDocumentationReady(system.getTechnicalDocumentationReady())
                .riskAssessmentCompleted(system.getRiskAssessmentCompleted())
                .dataCategoriesSentToAi(system.getDataCategoriesSentToAi())
                .logsEvidenceRetained(system.getLogsEvidenceRetained())
                .monitoringEnabled(system.getMonitoringEnabled())
                .healthcareUse(system.getHealthcareUse())
                .hiringUse(system.getHiringUse())
                .financeUse(system.getFinanceUse())
                .educationUse(system.getEducationUse())
                .childrenUse(system.getChildrenUse())
                .biometricUse(system.getBiometricUse())
                .governmentUse(system.getGovernmentUse())
                .criticalInfrastructureUse(system.getCriticalInfrastructureUse())
                .prohibitedUse(system.getProhibitedUse())
                .createdAt(system.getCreatedAt())
                .updatedAt(system.getUpdatedAt())
                .build();
    }
}
