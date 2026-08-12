"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  FileCheck2,
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsBarProps {
  className?: string;
}

const PROOFS = [
  {
    icon: MapPin,
    label: "Canadian fulfillment",
    description: "Orders are prepared and shipped from within Canada.",
    href: "/shipping",
  },
  {
    icon: ShieldCheck,
    label: "Clear standards",
    description: "Transparent terms, research-use requirements, and product status.",
    href: "/terms",
  },
  {
    icon: Truck,
    label: "Tracked delivery",
    description: "Transparent shipping rates, thresholds, and order updates.",
    href: "/shipping",
  },
  {
    icon: FileCheck2,
    label: "Secure checkout",
    description: "Interac e-Transfer with clear payment instructions after order.",
    href: "/payment-instructions",
  },
];

export function StatsBar({ className }: StatsBarProps) {
  return (
    <section
      aria-labelledby="proof-heading"
      className={cn("relative overflow-hidden py-14 sm:py-20", className)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white via-sky/5 to-white" />
      <div className="absolute left-1/2 top-0 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-cyan/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mb-9 max-w-2xl text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky">
            Trust through transparency
          </p>
          <h2
            id="proof-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-navy-deep sm:text-4xl"
          >
            Proof you can inspect.{" "}
            <span className="gradient-text">Processes you can follow.</span>
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROOFS.map((proof, i) => {
            const Icon = proof.icon;
            return (
            <motion.div
              key={proof.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              whileHover={{ y: -6 }}
            >
              <Link
                href={proof.href}
                className="group flex h-full flex-col rounded-2xl border border-sky/10 bg-white/90 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-sky/25 hover:shadow-xl hover:shadow-sky/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky to-cyan text-white shadow-lg shadow-sky/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-sky/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sky" />
                </div>
                <h3 className="mt-5 font-bold text-navy-deep">{proof.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {proof.description}
                </p>
              </Link>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
