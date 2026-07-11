package com.zenvyra.agents.scanner;

import com.zenvyra.service.SafeWebFetchService;
import com.zenvyra.service.DynamicCrawlerService;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

class ScannerTest {

    private final Scanner scanner = new Scanner(mock(SafeWebFetchService.class), mock(DynamicCrawlerService.class));

    @Test
    void detectsChatbotInPageText() {
        String html = "<html><body><p>Our customer support is powered by a friendly chatbot that answers 24/7.</p></body></html>";
        Document doc = Jsoup.parse(html, "https://example.com");

        AiDisclosureSignals signals = scanner.detectAiDisclosureSignals(doc, "https://example.com");

        assertTrue(signals.isChatbotDetected(), "chatbot phrase should be detected");
        assertTrue(signals.isAiUseDisclosed(), "ai use should be disclosed");
        assertNotNull(signals.getDetectedEvidence());
        assertFalse(signals.getDetectedEvidence().isEmpty());
        assertTrue(signals.getDetectedEvidence().get(0).toLowerCase().contains("chatbot"));
    }

    @Test
    void detectsAutomatedDecisionMakingLanguage() {
        String html = "<html><body><p>Our loan approval process uses automated decision making to evaluate applications.</p></body></html>";
        Document doc = Jsoup.parse(html, "https://example.com");

        AiDisclosureSignals signals = scanner.detectAiDisclosureSignals(doc, "https://example.com");

        assertTrue(signals.isAutomatedDecisionMakingDetected());
        assertTrue(signals.isAiUseDisclosed());
        assertTrue(signals.getDetectedEvidence().get(0).toLowerCase().contains("automated"));
    }

    @Test
    void detectsAiTransparencyPage() {
        String html = "<html><body>" +
                "<p>Read our policies below.</p>" +
                "<a href=\"https://example.com/ai-transparency\">AI transparency</a>" +
                "</body></html>";
        Document doc = Jsoup.parse(html, "https://example.com");

        AiDisclosureSignals signals = scanner.detectAiDisclosureSignals(doc, "https://example.com");

        assertTrue(signals.isAiTransparencyPageDetected());
        assertTrue(signals.isAiUseDisclosed());
    }

    @Test
    void detectsModelProviderMentions() {
        String html = "<html><body><p>This product is built on top of OpenAI and Anthropic Claude models.</p></body></html>";
        Document doc = Jsoup.parse(html, "https://example.com");

        AiDisclosureSignals signals = scanner.detectAiDisclosureSignals(doc, "https://example.com");

        assertTrue(signals.isModelOrProviderMentioned());
        assertTrue(signals.isAiUseDisclosed());
        assertTrue(signals.getDetectedEvidence().stream()
                .anyMatch(e -> e.toLowerCase().contains("openai")
                        || e.toLowerCase().contains("anthropic")
                        || e.toLowerCase().contains("claude")));
    }

    @Test
    void detectsHumanReviewMention() {
        String html = "<html><body><p>If you disagree with the AI's response, you can request human review from our support team.</p></body></html>";
        Document doc = Jsoup.parse(html, "https://example.com");

        AiDisclosureSignals signals = scanner.detectAiDisclosureSignals(doc, "https://example.com");

        assertTrue(signals.isHumanReviewMentioned());
        assertTrue(signals.getDetectedEvidence().get(0).toLowerCase().contains("human review"));
    }

    @Test
    void returnsNoSignalsForBlankPage() {
        String html = "<html><body><p>Welcome to our generic marketing website.</p></body></html>";
        Document doc = Jsoup.parse(html, "https://example.com");

        AiDisclosureSignals signals = scanner.detectAiDisclosureSignals(doc, "https://example.com");

        assertFalse(signals.isChatbotDetected());
        assertFalse(signals.isAutomatedDecisionMakingDetected());
        assertFalse(signals.isAiTransparencyPageDetected());
        assertFalse(signals.isModelOrProviderMentioned());
        assertFalse(signals.isHumanReviewMentioned());
        assertTrue(signals.getDetectedEvidence().isEmpty());
    }

    @Test
    void evidenceSnippetsAreCappedAtMax() {
        StringBuilder body = new StringBuilder("<html><body>");
        for (int i = 0; i < 10; i++) {
            body.append("<p>Sentence ").append(i)
                    .append(" mentions chatbot and OpenAI for customer ").append(i)
                    .append(" support scenario number ").append(i).append(".</p>");
        }
        body.append("</body></html>");
        Document doc = Jsoup.parse(body.toString(), "https://example.com");

        AiDisclosureSignals signals = scanner.detectAiDisclosureSignals(doc, "https://example.com");

        assertTrue(signals.getDetectedEvidence().size() <= AiDisclosureSignals.MAX_EVIDENCE_SNIPPETS);
        for (String snippet : signals.getDetectedEvidence()) {
            assertTrue(snippet.length() <= AiDisclosureSignals.MAX_EVIDENCE_SNIPPET_LENGTH,
                    "snippet exceeded max length: " + snippet.length());
        }
    }

    @Test
    void nullDocumentReturnsNone() {
        AiDisclosureSignals signals = scanner.detectAiDisclosureSignals(null, "https://example.com");
        assertEquals(AiDisclosureSignals.none().isChatbotDetected(), signals.isChatbotDetected());
        assertTrue(signals.getDetectedEvidence().isEmpty());
    }
}
