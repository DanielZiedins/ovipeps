"use client";

import {
  FileCheck2,
  FlaskConical,
  Headphones,
  MapPin,
  Shield,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  MapPin,
  FileCheck2,
  Shield,
  FlaskConical,
  Headphones,
  Truck,
};

export interface TrustItemData {
  iconName: string;
  title: string;
  description?: string;
}

interface TrustStripProps {
  items: TrustItemData[];
  className?: string;
}

const GRADIENTS = [
  "from-sky/10 to-cyan/5",
  "from-cyan/10 to-teal-light/5",
  "from-teal-light/10 to-sky/5",
  "from-electric/10 to-cyan/5",
  "from-sky-bright/10 to-teal/5",
];

const ICON_GRADIENTS = [
  "from-sky to-cyan",
  "from-cyan to-teal-light",
  "from-teal-light to-teal",
  "from-electric to-sky",
  "from-sky-bright to-cyan-bright",
];

export function TrustStrip({ items, className }: TrustStripProps) {
  return (
    <section className={cn("relative overflow-hidden border-y border-border/50", className)}>
      <div className="absolute inset-0 mesh-bg opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0 lg:py-0">
          {items.map((item, index) => {
            const Icon = ICON_MAP[item.iconName] ?? Shield;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={cn(
                  "group flex items-center gap-4 rounded-xl p-4 transition-all lg:rounded-none lg:px-6 lg:py-8",
                  `bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]}`,
                  "hover:shadow-lg hover:shadow-sky/10"
                )}
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md",
                    ICON_GRADIENTS[index % ICON_GRADIENTS.length]
                  )}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
                <div>
                  <p className="text-sm font-bold text-foreground">{item.title}</p>
                  {item.description && (
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
