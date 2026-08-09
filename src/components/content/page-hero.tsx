"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FloatingOrbs } from "@/components/motion/floating-orbs";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
  variant?: "light" | "gradient";
}

export function PageHero({
  eyebrow,
  title,
  description,
  className,
  children,
  variant = "gradient",
}: PageHeroProps) {
  if (variant === "gradient") {
    return (
      <section className={cn("relative overflow-hidden", className)}>
        <div className="absolute inset-0 gradient-hero" />
        <FloatingOrbs />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20 lg:px-6">
          {eyebrow && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-bright backdrop-blur-sm"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg"
            >
              {description}
            </motion.p>
          )}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              {children}
            </motion.div>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 60V30C360 0 720 60 1080 30C1260 15 1380 15 1440 30V60H0Z" fill="var(--background)" />
          </svg>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("relative overflow-hidden border-b border-border mesh-bg", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-sky/8 via-transparent to-cyan/8" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:px-6">
        {eyebrow && (
          <p className="inline-flex items-center gap-1.5 rounded-full bg-sky/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-sky">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-navy-deep sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
