package com.zenvyra.service;

import com.zenvyra.model.ComplianceStreak;
import com.zenvyra.model.ComplianceStreak.StreakMilestone;
import com.zenvyra.model.Notification.NotificationType;
import com.zenvyra.model.Notification.Priority;
import com.zenvyra.repository.StreakRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class StreakService {

    private final StreakRepository streakRepository;
    private final NotificationService notificationService;
    private static final double SCORE_THRESHOLD = 80.0;

    /**
     * Updates the streak for a website after a scan.
     */
    public ComplianceStreak updateStreak(String userId, String websiteId, double currentScore) {
        ComplianceStreak streak = streakRepository.findByWebsiteId(websiteId)
                .orElse(new ComplianceStreak());

        int oldStreakCount = streak.getCurrentStreak();
        StreakMilestone oldMilestone = streak.getMilestone() != null ? streak.getMilestone() : StreakMilestone.NONE;

        if (streak.getId() == null) {
            streak.setWebsiteId(websiteId);
            streak.setUserId(userId);
            streak.setStreakStartedAt(LocalDateTime.now());
            streak.setCurrentStreak(0);
            streak.setLongestStreak(0);
        }

        LocalDateTime now = LocalDateTime.now();
        
        if (currentScore >= SCORE_THRESHOLD) {
            // Check if last update was within the last 24-48 hours to continue streak
            if (streak.getLastUpdateDate() == null) {
                streak.setCurrentStreak(1);
            } else {
                long daysBetween = ChronoUnit.DAYS.between(streak.getLastUpdateDate().toLocalDate(), now.toLocalDate());
                if (daysBetween == 1) {
                    streak.setCurrentStreak(streak.getCurrentStreak() + 1);
                } else if (daysBetween > 1) {
                    streak.setCurrentStreak(1); // Reset if missed more than a day
                    streak.setStreakStartedAt(now);
                }
            }
            streak.setActive(true);
        } else {
            // Score dropped below threshold - Streak RESET
            if (streak.getCurrentStreak() > 0) {
                notificationService.createNotification(userId, "💔 Streak Broken", 
                    "Your compliance score dropped to " + currentScore + ". Your streak has been reset.", 
                    NotificationType.STREAK_ALERT, Priority.HIGH, "/scan");
            }
            streak.setCurrentStreak(0);
            streak.setStreakStartedAt(null);
            streak.setActive(false);
        }

        streak.setLastScore(currentScore);
        streak.setLastUpdateDate(now);
        streak.setLongestStreak(Math.max(streak.getCurrentStreak(), streak.getLongestStreak()));
        streak.setMilestone(calculateMilestone(streak.getCurrentStreak()));

        ComplianceStreak saved = streakRepository.save(streak);

        // Notify on milestone achievement
        if (saved.getMilestone() != StreakMilestone.NONE && saved.getMilestone() != oldMilestone) {
            notificationService.sendMilestoneAchieved(userId, saved.getMilestone().name(), saved.getCurrentStreak());
        }

        return saved;
    }

    private StreakMilestone calculateMilestone(int days) {
        if (days >= 90) return StreakMilestone.GOLD;
        if (days >= 30) return StreakMilestone.SILVER;
        if (days >= 7) return StreakMilestone.BRONZE;
        return StreakMilestone.NONE;
    }

    public ComplianceStreak getStreak(String websiteId) {
        return streakRepository.findByWebsiteId(websiteId).orElse(null);
    }

    /**
     * Daily check at 23:00 to alert users whose streak is at risk.
     */
    @Scheduled(cron = "0 0 23 * * *")
    public void checkStreaksAtRisk() {
        log.info("Checking for compliance streaks at risk...");
        List<ComplianceStreak> allStreaks = streakRepository.findAll();
        LocalDateTime today = LocalDateTime.now();

        for (ComplianceStreak streak : allStreaks) {
            if (streak.getCurrentStreak() > 0) {
                long hoursSinceUpdate = ChronoUnit.HOURS.between(streak.getLastUpdateDate(), today);
                if (hoursSinceUpdate > 20) {
                    notificationService.sendStreakAlert(streak.getUserId(), streak.getCurrentStreak(), true);
                }
            }
        }
    }

    private void triggerStreakAlert(ComplianceStreak streak) {
        notificationService.sendStreakAlert(streak.getUserId(), streak.getCurrentStreak(), true);
    }
}
