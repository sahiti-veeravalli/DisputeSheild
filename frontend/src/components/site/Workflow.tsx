import { useState } from "react";
import {
  ClipboardCheck,
  FileSearch,
  Gauge,
  Inbox,
  ListOrdered,
  ScrollText,
  TriangleAlert,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Reveal, SectionHeading } from "./Reveal";
import { SITE } from "../../lib/site";

const steps = [
  {
    n: "01",
    icon: Inbox,
    title: "Dispute Arrives",
    body: "A chargeback alert enters the queue with its reason code, transaction details, and response deadline.",
  },
  {
    n: "02",
    icon: FileSearch,
    title: "Rule Engine Evaluates",
    body: "The deterministic rule engine maps the dispute reason to the specific merchant evidence classes that matter.",
  },
  {
    n: "03",
    icon: ListOrdered,
    title: "Evidence Is Ranked",
    body: "Available merchant artifacts (orders, logistics, chat logs) are ordered by relevance and evidentiary weight.",
  },
  {
    n: "04",
    icon: TriangleAlert,
    title: "Critical Gaps Detected",
    body: "Missing artifacts that would weaken the defense are surfaced explicitly before any response packet is generated.",
  },
  {
    n: "05",
    icon: Gauge,
    title: "Sufficiency Assessed",
    body: "The held-out trained model produces an Evidence Sufficiency Probability and defense readiness rating.",
  },
  {
    n: "06",
    icon: ClipboardCheck,
    title: "Merchant Reviews & Approves",
    body: "The merchant inspects the compiled packet and approves or edits the defense. No auto-submission occurs without review.",
  },
  {
    n: "07",
    icon: ScrollText,
    title: "Recorded in Audit Trail",
    body: "Every decision step, ML score, approval timestamp, and submission reference is permanently recorded.",
  },
];

export function Workflow() {
  const [active, setActive] = useState(0);

  return (
    <section id="how-it-works" className="relative py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/4 h-96 bg-[radial-gradient(45%_50%_at_50%_50%,rgba(76,125,255,0.08),transparent_70%)] blur-2xl"
      />
      <div className="relative mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="How It Works"
          title="One dispute. A complete investigation."
          subtitle={SITE.tagline}
        />

        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-[1.35rem] w-px bg-[linear-gradient(to_bottom,transparent,var(--border-strong),transparent)] md:left-1/2"
          />
          <ol className="space-y-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 70}>
                <li
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "relative grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-4 md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)]",
                    i % 2 === 1 && "md:[&>article]:order-3",
                  )}
                >
                  <div className="hidden md:block" />
                  <div className="flex justify-center">
                    <span
                      className={cn(
                        "relative z-10 grid size-11 place-items-center rounded-xl border bg-surface transition-all duration-300",
                        active === i
                          ? "border-primary text-cyan shadow-[var(--glow-primary)]"
                          : "border-border text-muted-foreground",
                      )}
                    >
                      <s.icon className="size-4.5" strokeWidth={1.9} />
                    </span>
                  </div>
                  <article
                    className={cn(
                      "lift min-w-0 rounded-2xl border border-border bg-surface/60 p-5 md:p-6",
                      i % 2 === 1 ? "md:col-start-1 md:row-start-1" : "",
                    )}
                  >
                    <p className="font-mono text-[0.62rem] font-semibold tracking-[0.24em] text-primary">
                      STEP {s.n}
                    </p>
                    <h3 className="font-display mt-2 text-base font-semibold tracking-tight text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {s.body}
                    </p>
                  </article>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={120}>
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-border bg-surface/50 p-5 text-center text-xs leading-relaxed text-muted-foreground md:text-sm">
            <span className="font-semibold text-foreground">Human-in-the-Loop Architecture: </span>
            {SITE.humanControl}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
