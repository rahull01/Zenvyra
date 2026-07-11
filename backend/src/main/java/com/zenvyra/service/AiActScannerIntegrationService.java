package com.zenvyra.service;

import com.zenvyra.agents.scanner.AiDisclosureSignals;
import com.zenvyra.agents.scanner.Scanner;
import com.zenvyra.dto.response.AiSystemInventoryResponse;
import com.zenvyra.exception.ApiException;
import com.zenvyra.model.AiSystemInventory;
import com.zenvyra.model.EvidenceItemStatus;
import com.zenvyra.model.EvidenceItemType;
import com.zenvyra.repository.AiSystemInventoryRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.jsoup.nodes.Document;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AiActScannerIntegrationService {

    private final UserRepository userRepository;
    private final AiSystemInventoryRepository systemRepository;
    private final Scanner scanner;
    private final SafeWebFetchService safeWebFetchService;
    private final EvidenceItemService evidenceItemService;
    private final AiActReadinessService readinessService;

    public AiSystemInventoryResponse scanAndMapDisclosures(UserDetails userDetails, String systemId, String url) {
        if (url == null || url.isBlank()) {
            throw ApiException.badRequest("url is required");
        }
        if (!ValidationUtil.isValidUrl(url)) {
            throw ApiException.badRequest("url is not a valid http(s) URL");
        }

        // Resolve user manually so we can also reuse the inventory entity for updates.
        var user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ApiException("User not found",
                        org.springframework.http.HttpStatus.UNAUTHORIZED, "UNAUTHORIZED"));

        AiSystemInventory system = systemRepository.findById(systemId)
                .orElseThrow(() -> ApiException.notFound("AI system"));
        if (!user.getId().equals(system.getUserId())) {
            throw ApiException.forbidden("Access denied");
        }

        Document doc;
        try {
            doc = safeWebFetchService.fetchDocument(url);
        } catch (IllegalArgumentException e) {
            throw ApiException.badRequest("Unsafe URL: " + e.getMessage());
        } catch (IOException e) {
            throw new ApiException("Failed to fetch URL: " + e.getMessage(),
                    org.springframework.http.HttpStatus.BAD_GATEWAY, "FETCH_FAILED");
        }

        AiDisclosureSignals signals = scanner.detectAiDisclosureSignals(doc, url);

        // Update inventory flags only when the scan produced affirmative evidence.
        if (Boolean.TRUE.equals(signals.isChatbotDetected()) || Boolean.TRUE.equals(signals.isAiUseDisclosed())) {
            system.setUserFacingAiInteraction(true);
        }
        if (Boolean.TRUE.equals(signals.isAutomatedDecisionMakingDetected())) {
            system.setAutomatedDecisionMaking(true);
        }
        if (Boolean.TRUE.equals(signals.isAiTransparencyPageDetected())) {
            system.setTransparencyNoticePublished(true);
        }
        if (Boolean.TRUE.equals(signals.isHumanReviewMentioned())) {
            system.setHumanOversight(true);
        }
        if (Boolean.TRUE.equals(signals.isModelOrProviderMentioned())
                && (system.getProvider() == null || system.getProvider().isBlank())) {
            String inferred = inferProvider(signals);
            if (inferred != null) {
                system.setProvider(inferred);
            }
        }
        system.setUpdatedAt(LocalDateTime.now());
        systemRepository.save(system);

        // Create evidence items for detected signals.
        createEvidenceForSignals(userDetails, system, signals, url);

        return readinessService.system(userDetails, systemId);
    }

    private void createEvidenceForSignals(UserDetails userDetails, AiSystemInventory system,
                                          AiDisclosureSignals signals, String url) {
        if (signals == null) {
            return;
        }
        List<String> evidence = signals.getDetectedEvidence();
        if (evidence == null) {
            evidence = new ArrayList<>();
        }
        if (signals.isChatbotDetected()) {
            evidenceItemService.create(userDetails, buildEvidenceRequest(system.getId(),
                    "AI chatbot or assistant detected", url, evidence));
        }
        if (signals.isAutomatedDecisionMakingDetected()) {
            evidenceItemService.create(userDetails, buildEvidenceRequest(system.getId(),
                    "Automated decision-making language detected", url, evidence));
        }
        if (signals.isAiTransparencyPageDetected()) {
            evidenceItemService.create(userDetails, buildEvidenceRequest(system.getId(),
                    "AI transparency page detected", url, evidence));
        }
        if (signals.isModelOrProviderMentioned()) {
            evidenceItemService.create(userDetails, buildEvidenceRequest(system.getId(),
                    "AI model/provider mentioned", url, evidence));
        }
        if (signals.isHumanReviewMentioned()) {
            evidenceItemService.create(userDetails, buildEvidenceRequest(system.getId(),
                    "Human review language detected", url, evidence));
        }
    }

    private com.zenvyra.dto.request.CreateEvidenceItemRequest buildEvidenceRequest(
            String systemId, String title, String url, List<String> evidence) {
        String description;
        if (evidence == null || evidence.isEmpty()) {
            description = "Detected via public website scan: " + url;
        } else {
            description = "Detected via public website scan of " + url + " — evidence: " + String.join(" | ", evidence);
        }
        return com.zenvyra.dto.request.CreateEvidenceItemRequest.builder()
                .systemId(systemId)
                .type(EvidenceItemType.SCANNER_FINDING)
                .status(EvidenceItemStatus.UPLOADED)
                .title(title)
                .description(description)
                .fileUrl(url)
                .build();
    }

    private String inferProvider(AiDisclosureSignals signals) {
        List<String> evidence = signals.getDetectedEvidence();
        if (evidence == null) {
            return null;
        }
        String haystack = String.join(" ", evidence).toLowerCase();
        if (haystack.contains("openai") || haystack.contains("chatgpt") || haystack.contains("gpt-")) {
            return "OpenAI";
        }
        if (haystack.contains("anthropic") || haystack.contains("claude")) {
            return "Anthropic";
        }
        if (haystack.contains("gemini") || haystack.contains("bard") || haystack.contains("palm")) {
            return "Google";
        }
        if (haystack.contains("llama")) {
            return "Meta";
        }
        if (haystack.contains("mistral") || haystack.contains("mixtral")) {
            return "Mistral";
        }
        if (haystack.contains("copilot")) {
            return "Microsoft";
        }
        if (haystack.contains("deepmind")) {
            return "DeepMind";
        }
        return null;
    }

}
