"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileSearch, Search, X } from "lucide-react";
import { CoaCard } from "@/components/coa/coa-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CoaDocumentSummary } from "@/types/coa";

interface CoaSearchProps {
  documents: CoaDocumentSummary[];
  initialQuery?: string;
  mode?: "library" | "batch-lot";
  showDedicatedSearchLink?: boolean;
}

function matchesQuery(doc: CoaDocumentSummary, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return [
    doc.productName,
    doc.batchNumber,
    doc.lotNumber ?? "",
    doc.testingProvider ?? "",
    doc.purityResult ?? "",
  ].some((field) => field.toLowerCase().includes(normalized));
}

export function CoaSearch({
  documents,
  initialQuery = "",
  mode = "library",
  showDedicatedSearchLink = true,
}: CoaSearchProps) {
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(
    () => documents.filter((doc) => matchesQuery(doc, query)),
    [documents, query]
  );

  const placeholder =
    mode === "batch-lot"
      ? "Search by batch number or lot number…"
      : "Search by product, batch, or lot…";

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <Input
              label="Search COA library"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              hint={
                mode === "batch-lot"
                  ? "Enter a batch or lot identifier from your vial label"
                  : "Filter by product name, batch number, or lot number"
              }
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {query ? (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setQuery("")}
              >
                <X className="size-4" />
                Clear
              </Button>
            ) : null}
            {showDedicatedSearchLink && mode === "library" ? (
              <Link
                href="/lab-results/search"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-secondary px-4 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <FileSearch className="size-4" />
                Batch / lot search
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>
          <Search className="mr-1.5 inline size-4" />
          Showing {filtered.length} of {documents.length} published results
        </p>
        {query ? (
          <p className="font-mono text-xs text-foreground">
            Query: {query}
          </p>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
          <FileSearch className="mx-auto size-10 text-muted-foreground/60" />
          <h3 className="mt-4 text-lg font-semibold text-navy-deep">
            No matching COAs found
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {mode === "batch-lot"
              ? "Verify the batch or lot number from your vial label and try again."
              : "Try a different product name, batch number, or lot identifier."}
          </p>
          {query ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-6"
              onClick={() => setQuery("")}
            >
              Clear search
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((document) => (
            <CoaCard key={document.id} document={document} />
          ))}
        </div>
      )}
    </div>
  );
}
