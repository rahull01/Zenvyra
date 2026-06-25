package com.zenvyra.client;

import com.zenvyra.exception.ApiException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class OpenAiClient {

    @Value("${openai.api-key}")
    private String apiKey;

    @Value("${openai.model}")
    private String model;

    private final ObjectMapper objectMapper;

    private WebClient getWebClient() {
        return WebClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public String generateCompletion(String systemPrompt, String userPrompt, int maxTokens) {
        requireOpenAiConfigured();
        try {
            Map<String, Object> request = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", userPrompt)),
                    "max_tokens", maxTokens,
                    "temperature", 0.7);

            String response = getWebClient().post()
                    .uri("/chat/completions")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonResponse = objectMapper.readTree(response);
            return jsonResponse.get("choices").get(0).get("message").get("content").asText();

        } catch (Exception e) {
            log.error("OpenAI API call failed", e);
            throw ApiException.internalError("AI service temporarily unavailable");
        }
    }

    public String generatePolicy(String type, String companyName, String industry, String language) {
        String systemPrompt = "You are a legal compliance expert specializing in GDPR, CCPA, and global privacy laws.";

        String userPrompt = String.format("""
                Generate a comprehensive %s policy for %s, a %s company.
                Language: %s

                Requirements:
                1. GDPR compliant if applicable
                2. CCPA compliant if applicable
                3. Professional but easy to understand
                4. Include all required legal clauses
                5. Use this exact Last Updated date: %s
                6. Use proper HTML formatting with sections

                Generate complete HTML policy.
                """, type, companyName, industry, language, LocalDate.now());

        return generateCompletion(systemPrompt, userPrompt, 4000);
    }

    public String analyzeWebsiteCompliance(String url, String htmlContent, List<String> issues) {
        String systemPrompt = "You are a compliance auditing expert. Analyze websites for legal and security compliance.";

        String userPrompt = String.format("""
                Analyze compliance for website: %s

                Issues Found: %s

                Provide:
                1. Detailed analysis of each issue
                2. Risk assessment (Low/Medium/High/Critical)
                3. Specific remediation steps
                4. Compliance framework references (GDPR, CCPA, etc.)

                Format as structured JSON.
                """, url, String.join(", ", issues));

        return generateCompletion(systemPrompt, userPrompt, 3000);
    }

    public String generateFixSuggestion(String issueType, String issueDescription) {
        String systemPrompt = "You are a technical compliance expert. Provide specific code and configuration fixes.";

        String userPrompt = String.format("""
                Issue Type: %s
                Description: %s

                Provide:
                1. Specific fix steps
                2. Code examples if applicable
                3. Testing steps to verify the fix
                4. Prevention tips

                Be concise and actionable.
                """, issueType, issueDescription);

        return generateCompletion(systemPrompt, userPrompt, 2000);
    }

    private void requireOpenAiConfigured() {
        if (apiKey == null || apiKey.isBlank() || apiKey.startsWith("sk-test") || apiKey.equalsIgnoreCase("dummy")) {
            throw ApiException.internalError("OpenAI API key is not configured");
        }
        if (model == null || model.isBlank()) {
            throw ApiException.internalError("OpenAI model is not configured");
        }
    }
}
