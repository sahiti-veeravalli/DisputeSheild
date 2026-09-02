import { useEffect, useState } from "react";
import {
  Clock,
  CreditCard,
  FileCheck2,
  MessageSquare,
  PackageCheck,
  PenLine,
  Search,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useCountUp, useInView } from "../../hooks/use-reveal";

const evidence = [
  {
    icon: CreditCard,
    label: "Transaction verified",
    detail: "Auth + capture matched · Razorpay order pay_9941a",
    state: "ok" as const,
  },
  {
    icon: PackageCheck,
    label: "Delivery scan found",
    detail: "Carrier logistics scan · 12 Aug, 14:22 IST",
    state: "ok" as const,
  },
  {
    icon: MessageSquare,
    label: "Customer communication found",
    detail: "3 support messages with delivery confirmation",
    state: "ok" as const,
  },
  {
    icon: PenLine,
    label: "Signature confirmation missing",
    detail: "Critical gap · proof of delivery signature required",
    state: "gap" as const,
  },
];

const timeline = [
  { icon: Search, label: "Evidence investigation started", time: "00:00:02" },
  { icon: FileCheck2, label: "3 of 4 evidence classes matched", time: "00:00:04" },
  { icon: ShieldAlert, label: "1 critical gap detected", time: "00:00:05" },
  { icon: ShieldCheck, label: "Packet queued for merchant review", time: "00:00:06" },
];

interface DashboardPreviewProps {
  onExploreDemo?: () => void;
}

export function DashboardPreview({ onExploreDemo }: DashboardPreviewProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const sufficiency = useCountUp(78, inView, 1700);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % 4), 1800);
    return () => window.clearInterval(id);
  }, [inView]);

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden
        className="animate-ambient pointer-events-none absolute -inset-x-10 -top-16 bottom-0 rounded-[3rem] bg-[radial-gradient(60%_50%_at_50%_20%,rgba(76,125,255,0.2),transparent_70%)] blur-2xl"
      />

      <div className="panel relative overflow-hidden rounded-2xl border border-border shadow-panel">
        <div
          aria-hidden
          className="animate-scan pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(to_bottom,transparent,rgba(56,189,248,0.12),transparent)]"
        />
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" aria-hidden />

        {/* Window Chrome */}
        <div className="relative flex items-center justify-between gap-3 border-b border-border bg-surface/90 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-full bg-muted-foreground/40" />
            <span className="size-2.5 shrink-0 rounded-full bg-muted-foreground/25" />
            <span className="size-2.5 shrink-0 rounded-full bg-muted-foreground/15" />
            <span className="ml-3 truncate font-mono text-[0.68rem] tracking-widest text-muted-foreground uppercase">
              disputeshield-ai / investigation / DSP-48291
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[0.68rem] text-cyan">
              <span className="animate-pulse-dot size-1.5 rounded-full bg-cyan" />
              Live Investigation
            </span>
            {onExploreDemo && (
              <button
                onClick={onExploreDemo}
                className="hidden rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1 font-mono text-[0.65rem] font-semibold text-primary transition-colors hover:bg-primary/20 sm:inline-block"
              >
                Interactive Mode →
              </button>
            )}
          </div>
        </div>

        <div className="relative grid gap-4 p-4 lg:grid-cols-5">
          {/* Dispute details & Evidence column */}
          <div className="space-y-4 lg:col-span-3">
            <div className="rounded-xl border border-border bg-surface-2/60 p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <span className="font-mono text-xs text-muted-foreground">Case DSP-48291 · Customer: Priyanshu M.</span>
                  <p className="font-display mt-1 truncate text-base font-semibold text-foreground">
                    Product Not Received (Chargeback)
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-bold text-foreground">₹4,999</p>
                  <p className="mt-1 inline-flex items-center gap-1 font-mono text-[0.65rem] text-signal-amber">
                    <Clock className="size-3" /> 3 days left
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-surface-2/60">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <p className="font-mono text-[0.62rem] tracking-[0.18em] text-muted-foreground uppercase">
                  Rule-Engine Evidence Mapping
                </p>
                <span className="font-mono text-[0.62rem] text-ink-500">4 criteria evaluated</span>
              </div>
              <ul className="divide-y divide-border/60">
                {evidence.map((e, i) => (
                  <li
                    key={e.label}
                    className={cn(
                      "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition-colors duration-300",
                      inView && "animate-rise",
                      step === i && "bg-accent/40",
                    )}
                    style={inView ? { animationDelay: `${180 + i * 130}ms` } : undefined}
                  >
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-lg border bg-surface",
                        e.state === "ok"
                          ? "border-success/30 text-success"
                          : "border-warning/30 text-warning",
                      )}
                    >
                      <e.icon className="size-3.5" strokeWidth={1.9} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-foreground">
                        {e.label}
                      </p>
                      <p className="mt-0.5 truncate text-[0.68rem] text-muted-foreground">
                        {e.detail}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full border px-2 py-0.5 font-mono text-[0.6rem] font-semibold",
                        e.state === "ok"
                          ? "border-success/30 bg-success/10 text-success"
                          : "border-warning/30 bg-warning/10 text-warning",
                      )}
                    >
                      {e.state === "ok" ? "FOUND" : "MISSING"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-surface-2/60 p-4">
              <p className="font-mono text-[0.62rem] tracking-[0.18em] text-muted-foreground uppercase">
                Audit Trail · DSP-48291
              </p>
              <ul className="mt-3 space-y-2.5">
                {timeline.map((t, i) => (
                  <li
                    key={t.label}
                    className={cn("flex items-center gap-3", inView && "animate-rise")}
                    style={inView ? { animationDelay: `${600 + i * 160}ms` } : undefined}
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-md border border-border bg-surface text-primary">
                      <t.icon className="size-3" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                      {t.label}
                    </span>
                    <span className="shrink-0 font-mono text-[0.62rem] text-muted-foreground/70">
                      {t.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ML Assessment Column */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="rounded-xl border border-border bg-surface-2/70 p-4">
              <p className="font-mono text-[0.62rem] tracking-[0.18em] text-muted-foreground uppercase">
                Evidence Sufficiency Probability
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-gradient-accent">
                  {Math.round(sufficiency)}%
                </span>
                <span className="font-mono text-xs text-muted-foreground">ML assessment</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-accent">
                <div
                  className="h-full rounded-full bg-[image:var(--gradient-accent)] transition-[width] duration-300"
                  style={{ width: `${sufficiency}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface-2/70 p-4">
              <p className="font-mono text-[0.62rem] tracking-[0.18em] text-muted-foreground uppercase">
                Defense Readiness Rating
              </p>
              <p className="font-display mt-2 text-2xl font-bold text-warning">MEDIUM</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Strong delivery and payment confirmation. 1 missing critical artifact flagged before submission.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-border bg-surface-2/70 p-4">
              <div
                aria-hidden
                className="animate-flow-line absolute top-0 left-6 h-8 w-px bg-[linear-gradient(to_bottom,transparent,var(--cyan),transparent)]"
              />
              <p className="font-mono text-[0.62rem] tracking-[0.18em] text-muted-foreground uppercase">
                Automated Defense Flow
              </p>
              <ul className="mt-3 space-y-1.5 pl-6 text-xs text-muted-foreground">
                <li>• Reason code mapped → 4 evidence classes</li>
                <li>• Sufficiency score computed by live model</li>
                <li>• Queued for mandatory merchant approval</li>
              </ul>
            </div>

            <p className="flex items-start gap-2 rounded-xl border border-border bg-surface/60 p-3 text-xs leading-relaxed text-muted-foreground">
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
              Decision support only — final response packet requires merchant review and approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
