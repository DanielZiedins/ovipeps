export const AVAILABLE_VARIANTS = {
  "GLP3-10MG": { price: 80, stockQuantity: 5 },
  "MOTSC-10MG": { price: 45, stockQuantity: 10 },
} as const;

export function getAvailableVariant(sku: string) {
  return AVAILABLE_VARIANTS[sku as keyof typeof AVAILABLE_VARIANTS] ?? null;
}

export function getCatalogProductName(slug: string, currentName: string) {
  return slug === "glp-3" ? "Retatrutide GLP-3" : currentName;
}

export function applyCatalogVariantPolicy(
  sku: string,
  currentPrice: number,
  currentStockQuantity: number
) {
  const availableVariant = getAvailableVariant(sku);

  if (!availableVariant) {
    return { price: currentPrice, stockQuantity: 0, inStock: false };
  }

  const stockQuantity = Math.min(
    Math.max(currentStockQuantity, 0),
    availableVariant.stockQuantity
  );

  return {
    price: availableVariant.price,
    stockQuantity,
    inStock: stockQuantity > 0,
  };
}

export const CATALOG_AVAILABILITY_MESSAGE =
  "Retatrutide GLP-3 10 mg and MOTS-C 10 mg are available now in limited quantities. All other products are coming soon / out of stock.";
