import { ArrowDown, Boxes, Cpu, Database, Layers, Server } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const flow = [
  { icon: Layers, label: "React 19 + TypeScript Frontend", sub: "Vite · Tailwind CSS · Lucide Icons" },
  { icon: Server, label: "Spring Boot 3.3.4 REST API", sub: "Java 17 · Springdoc OpenAPI / Swagger" },
];

const core = [
  { label: "Deterministic Rule Evidence Engine", tone: "primary" },
  { label: "ML Evidence Sufficiency Assessment", tone: "cyan" },
  { label: "Immutable Audit Trail Logging", tone: "success" },
];

const stacks = [
  {
    title: "Frontend",
    icon: Layers,
    items: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Lucide Icons"],
  },
  {
    title: "Backend",
    icon: Server,
    items: ["Java 17", "Spring Boot 3.3.4", "Spring Data JPA", "Hibernate", "OpenAPI 2.6"],
  },
  {
    title: "Data Layer",
    icon: Database,
    items: ["In-Memory H2 (Dev)", "PostgreSQL 16 (Docker)", "Synthetic Dataset Seeder"],
  },
  {
    title: "Infrastructure & CI",
    icon: Boxes,
    items: ["Docker Multi-Stage", "Docker Compose", "GitHub Actions CI", "Nginx"],
  },
];

const toneClass: Record<string, string> = {
  primary: "border-primary/30 text-primary bg-primary/5",
  cyan: "border-cyan/30 text-cyan bg-cyan/5",
  success: "border-success/30 text-success bg-success/5",
};

export function Architecture() {
  return (
    <section id="architecture" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Architecture"
          title="Engineered as a cohesive, production-ready system."
          subtitle="Full-stack architecture featuring typed React frontend, Java 17 Spring Boot service layer, deterministic rule engine, held-out ML model, and persisted audit trails."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          {/* Flow diagram */}
          <Reveal>
            <div className="panel relative overflow-hidden rounded-2xl border border-border p-6 md:p-8">
              <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" aria-hidden />
              <div className="relative space-y-3">
                {flow.map((f) => (
                  <div key={f.label}>
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/70 px-4 py-3.5">
                      <f.icon className="size-5 shrink-0 text-primary" strokeWidth={1.9} />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{f.label}</p>
                        <p className="font-mono text-[0.65rem] text-muted-foreground">
                          {f.sub}
                        </p>
                      </div>
                    </div>
                    <ArrowDown
                      className="mx-auto my-2 size-4 text-muted-foreground/50"
                      aria-hidden
                    />
                  </div>
                ))}

                <div className="rounded-xl border border-border bg-surface-2/70 p-4">
                  <p className="font-mono text-[0.62rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    Core Business & Intelligence Services
                  </p>
                  <div className="mt-3 space-y-2">
                    {core.map((c) => (
                      <div
                        key={c.label}
                        className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-xs font-medium ${toneClass[c.tone]}`}
                      >
                        <Cpu className="size-4 shrink-0" />
                        <span className="text-foreground">{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <ArrowDown
                  className="mx-auto my-2 size-4 text-muted-foreground/50"
                  aria-hidden
                />

                <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/70 px-4 py-3.5">
                  <Database className="size-5 shrink-0 text-primary" strokeWidth={1.9} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">H2 Database / PostgreSQL 16</p>
                    <p className="font-mono text-[0.65rem] text-muted-foreground">Persisted Disputes, Audit Events & Synthetic Dataset</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Stack cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {stacks.map((s, i) => (
              <Reveal key={s.title} delay={i * 90}>
                <div className="lift h-full rounded-2xl border border-border bg-surface/60 p-5">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-lg border border-border-strong bg-surface-2 text-primary">
                      <s.icon className="size-4" strokeWidth={1.9} />
                    </span>
                    <p className="font-display text-sm font-semibold tracking-[0.1em] uppercase text-foreground">
                      {s.title}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.items.map((it) => (
                      <span
                        key={it}
                        className="rounded-lg border border-border bg-background/60 px-2.5 py-1 font-mono text-[0.68rem] text-muted-foreground"
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
