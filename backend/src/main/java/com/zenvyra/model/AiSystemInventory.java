package com.zenvyra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ai_system_inventory")
public class AiSystemInventory {
    @Id
    private String id;
    private String userId;
    private String organizationId;
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
}
