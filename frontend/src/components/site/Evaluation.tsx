import { FlaskConical, BarChart3, ArrowRight } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useCountUp, useInView } from "../../hooks/use-reveal";

type Metric = {
  label: string;
  value: number;
  format: (v: number) => string;
  note: string;
};

const metrics: Metric[] = [
  {
    label: "Precision",
    value: 55.6,
    format: (v) => `${v.toFixed(1)}%`,
    note: "Sufficient evidence defenses correctly identified without false promises.",
  },
  {
    label: "Recall",
    value: 83.3,
    format: (v) => `${v.toFixed(1)}%`,
    note: "High-confidence defenses successfully captured across held-out tests.",
  },
  {
    label: "F1 Score",
    value: 0.667,
    format: (v) => v.toFixed(3),
    note: "Harmonic mean of precision and recall on held-out evaluation cases.",
  },
  {
    label: "False-Positive Cost",
    value: 85567,
    format: (v) => `₹${Math.round(v).toLocaleString("en-IN")}`,
    note: "Explicitly tracked financial exposure from 8 misclassified test disputes.",
  },
];

const dataset = [
  { k: "Total Disputes", v: "200 synthetic" },
  { k: "Training Split", v: "160 cases (80%)" },
  { k: "Held-Out Test Split", v: "40 cases (20%)" },
  { k: "PRNG Seed", v: "Seed 42 (Mulberry32)" },
];

function MetricCard({ m, delay }: { m: Metric; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const v = useCountUp(m.value, inView, 1500);

  return (
    <Reveal delay={delay} className="h-full">
      <div
        ref={ref}
        className="lift group relative h-full overflow-hidden rounded-2xl border border-border bg-surface/70 p-6 md:p-7"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(76,125,255,0.14),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <p className="font-mono text-[0.62rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          {m.label}
        </p>
        <p className="font-display mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {m.format(v)}
        </p>
        <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">{m.note}</p>
      </div>
    </Reveal>
  );
}

interface EvaluationProps {
  onViewEvaluation?: () => void;
}

export function Evaluation({ onViewEvaluation }: EvaluationProps) {
  return (
    <section id="evaluation" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Held-Out Synthetic Evaluation"
          title="Measured on a reproducible held-out benchmark."
          subtitle="The decision-support model is evaluated strictly on held-out test disputes it never saw during training, reflecting true generalization without memorization."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <MetricCard key={m.label} m={m} delay={i * 90} />
          ))}
        </div>

        <Reveal delay={180}>
          <div className="mt-6 rounded-2xl border border-border bg-surface/50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.16em] text-cyan uppercase">
                <FlaskConical className="size-4" />
                Benchmark Methodology & Dataset Split
              </p>
              {onViewEvaluation && (
                <button
                  onClick={onViewEvaluation}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                >
                  <BarChart3 className="size-3.5" />
                  Inspect Full Evaluation Report
                  <ArrowRight className="size-3" />
                </button>
              )}
            </div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {dataset.map((d) => (
                <div key={d.k} className="min-w-0 rounded-xl border border-border/60 bg-surface-2/40 p-3.5">
                  <dt className="font-mono text-[0.62rem] tracking-[0.16em] text-muted-foreground uppercase">
                    {d.k}
                  </dt>
                  <dd className="font-display mt-1 text-sm font-semibold text-foreground">
                    {d.v}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[0.72rem] text-muted-foreground">
              * Measured on a reproducible held-out synthetic evaluation set. Models evaluate Evidence Sufficiency Probability and defense readiness — not guaranteed chargeback win outcomes.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
