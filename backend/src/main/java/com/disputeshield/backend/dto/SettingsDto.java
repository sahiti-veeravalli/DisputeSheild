package com.disputeshield.backend.dto;

public record SettingsDto(
        String activePaymentGateway,
        String webhookEndpoint,
        boolean autoInvestigate,
        boolean urgentDeadlineAlerts,
        long highValueThresholdInInr
) {
}
