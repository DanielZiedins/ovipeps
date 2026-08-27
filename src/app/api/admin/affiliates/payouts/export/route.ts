import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { reconcileAllAffiliateMinimums } from "@/lib/affiliate";
import { AFFILIATE_CUSTOMER_DISCOUNT_RATE } from "@/lib/affiliate-program";

function csvCell(value: string | number | null | undefined) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await reconcileAllAffiliateMinimums();
  const [performance, payouts] = await Promise.all([
    db.affiliateMonthlyPerformance.findMany({
      orderBy: [
        { periodYear: "asc" },
        { periodMonth: "asc" },
      ],
      include: {
        affiliate: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        },
      },
    }),
    db.affiliatePayout.findMany({
      include: { items: true },
    }),
  ]);

  const payoutItems = new Map(
    payouts.flatMap((payout) =>
      payout.items.map((item) => [
        `${payout.periodYear}-${payout.periodMonth}-${item.affiliateId}`,
        item,
      ] as const)
    )
  );

  const header = [
    "Month",
    "Year",
    "Affiliate",
    "Email",
    "Affiliate Code",
    "Qualifying Sales Before Shipping (CAD)",
    "Customer Discount (%)",
    "Commission Rate (%)",
    "Commission Owed (CAD)",
    "$300 Minimum Met",
    "Missed Minimum Months",
    "Account Status",
    "Amount Sent (CAD)",
    "Payout Status",
    "Date Paid",
    "Payment Method",
    "Payment Reference",
    "Sent By",
  ];
  const rows = performance.map((record) => {
    const item = payoutItems.get(
      `${record.periodYear}-${record.periodMonth}-${record.affiliateId}`
    );
    return [
      new Intl.DateTimeFormat("en-CA", { month: "long" }).format(
        new Date(record.periodYear, record.periodMonth - 1, 1)
      ),
      record.periodYear,
      [record.affiliate.user.firstName, record.affiliate.user.lastName]
        .filter(Boolean)
        .join(" "),
      record.affiliate.user.email,
      record.affiliate.code.startsWith("PENDING-") ? "" : record.affiliate.code,
      record.qualifyingSales.toFixed(2),
      AFFILIATE_CUSTOMER_DISCOUNT_RATE.toFixed(2),
      record.commissionRate.toFixed(2),
      record.commissionOwed.toFixed(2),
      record.minimumMet ? "Yes" : "No",
      record.missedMinimumCount,
      record.affiliate.status === "SUSPENDED"
        ? "FROZEN"
        : record.affiliate.status === "INACTIVE"
          ? "TERMINATED"
          : record.affiliate.status,
      item?.paymentAmount?.toFixed(2) ?? "",
      item?.status ?? "NO PAYOUT",
      item?.paidAt?.toISOString().slice(0, 10) ?? "",
      item?.paymentMethod === "E_TRANSFER"
        ? "e-Transfer"
        : item?.paymentMethod === "CRYPTO"
          ? "Crypto"
          : "",
      item?.paymentReference ?? "",
      item?.paidBy ?? "",
    ];
  });

  const csv = [header, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ovipeps-affiliate-ledger-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
