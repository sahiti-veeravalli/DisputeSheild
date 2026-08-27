package com.disputeshield.backend.engine;

import com.disputeshield.backend.domain.DisputeReason;
import com.disputeshield.backend.domain.ReadinessLevel;
import com.disputeshield.backend.dto.AnalysisResultDto;
import com.disputeshield.backend.dto.FoundEvidenceItemDto;
import com.disputeshield.backend.dto.MissingEvidenceItemDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import static com.disputeshield.backend.engine.MockContextGenerator.formatINR;

/**
 * Direct port of the frontend's src/engine/analyze.ts: deterministic, explainable, and
 * fully data-driven off {@link EvidenceRules}. No model call, no randomness — the same
 * dispute + same missing-evidence keys always produce the same analysis. This is the
 * "detector" for Track 02: it maps found/missing merchant evidence to a completeness
 * score and a HIGH/MEDIUM/LOW readiness call.
 */
@Component
public class RuleEngine {

    private final MockContextGenerator contextGenerator;

    public RuleEngine(MockContextGenerator contextGenerator) {
        this.contextGenerator = contextGenerator;
    }

    private static final Map<DisputeReason, String> REASON_INTRO = new EnumMap<>(DisputeReason.class);
    static {
        REASON_INTRO.put(DisputeReason.PRODUCT_NOT_RECEIVED, "This dispute concerns product non-delivery.");
        REASON_INTRO.put(DisputeReason.FRAUDULENT_TRANSACTION, "This dispute concerns a claim that the transaction was unauthorized.");
        REASON_INTRO.put(DisputeReason.DUPLICATE_CHARGE, "This dispute concerns a claim of being charged more than once.");
        REASON_INTRO.put(DisputeReason.PRODUCT_NOT_AS_DESCRIBED, "This dispute concerns a claim that the product did not match its description.");
    }

    public AnalysisResultDto analyze(DisputeFeatures dispute) {
        List<EvidenceRule> rules = EvidenceRules.RULES.get(dispute.reason());
        DisputeContext ctx = contextGenerator.contextFor(dispute.id());

        List<FoundEvidenceItemDto> found = new ArrayList<>();
        List<MissingEvidenceItemDto> missing = new ArrayList<>();

        int totalRelevance = 0;
        int gotRelevance = 0;

        for (EvidenceRule rule : rules) {
            totalRelevance += rule.baseRelevance();
            boolean isMissing = dispute.missingKeys().contains(rule.key());
            if (isMissing) {
                missing.add(new MissingEvidenceItemDto(
                        rule.key(),
                        rule.name(),
                        rule.gapWhy() != null ? rule.gapWhy() : "This evidence could not be located on file for this transaction.",
                        rule.gapAction() != null ? rule.gapAction() : "Check internal systems for this record and attach it if available.",
                        rule.critical()
                ));
            } else {
                gotRelevance += rule.baseRelevance();
                found.add(new FoundEvidenceItemDto(
                        rule.key(),
                        rule.category(),
                        rule.name(),
                        rule.baseRelevance(),
                        rule.strength(),
                        rule.why().get(),
                        rule.detailFields().apply(ctx, dispute.amount())
                ));
            }
        }

        found.sort(Comparator.comparingInt(FoundEvidenceItemDto::relevance).reversed());

        int completeness = totalRelevance == 0 ? 0 : (int) Math.round((gotRelevance * 100.0) / totalRelevance);
        long missingCriticalCount = missing.stream().filter(MissingEvidenceItemDto::critical).count();

        ReadinessLevel readiness;
        if (completeness >= 85 && missingCriticalCount == 0) {
            readiness = ReadinessLevel.HIGH;
        } else if (completeness >= 60) {
            readiness = ReadinessLevel.MEDIUM;
        } else {
            readiness = ReadinessLevel.LOW;
        }

        List<String> topFoundNames = found.stream().limit(2).map(FoundEvidenceItemDto::name).toList();
        List<String> missingCriticalNames = missing.stream().filter(MissingEvidenceItemDto::critical).map(MissingEvidenceItemDto::name).toList();

        String summary = buildSummary(dispute, topFoundNames, missingCriticalNames, readiness);

        return new AnalysisResultDto(found, missing, completeness, readiness, summary, found.size(), (int) missingCriticalCount);
    }

    private String buildSummary(DisputeFeatures dispute, List<String> foundNames, List<String> missingCriticalNames, ReadinessLevel readiness) {
        String topFound = String.join(" and ", foundNames);
        String supportSentence = !topFound.isEmpty()
                ? "The available " + topFound.toLowerCase() + " supports the merchant's position and is consistent with a legitimate, fulfilled transaction of " + formatINR(dispute.amount()) + "."
                : "Limited evidence is currently on file for this transaction of " + formatINR(dispute.amount()) + ".";

        String gapSentence;
        if (missingCriticalNames.size() == 1) {
            gapSentence = " However, " + missingCriticalNames.get(0).toLowerCase() + " was not found, which may limit the strength of the evidence.";
        } else if (missingCriticalNames.size() > 1) {
            gapSentence = " However, " + String.join(" and ", missingCriticalNames).toLowerCase()
                    + " were not found, which meaningfully limits the strength of the evidence.";
        } else {
            gapSentence = " No critical evidence gaps were identified for this dispute reason.";
        }

        String readinessNote = switch (readiness) {
            case HIGH -> " Overall, the evidence on file strongly supports a defense response.";
            case MEDIUM -> " Overall, the evidence indicates a reasonable but not complete defense response.";
            case LOW -> " Overall, the evidence gaps indicate the response would benefit from additional documentation before submission.";
        };

        return REASON_INTRO.get(dispute.reason()) + " " + supportSentence + gapSentence + readinessNote;
    }
}
