"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import {
  getDefaultVariant,
  type ProductVariant,
} from "@/types/product";

interface ProductDetailClientProps {
  productId: string;
  productName: string;
  imageUrl?: string | null;
  variants: ProductVariant[];
}

export function ProductDetailClient({
  productId,
  productName,
  imageUrl,
  variants,
}: ProductDetailClientProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedVariant(getDefaultVariant(variants));
    setQuantity(1);
  }, [variants]);

  const inStock = selectedVariant?.inStock ?? false;
  const hasMultipleVariants = variants.length > 1;

  const handleAddToCart = () => {
    if (!selectedVariant || !inStock) return;

    addItem({
      productId,
      variantId: selectedVariant.id,
      name: productName,
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      sku: selectedVariant.sku,
      imageUrl: imageUrl ?? undefined,
      quantity,
    });
  };

  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));
  const incrementQuantity = () => setQuantity((q) => q + 1);

  return (
    <div className="space-y-6">
      {selectedVariant && (
        <div>
          <p className="text-3xl font-semibold tracking-tight text-navy-deep">
            {formatCurrency(selectedVariant.price)}
          </p>
          {hasMultipleVariants && (
            <p className="mt-1 text-sm text-muted-foreground">
              SKU: {selectedVariant.sku}
            </p>
          )}
        </div>
      )}

      {hasMultipleVariants && (
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Select Variant
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                disabled={!variant.inStock}
                onClick={() => setSelectedVariant(variant)}
                className={cn(
                  "rounded-lg border px-4 py-2.5 text-sm font-medium transition-all",
                  selectedVariant?.id === variant.id
                    ? "border-navy bg-navy text-primary-foreground shadow-sm"
                    : variant.inStock
                      ? "border-border bg-background text-foreground hover:border-accent/40 hover:shadow-sm"
                      : "cursor-not-allowed border-border bg-muted text-muted-foreground line-through"
                )}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Quantity
        </span>
        <div className="inline-flex items-center rounded-lg border border-border">
          <button
            type="button"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="flex h-10 w-12 items-center justify-center border-x border-border text-sm font-semibold">
            {quantity}
          </span>
          <button
            type="button"
            onClick={incrementQuantity}
            className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
            inStock
              ? "bg-success/10 text-success"
              : "bg-muted text-muted-foreground"
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              inStock ? "bg-success" : "bg-muted-foreground"
            )}
          />
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={!inStock || !selectedVariant}
      >
        <ShoppingBag className="h-4 w-4" />
        {inStock ? "Add to Cart" : "Out of Stock"}
      </Button>
    </div>
  );
}
