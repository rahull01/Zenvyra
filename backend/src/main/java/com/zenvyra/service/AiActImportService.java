package com.zenvyra.service;

import com.zenvyra.dto.request.AiSystemInventoryRequest;
import com.zenvyra.dto.response.AiActImportError;
import com.zenvyra.dto.response.AiActImportResult;
import com.zenvyra.dto.response.AiSystemInventoryResponse;
import com.zenvyra.exception.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Parses CSV uploads and bulk-creates AI system inventory records via
 * {@link AiActReadinessService}.
 *
 * <p>CSV format: header row (column order flexible) followed by data rows.
 * Each row must include a non-empty {@code systemName}. All other columns are
 * optional. Booleans accept {@code true}/{@code false} (case-insensitive,
 * trimmed); comma-separated columns ({@code countries},
 * {@code dataCategoriesSentToAi}) are split on {@code ,}; ISO date/time
 * columns are parsed via {@link LocalDateTime#parse(CharSequence)}.
 *
 * <p>Per-row failures are collected, not thrown, so a single malformed row
 * does not abort the import.
 */
@Service
@RequiredArgsConstructor
public class AiActImportService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private final AiActReadinessService readinessService;

    /**
     * Parses a CSV stream and creates an {@link AiSystemInventory} for each
     * well-formed row. Rows that fail validation or creation are recorded as
     * {@link AiActImportError} entries; the result aggregates successes and
     * failures.
     */
    public AiActImportResult importCsv(UserDetails userDetails, InputStream csvInput) {
        if (userDetails == null) {
            throw ApiException.unauthorized("Authentication required");
        }
        if (csvInput == null) {
            throw ApiException.badRequest("CSV input stream is required");
        }

        List<List<String>> rows = readAllRows(csvInput);
        if (rows.isEmpty()) {
            return AiActImportResult.builder()
                    .importedCount(0)
                    .failedCount(0)
                    .systems(List.of())
                    .errors(List.of())
                    .build();
        }

        List<String> header = rows.get(0);
        Map<String, Integer> columnIndex = indexHeader(header);

        Integer nameIdx = columnIndex.get("systemname");
        if (nameIdx == null) {
            throw ApiException.badRequest("CSV header is missing required column: systemName");
        }

        List<AiSystemInventoryResponse> imported = new ArrayList<>();
        List<AiActImportError> errors = new ArrayList<>();

        for (int i = 1; i < rows.size(); i++) {
            List<String> row = rows.get(i);
            if (isBlankRow(row)) {
                continue;
            }
            int rowNumber = i + 1;
            String systemName = blankToNull(safeGet(row, nameIdx));
            try {
                AiSystemInventoryRequest request = buildRequest(row, columnIndex);
                if (request.getSystemName() == null || request.getSystemName().isBlank()) {
                    throw ApiException.badRequest("systemName is required");
                }
                imported.add(readinessService.create(userDetails, request));
            } catch (Exception ex) {
                errors.add(AiActImportError.builder()
                        .rowNumber(rowNumber)
                        .systemName(systemName)
                        .message(ex.getMessage() == null ? "Import failed" : ex.getMessage())
                        .build());
            }
        }

        return AiActImportResult.builder()
                .importedCount(imported.size())
                .failedCount(errors.size())
                .systems(imported)
                .errors(errors)
                .build();
    }

    private AiSystemInventoryRequest buildRequest(List<String> row, Map<String, Integer> columnIndex) {
        AiSystemInventoryRequest.AiSystemInventoryRequestBuilder builder = AiSystemInventoryRequest.builder();
        for (Map.Entry<String, Integer> entry : columnIndex.entrySet()) {
            String column = entry.getKey();
            String value = safeGet(row, entry.getValue());
            if (value == null || value.isBlank()) {
                continue;
            }
            applyColumn(builder, column, value);
        }
        return builder.build();
    }

    private void applyColumn(AiSystemInventoryRequest.AiSystemInventoryRequestBuilder builder, String column, String value) {
        switch (column) {
            case "systemname" -> builder.systemName(value);
            case "purpose" -> builder.purpose(value);
            case "provider" -> builder.provider(value);
            case "modelname" -> builder.modelName(value);
            case "modelproviderversion" -> builder.modelProviderVersion(value);
            case "modelprovidertype" -> builder.modelProviderType(value);
            case "usecase" -> builder.useCase(value);
            case "deploymentcontext" -> builder.deploymentContext(value);
            case "decisionimpactlevel" -> builder.decisionImpactLevel(value);
            case "releasestatus" -> builder.releaseStatus(parseReleaseStatus(value));
            case "humanoversightowner" -> builder.humanOversightOwner(value);
            case "lastreviewedat" -> builder.lastReviewedAt(parseDateTime(value));
            case "nextreviewat" -> builder.nextReviewAt(parseDateTime(value));
            case "countries" -> builder.countries(splitCsvList(value));
            case "datacategoriessenttoai" -> builder.dataCategoriesSentToAi(splitCsvList(value));
            case "customerfacing", "trainingorfinetuning", "euusersaffected",
                 "userfacingaiinteraction", "automateddecisionmaking", "humanoversight",
                 "transparencynoticepublished", "technicaldocumentationready",
                 "riskassessmentcompleted", "logsevidenceretained", "monitoringenabled" ->
                    applyBoolean(builder, column, value);
            default -> { /* ignore unknown columns */ }
        }
    }

    private void applyBoolean(AiSystemInventoryRequest.AiSystemInventoryRequestBuilder builder, String column, String value) {
        Boolean parsed = parseBoolean(value);
        if (parsed == null) {
            return;
        }
        switch (column) {
            case "customerfacing" -> builder.customerFacing(parsed);
            case "trainingorfinetuning" -> builder.trainingOrFineTuning(parsed);
            case "euusersaffected" -> builder.euUsersAffected(parsed);
            case "userfacingaiinteraction" -> builder.userFacingAiInteraction(parsed);
            case "automateddecisionmaking" -> builder.automatedDecisionMaking(parsed);
            case "humanoversight" -> builder.humanOversight(parsed);
            case "transparencynoticepublished" -> builder.transparencyNoticePublished(parsed);
            case "technicaldocumentationready" -> builder.technicalDocumentationReady(parsed);
            case "riskassessmentcompleted" -> builder.riskAssessmentCompleted(parsed);
            case "logsevidenceretained" -> builder.logsEvidenceRetained(parsed);
            case "monitoringenabled" -> builder.monitoringEnabled(parsed);
            default -> { /* no-op */ }
        }
    }

    private static com.zenvyra.model.ReleaseStatus parseReleaseStatus(String value) {
        try {
            return com.zenvyra.model.ReleaseStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw ApiException.badRequest("releaseStatus must be one of DRAFT, PILOT, PRODUCTION, RETIRED");
        }
    }

    private static LocalDateTime parseDateTime(String value) {
        try {
            return LocalDateTime.parse(value.trim(), DATE_FORMATTER);
        } catch (Exception ex) {
            throw ApiException.badRequest("Invalid date/time value: " + value);
        }
    }

    private static Boolean parseBoolean(String value) {
        String trimmed = value.trim().toLowerCase(Locale.ROOT);
        if (trimmed.equals("true") || trimmed.equals("yes") || trimmed.equals("1")) {
            return Boolean.TRUE;
        }
        if (trimmed.equals("false") || trimmed.equals("no") || trimmed.equals("0") || trimmed.isEmpty()) {
            return Boolean.FALSE;
        }
        throw ApiException.badRequest("Invalid boolean value: " + value);
    }

    private static List<String> splitCsvList(String value) {
        if (value.isBlank()) {
            return List.of();
        }
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    private static Map<String, Integer> indexHeader(List<String> header) {
        Map<String, Integer> index = new LinkedHashMap<>();
        for (int i = 0; i < header.size(); i++) {
            String name = header.get(i);
            if (name == null) {
                continue;
            }
            index.put(name.trim().toLowerCase(Locale.ROOT), i);
        }
        return index;
    }

    private static String safeGet(List<String> row, Integer index) {
        if (index == null || index >= row.size()) {
            return null;
        }
        String value = row.get(index);
        return value == null ? null : value.trim();
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }

    private static boolean isBlankRow(List<String> row) {
        for (String cell : row) {
            if (cell != null && !cell.isBlank()) {
                return false;
            }
        }
        return true;
    }

    /**
     * Reads the entire CSV stream into rows, honoring double-quoted fields and
     * embedded commas/newlines. Empty trailing lines are dropped.
     */
    private static List<List<String>> readAllRows(InputStream input) {
        List<List<String>> rows = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(input, StandardCharsets.UTF_8))) {
            StringBuilder current = new StringBuilder();
            List<String> row = new ArrayList<>();
            String line;
            boolean inQuotes = false;
            while ((line = reader.readLine()) != null) {
                if (current.length() > 0) {
                    current.append('\n');
                }
                current.append(line);
                int quoteCount = countChar(current, '"');
                // An odd number of quotes means a quoted field spans this line.
                inQuotes = (quoteCount % 2) != 0;
                if (!inQuotes) {
                    row = parseLine(current.toString());
                    rows.add(row);
                    current.setLength(0);
                    row = new ArrayList<>();
                }
            }
            if (current.length() > 0) {
                row = parseLine(current.toString());
                rows.add(row);
            }
        } catch (IOException ex) {
            throw ApiException.badRequest("Failed to read CSV: " + ex.getMessage());
        }
        // Drop trailing fully-empty rows.
        while (!rows.isEmpty() && isBlankRow(rows.get(rows.size() - 1))) {
            rows.remove(rows.size() - 1);
        }
        return rows;
    }

    private static int countChar(CharSequence value, char target) {
        int count = 0;
        for (int i = 0; i < value.length(); i++) {
            if (value.charAt(i) == target) {
                count++;
            }
        }
        return count;
    }

    /** Parses a single CSV line, honoring double-quoted fields and escaped quotes. */
    static List<String> parseLine(String line) {
        List<String> fields = new ArrayList<>();
        StringBuilder field = new StringBuilder();
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (inQuotes) {
                if (c == '"') {
                    if (i + 1 < line.length() && line.charAt(i + 1) == '"') {
                        field.append('"');
                        i++;
                    } else {
                        inQuotes = false;
                    }
                } else {
                    field.append(c);
                }
            } else {
                if (c == ',') {
                    fields.add(field.toString());
                    field.setLength(0);
                } else if (c == '"') {
                    inQuotes = true;
                } else {
                    field.append(c);
                }
            }
        }
        fields.add(field.toString());
        return fields;
    }
}
