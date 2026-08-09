"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ChevronDown, FlaskConical, Sparkles } from "lucide-react";
import { FloatingOrbs, FloatingParticles, MolecularRing } from "@/components/motion/floating-orbs";

const HERO_PRODUCTS = [
  { src: "/images/products/glp-3.png", alt: "GLP-3", delay: 0 },
  { src: "/images/products/mots-c.png", alt: "MOTS-C", delay: 0.2 },
  { src: "/images/products/klow.png", alt: "KLOW", delay: 0.4 },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <section ref={ref} className="relative min-h-[90vh] overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-hero" />
      <FloatingOrbs />
      <FloatingParticles />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <MolecularRing className="absolute -right-32 top-1/4 h-[500px] w-[500px] text-cyan-bright/20" />
      <MolecularRing className="absolute -left-40 bottom-0 h-[400px] w-[400px] text-sky-bright/10" />

      <motion.div style={{ y, opacity, scale }} className="relative">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 py-20 sm:px-6 lg:flex-row lg:gap-16 lg:px-8 lg:py-28">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-cyan-bright backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              Canada&apos;s Premium Research Lab
              <span className="ml-1 h-1.5 w-1.5 rounded-full bg-teal-light animate-pulse" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Precision Compounds.
              <br />
              <span className="gradient-text text-4xl font-bold sm:text-5xl lg:text-6xl xl:text-7xl">
                Built for Research.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-white/75 lg:mx-0 mx-auto"
            >
              Explore premium research peptides with batch documentation, Canadian
              fulfillment, and a buying experience built for serious researchers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
            >
              <Link
                href="/shop"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-8 py-4 text-sm font-bold text-navy-deep shadow-lg shadow-black/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-sky/30"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-sky-bright/0 via-sky-bright/20 to-sky-bright/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <FlaskConical className="h-4 w-4" />
                Explore Research Products
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/lab-results"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/25 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-all hover:border-cyan-bright/50 hover:bg-white/20 hover:scale-105"
              >
                View Lab Results
              </Link>
            </motion.div>

            {/* Quick trust pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              {["Canadian Fulfillment", "COA Library", "Interac e-Transfer"].map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70 backdrop-blur-sm"
                >
                  {pill}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right — floating product vials */}
          <div className="relative flex-1 flex items-center justify-center">
            <div className="relative h-[380px] w-full max-w-md">
              {HERO_PRODUCTS.map((product, i) => (
                <motion.div
                  key={product.alt}
                  initial={{ opacity: 0, y: 60, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 + product.delay }}
                  className="absolute"
                  style={{
                    left: `${15 + i * 28}%`,
                    top: `${10 + (i % 2) * 15}%`,
                    zIndex: 3 - i,
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{
                      duration: 4 + i,
                      delay: product.delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative"
                  >
                    <div className="absolute -inset-4 rounded-3xl bg-cyan-bright/20 blur-2xl" />
                    <div className="relative h-48 w-32 overflow-hidden rounded-2xl bg-white/10 p-3 shadow-2xl shadow-black/30 backdrop-blur-sm ring-1 ring-white/20 sm:h-56 sm:w-36">
                      <Image
                        src={product.src}
                        alt={product.alt}
                        fill
                        className="object-contain drop-shadow-lg"
                        sizes="150px"
                        priority={i === 0}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              ))}

              {/* Glow ring behind products */}
              <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-bright/30 to-sky/20 blur-3xl animate-pulse-glow" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/50"
        >
          <span className="text-[10px] font-medium uppercase tracking-widest">Scroll</span>
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>

      {/* Bottom wave fade */}
      <div className="absolute inset-x-0 bottom-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full" preserveAspectRatio="none">
          <path
            d="M0 80V40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0Z"
            fill="var(--background)"
          />
        </svg>
      </div>
    </section>
  );
}
