import { Boxes, ScanSearch, TriangleAlert } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const cards = [
  {
    icon: Boxes,
    title: "Fragmented Evidence",
    body: "Transaction records, logistics delivery scans, support conversations, and fraud signals live scattered across separate systems.",
  },
  {
    icon: TriangleAlert,
    title: "Critical Evidence Gaps",
    body: "Merchants routinely lose disputes simply because crucial evidence items (like proof of delivery or signature scans) were overlooked.",
  },
  {
    icon: ScanSearch,
    title: "Manual Investigation Drag",
    body: "Investigating every dispute manually costs hours of merchant support time while strict payment network response deadlines approach.",
  },
];

export function Problem() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="The Problem"
          title={
            <>
              Chargebacks don&apos;t wait.
              <br />
              Evidence shouldn&apos;t either.
            </>
          }
          subtitle="Merchants lose millions in dispute fees and lost revenue due to fragmented evidence and tight submission windows."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 120}>
              <article className="lift group h-full rounded-2xl border border-border bg-surface/60 p-6">
                <span className="grid size-11 place-items-center rounded-xl border border-border-strong bg-surface-2 text-primary transition-colors duration-300 group-hover:text-cyan">
                  <c.icon className="size-5" strokeWidth={1.8} />
                </span>
                <h3 className="font-display mt-5 text-lg font-semibold tracking-tight text-foreground">
                  {c.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {c.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
