import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { useInView } from "../../hooks/use-reveal";

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "p";
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const Comp = Tag as "div";
  return (
    <Comp
      ref={ref}
      className={cn("reveal", inView && "is-visible", className)}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Comp>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
      )}
    >
      {eyebrow ? (
        <p className="mb-4 font-mono text-[0.7rem] tracking-[0.28em] text-primary uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl leading-[1.1] font-bold tracking-tight text-balance sm:text-4xl md:text-5xl text-foreground">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
