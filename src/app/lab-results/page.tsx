import type { Metadata } from "next";
import { FileCheck2 } from "lucide-react";
import { CoaSearch } from "@/components/coa/coa-search";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getPublishedCoaDocuments } from "@/lib/coa";

export const metadata: Metadata = {
  title: "COA Library | OVIPeps",
  description:
    "Browse certificates of analysis for OVIPeps research peptides. Search by product, batch number, or lot number for third-party purity documentation.",
  openGraph: {
    title: "COA Library | OVIPeps",
    description:
      "Full transparency on batch testing — certificates of analysis for every published lot.",
  },
};

export default async function LabResultsPage() {
  const documents = await getPublishedCoaDocuments();

  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-deep via-navy to-teal/70" />
          <div className="absolute inset-0 molecular-bg opacity-50" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-teal-light backdrop-blur-sm">
                <FileCheck2 className="size-3.5" />
                Quality Documentation
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Certificates of Analysis
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
                Independent third-party testing documentation for published
                product batches. Search our COA library by product name, batch
                number, or lot identifier.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <CoaSearch documents={documents} mode="library" />
        </section>

        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-sm leading-relaxed text-muted-foreground">
              COA documents are provided for laboratory research verification
              purposes. Results reflect specific tested batches and lots.
              OVIPeps products are not intended for human or veterinary use.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
