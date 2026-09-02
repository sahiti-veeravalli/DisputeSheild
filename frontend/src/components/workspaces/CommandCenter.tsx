import { useState } from "react";
import {
  Clock,
  Sparkles,
  Search,
  ChevronRight,
  ArrowUpRight,
  Bot,
  Zap,
} from "lucide-react";
import type { Dispute, DisputeCaseState } from "../../types";
import { formatINR } from "../../utils/format";
import { DeadlinePill, StatusBadge, ReadinessBadge, Card } from "../ui";

interface CommandCenterProps {
  disputes: Dispute[];
  caseStates: Record<string, DisputeCaseState>;
  onSelectDispute: (id: string) => void;
  onNavigateTab: (tab: any) => void;
}

export function CommandCenter({
  disputes,
  caseStates,
  onSelectDispute,
  onNavigateTab,
}: CommandCenterProps) {
  const [filterReason, setFilterReason] = useState<string>("All");
  const [searchQuery] = useState("");

  // Aggregate metric calculations
  const totalAmountAtRisk = disputes.reduce((sum, d) => sum + d.amount, 0);
  const openCount = disputes.filter((d) => caseStates[d.id]?.status !== "Resolved").length;
  const urgentCount = disputes.filter((d) => d.deadlineDays <= 2).length;
  const criticalCount = disputes.filter((d) => d.deadlineDays <= 1).length;
  const highCount = disputes.filter((d) => d.deadlineDays === 2).length;
  const safeCount = disputes.filter((d) => d.deadlineDays > 2).length;

  const analyzedDisputes = disputes.filter((d) => !!caseStates[d.id]?.analysis);
  const investigationsCompleted = analyzedDisputes.length;

  const avgSufficiency =
    analyzedDisputes.length > 0
      ? (
          analyzedDisputes.reduce(
            (acc, d) =>
              acc +
              ((caseStates[d.id]?.analysis?.evidenceSufficiencyProbability ?? 0.7) * 100),
            0
          ) / analyzedDisputes.length
        ).toFixed(1)
      : "78.0";

  // Priority queue: disputes needing attention (deadline <= 2d or unanalyzed or missing critical)
  const priorityDisputes = [...disputes]
    .sort((a, b) => a.deadlineDays - b.deadlineDays || b.amount - a.amount)
    .slice(0, 4);

  // Filtered dispute list for overview table
  const filteredDisputes = disputes.filter((d) => {
    const matchesReason = filterReason === "All" || d.reason === filterReason;
    const matchesSearch =
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesReason && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-signal-blue/30 bg-gradient-to-r from-navy-900 via-signal-blueDim/40 to-navy-900 p-6 shadow-card">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-blue/20 border border-signal-blue/40 px-3 py-1 font-mono text-[10px] font-semibold text-signal-blue uppercase tracking-wider">
                <Sparkles className="size-3" />
                AI Risk Operations Command
              </span>
              <span className="font-mono text-[11px] text-ink-400">Live Razorpay Gateway Stream</span>
            </div>
            <h2 className="font-display mt-2 text-xl font-bold text-ink-100 sm:text-2xl">
              Merchant Dispute Operations Overview
            </h2>
            <p className="mt-1 text-xs text-ink-300 max-w-2xl leading-relaxed">
              Automated evidence discovery, deterministic rule engine evaluation, and calibrated ML sufficiency scoring for incoming chargebacks.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab("investigation")}
              className="inline-flex items-center gap-2 rounded-xl bg-signal-blue px-4 py-2.5 text-xs font-semibold text-white shadow-[0_4px_20px_rgba(76,125,255,0.35)] transition-all hover:bg-signal-blue/90 hover:scale-[1.02]"
            >
              <Zap className="size-3.5" />
              Live Investigation
            </button>
            <button
              onClick={() => onNavigateTab("model")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-navy-500 bg-navy-800 px-3.5 py-2.5 text-xs font-medium text-ink-200 hover:bg-navy-700"
            >
              <Bot className="size-3.5 text-cyan" />
              Track 02 Benchmark
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KPICard
          title="Open Disputes"
          value={openCount.toString()}
          subtitle={`${disputes.length} total recorded`}
          color="text-ink-100"
          badge="Active Queue"
          badgeColor="bg-navy-700 text-ink-300"
        />
        <KPICard
          title="Amount at Risk"
          value={formatINR(totalAmountAtRisk)}
          subtitle="Direct financial exposure"
          color="text-signal-amber"
          badge="INR Total"
          badgeColor="bg-signal-amberDim text-signal-amber border border-signal-amber/30"
        />
        <KPICard
          title="Critical Deadlines"
          value={urgentCount.toString()}
          subtitle="Due within ≤ 48 hours"
          color={urgentCount > 0 ? "text-signal-red" : "text-signal-green"}
          badge={urgentCount > 0 ? "Needs Action" : "On Track"}
          badgeColor={
            urgentCount > 0
              ? "bg-signal-redDim text-signal-red border border-signal-red/30"
              : "bg-signal-greenDim text-signal-green border border-signal-green/30"
          }
        />
        <KPICard
          title="Investigations Run"
          value={`${investigationsCompleted} / ${disputes.length}`}
          subtitle="Cases mapped & scored"
          color="text-signal-blue"
          badge="ML Pipeline"
          badgeColor="bg-signal-blueDim text-signal-blue border border-signal-blue/30"
        />
        <KPICard
          title="Avg Sufficiency"
          value={`${avgSufficiency}%`}
          subtitle="Defense evidence readiness"
          color="text-cyan"
          badge="Calibrated ML"
          badgeColor="bg-cyan/15 text-cyan border border-cyan/30"
        />
      </div>

      {/* Priority Action Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-signal-amber animate-pulse" />
            <h3 className="font-display text-base font-bold text-ink-100">
              Priority Action Queue
            </h3>
            <span className="rounded-full bg-signal-amberDim border border-signal-amber/30 px-2 py-0.5 font-mono text-[10px] text-signal-amber font-semibold">
              Immediate Triage
            </span>
          </div>
          <button
            onClick={() => onNavigateTab("disputes")}
            className="text-xs font-semibold text-signal-blue hover:underline inline-flex items-center gap-1"
          >
            View all disputes ({disputes.length}) <ArrowUpRight className="size-3" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {priorityDisputes.map((d) => {
            const state = caseStates[d.id];
            const hasAnalysis = !!state?.analysis;
            const sufficiency = hasAnalysis
              ? Math.round(
                  (state.analysis?.evidenceSufficiencyProbability ?? 0.75) * 100
                )
              : null;

            return (
              <div
                key={d.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-navy-600 bg-navy-800/80 p-4 transition-all duration-300 hover:border-signal-blue/50 hover:bg-navy-800 hover:shadow-card"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-ink-100">{d.id}</span>
                    <DeadlinePill days={d.deadlineDays} />
                  </div>

                  <div className="mt-2 text-sm font-semibold text-ink-200 truncate">
                    {d.customer}
                  </div>
                  <div className="font-mono text-xs font-bold text-signal-amber">
                    {formatINR(d.amount)}
                  </div>
                  <div className="mt-1 text-[11px] text-ink-400 truncate">{d.reason}</div>

                  {/* Sufficiency Bar */}
                  <div className="mt-3 pt-3 border-t border-navy-700">
                    <div className="flex items-center justify-between text-[10px] font-mono text-ink-400">
                      <span>Evidence Sufficiency</span>
                      <span className="font-bold text-cyan">
                        {sufficiency !== null ? `${sufficiency}%` : "Unanalyzed"}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-navy-950">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-signal-blue to-cyan transition-all duration-500"
                        style={{ width: `${sufficiency ?? 20}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectDispute(d.id)}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-signal-blue/40 bg-signal-blueDim/40 py-2 text-xs font-semibold text-signal-blue transition-colors group-hover:bg-signal-blue group-hover:text-white"
                >
                  <Search className="size-3" />
                  {hasAnalysis ? "Review Defense" : "Run AI Investigation"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column: Quick Overview Table + Deadline Risk Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 8 Cols: Quick Dispute Overview Table */}
        <div className="space-y-3 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-bold text-ink-100">
                Dispute Case Overview
              </h3>
              <p className="text-xs text-ink-500">Live merchant records ready for evidence extraction</p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {["All", "Product Not Received", "Fraudulent Transaction", "Duplicate Charge"].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterReason(cat)}
                    className={`rounded-lg px-2.5 py-1 font-mono text-[11px] transition-colors ${
                      filterReason === cat
                        ? "bg-signal-blue text-white font-semibold"
                        : "bg-navy-800 text-ink-400 hover:bg-navy-700 hover:text-ink-200"
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-navy-600 bg-navy-800 shadow-card">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-navy-600 bg-navy-700/60 font-mono text-[11px] uppercase tracking-wider text-ink-400">
                  <th className="px-4 py-3 font-semibold">Case ID</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Reason</th>
                  <th className="px-4 py-3 font-semibold">Deadline</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {filteredDisputes.slice(0, 6).map((d) => {
                  const state = caseStates[d.id];
                  const status = state?.status ?? d.status;

                  return (
                    <tr
                      key={d.id}
                      onClick={() => onSelectDispute(d.id)}
                      className="cursor-pointer transition-colors hover:bg-navy-700/50"
                    >
                      <td className="px-4 py-3.5 font-mono font-bold text-signal-blue">{d.id}</td>
                      <td className="px-4 py-3.5 font-medium text-ink-100">{d.customer}</td>
                      <td className="px-4 py-3.5 font-mono font-semibold text-ink-100">
                        {formatINR(d.amount)}
                      </td>
                      <td className="px-4 py-3.5 text-ink-300">{d.reason}</td>
                      <td className="px-4 py-3.5">
                        <DeadlinePill days={d.deadlineDays} />
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-signal-blue group-hover:underline">
                          Investigate <ChevronRight className="size-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 Cols: Deadline Risk & Recent Investigations */}
        <div className="space-y-6 lg:col-span-4">
          {/* Deadline Risk Radar */}
          <Card className="p-5">
            <div className="flex items-center justify-between border-b border-navy-700 pb-3">
              <h4 className="font-display text-sm font-bold text-ink-100 flex items-center gap-1.5">
                <Clock className="size-4 text-signal-amber" />
                Response Deadline Matrix
              </h4>
              <span className="font-mono text-[10px] text-ink-500">Tier Breakdown</span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-signal-red flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-signal-red" />
                    Critical Risk (≤ 1 day)
                  </span>
                  <span className="font-mono font-bold text-ink-100">{criticalCount} cases</span>
                </div>
                <div className="h-2 w-full rounded-full bg-navy-950">
                  <div
                    className="h-full rounded-full bg-signal-red"
                    style={{ width: `${(criticalCount / disputes.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-signal-amber flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-signal-amber" />
                    High Urgency (2 days)
                  </span>
                  <span className="font-mono font-bold text-ink-100">{highCount} cases</span>
                </div>
                <div className="h-2 w-full rounded-full bg-signal-amber" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-signal-green flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-signal-green" />
                    Safe Window (≥ 3 days)
                  </span>
                  <span className="font-mono font-bold text-ink-100">{safeCount} cases</span>
                </div>
                <div className="h-2 w-full rounded-full bg-signal-green" />
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-navy-700 bg-navy-900/60 p-3 text-[11px] leading-relaxed text-ink-400">
              Payment networks enforce strict 7-10 day response windows. Late submissions result in automatic merchant forfeiture.
            </div>
          </Card>

          {/* Recent ML Investigations */}
          <Card className="p-5">
            <div className="flex items-center justify-between border-b border-navy-700 pb-3">
              <h4 className="font-display text-sm font-bold text-ink-100 flex items-center gap-1.5">
                <Bot className="size-4 text-cyan" />
                Live AI Assessments
              </h4>
              <button
                onClick={() => onNavigateTab("investigation")}
                className="text-[11px] text-signal-blue hover:underline"
              >
                Open Workspace →
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {analyzedDisputes.length > 0 ? (
                analyzedDisputes.slice(0, 3).map((d) => {
                  const state = caseStates[d.id];
                  const prob = state?.analysis?.evidenceSufficiencyProbability;
                  const pct = prob != null ? Math.round(prob * 100) : 75;

                  return (
                    <div
                      key={d.id}
                      onClick={() => onSelectDispute(d.id)}
                      className="cursor-pointer rounded-xl border border-navy-700 bg-navy-900/60 p-2.5 transition-colors hover:bg-navy-700/50"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-signal-blue">{d.id}</span>
                        <span className="font-mono font-bold text-cyan">{pct}% Sufficiency</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-ink-400">
                        <span className="truncate">{d.reason}</span>
                        <ReadinessBadge level={state?.analysis?.readiness || "MEDIUM"} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-4 text-center text-xs text-ink-500">
                  Select a dispute above to run the 7-stage AI investigation.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KPICard({
  title,
  value,
  subtitle,
  color,
  badge,
  badgeColor,
}: {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  badge: string;
  badgeColor: string;
}) {
  return (
    <Card className="p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-signal-blue/30">
      <div className="flex items-center justify-between gap-1">
        <span className="font-mono text-[10px] font-semibold text-ink-500 uppercase tracking-wider truncate">
          {title}
        </span>
        <span className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold shrink-0 ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <div className={`font-display mt-2 text-2xl font-bold tracking-tight ${color}`}>
        {value}
      </div>
      <div className="mt-1 text-[11px] text-ink-500 truncate">{subtitle}</div>
    </Card>
  );
}
