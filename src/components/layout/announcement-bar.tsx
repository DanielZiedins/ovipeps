"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Announcement {
  id: string;
  message: string;
  link?: string | null;
  linkText?: string | null;
}

interface AnnouncementBarProps {
  announcements: Announcement[];
  intervalMs?: number;
}

export function AnnouncementBar({
  announcements,
  intervalMs = 5000,
}: AnnouncementBarProps) {
  const active = announcements.filter((a) => a.message);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (active.length <= 1) return;
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % active.length);
        setVisible(true);
      }, 300);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [active.length, intervalMs]);

  if (!active.length) return null;

  const current = active[index];

  return (
    <div className="relative z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-sky to-cyan animate-gradient" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)] animate-shimmer bg-[length:200%_100%]" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5 text-center text-sm">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Sparkles className="hidden h-4 w-4 shrink-0 text-cyan-bright sm:block" aria-hidden />
        </motion.div>

        <div
          className={cn(
            "flex items-center justify-center gap-2 transition-all duration-300",
            visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          )}
        >
          <Truck className="h-3.5 w-3.5 text-cyan-bright sm:hidden" aria-hidden />
          <span className="font-semibold text-white">{current.message}</span>
          {current.link && (
            <Link
              href={current.link}
              className="inline-flex items-center gap-0.5 font-bold text-cyan-bright underline-offset-2 transition-colors hover:text-white hover:underline"
            >
              {current.linkText ?? "Learn more"}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {active.length > 1 && (
          <div className="absolute right-4 hidden items-center gap-1.5 sm:flex" aria-hidden>
            {active.map((item, i) => (
              <motion.span
                key={item.id}
                animate={i === index ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index ? "w-5 bg-cyan-bright" : "w-1.5 bg-white/30"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
