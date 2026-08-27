/**
 * @deprecated Unused in production. Dispute analysis logic now lives and executes exclusively
 * in the backend REST API (backend/src/main/java/com/disputeshield/backend/engine/RuleEngine.java).
 */
import type { AnalysisResult, Dispute, ReadinessLevel } from "../types";
import { EVIDENCE_RULES } from "../data/evidenceRules";
import { getDisputeContext, formatINR } from "../data/mock";

function buildSummary(
  dispute: Dispute,
  foundNames: string[],
  missingCriticalNames: string[],
  readiness: ReadinessLevel
): string {
  const reasonIntro: Record<Dispute["reason"], string> = {
    "Product Not Received": "This dispute concerns product non-delivery.",
    "Fraudulent Transaction": "This dispute concerns a claim that the transaction was unauthorized.",
    "Duplicate Charge": "This dispute concerns a claim of being charged more than once.",
    "Product Not as Described": "This dispute concerns a claim that the product did not match its description.",
  };

  const topFound = foundNames.slice(0, 2).join(" and ");
  const supportSentence = topFound
    ? `The available ${topFound.toLowerCase()} supports the merchant's position and is consistent with a legitimate, fulfilled transaction of ${formatINR(
        dispute.amount
      )}.`
    : `Limited evidence is currently on file for this transaction of ${formatINR(dispute.amount)}.`;

  let gapSentence = "";
  if (missingCriticalNames.length === 1) {
    gapSentence = ` However, ${missingCriticalNames[0].toLowerCase()} was not found, which may limit the strength of the evidence.`;
  } else if (missingCriticalNames.length > 1) {
    gapSentence = ` However, ${missingCriticalNames
      .join(" and ")
      .toLowerCase()} were not found, which meaningfully limits the strength of the evidence.`;
  } else {
    gapSentence = " No critical evidence gaps were identified for this dispute reason.";
  }

  const readinessNote: Record<ReadinessLevel, string> = {
    HIGH: " Overall, the evidence on file strongly supports a defense response.",
    MEDIUM: " Overall, the evidence indicates a reasonable but not complete defense response.",
    LOW: " Overall, the evidence gaps indicate the response would benefit from additional documentation before submission.",
  };

  return `${reasonIntro[dispute.reason]} ${supportSentence}${gapSentence}${readinessNote[readiness]}`;
}

export function analyzeDispute(dispute: Dispute): AnalysisResult {
  const rules = EVIDENCE_RULES[dispute.reason];
  const ctx = getDisputeContext(dispute);

  const found: AnalysisResult["found"] = [];
  const missing: AnalysisResult["missing"] = [];

  let totalRelevance = 0;
  let gotRelevance = 0;

  for (const rule of rules) {
    totalRelevance += rule.baseRelevance;
    const isMissing = dispute.missingKeys.includes(rule.key);
    if (isMissing) {
      missing.push({
        key: rule.key,
        name: rule.name,
        why: rule.gapWhy ?? "This evidence could not be located on file for this transaction.",
        action: rule.gapAction ?? "Check internal systems for this record and attach it if available.",
        critical: !!rule.critical,
      });
    } else {
      gotRelevance += rule.baseRelevance;
      found.push({
        key: rule.key,
        category: rule.category,
        name: rule.name,
        relevance: rule.baseRelevance,
        strength: rule.strength,
        why: rule.why(dispute),
        details: rule.detailFields(ctx, dispute),
      });
    }
  }

  found.sort((a, b) => b.relevance - a.relevance);

  const completeness = Math.round((gotRelevance / totalRelevance) * 100);
  const missingCriticalCount = missing.filter((m) => m.critical).length;

  let readiness: ReadinessLevel = "LOW";
  if (completeness >= 85 && missingCriticalCount === 0) readiness = "HIGH";
  else if (completeness >= 60) readiness = "MEDIUM";

  const summary = buildSummary(
    dispute,
    found.slice(0, 2).map((f) => f.name),
    missing.filter((m) => m.critical).map((m) => m.name),
    readiness
  );

  return {
    found,
    missing,
    completeness,
    readiness,
    summary,
    evidenceCountFound: found.length,
    missingCriticalCount,
  };
}
