package com.zenvyra.scheduler;

import com.zenvyra.model.User;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OnboardingReminderSchedulerTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private EmailService emailService;

    private OnboardingReminderScheduler scheduler;

    @BeforeEach
    void setUp() {
        scheduler = new OnboardingReminderScheduler(userRepository, emailService);
        ReflectionTestUtils.setField(scheduler, "enabled", true);
        ReflectionTestUtils.setField(scheduler, "initialDelayHours", 24L);
        ReflectionTestUtils.setField(scheduler, "cooldownHours", 72L);
        ReflectionTestUtils.setField(scheduler, "maxReminders", 2);
    }

    @Test
    void sendsReminderForActiveStaleIncompleteUser() {
        User user = User.builder()
                .id("user-1")
                .email("owner@example.com")
                .status("active")
                .onboardingCompleted(false)
                .onboardingReminderCount(0)
                .createdAt(LocalDateTime.now().minusHours(30))
                .build();
        when(userRepository.findAll()).thenReturn(List.of(user));

        scheduler.sendOnboardingReminders();

        verify(emailService).sendOnboardingIncompleteReminderEmail("owner@example.com");
        ArgumentCaptor<User> saved = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(saved.capture());
        assertEquals(1, saved.getValue().getOnboardingReminderCount());
        assertNotNull(saved.getValue().getOnboardingReminderSentAt());
    }

    @Test
    void skipsCompletedRecentInactiveAndMaxedUsers() {
        User completed = User.builder().email("done@example.com").status("active").onboardingCompleted(true).createdAt(LocalDateTime.now().minusDays(3)).build();
        User recent = User.builder().email("recent@example.com").status("active").onboardingCompleted(false).createdAt(LocalDateTime.now().minusHours(2)).build();
        User inactive = User.builder().email("inactive@example.com").status("disabled").onboardingCompleted(false).createdAt(LocalDateTime.now().minusDays(3)).build();
        User maxed = User.builder().email("max@example.com").status("active").onboardingCompleted(false).onboardingReminderCount(2).createdAt(LocalDateTime.now().minusDays(7)).build();
        when(userRepository.findAll()).thenReturn(List.of(completed, recent, inactive, maxed));

        scheduler.sendOnboardingReminders();

        verify(emailService, never()).sendOnboardingIncompleteReminderEmail(org.mockito.ArgumentMatchers.anyString());
        verify(userRepository, never()).save(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void skipsUserInsideReminderCooldown() {
        User user = User.builder()
                .email("cooldown@example.com")
                .status("active")
                .onboardingCompleted(false)
                .onboardingReminderCount(1)
                .onboardingReminderSentAt(LocalDateTime.now().minusHours(6))
                .createdAt(LocalDateTime.now().minusDays(5))
                .build();
        when(userRepository.findAll()).thenReturn(List.of(user));

        scheduler.sendOnboardingReminders();

        verify(emailService, never()).sendOnboardingIncompleteReminderEmail(org.mockito.ArgumentMatchers.anyString());
        verify(userRepository, never()).save(org.mockito.ArgumentMatchers.any());
    }
}
