package com.disputeshield.backend.web;

import com.disputeshield.backend.dto.AnalysisResultDto;
import com.disputeshield.backend.dto.AuditEntryDto;
import com.disputeshield.backend.dto.DisputeDto;
import com.disputeshield.backend.dto.SubmissionResponseDto;
import com.disputeshield.backend.service.DisputeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST surface for the dispute lifecycle: list/inspect disputes, run the rule-engine
 * analysis, generate/approve/submit the evidence packet, and read the audit trail.
 * Mirrors the interactions the original React app performed purely in local state.
 */
@RestController
@RequestMapping("/api/disputes")
@Tag(name = "Disputes", description = "Dispute lifecycle: list, analyze, generate/approve/submit evidence packet, audit trail")
public class DisputeController {

    private final DisputeService disputeService;

    public DisputeController(DisputeService disputeService) {
        this.disputeService = disputeService;
    }

    @GetMapping
    @Operation(summary = "List all disputes", description = "Returns every seeded dispute with its current case state (analysis, packet/approval/submission flags).")
    public List<DisputeDto> listDisputes() {
        return disputeService.listDisputes();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single dispute", description = "Returns the dispute plus its full current case state — enough to reconstruct the UI in one call.")
    public DisputeDto getDispute(@PathVariable String id) {
        return disputeService.getDispute(id);
    }

    @PostMapping("/{id}/analyze")
    @Operation(summary = "Run the evidence analysis", description = "Moves the dispute to Investigating, runs the deterministic rule engine against the merchant's on-file evidence, and persists the result.")
    public AnalysisResultDto analyze(@PathVariable String id) {
        return disputeService.analyze(id);
    }

    @GetMapping("/{id}/analysis")
    @Operation(summary = "Get the persisted analysis", description = "Returns the last analysis run for this dispute. 400 if /analyze hasn't been called yet.")
    public AnalysisResultDto getAnalysis(@PathVariable String id) {
        return disputeService.getAnalysis(id);
    }

    @PostMapping("/{id}/packet")
    @Operation(summary = "Generate the evidence packet", description = "Idempotent — calling this repeatedly only appends one 'Evidence packet generated' audit entry. Requires /analyze to have run first.")
    public ResponseEntity<Void> generatePacket(@PathVariable String id) {
        disputeService.generatePacket(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Merchant approves the packet", description = "Marks the packet approved and appends a 'Merchant approved' audit entry.")
    public ResponseEntity<Void> approvePacket(@PathVariable String id) {
        disputeService.approvePacket(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/submit")
    @Operation(summary = "Submit the dispute response", description = "Marks the dispute Resolved and returns a demo submission reference. 409 if already submitted.")
    public SubmissionResponseDto submitPacket(@PathVariable String id) {
        return new SubmissionResponseDto(disputeService.submitPacket(id));
    }

    @GetMapping("/{id}/audit")
    @Operation(summary = "Get the audit trail", description = "Returns every audit entry for this dispute in the order they occurred.")
    public List<AuditEntryDto> getAudit(@PathVariable String id) {
        return disputeService.getAudit(id);
    }
}
