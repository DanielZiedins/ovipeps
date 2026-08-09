"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variantStyles = {
  primary:
    "bg-gradient-to-r from-sky to-cyan text-white shadow-md shadow-sky/25 hover:from-sky-bright hover:to-cyan-bright hover:shadow-lg hover:shadow-sky/30 hover:scale-[1.02] active:scale-[0.98]",
  secondary:
    "bg-secondary text-secondary-foreground border border-sky/20 hover:bg-sky/10 hover:border-sky/30 focus-visible:ring-sky/30",
  outline:
    "border-2 border-sky/30 bg-card text-foreground hover:bg-sky/5 hover:border-sky/50 focus-visible:ring-sky/30",
  ghost:
    "text-foreground hover:bg-sky/10 hover:text-sky focus-visible:ring-sky/20",
  danger:
    "bg-gradient-to-r from-error to-burgundy text-white shadow-md hover:shadow-lg focus-visible:ring-error/40",
  glow:
    "bg-gradient-to-r from-sky via-cyan to-teal-light text-white shadow-lg shadow-cyan/30 hover:shadow-xl hover:shadow-cyan/40 hover:scale-[1.03] animate-gradient bg-[length:200%_200%]",
} as const;

const sizeStyles = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-5 text-sm gap-2 rounded-xl",
  lg: "h-12 px-7 text-base gap-2.5 rounded-xl",
} as const;

export type ButtonVariant = keyof typeof variantStyles;
export type ButtonSize = keyof typeof sizeStyles;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
