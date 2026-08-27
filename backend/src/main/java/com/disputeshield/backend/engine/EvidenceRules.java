package com.disputeshield.backend.engine;

import com.disputeshield.backend.domain.DisputeReason;
import com.disputeshield.backend.domain.EvidenceCategory;
import com.disputeshield.backend.domain.EvidenceStrength;

import java.util.List;
import java.util.Map;

import static com.disputeshield.backend.domain.EvidenceCategory.*;
import static com.disputeshield.backend.domain.EvidenceStrength.*;
import static com.disputeshield.backend.engine.EvidenceRule.of;
import static com.disputeshield.backend.engine.MockContextGenerator.formatINR;

/**
 * Direct, line-for-line port of the frontend's src/data/evidenceRules.ts. Same reason,
 * same relevance weights, same critical flags, same gap explanations on both sides of the
 * wire, so the API cannot silently drift from what the UI already documents.
 */
public final class EvidenceRules {

    private EvidenceRules() {
    }

    public static final Map<DisputeReason, List<EvidenceRule>> RULES = Map.of(

            DisputeReason.PRODUCT_NOT_RECEIVED, List.of(
                    of("trackingUpdates", DELIVERY, "Courier Tracking History", 94, STRONG, false, null, null,
                            () -> "The dispute concerns non-delivery. A full tracking history from pickup to last checkpoint supports the claim that the shipment moved through the courier network as expected.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Courier", ctx.courier()),
                                    new DetailField("Tracking ID", ctx.trackingId()),
                                    new DetailField("Origin scan", ctx.shippingTimestamp()),
                                    new DetailField("Last checkpoint", ctx.deliveryTimestamp()))),
                    of("deliveryStatusRecord", DELIVERY, "Delivery Status Record", 90, STRONG, false, null, null,
                            () -> "A courier-confirmed \"delivered\" status is one of the most direct pieces of evidence against a non-delivery claim.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Status", "Delivered"),
                                    new DetailField("Delivered at", ctx.deliveryTimestamp()),
                                    new DetailField("Destination", ctx.city()))),
                    of("signedProofOfDelivery", DELIVERY, "Signed Proof of Delivery", 88, STRONG, true,
                            "Additional confirmation that the customer or recipient received the package could strengthen the merchant's response.",
                            "Request signed delivery confirmation or OTP proof from the logistics provider.",
                            () -> "A recipient signature or OTP-based delivery confirmation strengthens the response by tying the delivery to a specific person at the address.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Recipient", "On file with courier"),
                                    new DetailField("Confirmation type", "Signature / OTP"),
                                    new DetailField("Address", ctx.city()))),
                    of("shippingNotification", CUSTOMER_COMMUNICATION, "Shipping Notification Sent", 76, MODERATE, false, null, null,
                            () -> "A timestamped shipping notification indicates the customer was informed the order was on its way, consistent with normal order fulfillment.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Sent to", "Customer registered contact"),
                                    new DetailField("Sent at", ctx.shippingTimestamp()),
                                    new DetailField("Channel", "Email + SMS"))),
                    of("orderConfirmation", CUSTOMER_COMMUNICATION, "Order Confirmation Sent", 70, MODERATE, false, null, null,
                            () -> "An order confirmation record is consistent with a legitimate, acknowledged purchase and establishes the fulfillment timeline's starting point.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Order ID", ctx.orderId()),
                                    new DetailField("Confirmed at", ctx.orderTimestamp()))),
                    of("orderRecord", ORDER, "Order & Shipping Details", 66, MODERATE, false, null, null,
                            () -> "Matching order and shipping address details are consistent with the transaction and rule out a mismatched-order explanation.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Product", ctx.product()),
                                    new DetailField("Shipping address", ctx.city()),
                                    new DetailField("Order placed", ctx.orderTimestamp()))),
                    of("transactionRecord", TRANSACTION, "Payment Capture Record", 48, WEAK, false, null, null,
                            () -> "The captured payment record confirms the transaction occurred as billed, providing baseline context for the dispute.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Payment ID", ctx.paymentId()),
                                    new DetailField("Amount", formatINR(amount)),
                                    new DetailField("Status", "Captured")))
            ),

            DisputeReason.FRAUDULENT_TRANSACTION, List.of(
                    of("deviceConsistency", DEVICE_AND_PAYMENT_SIGNALS, "Device Consistency Signal", 95, STRONG, true,
                            "Without a matching device fingerprint, it is harder to rule out an unauthorized device initiating the transaction.",
                            "Pull device fingerprint logs from the payment gateway's risk engine for this transaction.",
                            () -> "A device fingerprint matching the customer's prior sessions indicates the transaction was likely initiated from a recognized, trusted device.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Device ID", ctx.deviceId()),
                                    new DetailField("Match against history", "Consistent"))),
                    of("ipConsistency", DEVICE_AND_PAYMENT_SIGNALS, "IP Address Consistency", 92, STRONG, true,
                            "Without IP consistency data, an unusual or unrecognized network origin cannot be ruled out.",
                            "Retrieve IP geolocation logs from the payment processor for this session.",
                            () -> "An IP address consistent with the customer's usual geography and network supports the transaction's legitimacy.",
                            (ctx, amount) -> List.of(
                                    new DetailField("IP address", ctx.ip()),
                                    new DetailField("Geolocation", ctx.city()))),
                    of("paymentAuthSignal", DEVICE_AND_PAYMENT_SIGNALS, "3-D Secure / OTP Authentication", 90, STRONG, true,
                            "Authentication logs were not found. Without them, it is harder to demonstrate active cardholder approval at checkout.",
                            "Request the authentication/OTP verification log from the payment gateway.",
                            () -> "A successful 3-D Secure or OTP authentication indicates the cardholder actively approved the transaction, which directly addresses a fraud claim.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Auth method", "OTP"),
                                    new DetailField("Payment ID", ctx.paymentId()),
                                    new DetailField("Result", "Authenticated"))),
                    of("previousTransactionHistory", DEVICE_AND_PAYMENT_SIGNALS, "Previous Transaction History", 80, MODERATE, false, null, null,
                            () -> "A history of prior legitimate, undisputed transactions on the same account is consistent with an established, genuine customer relationship.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Prior transactions", "Multiple, undisputed"),
                                    new DetailField("Account standing", "Consistent history"))),
                    of("shippingAddressMatch", ORDER, "Shipping Address Match", 65, MODERATE, false, null, null,
                            () -> "A shipping address matching the cardholder's known address is consistent with an authorized purchase rather than a fraudulent one.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Shipping address", ctx.city()),
                                    new DetailField("Order ID", ctx.orderId()))),
                    of("deliveryConfirmation", DELIVERY, "Delivery Confirmation", 55, WEAK, false, null, null,
                            () -> "Confirmed delivery to a known address indicates order fulfillment proceeded normally, which weighs against the transaction being fraudulent.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Courier", ctx.courier()),
                                    new DetailField("Delivered at", ctx.deliveryTimestamp()))),
                    of("transactionRecord", TRANSACTION, "Payment Capture Record", 45, WEAK, false, null, null,
                            () -> "The transaction record establishes the baseline payment details being disputed.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Payment ID", ctx.paymentId()),
                                    new DetailField("Amount", formatINR(amount))))
            ),

            DisputeReason.DUPLICATE_CHARGE, List.of(
                    of("transactionTimeline", TRANSACTION, "Transaction Timeline", 96, STRONG, false, null, null,
                            () -> "A clear timeline of both charges, with timestamps and gateway responses, directly addresses whether two distinct charges actually occurred.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Charge 1", ctx.paymentTimestamp()),
                                    new DetailField("Gateway response", "Captured"))),
                    of("distinctPaymentIds", TRANSACTION, "Distinct Payment IDs", 93, STRONG, false, null, null,
                            () -> "Distinct payment identifiers for each charge indicate they were processed as separate authorization attempts, which is relevant context for a duplicate-charge claim.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Payment ID", ctx.paymentId()),
                                    new DetailField("Order ID", ctx.orderId()))),
                    of("duplicateDetectionFlag", TRANSACTION, "Internal Duplicate-Charge Check", 90, STRONG, true,
                            "An internal duplicate-charge reconciliation result was not found for this transaction.",
                            "Run the transaction through the payment reconciliation system and attach the result.",
                            () -> "An internal reconciliation check that finds no duplicate settlement supports the position that only one valid charge was collected.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Amount", formatINR(amount)),
                                    new DetailField("Payment ID", ctx.paymentId()))),
                    of("refundHistory", TRANSACTION, "Refund / Reversal History", 84, MODERATE, true,
                            "No refund or reversal record was found. If a genuine duplicate occurred, this gap could weaken the response.",
                            "Check the payment gateway ledger for any prior refund or reversal tied to this order.",
                            () -> "Refund and reversal records show whether any erroneous charge was already corrected, which is directly relevant to a duplicate-charge claim.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Order ID", ctx.orderId()),
                                    new DetailField("Refunds found", "None on file"))),
                    of("orderRecord", ORDER, "Single Order Match", 60, MODERATE, false, null, null,
                            () -> "A single order record tied to the transaction is consistent with one fulfilled purchase rather than two separate orders.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Order ID", ctx.orderId()),
                                    new DetailField("Product", ctx.product()))),
                    of("customerCommunication", CUSTOMER_COMMUNICATION, "Billing Support Thread", 48, WEAK, false, null, null,
                            () -> "Prior support communication provides additional context on how the billing question was raised and handled.",
                            (ctx, amount) -> List.of(new DetailField("Order reference", ctx.orderId())))
            ),

            DisputeReason.PRODUCT_NOT_AS_DESCRIBED, List.of(
                    of("productDescriptionRecord", ORDER, "Listed Product Description", 90, STRONG, false, null, null,
                            () -> "The product listing at time of purchase directly addresses whether the item description matched what was advertised.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Product", ctx.product()),
                                    new DetailField("Listing captured at", ctx.orderTimestamp()))),
                    of("orderRecord", ORDER, "Order Details", 84, STRONG, false, null, null,
                            () -> "Order details confirming the exact item, variant, and specifications purchased are consistent with the listing shown to the customer.",
                            (ctx, amount) -> List.of(
                                    new DetailField("Order ID", ctx.orderId()),
                                    new DetailField("Product", ctx.product()))),
                    of("customerSupportMessages", CUSTOMER_COMMUNICATION, "Customer Support Thread", 87, STRONG, true,
                            "No support conversation was found for this order. Without it, there is no record of how the concern was communicated or handled.",
                            "Check the support inbox and helpdesk system for messages tied to this order ID.",
                            () -> "Support conversation history shows how the merchant responded to the customer's concern, which is directly relevant to a product-mismatch claim.",
                            (ctx, amount) -> List.of(new DetailField("Order reference", ctx.orderId()))),
                    of("returnRefundPolicy", ORDER, "Return & Refund Policy", 73, MODERATE, true,
                            "A copy of the return/refund policy shown at checkout was not found on file for this order.",
                            "Attach the archived version of the return/refund policy that was live on the purchase date.",
                            () -> "The applicable return and refund policy at time of purchase provides context on the options that were available to the customer.",
                            (ctx, amount) -> List.of(new DetailField("Policy window", "As published at checkout"))),
                    of("orderConfirmation", CUSTOMER_COMMUNICATION, "Order Confirmation Sent", 62, MODERATE, false, null, null,
                            () -> "The order confirmation reflects the exact item and specifications the customer agreed to purchase.",
                            (ctx, amount) -> List.of(new DetailField("Confirmed at", ctx.orderTimestamp()))),
                    of("deliveryConfirmation", DELIVERY, "Delivery Confirmation", 50, WEAK, false, null, null,
                            () -> "Confirmed delivery of the correct package weight/dimensions is loosely consistent with the correct item having been shipped.",
                            (ctx, amount) -> List.of(new DetailField("Delivered at", ctx.deliveryTimestamp())))
            )
    );
}
