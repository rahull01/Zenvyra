package com.zenvyra.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiSystemInventoryRequest {

    private String organizationId;

    @NotBlank(message = "System name is required")
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
}
