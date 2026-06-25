package com.zenvyra.service;

import com.zenvyra.model.Notification;
import com.zenvyra.model.Notification.NotificationType;
import com.zenvyra.model.Notification.Priority;
import com.zenvyra.model.notification.NotificationPreference.NotificationPriority;
import com.zenvyra.repository.NotificationRepository;
import com.zenvyra.service.notification.IntelligentNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final IntelligentNotificationService intelligentNotificationService;

    /**
     * Creates and saves a notification.
     */
    public Notification createNotification(String userId, String title, String message, 
                                        NotificationType type, Priority priority, String actionUrl) {
        
        Notification notification = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .type(type)
                .priority(priority)
                .actionUrl(actionUrl)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        Notification saved = notificationRepository.save(notification);
        
        // Intelligent Push Trigger
        intelligentNotificationService.processNotification(
            userId, 
            title, 
            message, 
            mapPriority(priority), 
            actionUrl
        );
        
        // Logic for high priority emails
        if (priority == Priority.HIGH || priority == Priority.URGENT) {
            sendEmailNotification(userId, title, message);
        }
        
        return saved;
    }

    private NotificationPriority mapPriority(Priority priority) {
        return switch (priority) {
            case LOW -> NotificationPriority.LOW;
            case MEDIUM -> NotificationPriority.MEDIUM;
            case HIGH -> NotificationPriority.HIGH;
            case URGENT -> NotificationPriority.CRITICAL;
        };
    }

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    private void sendEmailNotification(String userId, String title, String message) {
        // Mock email sending logic
        log.info("Sending EMAIL to user {}: [{}] - {}", userId, title, message);
    }

    // Specialized triggers for convenience
    public void sendStreakAlert(String userId, int days, boolean atRisk) {
        String title = atRisk ? "🚨 Streak at risk!" : "🔥 Streak continued!";
        String msg = atRisk ? 
            "Your " + days + "-day compliance streak will break in 1 hour! Scan now to save it." :
            "Great job! You've maintained your compliance for " + days + " days.";
        
        createNotification(userId, title, msg, NotificationType.STREAK_ALERT, 
            atRisk ? Priority.URGENT : Priority.LOW, "/dashboard");
    }

    public void sendMilestoneAchieved(String userId, String milestoneName, int days) {
        String title = "🎊 Milestone Achieved: " + milestoneName;
        String msg = "Incredible! You've reached a " + days + "-day streak. You've earned the " + milestoneName + " badge.";
        
        createNotification(userId, title, msg, NotificationType.MILESTONE_ACHIEVED, Priority.HIGH, "/certificates");
    }

    public void sendIssueDetected(String userId, String websiteUrl, String issueTitle) {
        String title = "⚠️ New Compliance Issue";
        String msg = "A new " + issueTitle + " issue was detected on " + websiteUrl + ". Your score has dropped.";
        
        createNotification(userId, title, msg, NotificationType.COMPLIANCE_ISSUE, Priority.HIGH, "/scan");
    }

    public void sendScanSummaryNotification(String userId, String websiteUrl, double oldScore, double newScore, int issueCount) {
        if (issueCount == 0) return;

        double drop = oldScore - newScore;
        String title = issueCount == 1 ? "⚠️ Compliance Issue Detected" : "🚨 Multiple Issues Detected";
        
        String msg = String.format("%d compliance issues found on %s. Your score dropped from %.0f%% to %.0f%%.", 
            issueCount, websiteUrl, oldScore, newScore);
            
        Priority priority = drop > 20 ? Priority.URGENT : Priority.HIGH;
        
        createNotification(userId, title, msg, NotificationType.COMPLIANCE_ISSUE, priority, "/scan");
    }

    public void sendChangeDetectedAlert(String userId, String websiteUrl, String changeDescription) {
        String title = "🔄 Change Detected: " + websiteUrl;
        String msg = "A significant change was detected on your website that may affect your compliance status: " + changeDescription;
        
        createNotification(userId, title, msg, NotificationType.COMPLIANCE_ISSUE, Priority.HIGH, "/monitoring");
    }

    public void sendLowScoreAlert(String userId, String websiteUrl, double score) {
        String title = "📉 Compliance Score Alert: " + websiteUrl;
        String msg = String.format("Your compliance score for %s has dropped to %.0f%%. Please review the issues and take action.", 
            websiteUrl, score);
        
        createNotification(userId, title, msg, NotificationType.COMPLIANCE_ISSUE, Priority.HIGH, "/scan");
    }

    public void sendDsarDeadlineAlert(String userId) {
        String title = "Regulatory Deadline";
        String msg = "You have a new Data Subject Request pending. 30 days remaining to fulfill.";

        createNotification(userId, title, msg, NotificationType.SYSTEM_UPDATE, Priority.URGENT, "/dashboard/dsar");
    }
}
