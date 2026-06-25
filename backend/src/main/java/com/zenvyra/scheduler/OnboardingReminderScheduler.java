package com.zenvyra.scheduler;

import com.zenvyra.model.User;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.service.EmailService;
import com.zenvyra.util.LogSanitizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class OnboardingReminderScheduler {

    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${app.onboarding-reminders.enabled:true}")
    private boolean enabled;

    @Value("${app.onboarding-reminders.initial-delay-hours:24}")
    private long initialDelayHours;

    @Value("${app.onboarding-reminders.cooldown-hours:72}")
    private long cooldownHours;

    @Value("${app.onboarding-reminders.max-reminders:2}")
    private int maxReminders;

    @Scheduled(cron = "${app.onboarding-reminders.cron:0 0 10 * * ?}")
    public void sendOnboardingReminders() {
        if (!enabled) {
            log.debug("Onboarding reminder scheduler is disabled");
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        int sent = 0;
        for (User user : userRepository.findAll()) {
            if (!shouldSend(user, now)) {
                continue;
            }

            try {
                emailService.sendOnboardingIncompleteReminderEmail(user.getEmail());
                user.setOnboardingReminderSentAt(now);
                user.setOnboardingReminderCount(reminderCount(user) + 1);
                user.setUpdatedAt(now);
                userRepository.save(user);
                sent++;
            } catch (Exception e) {
                log.warn("Onboarding reminder failed for {}: {}", LogSanitizer.email(user.getEmail()), LogSanitizer.exception(e));
            }
        }
        log.info("Onboarding reminder scheduler sent {} reminders", sent);
    }

    private boolean shouldSend(User user, LocalDateTime now) {
        if (user == null || user.getEmail() == null || user.getEmail().isBlank()) {
            return false;
        }
        if (!"active".equalsIgnoreCase(user.getStatus())) {
            return false;
        }
        if (Boolean.TRUE.equals(user.getOnboardingCompleted())) {
            return false;
        }
        if (reminderCount(user) >= maxReminders) {
            return false;
        }
        LocalDateTime createdAt = user.getCreatedAt();
        if (createdAt == null || createdAt.isAfter(now.minusHours(initialDelayHours))) {
            return false;
        }
        LocalDateTime lastReminderAt = user.getOnboardingReminderSentAt();
        return lastReminderAt == null || !lastReminderAt.isAfter(now.minusHours(cooldownHours));
    }

    private int reminderCount(User user) {
        return user.getOnboardingReminderCount() == null ? 0 : Math.max(0, user.getOnboardingReminderCount());
    }
}
