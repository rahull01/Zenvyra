package com.zenvyra.controller;

import com.zenvyra.dto.request.AiActEvidenceWebhookRequest;
import com.zenvyra.dto.request.CreateEvidenceItemRequest;
import com.zenvyra.dto.response.AiSystemInventoryResponse;
import com.zenvyra.dto.response.EvidenceItemResponse;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.CounselReviewStatus;
import com.zenvyra.model.EvidenceItemStatus;
import com.zenvyra.model.EvidenceItemType;
import com.zenvyra.model.User;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.service.AiActReadinessService;
import com.zenvyra.service.EvidenceItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * External AI Act endpoints intended for API key authentication
 * ({@code sk_live_...}). Scope enforcement is performed upstream in
 * {@link com.zenvyra.security.ApiKeyAuthenticationFilter}; controllers
 * additionally translate the API key principal (userId) into a
 * {@link UserDetails} backed by the owner's email so the existing
 * {@link EvidenceItemService} and {@link AiActReadinessService} can
 * resolve the user via their email-based lookup.
 */
@RestController
@RequestMapping("/v1/external/ai-act")
@RequiredArgsConstructor
@Slf4j
public class ExternalAiActController {

    private final EvidenceItemService evidenceItemService;
    private final AiActReadinessService aiActReadinessService;
    private final UserRepository userRepository;

    @PostMapping("/evidence")
    public ResponseEntity<EvidenceItemResponse> createEvidence(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody AiActEvidenceWebhookRequest request) {
        ensureApiKeyContext();
        UserDetails userDetails = resolveUserDetails(userId);
        CreateEvidenceItemRequest createRequest = CreateEvidenceItemRequest.builder()
                .systemId(request.getSystemId())
                .type(parseType(request.getType()))
                .status(parseStatus(request.getStatus()))
                .title(request.getTitle())
                .description(request.getDescription())
                .fileUrl(request.getFileUrl())
                .fileName(request.getFileName())
                .owner(request.getOwner())
                .counselReviewStatus(CounselReviewStatus.NOT_REQUIRED)
                .dueDate(request.getDueDate())
                .build();
        EvidenceItemResponse response = evidenceItemService.create(userDetails, createRequest);
        if (request.getExternalReferenceId() != null) {
            log.info("External evidence created externalReferenceId={} evidenceId={}",
                    request.getExternalReferenceId(), response.getId());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/systems")
    public List<AiSystemInventoryResponse> listSystems(@AuthenticationPrincipal String userId) {
        ensureApiKeyContext();
        UserDetails userDetails = resolveUserDetails(userId);
        return aiActReadinessService.systems(userDetails);
    }

    private UserDetails resolveUserDetails(String userId) {
        if (userId == null || userId.isBlank()) {
            throw ApiException.unauthorized("API key principal missing");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.unauthorized("API key user not found"));
        return org.springframework.security.core.userdetails.User.withUsername(user.getEmail())
                .password("")
                .roles("USER")
                .build();
    }

    private static void ensureApiKeyContext() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getAuthorities() == null) {
            return;
        }
        boolean hasApiRole = auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_API".equals(a.getAuthority())
                        || a instanceof SimpleGrantedAuthority sga && "ROLE_API".equals(sga.getAuthority()));
        if (!hasApiRole) {
            // Authenticated but not via an API key — surface as forbidden so a
            // misconfigured JWT-only caller cannot exercise the external route.
            throw ApiException.forbidden("This endpoint requires API key authentication");
        }
    }

    private static EvidenceItemType parseType(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return EvidenceItemType.valueOf(value.trim().toUpperCase(java.util.Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw ApiException.badRequest("Unknown evidence type: " + value);
        }
    }

    private static EvidenceItemStatus parseStatus(String value) {
        if (value == null || value.isBlank()) {
            return EvidenceItemStatus.REQUESTED;
        }
        try {
            return EvidenceItemStatus.valueOf(value.trim().toUpperCase(java.util.Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw ApiException.badRequest("Unknown evidence status: " + value);
        }
    }
}
