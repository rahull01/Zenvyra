package com.zenvyra.service;

import com.zenvyra.agents.scanner.AiDisclosureSignals;
import com.zenvyra.agents.scanner.Scanner;
import com.zenvyra.dto.request.CreateEvidenceItemRequest;
import com.zenvyra.dto.response.AiSystemInventoryResponse;
import com.zenvyra.model.AiSystemInventory;
import com.zenvyra.model.EvidenceItemStatus;
import com.zenvyra.model.EvidenceItemType;
import com.zenvyra.model.User;
import com.zenvyra.repository.AiSystemInventoryRepository;
import com.zenvyra.repository.UserRepository;
import org.jsoup.nodes.Document;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiActScannerIntegrationServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private AiSystemInventoryRepository systemRepository;
    @Mock
    private Scanner scanner;
    @Mock
    private EvidenceItemService evidenceItemService;
    @Mock
    private AiActReadinessService readinessService;

    private AiActScannerIntegrationService service;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        service = new AiActScannerIntegrationService(
                userRepository,
                systemRepository,
                scanner,
                evidenceItemService,
                readinessService);
        userDetails = org.springframework.security.core.userdetails.User
                .withUsername("owner@example.com")
                .password("password")
                .roles("USER")
                .build();
    }

    @Test
    void mapsSignalsToInventoryFlags() throws IOException {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .systemName("Support Assistant")
                .userFacingAiInteraction(false)
                .automatedDecisionMaking(false)
                .transparencyNoticePublished(false)
                .humanOversight(false)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(scanner.fetchDocumentForScan("https://example.com/ai")).thenReturn(new Document("https://example.com/ai"));
        when(scanner.detectAiDisclosureSignals(any(Document.class), eq("https://example.com/ai")))
                .thenReturn(AiDisclosureSignals.builder()
                        .chatbotDetected(true)
                        .automatedDecisionMakingDetected(true)
                        .aiTransparencyPageDetected(true)
                        .humanReviewMentioned(true)
                        .aiUseDisclosed(true)
                        .build());
        when(systemRepository.save(any(AiSystemInventory.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(readinessService.system(eq(userDetails), eq("system-1")))
                .thenReturn(AiSystemInventoryResponse.builder().id("system-1").systemName("Support Assistant").build());

        AiSystemInventoryResponse response = service.scanAndMapDisclosures(userDetails, "system-1", "https://example.com/ai");

        assertNotNull(response);
        assertTrue(system.getUserFacingAiInteraction());
        assertTrue(system.getAutomatedDecisionMaking());
        assertTrue(system.getTransparencyNoticePublished());
        assertTrue(system.getHumanOversight());
        verify(systemRepository, times(1)).save(system);
    }

    @Test
    void createsEvidenceItemsForDetectedSignals() throws IOException {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .systemName("Support Assistant")
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(scanner.fetchDocumentForScan("https://example.com/ai")).thenReturn(new Document("https://example.com/ai"));
        when(scanner.detectAiDisclosureSignals(any(Document.class), eq("https://example.com/ai")))
                .thenReturn(AiDisclosureSignals.builder()
                        .chatbotDetected(true)
                        .automatedDecisionMakingDetected(true)
                        .aiTransparencyPageDetected(true)
                        .modelOrProviderMentioned(true)
                        .humanReviewMentioned(true)
                        .detectedEvidence(List.of("snippet at https://example.com/ai"))
                        .build());
        when(systemRepository.save(any(AiSystemInventory.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(readinessService.system(eq(userDetails), eq("system-1")))
                .thenReturn(AiSystemInventoryResponse.builder().id("system-1").build());

        service.scanAndMapDisclosures(userDetails, "system-1", "https://example.com/ai");

        ArgumentCaptor<CreateEvidenceItemRequest> captor = ArgumentCaptor.forClass(CreateEvidenceItemRequest.class);
        verify(evidenceItemService, times(5)).create(eq(userDetails), captor.capture());
        List<CreateEvidenceItemRequest> requests = captor.getAllValues();
        assertEquals(5, requests.size());
        assertTrue(requests.stream().anyMatch(r -> r.getTitle().contains("chatbot")));
        assertTrue(requests.stream().anyMatch(r -> r.getTitle().contains("Automated")));
        assertTrue(requests.stream().anyMatch(r -> r.getTitle().contains("transparency")));
        assertTrue(requests.stream().anyMatch(r -> r.getTitle().contains("provider")));
        assertTrue(requests.stream().anyMatch(r -> r.getTitle().contains("Human")));
        requests.forEach(r -> {
            assertEquals(EvidenceItemType.SCANNER_FINDING, r.getType());
            assertEquals(EvidenceItemStatus.UPLOADED, r.getStatus());
            assertEquals("system-1", r.getSystemId());
            assertNotNull(r.getFileUrl());
        });
    }

    @Test
    void infersProviderWhenBlank() throws IOException {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .systemName("Support Assistant")
                .provider(null)
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(scanner.fetchDocumentForScan("https://example.com/ai")).thenReturn(new Document("https://example.com/ai"));
        when(scanner.detectAiDisclosureSignals(any(Document.class), eq("https://example.com/ai")))
                .thenReturn(AiDisclosureSignals.builder()
                        .modelOrProviderMentioned(true)
                        .detectedEvidence(List.of("Powered by OpenAI GPT-4"))
                        .build());
        when(systemRepository.save(any(AiSystemInventory.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(readinessService.system(eq(userDetails), eq("system-1")))
                .thenReturn(AiSystemInventoryResponse.builder().id("system-1").build());

        service.scanAndMapDisclosures(userDetails, "system-1", "https://example.com/ai");

        assertEquals("OpenAI", system.getProvider());
    }

    @Test
    void doesNotOverwriteExistingProvider() throws IOException {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .systemName("Support Assistant")
                .provider("Anthropic")
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(scanner.fetchDocumentForScan("https://example.com/ai")).thenReturn(new Document("https://example.com/ai"));
        when(scanner.detectAiDisclosureSignals(any(Document.class), eq("https://example.com/ai")))
                .thenReturn(AiDisclosureSignals.builder()
                        .modelOrProviderMentioned(true)
                        .detectedEvidence(List.of("Powered by OpenAI"))
                        .build());
        when(systemRepository.save(any(AiSystemInventory.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(readinessService.system(eq(userDetails), eq("system-1")))
                .thenReturn(AiSystemInventoryResponse.builder().id("system-1").build());

        service.scanAndMapDisclosures(userDetails, "system-1", "https://example.com/ai");

        assertEquals("Anthropic", system.getProvider());
    }

    @Test
    void noEvidenceCreatedWhenNoSignals() throws IOException {
        User user = User.builder().id("user-1").email("owner@example.com").build();
        AiSystemInventory system = AiSystemInventory.builder()
                .id("system-1")
                .userId("user-1")
                .systemName("Support Assistant")
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(user));
        when(systemRepository.findById("system-1")).thenReturn(Optional.of(system));
        when(scanner.fetchDocumentForScan("https://example.com")).thenReturn(new Document("https://example.com"));
        when(scanner.detectAiDisclosureSignals(any(Document.class), eq("https://example.com")))
                .thenReturn(AiDisclosureSignals.builder().build());
        when(systemRepository.save(any(AiSystemInventory.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(readinessService.system(eq(userDetails), eq("system-1")))
                .thenReturn(AiSystemInventoryResponse.builder().id("system-1").build());

        service.scanAndMapDisclosures(userDetails, "system-1", "https://example.com");

        verify(evidenceItemService, never()).create(any(UserDetails.class), any(CreateEvidenceItemRequest.class));
        assertFalse(Boolean.TRUE.equals(system.getUserFacingAiInteraction()));
        assertFalse(Boolean.TRUE.equals(system.getAutomatedDecisionMaking()));
    }

    @Test
    void rejectsInvalidUrl() {
        assertThrows(RuntimeException.class,
                () -> service.scanAndMapDisclosures(userDetails, "system-1", "not-a-url"));
    }

    @Test
    void rejectsBlankUrl() {
        assertThrows(RuntimeException.class,
                () -> service.scanAndMapDisclosures(userDetails, "system-1", ""));
    }
}
