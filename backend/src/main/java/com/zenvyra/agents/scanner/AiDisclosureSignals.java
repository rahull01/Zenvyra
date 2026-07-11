package com.zenvyra.agents.scanner;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.Collections;
import java.util.List;

/**
 * Immutable value object capturing AI disclosure signals detected on a scanned
 * page. Used to feed the AI Act readiness flow.
 */
@Getter
@Builder
@ToString
public final class AiDisclosureSignals {

    public static final int MAX_EVIDENCE_SNIPPETS = 3;
    public static final int MAX_EVIDENCE_SNIPPET_LENGTH = 200;

    private final boolean chatbotDetected;
    private final boolean automatedDecisionMakingDetected;
    private final boolean aiTransparencyPageDetected;
    private final boolean modelOrProviderMentioned;
    private final boolean aiUseDisclosed;
    private final boolean humanReviewMentioned;

    @Builder.Default
    private final List<String> detectedEvidence = Collections.emptyList();

    public static AiDisclosureSignals none() {
        return AiDisclosureSignals.builder().build();
    }

    public static AiDisclosureSignals fromEvidence(List<String> evidence) {
        List<String> safeEvidence = evidence == null ? Collections.emptyList() : evidence;
        boolean chatbot = safeEvidence.stream().anyMatch(e -> matchesAny(e, ChatbotKeywords.PHRASES));
        boolean adm = safeEvidence.stream().anyMatch(e -> matchesAny(e, AutomatedDecisionKeywords.PHRASES));
        boolean transparency = safeEvidence.stream().anyMatch(e -> matchesAny(e, AiTransparencyKeywords.PHRASES));
        boolean modelProvider = safeEvidence.stream().anyMatch(e -> matchesAny(e, ModelProviderKeywords.PHRASES));
        boolean aiUse = chatbot || adm || transparency || modelProvider
                || safeEvidence.stream().anyMatch(e -> matchesAny(e, GeneralAiKeywords.PHRASES));
        boolean humanReview = safeEvidence.stream().anyMatch(e -> matchesAny(e, HumanReviewKeywords.PHRASES));
        return AiDisclosureSignals.builder()
                .chatbotDetected(chatbot)
                .automatedDecisionMakingDetected(adm)
                .aiTransparencyPageDetected(transparency)
                .modelOrProviderMentioned(modelProvider)
                .aiUseDisclosed(aiUse)
                .humanReviewMentioned(humanReview)
                .detectedEvidence(safeEvidence)
                .build();
    }

    private static boolean matchesAny(String haystack, String[] needles) {
        if (haystack == null) {
            return false;
        }
        String lower = haystack.toLowerCase();
        for (String needle : needles) {
            if (lower.contains(needle)) {
                return true;
            }
        }
        return false;
    }

    // Keyword groups — shared between the scanner and the AiDisclosureSignals factory.
    static final class ChatbotKeywords {
        static final String[] PHRASES = {
                "chatbot", "chat-bot", "chat bot",
                "virtual assistant", "ai assistant", "ai agent",
                "conversational ai", "conversational assistant"
        };
        private ChatbotKeywords() {}
    }

    static final class AutomatedDecisionKeywords {
        static final String[] PHRASES = {
                "automated decision", "automated decisions", "automated decision-making",
                "algorithmic decision", "algorithmic decisions",
                "machine learning decision", "ml decision", "ml-driven decision",
                "ai-powered decision", "ai driven decision", "ai-based decision"
        };
        private AutomatedDecisionKeywords() {}
    }

    static final class AiTransparencyKeywords {
        static final String[] PHRASES = {
                "ai policy", "ai policies",
                "ai transparency", "transparency about ai",
                "artificial intelligence policy", "artificial intelligence transparency",
                "how we use ai", "how we use artificial intelligence",
                "responsible ai", "ai principles"
        };
        private AiTransparencyKeywords() {}
    }

    static final class ModelProviderKeywords {
        static final String[] PHRASES = {
                "openai", "anthropic", "claude", "chatgpt", "gpt-4", "gpt-3.5", "gpt-4o", "gpt",
                "gemini", "bard", "palm",
                "llama", "mistral", "mixtral",
                "cohere", "huggingface", "hugging face",
                "perplexity", "deepmind", "copilot"
        };
        private ModelProviderKeywords() {}
    }

    static final class HumanReviewKeywords {
        static final String[] PHRASES = {
                "human review", "human-reviewed", "human reviewed",
                "human oversight", "human-in-the-loop", "human in the loop",
                "request human intervention", "request a human", "escalate to a human",
                "appeal to a human", "human escalation", "human moderator"
        };
        private HumanReviewKeywords() {}
    }

    static final class GeneralAiKeywords {
        static final String[] PHRASES = {
                "artificial intelligence", "machine learning", " ai ", "ai-powered", "ai driven", "ai-based"
        };
        private GeneralAiKeywords() {}
    }
}
