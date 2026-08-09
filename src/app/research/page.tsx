import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Calculator,
  FileCheck,
  HelpCircle,
} from "lucide-react";
import { ArticleCard } from "@/components/content/article-card";
import { PageHero } from "@/components/content/page-hero";
import { db } from "@/lib/db";
import {
  ARTICLE_CATEGORIES,
  ARTICLE_CATEGORY_DESCRIPTIONS,
  ARTICLE_CATEGORY_LABELS,
} from "@/lib/content";
import type { ArticleCategory } from "@/generated/prisma/enums";

export const metadata: Metadata = {
  title: "Research Hub",
  description:
    "Educational articles, peptide guides, COA resources, and laboratory protocols from OVIPeps — Canada's research-grade peptide supplier.",
};

export default async function ResearchPage() {
  const articles = await db.article.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      title: true,
      slug: true,
      excerpt: true,
      category: true,
      author: true,
      readingTime: true,
      publishedAt: true,
    },
  });

  const featured = articles.slice(0, 3);
  const articlesByCategory = ARTICLE_CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = articles.filter((article) => article.category === category);
      return acc;
    },
    {} as Record<ArticleCategory, typeof articles>
  );

  const quickLinks = [
    {
      title: "Lab Results",
      description: "Search batch documentation and COAs",
      href: "/lab-results",
      icon: FileCheck,
    },
    {
      title: "Calculator",
      description: "Reconstitution volume and concentration tool",
      href: "/calculator",
      icon: Calculator,
    },
    {
      title: "FAQ",
      description: "Answers to common research and order questions",
      href: "/research/faq",
      icon: HelpCircle,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Knowledge Base"
        title="Research Hub"
        description="Original educational resources for qualified laboratory researchers — peptide fundamentals, documentation guidance, and Canadian fulfillment context."
      />

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
        <section className="mb-16">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal">
                Featured
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-navy-deep">
                Start here
              </h2>
            </div>
            <Link
              href="/research/faq"
              className="text-sm font-medium text-accent hover:text-navy"
            >
              Browse FAQ →
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((article) => (
                <ArticleCard key={article.slug} article={article} featured />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center text-sm text-muted-foreground">
              Articles are being prepared. Check back soon for new research guides.
            </p>
          )}
        </section>

        <section className="mb-16">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal">
              Browse by topic
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-navy-deep">
              Article categories
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ARTICLE_CATEGORIES.map((category) => {
              const count = articlesByCategory[category].length;
              return (
                <a
                  key={category}
                  href={`#category-${category.toLowerCase()}`}
                  className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/30 hover:shadow-md hover:shadow-navy/5"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-navy/5 text-navy transition-colors group-hover:bg-navy group-hover:text-white">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-navy">
                    {ARTICLE_CATEGORY_LABELS[category]}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {ARTICLE_CATEGORY_DESCRIPTIONS[category]}
                  </p>
                  <p className="mt-3 text-xs font-medium text-accent">
                    {count} {count === 1 ? "article" : "articles"}
                  </p>
                </a>
              );
            })}
          </div>
        </section>

        <section className="mb-16 grid gap-4 md:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-start gap-4 rounded-xl border border-border bg-muted/30 p-5 transition-colors hover:border-accent/30 hover:bg-card"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
                <link.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-navy">
                  {link.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {link.description}
                </p>
              </div>
            </Link>
          ))}
        </section>

        {ARTICLE_CATEGORIES.map((category) => {
          const categoryArticles = articlesByCategory[category];
          if (!categoryArticles.length) return null;

          return (
            <section
              key={category}
              id={`category-${category.toLowerCase()}`}
              className="mb-14 scroll-mt-28 border-t border-border pt-12"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-navy-deep">
                  {ARTICLE_CATEGORY_LABELS[category]}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {ARTICLE_CATEGORY_DESCRIPTIONS[category]}
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categoryArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
