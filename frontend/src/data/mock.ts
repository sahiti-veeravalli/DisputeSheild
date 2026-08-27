/**
 * @deprecated Unused in production. Context generation and seeding now live in the backend.
 */
import type { Dispute, DisputeContext } from "../types";

export function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function seededPick<T>(arr: T[], seed: number, salt: number): T {
  return arr[(seed + salt * 31) % arr.length];
}

function seededId(seed: number, salt: number, len = 8): string {
  const chars = "abcdefghjkmnpqrstuvwxyz0123456789";
  let n = seed + salt * 7919 + 104729;
  let out = "";
  for (let i = 0; i < len; i++) {
    out += chars[n % chars.length];
    n = Math.floor(n / chars.length) + ((n % 97) + 13) * (i + 3);
  }
  return out;
}

// Fixed reference "today" so the demo reads consistently: Aug 27, 2026
const TODAY = new Date(2026, 7, 27);

function formatDate(daysAgo: number, hour: number, minute: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const COURIERS = ["BlueDart", "Delhivery", "Ekart Logistics", "XpressBees", "DTDC"];
const PRODUCTS = [
  "Wireless Earbuds Pro",
  "Smart Fitness Band",
  "Ceramic Cookware Set",
  "Bluetooth Speaker Mini",
  "Leather Laptop Sleeve",
  "Compact Air Purifier",
  "Premium Yoga Mat",
  "Electric Kettle 1.5L",
];
const CITIES = [
  "Bengaluru, KA",
  "Mumbai, MH",
  "Hyderabad, TS",
  "Pune, MH",
  "Chennai, TN",
  "New Delhi, DL",
  "Kolkata, WB",
  "Ahmedabad, GJ",
];

export function getDisputeContext(d: Dispute): DisputeContext {
  const seed = hashStr(d.id);
  const ipA = 100 + (seed % 50);
  const ipB = (seed * 3) % 255;
  const ipC = (seed * 7) % 255;
  const ipD = (seed * 11) % 255;
  return {
    paymentId: `pay_${seededId(seed, 1, 9)}`,
    orderId: `order_${seededId(seed, 2, 9)}`,
    trackingId: seededId(seed, 3, 12).toUpperCase(),
    courier: seededPick(COURIERS, seed, 4),
    product: seededPick(PRODUCTS, seed, 5),
    city: seededPick(CITIES, seed, 6),
    deviceId: `dev_${seededId(seed, 7, 10)}`,
    ip: `${ipA}.${ipB}.${ipC}.${ipD}`,
    orderTimestamp: formatDate(7, 10, 14),
    paymentTimestamp: formatDate(7, 10, 15),
    shippingTimestamp: formatDate(6, 9, 30),
    deliveryTimestamp: formatDate(4, 16, 42),
    supportTimestamp: formatDate(2, 11, 5),
  };
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
