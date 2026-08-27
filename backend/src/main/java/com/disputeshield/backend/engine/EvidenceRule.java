package com.disputeshield.backend.engine;

import com.disputeshield.backend.domain.EvidenceCategory;
import com.disputeshield.backend.domain.EvidenceStrength;

import java.util.List;
import java.util.function.BiFunction;
import java.util.function.Supplier;

/**
 * A single data-driven evidence rule: what this piece of evidence is, how relevant it is to
 * a given dispute reason, and — if the merchant's records don't have it — why that gap
 * matters and what to do about it. This is intentionally a plain config record (not a
 * model or a prompt) so the whole reason-to-evidence mapping can be inspected, diffed, and
 * justified to a judge/reviewer as deterministic and explainable rather than a black box.
 */
public record EvidenceRule(
        String key,
        EvidenceCategory category,
        String name,
        int baseRelevance,
        EvidenceStrength strength,
        boolean critical,
        String gapWhy,
        String gapAction,
        Supplier<String> why,
        BiFunction<DisputeContext, Long, List<DetailField>> detailFields
) {
    public static EvidenceRule of(
            String key, EvidenceCategory category, String name, int baseRelevance, EvidenceStrength strength,
            boolean critical, String gapWhy, String gapAction, Supplier<String> why,
            BiFunction<DisputeContext, Long, List<DetailField>> detailFields
    ) {
        return new EvidenceRule(key, category, name, baseRelevance, strength, critical, gapWhy, gapAction, why, detailFields);
    }
}
