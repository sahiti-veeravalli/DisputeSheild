export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
