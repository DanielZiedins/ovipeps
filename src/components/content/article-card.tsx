import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ARTICLE_CATEGORY_LABELS } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import type { ArticleCategory } from "@/generated/prisma/enums";

export interface ArticleCardData {
  title: string;
  slug: string;
  excerpt: string | null;
  category: ArticleCategory;
  author: string | null;
  readingTime: number | null;
  publishedAt: Date | null;
}

interface ArticleCardProps {
  article: ArticleCardData;
  featured?: boolean;
}

export function ArticleCard({ article, featured }: ArticleCardProps) {
  return (
    <Link
      href={`/research/${article.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-sky/10 bg-gradient-to-br from-white via-white to-sky/5 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-sky/30 hover:shadow-xl hover:shadow-sky/10"
    >
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-sky via-cyan to-teal-light transition-transform duration-300 group-hover:scale-x-100" />
      <div className="mb-3 flex items-center justify-between gap-2">
        <Badge variant="research">
          {ARTICLE_CATEGORY_LABELS[article.category]}
        </Badge>
        {featured ? (
          <span className="text-xs font-medium uppercase tracking-wide text-accent">
            Featured
          </span>
        ) : null}
      </div>

      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky/10 to-cyan/10 text-sky transition-all group-hover:from-sky group-hover:to-cyan group-hover:text-white group-hover:shadow-lg group-hover:shadow-sky/20">
        <BookOpen className="h-5 w-5" />
      </div>

      <h3 className="text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-navy">
        {article.title}
      </h3>

      {article.excerpt ? (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {article.excerpt}
        </p>
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {article.author ? <span>{article.author}</span> : null}
          {article.publishedAt ? (
            <span>{formatDate(article.publishedAt)}</span>
          ) : null}
          {article.readingTime ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden />
              {article.readingTime} min read
            </span>
          ) : null}
        </div>
        <span className="inline-flex items-center gap-1 font-medium text-accent transition-colors group-hover:text-navy">
          Read
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
