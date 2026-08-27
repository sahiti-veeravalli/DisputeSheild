/**
 * @deprecated Unused in production. Evidence rules now live and execute in the backend EvidenceRules.java.
 */
import type { DisputeReason, EvidenceRule } from "../types";
import { formatINR } from "./mock";

export const EVIDENCE_RULES: Record<DisputeReason, EvidenceRule[]> = {
  "Product Not Received": [
    {
      key: "trackingUpdates",
      category: "Delivery",
      name: "Courier Tracking History",
      baseRelevance: 94,
      strength: "Strong",
      why: () =>
        "The dispute concerns non-delivery. A full tracking history from pickup to last checkpoint supports the claim that the shipment moved through the courier network as expected.",
      detailFields: (ctx) => [
        { label: "Courier", value: ctx.courier },
        { label: "Tracking ID", value: ctx.trackingId },
        { label: "Origin scan", value: ctx.shippingTimestamp },
        { label: "Last checkpoint", value: ctx.deliveryTimestamp },
      ],
    },
    {
      key: "deliveryStatusRecord",
      category: "Delivery",
      name: "Delivery Status Record",
      baseRelevance: 90,
      strength: "Strong",
      why: () =>
        "A courier-confirmed \"delivered\" status is one of the most direct pieces of evidence against a non-delivery claim.",
      detailFields: (ctx) => [
        { label: "Status", value: "Delivered" },
        { label: "Delivered at", value: ctx.deliveryTimestamp },
        { label: "Destination", value: ctx.city },
      ],
    },
    {
      key: "signedProofOfDelivery",
      category: "Delivery",
      name: "Signed Proof of Delivery",
      baseRelevance: 88,
      strength: "Strong",
      critical: true,
      why: () =>
        "A recipient signature or OTP-based delivery confirmation strengthens the response by tying the delivery to a specific person at the address.",
      gapWhy:
        "Additional confirmation that the customer or recipient received the package could strengthen the merchant's response.",
      gapAction: "Request signed delivery confirmation or OTP proof from the logistics provider.",
      detailFields: (ctx) => [
        { label: "Recipient", value: "On file with courier" },
        { label: "Confirmation type", value: "Signature / OTP" },
        { label: "Address", value: ctx.city },
      ],
    },
    {
      key: "shippingNotification",
      category: "Customer Communication",
      name: "Shipping Notification Sent",
      baseRelevance: 76,
      strength: "Moderate",
      why: () =>
        "A timestamped shipping notification indicates the customer was informed the order was on its way, consistent with normal order fulfillment.",
      detailFields: (ctx) => [
        { label: "Sent to", value: "Customer registered contact" },
        { label: "Sent at", value: ctx.shippingTimestamp },
        { label: "Channel", value: "Email + SMS" },
      ],
    },
    {
      key: "orderConfirmation",
      category: "Customer Communication",
      name: "Order Confirmation Sent",
      baseRelevance: 70,
      strength: "Moderate",
      why: () =>
        "An order confirmation record is consistent with a legitimate, acknowledged purchase and establishes the fulfillment timeline's starting point.",
      detailFields: (ctx) => [
        { label: "Order ID", value: ctx.orderId },
        { label: "Confirmed at", value: ctx.orderTimestamp },
      ],
    },
    {
      key: "orderRecord",
      category: "Order",
      name: "Order & Shipping Details",
      baseRelevance: 66,
      strength: "Moderate",
      why: () =>
        "Matching order and shipping address details are consistent with the transaction and rule out a mismatched-order explanation.",
      detailFields: (ctx) => [
        { label: "Product", value: ctx.product },
        { label: "Shipping address", value: ctx.city },
        { label: "Order placed", value: ctx.orderTimestamp },
      ],
    },
    {
      key: "transactionRecord",
      category: "Transaction",
      name: "Payment Capture Record",
      baseRelevance: 48,
      strength: "Weak",
      why: () =>
        "The captured payment record confirms the transaction occurred as billed, providing baseline context for the dispute.",
      detailFields: (ctx, d) => [
        { label: "Payment ID", value: ctx.paymentId },
        { label: "Amount", value: formatINR(d.amount) },
        { label: "Status", value: "Captured" },
      ],
    },
  ],

  "Fraudulent Transaction": [
    {
      key: "deviceConsistency",
      category: "Device & Payment Signals",
      name: "Device Consistency Signal",
      baseRelevance: 95,
      strength: "Strong",
      critical: true,
      why: () =>
        "A device fingerprint matching the customer's prior sessions indicates the transaction was likely initiated from a recognized, trusted device.",
      gapWhy:
        "Without a matching device fingerprint, it is harder to rule out an unauthorized device initiating the transaction.",
      gapAction: "Pull device fingerprint logs from the payment gateway's risk engine for this transaction.",
      detailFields: (ctx) => [
        { label: "Device ID", value: ctx.deviceId },
        { label: "Match against history", value: "Consistent" },
      ],
    },
    {
      key: "ipConsistency",
      category: "Device & Payment Signals",
      name: "IP Address Consistency",
      baseRelevance: 92,
      strength: "Strong",
      critical: true,
      why: () =>
        "An IP address consistent with the customer's usual geography and network supports the transaction's legitimacy.",
      gapWhy:
        "Without IP consistency data, an unusual or unrecognized network origin cannot be ruled out.",
      gapAction: "Retrieve IP geolocation logs from the payment processor for this session.",
      detailFields: (ctx) => [
        { label: "IP address", value: ctx.ip },
        { label: "Geolocation", value: ctx.city },
      ],
    },
    {
      key: "paymentAuthSignal",
      category: "Device & Payment Signals",
      name: "3-D Secure / OTP Authentication",
      baseRelevance: 90,
      strength: "Strong",
      critical: true,
      why: () =>
        "A successful 3-D Secure or OTP authentication indicates the cardholder actively approved the transaction, which directly addresses a fraud claim.",
      gapWhy:
        "Authentication logs were not found. Without them, it is harder to demonstrate active cardholder approval at checkout.",
      gapAction: "Request the authentication/OTP verification log from the payment gateway.",
      detailFields: (ctx) => [
        { label: "Auth method", value: "OTP" },
        { label: "Payment ID", value: ctx.paymentId },
        { label: "Result", value: "Authenticated" },
      ],
    },
    {
      key: "previousTransactionHistory",
      category: "Device & Payment Signals",
      name: "Previous Transaction History",
      baseRelevance: 80,
      strength: "Moderate",
      why: () =>
        "A history of prior legitimate, undisputed transactions on the same account is consistent with an established, genuine customer relationship.",
      detailFields: () => [
        { label: "Prior transactions", value: "Multiple, undisputed" },
        { label: "Account standing", value: "Consistent history" },
      ],
    },
    {
      key: "shippingAddressMatch",
      category: "Order",
      name: "Shipping Address Match",
      baseRelevance: 65,
      strength: "Moderate",
      why: () =>
        "A shipping address matching the cardholder's known address is consistent with an authorized purchase rather than a fraudulent one.",
      detailFields: (ctx) => [
        { label: "Shipping address", value: ctx.city },
        { label: "Order ID", value: ctx.orderId },
      ],
    },
    {
      key: "deliveryConfirmation",
      category: "Delivery",
      name: "Delivery Confirmation",
      baseRelevance: 55,
      strength: "Weak",
      why: () =>
        "Confirmed delivery to a known address indicates order fulfillment proceeded normally, which weighs against the transaction being fraudulent.",
      detailFields: (ctx) => [
        { label: "Courier", value: ctx.courier },
        { label: "Delivered at", value: ctx.deliveryTimestamp },
      ],
    },
    {
      key: "transactionRecord",
      category: "Transaction",
      name: "Payment Capture Record",
      baseRelevance: 45,
      strength: "Weak",
      why: () =>
        "The transaction record establishes the baseline payment details being disputed.",
      detailFields: (ctx, d) => [
        { label: "Payment ID", value: ctx.paymentId },
        { label: "Amount", value: formatINR(d.amount) },
      ],
    },
  ],

  "Duplicate Charge": [
    {
      key: "transactionTimeline",
      category: "Transaction",
      name: "Transaction Timeline",
      baseRelevance: 96,
      strength: "Strong",
      why: () =>
        "A clear timeline of both charges, with timestamps and gateway responses, directly addresses whether two distinct charges actually occurred.",
      detailFields: (ctx) => [
        { label: "Charge 1", value: ctx.paymentTimestamp },
        { label: "Gateway response", value: "Captured" },
      ],
    },
    {
      key: "distinctPaymentIds",
      category: "Transaction",
      name: "Distinct Payment IDs",
      baseRelevance: 93,
      strength: "Strong",
      why: () =>
        "Distinct payment identifiers for each charge indicate they were processed as separate authorization attempts, which is relevant context for a duplicate-charge claim.",
      detailFields: (ctx) => [
        { label: "Payment ID", value: ctx.paymentId },
        { label: "Order ID", value: ctx.orderId },
      ],
    },
    {
      key: "duplicateDetectionFlag",
      category: "Transaction",
      name: "Internal Duplicate-Charge Check",
      baseRelevance: 90,
      strength: "Strong",
      critical: true,
      why: () =>
        "An internal reconciliation check that finds no duplicate settlement supports the position that only one valid charge was collected.",
      gapWhy:
        "An internal duplicate-charge reconciliation result was not found for this transaction.",
      gapAction: "Run the transaction through the payment reconciliation system and attach the result.",
      detailFields: (ctx, d) => [
        { label: "Amount", value: formatINR(d.amount) },
        { label: "Payment ID", value: ctx.paymentId },
      ],
    },
    {
      key: "refundHistory",
      category: "Transaction",
      name: "Refund / Reversal History",
      baseRelevance: 84,
      strength: "Moderate",
      critical: true,
      why: () =>
        "Refund and reversal records show whether any erroneous charge was already corrected, which is directly relevant to a duplicate-charge claim.",
      gapWhy:
        "No refund or reversal record was found. If a genuine duplicate occurred, this gap could weaken the response.",
      gapAction: "Check the payment gateway ledger for any prior refund or reversal tied to this order.",
      detailFields: (ctx) => [
        { label: "Order ID", value: ctx.orderId },
        { label: "Refunds found", value: "None on file" },
      ],
    },
    {
      key: "orderRecord",
      category: "Order",
      name: "Single Order Match",
      baseRelevance: 60,
      strength: "Moderate",
      why: () =>
        "A single order record tied to the transaction is consistent with one fulfilled purchase rather than two separate orders.",
      detailFields: (ctx) => [
        { label: "Order ID", value: ctx.orderId },
        { label: "Product", value: ctx.product },
      ],
    },
    {
      key: "customerCommunication",
      category: "Customer Communication",
      name: "Billing Support Thread",
      baseRelevance: 48,
      strength: "Weak",
      why: () =>
        "Prior support communication provides additional context on how the billing question was raised and handled.",
      detailFields: (ctx) => [{ label: "Order reference", value: ctx.orderId }],
    },
  ],

  "Product Not as Described": [
    {
      key: "productDescriptionRecord",
      category: "Order",
      name: "Listed Product Description",
      baseRelevance: 90,
      strength: "Strong",
      why: () =>
        "The product listing at time of purchase directly addresses whether the item description matched what was advertised.",
      detailFields: (ctx) => [
        { label: "Product", value: ctx.product },
        { label: "Listing captured at", value: ctx.orderTimestamp },
      ],
    },
    {
      key: "orderRecord",
      category: "Order",
      name: "Order Details",
      baseRelevance: 84,
      strength: "Strong",
      why: () =>
        "Order details confirming the exact item, variant, and specifications purchased are consistent with the listing shown to the customer.",
      detailFields: (ctx) => [
        { label: "Order ID", value: ctx.orderId },
        { label: "Product", value: ctx.product },
      ],
    },
    {
      key: "customerSupportMessages",
      category: "Customer Communication",
      name: "Customer Support Thread",
      baseRelevance: 87,
      strength: "Strong",
      critical: true,
      why: () =>
        "Support conversation history shows how the merchant responded to the customer's concern, which is directly relevant to a product-mismatch claim.",
      gapWhy:
        "No support conversation was found for this order. Without it, there is no record of how the concern was communicated or handled.",
      gapAction: "Check the support inbox and helpdesk system for messages tied to this order ID.",
      detailFields: (ctx) => [{ label: "Order reference", value: ctx.orderId }],
    },
    {
      key: "returnRefundPolicy",
      category: "Order",
      name: "Return & Refund Policy",
      baseRelevance: 73,
      strength: "Moderate",
      critical: true,
      why: () =>
        "The applicable return and refund policy at time of purchase provides context on the options that were available to the customer.",
      gapWhy:
        "A copy of the return/refund policy shown at checkout was not found on file for this order.",
      gapAction: "Attach the archived version of the return/refund policy that was live on the purchase date.",
      detailFields: () => [{ label: "Policy window", value: "As published at checkout" }],
    },
    {
      key: "orderConfirmation",
      category: "Customer Communication",
      name: "Order Confirmation Sent",
      baseRelevance: 62,
      strength: "Moderate",
      why: () =>
        "The order confirmation reflects the exact item and specifications the customer agreed to purchase.",
      detailFields: (ctx) => [{ label: "Confirmed at", value: ctx.orderTimestamp }],
    },
    {
      key: "deliveryConfirmation",
      category: "Delivery",
      name: "Delivery Confirmation",
      baseRelevance: 50,
      strength: "Weak",
      why: () =>
        "Confirmed delivery of the correct package weight/dimensions is loosely consistent with the correct item having been shipped.",
      detailFields: (ctx) => [{ label: "Delivered at", value: ctx.deliveryTimestamp }],
    },
  ],
};
