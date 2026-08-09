export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  inStock: boolean;
  isDefault?: boolean;
}

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  researchCategory?: string | null;
  shortDescription?: string | null;
  hasCoa?: boolean;
  isNew?: boolean;
  featured?: boolean;
  variants: ProductVariant[];
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "newest";

export type AvailabilityFilter = "all" | "in-stock" | "out-of-stock";

export interface ProductFilterState {
  categories: string[];
  priceMin: number | null;
  priceMax: number | null;
  availability: AvailabilityFilter;
  coaOnly: boolean;
  sort: SortOption;
}

export const DEFAULT_PRODUCT_FILTERS: ProductFilterState = {
  categories: [],
  priceMin: null,
  priceMax: null,
  availability: "all",
  coaOnly: false,
  sort: "featured",
};

export function getLowestPrice(variants: ProductVariant[]): number {
  if (variants.length === 0) return 0;
  return Math.min(...variants.map((v) => v.price));
}

export function getDefaultVariant(variants: ProductVariant[]): ProductVariant | undefined {
  if (variants.length === 0) return undefined;
  return (
    variants.find((v) => v.isDefault) ??
    variants.reduce((lowest, v) => (v.price < lowest.price ? v : lowest))
  );
}

export function isProductInStock(variants: ProductVariant[]): boolean {
  return variants.some((v) => v.inStock);
}
