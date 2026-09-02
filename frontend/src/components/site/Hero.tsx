import { ArrowRight, ShieldCheck, Play } from "lucide-react";
import { GithubIcon } from "../../lib/icons";
import { DashboardPreview } from "./DashboardPreview";
import { SITE } from "../../lib/site";

const stagger = (i: number) => ({
  animation: "riseIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
  animationDelay: `${120 + i * 110}ms`,
});

interface HeroProps {
  onLaunchDemo: () => void;
}

export function Hero({ onLaunchDemo }: HeroProps) {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="grid-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_55%_at_50%_0%,black,transparent)]" />
        <div className="animate-ambient absolute -top-40 left-1/2 h-[36rem] w-[70rem] -translate-x-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(76,125,255,0.2),transparent_72%)] blur-3xl" />
        <div className="animate-ambient absolute top-24 -right-32 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(56,189,248,0.12),transparent_70%)] blur-3xl [animation-delay:-6s]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span
            style={stagger(0)}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-border-strong bg-surface/70 px-3.5 py-1.5 font-mono text-[0.68rem] tracking-[0.2em] text-muted-foreground uppercase"
          >
            <ShieldCheck className="size-4 shrink-0 text-cyan" />
            <span className="truncate">{SITE.eyebrow}</span>
          </span>

          <h1
            style={stagger(1)}
            className="font-display mx-auto mt-6 max-w-[46rem] text-4xl leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl md:text-[3.4rem] lg:text-[3.75rem] text-foreground"
          >
            Every chargeback deserves an{" "}
            <span className="text-gradient-accent">intelligent defense.</span>
          </h1>

          <p
            style={stagger(2)}
            className="font-display mx-auto mt-5 max-w-2xl text-lg font-semibold tracking-tight text-balance text-foreground/90 md:text-xl"
          >
            {SITE.tagline}
          </p>

          <p
            style={stagger(3)}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base"
          >
            DisputeShield AI investigates each dispute, ranks the merchant evidence that
            matters, flags critical gaps, and assembles a review-ready defense packet — with
            explainable decision support at every step.
          </p>

          <div
            style={stagger(4)}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <button
              onClick={onLaunchDemo}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--glow-soft)] hover:brightness-110 sm:w-auto"
            >
              <Play className="size-4 fill-current" />
              Launch Demo
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <a
              href="#how-it-works"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border-strong bg-surface/60 px-6 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent sm:w-auto"
            >
              See How It Works
            </a>
            <a
              href={SITE.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface/40 px-5 py-3.5 text-sm font-semibold text-muted-foreground transition-colors duration-300 hover:border-border-strong hover:text-foreground sm:w-auto"
            >
              <GithubIcon className="size-4" />
              GitHub
            </a>
          </div>

          <p
            style={stagger(5)}
            className="mx-auto mt-7 max-w-xl font-mono text-[0.65rem] leading-relaxed tracking-[0.14em] text-muted-foreground/70 uppercase"
          >
            Product Not Received · Fraudulent Transaction · Duplicate Charge · Not as Described
          </p>
        </div>

        <div style={stagger(6)} className="mt-14 md:mt-18">
          <DashboardPreview onExploreDemo={onLaunchDemo} />
        </div>
      </div>
    </section>
  );
}
