"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[100] h-1 origin-left bg-gradient-to-r from-sky via-cyan to-teal-light shadow-[0_0_12px_rgba(34,211,238,.55)]"
      style={{ scaleX }}
    />
  );
}
