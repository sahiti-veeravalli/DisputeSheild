import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Circle } from "lucide-react";

const AGENT_STEPS = [
  "Understanding dispute reason",
  "Retrieving transaction details",
  "Checking order records",
  "Verifying delivery records",
  "Reviewing customer communication",
  "Checking payment & device signals",
  "Mapping evidence to dispute requirements",
  "Detecting missing evidence",
  "Building evidence packet",
];

const STEP_MS = 480;

interface Props {
  onComplete: () => void;
  onStepReached?: (index: number) => void;
}

export default function AgentTrace({ onComplete, onStepReached }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [doneIndex, setDoneIndex] = useState(-1);

  useEffect(() => {
    if (activeIndex >= AGENT_STEPS.length) {
      const t = setTimeout(onComplete, 350);
      return () => clearTimeout(t);
    }
    onStepReached?.(activeIndex);
    const t = setTimeout(() => {
      setDoneIndex(activeIndex);
      setActiveIndex((i) => i + 1);
    }, STEP_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <div className="rounded-xl border border-navy-600 bg-navy-950/60 p-5 font-mono text-sm">
      <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-ink-700">
        <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-signal-blue" />
        Agent trace
      </div>
      <ul className="space-y-2.5">
        {AGENT_STEPS.map((step, i) => {
          const isDone = i <= doneIndex;
          const isActive = i === activeIndex && !isDone;
          return (
            <li
              key={step}
              className={`flex items-center gap-2.5 transition-opacity duration-300 ${
                i <= activeIndex ? "opacity-100" : "opacity-30"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-signal-green" />
              ) : isActive ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-signal-blue" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-ink-700" />
              )}
              <span className={isDone ? "text-ink-300" : isActive ? "text-ink-100" : "text-ink-700"}>
                {step}
              </span>
              {isDone && <span className="ml-auto text-[11px] text-ink-700">done</span>}
              {isActive && <span className="ml-auto text-[11px] text-signal-blue">running…</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
