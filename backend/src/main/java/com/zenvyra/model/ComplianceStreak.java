package com.zenvyra.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "streaks")
public class ComplianceStreak {
    @Id
    private String id;
    private String websiteId;
    private String userId;
    
    private int currentStreak;
    private int longestStreak;
    private LocalDateTime lastUpdateDate;
    private LocalDateTime streakStartedAt;
    
    private StreakMilestone milestone;
    private double lastScore;
    private boolean active; // Streak is active if the last check was successful within 24h
    
    public enum StreakMilestone {
        NONE(0),
        BRONZE(7),
        SILVER(30),
        GOLD(90);
        
        private final int days;
        StreakMilestone(int days) { this.days = days; }
        public int getDays() { return days; }
    }
}
