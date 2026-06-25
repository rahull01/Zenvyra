package com.zenvyra.controller;

import com.zenvyra.dto.request.ConsentAuditLogRequest;
import com.zenvyra.model.ConsentAuditLog;
import com.zenvyra.model.CrossDomainConsentToken;
import com.zenvyra.repository.CrossDomainConsentTokenRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/consent/sync")
@RequiredArgsConstructor
public class CrossDomainConsentController {

    private final CrossDomainConsentTokenRepository repository;
    private final ObjectMapper objectMapper;

    @Value("${app.audit.consent-salt:${JWT_SECRET:dev-consent-audit-salt-change-me}}")
    private String consentAuditSalt;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSyncedConsent(
            @RequestParam String enterpriseConsentKey,
            @RequestParam String anonymousUserId) {
        String maskedId = maskAnonymousId(anonymousUserId);
        return repository.findByEnterpriseConsentKeyAndAnonymousUserId(enterpriseConsentKey, maskedId)
                .map(token -> ResponseEntity.ok(Map.<String, Object>of(
                        "found", true,
                        "consentState", token.getConsentState(),
                        "updatedAt", token.getUpdatedAt()
                )))
                .orElseGet(() -> ResponseEntity.ok(Map.of("found", false)));
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> saveSyncedConsent(@RequestBody ConsentAuditLogRequest request) {
        String key = request.getSiteId();
        String anonymousUserId = maskAnonymousId(request.getAnonymousUserId());
        String consentState = ConsentAuditLog.canonicalConsentState(
                objectMapper,
                request.getConsentState() != null ? request.getConsentState() : request.getChoices());

        CrossDomainConsentToken token = repository.findByEnterpriseConsentKeyAndAnonymousUserId(key, anonymousUserId)
                .orElseGet(CrossDomainConsentToken::new);
        token.setEnterpriseConsentKey(key);
        token.setAnonymousUserId(anonymousUserId);
        token.setConsentState(consentState);
        token.setUpdatedAt(LocalDateTime.now());
        repository.save(token);
        return ResponseEntity.accepted().body(Map.of("status", "accepted"));
    }

    private String maskAnonymousId(String value) {
        return ConsentAuditLog.calculateIntegrityHash("anon", value == null ? "anonymous" : value, "mask", LocalDateTime.of(1970, 1, 1, 0, 0), consentAuditSalt);
    }
}
