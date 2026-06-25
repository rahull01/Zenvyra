package com.zenvyra.service;

import com.zenvyra.dto.request.CaptureScannerLeadRequest;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.ScannerLead;
import com.zenvyra.repository.ScannerLeadRepository;
import com.zenvyra.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ScannerLeadService {

    private static final Pattern EMAIL = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    private final ScannerLeadRepository scannerLeadRepository;

    public Map<String, Object> capture(CaptureScannerLeadRequest request) {
        if (request.getEmail() == null || !EMAIL.matcher(request.getEmail().trim()).matches()) {
            throw ApiException.badRequest("Valid work email is required");
        }
        if (request.getWebsiteUrl() == null || request.getWebsiteUrl().isBlank()) {
            throw ApiException.badRequest("Website URL is required");
        }

        String email = request.getEmail().trim().toLowerCase();
        String websiteUrl = ValidationUtil.normalizeUrl(request.getWebsiteUrl());
        LocalDateTime now = LocalDateTime.now();

        ScannerLead lead = scannerLeadRepository.findByEmailIgnoreCaseAndWebsiteUrl(email, websiteUrl)
                .orElseGet(() -> ScannerLead.builder()
                        .email(email)
                        .websiteUrl(websiteUrl)
                        .createdAt(now)
                        .build());

        lead.setFullName(trimToNull(request.getFullName()));
        lead.setReadinessScore(clampScore(request.getReadinessScore()));
        lead.setIssueCount(request.getIssueCount() == null ? 0 : Math.max(0, request.getIssueCount()));
        lead.setDesiredPath(trimToNull(request.getDesiredPath()));
        lead.setSource("free_privacy_scanner");
        lead.setStatus("CAPTURED");
        lead.setUpdatedAt(now);

        ScannerLead saved = scannerLeadRepository.save(lead);
        return Map.of(
                "status", "captured",
                "leadId", saved.getId(),
                "message", "Proof report unlock captured."
        );
    }

    private Double clampScore(Double value) {
        if (value == null) {
            return null;
        }
        return Math.max(0.0, Math.min(100.0, value));
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
