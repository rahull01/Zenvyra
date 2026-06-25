package com.zenvyra.controller;

import com.zenvyra.model.ComplianceCertificate;
import com.zenvyra.model.User;
import com.zenvyra.model.Website;
import com.zenvyra.repository.BannerRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteRepository;
import com.zenvyra.service.CertificateService;
import com.zenvyra.service.EmailService;
import com.zenvyra.service.ProofReportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AgencyControllerTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private WebsiteRepository websiteRepository;
    @Mock
    private BannerRepository bannerRepository;
    @Mock
    private ProofReportService proofReportService;
    @Mock
    private EmailService emailService;
    @Mock
    private CertificateService certificateService;

    private AgencyController controller;

    @BeforeEach
    void setUp() {
        controller = new AgencyController(
                userRepository,
                websiteRepository,
                bannerRepository,
                proofReportService,
                emailService,
                certificateService);
    }

    @Test
    void sendClientReportSendsOperationalEmailWhenWebsiteIsAttached() {
        User agency = agencyWithClient(User.AgencyClientSite.builder()
                .id("client-1")
                .clientCompanyName("Client Co")
                .websiteId("site-1")
                .build());
        Website website = Website.builder()
                .id("site-1")
                .url("https://client.example")
                .build();

        when(userRepository.findByEmail("agency@example.com")).thenReturn(Optional.of(agency));
        when(websiteRepository.findById("site-1")).thenReturn(Optional.of(website));

        ResponseEntity<Map<String, Object>> response = controller.sendClientReport(userDetails(), "client-1");

        assertEquals("sent", response.getBody().get("status"));
        assertEquals("agency@example.com", response.getBody().get("recipient"));
        assertEquals("/dashboard/websites/site-1/proof-report", response.getBody().get("reportUrl"));
        verify(emailService).sendAgencyClientReportEmail(
                "agency@example.com",
                "Client Co",
                "https://client.example",
                "/dashboard/websites/site-1/proof-report");
    }

    @Test
    void sendClientReportWithoutWebsiteDoesNotPretendSuccess() {
        User agency = agencyWithClient(User.AgencyClientSite.builder()
                .id("client-1")
                .clientCompanyName("Client Co")
                .build());

        when(userRepository.findByEmail("agency@example.com")).thenReturn(Optional.of(agency));

        ResponseEntity<Map<String, Object>> response = controller.sendClientReport(userDetails(), "client-1");

        assertEquals("needs_website", response.getBody().get("status"));
        verify(emailService, never()).sendAgencyClientReportEmail(
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString());
    }

    @Test
    void issueClientCertificateIssuesCertificateWhenWebsiteIsAttached() {
        User agency = agencyWithClient(User.AgencyClientSite.builder()
                .id("client-1")
                .clientCompanyName("Client Co")
                .websiteId("site-1")
                .build());
        ComplianceCertificate certificate = ComplianceCertificate.builder()
                .id("cert-1")
                .websiteId("site-1")
                .websiteUrl("https://client.example")
                .build();

        when(userRepository.findByEmail("agency@example.com")).thenReturn(Optional.of(agency));
        when(certificateService.issueCertificate("agency@example.com", "site-1")).thenReturn(certificate);

        ResponseEntity<Map<String, Object>> response = controller.issueClientCertificate(userDetails(), "client-1");

        assertEquals("issued", response.getBody().get("status"));
        assertEquals("cert-1", response.getBody().get("certificateId"));
        assertEquals("/verify/site-1", response.getBody().get("certificateUrl"));
        verify(emailService).sendCertificateIssuedEmail(
                "agency@example.com",
                "https://client.example",
                "/verify/site-1");
    }

    @Test
    void issueClientCertificateWithoutWebsiteDoesNotPretendSuccess() {
        User agency = agencyWithClient(User.AgencyClientSite.builder()
                .id("client-1")
                .clientCompanyName("Client Co")
                .build());

        when(userRepository.findByEmail("agency@example.com")).thenReturn(Optional.of(agency));

        ResponseEntity<Map<String, Object>> response = controller.issueClientCertificate(userDetails(), "client-1");

        assertEquals("needs_website", response.getBody().get("status"));
        verify(certificateService, never()).issueCertificate(
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString());
    }

    private User agencyWithClient(User.AgencyClientSite clientSite) {
        return User.builder()
                .id("agency-1")
                .email("agency@example.com")
                .accountType("AGENCY")
                .agencyClientSites(List.of(clientSite))
                .build();
    }

    private UserDetails userDetails() {
        return org.springframework.security.core.userdetails.User
                .withUsername("agency@example.com")
                .password("password")
                .roles("USER")
                .build();
    }
}
