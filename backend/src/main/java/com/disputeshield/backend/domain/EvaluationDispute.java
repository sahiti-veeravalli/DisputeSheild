package com.disputeshield.backend.domain;

import jakarta.persistence.*;

/**
 * One row of the synthetic labeled dataset used purely for the honest evaluation report
 * (GET /api/evaluation/report). This is NOT the 8 live demo disputes — see {@link Dispute}
 * for those. Ground truth ("outcome") is assigned by a documented synthetic generating
 * function (see evaluation.EvaluationDatasetGenerator), never by hand-labeling, so the
 * whole dataset is reproducible from a fixed seed and auditable in code.
 */
@Entity
@Table(name = "evaluation_disputes")
public class EvaluationDispute {

    @Id
    @Column(length = 32)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DisputeReason reason;

    @Column(nullable = false)
    private long amount;

    @Column(nullable = false)
    private int completeness;

    @Column(nullable = false)
    private int evidenceCountFound;

    @Column(nullable = false)
    private int totalRuleCount;

    @Column(nullable = false)
    private int missingCriticalCount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReadinessLevel readiness;

    /** Ground truth chargeback outcome, assigned by the synthetic label generator. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Outcome outcome;

    @Column(nullable = false)
    private boolean isTrain;

    /** Filled in after the model is fit on the train split and scored against this row. */
    @Enumerated(EnumType.STRING)
    private Outcome predictedOutcome;

    private Double predictedProbability;

    protected EvaluationDispute() {
        // JPA
    }

    public EvaluationDispute(String id, DisputeReason reason, long amount, int completeness,
                              int evidenceCountFound, int totalRuleCount, int missingCriticalCount,
                              ReadinessLevel readiness, Outcome outcome, boolean isTrain) {
        this.id = id;
        this.reason = reason;
        this.amount = amount;
        this.completeness = completeness;
        this.evidenceCountFound = evidenceCountFound;
        this.totalRuleCount = totalRuleCount;
        this.missingCriticalCount = missingCriticalCount;
        this.readiness = readiness;
        this.outcome = outcome;
        this.isTrain = isTrain;
    }

    public String getId() { return id; }
    public DisputeReason getReason() { return reason; }
    public long getAmount() { return amount; }
    public int getCompleteness() { return completeness; }
    public int getEvidenceCountFound() { return evidenceCountFound; }
    public int getTotalRuleCount() { return totalRuleCount; }
    public int getMissingCriticalCount() { return missingCriticalCount; }
    public ReadinessLevel getReadiness() { return readiness; }
    public Outcome getOutcome() { return outcome; }
    public boolean isTrain() { return isTrain; }
    public Outcome getPredictedOutcome() { return predictedOutcome; }
    public void setPredictedOutcome(Outcome predictedOutcome) { this.predictedOutcome = predictedOutcome; }
    public Double getPredictedProbability() { return predictedProbability; }
    public void setPredictedProbability(Double predictedProbability) { this.predictedProbability = predictedProbability; }
}
