package com.disputeshield.backend.dto;

import com.disputeshield.backend.domain.DisputeReason;
import com.disputeshield.backend.domain.Outcome;

public record ExceptionCaseDto(
        String id,
        DisputeReason reason,
        long amount,
        int completeness,
        int missingCriticalCount,
        Outcome actualOutcome,
        Outcome predictedOutcome,
        double predictedProbability
) {
}
