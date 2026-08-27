import { ListChecks } from "lucide-react";
import type { AuditEntry } from "../types";
import { Card } from "./ui";

export default function AuditTrail({ entries }: { entries: AuditEntry[] }) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center gap-2.5 border-b border-navy-600 pb-4">
        <ListChecks className="h-5 w-5 text-signal-blue" />
        <div>
          <h3 className="font-display text-base font-semibold text-ink-100">Audit Trail</h3>
          <p className="text-xs text-ink-500">A timestamped record of every action taken on this case</p>
        </div>
      </div>
      <ol className="space-y-0">
        {entries.map((e, i) => (
          <li key={i} className="animate-fadeUp relative flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-signal-blue bg-navy-800" />
              {i < entries.length - 1 && <span className="w-px flex-1 bg-navy-600" />}
            </div>
            <div className="pb-1">
              <div className="text-sm font-medium text-ink-100">{e.label}</div>
              <div className="mt-0.5 font-mono text-xs text-ink-500">{e.timestamp}</div>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
