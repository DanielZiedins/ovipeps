import { db } from "@/lib/db";
import type { AffiliateDashboardData } from "@/lib/affiliate-types";
import type { CommissionStatus } from "@/generated/prisma/enums";

function groupByDay<T extends { createdAt: Date }>(
  items: T[],
  valueFn: (item: T) => number = () => 1
) {
  const map = new Map<string, number>();

  for (const item of items) {
    const key = item.createdAt.toISOString().slice(0, 10);
    map.set(key, (map.get(key) ?? 0) + valueFn(item));
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));
}

export async function getAffiliateDashboardData(
  userId: string
): Promise<AffiliateDashboardData | null> {
  const account = await db.affiliateAccount.findUnique({
    where: { userId },
    include: {
      clicks: {
        orderBy: { createdAt: "desc" },
        take: 100,
      },
      attributions: {
        orderBy: { createdAt: "desc" },
        take: 100,
      },
      commissions: {
        orderBy: { createdAt: "desc" },
        take: 100,
      },
      payouts: {
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { payout: true },
      },
    },
  });

  if (!account) return null;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [commissionTotals, recentClicks, recentCommissions] = await Promise.all([
    db.affiliateCommission.groupBy({
      by: ["status"],
      where: { affiliateId: account.id },
      _sum: { commissionAmount: true },
    }),
    db.affiliateClick.findMany({
      where: { affiliateId: account.id, createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    }),
    db.affiliateCommission.findMany({
      where: { affiliateId: account.id, createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, commissionAmount: true },
    }),
  ]);

  const commissionByStatus = Object.fromEntries(
    commissionTotals.map((row) => [row.status, row._sum.commissionAmount ?? 0])
  ) as Partial<Record<CommissionStatus, number>>;

  const conversionRate =
    account.totalClicks > 0
      ? Math.round((account.totalOrders / account.totalClicks) * 1000) / 10
      : 0;

  return {
    account: {
      id: account.id,
      code: account.code,
      commissionRate: account.commissionRate,
      status: account.status,
      totalClicks: account.totalClicks,
      totalOrders: account.totalOrders,
      totalEarnings: account.totalEarnings,
      paidEarnings: account.paidEarnings,
      pendingEarnings: account.pendingEarnings,
    },
    conversionRate,
    commissionByStatus,
    clickChart: groupByDay(recentClicks),
    commissionChart: groupByDay(recentCommissions, (c) => c.commissionAmount),
    clicks: account.clicks.map((click) => ({
      id: click.id,
      referrer: click.referrer,
      landingPage: click.landingPage,
      createdAt: click.createdAt.toISOString(),
    })),
    attributions: account.attributions.map((row) => ({
      id: row.id,
      code: row.code,
      converted: row.converted,
      expiresAt: row.expiresAt.toISOString(),
      createdAt: row.createdAt.toISOString(),
    })),
    commissions: account.commissions.map((row) => ({
      id: row.id,
      orderNumber: row.orderNumber,
      orderAmount: row.orderAmount,
      commissionAmount: row.commissionAmount,
      status: row.status,
      flagged: row.flagged,
      flagReason: row.flagReason,
      createdAt: row.createdAt.toISOString(),
    })),
    payouts: account.payouts.map((row) => ({
      id: row.id,
      periodMonth: row.payout.periodMonth,
      periodYear: row.payout.periodYear,
      grossSales: row.grossSales,
      commissionOwed: row.commissionOwed,
      status: row.status,
      paidAt: row.paidAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
    })),
  };
}
