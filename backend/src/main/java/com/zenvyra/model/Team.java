package com.zenvyra.model;

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
        private String role; // admin, compliance_officer, developer, viewer
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
