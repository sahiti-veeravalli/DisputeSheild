package com.disputeshield.backend.dto;

import com.disputeshield.backend.domain.DisputeReason;
import com.disputeshield.backend.domain.DisputeStatus;

import java.util.List;

/**
 * Mirrors the frontend's `Dispute` type (id, customer, amount, reason, deadlineDays,
 * status, openedAt, missingKeys) and additionally carries the case-state fields the
 * frontend keeps in `DisputeCaseState` (analysis, packetGenerated, packetApproved,
 * submitted, submissionRef), so a single GET /api/disputes/{id} call is enough to
 * reconstruct that state — no separate calls needed. The list endpoint returns the
 * same shape; new/untouched disputes simply carry null/false values for those fields.
 */
public record DisputeDto(
        String id,
        String customer,
        long amount,
        DisputeReason reason,
        int deadlineDays,
        DisputeStatus status,
        String openedAt,
        List<String> missingKeys,
        AnalysisResultDto analysis,
        boolean packetGenerated,
        boolean packetApproved,
        boolean submitted,
        String submissionRef
) {
}
