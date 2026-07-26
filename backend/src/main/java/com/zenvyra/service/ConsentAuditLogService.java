package com.zenvyra.service;

import com.zenvyra.dto.request.ConsentAuditLogRequest;
import com.zenvyra.model.ConsentAuditLog;
import com.zenvyra.repository.ConsentAuditLogRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ConsentAuditLogService {

    private final ConsentAuditLogRepository consentAuditLogRepository;
    private final ObjectMapper objectMapper;

    @Value("${app.audit.consent-salt:${JWT_SECRET:}}")
    private String consentAuditSalt;

    @PostConstruct
    void validateSalt() {
        if (consentAuditSalt == null || consentAuditSalt.isBlank()) {
            throw new IllegalStateException(
                    "consentAuditSalt is not configured. Set app.audit.consent-salt or JWT_SECRET."
            );
        }
    }

    @Async("consentAuditExecutor")
    public void ingestAsync(ConsentAuditLogRequest request, String resolvedCountry) {
        String siteId = firstNonBlank(request.getSiteId(), request.getBannerId());
        String country = firstNonBlank(request.getCountryCode(), request.getCountry(), resolvedCountry, "XX").toUpperCase();
        Object consentState = request.getConsentState() != null ? request.getConsentState() : request.getChoices();

        ConsentAuditLog auditLog = ConsentAuditLog.builder()
                .siteId(siteId)
                .anonymousUserId(maskAnonymousId(request.getAnonymousUserId()))
                .countryCode(country)
                .consentState(ConsentAuditLog.canonicalConsentState(objectMapper, consentState))
                .timestamp(LocalDateTime.now())
                .build();
        auditLog.seal(consentAuditSalt);
        consentAuditLogRepository.insert(auditLog);
    }

    public long countBySiteId(String siteId) {
        return consentAuditLogRepository.countBySiteId(siteId);
    }

    public long countMarketingOptIns(String siteId) {
        return consentAuditLogRepository.countBySiteIdAndConsentStateContaining(siteId, "\"marketing\":true");
    }

    private String maskAnonymousId(String value) {
        if (value == null || value.isBlank()) {
            return "anonymous";
        }
        return ConsentAuditLog.calculateIntegrityHash("anon", value, "mask", LocalDateTime.of(1970, 1, 1, 0, 0), consentAuditSalt);
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return "";
    }
}
