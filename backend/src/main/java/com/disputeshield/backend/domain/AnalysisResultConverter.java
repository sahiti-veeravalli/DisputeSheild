package com.disputeshield.backend.domain;

import com.disputeshield.backend.dto.AnalysisResultDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * The stored analysis result (found/missing evidence, completeness, readiness, summary)
 * is a nested tree, not a flat row. We persist it as a JSON column rather than exploding it
 * into half a dozen join tables — the rule engine that PRODUCES this data is the part that
 * needs to be relationally inspectable and explainable (see EvidenceRules), and it is.
 * The stored *result* of running it is just a cached computation.
 */
@Converter
public class AnalysisResultConverter implements AttributeConverter<AnalysisResultDto, String> {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(AnalysisResultDto attribute) {
        if (attribute == null) return null;
        try {
            return MAPPER.writeValueAsString(attribute);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to serialize AnalysisResultDto", e);
        }
    }

    @Override
    public AnalysisResultDto convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        try {
            return MAPPER.readValue(dbData, AnalysisResultDto.class);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to deserialize AnalysisResultDto", e);
        }
    }
}
