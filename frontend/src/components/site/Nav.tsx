import { useEffect, useState } from "react";
import { Menu, ShieldCheck, X, Play } from "lucide-react";
import { GithubIcon } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { SITE } from "../../lib/site";

const links = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "AI & Explainability", href: "#explainability" },
  { label: "Evaluation", href: "#evaluation" },
  { label: "Architecture", href: "#architecture" },
];

interface NavProps {
  onLaunchDemo: () => void;
  onViewEvaluation?: () => void;
}

export function Nav({ onLaunchDemo }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-all duration-500 md:px-5",
          scrolled ? "glass shadow-card" : "border border-transparent bg-transparent",
        )}
        style={{ animation: "riseIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both" }}
      >
        <a href="#top" className="flex min-w-0 items-center gap-2.5">
          <span className="relative grid size-9 shrink-0 place-items-center rounded-xl border border-border-strong bg-surface">
            <ShieldCheck className="size-5 text-primary" strokeWidth={2.2} />
            <span className="absolute inset-0 rounded-xl shadow-[var(--glow-primary)]" />
          </span>
          <span className="font-display truncate text-base font-semibold tracking-tight text-foreground">
            DisputeShield<span className="text-primary"> AI</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={SITE.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface/60 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:border-border-strong hover:text-foreground"
          >
            <GithubIcon className="size-3.5" />
            GitHub
          </a>
          <button
            onClick={onLaunchDemo}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-card transition-all duration-300 hover:shadow-[var(--glow-soft)] hover:brightness-110"
          >
            <Play className="size-3.5 fill-current" />
            Launch Demo
          </button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-surface/80 text-muted-foreground md:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </nav>

      {open ? (
        <div className="glass mx-auto mt-2 max-w-6xl rounded-2xl p-4 shadow-card md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              <a
                href={SITE.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <GithubIcon className="size-4" />
                GitHub
              </a>
              <button
                onClick={() => {
                  setOpen(false);
                  onLaunchDemo();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-card"
              >
                <Play className="size-3.5 fill-current" />
                Launch Demo
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
