package com.zenvyra.domain.aiact;

import com.zenvyra.model.AiSystemInventory;

import java.util.List;
import java.util.function.Predicate;

/**
 * Immutable rule definition used by {@link AiActRuleCatalog} implementations.
 *
 * <p>A rule is a small declarative unit that knows the {@code AiSystemInventory}
 * shape it evaluates, the output category it contributes to, the human-readable
 * message it emits, and the supporting evidence and obligations it implies.
 *
 * @param id                     stable identifier for the rule (e.g. {@code "risk.obligations.aiLiteracy"})
 * @param category               output category produced when the rule matches
 *                               (see {@link AiActRuleCatalog} methods)
 * @param message                the assessment string emitted when the rule matches
 * @param condition              predicate that decides whether the rule applies
 * @param evidenceTypes          evidence kinds that the rule expects
 * @param triggeredObligations   obligation keys that the rule triggers
 */
public record AiActRule(
        String id,
        String category,
        String message,
        Predicate<AiSystemInventory> condition,
        List<String> evidenceTypes,
        List<String> triggeredObligations
) {
}
