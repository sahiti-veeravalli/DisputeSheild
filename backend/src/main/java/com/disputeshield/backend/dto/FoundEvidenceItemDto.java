package com.disputeshield.backend.dto;

import com.disputeshield.backend.domain.EvidenceCategory;
import com.disputeshield.backend.domain.EvidenceStrength;
import com.disputeshield.backend.engine.DetailField;

import java.util.List;

public record FoundEvidenceItemDto(
        String key,
        EvidenceCategory category,
        String name,
        int relevance,
        EvidenceStrength strength,
        String why,
        List<DetailField> details
) {
}
