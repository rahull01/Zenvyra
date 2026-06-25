package com.zenvyra.controller;

import com.zenvyra.exception.ApiException;
import com.zenvyra.model.User;
import com.zenvyra.model.PlanType;
import com.zenvyra.model.Website;
import com.zenvyra.repository.BannerRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteRepository;
import com.zenvyra.security.RequiresCompliancePlan;
import com.zenvyra.service.EmailService;
import com.zenvyra.service.CertificateService;
import com.zenvyra.service.ProofReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/agency")
@RequiredArgsConstructor
public class AgencyController {

    private final UserRepository userRepository;
    private final WebsiteRepository websiteRepository;
    private final BannerRepository bannerRepository;
    private final ProofReportService proofReportService;
    private final EmailService emailService;
    private final CertificateService certificateService;

    @GetMapping("/clients")
    public ResponseEntity<Map<String, Object>> getClientSites(@AuthenticationPrincipal UserDetails userDetails) {
        User agency = requireAgency(userDetails);
        List<Map<String, Object>> clients = clientSites(agency).stream()
                .map(site -> {
                    Website website = site.getWebsiteId() == null
                            ? null
                            : websiteRepository.findById(site.getWebsiteId()).orElse(null);
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id", site.getId());
                    item.put("domainName", site.getDomainName());
                    item.put("bundleTokenId", site.getBundleTokenId());
                    item.put("clientCompanyName", site.getClientCompanyName());
                    item.put("websiteId", site.getWebsiteId());
                    item.put("bannerId", site.getBannerId());
                    item.put("branding", site.getBranding());
                    item.put("complianceScore", website != null && website.getComplianceScore() != null ? website.getComplianceScore() : 0);
                    item.put("openIssues", website != null && website.getIssues() != null
                            ? website.getIssues().stream().filter(issue -> !issue.getFixed()).count()
                            : 0);
                    item.put("lastScanAt", website != null ? website.getLastScanAt() : null);
                    item.put("bannerActive", site.getBannerId() != null && bannerRepository.findById(site.getBannerId())
                            .map(banner -> "active".equalsIgnoreCase(banner.getStatus()))
                            .orElse(false));
                    return item;
                })
                .toList();
        return ResponseEntity.ok(Map.of(
                "accountType", agency.getAccountType(),
                "clients", clients
        ));
    }

    @PostMapping("/clients")
    @RequiresCompliancePlan(value = PlanType.AGENCY, feature = "WHITE_LABEL")
    public ResponseEntity<User.AgencyClientSite> createClientSite(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody User.AgencyClientSite request) {
        User agency = requireAgency(userDetails);
        List<User.AgencyClientSite> sites = new ArrayList<>(clientSites(agency));
        User.AgencyClientSite site = User.AgencyClientSite.builder()
                .id("client_" + System.currentTimeMillis())
                .domainName(request.getDomainName())
                .clientCompanyName(request.getClientCompanyName())
                .bundleTokenId(request.getBundleTokenId())
                .websiteId(request.getWebsiteId())
                .bannerId(request.getBannerId())
                .branding(request.getBranding())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        sites.add(site);
        agency.setAgencyClientSites(sites);
        agency.setUpdatedAt(LocalDateTime.now());
        userRepository.save(agency);
        return ResponseEntity.ok(site);
    }

    @PutMapping("/clients/{clientId}")
    @RequiresCompliancePlan(value = PlanType.AGENCY, feature = "WHITE_LABEL")
    public ResponseEntity<User.AgencyClientSite> updateClientSite(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String clientId,
            @RequestBody User.AgencyClientSite update) {
        User agency = requireAgency(userDetails);
        List<User.AgencyClientSite> sites = new ArrayList<>(clientSites(agency));
        User.AgencyClientSite site = sites.stream()
                .filter(item -> clientId.equals(item.getId()))
                .findFirst()
                .orElseThrow(() -> ApiException.notFound("Agency client site"));

        if (update.getDomainName() != null) site.setDomainName(update.getDomainName());
        if (update.getClientCompanyName() != null) site.setClientCompanyName(update.getClientCompanyName());
        if (update.getBundleTokenId() != null) site.setBundleTokenId(update.getBundleTokenId());
        if (update.getWebsiteId() != null) site.setWebsiteId(update.getWebsiteId());
        if (update.getBannerId() != null) site.setBannerId(update.getBannerId());
        if (update.getBranding() != null) site.setBranding(update.getBranding());
        site.setUpdatedAt(LocalDateTime.now());

        agency.setAgencyClientSites(sites);
        agency.setUpdatedAt(LocalDateTime.now());
        userRepository.save(agency);
        return ResponseEntity.ok(site);
    }

    @PostMapping("/clients/{clientId}/proof-pack")
    @RequiresCompliancePlan(value = PlanType.AGENCY, feature = "WHITE_LABEL")
    public ResponseEntity<Map<String, Object>> generateProofPack(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String clientId) {
        User.AgencyClientSite site = requireClientSite(userDetails, clientId);
        if (site.getWebsiteId() == null) {
            return ResponseEntity.ok(Map.of(
                    "status", "needs_website",
                    "message", "Attach a website before generating a proof pack."
            ));
        }
        Map<String, Object> proofPack = new LinkedHashMap<>(proofReportService.proofPack(site.getWebsiteId()));
        proofPack.put("status", "ready");
        proofPack.put("clientId", clientId);
        return ResponseEntity.ok(proofPack);
    }

    @PostMapping("/clients/{clientId}/send-report")
    @RequiresCompliancePlan(value = PlanType.AGENCY, feature = "WHITE_LABEL")
    public ResponseEntity<Map<String, Object>> sendClientReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String clientId) {
        User agency = requireAgency(userDetails);
        User.AgencyClientSite site = clientSites(agency).stream()
                .filter(item -> clientId.equals(item.getId()))
                .findFirst()
                .orElseThrow(() -> ApiException.notFound("Agency client site"));
        if (site.getWebsiteId() == null || site.getWebsiteId().isBlank()) {
            return ResponseEntity.ok(Map.of(
                    "status", "needs_website",
                    "clientId", clientId,
                    "message", "Attach a website before sending a monthly proof report."
            ));
        }

        Website website = websiteRepository.findById(site.getWebsiteId())
                .orElseThrow(() -> ApiException.notFound("Website"));
        String reportUrl = "/dashboard/websites/" + website.getId() + "/proof-report";
        emailService.sendAgencyClientReportEmail(
                agency.getEmail(),
                site.getClientCompanyName(),
                website.getUrl(),
                reportUrl);
        return ResponseEntity.ok(Map.of(
                "status", "sent",
                "clientId", clientId,
                "clientCompanyName", site.getClientCompanyName() == null ? "Client" : site.getClientCompanyName(),
                "recipient", agency.getEmail(),
                "reportUrl", reportUrl,
                "message", "Agency client proof report email sent to the agency account."
        ));
    }

    @PostMapping("/clients/{clientId}/issue-certificate")
    @RequiresCompliancePlan(value = PlanType.AGENCY, feature = "WHITE_LABEL")
    public ResponseEntity<Map<String, Object>> issueClientCertificate(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String clientId) {
        User agency = requireAgency(userDetails);
        User.AgencyClientSite site = clientSites(agency).stream()
                .filter(item -> clientId.equals(item.getId()))
                .findFirst()
                .orElseThrow(() -> ApiException.notFound("Agency client site"));
        if (site.getWebsiteId() == null || site.getWebsiteId().isBlank()) {
            return ResponseEntity.ok(Map.of(
                    "status", "needs_website",
                    "clientId", clientId,
                    "message", "Attach a website before issuing a public certificate."
            ));
        }

        var certificate = certificateService.issueCertificate(agency.getEmail(), site.getWebsiteId());
        String certificateUrl = "/verify/" + certificate.getWebsiteId();
        emailService.sendCertificateIssuedEmail(agency.getEmail(), certificate.getWebsiteUrl(), certificateUrl);
        return ResponseEntity.ok(Map.of(
                "status", "issued",
                "clientId", clientId,
                "certificateId", certificate.getId() == null ? "" : certificate.getId(),
                "certificateUrl", certificateUrl,
                "message", "Public readiness certificate issued."
        ));
    }

    private User requireAgency(UserDetails userDetails) {
        if (userDetails == null) {
            throw ApiException.unauthorized("Authentication required");
        }
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> ApiException.unauthorized("User not found"));
        if (!"AGENCY".equalsIgnoreCase(user.getAccountType())) {
            throw ApiException.forbidden("Agency account required");
        }
        return user;
    }

    private User.AgencyClientSite requireClientSite(UserDetails userDetails, String clientId) {
        User agency = requireAgency(userDetails);
        return clientSites(agency).stream()
                .filter(item -> clientId.equals(item.getId()))
                .findFirst()
                .orElseThrow(() -> ApiException.notFound("Agency client site"));
    }

    private List<User.AgencyClientSite> clientSites(User agency) {
        return agency.getAgencyClientSites() == null ? List.of() : agency.getAgencyClientSites();
    }
}
