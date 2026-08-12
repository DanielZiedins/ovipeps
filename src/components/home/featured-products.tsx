"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/products/product-card";
import { ProductGrid } from "@/components/products/product-grid";
import { QuickViewModal } from "@/components/products/quick-view-modal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { ProductCardData } from "@/types/product";

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  products: ProductCardData[];
  viewAllHref?: string;
  className?: string;
  variant?: "default" | "gradient";
}

export function FeaturedProducts({
  title = "Featured Compounds",
  subtitle = "Laboratory-verified research peptides selected for purity and consistency.",
  products,
  viewAllHref = "/shop",
  className,
  variant = "default",
}: FeaturedProductsProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<ProductCardData | null>(null);

  return (
    <section className={cn("relative overflow-hidden py-16 sm:py-24", className)}>
      {variant === "gradient" && (
        <>
          <div className="absolute inset-0 mesh-bg opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-sky/5 via-transparent to-cyan/5" />
        </>
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-sky/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-sky">
              <Sparkles className="h-3 w-3" />
              Catalog Preview
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-navy-deep sm:text-4xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                {subtitle}
              </p>
            )}
            <p className="mt-2 text-sm font-medium text-amber-800">
              Temporarily unavailable — browsing only while we restock.
            </p>
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky to-cyan px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-sky/25 transition-all hover:scale-105 hover:shadow-lg hover:shadow-sky/30"
            >
              Browse catalog
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </ScrollReveal>

        <ProductGrid>
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </ProductGrid>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        open={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
