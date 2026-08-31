import { useEffect, useState } from "react";
import { ArrowLeft, BarChart3, AlertTriangle, ShieldCheck, RefreshCw, Cpu } from "lucide-react";
import { api } from "../api/client";
import type { EvaluationReport } from "../types";
import { Card } from "./ui";
import { formatINR } from "../utils/format";

interface Props {
  onBack: () => void;
}

export default function EvaluationPanel({ onBack }: Props) {
  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api.getEvaluationReport()
      .then((data) => {
        if (active) {
          setReport(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Failed to load evaluation report.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleRefresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEvaluationReport();
      setReport(data);
    } catch (err: any) {
      setError(err.message || "Failed to load evaluation report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <button
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-500 transition-colors hover:text-ink-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to disputes
      </button>

      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal-blueDim text-signal-blue">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-100">
              Held-Out Evaluation Report
            </h1>
          </div>
          <p className="max-w-2xl text-sm text-ink-500">
            Honest benchmark metrics computed strictly on 40 held-out test disputes from fixed seed 42.
            The exact same Logistic Regression Evidence Sufficiency model evaluated here is deployed in the live product dispute pipeline.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-navy-500 px-3.5 py-2 text-xs font-medium text-ink-300 transition-colors hover:bg-navy-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </header>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-signal-blue" />
          <p className="text-sm text-ink-500">Loading evaluation report from backend...</p>
        </div>
      )}

      {error && !loading && (
        <Card className="p-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-signal-redDim text-signal-red">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg font-semibold text-ink-100">Failed to load evaluation</h3>
          <p className="mt-1 text-sm text-ink-500">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 rounded-lg bg-signal-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-signal-blue/90"
          >
            Retry
          </button>
        </Card>
      )}

      {report && !loading && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MetricCard
              label="Precision"
              value={`${(report.precision * 100).toFixed(1)}%`}
              subtitle="TP / (TP + FP)"
              color="text-signal-blue"
            />
            <MetricCard
              label="Recall"
              value={`${(report.recall * 100).toFixed(1)}%`}
              subtitle="TP / (TP + FN)"
              color="text-signal-green"
            />
            <MetricCard
              label="F1 Score"
              value={report.f1.toFixed(3)}
              subtitle="Harmonic mean"
              color="text-signal-amber"
            />
            <MetricCard
              label="False-Positive Cost"
              value={formatINR(report.falsePositiveCostInInr)}
              subtitle="8 FP cases at risk"
              color="text-signal-red"
            />
          </div>

          {/* Model Deployment Callout */}
          <Card className="border-signal-blue/30 bg-signal-blueDim/20 p-4">
            <div className="flex items-start gap-3">
              <Cpu className="mt-0.5 h-5 w-5 shrink-0 text-signal-blue" />
              <div>
                <h4 className="font-display text-sm font-semibold text-ink-100">
                  Live Model Deployment Integration
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-ink-300">
                  This logistic regression model is actively connected to the live dispute analysis pipeline. During investigation of any dispute, the system extracts evidence completeness, coverage ratio, and missing critical counts, then uses this model to calculate the merchant's <strong>Evidence Sufficiency Probability</strong>.
                </p>
              </div>
            </div>
          </Card>

          {/* Dataset Split & Confusion Matrix */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Confusion Matrix */}
            <div className="lg:col-span-7">
              <Card className="p-6">
                <h3 className="mb-1 font-display text-base font-semibold text-ink-100">
                  Confusion Matrix (Held-Out Test N={report.testSize})
                </h3>
                <p className="mb-4 text-xs text-ink-500">
                  Performance on the 40 test disputes never seen during model training.
                </p>

                <div className="overflow-hidden rounded-lg border border-navy-600">
                  <table className="w-full text-center text-sm">
                    <thead>
                      <tr className="border-b border-navy-600 bg-navy-700/60 text-xs font-medium uppercase text-ink-500">
                        <th className="p-3 text-left">Actual \ Predicted</th>
                        <th className="p-3 text-signal-green">Pred SUFFICIENT</th>
                        <th className="p-3 text-signal-red">Pred INSUFFICIENT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-600 font-mono">
                      <tr>
                        <td className="bg-navy-700/30 p-3 text-left font-sans text-xs font-medium text-ink-300">
                          Actual WON
                        </td>
                        <td className="bg-signal-greenDim/30 p-4 font-display text-xl font-bold text-signal-green">
                          {report.confusionMatrix.truePositive}
                          <span className="block text-[10px] font-normal font-sans text-ink-500">True Positive (TP)</span>
                        </td>
                        <td className="bg-navy-800/40 p-4 font-display text-xl font-bold text-ink-300">
                          {report.confusionMatrix.falseNegative}
                          <span className="block text-[10px] font-normal font-sans text-ink-500">False Negative (FN)</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="bg-navy-700/30 p-3 text-left font-sans text-xs font-medium text-ink-300">
                          Actual LOST
                        </td>
                        <td className="bg-signal-redDim/30 p-4 font-display text-xl font-bold text-signal-red">
                          {report.confusionMatrix.falsePositive}
                          <span className="block text-[10px] font-normal font-sans text-ink-500">False Positive (FP)</span>
                        </td>
                        <td className="bg-signal-greenDim/20 p-4 font-display text-xl font-bold text-ink-100">
                          {report.confusionMatrix.trueNegative}
                          <span className="block text-[10px] font-normal font-sans text-ink-500">True Negative (TN)</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Split Breakdown */}
            <div className="lg:col-span-5">
              <Card className="p-6">
                <h3 className="mb-1 font-display text-base font-semibold text-ink-100">
                  Dataset Split (Seed {report.seed})
                </h3>
                <p className="mb-4 text-xs text-ink-500">
                  Reproducible synthetic dataset generated from Mulberry32 PRNG.
                </p>

                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex justify-between text-xs text-ink-300">
                      <span>Training Split ({report.trainSize} rows)</span>
                      <span>80%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-navy-600">
                      <div className="h-2 rounded-full bg-signal-blue" style={{ width: "80%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-xs text-ink-300">
                      <span>Held-Out Test Split ({report.testSize} rows)</span>
                      <span>20%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-navy-600">
                      <div className="h-2 rounded-full bg-signal-green" style={{ width: "20%" }} />
                    </div>
                  </div>

                  <div className="rounded-lg border border-navy-600 bg-navy-700/30 p-3.5 text-xs leading-relaxed text-ink-300">
                    <span className="font-semibold text-ink-100">Methodology: </span>
                    {report.methodology}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Exception Cases */}
          <Card className="p-6">
            <h3 className="mb-1 font-display text-base font-semibold text-ink-100">
              Sample Misses / Exception Cases
            </h3>
            <p className="mb-4 text-xs text-ink-500">
              Highest-value misclassifications from the held-out test split, illustrating edge cases where the classifier deviated from ground truth.
            </p>

            <div className="overflow-x-auto rounded-lg border border-navy-600">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-navy-600 bg-navy-700/60 font-medium uppercase tracking-wide text-ink-500">
                    <th className="px-4 py-3">Case ID</th>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Completeness</th>
                    <th className="px-4 py-3">Missing Critical</th>
                    <th className="px-4 py-3">Actual</th>
                    <th className="px-4 py-3">Predicted</th>
                    <th className="px-4 py-3 font-mono">Sufficiency Prob</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-600">
                  {report.exceptions.map((ex) => (
                    <tr key={ex.id} className="hover:bg-navy-700/40">
                      <td className="px-4 py-3 font-mono text-ink-100">{ex.id}</td>
                      <td className="px-4 py-3 text-ink-300">{ex.reason}</td>
                      <td className="px-4 py-3 font-mono font-medium text-ink-100">
                        {formatINR(ex.amount)}
                      </td>
                      <td className="px-4 py-3 font-mono text-ink-300">{ex.completeness}%</td>
                      <td className="px-4 py-3 font-mono text-ink-300">{ex.missingCriticalCount}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                            ex.actualOutcome === "WON"
                              ? "bg-signal-greenDim text-signal-green"
                              : "bg-signal-redDim text-signal-red"
                          }`}
                        >
                          {ex.actualOutcome}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                            ex.predictedOutcome === "WON"
                              ? "bg-signal-greenDim text-signal-green"
                              : "bg-signal-redDim text-signal-red"
                          }`}
                        >
                          {ex.predictedOutcome}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-ink-300">
                        {(ex.predictedProbability * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Defense Guardrail Card */}
          <Card className="border-signal-blue/30 bg-signal-blueDim/20 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-signal-blue" />
              <div>
                <h4 className="font-display text-sm font-semibold text-ink-100">
                  Defense-Only Safety Guardrail
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-ink-300">
                  {report.guardrailNote}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  subtitle,
  color,
}: {
  label: string;
  value: string;
  subtitle: string;
  color: string;
}) {
  return (
    <Card className="p-4">
      <div className="text-[11px] font-medium uppercase tracking-wide text-ink-500">{label}</div>
      <div className={`mt-1 font-display text-2xl font-bold ${color}`}>{value}</div>
      <div className="mt-0.5 text-[11px] text-ink-700">{subtitle}</div>
    </Card>
  );
}
