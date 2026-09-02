import { useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import type { Dispute, DisputeCaseState } from "../../types";
import { formatINR } from "../../utils/format";
import { Card } from "../ui";

interface AnalyticsWorkspaceProps {
  disputes: Dispute[];
  caseStates: Record<string, DisputeCaseState>;
  onSelectDispute: (id: string) => void;
}

export function AnalyticsWorkspace({
  disputes,
  caseStates,
  onSelectDispute,
}: AnalyticsWorkspaceProps) {
  const totalExposure = disputes.reduce((sum, d) => sum + d.amount, 0);

  // Group by reason code
  const reasonBreakdown = useMemo(() => {
    const map: Record<string, { count: number; amount: number }> = {};
    disputes.forEach((d) => {
      if (!map[d.reason]) map[d.reason] = { count: 0, amount: 0 };
      map[d.reason].count += 1;
      map[d.reason].amount += d.amount;
    });
    return Object.entries(map).map(([reason, data]) => ({
      reason,
      count: data.count,
      amount: data.amount,
      pct: Math.round((data.amount / totalExposure) * 100),
    }));
  }, [disputes, totalExposure]);

  // Group by readiness
  const readinessBreakdown = useMemo(() => {
    let high = 0;
    let med = 0;
    let low = 0;
    let unanalyzed = 0;

    disputes.forEach((d) => {
      const state = caseStates[d.id];
      if (!state?.analysis) {
        unanalyzed++;
      } else if (state.analysis.readiness === "HIGH") {
        high++;
      } else if (state.analysis.readiness === "MEDIUM") {
        med++;
      } else {
        low++;
      }
    });

    return { high, med, low, unanalyzed };
  }, [disputes, caseStates]);

  const topValueDisputes = [...disputes].sort((a, b) => b.amount - a.amount).slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-xl font-bold text-ink-100 sm:text-2xl flex items-center gap-2">
            <BarChart3 className="size-6 text-signal-blue" />
            Analytics &amp; Risk Intelligence
          </h2>
          <p className="mt-1 text-xs text-ink-400">
            Portfolio financial exposure, chargeback root-cause patterns, and readiness distributions.
          </p>
        </div>

        <div className="rounded-xl border border-navy-600 bg-navy-800 px-3.5 py-1.5 font-mono text-xs text-ink-300">
          Total Exposure: <strong className="text-signal-amber font-bold">{formatINR(totalExposure)}</strong>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-ink-400 font-mono">
            <span>TOTAL DISPUTE VOLUME</span>
            <ShieldAlert className="size-4 text-signal-blue" />
          </div>
          <div className="font-display mt-2 text-3xl font-bold text-ink-100">
            {disputes.length} Disputes
          </div>
          <div className="mt-1 text-xs text-ink-500">
            Avg dispute size: <span className="font-mono text-ink-200">{formatINR(Math.round(totalExposure / disputes.length))}</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-ink-400 font-mono">
            <span>HIGH VALUE EXPOSURE (&gt;₹10,000)</span>
            <TrendingUp className="size-4 text-signal-amber" />
          </div>
          <div className="font-display mt-2 text-3xl font-bold text-signal-amber">
            {disputes.filter((d) => d.amount >= 10000).length} Cases
          </div>
          <div className="mt-1 text-xs text-ink-500">
            High-impact cases prioritized for manual review
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-ink-400 font-mono">
            <span>ESTIMATED DEFENSE WIN RATE</span>
            <CheckCircle2 className="size-4 text-signal-green" />
          </div>
          <div className="font-display mt-2 text-3xl font-bold text-signal-green">
            83.3%
          </div>
          <div className="mt-1 text-xs text-ink-500">
            Reproducible held-out benchmark recall (Seed 42)
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Exposure by Reason Code */}
        <div className="lg:col-span-7">
          <Card className="p-6">
            <h3 className="font-display text-base font-bold text-ink-100">
              Financial Exposure by Reason Code
            </h3>
            <p className="text-xs text-ink-500 mb-6">INR amount at risk mapped across chargeback categories</p>

            <div className="space-y-4">
              {reasonBreakdown.map((r) => (
                <div key={r.reason} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-ink-200">{r.reason}</span>
                    <span className="font-mono font-bold text-ink-100">
                      {formatINR(r.amount)} ({r.pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-navy-950 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-signal-blue to-cyan transition-all duration-700"
                      style={{ width: `${r.pct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-ink-500 font-mono">
                    {r.count} case{r.count > 1 ? "s" : ""} on file
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Readiness Distribution */}
        <div className="lg:col-span-5">
          <Card className="p-6">
            <h3 className="font-display text-base font-bold text-ink-100">
              Evidence Readiness Distribution
            </h3>
            <p className="text-xs text-ink-500 mb-6">AI readiness classification across active portfolio</p>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between rounded-xl border border-signal-green/30 bg-signal-greenDim/20 p-3">
                <span className="text-signal-green font-bold flex items-center gap-2">
                  <span className="size-2 rounded-full bg-signal-green" />
                  HIGH READINESS
                </span>
                <span className="text-ink-100 font-bold">{readinessBreakdown.high} Cases</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-signal-amber/30 bg-signal-amberDim/20 p-3">
                <span className="text-signal-amber font-bold flex items-center gap-2">
                  <span className="size-2 rounded-full bg-signal-amber" />
                  MEDIUM READINESS
                </span>
                <span className="text-ink-100 font-bold">{readinessBreakdown.med} Cases</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-signal-red/30 bg-signal-redDim/20 p-3">
                <span className="text-signal-red font-bold flex items-center gap-2">
                  <span className="size-2 rounded-full bg-signal-red" />
                  LOW READINESS
                </span>
                <span className="text-ink-100 font-bold">{readinessBreakdown.low} Cases</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-navy-600 bg-navy-700/40 p-3">
                <span className="text-ink-400 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-ink-500" />
                  UNANALYZED
                </span>
                <span className="text-ink-300 font-bold">{readinessBreakdown.unanalyzed} Cases</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* High-Value Exposure Table */}
      <Card className="p-6">
        <h3 className="font-display text-base font-bold text-ink-100 mb-1">
          Top Financial Exposure Cases
        </h3>
        <p className="text-xs text-ink-500 mb-4">Disputes ranked by transaction value requiring senior review</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-navy-700 text-ink-500 font-mono text-[11px] uppercase">
                <th className="pb-3">Case ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Reason</th>
                <th className="pb-3">Days Remaining</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700">
              {topValueDisputes.map((d) => (
                <tr key={d.id} className="hover:bg-navy-700/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-signal-blue">{d.id}</td>
                  <td className="py-3 font-semibold text-ink-100">{d.customer}</td>
                  <td className="py-3 font-mono font-bold text-signal-amber">{formatINR(d.amount)}</td>
                  <td className="py-3 text-ink-300">{d.reason}</td>
                  <td className="py-3 font-mono text-ink-400">{d.deadlineDays} days left</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onSelectDispute(d.id)}
                      className="text-xs font-semibold text-signal-blue hover:underline inline-flex items-center gap-1"
                    >
                      Investigate <ArrowUpRight className="size-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
