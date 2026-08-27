package com.disputeshield.backend.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum DisputeStatus {
    NEW("New"),
    INVESTIGATING("Investigating"),
    RESOLVED("Resolved");

    private final String label;

    DisputeStatus(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static DisputeStatus fromLabel(String label) {
        for (DisputeStatus s : values()) {
            if (s.label.equalsIgnoreCase(label)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Unknown dispute status: " + label);
    }
}
