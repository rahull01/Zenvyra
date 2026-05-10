package com.complianceai.service;

import com.complianceai.dto.response.ComplianceScoreResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpenAiService {

    @Value("${openai.api-key}")
    private String apiKey;

    @Value("${openai.model}")
    private String model;

    private final WebClient openAiWebClient;
    private final ObjectMapper objectMapper;

    public String generatePolicy(String type, String companyName, String industry, String language) {
        String prompt = String.format("""
                Generate a comprehensive %s policy for %s, a %s company.
                Language: %s

                Requirements:
                1. GDPR compliant if applicable
                2. Professional but easy to understand
                3. Include all required legal clauses
                4. Add "Last Updated" date placeholder

                Generate complete HTML policy with proper sections.
                """, type, companyName, industry, language);

        return callOpenAi(prompt);
    }

    public String analyzeCompliance(String url, ComplianceScoreResponse scanResult) {
        String prompt = String.format("""
                Analyze compliance for website: %s

                Current Score: %d/100
                Issues Found: %d

                Provide detailed analysis and actionable recommendations.
                Format as JSON with 'analysis' and 'recommendations' fields.
                """, url, scanResult.getScore(), scanResult.getIssues().size());

        return callOpenAi(prompt);
    }

    private String callOpenAi(String prompt) {
        try {
            Map<String, Object> request = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of("role", "system", "content", "You are a legal compliance expert."),
                            Map.of("role", "user", "content", prompt)),
                    "max_tokens", 4000);

            String response = openAiWebClient.post()
                    .uri("/chat/completions")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonResponse = objectMapper.readTree(response);
            return jsonResponse.get("choices").get(0).get("message").get("content").asText();

        } catch (Exception e) {
            log.error("OpenAI API call failed", e);
            throw new RuntimeException("AI service temporarily unavailable");
        }
    }
}
