package com.zenvyra.service;

import com.zenvyra.dto.request.AiSystemInventoryRequest;
import com.zenvyra.dto.response.AiActImportResult;
import com.zenvyra.dto.response.AiSystemInventoryResponse;
import com.zenvyra.exception.ApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiActImportServiceTest {

    @Mock
    private AiActReadinessService readinessService;

    private AiActImportService service;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        service = new AiActImportService(readinessService);
        userDetails = org.springframework.security.core.userdetails.User
                .withUsername("owner@example.com")
                .password("password")
                .roles("USER")
                .build();
    }

    @Test
    void importsValidRowsAndCollectsErrorsForInvalidOnes() {
        String csv = String.join("\n",
                "systemName,purpose,euUsersAffected,countries,lastReviewedAt",
                "Support Assistant,Customer support,true,\"DE,FR\",2026-01-15T10:00:00",
                ",Missing name,true,DE,",
                "Risk Engine,Risk scoring,not-a-bool,DE,");
        when(readinessService.create(any(), any(AiSystemInventoryRequest.class)))
                .thenAnswer(invocation -> {
                    AiSystemInventoryRequest req = invocation.getArgument(1);
                    return AiSystemInventoryResponse.builder()
                            .id("sys-" + req.getSystemName())
                            .systemName(req.getSystemName())
                            .build();
                });

        AiActImportResult result = service.importCsv(userDetails, stream(csv));

        assertEquals(1, result.getImportedCount());
        assertEquals(2, result.getFailedCount());
        assertEquals(1, result.getSystems().size());
        assertEquals("Support Assistant", result.getSystems().get(0).getSystemName());

        // Row 3 had missing systemName, row 4 had bad boolean
        assertEquals(3, result.getErrors().get(0).getRowNumber());
        assertNull(result.getErrors().get(0).getSystemName());
        assertTrue(result.getErrors().get(0).getMessage().contains("systemName"));

        assertEquals(4, result.getErrors().get(1).getRowNumber());
        assertEquals("Risk Engine", result.getErrors().get(1).getSystemName());
        assertTrue(result.getErrors().get(1).getMessage().contains("Invalid boolean"));

        // Captured request verifies column mapping for the successful row.
        ArgumentCaptor<AiSystemInventoryRequest> captor = ArgumentCaptor.forClass(AiSystemInventoryRequest.class);
        verify(readinessService, times(1)).create(any(), captor.capture());
        AiSystemInventoryRequest sent = captor.getValue();
        assertEquals("Support Assistant", sent.getSystemName());
        assertEquals("Customer support", sent.getPurpose());
        assertEquals(Boolean.TRUE, sent.getEuUsersAffected());
        assertEquals(List.of("DE", "FR"), sent.getCountries());
        assertNotNull(sent.getLastReviewedAt());
    }

    @Test
    void emptyCsvReturnsZeroCounts() {
        AiActImportResult result = service.importCsv(userDetails, stream(""));
        assertEquals(0, result.getImportedCount());
        assertEquals(0, result.getFailedCount());
        assertTrue(result.getSystems().isEmpty());
        assertTrue(result.getErrors().isEmpty());
    }

    @Test
    void csvWithoutHeaderSystemNameColumnIsRejected() {
        String csv = "name,purpose\nFoo,Bar";
        ApiException ex = assertThrows(ApiException.class,
                () -> service.importCsv(userDetails, stream(csv)));
        assertTrue(ex.getMessage().contains("systemName"));
    }

    @Test
    void rejectsNullStream() {
        assertThrows(ApiException.class, () -> service.importCsv(userDetails, null));
    }

    @Test
    void rejectsNullUserDetails() {
        assertThrows(ApiException.class,
                () -> service.importCsv(null, stream("systemName\nFoo")));
    }

    @Test
    void skippedBlankRowsDoNotCount() {
        String csv = "systemName,purpose\nSupport Assistant,Help\n\n\n,Empty name\n";
        when(readinessService.create(any(), any(AiSystemInventoryRequest.class)))
                .thenAnswer(invocation -> {
                    AiSystemInventoryRequest req = invocation.getArgument(1);
                    return AiSystemInventoryResponse.builder()
                            .id("sys-x")
                            .systemName(req.getSystemName())
                            .build();
                });

        AiActImportResult result = service.importCsv(userDetails, stream(csv));

        assertEquals(1, result.getImportedCount());
        assertEquals(1, result.getFailedCount());
        // The blank rows in the middle should not produce errors.
        long nonEmptyErrors = result.getErrors().stream()
                .filter(e -> e.getRowNumber() == 5)
                .count();
        assertEquals(1, nonEmptyErrors);
    }

    @Test
    void handlesQuotedFieldsWithCommas() {
        String csv = "systemName,purpose,countries\n\"Support, AI\",\"Help, sales\",DE";
        when(readinessService.create(any(), any(AiSystemInventoryRequest.class)))
                .thenAnswer(invocation -> {
                    AiSystemInventoryRequest req = invocation.getArgument(1);
                    return AiSystemInventoryResponse.builder()
                            .id("sys-1")
                            .systemName(req.getSystemName())
                            .build();
                });

        AiActImportResult result = service.importCsv(userDetails, stream(csv));

        assertEquals(1, result.getImportedCount());
        assertEquals(0, result.getFailedCount());
        ArgumentCaptor<AiSystemInventoryRequest> captor = ArgumentCaptor.forClass(AiSystemInventoryRequest.class);
        verify(readinessService).create(any(), captor.capture());
        assertEquals("Support, AI", captor.getValue().getSystemName());
        assertEquals("Help, sales", captor.getValue().getPurpose());
    }

    @Test
    void parseLineHandlesEscapedQuotes() {
        List<String> fields = AiActImportService.parseLine("\"He said \"\"hi\"\"\",plain");
        assertEquals(2, fields.size());
        assertEquals("He said \"hi\"", fields.get(0));
        assertEquals("plain", fields.get(1));
    }

    @Test
    void parseLineHandlesSimpleCsv() {
        List<String> fields = AiActImportService.parseLine("a,b,c");
        assertEquals(List.of("a", "b", "c"), fields);
    }

    @Test
    void missingReadinessFailureAddsError() {
        String csv = "systemName,purpose\nFoo,Bar";
        when(readinessService.create(any(), any(AiSystemInventoryRequest.class)))
                .thenThrow(ApiException.badRequest("duplicate system"));

        AiActImportResult result = service.importCsv(userDetails, stream(csv));

        assertEquals(0, result.getImportedCount());
        assertEquals(1, result.getFailedCount());
        assertEquals(2, result.getErrors().get(0).getRowNumber());
        assertTrue(result.getErrors().get(0).getMessage().contains("duplicate"));
        assertFalse(result.getSystems().isEmpty() == false);
    }

    private static InputStream stream(String csv) {
        return new ByteArrayInputStream(csv.getBytes(StandardCharsets.UTF_8));
    }
}
