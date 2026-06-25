package com.zenvyra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "team_invites")
public class TeamInvite {
    @Id
    private String id;
    
    @Indexed
    private String organizationId;
    
    @Indexed
    private String email;
    
    private String role;
    private String invitedBy; // userId
    private String token;
    private String status; // pending, accepted, expired
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
}
