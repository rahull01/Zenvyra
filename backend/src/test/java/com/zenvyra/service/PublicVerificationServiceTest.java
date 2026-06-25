package com.zenvyra.service;

import com.zenvyra.dto.response.PublicVerificationResponse;
import com.zenvyra.model.ScanResult;
import com.zenvyra.model.Website;
import com.zenvyra.repository.CertificateRepository;
import com.zenvyra.repository.ScanResultRepository;
import com.zenvyra.repository.WebsiteRepository;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class PublicVerificationServiceTest {

    @Test
    void siteIdValidationAcceptsOnlySafeShortIdentifiers() {
        assertTrue(PublicVerificationService.isValidSiteId("abc123"));
        assertTrue(PublicVerificationService.isValidSiteId("site_123-ABC"));

        assertFalse(PublicVerificationService.isValidSiteId(null));
        assertFalse(PublicVerificationService.isValidSiteId("ab"));
        assertFalse(PublicVerificationService.isValidSiteId("site.123"));
        assertFalse(PublicVerificationService.isValidSiteId("../secret"));
        assertFalse(PublicVerificationService.isValidSiteId("a".repeat(65)));
    }

    @Test
    void badgeStateMappingUsesPublicScoreThresholds() {
        BadgeImageService badgeImageService = new BadgeImageService();

        assertEquals(BadgeImageService.BadgeState.GREEN, badgeImageService.fromScore(90));
        assertEquals(BadgeImageService.BadgeState.GREEN, badgeImageService.fromScore(100));
        assertEquals(BadgeImageService.BadgeState.YELLOW, badgeImageService.fromScore(75));
        assertEquals(BadgeImageService.BadgeState.YELLOW, badgeImageService.fromScore(89.99));
        assertEquals(BadgeImageService.BadgeState.RED, badgeImageService.fromScore(74.99));
    }

    @Test
    void publicPayloadUsesLatestScanAndOmitsPrivateIssueFields() {
        WebsiteRepository websiteRepository = mock(WebsiteRepository.class);
        ScanResultRepository scanResultRepository = mock(ScanResultRepository.class);
        CertificateRepository certificateRepository = mock(CertificateRepository.class);
        PublicVerificationService service = new PublicVerificationService(
                websiteRepository,
                scanResultRepository,
                certificateRepository
        );

        Website.ComplianceIssue issue = Website.ComplianceIssue.builder()
                .category("cookies\ninternal")
                .severity("high")
                .title("Consent banner review needed for privacy@example.com")
                .description("Private scanner details should stay internal")
                .fixSuggestion("Internal operator fix notes")
                .autoFixable(true)
                .fixed(false)
                .build();
        Website website = Website.builder()
                .id("site_123")
                .name("Example Store")
                .url("https://example.com/account?email=customer@example.com")
                .complianceScore(51.0)
                .monitoringEnabled(true)
                .issues(List.of(issue))
                .lastScanAt(LocalDateTime.now().minusDays(10))
                .build();
        ScanResult latestScan = ScanResult.builder()
                .websiteId("site_123")
                .url("https://example.com")
                .score(88.0)
                .issuesCount(1)
                .scannedAt(LocalDateTime.now().minusHours(2))
                .status("success")
                .build();

        when(websiteRepository.findById("site_123")).thenReturn(Optional.of(website));
        when(scanResultRepository.findByWebsiteIdOrderByScannedAtDesc("site_123")).thenReturn(List.of(latestScan));

        PublicVerificationResponse response = service.getPublicVerification("site_123");

        assertEquals(88.0, response.getComplianceScore());
        assertEquals("example.com", response.getSiteDomain());
        assertEquals("active", response.getActiveMonitoringStatus());
        assertEquals("This public certificate is operational readiness evidence, not legal certification or legal advice.", response.getDisclaimer());

        Map<String, Object> publicIssue = response.getIssueSummary().get(0);
        assertEquals("cookies internal", publicIssue.get("category"));
        assertEquals("high", publicIssue.get("severity"));
        assertEquals("Consent banner review needed for [redacted-email]", publicIssue.get("title"));
        assertFalse(publicIssue.containsKey("description"));
        assertFalse(publicIssue.containsKey("fixSuggestion"));
        assertFalse(publicIssue.containsKey("autoFixable"));
    }
}
