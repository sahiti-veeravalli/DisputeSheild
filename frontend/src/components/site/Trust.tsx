import { Eye, ScrollText, UserCheck } from "lucide-react";
import { Reveal } from "./Reveal";
import { SITE } from "../../lib/site";

const principles = [
  {
    icon: Eye,
    label: "Explainable",
    body: "Every evidence relevance decision and sufficiency probability score is transparently traceable to explicit criteria.",
  },
  {
    icon: UserCheck,
    label: "Human-Controlled",
    body: SITE.humanControl,
  },
  {
    icon: ScrollText,
    label: "Auditable",
    body: "The complete dispute lifecycle — investigation, scoring, approval, and transmission — is timestamped and persisted.",
  },
];

export function Trust() {
  return (
    <section className="relative border-y border-border bg-surface/30 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {principles.map((p, i) => (
            <Reveal key={p.label} delay={i * 110} className="h-full">
              <div className="group h-full px-2 py-8 text-center md:px-8 md:py-2">
                <span className="inline-grid size-11 place-items-center rounded-xl border border-border-strong bg-surface text-primary transition-colors duration-300 group-hover:text-cyan">
                  <p.icon className="size-5" strokeWidth={1.9} />
                </span>
                <h3 className="font-display mt-4 text-sm font-bold tracking-[0.2em] uppercase text-foreground">
                  {p.label}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground md:text-sm">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
