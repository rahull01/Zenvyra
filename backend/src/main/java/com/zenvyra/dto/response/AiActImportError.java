package com.zenvyra.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Per-row error emitted by {@link AiActImportResult} when a CSV row fails
 * to import. {@code rowNumber} is the 1-based line number in the source
 * CSV (header is row 1, first data row is row 2).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiActImportError {
    /** 1-based CSV line number of the failing row (header counts as row 1). */
    private int rowNumber;
    /** Value of the systemName column for context, or null if missing. */
    private String systemName;
    /** Human-readable failure message. */
    private String message;
}
