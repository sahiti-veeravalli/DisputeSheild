import {
  Eye,
  FileStack,
  Gauge,
  ListOrdered,
  Radar,
  SearchCheck,
} from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const items = [
  {
    icon: SearchCheck,
    label: "Investigates",
    body: "Maps dispute reason codes to specific relevant merchant evidence criteria.",
  },
  {
    icon: ListOrdered,
    label: "Ranks Evidence",
    body: "Prioritizes available documentation by evidentiary strength and relevance.",
  },
  {
    icon: Radar,
    label: "Detects Critical Gaps",
    body: "Flags missing high-impact evidence items before responses are assembled.",
  },
  {
    icon: Gauge,
    label: "Assesses Sufficiency",
    body: "Estimates Evidence Sufficiency Probability via our held-out calibrated model.",
  },
  {
    icon: FileStack,
    label: "Builds Defense Packets",
    body: "Compiles formatted, structured defense packets for rapid merchant review.",
  },
  {
    icon: Eye,
    label: "Stays Explainable",
    body: "Surfaces positive factors, gap reasons, and audit logs with complete transparency.",
  },
];

export function Capabilities() {
  return (
    <section id="capabilities" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Capabilities"
          title="What DisputeShield does"
          subtitle="Six deterministic capabilities that transform raw dispute alerts into defensible, evidence-backed submissions."
        />

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.label} delay={i * 80}>
              <article className="group relative h-full bg-surface/80 p-7 transition-colors duration-300 hover:bg-surface-2">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(60% 60% at 20% 0%, rgba(76,125,255,0.14), transparent 70%)",
                  }}
                />
                <span className="relative grid size-10 place-items-center rounded-lg border border-border-strong bg-background text-primary transition-colors duration-300 group-hover:text-cyan">
                  <it.icon className="size-5" strokeWidth={1.9} />
                </span>
                <h3 className="font-display relative mt-5 text-sm font-bold tracking-[0.14em] uppercase text-foreground">
                  {it.label}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {it.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
