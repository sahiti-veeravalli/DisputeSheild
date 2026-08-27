package com.disputeshield.backend.dto;

public record ConfusionMatrixDto(int truePositive, int falsePositive, int trueNegative, int falseNegative) {
}
