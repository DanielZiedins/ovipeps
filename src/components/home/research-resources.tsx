"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  FileCheck2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/scroll-reveal";

const RESOURCES = [
  {
    title: "Research Hub",
    description: "Educational articles, peptide guides, and storage protocols for laboratory research.",
    href: "/research",
    icon: BookOpen,
    gradient: "from-sky to-cyan",
    bg: "from-sky/10 to-cyan/5",
  },
  {
    title: "COA Library",
    description: "Browse certificates of analysis for every batch. Full transparency on purity and testing.",
    href: "/lab-results",
    icon: FileCheck2,
    gradient: "from-cyan to-teal-light",
    bg: "from-cyan/10 to-teal-light/5",
  },
  {
    title: "Peptide Calculator",
    description: "Calculate precise dilution volumes and concentrations for your research protocols.",
    href: "/calculator",
    icon: Calculator,
    gradient: "from-teal-light to-teal",
    bg: "from-teal-light/10 to-teal/5",
  },
];

interface ResearchResourcesProps {
  className?: string;
}

export function ResearchResources({ className }: ResearchResourcesProps) {
  return (
    <section className={cn("relative overflow-hidden py-20 sm:py-28", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-navy-deep via-navy to-sky/80" />
      <FloatingOrbsDark />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-14 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-bright">
            Knowledge Base
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Research Resources
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-white/70">
            Tools and documentation to support informed laboratory research.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid gap-6 md:grid-cols-3">
          {RESOURCES.map((resource) => {
            const Icon = resource.icon;
            return (
              <StaggerItem key={resource.href}>
                <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.25 }}>
                  <Link
                    href={resource.href}
                    className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-md transition-all hover:border-cyan-bright/30 hover:bg-white/10 hover:shadow-xl hover:shadow-cyan/10"
                  >
                    <div
                      className={cn(
                        "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
                        resource.gradient
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{resource.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">
                      {resource.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-cyan-bright transition-colors group-hover:text-white">
                      Explore
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

function FloatingOrbsDark() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: 200 + i * 80,
            height: 200 + i * 80,
            left: `${10 + i * 25}%`,
            top: `${20 + (i % 2) * 40}%`,
            background: `rgba(${i % 2 ? "6,182,212" : "14,165,233"},0.12)`,
          }}
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
