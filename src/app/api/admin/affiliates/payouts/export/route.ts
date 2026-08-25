import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

function csvCell(value: string | number | null | undefined) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payouts = await db.affiliatePayout.findMany({
    orderBy: [{ periodYear: "asc" }, { periodMonth: "asc" }],
    include: {
      items: {
        orderBy: { createdAt: "asc" },
        include: {
          affiliate: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
        },
      },
    },
  });

  const header = ["Month", "Year", "Affiliate", "Email", "Affiliate Code", "Qualifying Sales (CAD)", "Commission Rate (%)", "Commission Owed (CAD)", "Amount Sent (CAD)", "Status", "Date Paid", "Payment Method", "Payment Reference", "Sent By"];
  const rows = payouts.flatMap((payout) => payout.items.map((item) => [
    new Intl.DateTimeFormat("en-CA", { month: "long" }).format(new Date(payout.periodYear, payout.periodMonth - 1, 1)),
    payout.periodYear,
    [item.affiliate.user.firstName, item.affiliate.user.lastName].filter(Boolean).join(" "),
    item.affiliate.user.email,
    item.affiliate.code.startsWith("PENDING-") ? "" : item.affiliate.code,
    item.grossSales.toFixed(2),
    item.affiliate.commissionRate.toFixed(2),
    item.commissionOwed.toFixed(2),
    item.paymentAmount?.toFixed(2) ?? "",
    item.status,
    item.paidAt?.toISOString().slice(0, 10) ?? "",
    item.paymentMethod === "E_TRANSFER" ? "e-Transfer" : item.paymentMethod === "CRYPTO" ? "Crypto" : "",
    item.paymentReference ?? "",
    item.paidBy ?? "",
  ]));

  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ovipeps-affiliate-ledger-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
