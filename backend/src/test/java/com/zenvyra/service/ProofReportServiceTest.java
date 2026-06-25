package com.zenvyra.service;

import com.zenvyra.exception.ApiException;
import com.zenvyra.model.ScanResult;
import com.zenvyra.model.User;
import com.zenvyra.model.Website;
import com.zenvyra.repository.ScanResultRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProofReportServiceTest {

    @Mock
    private WebsiteRepository websiteRepository;
    @Mock
    private ScanResultRepository scanResultRepository;
    @Mock
    private UserRepository userRepository;

    private ProofReportService service;

    @BeforeEach
    void setUp() {
        service = new ProofReportService(websiteRepository, scanResultRepository, userRepository);
    }

    @Test
    void ownerCanGenerateStructuredProofPack() {
        Website.ComplianceIssue openIssue = Website.ComplianceIssue.builder()
                .title("Cookie consent review needed")
                .category("cookies")
                .severity("high")
                .fixSuggestion("Configure prior consent before analytics load.")
                .fixed(false)
                .build();
        Website.ComplianceIssue fixedIssue = Website.ComplianceIssue.builder()
                .title("Old issue")
                .category("policy")
                .severity("low")
                .fixSuggestion("Already fixed")
                .fixed(true)
                .build();
        Website website = Website.builder()
                .id("site-1")
                .userId("user-1")
                .name("Example")
                .url("https://example.com")
                .monitoringEnabled(true)
                .complianceScore(70.0)
                .issues(List.of(openIssue, fixedIssue))
                .lastScanAt(LocalDateTime.now().minusDays(1))
                .build();
        ScanResult latest = ScanResult.builder()
                .websiteId("site-1")
                .score(84.0)
                .issues(List.of(openIssue, fixedIssue))
                .scannedAt(LocalDateTime.now())
                .build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(User.builder()
                .id("user-1")
                .email("owner@example.com")
                .role("ROLE_USER")
                .build()));
        when(websiteRepository.findById("site-1")).thenReturn(Optional.of(website));
        when(scanResultRepository.findByWebsiteIdOrderByScannedAtDesc("site-1")).thenReturn(List.of(latest));

        Map<String, Object> report = service.proofPackForUser("owner@example.com", "site-1");

        assertEquals(84.0, report.get("readinessScore"));
        assertTrue(report.containsKey("ukGdprPecrChecklist"));
        assertTrue(report.containsKey("usPrivacyChecklist"));
        assertTrue(report.containsKey("trackerCookieInventorySummary"));
        assertTrue(report.containsKey("aiActReadiness"));
        assertEquals("json", report.get("reportFormat"));
        assertEquals("This report is operational readiness evidence, not legal advice or a guarantee of legal compliance.", report.get("disclaimer"));

        List<?> fixPlan = (List<?>) report.get("fixPlan");
        assertEquals(1, fixPlan.size());
        assertFalse(fixPlan.toString().contains("Old issue"));
    }

    @Test
    void nonOwnerCannotGenerateProofPack() {
        when(userRepository.findByEmail("other@example.com")).thenReturn(Optional.of(User.builder()
                .id("user-2")
                .email("other@example.com")
                .role("ROLE_USER")
                .build()));
        when(websiteRepository.findById("site-1")).thenReturn(Optional.of(Website.builder()
                .id("site-1")
                .userId("user-1")
                .build()));

        assertThrows(ApiException.class, () -> service.proofPackForUser("other@example.com", "site-1"));
    }
}
