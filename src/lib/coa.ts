import { db } from "@/lib/db";
import type { CoaDocumentSummary } from "@/types/coa";

type CoaWithProduct = {
  id: string;
  batchNumber: string;
  lotNumber: string | null;
  testingDate: Date | null;
  testingProvider: string | null;
  purityResult: string | null;
  resultSummary: string | null;
  documentUrl: string | null;
  product: { name: string; slug: string };
};

function mapCoaDocument(doc: CoaWithProduct): CoaDocumentSummary {
  return {
    id: doc.id,
    batchNumber: doc.batchNumber,
    lotNumber: doc.lotNumber,
    testingDate: doc.testingDate?.toISOString() ?? null,
    testingProvider: doc.testingProvider,
    purityResult: doc.purityResult,
    resultSummary: doc.resultSummary,
    documentUrl: doc.documentUrl,
    productName: doc.product.name,
    productSlug: doc.product.slug,
  };
}

export async function getPublishedCoaDocuments(): Promise<CoaDocumentSummary[]> {
  try {
    const documents = await db.coaDocument.findMany({
      where: { published: true },
      include: { product: { select: { name: true, slug: true } } },
      orderBy: [{ testingDate: "desc" }, { createdAt: "desc" }],
    });

    return documents.map(mapCoaDocument);
  } catch {
    return [];
  }
}

export async function searchPublishedCoaDocuments(
  query: string
): Promise<CoaDocumentSummary[]> {
  const trimmed = query.trim();
  if (!trimmed) return getPublishedCoaDocuments();

  try {
    const documents = await db.coaDocument.findMany({
      where: {
        published: true,
        OR: [
          { batchNumber: { contains: trimmed } },
          { lotNumber: { contains: trimmed } },
          { product: { name: { contains: trimmed } } },
          { testingProvider: { contains: trimmed } },
        ],
      },
      include: { product: { select: { name: true, slug: true } } },
      orderBy: [{ testingDate: "desc" }, { createdAt: "desc" }],
    });

    return documents.map(mapCoaDocument);
  } catch {
    return [];
  }
}
