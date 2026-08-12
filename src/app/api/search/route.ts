import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";
import { getLowestPrice } from "@/types/product";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({
      results: [],
      products: [],
      articles: [],
      faqs: [],
      coas: [],
    });
  }

  const products = await getProducts({ q });

  const productResults = products.slice(0, 8).map((product) => {
    return {
      id: product.id,
      type: "product" as const,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      imageUrl: product.imageUrl,
      price: getLowestPrice(product.variants),
      category: product.researchCategory,
      href: `/shop/${product.slug}`,
    };
  });

  // Research Hub / Lab Results stay live for SEO but are omitted from site search UI.
  return NextResponse.json({
    results: productResults,
    products: productResults,
    articles: [],
    faqs: [],
    coas: [],
  });
}
