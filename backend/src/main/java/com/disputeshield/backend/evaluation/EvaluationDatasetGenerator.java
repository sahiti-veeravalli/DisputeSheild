package com.disputeshield.backend.evaluation;

import com.disputeshield.backend.domain.DisputeReason;
import com.disputeshield.backend.domain.EvaluationDispute;
import com.disputeshield.backend.domain.Outcome;
import com.disputeshield.backend.dto.AnalysisResultDto;
import com.disputeshield.backend.engine.DisputeFeatures;
import com.disputeshield.backend.engine.EvidenceRule;
import com.disputeshield.backend.engine.EvidenceRules;
import com.disputeshield.backend.engine.RuleEngine;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Builds the 150–250 synthetic historical disputes used for the honest evaluation
 * report. Every row runs through the SAME rule engine as real disputes (see
 * {@link RuleEngine}) — this generator only decides which evidence a synthetic merchant
 * "has on file" and what actually happened to the chargeback, not the completeness math.
 *
 * <h2>Generating function (documented for audit)</h2>
 * <ol>
 *   <li>Fixed seed (42) mulberry32 PRNG drives every random choice — the whole dataset,
 *       shuffle, and train/test split are reproducible byte-for-byte on every run.</li>
 *   <li>For each synthetic case: pick a dispute reason uniformly, an amount in
 *       ₹500–₹20,000, and a latent "recordkeeping quality" q ∈ [0,1) for that merchant.
 *       For each evidence rule applicable to the reason, the probability that record is
 *       on file is {@code clamp(q + (baseRelevance/100 − 0.5) × 0.3, 0.02, 0.98)} — i.e.
 *       better-recordkeeping merchants have more on file, and higher-relevance evidence
 *       is somewhat more likely to have been kept, but nothing is deterministic.</li>
 *   <li>Ground truth ("won"/"lost") is sampled from
 *       {@code p_win = sigmoid(4.0 × (completeness/100 − 0.5) − 1.2 × missingCriticalCount + 0.1)},
 *       i.e. outcomes trend with completeness and are hurt by missing critical evidence —
 *       but with a 12% chance the label is instead overridden by an independent coin
 *       flip, standing in for the parts of a real chargeback decision (issuer discretion,
 *       card network judgment calls) that have nothing to do with the merchant's evidence
 *       file. This is what keeps the classification task from being trivially perfect.</li>
 * </ol>
 */
@Component
public class EvaluationDatasetGenerator {

    public static final int SEED = 42;
    public static final int DATASET_SIZE = 200;
    public static final double TRAIN_FRACTION = 0.8;

    private static final DisputeReason[] REASONS = {
            DisputeReason.PRODUCT_NOT_RECEIVED,
            DisputeReason.FRAUDULENT_TRANSACTION,
            DisputeReason.DUPLICATE_CHARGE,
            DisputeReason.PRODUCT_NOT_AS_DESCRIBED
    };

    private final RuleEngine ruleEngine;

    public EvaluationDatasetGenerator(RuleEngine ruleEngine) {
        this.ruleEngine = ruleEngine;
    }

    public List<EvaluationDispute> generate() {
        Mulberry32 rng = new Mulberry32(SEED);
        List<EvaluationDispute> rows = new ArrayList<>(DATASET_SIZE);

        for (int i = 0; i < DATASET_SIZE; i++) {
            String id = "SYN-" + (10000 + i);
            DisputeReason reason = REASONS[rng.nextInt(REASONS.length)];
            List<EvidenceRule> rules = EvidenceRules.RULES.get(reason);
            long amount = 500 + rng.nextInt(19500);
            double quality = rng.next();

            List<String> missingKeys = new ArrayList<>();
            for (EvidenceRule rule : rules) {
                double presentProb = Math.min(0.98, Math.max(0.02, quality + (rule.baseRelevance() / 100.0 - 0.5) * 0.3));
                boolean present = rng.next() < presentProb;
                if (!present) {
                    missingKeys.add(rule.key());
                }
            }

            AnalysisResultDto analysis = ruleEngine.analyze(new DisputeFeatures(id, reason, amount, missingKeys));

            double pWin = sigmoid(4.0 * (analysis.completeness() / 100.0 - 0.5) - 1.2 * analysis.missingCriticalCount() + 0.1);
            Outcome outcome = rng.next() < pWin ? Outcome.WON : Outcome.LOST;
            if (rng.next() < 0.12) {
                outcome = rng.next() < 0.5 ? Outcome.WON : Outcome.LOST;
            }

            rows.add(new EvaluationDispute(
                    id, reason, amount, analysis.completeness(), analysis.evidenceCountFound(),
                    rules.size(), analysis.missingCriticalCount(), analysis.readiness(), outcome, false
            ));
        }

        // Deterministic Fisher-Yates shuffle using the SAME rng stream, then an 80/20 split.
        for (int i = rows.size() - 1; i > 0; i--) {
            int j = rng.nextInt(i + 1);
            EvaluationDispute tmp = rows.get(i);
            rows.set(i, rows.get(j));
            rows.set(j, tmp);
        }

        int splitIndex = (int) Math.floor(rows.size() * TRAIN_FRACTION);
        List<EvaluationDispute> result = new ArrayList<>(rows.size());
        for (int i = 0; i < rows.size(); i++) {
            EvaluationDispute d = rows.get(i);
            boolean isTrain = i < splitIndex;
            result.add(new EvaluationDispute(
                    d.getId(), d.getReason(), d.getAmount(), d.getCompleteness(), d.getEvidenceCountFound(),
                    d.getTotalRuleCount(), d.getMissingCriticalCount(), d.getReadiness(), d.getOutcome(), isTrain
            ));
        }
        return result;
    }

    private static double sigmoid(double x) {
        return 1.0 / (1.0 + Math.exp(-x));
    }
}
