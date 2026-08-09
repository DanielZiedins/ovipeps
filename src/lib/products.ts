import { db } from "@/lib/db";
import { FALLBACK_PRODUCTS, FALLBACK_SETTINGS } from "@/lib/fallback-data";
import type { Prisma, ProductCategory } from "@/generated/prisma/client";
import {
  getLowestPrice,
  type AvailabilityFilter,
  type ProductCardData,
  type ProductVariant,
  type SortOption,
} from "@/types/product";

const productCardInclude = {
  variants: { orderBy: { sortOrder: "asc" as const } },
  coaDocuments: { where: { published: true }, select: { id: true } },
} satisfies Prisma.ProductInclude;

const productDetailInclude = {
  variants: { orderBy: { sortOrder: "asc" as const } },
  batches: { orderBy: { createdAt: "desc" as const } },
  coaDocuments: {
    where: { published: true },
    orderBy: { testingDate: "desc" as const },
  },
} satisfies Prisma.ProductInclude;

export type ProductWithVariants = Prisma.ProductGetPayload<{
  include: typeof productCardInclude;
}>;

export type ProductDetail = Prisma.ProductGetPayload<{
  include: typeof productDetailInclude;
}>;

export interface ProductQueryFilters {
  q?: string;
  filter?: string;
  category?: string;
  sort?: SortOption;
  categories?: string[];
  priceMin?: number | null;
  priceMax?: number | null;
  availability?: AvailabilityFilter;
  coaOnly?: boolean;
}

const CATEGORY_SLUG_MAP: Record<string, ProductCategory> = {
  "research-peptides": "RESEARCH_PEPTIDE",
  supplies: "SUPPLY",
  bundles: "BUNDLE",
};

function mapVariant(variant: ProductWithVariants["variants"][number]): ProductVariant {
  return {
    id: variant.id,
    name: variant.name,
    sku: variant.sku,
    price: variant.price,
    inStock: variant.inStock,
    isDefault: variant.isDefault,
  };
}

export function getProductCardData(product: ProductWithVariants): ProductCardData {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    imageUrl: product.imageUrl,
    researchCategory: product.researchCategory,
    shortDescription: product.shortDescription,
    hasCoa: product.coaDocuments.length > 0,
    isNew: product.isNew,
    featured: product.featured,
    variants: product.variants.map(mapVariant),
  };
}

function buildWhereClause(filters: ProductQueryFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { published: true };

  if (filters.q?.trim()) {
    const q = filters.q.trim();
    where.OR = [
      { name: { contains: q } },
      { shortDescription: { contains: q } },
      { researchCategory: { contains: q } },
      { description: { contains: q } },
    ];
  }

  if (filters.filter === "featured") {
    where.featured = true;
  } else if (filters.filter === "new") {
    where.isNew = true;
  }

  if (filters.category && CATEGORY_SLUG_MAP[filters.category]) {
    where.category = CATEGORY_SLUG_MAP[filters.category];
  }

  if (filters.categories && filters.categories.length > 0) {
    where.researchCategory = { in: filters.categories };
  }

  return where;
}

function sortProducts(
  products: ProductCardData[],
  sort: SortOption = "featured"
): ProductCardData[] {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort(
        (a, b) => getLowestPrice(a.variants) - getLowestPrice(b.variants)
      );
    case "price-desc":
      return sorted.sort(
        (a, b) => getLowestPrice(b.variants) - getLowestPrice(a.variants)
      );
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "newest":
      return sorted;
    case "featured":
    default:
      return sorted;
  }
}

function applyPostFilters(
  products: ProductCardData[],
  filters: ProductQueryFilters
): ProductCardData[] {
  let result = products;

  if (filters.priceMin != null) {
    result = result.filter((p) => getLowestPrice(p.variants) >= filters.priceMin!);
  }

  if (filters.priceMax != null) {
    result = result.filter((p) => getLowestPrice(p.variants) <= filters.priceMax!);
  }

  if (filters.availability === "in-stock") {
    result = result.filter((p) => p.variants.some((v) => v.inStock));
  } else if (filters.availability === "out-of-stock") {
    result = result.filter((p) => !p.variants.some((v) => v.inStock));
  }

  if (filters.coaOnly) {
    result = result.filter((p) => p.hasCoa);
  }

  return result;
}

function filterFallbackProducts(filters: ProductQueryFilters): ProductCardData[] {
  let result = [...FALLBACK_PRODUCTS];
  if (filters.filter === "featured") result = result.filter((p) => p.featured);
  if (filters.filter === "new") result = result.filter((p) => p.isNew);
  if (filters.q?.trim()) {
    const q = filters.q.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.researchCategory?.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q)
    );
  }
  result = applyPostFilters(result, filters);
  return sortProducts(result, filters.sort ?? "featured");
}

export async function getProducts(
  filters: ProductQueryFilters = {}
): Promise<ProductCardData[]> {
  try {
    const sort = filters.sort ?? "featured";

    const orderBy: Prisma.ProductOrderByWithRelationInput[] =
      sort === "newest"
        ? [{ createdAt: "desc" }]
        : sort === "name-asc" || sort === "name-desc"
          ? [{ name: sort === "name-asc" ? "asc" : "desc" }]
          : [{ sortOrder: "asc" }, { featured: "desc" }, { name: "asc" }];

    const products = await db.product.findMany({
      where: buildWhereClause(filters),
      include: productCardInclude,
      orderBy,
    });

    const cardData = products.map(getProductCardData);
    const filtered = applyPostFilters(cardData, filters);

    if (sort === "price-asc" || sort === "price-desc") {
      return sortProducts(filtered, sort);
    }

    return filtered;
  } catch {
    return filterFallbackProducts(filters);
  }
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  return db.product.findFirst({
    where: { slug, published: true },
    include: productDetailInclude,
  });
}

export async function getFeaturedProducts(limit = 8): Promise<ProductCardData[]> {
  try {
    const products = await db.product.findMany({
      where: { published: true, featured: true },
      include: productCardInclude,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: limit,
    });
    return products.map(getProductCardData);
  } catch {
    return FALLBACK_PRODUCTS.filter((p) => p.featured).slice(0, limit);
  }
}

export async function getRelatedProducts(
  productId: string,
  researchCategory: string | null,
  limit = 4
): Promise<ProductCardData[]> {
  const products = await db.product.findMany({
    where: {
      published: true,
      id: { not: productId },
      ...(researchCategory ? { researchCategory } : {}),
    },
    include: productCardInclude,
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
    take: limit,
  });

  return products.map(getProductCardData);
}

export async function getResearchCategories(): Promise<string[]> {
  try {
    const results = await db.product.findMany({
      where: { published: true, researchCategory: { not: null } },
      select: { researchCategory: true },
      distinct: ["researchCategory"],
      orderBy: { researchCategory: "asc" },
    });
    return results.map((r) => r.researchCategory).filter((c): c is string => c !== null);
  } catch {
    return [...new Set(FALLBACK_PRODUCTS.map((p) => p.researchCategory).filter(Boolean) as string[])];
  }
}

export async function getProductPriceRange(): Promise<{ min: number; max: number }> {
  try {
    const variants = await db.productVariant.findMany({
      where: { product: { published: true } },
      select: { price: true },
    });
    if (variants.length === 0) return { min: 0, max: 0 };
    const prices = variants.map((v) => v.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  } catch {
    const prices = FALLBACK_PRODUCTS.flatMap((p) => p.variants.map((v) => v.price));
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }
}

export async function getProductFaqs() {
  return db.faqItem.findMany({
    where: {
      published: true,
      category: { in: ["PRODUCTS", "RESEARCH", "SHIPPING", "COA", "GENERAL"] },
    },
    orderBy: [{ sortOrder: "asc" }],
  });
}

export async function getSiteSetting(key: string): Promise<string | null> {
  try {
    const setting = await db.siteSetting.findUnique({ where: { key } });
    return setting?.value ?? FALLBACK_SETTINGS[key] ?? null;
  } catch {
    return FALLBACK_SETTINGS[key] ?? null;
  }
}
