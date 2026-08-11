import Link from "next/link";
import {
  Calendar,
  Download,
  ExternalLink,
  FileCheck2,
  FlaskConical,
  Hash,
  Microscope,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { CoaDocumentSummary } from "@/types/coa";

interface CoaCardProps {
  document: CoaDocumentSummary;
}

export function CoaCard({ document }: CoaCardProps) {
  const hasDocument = Boolean(document.documentUrl);
  const testingDate = document.testingDate
    ? formatDate(document.testingDate)
    : "Pending";

  return (
    <Card className="group overflow-hidden border-sky/10 transition-all duration-300 hover:-translate-y-1 hover:border-sky/30 hover:shadow-xl hover:shadow-sky/10">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/shop/${document.productSlug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-navy"
            >
              <FlaskConical className="size-4 shrink-0" />
              <span className="truncate">{document.productName}</span>
            </Link>
            <CardTitle className="mt-2 text-lg">
              Batch {document.batchNumber}
            </CardTitle>
          </div>
          <Badge variant="coa">COA</Badge>
        </div>

        {document.resultSummary ? (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {document.resultSummary}
          </p>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <dl className="grid gap-3 text-sm">
          <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/40 px-3 py-2">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Hash className="size-3.5" />
              Lot number
            </dt>
            <dd className="font-mono font-medium text-foreground">
              {document.lotNumber ?? "—"}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/40 px-3 py-2">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-3.5" />
              Testing date
            </dt>
            <dd className="font-medium text-foreground">{testingDate}</dd>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/40 px-3 py-2">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Microscope className="size-3.5" />
              Laboratory
            </dt>
            <dd className="text-right font-medium text-foreground">
              {document.testingProvider ?? "Independent lab"}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-success/20 bg-success/5 px-3 py-2">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <FileCheck2 className="size-3.5 text-success" />
              Purity result
            </dt>
            <dd className="font-semibold text-success">
              {document.purityResult ?? "See document"}
            </dd>
          </div>
        </dl>
      </CardContent>

      <CardFooter className="gap-3">
        {hasDocument ? (
          <>
            <a
              href={document.documentUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-navy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ExternalLink className="size-4" />
              View COA
            </a>
            <a
              href={document.documentUrl!}
              download
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted/60 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Download className="size-4" />
              Download
            </a>
          </>
        ) : (
          <Link
            href="/contact"
            className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted/60 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <FileCheck2 className="size-4" />
            Request documentation
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
