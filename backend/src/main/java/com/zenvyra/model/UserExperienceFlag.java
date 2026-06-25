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
@Document(collection = "user_experience_flags")
public class UserExperienceFlag {
    @Id
    private String id;

    @Indexed
    private String pagePath;

    @Indexed
    private String workflow;

    @Indexed
    private String phase;

    private String sessionId;
    private String userId;
    private String reason;
    private long sessionDurationSeconds;
    private int interactionCount;
    private int completionScore;
    private LocalDateTime createdAt;
}
