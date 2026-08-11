import { NextResponse } from "next/server";
import { searchPublishedCoaDocuments } from "@/lib/coa";
import {
  getPublishedArticles,
  getPublishedFaqs,
} from "@/lib/content-data";
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

  const normalizedQuery = q.toLowerCase();
  const [products, allArticles, allFaqs, coas] = await Promise.all([
    getProducts({ q }),
    getPublishedArticles(),
    getPublishedFaqs(),
    searchPublishedCoaDocuments(q),
  ]);
  const articles = allArticles
    .filter((article) =>
      [article.title, article.excerpt, article.content].some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      )
    )
    .slice(0, 5);
  const faqs = allFaqs
    .filter(
      (faq) =>
        faq.question.toLowerCase().includes(normalizedQuery) ||
        faq.answer.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, 5);

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

  const articleResults = articles.map((article) => ({
    id: article.id,
    type: "article" as const,
    name: article.title,
    slug: article.slug,
    shortDescription: article.excerpt,
    category: article.category,
    href: `/research/${article.slug}`,
  }));

  const faqResults = faqs.map((faq, index) => ({
    id: `faq-${index}-${faq.category}`,
    type: "faq" as const,
    name: faq.question,
    slug: `faq-${index}`,
    shortDescription: faq.answer.slice(0, 120) + (faq.answer.length > 120 ? "…" : ""),
    category: faq.category,
    href: "/research/faq",
  }));

  const coaResults = coas.slice(0, 5).map((coa) => ({
    id: coa.id,
    type: "coa" as const,
    name: `${coa.productName} — ${coa.batchNumber}`,
    slug: coa.id,
    shortDescription: coa.resultSummary ?? coa.purityResult,
    category: "COA",
    href: `/lab-results?batch=${encodeURIComponent(coa.batchNumber)}`,
  }));

  return NextResponse.json({
    results: productResults,
    products: productResults,
    articles: articleResults,
    faqs: faqResults,
    coas: coaResults,
  });
}
