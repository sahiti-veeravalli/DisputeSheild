package com.disputeshield.backend.dto;

public record MissingEvidenceItemDto(
        String key,
        String name,
        String why,
        String action,
        boolean critical
) {
}
