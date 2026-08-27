package com.disputeshield.backend.service;

import com.disputeshield.backend.domain.AuditEntryEntity;
import com.disputeshield.backend.domain.Dispute;
import com.disputeshield.backend.domain.DisputeStatus;
import com.disputeshield.backend.dto.AnalysisResultDto;
import com.disputeshield.backend.dto.AuditEntryDto;
import com.disputeshield.backend.dto.DisputeDto;
import com.disputeshield.backend.engine.DisputeFeatures;
import com.disputeshield.backend.engine.RuleEngine;
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
import java.util.List;
import java.util.Locale;

/**
 * Backs every /api/disputes endpoint. Mirrors the original frontend's App.tsx state
 * machine (handleAnalyzeStart/handleAnalyzeComplete/handleGeneratePacket/
 * handleApprovePacket/handleSubmitPacket) exactly, just persisted instead of held in
 * React state.
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

    private final DisputeRepository disputeRepository;
    private final AuditEntryRepository auditEntryRepository;
    private final RuleEngine ruleEngine;

    public DisputeService(DisputeRepository disputeRepository, AuditEntryRepository auditEntryRepository,
                           RuleEngine ruleEngine) {
        this.disputeRepository = disputeRepository;
        this.auditEntryRepository = auditEntryRepository;
        this.ruleEngine = ruleEngine;
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
     * Mirrors handleAnalyzeStart + handleAnalyzeComplete from App.tsx: flips status to
     * Investigating, runs the deterministic rule engine, persists the result, and appends
     * the same sequence of audit entries the frontend does (only appending "Evidence gaps
     * detected" when the analysis actually found a gap).
     */
    @Transactional
    public AnalysisResultDto analyze(String id) {
        Dispute dispute = requireDispute(id);

        dispute.setStatus(DisputeStatus.INVESTIGATING);
        appendAudit(id, LABEL_ANALYSIS_STARTED);

        DisputeFeatures features = new DisputeFeatures(dispute.getId(), dispute.getReason(),
                dispute.getAmount(), dispute.getMissingKeys());
        AnalysisResultDto result = ruleEngine.analyze(features);

        dispute.setAnalysis(result);
        disputeRepository.save(dispute);

        appendAudit(id, LABEL_EVIDENCE_RETRIEVED);
        if (!result.missing().isEmpty()) {
            appendAudit(id, LABEL_EVIDENCE_GAPS);
        }

        return result;
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

    /** Idempotent: only appends the "Evidence packet generated" audit entry once, mirroring
     * the frontend's `caseState.audit.some(a => a.label === "...")` guard. */
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
