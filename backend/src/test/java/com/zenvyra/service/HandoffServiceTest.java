package com.zenvyra.service;

import com.zenvyra.exception.ApiException;
import com.zenvyra.model.User;
import com.zenvyra.model.Website;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HandoffServiceTest {

    @Mock
    private WebsiteRepository websiteRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private EmailService emailService;

    private HandoffService service;

    @BeforeEach
    void setUp() {
        service = new HandoffService(websiteRepository, userRepository, emailService);
        ReflectionTestUtils.setField(service, "appUrl", "http://localhost:3000");
    }

    @Test
    void ownerCanLoadHandoffPayload() {
        User user = User.builder().id("user-1").email("owner@example.com").platform("Shopify").build();
        Website website = Website.builder().id("site-1").userId("user-1").url("https://example.com").complianceScore(88.0).build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(websiteRepository.findById("site-1")).thenReturn(Optional.of(website));

        var payload = service.handoff("owner@example.com", "site-1");

        assertEquals("https://example.com", payload.get("websiteUrl"));
        assertEquals("Shopify", payload.get("platform"));
        assertEquals("http://localhost:3000/dashboard/websites/site-1/handoff", payload.get("handoffUrl"));
    }

    @Test
    void nonOwnerCannotLoadHandoffPayload() {
        User user = User.builder().id("user-2").email("other@example.com").role("ROLE_USER").build();
        Website website = Website.builder().id("site-1").userId("user-1").url("https://example.com").build();

        when(userRepository.findByEmail("other@example.com")).thenReturn(Optional.of(user));
        when(websiteRepository.findById("site-1")).thenReturn(Optional.of(website));

        assertThrows(ApiException.class, () -> service.handoff("other@example.com", "site-1"));
    }

    @Test
    void sendHandoffCallsSetupPackEmail() {
        User user = User.builder().id("user-1").email("owner@example.com").fullName("Owner").build();
        Website website = Website.builder().id("site-1").userId("user-1").url("https://example.com").build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(websiteRepository.findById("site-1")).thenReturn(Optional.of(website));

        var payload = service.sendHandoff("owner@example.com", "site-1");

        assertEquals("sent_or_logged", payload.get("deliveryStatus"));
        verify(emailService).sendSetupPackReadyEmail(
                eq("owner@example.com"),
                eq("Your Zenvyra setup pack is ready"),
                contains("http://localhost:3000/dashboard/websites/site-1/handoff"));
    }
}
