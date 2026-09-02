import { useState, useMemo } from "react";
import { Search, ShieldAlert, Zap } from "lucide-react";
import type { Dispute, DisputeCaseState } from "../../types";
import { formatINR } from "../../utils/format";
import { DeadlinePill, StatusBadge, Card } from "../ui";

interface DisputesWorkspaceProps {
  disputes: Dispute[];
  caseStates: Record<string, DisputeCaseState>;
  onSelectDispute: (id: string) => void;
  onNavigateTab?: (tab: any) => void;
}

export function DisputesWorkspace({
  disputes,
  caseStates,
  onSelectDispute,
}: DisputesWorkspaceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [reasonFilter, setReasonFilter] = useState<string>("All");
  const [deadlineFilter, setDeadlineFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"deadline" | "amount_desc" | "amount_asc" | "id">("deadline");

  const filteredDisputes = useMemo(() => {
    return disputes
      .filter((d) => {
        const state = caseStates[d.id];
        const status = state?.status ?? d.status;

        // Search query
        const matchesSearch =
          d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.reason.toLowerCase().includes(searchQuery.toLowerCase());

        // Status filter
        const matchesStatus = statusFilter === "All" || status === statusFilter;

        // Reason filter
        const matchesReason = reasonFilter === "All" || d.reason === reasonFilter;

        // Deadline filter
        const matchesDeadline =
          deadlineFilter === "All" ||
          (deadlineFilter === "critical" && d.deadlineDays <= 1) ||
          (deadlineFilter === "urgent" && d.deadlineDays === 2) ||
          (deadlineFilter === "normal" && d.deadlineDays >= 3);

        return matchesSearch && matchesStatus && matchesReason && matchesDeadline;
      })
      .sort((a, b) => {
        if (sortBy === "deadline") return a.deadlineDays - b.deadlineDays;
        if (sortBy === "amount_desc") return b.amount - a.amount;
        if (sortBy === "amount_asc") return a.amount - b.amount;
        if (sortBy === "id") return a.id.localeCompare(b.id);
        return 0;
      });
  }, [disputes, caseStates, searchQuery, statusFilter, reasonFilter, deadlineFilter, sortBy]);

  const filteredAmountTotal = filteredDisputes.reduce((acc, d) => acc + d.amount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Workspace Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-xl font-bold text-ink-100 sm:text-2xl">
            Merchant Dispute Queue
          </h2>
          <p className="mt-1 text-xs text-ink-400">
            Investigate, review and prepare defense response packets for all open chargebacks.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-ink-300">
          <span className="rounded-xl border border-navy-600 bg-navy-800 px-3 py-1.5">
            Showing <strong className="text-white">{filteredDisputes.length}</strong> of{" "}
            {disputes.length} cases
          </span>
          <span className="rounded-xl border border-signal-amber/30 bg-signal-amberDim/30 px-3 py-1.5 text-signal-amber font-semibold">
            {formatINR(filteredAmountTotal)} at risk
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          {/* Search Box */}
          <div className="relative md:col-span-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-500" />
            <input
              type="text"
              placeholder="Search by Dispute ID, Customer, Reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-navy-600 bg-navy-900 py-2 pl-9 pr-3 text-xs text-ink-100 placeholder-ink-500 outline-none focus:border-signal-blue"
            />
          </div>

          {/* Reason Filter */}
          <div className="md:col-span-3">
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="w-full rounded-xl border border-navy-600 bg-navy-900 px-3 py-2 text-xs text-ink-200 outline-none focus:border-signal-blue"
            >
              <option value="All">All Dispute Reasons</option>
              <option value="Product Not Received">Product Not Received</option>
              <option value="Fraudulent Transaction">Fraudulent Transaction</option>
              <option value="Duplicate Charge">Duplicate Charge</option>
              <option value="Product Not as Described">Product Not as Described</option>
            </select>
          </div>

          {/* Deadline Filter */}
          <div className="md:col-span-2">
            <select
              value={deadlineFilter}
              onChange={(e) => setDeadlineFilter(e.target.value)}
              className="w-full rounded-xl border border-navy-600 bg-navy-900 px-3 py-2 text-xs text-ink-200 outline-none focus:border-signal-blue"
            >
              <option value="All">All Deadlines</option>
              <option value="critical">Critical (≤ 1 day)</option>
              <option value="urgent">Urgent (2 days)</option>
              <option value="normal">Safe (≥ 3 days)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-xl border border-navy-600 bg-navy-900 px-3 py-2 text-xs text-ink-200 outline-none focus:border-signal-blue"
            >
              <option value="deadline">Sort: Earliest Deadline</option>
              <option value="amount_desc">Sort: Highest Amount</option>
              <option value="amount_asc">Sort: Lowest Amount</option>
              <option value="id">Sort: Case ID</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-t border-navy-700 pt-3">
          <span className="font-mono text-[10px] text-ink-500 uppercase tracking-wider mr-1">
            Status:
          </span>
          {["All", "New", "Investigating", "Resolved"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-1 font-mono text-xs transition-colors ${
                statusFilter === st
                  ? "bg-signal-blue text-white font-semibold shadow-[0_0_12px_rgba(76,125,255,0.4)]"
                  : "bg-navy-800 text-ink-400 hover:bg-navy-700 hover:text-ink-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </Card>

      {/* Disputes Table */}
      <div className="overflow-hidden rounded-2xl border border-navy-600 bg-navy-800 shadow-card">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-navy-600 bg-navy-700/60 font-mono text-[11px] uppercase tracking-wider text-ink-400">
              <th className="px-4 py-3.5 font-semibold">Dispute ID</th>
              <th className="px-4 py-3.5 font-semibold">Customer</th>
              <th className="px-4 py-3.5 font-semibold">Amount (INR)</th>
              <th className="px-4 py-3.5 font-semibold">Reason Category</th>
              <th className="px-4 py-3.5 font-semibold">Response Deadline</th>
              <th className="px-4 py-3.5 font-semibold">Evidence Readiness</th>
              <th className="px-4 py-3.5 font-semibold">Status</th>
              <th className="px-4 py-3.5 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-700">
            {filteredDisputes.length > 0 ? (
              filteredDisputes.map((d) => {
                const state = caseStates[d.id];
                const status = state?.status ?? d.status;
                const hasAnalysis = !!state?.analysis;
                const sufficiency = state?.analysis?.evidenceSufficiencyProbability;
                const pct = sufficiency != null ? Math.round(sufficiency * 100) : null;

                return (
                  <tr
                    key={d.id}
                    onClick={() => onSelectDispute(d.id)}
                    className="cursor-pointer transition-colors hover:bg-navy-700/50 group"
                  >
                    <td className="px-4 py-4 font-mono font-bold text-signal-blue group-hover:underline">
                      {d.id}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-ink-100">{d.customer}</div>
                      <div className="font-mono text-[10px] text-ink-500">{d.openedAt}</div>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs font-bold text-ink-100">
                      {formatINR(d.amount)}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-lg bg-navy-900 border border-navy-700 px-2.5 py-1 text-ink-200">
                        {d.reason}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <DeadlinePill days={d.deadlineDays} />
                    </td>
                    <td className="px-4 py-4">
                      {pct !== null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-navy-950">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-signal-blue to-cyan"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs font-bold text-cyan">{pct}%</span>
                        </div>
                      ) : (
                        <span className="font-mono text-[11px] text-ink-500">Unanalyzed</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDispute(d.id);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-signal-blue/15 border border-signal-blue/40 px-2.5 py-1 text-xs font-semibold text-signal-blue transition-colors hover:bg-signal-blue hover:text-white"
                      >
                        <Zap className="size-3" />
                        {hasAnalysis ? "Inspect" : "Investigate"}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center text-ink-400">
                  <ShieldAlert className="mx-auto size-8 text-ink-600 mb-2" />
                  <p className="text-sm font-semibold">No disputes match your active filters.</p>
                  <p className="text-xs text-ink-500 mt-1">Try resetting search or reason categories.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
