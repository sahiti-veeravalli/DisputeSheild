import { ShieldCheck } from "lucide-react";
import { SITE } from "../../lib/site";

const links = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "AI & Explainability", href: "#explainability" },
  { label: "Evaluation", href: "#evaluation" },
  { label: "Architecture", href: "#architecture" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-border-strong bg-surface">
                <ShieldCheck className="size-4 text-primary" strokeWidth={2.2} />
              </span>
              <span className="font-display text-base font-semibold tracking-tight text-foreground">
                DisputeShield<span className="text-primary"> AI</span>
              </span>
            </div>
            <p className="mt-2.5 text-xs text-muted-foreground md:text-sm">{SITE.tagline}</p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground md:text-sm"
              >
                {l.label}
              </a>
            ))}
            <a
              href={SITE.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground md:text-sm"
            >
              GitHub
            </a>
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="font-mono text-[0.68rem] leading-relaxed text-muted-foreground/70">
            {SITE.positioning}. Synthetic demonstration data only — no real payment or customer records are used.
            Razorpay-oriented dispute defense workflow.
          </p>
        </div>
      </div>
    </footer>
  );
}
