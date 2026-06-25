package com.zenvyra.service;

import com.zenvyra.dto.request.CaptureScannerLeadRequest;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.ScannerLead;
import com.zenvyra.repository.ScannerLeadRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ScannerLeadServiceTest {

    @Mock
    private ScannerLeadRepository scannerLeadRepository;

    private ScannerLeadService service;

    @BeforeEach
    void setUp() {
        service = new ScannerLeadService(scannerLeadRepository);
    }

    @Test
    void capturesNewScannerLead() {
        CaptureScannerLeadRequest request = new CaptureScannerLeadRequest();
        request.setFullName("Jane Buyer");
        request.setEmail("Jane@Example.com");
        request.setWebsiteUrl("example.com/");
        request.setReadinessScore(122.0);
        request.setIssueCount(4);
        request.setDesiredPath("proof_report_unlock");

        when(scannerLeadRepository.findByEmailIgnoreCaseAndWebsiteUrl("jane@example.com", "https://example.com"))
                .thenReturn(Optional.empty());
        when(scannerLeadRepository.save(org.mockito.ArgumentMatchers.any(ScannerLead.class)))
                .thenAnswer(invocation -> {
                    ScannerLead lead = invocation.getArgument(0);
                    lead.setId("lead-1");
                    return lead;
                });

        Map<String, Object> response = service.capture(request);

        ArgumentCaptor<ScannerLead> captor = ArgumentCaptor.forClass(ScannerLead.class);
        verify(scannerLeadRepository).save(captor.capture());
        ScannerLead saved = captor.getValue();

        assertEquals("captured", response.get("status"));
        assertEquals("lead-1", response.get("leadId"));
        assertEquals("jane@example.com", saved.getEmail());
        assertEquals("https://example.com", saved.getWebsiteUrl());
        assertEquals(100.0, saved.getReadinessScore());
        assertEquals(4, saved.getIssueCount());
        assertEquals("free_privacy_scanner", saved.getSource());
        assertEquals("CAPTURED", saved.getStatus());
        assertNotNull(saved.getUpdatedAt());
    }

    @Test
    void duplicateScannerLeadUpdatesExistingRecord() {
        CaptureScannerLeadRequest request = new CaptureScannerLeadRequest();
        request.setEmail("buyer@example.com");
        request.setWebsiteUrl("https://example.com");
        request.setReadinessScore(71.0);

        ScannerLead existing = ScannerLead.builder()
                .id("lead-existing")
                .email("buyer@example.com")
                .websiteUrl("https://example.com")
                .readinessScore(20.0)
                .build();

        when(scannerLeadRepository.findByEmailIgnoreCaseAndWebsiteUrl("buyer@example.com", "https://example.com"))
                .thenReturn(Optional.of(existing));
        when(scannerLeadRepository.save(existing)).thenReturn(existing);

        service.capture(request);

        assertEquals(71.0, existing.getReadinessScore());
        assertEquals("CAPTURED", existing.getStatus());
        verify(scannerLeadRepository).save(existing);
    }

    @Test
    void invalidEmailIsRejected() {
        CaptureScannerLeadRequest request = new CaptureScannerLeadRequest();
        request.setEmail("not-email");
        request.setWebsiteUrl("https://example.com");

        assertThrows(ApiException.class, () -> service.capture(request));
    }
}
