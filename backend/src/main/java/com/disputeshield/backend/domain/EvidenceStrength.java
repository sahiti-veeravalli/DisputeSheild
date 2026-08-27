package com.disputeshield.backend.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EvidenceStrength {
    STRONG("Strong"),
    MODERATE("Moderate"),
    WEAK("Weak");

    private final String label;

    EvidenceStrength(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static EvidenceStrength fromLabel(String label) {
        for (EvidenceStrength s : values()) {
            if (s.label.equalsIgnoreCase(label)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Unknown evidence strength: " + label);
    }
}
