import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";
import { getPublishedArticles } from "@/lib/content-data";
import { getProducts } from "@/lib/products";

const STATIC_ROUTES = [
  "",
  "/shop",
  "/about",
  "/contact",
  "/research",
  "/research/faq",
  "/lab-results",
  "/calculator",
  "/shipping",
  "/returns",
  "/payment-instructions",
  "/privacy",
  "/terms",
  "/research-disclaimer",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles] = await Promise.all([
    getProducts(),
    getPublishedArticles(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/shop/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/research/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries, ...articleEntries];
}
