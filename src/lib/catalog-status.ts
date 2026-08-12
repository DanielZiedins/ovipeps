/**
 * Temporary catalog lock. Flip to `false` when products are ready to sell again.
 * Used by both server and client UI so cart/checkout/shop stay consistent.
 */
export const FORCE_CATALOG_OUT_OF_STOCK = true;

export const RESTOCK_MESSAGE =
  "Our catalog is currently restocking. You can browse products, but orders cannot be placed until inventory is available again.";
