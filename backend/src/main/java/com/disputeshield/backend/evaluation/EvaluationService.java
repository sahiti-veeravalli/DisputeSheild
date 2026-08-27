package com.disputeshield.backend.evaluation;

import com.disputeshield.backend.domain.EvaluationDispute;
import com.disputeshield.backend.domain.Outcome;
import com.disputeshield.backend.dto.ConfusionMatrixDto;
import com.disputeshield.backend.dto.EvaluationReportDto;
import com.disputeshield.backend.dto.ExceptionCaseDto;
import com.disputeshield.backend.repository.EvaluationDisputeRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Owns the synthetic evaluation dataset and the honest, held-out-only metrics report.
 *
 * Sequence, run once at startup (and re-runnable via {@link #recompute()}):
 *  1. Seed the synthetic dataset into Postgres if it isn't already there (idempotent).
 *  2. Fit {@link LogisticRegressionModel} on the TRAIN split ONLY.
 *  3. Score every TEST-split row, persist its prediction, and cache precision / recall /
 *     F1 / confusion matrix / false-positive cost / exception list computed EXCLUSIVELY
 *     from the held-out test rows.
 *
 * GET /api/evaluation/report always serves the cached report — it is never computed from
 * the live 8 demo disputes and never mixes train and test rows into the same metric.
 */
@Service
public class EvaluationService {

    private static final String GUARDRAIL_NOTE =
            "This system only classifies and organizes evidence the merchant already has on file for human "
            + "review. It never auto-submits a dispute response without explicit merchant approval, never "
            + "fabricates or alters evidence, and has no capability to initiate or influence a dispute outside "
            + "the merchant's own legitimate records. Defense-only was a deliberate design constraint from the "
            + "start, not an oversight.";

    private final EvaluationDisputeRepository repository;
    private final EvaluationDatasetGenerator generator;

    private volatile EvaluationReportDto cachedReport;

    public EvaluationService(EvaluationDisputeRepository repository, EvaluationDatasetGenerator generator) {
        this.repository = repository;
        this.generator = generator;
    }

    @PostConstruct
    public void init() {
        if (repository.count() == 0) {
            repository.saveAll(generator.generate());
        }
        recompute();
    }

    /** Re-fits the model on the current train split and recomputes the held-out report. */
    public synchronized EvaluationReportDto recompute() {
        List<EvaluationDispute> train = repository.findByIsTrain(true);
        List<EvaluationDispute> test = repository.findByIsTrain(false);

        LogisticRegressionModel model = new LogisticRegressionModel();
        model.fit(train);

        int tp = 0, fp = 0, tn = 0, fn = 0;
        long falsePositiveCost = 0;
        List<ExceptionCaseDto> exceptions = new ArrayList<>();

        for (EvaluationDispute d : test) {
            double p = model.predictProbability(d);
            Outcome predicted = p >= 0.5 ? Outcome.WON : Outcome.LOST;
            d.setPredictedOutcome(predicted);
            d.setPredictedProbability(p);

            boolean actualWon = d.getOutcome() == Outcome.WON;
            boolean predictedWon = predicted == Outcome.WON;

            if (predictedWon && actualWon) tp++;
            else if (predictedWon) { fp++; falsePositiveCost += d.getAmount(); }
            else if (actualWon) fn++;
            else tn++;

            if (predicted != d.getOutcome()) {
                exceptions.add(new ExceptionCaseDto(
                        d.getId(), d.getReason(), d.getAmount(), d.getCompleteness(),
                        d.getMissingCriticalCount(), d.getOutcome(), predicted, p
                ));
            }
        }
        repository.saveAll(test);

        double precision = (tp + fp) == 0 ? 0.0 : tp / (double) (tp + fp);
        double recall = (tp + fn) == 0 ? 0.0 : tp / (double) (tp + fn);
        double f1 = (precision + recall) == 0 ? 0.0 : 2 * precision * recall / (precision + recall);

        // Cap the exceptions list at 5, prioritizing the largest-amount misses so the
        // false-positive cost figure is easy to sanity-check against the examples shown.
        exceptions.sort(Comparator.comparingLong(ExceptionCaseDto::amount).reversed());
        List<ExceptionCaseDto> exceptionSample = exceptions.subList(0, Math.min(5, exceptions.size()));

        String methodology = String.format(
                "%d synthetic disputes generated from a fixed seed (%d) and split 80/20 into train "
                + "(%d rows) and held-out test (%d rows). A logistic regression over evidence completeness, "
                + "evidence-item coverage ratio, and missing-critical-evidence count was fit on the TRAIN "
                + "split only. Every metric below is computed exclusively on the %d held-out TEST rows the "
                + "model never saw during fitting.",
                train.size() + test.size(), EvaluationDatasetGenerator.SEED, train.size(), test.size(), test.size()
        );

        EvaluationReportDto report = new EvaluationReportDto(
                EvaluationDatasetGenerator.SEED,
                train.size() + test.size(),
                train.size(),
                test.size(),
                round3(precision),
                round3(recall),
                round3(f1),
                new ConfusionMatrixDto(tp, fp, tn, fn),
                falsePositiveCost,
                exceptionSample,
                methodology,
                GUARDRAIL_NOTE
        );
        this.cachedReport = report;
        return report;
    }

    public EvaluationReportDto getReport() {
        EvaluationReportDto r = cachedReport;
        return r != null ? r : recompute();
    }

    private static double round3(double v) {
        return Math.round(v * 1000.0) / 1000.0;
    }
}
