"use client";

import { motion } from "framer-motion";

export function FloatingOrbs() {
  const orbs = [
    { size: 300, x: "10%", y: "20%", color: "rgba(14,165,233,0.15)", delay: 0 },
    { size: 200, x: "80%", y: "10%", color: "rgba(6,182,212,0.12)", delay: 1 },
    { size: 250, x: "70%", y: "60%", color: "rgba(45,212,191,0.1)", delay: 2 },
    { size: 180, x: "20%", y: "70%", color: "rgba(59,130,246,0.1)", delay: 0.5 },
    { size: 120, x: "50%", y: "40%", color: "rgba(34,211,238,0.08)", delay: 1.5 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 4,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function MolecularRing({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 400 400"
      fill="none"
      className={className}
      aria-hidden
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    >
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 200 + Math.cos(rad) * 140;
        const cy = 200 + Math.sin(rad) * 140;
        return (
          <g key={i}>
            <motion.circle
              cx={cx}
              cy={cy}
              r={8}
              fill="currentColor"
              opacity={0.3 + i * 0.05}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, delay: i * 0.3, repeat: Infinity }}
            />
            <line
              x1="200"
              y1="200"
              x2={cx}
              y2={cy}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.15"
            />
          </g>
        );
      })}
      <circle cx="200" cy="200" r="6" fill="currentColor" opacity="0.5" />
    </motion.svg>
  );
}
