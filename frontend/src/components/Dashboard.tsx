import { ShieldCheck, ChevronRight, BarChart3 } from "lucide-react";
import type { Dispute, DisputeCaseState } from "../types";
import { DeadlinePill, StatusBadge } from "./ui";
import { formatINR } from "../utils/format";

interface Props {
  disputes: Dispute[];
  caseStates: Record<string, DisputeCaseState>;
  onSelect: (id: string) => void;
  onViewEvaluation: () => void;
}

export default function Dashboard({ disputes, caseStates, onSelect, onViewEvaluation }: Props) {
  const newCount = disputes.filter((d) => caseStates[d.id]?.status === "New").length;
  const urgentCount = disputes.filter((d) => d.deadlineDays <= 2).length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal-blueDim text-signal-blue">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-100">
              DisputeShield AI
            </h1>
          </div>
          <p className="max-w-xl text-sm text-ink-500">
            From dispute alert to evidence-ready defense — in seconds. Select a case to run an
            automated evidence investigation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={onViewEvaluation}
            className="inline-flex items-center gap-2 rounded-lg border border-navy-500 bg-navy-800 px-3.5 py-2.5 text-xs font-medium text-ink-200 shadow-card transition-colors hover:bg-navy-700 hover:text-white"
          >
            <BarChart3 className="h-4 w-4 text-signal-blue" />
            Held-Out Evaluation
          </button>
          <div className="hidden shrink-0 gap-4 sm:flex">
            <Stat label="Open disputes" value={newCount} />
            <Stat label="Due in 2 days" value={urgentCount} accent />
          </div>
        </div>
      </header>

      <div className="overflow-hidden rounded-xl border border-navy-600 bg-navy-800 shadow-card">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-navy-600 bg-navy-700/60 text-xs uppercase tracking-wide text-ink-500">
              <th className="px-5 py-3 font-medium">Dispute ID</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Dispute Reason</th>
              <th className="px-5 py-3 font-medium">Deadline</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {disputes.map((d) => {
              const state = caseStates[d.id];
              return (
                <tr
                  key={d.id}
                  onClick={() => onSelect(d.id)}
                  className="cursor-pointer border-b border-navy-600 last:border-0 transition-colors hover:bg-navy-700/50"
                >
                  <td className="px-5 py-4 font-mono text-ink-100">{d.id}</td>
                  <td className="px-5 py-4 text-ink-300">{d.customer}</td>
                  <td className="px-5 py-4 font-mono text-ink-100">{formatINR(d.amount)}</td>
                  <td className="px-5 py-4 text-ink-300">{d.reason}</td>
                  <td className="px-5 py-4">
                    <DeadlinePill days={d.deadlineDays} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={state?.status ?? d.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <ChevronRight className="ml-auto h-4 w-4 text-ink-700" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-5 text-center text-xs text-ink-700">
        Synthetic demo data. No real payment or customer information is used.
      </p>
    </div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-navy-600 bg-navy-800 px-4 py-2.5 text-center shadow-card">
      <div className={`font-display text-xl font-semibold ${accent ? "text-signal-amber" : "text-ink-100"}`}>
        {value}
      </div>
      <div className="text-[11px] text-ink-500">{label}</div>
    </div>
  );
}
