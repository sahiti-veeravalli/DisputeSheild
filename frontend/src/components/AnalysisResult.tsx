import { useState } from "react";
import { ChevronDown, AlertTriangle, ShieldAlert, Sparkles, CheckCircle2, Bot } from "lucide-react";
import type { AnalysisResult as AnalysisResultType, EvidenceCategory } from "../types";
import { Card, RelevanceBar, ReadinessBadge, StrengthPill } from "./ui";
import { CATEGORY_ICON } from "../utils/constants";

const CATEGORY_ORDER: EvidenceCategory[] = [
  "Transaction",
  "Order",
  "Delivery",
  "Customer Communication",
  "Device & Payment Signals",
];

export function EvidenceFoundPanel({ analysis }: { analysis: AnalysisResultType }) {
  const [openKey, setOpenKey] = useState<string | null>(analysis.found[0]?.key ?? null);

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: analysis.found.filter((f) => f.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <Card className="p-5">
      <h3 className="mb-1 font-display text-base font-semibold text-ink-100">Evidence Found</h3>
      <p className="mb-4 text-xs text-ink-500">
        {analysis.found.length} items retrieved and ranked by relevance to the dispute reason.
      </p>
      <div className="space-y-5">
        {grouped.map((group) => (
          <div key={group.category}>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-500">
              <span className="text-signal-blue">{CATEGORY_ICON[group.category]}</span>
              {group.category}
            </div>
            <div className="space-y-2">
              {group.items.map((item) => {
                const isOpen = openKey === item.key;
                return (
                  <div
                    key={item.key}
                    className="animate-fadeUp rounded-lg border border-navy-600 bg-navy-700/40"
                  >
                    <button
                      onClick={() => setOpenKey(isOpen ? null : item.key)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left"
                    >
                      <span className="text-signal-green">✓</span>
                      <span className="flex-1 text-sm font-medium text-ink-100">{item.name}</span>
                      <StrengthPill strength={item.strength} />
                      <span className="w-12 shrink-0 text-right font-mono text-xs text-ink-500">
                        {item.relevance}%
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-ink-700 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div className="px-4 pb-2">
                      <RelevanceBar value={item.relevance} />
                    </div>
                    {isOpen && (
                      <div className="animate-fadeUp space-y-3 border-t border-navy-600 px-4 py-3">
                        <div>
                          <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-ink-700">
                            Why selected
                          </div>
                          <p className="text-sm leading-relaxed text-ink-300">{item.why}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-navy-600 pt-3">
                          {item.details.map((d) => (
                            <div key={d.label} className="text-xs">
                              <span className="text-ink-700">{d.label}: </span>
                              <span className="font-mono text-ink-300">{d.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function AssessmentPanel({ analysis }: { analysis: AnalysisResultType }) {
  const sufficiencyProb =
    analysis.evidenceSufficiencyProbability != null
      ? (analysis.evidenceSufficiencyProbability * 100).toFixed(1)
      : `${analysis.completeness}.0`;

  const rawProbValue =
    analysis.evidenceSufficiencyProbability != null
      ? analysis.evidenceSufficiencyProbability * 100
      : analysis.completeness;

  const disclaimer =
    analysis.decisionSupportDisclaimer ||
    "Evidence Sufficiency Probability is an AI decision-support estimate of defense documentation strength based on historical chargeback patterns. It is an internal decision-support metric and does not guarantee dispute outcomes by issuing banks or card networks.";

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-ink-100">AI Defense Assessment</h3>
        <span className="inline-flex items-center gap-1 rounded-md bg-signal-blueDim px-2 py-0.5 font-mono text-[11px] font-medium text-signal-blue border border-signal-blue/25">
          <Bot className="h-3 w-3" />
          ML Powered
        </span>
      </div>

      {/* Primary ML Prediction Card */}
      <div className="mb-5 rounded-lg border border-signal-blue/30 bg-signal-blueDim/20 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-signal-blue">
              Evidence Sufficiency Probability
            </div>
            <div className="mt-1 font-display text-3xl font-bold text-ink-100">
              {sufficiencyProb}%
            </div>
            <div className="mt-0.5 text-xs text-ink-400">
              Calibrated defense readiness estimate
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-medium uppercase tracking-wide text-ink-500">
              Defense Readiness
            </div>
            <div className="mt-1">
              <ReadinessBadge level={analysis.readiness} />
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="h-2 w-full rounded-full bg-navy-950/60">
            <div
              className={`h-2 rounded-full transition-all duration-700 ease-out ${
                analysis.readiness === "HIGH"
                  ? "bg-signal-green"
                  : analysis.readiness === "MEDIUM"
                  ? "bg-signal-amber"
                  : "bg-signal-red"
              }`}
              style={{ width: `${Math.min(100, Math.max(0, rawProbValue))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <MetricBox
          label="Rule Engine Completeness"
          value={`${analysis.completeness}%`}
          subtitle={`${analysis.evidenceCountFound} items found`}
        />
        <MetricBox
          label="Missing Critical Gaps"
          value={`${analysis.missingCriticalCount}`}
          subtitle={analysis.missingCriticalCount === 0 ? "Zero critical gaps" : "Needs attention"}
          warn={analysis.missingCriticalCount > 0}
        />
      </div>

      {/* Top Positive Factors */}
      {analysis.topPositiveFactors && analysis.topPositiveFactors.length > 0 && (
        <div className="mb-4 rounded-lg border border-navy-600 bg-navy-700/30 p-3.5">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-signal-green">
            <Sparkles className="h-3.5 w-3.5" />
            Top Positive Evidence Factors
          </div>
          <ul className="space-y-1.5 text-xs text-ink-300">
            {analysis.topPositiveFactors.map((factor, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal-green" />
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing Critical Factors if any */}
      {analysis.missingCriticalFactors && analysis.missingCriticalFactors.length > 0 && (
        <div className="mb-4 rounded-lg border border-signal-amber/30 bg-signal-amberDim/30 p-3.5">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-signal-amber">
            <AlertTriangle className="h-3.5 w-3.5" />
            Missing Critical Evidence
          </div>
          <ul className="space-y-1.5 text-xs text-ink-200">
            {analysis.missingCriticalFactors.map((factor, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-signal-amber">•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Assessment Summary */}
      <div className="mb-4">
        <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-ink-700">
          Assessment summary
        </div>
        <p className="text-xs leading-relaxed text-ink-300">{analysis.summary}</p>
      </div>

      {/* Decision Support Guardrail */}
      <div className="flex items-start gap-2.5 rounded-lg border border-navy-600 bg-navy-950/60 p-3 text-xs leading-relaxed text-ink-400">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-signal-blue" />
        <span>{disclaimer}</span>
      </div>
    </Card>
  );
}

export function MissingEvidencePanel({ analysis }: { analysis: AnalysisResultType }) {
  if (analysis.missing.length === 0) {
    return (
      <Card className="p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-signal-green">
          <span>✓</span> No evidence gaps detected for this dispute reason.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <h3 className="mb-4 font-display text-base font-semibold text-ink-100">Evidence Gaps Detected</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {analysis.missing.map((m) => (
          <div key={m.key} className="rounded-lg border border-signal-amber/25 bg-signal-amberDim/40 p-4">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-signal-amber" />
              <span className="text-sm font-medium text-ink-100">{m.name}</span>
              {m.critical && (
                <span className="ml-auto rounded-md border border-signal-amber/30 px-1.5 py-0.5 text-[10px] text-signal-amber">
                  Critical
                </span>
              )}
            </div>
            <p className="mb-2 text-xs leading-relaxed text-ink-300">
              <span className="text-ink-500">Why it matters: </span>
              {m.why}
            </p>
            <p className="text-xs leading-relaxed text-ink-300">
              <span className="text-ink-500">Suggested action: </span>
              {m.action}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function MetricBox({
  label,
  value,
  subtitle,
  warn = false,
}: {
  label: string;
  value: string;
  subtitle?: string;
  warn?: boolean;
}) {
  return (
    <div className="rounded-lg border border-navy-600 bg-navy-700/40 p-3">
      <div className={`font-display text-xl font-semibold ${warn ? "text-signal-amber" : "text-ink-100"}`}>
        {value}
      </div>
      <div className="text-[11px] text-ink-400">{label}</div>
      {subtitle && <div className="mt-0.5 text-[10px] text-ink-600">{subtitle}</div>}
    </div>
  );
}
