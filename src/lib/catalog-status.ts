export const AVAILABLE_VARIANTS = {
  "GLP3-5MG": { price: 45, stockQuantity: 4 },
  "MOTSC-10MG": { price: 80, stockQuantity: 4 },
} as const;

export function getAvailableVariant(sku: string) {
  return AVAILABLE_VARIANTS[sku as keyof typeof AVAILABLE_VARIANTS] ?? null;
}

export function getCatalogProductName(slug: string, currentName: string) {
  if (slug === "glp-3") return "Retatrutide (GLP-3)";
  if (slug === "mots-c") return "CJC/Ipamorelin";
  return currentName;
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
  "Retatrutide (GLP-3) 5 mg and CJC/Ipamorelin 10 mg are available now in limited quantities. All other products are restocking / coming soon.";
