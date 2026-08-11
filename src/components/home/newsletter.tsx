"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, FileCheck2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

interface NewsletterProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function Newsletter({
  title = "Research information without the hype",
  subtitle = "Explore practical guides, published batch documentation, and transparent product information whenever you need it.",
  className,
}: NewsletterProps) {
  return (
    <section className={cn("py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl">
            {/* Animated gradient background */}
            <div className="absolute inset-0 gradient-primary animate-gradient" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggIGQ9Ik0zNiAzNGg0djJoLTR6bTAtNEg0MHYyaC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

            {/* Floating orbs */}
            <motion.div
              className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-bright/20 blur-3xl"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />

            <div className="relative px-8 py-14 sm:px-16 sm:py-20">
              <div className="mx-auto max-w-xl text-center">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg backdrop-blur-sm"
                >
                  <BookOpen className="h-7 w-7" />
                </motion.div>

                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
                  <Sparkles className="h-3 w-3" />
                  Built for informed decisions
                </div>

                <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
                <p className="mt-3 text-base leading-relaxed text-white/80">{subtitle}</p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/research"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-bold text-navy-deep shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Explore Research Hub
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/lab-results"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                  >
                    <FileCheck2 className="h-4 w-4" />
                    View COA Library
                  </Link>
                </div>

                <p className="mt-5 text-xs text-white/55">
                  Product information is for laboratory research purposes only.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
