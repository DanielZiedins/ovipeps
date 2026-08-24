import { db } from "@/lib/db";
import { emailTemplates, sendEmail } from "@/lib/emails";

const PAID_STATUSES = [
  "PAYMENT_RECEIVED",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
] as const;

export async function getDashboardMetrics() {
  const paidOrdersWhere = { status: { in: [...PAID_STATUSES] } };

  const [
    revenueAgg,
    totalOrders,
    awaitingPayment,
    paidOrdersCount,
    topProducts,
    affiliateOrderAgg,
    outstandingCommissionAgg,
  ] = await Promise.all([
    db.order.aggregate({
      where: paidOrdersWhere,
      _sum: { total: true },
    }),
    db.order.count(),
    db.order.count({ where: { status: "AWAITING_PAYMENT" } }),
    db.order.count({ where: paidOrdersWhere }),
    db.orderItem.groupBy({
      by: ["productId", "productName"],
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { totalPrice: "desc" } },
      take: 5,
    }),
    db.order.aggregate({
      where: { affiliateId: { not: null }, ...paidOrdersWhere },
      _sum: { total: true },
    }),
    db.affiliateCommission.aggregate({
      where: { status: { in: ["PENDING", "APPROVED", "LOCKED"] } },
      _sum: { commissionAmount: true },
    }),
  ]);

  const revenue = revenueAgg._sum.total ?? 0;
  const affiliateRevenue = affiliateOrderAgg._sum.total ?? 0;
  const outstandingCommission = outstandingCommissionAgg._sum.commissionAmount ?? 0;
  const aov = paidOrdersCount > 0 ? revenue / paidOrdersCount : 0;

  return {
    revenue,
    totalOrders,
    awaitingPayment,
    paidOrders: paidOrdersCount,
    aov,
    topProducts: topProducts.map((p) => ({
      productId: p.productId,
      productName: p.productName,
      quantity: p._sum.quantity ?? 0,
      revenue: p._sum.totalPrice ?? 0,
    })),
    affiliateRevenue,
    outstandingCommission,
  };
}

function generateAffiliateCode(name: string) {
  const base = name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${base || "AFF"}${suffix}`;
}

export async function approveAffiliateApplication(
  applicationId: string,
  reviewedBy: string
) {
  const application = await db.affiliateApplication.findUnique({
    where: { id: applicationId },
    include: { user: true },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.status !== "PENDING") {
    throw new Error("Application has already been reviewed");
  }

  let userId = application.userId;

  if (!userId) {
    const existingUser = await db.user.findUnique({
      where: { email: application.email.trim().toLowerCase() },
    });
    userId = existingUser?.id ?? null;
  }

  if (!userId) {
    throw new Error(
      "No user account found for this email. Applicant must register first."
    );
  }

  const existingAccount = await db.affiliateAccount.findUnique({
    where: { userId },
  });

  if (existingAccount) {
    throw new Error("User already has an affiliate account");
  }

  const defaultCommission = await db.siteSetting.findUnique({
    where: { key: "affiliate_default_commission" },
  });

  let code = generateAffiliateCode(application.name);
  let attempts = 0;
  while (attempts < 5) {
    const collision = await db.affiliateAccount.findUnique({ where: { code } });
    if (!collision) break;
    code = generateAffiliateCode(application.name);
    attempts++;
  }

  const commissionRate = Number(defaultCommission?.value ?? 15);

  await db.$transaction(async (tx) => {
    await tx.affiliateApplication.update({
      where: { id: applicationId },
      data: {
        status: "APPROVED",
        reviewedAt: new Date(),
        reviewedBy,
        userId,
      },
    });

    await tx.user.update({
      where: { id: userId! },
      data: { role: "AFFILIATE" },
    });

    await tx.affiliateAccount.create({
      data: {
        userId: userId!,
        code,
        commissionRate,
        status: "ACTIVE",
      },
    });
  });

  try {
    await sendEmail(
      application.email,
      emailTemplates.affiliateApproved({
        name: application.name,
        code,
        commissionRate,
      })
    );
  } catch (error) {
    console.error("Affiliate approval email failed", error);
  }

  return { code };
}

export async function rejectAffiliateApplication(
  applicationId: string,
  reviewedBy: string,
  reviewNotes?: string
) {
  const application = await db.affiliateApplication.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.status !== "PENDING") {
    throw new Error("Application has already been reviewed");
  }

  return db.affiliateApplication.update({
    where: { id: applicationId },
    data: {
      status: "REJECTED",
      reviewedAt: new Date(),
      reviewedBy,
      reviewNotes: reviewNotes?.trim() || undefined,
    },
  });
}

export async function generateMonthlyPayout(year: number, month: number) {
  if (month < 1 || month > 12) {
    throw new Error("Invalid month");
  }

  const existing = await db.affiliatePayout.findUnique({
    where: {
      periodYear_periodMonth: { periodYear: year, periodMonth: month },
    },
  });

  if (existing) {
    throw new Error(`Payout for ${month}/${year} already exists`);
  }

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);

  const commissions = await db.affiliateCommission.findMany({
    where: {
      status: { in: ["PENDING", "APPROVED", "LOCKED"] },
      payoutItem: null,
      createdAt: { gte: start, lte: end },
    },
    include: { affiliate: true },
  });

  if (commissions.length === 0) {
    throw new Error("No eligible commissions found for this period");
  }

  const byAffiliate = new Map<
    string,
    {
      affiliateId: string;
      commissions: typeof commissions;
      grossSales: number;
      commissionOwed: number;
    }
  >();

  for (const commission of commissions) {
    const entry = byAffiliate.get(commission.affiliateId) ?? {
      affiliateId: commission.affiliateId,
      commissions: [],
      grossSales: 0,
      commissionOwed: 0,
    };
    entry.commissions.push(commission);
    entry.grossSales += commission.orderAmount;
    entry.commissionOwed += commission.commissionAmount;
    byAffiliate.set(commission.affiliateId, entry);
  }

  const totalAmount = [...byAffiliate.values()].reduce(
    (sum, a) => sum + a.commissionOwed,
    0
  );

  const payout = await db.$transaction(async (tx) => {
    const created = await tx.affiliatePayout.create({
      data: {
        periodYear: year,
        periodMonth: month,
        status: "DRAFT",
        totalAmount,
      },
    });

    for (const entry of byAffiliate.values()) {
      for (const commission of entry.commissions) {
        await tx.affiliatePayoutItem.create({
          data: {
            payoutId: created.id,
            affiliateId: entry.affiliateId,
            commissionId: commission.id,
            grossSales: commission.orderAmount,
            commissionOwed: commission.commissionAmount,
            status: "DRAFT",
          },
        });
      }
    }

    return created;
  });

  return payout;
}

export async function markPayoutItemPaid(
  payoutItemId: string,
  paymentReference?: string
) {
  const item = await db.affiliatePayoutItem.findUnique({
    where: { id: payoutItemId },
    include: { commission: true, affiliate: true },
  });

  if (!item) {
    throw new Error("Payout item not found");
  }

  if (item.status === "PAID") {
    throw new Error("Payout item is already marked as paid");
  }

  const now = new Date();

  await db.$transaction(async (tx) => {
    await tx.affiliatePayoutItem.update({
      where: { id: payoutItemId },
      data: {
        status: "PAID",
        paidAt: now,
        paymentReference: paymentReference?.trim() || undefined,
      },
    });

    if (item.commission) {
      await tx.affiliateCommission.update({
        where: { id: item.commission.id },
        data: {
          status: "PAID",
          paidAt: now,
        },
      });

      await tx.affiliateAccount.update({
        where: { id: item.affiliateId },
        data: {
          pendingEarnings: { decrement: item.commissionOwed },
          paidEarnings: { increment: item.commissionOwed },
        },
      });
    }
  });

  return item;
}
