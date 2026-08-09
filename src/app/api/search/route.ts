import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getProductCardData } from "@/lib/products";
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

  const [products, articles, faqs, coas] = await Promise.all([
    db.product.findMany({
      where: {
        published: true,
        OR: [
          { name: { contains: q } },
          { shortDescription: { contains: q } },
          { researchCategory: { contains: q } },
          { description: { contains: q } },
        ],
      },
      include: {
        variants: { orderBy: { sortOrder: "asc" } },
        coaDocuments: { where: { published: true }, select: { id: true } },
      },
      take: 8,
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    }),
    db.article.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q } },
          { excerpt: { contains: q } },
          { content: { contains: q } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
      },
      take: 5,
      orderBy: { publishedAt: "desc" },
    }),
    db.faqItem.findMany({
      where: {
        published: true,
        OR: [{ question: { contains: q } }, { answer: { contains: q } }],
      },
      select: {
        id: true,
        question: true,
        answer: true,
        category: true,
      },
      take: 5,
      orderBy: { sortOrder: "asc" },
    }),
    db.coaDocument.findMany({
      where: {
        published: true,
        OR: [
          { batchNumber: { contains: q } },
          { lotNumber: { contains: q } },
          { resultSummary: { contains: q } },
          { testingProvider: { contains: q } },
          { product: { name: { contains: q } } },
        ],
      },
      include: {
        product: { select: { name: true, slug: true } },
      },
      take: 5,
      orderBy: { testingDate: "desc" },
    }),
  ]);

  const productResults = products.map((product) => {
    const card = getProductCardData(product);
    return {
      id: card.id,
      type: "product" as const,
      name: card.name,
      slug: card.slug,
      shortDescription: card.shortDescription,
      imageUrl: card.imageUrl,
      price: getLowestPrice(card.variants),
      category: card.researchCategory,
      href: `/shop/${card.slug}`,
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

  const faqResults = faqs.map((faq) => ({
    id: faq.id,
    type: "faq" as const,
    name: faq.question,
    slug: faq.id,
    shortDescription: faq.answer.slice(0, 120) + (faq.answer.length > 120 ? "…" : ""),
    category: faq.category,
    href: "/research/faq",
  }));

  const coaResults = coas.map((coa) => ({
    id: coa.id,
    type: "coa" as const,
    name: `${coa.product.name} — ${coa.batchNumber}`,
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
