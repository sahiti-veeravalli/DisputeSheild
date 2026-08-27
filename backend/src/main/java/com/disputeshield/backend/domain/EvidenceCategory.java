package com.disputeshield.backend.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EvidenceCategory {
    TRANSACTION("Transaction"),
    ORDER("Order"),
    DELIVERY("Delivery"),
    CUSTOMER_COMMUNICATION("Customer Communication"),
    DEVICE_AND_PAYMENT_SIGNALS("Device & Payment Signals");

    private final String label;

    EvidenceCategory(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static EvidenceCategory fromLabel(String label) {
        for (EvidenceCategory c : values()) {
            if (c.label.equalsIgnoreCase(label)) {
                return c;
            }
        }
        throw new IllegalArgumentException("Unknown evidence category: " + label);
    }
}
