package com.disputeshield.backend.service;

import com.disputeshield.backend.domain.AuditEntryEntity;
import com.disputeshield.backend.domain.Dispute;
import com.disputeshield.backend.domain.DisputeStatus;
import com.disputeshield.backend.dto.AnalysisResultDto;
import com.disputeshield.backend.dto.AuditEntryDto;
import com.disputeshield.backend.dto.DisputeDto;
import com.disputeshield.backend.dto.FoundEvidenceItemDto;
import com.disputeshield.backend.dto.MissingEvidenceItemDto;
import com.disputeshield.backend.engine.DisputeFeatures;
import com.disputeshield.backend.engine.EvidenceRules;
import com.disputeshield.backend.engine.RuleEngine;
import com.disputeshield.backend.evaluation.EvaluationService;
import com.disputeshield.backend.exception.DisputeConflictException;
import com.disputeshield.backend.exception.DisputeNotFoundException;
import com.disputeshield.backend.exception.InvalidDisputeStateException;
import com.disputeshield.backend.repository.AuditEntryRepository;
import com.disputeshield.backend.repository.DisputeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Backs every /api/disputes endpoint. Integrates the deterministic RuleEngine with
 * the trained Logistic Regression Evidence Sufficiency model for live dispute analysis,
 * ensuring the backend is the single source of truth for all dispute state and ML inference.
 */
@Service
public class DisputeService {

    private static final DateTimeFormatter TIMESTAMP_FORMAT =
            DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm:ss a", Locale.ENGLISH);

    private static final String LABEL_ANALYSIS_STARTED = "Analysis started";
    private static final String LABEL_EVIDENCE_RETRIEVED = "Evidence retrieved";
    private static final String LABEL_EVIDENCE_GAPS = "Evidence gaps detected";
    private static final String LABEL_PACKET_GENERATED = "Evidence packet generated";
    private static final String LABEL_MERCHANT_APPROVED = "Merchant approved";
    private static final String LABEL_RESPONSE_SUBMITTED = "Response submitted";

    private static final String DISCLAIMER_TEXT =
            "Evidence Sufficiency Probability is an AI decision-support estimate of defense documentation strength "
            + "based on historical chargeback patterns. It is an internal decision-support metric and does not guarantee "
            + "dispute outcomes by issuing banks or card networks.";

    private final DisputeRepository disputeRepository;
    private final AuditEntryRepository auditEntryRepository;
    private final RuleEngine ruleEngine;
    private final EvaluationService evaluationService;

    public DisputeService(DisputeRepository disputeRepository,
                          AuditEntryRepository auditEntryRepository,
                          RuleEngine ruleEngine,
                          EvaluationService evaluationService) {
        this.disputeRepository = disputeRepository;
        this.auditEntryRepository = auditEntryRepository;
        this.ruleEngine = ruleEngine;
        this.evaluationService = evaluationService;
    }

    private static String nowStamp() {
        return TIMESTAMP_FORMAT.format(Instant.now().atZone(ZoneId.systemDefault()));
    }

    private Dispute requireDispute(String id) {
        return disputeRepository.findById(id).orElseThrow(() -> new DisputeNotFoundException(id));
    }

    private void appendAudit(String disputeId, String label) {
        auditEntryRepository.save(new AuditEntryEntity(disputeId, label, nowStamp(), Instant.now()));
    }

    private DisputeDto toDto(Dispute d) {
        List<String> keys = d.getMissingKeys() == null ? List.of() : List.copyOf(d.getMissingKeys());
        return new DisputeDto(
                d.getId(), d.getCustomer(), d.getAmount(), d.getReason(), d.getDeadlineDays(),
                d.getStatus(), d.getOpenedAt(), keys, d.getAnalysis(),
                d.isPacketGenerated(), d.isPacketApproved(), d.isSubmitted(), d.getSubmissionRef()
        );
    }

    @Transactional(readOnly = true)
    public List<DisputeDto> listDisputes() {
        return disputeRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public DisputeDto getDispute(String id) {
        return toDto(requireDispute(id));
    }

    /**
     * Executes the live dispute analysis pipeline:
     *  1. Runs the deterministic RuleEngine to identify on-file and missing evidence.
     *  2. Extracts standardized evidence feature vector.
     *  3. Passes features to the trained Logistic Regression model to compute Evidence Sufficiency Probability.
     *  4. Generates positive factors, missing critical evidence factors, and decision-support disclaimer.
     *  5. Persists the combined explainable assessment and appends audit trail entries.
     */
    @Transactional
    public AnalysisResultDto analyze(String id) {
        Dispute dispute = requireDispute(id);

        dispute.setStatus(DisputeStatus.INVESTIGATING);
        appendAudit(id, LABEL_ANALYSIS_STARTED);

        DisputeFeatures features = new DisputeFeatures(
                dispute.getId(),
                dispute.getReason(),
                dispute.getAmount(),
                dispute.getMissingKeys()
        );
        AnalysisResultDto ruleAnalysis = ruleEngine.analyze(features);

        int totalRuleCount = EvidenceRules.RULES.get(dispute.getReason()).size();
        double rawProb = evaluationService.predictSufficiency(
                ruleAnalysis.completeness(),
                ruleAnalysis.evidenceCountFound(),
                totalRuleCount,
                ruleAnalysis.missingCriticalCount()
        );
        double sufficiencyProb = Math.round(rawProb * 1000.0) / 1000.0;

        List<String> topPositiveFactors = new ArrayList<>();
        topPositiveFactors.add(String.format("Evidence completeness of %d%% (%s readiness tier)",
                ruleAnalysis.completeness(), ruleAnalysis.readiness()));
        topPositiveFactors.add(String.format("Retrieved %d of %d applicable defense evidence items",
                ruleAnalysis.evidenceCountFound(), totalRuleCount));
        for (FoundEvidenceItemDto f : ruleAnalysis.found().stream().limit(2).toList()) {
            topPositiveFactors.add(String.format("Verified %s (%d%% relevance, %s strength)",
                    f.name(), f.relevance(), f.strength().name().toLowerCase()));
        }

        List<String> missingCriticalFactors = new ArrayList<>();
        for (MissingEvidenceItemDto m : ruleAnalysis.missing()) {
            if (m.critical()) {
                missingCriticalFactors.add(String.format("%s: %s", m.name(), m.why()));
            }
        }

        AnalysisResultDto combinedResult = new AnalysisResultDto(
                ruleAnalysis.found(),
                ruleAnalysis.missing(),
                ruleAnalysis.completeness(),
                ruleAnalysis.readiness(),
                ruleAnalysis.summary(),
                ruleAnalysis.evidenceCountFound(),
                ruleAnalysis.missingCriticalCount(),
                sufficiencyProb,
                topPositiveFactors,
                missingCriticalFactors,
                DISCLAIMER_TEXT
        );

        dispute.setAnalysis(combinedResult);
        disputeRepository.save(dispute);

        appendAudit(id, LABEL_EVIDENCE_RETRIEVED);
        if (!combinedResult.missing().isEmpty()) {
            appendAudit(id, LABEL_EVIDENCE_GAPS);
        }

        return combinedResult;
    }

    @Transactional(readOnly = true)
    public AnalysisResultDto getAnalysis(String id) {
        Dispute dispute = requireDispute(id);
        if (dispute.getAnalysis() == null) {
            throw new InvalidDisputeStateException(
                    "No analysis has been run yet for dispute " + id + ". Call POST /api/disputes/" + id + "/analyze first.");
        }
        return dispute.getAnalysis();
    }

    /** Idempotent: only appends the "Evidence packet generated" audit entry once. */
    @Transactional
    public void generatePacket(String id) {
        Dispute dispute = requireDispute(id);
        if (dispute.getAnalysis() == null) {
            throw new InvalidDisputeStateException(
                    "Cannot generate a packet before analysis has run for dispute " + id + ". Call POST /api/disputes/" + id + "/analyze first.");
        }

        dispute.setPacketGenerated(true);
        disputeRepository.save(dispute);

        if (!auditEntryRepository.existsByDisputeIdAndLabel(id, LABEL_PACKET_GENERATED)) {
            appendAudit(id, LABEL_PACKET_GENERATED);
        }
    }

    @Transactional
    public void approvePacket(String id) {
        Dispute dispute = requireDispute(id);
        dispute.setPacketApproved(true);
        disputeRepository.save(dispute);
        appendAudit(id, LABEL_MERCHANT_APPROVED);
    }

    /** Returns the submission reference, exactly matching the frontend's
     * `RZP-DEMO-${id}` format. Rejects an already-submitted case with 409. */
    @Transactional
    public String submitPacket(String id) {
        Dispute dispute = requireDispute(id);
        if (dispute.isSubmitted()) {
            throw new DisputeConflictException("Dispute " + id + " has already been submitted.");
        }

        String ref = "RZP-DEMO-" + id;
        dispute.setSubmissionRef(ref);
        dispute.setSubmitted(true);
        dispute.setStatus(DisputeStatus.RESOLVED);
        disputeRepository.save(dispute);

        appendAudit(id, LABEL_RESPONSE_SUBMITTED);
        return ref;
    }

    @Transactional(readOnly = true)
    public List<AuditEntryDto> getAudit(String id) {
        requireDispute(id);
        return auditEntryRepository.findByDisputeIdOrderByIdAsc(id).stream()
                .map(e -> new AuditEntryDto(e.getLabel(), e.getTimestamp()))
                .toList();
    }
}
