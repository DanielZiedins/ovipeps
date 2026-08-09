"use client";

import Link from "next/link";
import { FlaskConical, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <FlaskConical className="h-10 w-10 text-primary" aria-hidden />
      </div>
      <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
        404
      </p>
      <h1 className="mb-3 text-3xl font-semibold tracking-tight text-navy-deep md:text-4xl">
        Page not found
      </h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        Explore our research catalog or return to the homepage.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky to-cyan px-6 py-3 text-sm font-bold text-white shadow-md shadow-sky/25 transition-all hover:scale-105 hover:shadow-lg"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-sky/30 px-6 py-3 text-sm font-bold text-foreground transition-all hover:border-sky/50 hover:bg-sky/5"
        >
          <Search className="h-4 w-4" />
          Browse Products
        </Link>
      </div>
    </div>
  );
}
