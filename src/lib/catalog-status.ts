export const AVAILABLE_VARIANTS = {
  "GLP3-10MG": { price: 80, stockQuantity: 4 },
  "CJCIPA-10MG": { price: 80, stockQuantity: 4 },
  "GHKCU-50MG": { price: 50, stockQuantity: 8 },
  "MOTSC-10MG": { price: 45, stockQuantity: 10 },
} as const;

export function getAvailableVariant(sku: string) {
  return AVAILABLE_VARIANTS[sku as keyof typeof AVAILABLE_VARIANTS] ?? null;
}

export function getCatalogProductName(slug: string, currentName: string) {
  if (slug === "glp-3") return "Retatrutide (GLP-3)";
  if (slug === "cjc-ipamorelin") return "CJC/Ipamorelin";
  return currentName;
}

export function applyCatalogVariantPolicy(
  sku: string,
  currentPrice: number,
  currentStockQuantity: number
) {
  const availableVariant = getAvailableVariant(sku);

  if (!availableVariant) {
    return { price: 0, stockQuantity: 0, inStock: false };
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
  "Retatrutide (GLP-3) 10 mg, CJC/Ipamorelin 10 mg, GHK-Cu 50 mg, and MOTS-C 10 mg are available now in limited quantities. All other products are restocking / coming soon.";
