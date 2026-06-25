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
    private String provider;
    private String modelProviderType;
    private String useCase;
    private Boolean euUsersAffected;
    private Boolean userFacingAiInteraction;
    private Boolean automatedDecisionMaking;
    private Boolean humanOversight;
    private List<String> dataCategoriesSentToAi;
    private Boolean logsEvidenceRetained;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
