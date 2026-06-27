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
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OnboardingControllerTest {

    @Mock
    private OrganizationService organizationService;
    @Mock
    private WebsiteService websiteService;
    @Mock
    private EmailService emailService;
    @Mock
    private UserRepository userRepository;
    @Mock
    private AiSystemInventoryRepository aiSystemInventoryRepository;

    private OnboardingController controller;
    private UserDetails userDetails;
    private User user;

    @BeforeEach
    void setUp() {
        controller = new OnboardingController(
                organizationService,
                websiteService,
                emailService,
                userRepository,
                aiSystemInventoryRepository
        );
        userDetails = org.springframework.security.core.userdetails.User
                .withUsername("owner@example.com")
                .password("password")
                .roles("USER")
                .build();
        user = User.builder()
                .id("user-1")
                .email("owner@example.com")
                .companyName("Acme")
                .build();
    }

    @Test
    void onboardingSeedsAiInventoryFromSelectedTools() {
        OnboardingController.OnboardingRequest request = baseRequest();
        request.setAiToolsUsed(List.of("Chatbot", "AI scoring/decisioning", "No AI"));

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(websiteService.getUserWebsites("owner@example.com")).thenReturn(List.of());
        when(aiSystemInventoryRepository.findByUserId("user-1")).thenReturn(List.of());

        controller.completeOnboarding(userDetails, request);

        ArgumentCaptor<AiSystemInventory> captor = ArgumentCaptor.forClass(AiSystemInventory.class);
        verify(aiSystemInventoryRepository, org.mockito.Mockito.times(2)).save(captor.capture());

        List<AiSystemInventory> systems = captor.getAllValues();
        assertEquals(List.of("Chatbot", "AI scoring/decisioning"), systems.stream().map(AiSystemInventory::getSystemName).toList());
        assertTrue(systems.get(0).getUserFacingAiInteraction());
        assertFalse(systems.get(0).getAutomatedDecisionMaking());
        assertTrue(systems.get(1).getAutomatedDecisionMaking());
        assertTrue(systems.get(1).getFinanceUse());
        assertTrue(systems.get(0).getEuUsersAffected());
    }

    @Test
    void onboardingDoesNotDuplicateExistingAiInventory() {
        OnboardingController.OnboardingRequest request = baseRequest();
        request.setAiToolsUsed(List.of("Chatbot", "AI support"));

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(websiteService.getUserWebsites("owner@example.com")).thenReturn(List.of());
        when(aiSystemInventoryRepository.findByUserId("user-1")).thenReturn(List.of(
                AiSystemInventory.builder().systemName("Chatbot").build()
        ));

        controller.completeOnboarding(userDetails, request);

        ArgumentCaptor<AiSystemInventory> captor = ArgumentCaptor.forClass(AiSystemInventory.class);
        verify(aiSystemInventoryRepository).save(captor.capture());
        assertEquals("AI support", captor.getValue().getSystemName());
    }

    @Test
    void onboardingSkipsAiInventoryWhenNoAiSelected() {
        OnboardingController.OnboardingRequest request = baseRequest();
        request.setAiToolsUsed(List.of("No AI"));

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(websiteService.getUserWebsites("owner@example.com")).thenReturn(List.of());
        when(aiSystemInventoryRepository.findByUserId("user-1")).thenReturn(List.of());

        controller.completeOnboarding(userDetails, request);

        verify(aiSystemInventoryRepository, never()).save(any());
    }

    private OnboardingController.OnboardingRequest baseRequest() {
        return OnboardingController.OnboardingRequest.builder()
                .businessLegalName("Acme Ltd")
                .tradingName("Acme")
                .supportEmail("support@example.com")
                .siteUrl("https://example.com")
                .targetRegions(List.of("UK", "USA"))
                .platform("Shopify")
                .dsarEmail("privacy@example.com")
                .industry("Services")
                .build();
    }
}
