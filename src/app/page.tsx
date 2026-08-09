import type { Metadata } from "next";
import { CtaBanner, MarqueeBanner } from "@/components/home/cta-banner";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { Newsletter } from "@/components/home/newsletter";
import { ResearchResources } from "@/components/home/research-resources";
import { StatsBar } from "@/components/home/stats-bar";
import { TrustStrip } from "@/components/home/trust-strip";
import {
  getFeaturedProducts,
  getProducts,
  getSiteSetting,
} from "@/lib/products";

export const metadata: Metadata = {
  title: "Research-Grade Peptides",
  description:
    "Premium research-grade peptides and laboratory supplies. Third-party tested, COA-documented, and fulfilled from within Canada.",
};

const TRUST_ICON_NAMES = ["MapPin", "FileCheck2", "Shield", "FlaskConical", "Headphones"];

async function getTrustItems() {
  const items = [];
  for (let i = 1; i <= 5; i++) {
    const [title, description] = await Promise.all([
      getSiteSetting(`trust_${i}_title`),
      getSiteSetting(`trust_${i}_desc`),
    ]);
    if (title) {
      items.push({
        iconName: TRUST_ICON_NAMES[i - 1] ?? "Shield",
        title,
        description: description ?? undefined,
      });
    }
  }
  return items;
}

export default async function HomePage() {
  const [trustItems, featuredProducts, mostRequested, recentlyAdded, essentials] =
    await Promise.all([
      getTrustItems(),
      getFeaturedProducts(8),
      getProducts({ sort: "featured" }).then((p) => p.slice(0, 4)),
      getProducts({ filter: "new", sort: "newest" }).then((p) => p.slice(0, 4)),
      getProducts({ category: "supplies" }).then((p) => p.slice(0, 4)),
    ]);

  return (
    <>
      <Hero />
      <MarqueeBanner />
      {trustItems.length > 0 ? <TrustStrip items={trustItems} /> : null}
      <StatsBar />
      {featuredProducts.length > 0 ? (
        <FeaturedProducts products={featuredProducts} />
      ) : null}
      {mostRequested.length > 0 ? (
        <FeaturedProducts
          title="Most Requested"
          subtitle="Popular compounds frequently ordered by Canadian research professionals."
          products={mostRequested}
          viewAllHref="/shop?filter=featured"
          variant="gradient"
        />
      ) : null}
      <CtaBanner />
      {recentlyAdded.length > 0 ? (
        <FeaturedProducts
          title="Recently Added"
          subtitle="The latest additions to our research catalog."
          products={recentlyAdded}
          viewAllHref="/shop?filter=new"
        />
      ) : null}
      {essentials.length > 0 ? (
        <FeaturedProducts
          title="Research Essentials"
          subtitle="Laboratory supplies for reconstitution, handling, and peptide research workflows."
          products={essentials}
          viewAllHref="/shop?category=supplies"
          variant="gradient"
        />
      ) : null}
      <ResearchResources />
      <Newsletter />
    </>
  );
}
