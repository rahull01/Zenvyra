package com.zenvyra.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Request payload accepted by POST /v1/external/ai-act/evidence.
 *
 * Used by external integrations to register evidence items against an AI
 * system owned by the API key holder. {@code externalReferenceId} is the
 * caller's idempotency key.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiActEvidenceWebhookRequest {

    @NotBlank(message = "systemId is required")
    private String systemId;

    private String type;

    @NotBlank(message = "title is required")
    private String title;

    private String description;
    private String fileUrl;
    private String fileName;
    private String owner;
    private String status;
    private LocalDate dueDate;

    /** Caller-supplied idempotency key (optional, accepted for traceability). */
    private String externalReferenceId;
}
