import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, type Theme } from "../../context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  variant?: "segmented" | "compact";
}

export function ThemeToggle({ className = "", variant = "segmented" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const options: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "system", label: "System", icon: Monitor },
    { value: "dark", label: "Dark", icon: Moon },
  ];

  if (variant === "compact") {
    // Cycle between themes on click
    const nextTheme: Theme =
      theme === "system" ? "light" : theme === "light" ? "dark" : "system";

    return (
      <button
        type="button"
        onClick={() => setTheme(nextTheme)}
        title={`Current: ${theme} (${resolvedTheme}) — Click to switch`}
        aria-label={`Current theme: ${theme}. Click to switch theme.`}
        className={`relative flex size-9 items-center justify-center rounded-xl border border-navy-700 bg-navy-800/80 text-ink-400 transition-colors hover:border-navy-600 hover:bg-navy-700 hover:text-ink-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue ${className}`}
      >
        {resolvedTheme === "dark" ? (
          <Moon className="size-4 text-signal-purple" />
        ) : (
          <Sun className="size-4 text-signal-amber" />
        )}
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme selection"
      className={`inline-flex items-center rounded-xl border border-navy-700 bg-navy-800/70 p-0.5 backdrop-blur-md shadow-sm ${className}`}
    >
      {options.map((opt) => {
        const isActive = theme === opt.value;
        const Icon = opt.icon;

        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`Select ${opt.label} theme`}
            title={`${opt.label} mode`}
            onClick={() => setTheme(opt.value)}
            className={`group relative flex items-center justify-center rounded-lg p-1.5 transition-all duration-150 ${
              isActive
                ? "bg-navy-900 text-signal-blue shadow-sm border border-navy-600/80 font-semibold"
                : "text-ink-500 hover:text-ink-200 hover:bg-navy-700/50"
            } focus:outline-none focus-visible:ring-1 focus-visible:ring-signal-blue`}
          >
            <Icon
              className={`size-3.5 transition-transform duration-150 ${
                isActive ? "scale-105" : "group-hover:scale-105"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
