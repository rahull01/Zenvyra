package com.zenvyra.controller;

import com.zenvyra.model.AiSystemInventory;
import com.zenvyra.model.User;
import com.zenvyra.repository.AiSystemInventoryRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.service.EmailService;
import com.zenvyra.service.OrganizationService;
import com.zenvyra.service.WebsiteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class OnboardingControllerTest {

    private final OrganizationService organizationService = mock(OrganizationService.class);
    private final WebsiteService websiteService = mock(WebsiteService.class);
    private final EmailService emailService = mock(EmailService.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final AiSystemInventoryRepository aiSystemInventoryRepository = mock(AiSystemInventoryRepository.class);

    private final OnboardingController controller = new OnboardingController(
            organizationService, websiteService, emailService, userRepository, aiSystemInventoryRepository);

    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        userDetails = org.springframework.security.core.userdetails.User
                .withUsername("owner@example.com")
                .password("password")
                .roles("USER")
                .build();
    }

    @Test
    void onboardingSeedsAiInventoryForSelectedTools() {
        User user = User.builder()
                .id("user-1")
                .email("owner@example.com")
                .createdAt(LocalDateTime.now())
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(aiSystemInventoryRepository.findByUserId("user-1")).thenReturn(new ArrayList<>());

        OnboardingController.OnboardingRequest request = OnboardingController.OnboardingRequest.builder()
                .aiToolsUsed(List.of("ChatGPT", "Midjourney"))
                .targetRegions(List.of("EU", "US"))
                .build();

        ResponseEntity<String> response = controller.completeOnboarding(userDetails, request);

        assertEquals(200, response.getStatusCode().value());
        verify(aiSystemInventoryRepository, times(2)).save(any(AiSystemInventory.class));
    }

    @Test
    void onboardingSkipsNoAiSelection() {
        User user = User.builder()
                .id("user-1")
                .email("owner@example.com")
                .createdAt(LocalDateTime.now())
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        OnboardingController.OnboardingRequest request = OnboardingController.OnboardingRequest.builder()
                .aiToolsUsed(List.of("No AI"))
                .build();

        controller.completeOnboarding(userDetails, request);

        verify(aiSystemInventoryRepository, never()).save(any(AiSystemInventory.class));
    }

    @Test
    void onboardingDoesNotDuplicateExistingInventory() {
        User user = User.builder()
                .id("user-1")
                .email("owner@example.com")
                .createdAt(LocalDateTime.now())
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(aiSystemInventoryRepository.findByUserId("user-1"))
                .thenReturn(List.of(AiSystemInventory.builder().systemName("ChatGPT").build()));

        OnboardingController.OnboardingRequest request = OnboardingController.OnboardingRequest.builder()
                .aiToolsUsed(List.of("ChatGPT"))
                .build();

        controller.completeOnboarding(userDetails, request);

        verify(aiSystemInventoryRepository, never()).save(any(AiSystemInventory.class));
    }
}
