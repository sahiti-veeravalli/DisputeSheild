package com.disputeshield.backend.engine;

import com.disputeshield.backend.domain.DisputeReason;

import java.util.List;

/**
 * The minimal inputs the rule engine needs to run an analysis: which dispute reason
 * governs the applicable rule set, the transaction amount (used in a couple of detail
 * fields / summary text), and which evidence keys are missing from the merchant's
 * records for this case. Used both for real disputes and for the synthetic evaluation
 * dataset, so both paths run through the exact same engine code.
 */
public record DisputeFeatures(String id, DisputeReason reason, long amount, List<String> missingKeys) {
}
