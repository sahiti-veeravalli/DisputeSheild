package com.disputeshield.backend.engine;

/** Direct port of the frontend's `DisputeContext` interface (src/types.ts). */
public record DisputeContext(
        String paymentId,
        String orderId,
        String trackingId,
        String courier,
        String product,
        String city,
        String deviceId,
        String ip,
        String orderTimestamp,
        String paymentTimestamp,
        String shippingTimestamp,
        String deliveryTimestamp,
        String supportTimestamp
) {
}
