import { cn } from "@/lib/utils";

interface BrandMarkProps {
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: {
    icon: "h-8 w-8 rounded-xl",
    text: "text-xl",
    molecule: "h-5 w-5",
  },
  md: {
    icon: "h-10 w-10 rounded-xl",
    text: "text-2xl",
    molecule: "h-6 w-6",
  },
  lg: {
    icon: "h-12 w-12 rounded-2xl",
    text: "text-3xl",
    molecule: "h-7 w-7",
  },
} as const;

export function BrandMark({
  theme = "light",
  size = "md",
  showTagline = false,
  className,
}: BrandMarkProps) {
  const styles = sizeStyles[size];
  const isDark = theme === "dark";

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-sky via-cyan to-teal-light text-white shadow-lg shadow-cyan/20",
          styles.icon
        )}
        aria-hidden
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.5),transparent_38%)]" />
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className={cn("relative", styles.molecule)}
        >
          <path
            d="M7 10.5 14 6l7 4.5v8L14 23l-7-4.5v-8Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m21 10.5 5-3M21 18.5l5 3M7 10.5l-3-2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {[
            [14, 6],
            [21, 10.5],
            [21, 18.5],
            [14, 23],
            [7, 18.5],
            [7, 10.5],
            [26, 7.5],
            [26, 21.5],
            [4, 8.5],
          ].map(([cx, cy]) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="1.75"
              fill="currentColor"
            />
          ))}
        </svg>
      </span>

      <span className="flex flex-col">
        <span
          className={cn(
            "leading-none tracking-[-0.045em]",
            styles.text,
            isDark ? "text-white" : "text-navy-deep"
          )}
        >
          <span className="font-black">OVI</span>
          <span
            className={cn(
              "font-light",
              isDark ? "text-cyan-bright" : "text-sky"
            )}
          >
            peps
          </span>
        </span>
        {showTagline && (
          <span
            className={cn(
              "mt-1 text-[8px] font-bold uppercase tracking-[0.24em]",
              isDark ? "text-white/45" : "text-muted-foreground"
            )}
          >
            Research compounds
          </span>
        )}
      </span>
    </span>
  );
}
