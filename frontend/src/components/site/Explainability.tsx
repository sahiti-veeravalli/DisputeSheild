import { BrainCircuit, CheckCircle2, Info, ShieldAlert, UserCheck } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useCountUp, useInView } from "../../hooks/use-reveal";
import { SITE } from "../../lib/site";

const positives = [
  "Transaction authorization & capture verified (Razorpay ID matched)",
  "Proof of delivery scan from carrier attached",
  "Prior customer support thread showing delivery acknowledgment",
];

export function Explainability() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const pct = useCountUp(78, inView, 1700);

  return (
    <section id="explainability" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="AI + Explainability"
              title={
                <>
                  AI that assists.
                  <br />
                  Merchants stay in control.
                </>
              }
              subtitle="The rule engine determines which evidence is relevant; the model estimates how sufficient that evidence is. Every factor influencing the score is transparently surfaced."
            />

            <div className="mt-8 space-y-4">
              {[
                {
                  icon: BrainCircuit,
                  title: "Deterministic Rule Engine First",
                  body: "Evidence mapping rules are strictly deterministic and rule-based for complete reproducibility and operational predictability.",
                },
                {
                  icon: UserCheck,
                  title: "Merchant-Approved Defense Packets",
                  body: "The merchant inspects, approves, edits, or rejects every compiled defense response before submission to payment networks.",
                },
              ].map((f, i) => (
                <Reveal key={f.title} delay={i * 120}>
                  <div className="lift flex gap-4 rounded-xl border border-border bg-surface/60 p-5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border-strong bg-surface-2 text-primary">
                      <f.icon className="size-4.5" strokeWidth={1.9} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-display text-sm font-semibold text-foreground">{f.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {f.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={140}>
            <div ref={ref} className="relative">
              <div
                aria-hidden
                className="animate-ambient pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(55%_55%_at_60%_30%,rgba(56,189,248,0.12),transparent_72%)] blur-2xl"
              />
              <div className="panel relative rounded-2xl border border-border p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[0.62rem] tracking-[0.2em] text-muted-foreground uppercase">
                    Evidence Sufficiency Probability · DSP-48291
                  </p>
                  <span className="font-mono text-[0.62rem] text-primary">Live Model Output</span>
                </div>

                <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
                  <span className="font-display text-5xl leading-none font-bold text-gradient-accent">
                    {Math.round(pct)}%
                  </span>
                  <span className="shrink-0 rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-warning uppercase">
                    Readiness: Medium
                  </span>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-accent">
                  <div
                    className="h-full rounded-full bg-[image:var(--gradient-accent)] transition-[width] duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="mt-7 space-y-5">
                  <div>
                    <p className="font-mono text-[0.62rem] tracking-[0.2em] text-muted-foreground uppercase">
                      Positive Factors Found (+78%)
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {positives.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-xs text-ink-300">
                          <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-border pt-5">
                    <p className="font-mono text-[0.62rem] tracking-[0.2em] text-warning uppercase">
                      Critical Evidence Gaps Detected
                    </p>
                    <div className="mt-3 flex items-start gap-2.5 text-xs text-ink-300">
                      <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-warning" />
                      <span>Signature confirmation scan missing from delivery record</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-border bg-surface-2/70 p-3.5 text-xs leading-relaxed text-muted-foreground">
                  <Info className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{SITE.humanControl}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
