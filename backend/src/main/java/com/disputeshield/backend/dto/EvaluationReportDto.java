package com.disputeshield.backend.dto;

import java.util.List;

public record EvaluationReportDto(
        int seed,
        int datasetSize,
        int trainSize,
        int testSize,
        double precision,
        double recall,
        double f1,
        ConfusionMatrixDto confusionMatrix,
        long falsePositiveCostInInr,
        List<ExceptionCaseDto> exceptions,
        String methodology,
        String guardrailNote
) {
}
