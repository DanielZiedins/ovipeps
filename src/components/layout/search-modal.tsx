"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FlaskConical, Loader2, Search, X } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  imageUrl?: string | null;
  price?: number | null;
  category?: string | null;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      if (res.ok) {
        const data = (await res.json()) as { results?: SearchResult[] };
        setResults(data.results ?? []);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setSearched(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleGlobalShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!isOpen) {
          // Parent handles open; this is for when modal is already managed externally
        }
      }
    };
    document.addEventListener("keydown", handleGlobalShortcut);
    return () => document.removeEventListener("keydown", handleGlobalShortcut);
  }, [isOpen]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => performSearch(value), 250);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[10vh]">
      <div
        className="absolute inset-0 bg-navy-deep/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Search peptides, supplies, and more..."
            className="flex-1 bg-transparent py-4 text-base text-foreground outline-none placeholder:text-muted-foreground"
            autoComplete="off"
          />
          {loading && (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {!searched && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              <FlaskConical className="mx-auto mb-2 h-8 w-8 text-navy/30" />
              Start typing to search our catalog
            </div>
          )}

          {searched && !loading && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {results.length > 0 && (
            <ul className="divide-y divide-border">
              {results.map((result) => (
                <li key={result.id}>
                  <Link
                    href={`/shop/${result.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-secondary"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-secondary">
                      {result.imageUrl ? (
                        <Image
                          src={result.imageUrl}
                          alt={result.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <FlaskConical className="h-5 w-5 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {result.name}
                      </p>
                      {result.shortDescription && (
                        <p className="truncate text-xs text-muted-foreground">
                          {result.shortDescription}
                        </p>
                      )}
                    </div>
                    {result.price != null && (
                      <span className="shrink-0 text-sm font-semibold text-navy">
                        {formatCurrency(result.price)}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
          <span>
            Press{" "}
            <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[10px]">
              Esc
            </kbd>{" "}
            to close
          </span>
          <Link
            href={`/shop${query ? `?q=${encodeURIComponent(query)}` : ""}`}
            onClick={onClose}
            className={cn(
              "font-medium text-accent transition-colors hover:text-navy",
              !query && "pointer-events-none opacity-50"
            )}
          >
            View all results
          </Link>
        </div>
      </div>
    </div>
  );
}
