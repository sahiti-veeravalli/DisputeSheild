package com.disputeshield.backend.dto;

import com.disputeshield.backend.domain.ReadinessLevel;

import java.util.List;

public record AnalysisResultDto(
        List<FoundEvidenceItemDto> found,
        List<MissingEvidenceItemDto> missing,
        int completeness,
        ReadinessLevel readiness,
        String summary,
        int evidenceCountFound,
        int missingCriticalCount
) {
}
