import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variantStyles = {
  default: "border-border bg-secondary text-secondary-foreground",
  success: "border-success/30 bg-success/15 text-success font-semibold",
  warning: "border-warning/30 bg-warning/15 text-warning font-semibold",
  research: "border-cyan/30 bg-gradient-to-r from-sky/10 to-cyan/10 text-sky font-semibold",
  coa: "border-teal/30 bg-gradient-to-r from-teal/15 to-teal-light/15 text-teal font-semibold",
  new: "border-sky/30 bg-gradient-to-r from-sky to-cyan text-white font-bold shadow-sm shadow-sky/20",
} as const;

export type BadgeVariant = keyof typeof variantStyles;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
