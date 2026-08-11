import type {
  AvailabilityFilter,
  ProductFilterState,
  SortOption,
} from "@/types/product";

export function parseShopSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): {
  filters: ProductFilterState;
  query: string;
  filter?: string;
  category?: string;
} {
  const get = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const categoriesParam = get("categories");
  const sort = get("sort") as SortOption | undefined;
  const availability = get("availability") as AvailabilityFilter | undefined;

  return {
    query: get("q") ?? "",
    filter: get("filter"),
    category: get("category"),
    filters: {
      categories: categoriesParam
        ? categoriesParam.split(",").filter(Boolean)
        : [],
      priceMin: get("priceMin") ? Number(get("priceMin")) : null,
      priceMax: get("priceMax") ? Number(get("priceMax")) : null,
      availability:
        availability &&
        ["all", "in-stock", "out-of-stock"].includes(availability)
          ? availability
          : "all",
      coaOnly: get("coaOnly") === "true",
      sort:
        sort &&
        [
          "featured",
          "price-asc",
          "price-desc",
          "name-asc",
          "name-desc",
          "newest",
        ].includes(sort)
          ? sort
          : "featured",
    },
  };
}
