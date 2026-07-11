package com.zenvyra.controller;

import com.zenvyra.service.AiActExportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AiActExportControllerTest {

    private final AiActExportService exportService = mock(AiActExportService.class);
    private final AiActExportController controller = new AiActExportController(exportService);
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        userDetails = User.withUsername("owner@example.com")
                .password("password")
                .roles("USER")
                .build();
    }

    @Test
    void proofPackPdfReturnsPdfAttachment() {
        byte[] pdf = "%PDF-1.4".getBytes(StandardCharsets.US_ASCII);
        when(exportService.exportFullProofPackPdf(userDetails, "system-1")).thenReturn(pdf);

        ResponseEntity<byte[]> response = controller.proofPackPdf(userDetails, "system-1");

        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        assertEquals(MediaType.APPLICATION_PDF, response.getHeaders().getContentType());
        assertArrayEquals(pdf, response.getBody());
        String disposition = response.getHeaders().getFirst(HttpHeaders.CONTENT_DISPOSITION);
        assertTrue(disposition != null && disposition.contains("ai-act-proof-pack.pdf"));
    }
}
