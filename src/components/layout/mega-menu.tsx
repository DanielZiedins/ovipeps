"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MegaMenuLink {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}

export interface MegaMenuSection {
  title: string;
  links: MegaMenuLink[];
}

interface MegaMenuProps {
  label: string;
  sections: MegaMenuSection[];
  featured?: {
    title: string;
    description: string;
    href: string;
    cta: string;
  };
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  className?: string;
}

export function MegaMenu({
  label,
  sections,
  featured,
  isOpen,
  onOpen,
  onClose,
  className,
}: MegaMenuProps) {
  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => (isOpen ? onClose() : onOpen())}
        className={cn(
          "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isOpen
            ? "text-navy bg-secondary"
            : "text-foreground/80 hover:bg-secondary hover:text-navy"
        )}
      >
        {label}
        <svg
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        className={cn(
          "absolute left-1/2 top-full z-50 mt-1 w-[min(100vw-2rem,42rem)] -translate-x-1/2 transition-all duration-200",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        )}
      >
        <div className="glass overflow-hidden rounded-xl border border-border shadow-xl shadow-navy/5">
          <div className="grid gap-0 md:grid-cols-[1fr_auto]">
            <div className="grid gap-6 p-6 sm:grid-cols-2">
              {sections.map((section) => (
                <div key={section.title}>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.title}
                  </p>
                  <ul className="space-y-1">
                    {section.links.map((link) => {
                      const Icon = link.icon;
                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={onClose}
                            className="group flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-secondary"
                          >
                            {Icon && (
                              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-navy/5 text-navy transition-colors group-hover:bg-navy group-hover:text-white">
                                <Icon className="h-4 w-4" />
                              </span>
                            )}
                            <span className="min-w-0">
                              <span className="block text-sm font-medium text-foreground group-hover:text-navy">
                                {link.label}
                              </span>
                              {link.description && (
                                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                                  {link.description}
                                </span>
                              )}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {featured && (
              <div className="border-t border-border bg-gradient-to-br from-navy to-navy-deep p-6 text-white md:w-56 md:border-l md:border-t-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Featured
                </p>
                <h3 className="mt-2 text-base font-semibold leading-snug">
                  {featured.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  {featured.description}
                </p>
                <Link
                  href={featured.href}
                  onClick={onClose}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-light transition-colors hover:text-white"
                >
                  {featured.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
