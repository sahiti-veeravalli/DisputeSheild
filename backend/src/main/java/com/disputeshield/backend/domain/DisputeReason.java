package com.disputeshield.backend.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Mirrors the frontend's `DisputeReason` union type exactly (src/types.ts).
 * Serializes to/from the same display strings the React app already uses, so the
 * existing components need no shape changes.
 */
public enum DisputeReason {
    PRODUCT_NOT_RECEIVED("Product Not Received"),
    FRAUDULENT_TRANSACTION("Fraudulent Transaction"),
    PRODUCT_NOT_AS_DESCRIBED("Product Not as Described"),
    DUPLICATE_CHARGE("Duplicate Charge");

    private final String label;

    DisputeReason(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static DisputeReason fromLabel(String label) {
        for (DisputeReason r : values()) {
            if (r.label.equalsIgnoreCase(label)) {
                return r;
            }
        }
        throw new IllegalArgumentException("Unknown dispute reason: " + label);
    }
}
