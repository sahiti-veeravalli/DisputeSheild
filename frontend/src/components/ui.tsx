import type { ReactNode } from "react";
import type { DisputeStatus, EvidenceStrength, ReadinessLevel } from "../types";

export function StatusBadge({ status }: { status: DisputeStatus }) {
  const styles: Record<DisputeStatus, string> = {
    New: "bg-signal-blueDim text-signal-blue border-signal-blue/30",
    Investigating: "bg-signal-amberDim text-signal-amber border-signal-amber/30",
    Resolved: "bg-signal-greenDim text-signal-green border-signal-green/30",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function DeadlinePill({ days }: { days: number }) {
  const urgent = days <= 2;
  const warn = days > 2 && days <= 4;
  const cls = urgent
    ? "text-signal-red bg-signal-redDim border-signal-red/30"
    : warn
    ? "text-signal-amber bg-signal-amberDim border-signal-amber/30"
    : "text-signal-green bg-signal-greenDim border-signal-green/30";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-mono font-medium ${cls}`}>
      {days} {days === 1 ? "day" : "days"} left
    </span>
  );
}

export function StrengthPill({ strength }: { strength: EvidenceStrength }) {
  const cls: Record<EvidenceStrength, string> = {
    Strong: "text-signal-green bg-signal-greenDim border-signal-green/30",
    Moderate: "text-signal-amber bg-signal-amberDim border-signal-amber/30",
    Weak: "text-signal-red bg-signal-redDim border-signal-red/30",
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${cls[strength]}`}>
      {strength}
    </span>
  );
}

export function ReadinessBadge({ level }: { level: ReadinessLevel }) {
  const cls: Record<ReadinessLevel, string> = {
    HIGH: "text-signal-green bg-signal-greenDim border-signal-green/40",
    MEDIUM: "text-signal-amber bg-signal-amberDim border-signal-amber/40",
    LOW: "text-signal-red bg-signal-redDim border-signal-red/40",
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-3 py-1 text-sm font-display font-semibold tracking-wide ${cls[level]}`}>
      {level}
    </span>
  );
}

export function RelevanceBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-navy-600">
      <div
        className="h-1.5 rounded-full bg-signal-blue transition-all duration-700 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-navy-600 bg-navy-800 shadow-card ${className}`}>
      {children}
    </div>
  );
}



