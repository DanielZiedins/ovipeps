export interface CoaDocumentSummary {
  id: string;
  batchNumber: string;
  lotNumber: string | null;
  testingDate: string | null;
  testingProvider: string | null;
  purityResult: string | null;
  resultSummary: string | null;
  documentUrl: string | null;
  productName: string;
  productSlug: string;
}
