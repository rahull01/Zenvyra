package com.zenvyra.model;

import com.zenvyra.domain.organization.OrganizationRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "organization_members")
public class OrganizationMember {

    @Id
    private String id;
    private String organizationId;
    private String userId;
    private String email;
    private OrganizationRole role;
    private String status; // active, pending, inactive
    private String invitedBy;
    private LocalDateTime invitedAt;
    private LocalDateTime joinedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
