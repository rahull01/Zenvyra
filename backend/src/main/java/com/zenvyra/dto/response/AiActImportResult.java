package com.zenvyra.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Aggregated result of an AI Act CSV import operation. Each input row is
 * either mapped to an {@link AiSystemInventoryResponse} in {@link #systems}
 * or recorded as an {@link AiActImportError} in {@link #errors}; processing
 * continues on per-row failures so the caller sees the full picture.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiActImportResult {
    /** Number of rows successfully imported into the inventory. */
    private int importedCount;
    /** Number of rows that failed to import. */
    private int failedCount;
    /** Imported AI systems in the order they were created. */
    private List<AiSystemInventoryResponse> systems;
    /** Row-level errors collected during the import. */
    private List<AiActImportError> errors;
}
