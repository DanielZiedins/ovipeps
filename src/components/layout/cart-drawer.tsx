"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { FORCE_CATALOG_OUT_OF_STOCK } from "@/lib/catalog-status";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 300;

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount,
  } = useCartStore();

  const count = itemCount();
  const total = subtotal();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
  const catalogLocked = FORCE_CATALOG_OUT_OF_STOCK;

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-navy-deep/50 backdrop-blur-sm"
            onClick={closeCart}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-card shadow-2xl"
          >
            <div className="relative overflow-hidden border-b border-border px-5 py-4">
              <div className="absolute inset-0 bg-gradient-to-r from-sky/10 via-cyan/5 to-teal-light/10" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky to-cyan text-white shadow-md">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Your Cart</h2>
                    {count > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {count} {count === 1 ? "item" : "items"}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-sky/10 hover:text-foreground"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {catalogLocked && (
              <div className="border-b border-amber-200/80 bg-amber-50 px-5 py-3">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Restocking
                </p>
                <p className="mt-1 text-xs leading-relaxed text-amber-950/80">
                  Catalog is temporarily unavailable for purchase. Browse products or
                  contact support for updates.
                </p>
              </div>
            )}

            {!catalogLocked && items.length > 0 && (
              <div className="border-b border-border px-5 py-3">
                <div className="flex items-center gap-2 text-xs">
                  <Truck className="h-3.5 w-3.5 text-sky" />
                  {remaining > 0 ? (
                    <span className="text-muted-foreground">
                      Add <strong className="text-sky">{formatCurrency(remaining)}</strong> for
                      free shipping
                    </span>
                  ) : (
                    <span className="font-semibold text-success">
                      You qualify for free shipping
                    </span>
                  )}
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-sky to-cyan"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky/20 to-cyan/20"
                  >
                    <ShoppingBag className="h-9 w-9 text-sky" />
                  </motion.div>
                  <p className="mt-5 text-lg font-bold text-foreground">Your cart is empty</p>
                  <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                    {catalogLocked
                      ? "Browse the catalog while we restock. Orders will open again soon."
                      : "Discover premium research compounds."}
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky to-cyan px-6 py-3 text-sm font-bold text-white shadow-md shadow-sky/25 transition-all hover:scale-105"
                  >
                    <Sparkles className="h-4 w-4" />
                    Browse Catalog
                  </Link>
                  {catalogLocked && (
                    <Link
                      href="/contact"
                      onClick={closeCart}
                      className="mt-3 text-sm font-medium text-sky hover:underline"
                    >
                      Contact support
                    </Link>
                  )}
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.li
                        key={item.variantId}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-3 rounded-xl border border-border/60 bg-gradient-to-br from-card to-sky/5 p-3"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white shadow-sm">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-contain p-1"
                              sizes="80px"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ShoppingBag className="h-6 w-6 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="truncate text-sm font-bold text-foreground">
                                {item.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.variantName}
                              </p>
                              <p className="mt-1 text-sm font-bold text-sky">
                                {formatCurrency(item.price)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.variantId)}
                              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-error/10 hover:text-error"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          {!catalogLocked && (
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.variantId, item.quantity - 1)
                                }
                                aria-label={`Decrease quantity of ${item.name}`}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-sky/10"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-bold">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.variantId, item.quantity + 1)
                                }
                                aria-label={`Increase quantity of ${item.name}`}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-sky/10"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                          {catalogLocked && (
                            <p className="mt-2 text-xs font-medium text-amber-800">
                              Qty {item.quantity} · currently unavailable
                            </p>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border bg-gradient-to-t from-sky/5 to-transparent px-5 py-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-2xl font-bold text-foreground">
                    {formatCurrency(total)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  CAD · Shipping calculated at checkout
                </p>
                {catalogLocked ? (
                  <>
                    <Link
                      href="/contact"
                      onClick={closeCart}
                      className="mt-4 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky to-cyan py-3.5 text-sm font-bold text-white shadow-lg shadow-sky/25 transition-all hover:scale-[1.02]"
                    >
                      Contact Support
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        clearCart();
                        closeCart();
                      }}
                      className="mt-2 w-full py-2 text-center text-sm font-medium text-muted-foreground hover:text-error"
                    >
                      Clear cart
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="mt-4 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky to-cyan py-3.5 text-sm font-bold text-white shadow-lg shadow-sky/25 transition-all hover:scale-[1.02] hover:shadow-xl"
                    >
                      Proceed to Checkout
                    </Link>
                    <button
                      type="button"
                      onClick={closeCart}
                      className="mt-2 w-full py-2 text-center text-sm font-medium text-muted-foreground hover:text-sky"
                    >
                      Continue Shopping
                    </button>
                  </>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
