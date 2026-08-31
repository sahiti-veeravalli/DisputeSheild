package com.disputeshield.backend.evaluation;

import com.disputeshield.backend.domain.EvaluationDispute;
import com.disputeshield.backend.domain.Outcome;

import java.util.List;

/**
 * Logistic regression model predicting Evidence Sufficiency / Defense Readiness probability
 * over four features: [bias (1.0), completeness ratio, evidence coverage ratio, missing critical count].
 *
 * Trained with deterministic full-batch gradient descent on the synthetic historical dataset.
 * The exact same trained model and feature extraction logic are shared between the held-out
 * evaluation benchmark and live production dispute analysis in {@link com.disputeshield.backend.service.DisputeService}.
 */
public class LogisticRegressionModel {

    public static final double LEARNING_RATE = 0.15;
    public static final int EPOCHS = 800;

    private double[] weights = new double[4]; // [bias, completenessRatio, evidenceRatio, missingCriticalCount]

    /**
     * Unified feature extraction method used identically in evaluation and live production inference.
     *
     * @param completeness          integer completeness percentage (0 to 100)
     * @param evidenceCountFound    number of evidence items found
     * @param totalRuleCount        total applicable evidence rules for the dispute reason
     * @param missingCriticalCount  count of missing critical evidence items
     * @return 4-element feature vector [1.0, completenessRatio, evidenceCoverageRatio, missingCriticalCount]
     */
    public static double[] extractFeatures(int completeness, int evidenceCountFound, int totalRuleCount, int missingCriticalCount) {
        double completenessRatio = completeness / 100.0;
        double evidenceRatio = totalRuleCount > 0 ? evidenceCountFound / (double) totalRuleCount : 0.0;
        return new double[]{
                1.0,
                completenessRatio,
                evidenceRatio,
                (double) missingCriticalCount
        };
    }

    /** Feature extraction from an evaluation row using the unified extractor. */
    public static double[] featuresOf(EvaluationDispute d) {
        return extractFeatures(
                d.getCompleteness(),
                d.getEvidenceCountFound(),
                d.getTotalRuleCount(),
                d.getMissingCriticalCount()
        );
    }

    public static double sigmoid(double x) {
        return 1.0 / (1.0 + Math.exp(-x));
    }

    /** Fits weights on the TRAIN split only. Never called with test-split rows. */
    public void fit(List<EvaluationDispute> train) {
        double[] w = new double[4];
        for (int epoch = 0; epoch < EPOCHS; epoch++) {
            double[] grad = new double[4];
            for (EvaluationDispute d : train) {
                double[] x = featuresOf(d);
                double y = d.getOutcome() == Outcome.WON ? 1.0 : 0.0;
                double z = w[0] * x[0] + w[1] * x[1] + w[2] * x[2] + w[3] * x[3];
                double p = sigmoid(z);
                double err = p - y;
                for (int k = 0; k < 4; k++) {
                    grad[k] += err * x[k];
                }
            }
            for (int k = 0; k < 4; k++) {
                w[k] -= LEARNING_RATE * grad[k] / train.size();
            }
        }
        this.weights = w;
    }

    /** Predicted evidence sufficiency probability for a feature vector. */
    public double predictProbability(double[] x) {
        double z = 0;
        for (int k = 0; k < 4; k++) {
            z += weights[k] * x[k];
        }
        return sigmoid(z);
    }

    /** Predicted evidence sufficiency probability for an evaluation dispute row. */
    public double predictProbability(EvaluationDispute d) {
        return predictProbability(featuresOf(d));
    }

    /** Predicted evidence sufficiency probability for live production inputs. */
    public double predictProbability(int completeness, int evidenceCountFound, int totalRuleCount, int missingCriticalCount) {
        return predictProbability(extractFeatures(completeness, evidenceCountFound, totalRuleCount, missingCriticalCount));
    }

    public double[] getWeights() {
        return weights.clone();
    }
}
