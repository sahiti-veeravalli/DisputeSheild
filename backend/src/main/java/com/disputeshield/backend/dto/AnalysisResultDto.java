package com.disputeshield.backend.dto;

import com.disputeshield.backend.domain.ReadinessLevel;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AnalysisResultDto(
        List<FoundEvidenceItemDto> found,
        List<MissingEvidenceItemDto> missing,
        int completeness,
        ReadinessLevel readiness,
        String summary,
        int evidenceCountFound,
        int missingCriticalCount,
        Double evidenceSufficiencyProbability,
        List<String> topPositiveFactors,
        List<String> missingCriticalFactors,
        String decisionSupportDisclaimer
) {
    public AnalysisResultDto(
            List<FoundEvidenceItemDto> found,
            List<MissingEvidenceItemDto> missing,
            int completeness,
            ReadinessLevel readiness,
            String summary,
            int evidenceCountFound,
            int missingCriticalCount
    ) {
        this(
                found,
                missing,
                completeness,
                readiness,
                summary,
                evidenceCountFound,
                missingCriticalCount,
                null,
                List.of(),
                List.of(),
                null
        );
    }
}
