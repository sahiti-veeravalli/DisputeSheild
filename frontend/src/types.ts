export type DisputeReason =
  | "Product Not Received"
  | "Fraudulent Transaction"
  | "Product Not as Described"
  | "Duplicate Charge";

export type DisputeStatus = "New" | "Investigating" | "Resolved";

export interface Dispute {
  id: string;
  customer: string;
  amount: number;
  reason: DisputeReason;
  deadlineDays: number;
  status: DisputeStatus;
  openedAt: string;
  missingKeys: string[];
  analysis?: AnalysisResult;
  packetGenerated?: boolean;
  packetApproved?: boolean;
  submitted?: boolean;
  submissionRef?: string;
}

export type EvidenceCategory =
  | "Transaction"
  | "Order"
  | "Delivery"
  | "Customer Communication"
  | "Device & Payment Signals";

export type EvidenceStrength = "Strong" | "Moderate" | "Weak";

export interface DetailField {
  label: string;
  value: string;
}

export interface DisputeContext {
  paymentId: string;
  orderId: string;
  trackingId: string;
  courier: string;
  product: string;
  city: string;
  deviceId: string;
  ip: string;
  orderTimestamp: string;
  paymentTimestamp: string;
  shippingTimestamp: string;
  deliveryTimestamp: string;
  supportTimestamp: string;
}

export interface EvidenceRule {
  key: string;
  category: EvidenceCategory;
  name: string;
  baseRelevance: number;
  strength: EvidenceStrength;
  critical?: boolean;
  why: (dispute: Dispute) => string;
  gapWhy?: string;
  gapAction?: string;
  detailFields: (ctx: DisputeContext, dispute: Dispute) => DetailField[];
}

export interface FoundEvidenceItem {
  key: string;
  category: EvidenceCategory;
  name: string;
  relevance: number;
  strength: EvidenceStrength;
  why: string;
  details: DetailField[];
}

export interface MissingEvidenceItem {
  key: string;
  name: string;
  why: string;
  action: string;
  critical: boolean;
}

export type ReadinessLevel = "HIGH" | "MEDIUM" | "LOW";

export interface AnalysisResult {
  found: FoundEvidenceItem[];
  missing: MissingEvidenceItem[];
  completeness: number;
  readiness: ReadinessLevel;
  summary: string;
  evidenceCountFound: number;
  missingCriticalCount: number;
  evidenceSufficiencyProbability?: number;
  topPositiveFactors?: string[];
  missingCriticalFactors?: string[];
  decisionSupportDisclaimer?: string;
}

export interface AuditEntry {
  label: string;
  timestamp: string;
}

export interface DisputeCaseState {
  status: DisputeStatus;
  analysis?: AnalysisResult;
  packetApproved: boolean;
  submitted: boolean;
  submissionRef?: string;
  audit: AuditEntry[];
}

export interface SubmissionResponse {
  submissionRef: string;
}

export interface ConfusionMatrix {
  truePositive: number;
  falsePositive: number;
  trueNegative: number;
  falseNegative: number;
}

export interface ExceptionCase {
  id: string;
  reason: DisputeReason;
  amount: number;
  completeness: number;
  missingCriticalCount: number;
  actualOutcome: "WON" | "LOST";
  predictedOutcome: "WON" | "LOST";
  predictedProbability: number;
}

export interface EvaluationReport {
  seed: number;
  datasetSize: number;
  trainSize: number;
  testSize: number;
  precision: number;
  recall: number;
  f1: number;
  confusionMatrix: ConfusionMatrix;
  falsePositiveCostInInr: number;
  exceptions: ExceptionCase[];
  methodology: string;
  guardrailNote: string;
}
