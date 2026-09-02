import { ArrowRight, Play } from "lucide-react";
import { GithubIcon } from "../../lib/icons";
import { Reveal } from "./Reveal";
import { SITE } from "../../lib/site";

interface FinalCtaProps {
  onLaunchDemo: () => void;
}

export function FinalCta({ onLaunchDemo }: FinalCtaProps) {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4">
        <Reveal>
          <div className="panel relative overflow-hidden rounded-3xl border border-border px-6 py-16 text-center md:px-16 md:py-20">
            <div
              aria-hidden
              className="animate-ambient pointer-events-none absolute -top-32 left-1/2 h-[24rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(76,125,255,0.22),transparent_72%)] blur-3xl"
            />
            <div
              aria-hidden
              className="grid-bg pointer-events-none absolute inset-0 opacity-20 [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)]"
            />

            <div className="relative">
              <h2 className="font-display text-3xl leading-[1.1] font-bold tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl">
                Every chargeback deserves an{" "}
                <span className="text-gradient-accent">intelligent defense.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {SITE.tagline}
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={onLaunchDemo}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--glow-soft)] hover:brightness-110 sm:w-auto"
                >
                  <Play className="size-4 fill-current" />
                  Launch Demo
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <a
                  href={SITE.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border-strong bg-surface/70 px-6 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 sm:w-auto"
                >
                  <GithubIcon className="size-4" />
                  View Source Code
                </a>
              </div>

              <p className="mx-auto mt-8 max-w-xl text-xs leading-relaxed text-muted-foreground/80">
                {SITE.humanControl}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
