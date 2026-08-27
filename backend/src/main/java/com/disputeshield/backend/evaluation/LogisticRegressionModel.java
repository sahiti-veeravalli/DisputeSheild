package com.disputeshield.backend.evaluation;

import com.disputeshield.backend.domain.EvaluationDispute;
import com.disputeshield.backend.domain.Outcome;

import java.util.List;

/**
 * Deliberately the simplest model that could plausibly work: logistic regression over
 * three features (evidence completeness, evidence-item coverage ratio, missing-critical
 * count) — the same signals the deterministic HIGH/MEDIUM/LOW readiness rule already
 * uses, just calibrated with weights instead of hand-picked thresholds. Fit with plain
 * full-batch gradient descent (no external ML library, nothing stochastic) so the exact
 * same TRAIN split always produces the exact same weights.
 */
public class LogisticRegressionModel {

    private static final double LEARNING_RATE = 0.15;
    private static final int EPOCHS = 800;

    private double[] weights = new double[4]; // [bias, completenessRatio, evidenceRatio, missingCriticalCount]

    private static double[] featuresOf(EvaluationDispute d) {
        return new double[]{
                1.0,
                d.getCompleteness() / 100.0,
                d.getEvidenceCountFound() / (double) d.getTotalRuleCount(),
                d.getMissingCriticalCount()
        };
    }

    private static double sigmoid(double x) {
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

    /** Predicted probability of "won" for a held-out row. */
    public double predictProbability(EvaluationDispute d) {
        double[] x = featuresOf(d);
        double z = 0;
        for (int k = 0; k < 4; k++) {
            z += weights[k] * x[k];
        }
        return sigmoid(z);
    }

    public double[] getWeights() {
        return weights;
    }
}
