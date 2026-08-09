import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, FileCheck2 } from "lucide-react";
import { PeptideCalculator } from "@/components/calculator/peptide-calculator";
import { PageHero } from "@/components/content/page-hero";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Reconstitution Calculator",
  description:
    "Laboratory reconstitution calculator for research peptides. Calculate concentration, draw volume, and syringe units for research protocols.",
};

export default function CalculatorPage() {
  return (
    <ToastProvider>
      <PageHero
        eyebrow="Laboratory Utility"
        title="Research Peptide Reconstitution Calculator"
        description="Calculate solution concentration, required draw volume, and optional syringe graduations for laboratory reconstitution workflows. For qualified research use only."
      />

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />
        <ScrollReveal className="relative">
          <PeptideCalculator />
        </ScrollReveal>
      </section>

      <section className="border-t border-border bg-gradient-to-br from-sky/5 to-cyan/5">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col items-start gap-6 rounded-2xl border border-sky/20 bg-card p-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal to-teal-light text-white shadow-md">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-bold text-navy-deep">Verify your compounds</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Browse published certificates of analysis for batch-level documentation.
                  </p>
                </div>
              </div>
              <Link
                href="/lab-results"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky to-cyan px-6 py-3 text-sm font-bold text-white shadow-md shadow-sky/25 transition-all hover:scale-105"
              >
                <Calculator className="h-4 w-4" />
                View COA Library
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </ToastProvider>
  );
}
