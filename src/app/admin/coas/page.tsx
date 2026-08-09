import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminCoasPage() {
  const coas = await db.coaDocument.findMany({
    orderBy: [{ testingDate: "desc" }, { createdAt: "desc" }],
    include: {
      product: { select: { name: true, slug: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy-deep">
          COA Documents
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage certificates of analysis for product batches.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Batch</th>
              <th className="px-4 py-3 font-medium">Provider</th>
              <th className="px-4 py-3 font-medium">Purity</th>
              <th className="px-4 py-3 font-medium">Test Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {coas.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No COA documents found.
                </td>
              </tr>
            ) : (
              coas.map((coa) => (
                <tr
                  key={coa.id}
                  className="border-b border-border/60 hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{coa.product.name}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {coa.batchNumber}
                    {coa.lotNumber && (
                      <span className="text-muted-foreground">
                        / {coa.lotNumber}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {coa.testingProvider ?? "—"}
                  </td>
                  <td className="px-4 py-3">{coa.purityResult ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {coa.testingDate ? formatDate(coa.testingDate) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {coa.published ? (
                      <Badge variant="success">Published</Badge>
                    ) : (
                      <Badge>Draft</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {coa.documentUrl ? (
                      <a
                        href={coa.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Document
                      </a>
                    ) : (
                      <Link
                        href={`/shop/${coa.product.slug}`}
                        className="text-sm text-muted-foreground hover:underline"
                        target="_blank"
                      >
                        Product
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
