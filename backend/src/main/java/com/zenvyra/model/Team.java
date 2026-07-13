package com.zenvyra.model;

import com.zenvyra.domain.organization.OrganizationRole;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "teams")
public class Team {

    @Id
    private String id;

    private String name;
    private String ownerId; // user who created

    /**
     * Organization that owns this team. Required for RBAC: every team-scoped
     * endpoint must check that the authenticated user is a member of this
     * organization. The legacy code only used {@link #ownerId} (a user id),
     * which made cross-tenant authorization impossible.
     */
    private String organizationId;

    private List<Member> members;
    private List<String> websites; // shared websites

    private Billing billing;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Member {
        private String userId;
        private String email;
        /**
         * Role of this member inside the team. Typed as {@link OrganizationRole}
         * so we don't have to validate free-form strings at every call site.
         */
        private OrganizationRole role;
        private LocalDateTime joinedAt;
        private List<String> permissions;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Billing {
        private String plan;
        private Integer seats;
        private Integer costPerMonth;
    }
}
