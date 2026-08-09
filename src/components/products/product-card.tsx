"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Heart, ShoppingBag, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import {
  getDefaultVariant,
  getLowestPrice,
  isProductInStock,
  type ProductCardData,
} from "@/types/product";

interface ProductCardProps {
  product: ProductCardData;
  hasCoa?: boolean;
  onQuickView?: (product: ProductCardData) => void;
  className?: string;
  index?: number;
}

export function ProductCard({
  product,
  hasCoa,
  onQuickView,
  className,
  index = 0,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const lowestPrice = getLowestPrice(product.variants);
  const defaultVariant = getDefaultVariant(product.variants);
  const inStock = isProductInStock(product.variants);
  const showCoa = hasCoa ?? product.hasCoa;
  const hasMultipleVariants = product.variants.length > 1;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!defaultVariant || !inStock) return;
    addItem({
      productId: product.id,
      variantId: defaultVariant.id,
      name: product.name,
      variantName: defaultVariant.name,
      price: defaultVariant.price,
      sku: defaultVariant.sku,
      imageUrl: product.imageUrl ?? undefined,
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 4) * 0.08, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card card-shine",
        "shadow-sm hover:shadow-xl hover:shadow-sky/15 hover:border-sky/30",
        "transition-shadow duration-300",
        className
      )}
    >
      {/* Gradient top accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky via-cyan to-teal-light opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <Link href={`/shop/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-sky/5 via-transparent to-cyan/5">
          {product.imageUrl ? (
            <motion.div
              className="relative h-full w-full"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-contain p-6 drop-shadow-md"
              />
            </motion.div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="h-24 w-24 rounded-full border-2 border-dashed border-sky/20" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-sky to-cyan px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                <Sparkles className="h-3 w-3" />
                New
              </span>
            )}
            {product.featured && !product.isNew && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-electric to-sky px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                <Zap className="h-3 w-3" />
                Featured
              </span>
            )}
            {showCoa && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-teal to-teal-light px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                <ShieldCheck className="h-3 w-3" />
                COA
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted((p) => !p); }}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={cn(
              "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all",
              "opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100",
              wishlisted ? "text-burgundy opacity-100 scale-100" : "text-muted-foreground hover:text-burgundy"
            )}
          >
            <Heart className="h-4 w-4" fill={wishlisted ? "currentColor" : "none"} />
          </button>

          {/* Hover actions */}
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full gap-2 p-3 transition-transform duration-300 group-hover:translate-y-0">
            {onQuickView && (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(product); }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/95 py-2.5 text-xs font-semibold text-foreground shadow-lg backdrop-blur-sm transition-colors hover:bg-sky/10"
              >
                <Eye className="h-3.5 w-3.5" />
                Quick View
              </button>
            )}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold shadow-lg transition-all",
                inStock
                  ? "bg-gradient-to-r from-sky to-cyan text-white hover:from-sky-bright hover:to-cyan-bright hover:shadow-sky/30"
                  : "cursor-not-allowed bg-muted text-muted-foreground"
              )}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              {inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          {product.researchCategory && (
            <p className="text-[11px] font-bold uppercase tracking-widest text-cyan">
              {product.researchCategory}
            </p>
          )}
          <h3 className="text-base font-bold leading-snug text-foreground transition-colors group-hover:text-sky">
            {product.name}
          </h3>
          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <p className="text-xl font-bold text-navy-deep">
              {hasMultipleVariants && (
                <span className="mr-1 text-xs font-normal text-muted-foreground">from</span>
              )}
              {formatCurrency(lowestPrice)}
            </p>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
                inStock ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", inStock ? "bg-success animate-pulse" : "bg-muted-foreground")} />
              {inStock ? "In Stock" : "Sold Out"}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
