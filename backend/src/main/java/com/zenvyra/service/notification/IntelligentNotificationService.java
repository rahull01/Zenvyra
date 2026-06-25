package com.zenvyra.service.notification;

import com.zenvyra.model.User;
import com.zenvyra.model.notification.NotificationPreference;
import com.zenvyra.model.notification.NotificationPreference.NotificationPriority;
import com.zenvyra.model.notification.PushTracking;
import com.zenvyra.model.notification.QueuedNotification;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.notification.PreferenceRepository;
import com.zenvyra.repository.notification.QueueRepository;
import com.zenvyra.repository.notification.TrackingRepository;
import com.zenvyra.service.PushNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class IntelligentNotificationService {

    private final PreferenceRepository preferenceRepository;
    private final TrackingRepository trackingRepository;
    private final QueueRepository queueRepository;
    private final UserRepository userRepository;
    private final PushNotificationService pushService;

    private static final int MAX_PUSH_PER_24H = 2;
    private static final int COOLDOWN_HOURS = 1;

    /**
     * Core method to process a notification event with real-time data.
     */
    public void processNotification(String userId, String title, String message, 
                                 NotificationPriority priority, String actionUrl) {
        
        log.info("Processing notification for user {}: {} (Priority: {})", userId, title, priority);

        // 1. Priority Filtering (Only HIGH and CRITICAL for push)
        if (priority == NotificationPriority.LOW || priority == NotificationPriority.MEDIUM) {
            log.info("Notification priority {} too low for push. Storing in logs only.", priority);
            return;
        }

        // 2. Fetch User Context (Plan & Preferences)
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        NotificationPreference prefs = preferenceRepository.findById(userId)
                .orElse(NotificationPreference.builder()
                        .userId(userId)
                        .pushEnabled(true)
                        .pushThreshold(NotificationPriority.HIGH)
                        .build());

        // 3. User Preference Check
        if (!prefs.isPushEnabled() || priority.ordinal() < prefs.getPushThreshold().ordinal()) {
            log.info("User {} has push disabled or threshold higher than {}", userId, priority);
            return;
        }

        // 4. Conversion Optimization (Bonus)
        if ("FREE".equals(user.getPlan())) {
            message = message + " Upgrade to PRO to fix these issues instantly.";
        }

        // 5. Validation Logic (Rolling 24h & Cooldown)
        if (!canSendPushNow(userId)) {
            log.warn("Push limit reached or cooldown active for user {}. Queueing notification.", userId);
            queueNotification(userId, title, message, actionUrl, priority);
            return;
        }

        // 6. Smart Timing Check (9-11 AM, 6-8 PM)
        if (!isWithinSmartWindow()) {
            log.info("Outside of smart timing window for user {}. Queueing notification.", userId);
            queueNotification(userId, title, message, actionUrl, priority);
            return;
        }

        // 7. Execute Push
        executePush(userId, title, message, actionUrl);
    }

    private boolean canSendPushNow(String userId) {
        PushTracking tracking = trackingRepository.findById(userId).orElse(new PushTracking());
        LocalDateTime now = LocalDateTime.now();

        // Check Cooldown
        if (tracking.getLastSentAt() != null && 
            tracking.getLastSentAt().plusHours(COOLDOWN_HOURS).isAfter(now)) {
            return false;
        }

        // Check Rolling 24h Window
        List<LocalDateTime> recentHistory = tracking.getSentAtHistory().stream()
                .filter(t -> t.plusHours(24).isAfter(now))
                .collect(Collectors.toList());
        
        tracking.setSentAtHistory(recentHistory);
        trackingRepository.save(tracking);

        return recentHistory.size() < MAX_PUSH_PER_24H;
    }

    private boolean isWithinSmartWindow() {
        LocalTime now = LocalTime.now();
        boolean morningWindow = now.isAfter(LocalTime.of(9, 0)) && now.isBefore(LocalTime.of(11, 0));
        boolean eveningWindow = now.isAfter(LocalTime.of(18, 0)) && now.isBefore(LocalTime.of(20, 0));
        return morningWindow || eveningWindow;
    }

    private void queueNotification(String userId, String title, String message, String actionUrl, NotificationPriority priority) {
        queueRepository.save(QueuedNotification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .actionUrl(actionUrl)
                .priority(priority)
                .createdAt(LocalDateTime.now())
                .processed(false)
                .build());
    }

    private void executePush(String userId, String title, String message, String actionUrl) {
        pushService.sendPush(userId, title, message, actionUrl);
        
        PushTracking tracking = trackingRepository.findById(userId).orElse(new PushTracking());
        tracking.setUserId(userId);
        tracking.addSentTimestamp(LocalDateTime.now());
        trackingRepository.save(tracking);
    }

    /**
     * Scheduled task to process queued notifications during valid windows.
     */
    @Scheduled(cron = "0 */15 * * * *") // Every 15 minutes
    public void processQueue() {
        if (!isWithinSmartWindow()) return;

        List<QueuedNotification> queue = queueRepository.findByProcessedFalseOrderByCreatedAtAsc();
        for (QueuedNotification q : queue) {
            if (canSendPushNow(q.getUserId())) {
                executePush(q.getUserId(), q.getTitle(), q.getMessage(), q.getActionUrl());
                q.setProcessed(true);
                queueRepository.save(q);
            }
        }
    }
}
